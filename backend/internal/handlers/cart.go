package handlers

import (
	"bizoe-3d-store/internal/middleware"
	"bizoe-3d-store/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CartHandler struct {
	db *gorm.DB
}

type AddToCartRequest struct {
	ProductID string `json:"productId" binding:"required"`
	Quantity  int    `json:"quantity" binding:"required,min=1"`
}

type UpdateCartRequest struct {
	ProductID string `json:"productId" binding:"required"`
	Quantity  int    `json:"quantity" binding:"required,min=0"`
}

func NewCartHandler(db *gorm.DB) *CartHandler {
	return &CartHandler{db: db}
}

// GetCart returns the user's cart
func (h *CartHandler) GetCart(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var cart models.Cart
	err := h.db.Preload("Items.Product.Category").
		Where("user_id = ?", userID).
		First(&cart).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create empty cart
			cart = models.Cart{
				UserID:      &userID,
				TotalAmount: 0,
				TotalItems:  0,
				Items:       []models.CartItem{},
			}
			h.db.Create(&cart)
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"message": "Failed to fetch cart",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    cart,
	})
}

// AddToCart adds an item to the user's cart
func (h *CartHandler) AddToCart(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Verify product exists and is in stock
	var product models.Product
	if err := h.db.First(&product, "id = ?", req.ProductID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Product not found",
				"message": "The requested product does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch product",
		})
		return
	}

	if !product.InStock || product.StockQuantity < req.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Insufficient stock",
			"message": "Product is out of stock or insufficient quantity available",
		})
		return
	}

	// Get or create cart
	var cart models.Cart
	err := h.db.Where("user_id = ?", userID).First(&cart).Error
	if err == gorm.ErrRecordNotFound {
		cart = models.Cart{
			UserID:      &userID,
			TotalAmount: 0,
			TotalItems:  0,
		}
		h.db.Create(&cart)
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch cart",
		})
		return
	}

	// Check if item already exists in cart
	var existingItem models.CartItem
	err = h.db.Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).First(&existingItem).Error
	if err == nil {
		// Update existing item quantity
		newQuantity := existingItem.Quantity + req.Quantity
		if newQuantity > product.StockQuantity {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Insufficient stock",
				"message": "Cannot add more items than available in stock",
			})
			return
		}

		existingItem.Quantity = newQuantity
		h.db.Save(&existingItem)
	} else if err == gorm.ErrRecordNotFound {
		// Create new cart item
		newItem := models.CartItem{
			CartID:    cart.ID,
			ProductID: req.ProductID,
			Quantity:  req.Quantity,
			Price:     product.Price,
		}
		h.db.Create(&newItem)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to check existing cart item",
		})
		return
	}

	// Update cart totals
	h.updateCartTotals(&cart)

	// Return updated cart
	h.db.Preload("Items.Product.Category").First(&cart, "id = ?", cart.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Item added to cart successfully",
		"data":    cart,
	})
}

// UpdateCart updates the quantity of an item in the cart
func (h *CartHandler) UpdateCart(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var req UpdateCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Get user's cart
	var cart models.Cart
	if err := h.db.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Cart not found",
				"message": "User cart does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch cart",
		})
		return
	}

	// Find cart item
	var cartItem models.CartItem
	if err := h.db.Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).First(&cartItem).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Item not found",
				"message": "Item not found in cart",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to find cart item",
		})
		return
	}

	// If quantity is 0, remove item
	if req.Quantity == 0 {
		h.db.Delete(&cartItem)
	} else {
		// Verify stock availability
		var product models.Product
		if err := h.db.First(&product, "id = ?", req.ProductID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"message": "Failed to fetch product",
			})
			return
		}

		if !product.InStock || product.StockQuantity < req.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Insufficient stock",
				"message": "Requested quantity exceeds available stock",
			})
			return
		}

		// Update quantity
		cartItem.Quantity = req.Quantity
		h.db.Save(&cartItem)
	}

	// Update cart totals
	h.updateCartTotals(&cart)

	// Return updated cart
	h.db.Preload("Items.Product.Category").First(&cart, "id = ?", cart.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Cart updated successfully",
		"data":    cart,
	})
}

// RemoveFromCart removes an item from the cart
func (h *CartHandler) RemoveFromCart(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	productID := c.Param("productId")

	// Get user's cart
	var cart models.Cart
	if err := h.db.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Cart not found",
				"message": "User cart does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch cart",
		})
		return
	}

	// Find and delete cart item
	var cartItem models.CartItem
	if err := h.db.Where("cart_id = ? AND product_id = ?", cart.ID, productID).First(&cartItem).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Item not found",
				"message": "Item not found in cart",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to find cart item",
		})
		return
	}

	if err := h.db.Delete(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to remove item from cart",
		})
		return
	}

	// Update cart totals
	h.updateCartTotals(&cart)

	// Return updated cart
	h.db.Preload("Items.Product.Category").First(&cart, "id = ?", cart.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Item removed from cart successfully",
		"data":    cart,
	})
}

// ClearCart removes all items from the cart
func (h *CartHandler) ClearCart(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	// Get user's cart
	var cart models.Cart
	if err := h.db.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Cart not found",
				"message": "User cart does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch cart",
		})
		return
	}

	// Delete all cart items
	if err := h.db.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to clear cart",
		})
		return
	}

	// Update cart totals
	cart.TotalAmount = 0
	cart.TotalItems = 0
	h.db.Save(&cart)

	// Return empty cart
	cart.Items = []models.CartItem{}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Cart cleared successfully",
		"data":    cart,
	})
}

// updateCartTotals recalculates and updates cart totals
func (h *CartHandler) updateCartTotals(cart *models.Cart) {
	var items []models.CartItem
	h.db.Where("cart_id = ?", cart.ID).Find(&items)

	var totalAmount float64
	var totalItems int

	for _, item := range items {
		totalAmount += item.Price * float64(item.Quantity)
		totalItems += item.Quantity
	}

	cart.TotalAmount = totalAmount
	cart.TotalItems = totalItems

	h.db.Save(cart)
}
