package handlers

import (
	"bizoe-3d-store/internal/config"
	"bizoe-3d-store/internal/middleware"
	"bizoe-3d-store/internal/models"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/paymentintent"
	"gorm.io/gorm"
)

type OrderHandler struct {
	db     *gorm.DB
	config *config.Config
}

type CreateOrderRequest struct {
	ShippingAddress models.Address `json:"shippingAddress" binding:"required"`
	BillingAddress  models.Address `json:"billingAddress" binding:"required"`
	PaymentMethod   string         `json:"paymentMethod" binding:"required"`
}

type CreatePaymentIntentRequest struct {
	OrderID string `json:"orderId" binding:"required"`
}

type ConfirmPaymentRequest struct {
	PaymentIntentID string `json:"paymentIntentId" binding:"required"`
	OrderID         string `json:"orderId" binding:"required"`
}

func NewOrderHandler(db *gorm.DB, config *config.Config) *OrderHandler {
	// Set Stripe API key
	stripe.Key = config.StripeSecretKey

	return &OrderHandler{
		db:     db,
		config: config,
	}
}

// CreateOrder creates a new order from the user's cart
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Get user's cart
	var cart models.Cart
	if err := h.db.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Cart not found",
				"message": "User cart is empty or does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch cart",
		})
		return
	}

	if len(cart.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Empty cart",
			"message": "Cannot create order from empty cart",
		})
		return
	}

	// Validate stock availability
	for _, item := range cart.Items {
		if !item.Product.InStock || item.Product.StockQuantity < item.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Insufficient stock",
				"message": fmt.Sprintf("Product %s is out of stock or insufficient quantity available", item.Product.Name),
			})
			return
		}
	}

	// Calculate order totals
	subtotal := cart.TotalAmount
	tax := subtotal * 0.08 // 8% tax rate
	shipping := 0.0
	if subtotal < 100 { // Free shipping over $100
		shipping = 9.99
	}
	total := subtotal + tax + shipping

	// Start transaction
	tx := h.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Create order
	order := models.Order{
		UserID:          userID,
		Status:          models.OrderStatusPending,
		ShippingAddress: req.ShippingAddress,
		BillingAddress:  req.BillingAddress,
		PaymentMethod:   req.PaymentMethod,
		PaymentStatus:   models.PaymentStatusPending,
		Subtotal:        subtotal,
		Tax:             tax,
		Shipping:        shipping,
		Total:           total,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to create order",
		})
		return
	}

	// Create order items
	for _, cartItem := range cart.Items {
		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: cartItem.ProductID,
			Quantity:  cartItem.Quantity,
			Price:     cartItem.Price,
			Total:     cartItem.Price * float64(cartItem.Quantity),
		}

		if err := tx.Create(&orderItem).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"message": "Failed to create order item",
			})
			return
		}

		// Update product stock
		if err := tx.Model(&cartItem.Product).
			Update("stock_quantity", gorm.Expr("stock_quantity - ?", cartItem.Quantity)).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"message": "Failed to update product stock",
			})
			return
		}
	}

	// Clear cart
	if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to clear cart",
		})
		return
	}

	// Update cart totals
	cart.TotalAmount = 0
	cart.TotalItems = 0
	if err := tx.Save(&cart).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to update cart",
		})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to commit order transaction",
		})
		return
	}

	// Load complete order with relations
	h.db.Preload("Items.Product").Preload("User").First(&order, "id = ?", order.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Order created successfully",
		"data":    order,
	})
}

// GetOrder returns a specific order
func (h *OrderHandler) GetOrder(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	orderID := c.Param("id")

	var order models.Order
	query := h.db.Preload("Items.Product.Category").Preload("User")

	// Non-admin users can only see their own orders
	if !middleware.IsAdmin(c) {
		query = query.Where("user_id = ?", userID)
	}

	if err := query.First(&order, "id = ?", orderID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Order not found",
				"message": "The requested order does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch order",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    order,
	})
}

// GetAllOrders returns all orders (admin only)
func (h *OrderHandler) GetAllOrders(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	query := h.db.Preload("Items.Product").Preload("User").Model(&models.Order{})

	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Count total records
	var total int64
	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to count orders",
		})
		return
	}

	// Get orders with pagination
	offset := (page - 1) * limit
	var orders []models.Order
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch orders",
		})
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    orders,
		"pagination": gin.H{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}

// UpdateOrderStatus updates the status of an order (admin only)
func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	orderID := c.Param("id")

	var updateData struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Validate status
	validStatuses := []string{
		string(models.OrderStatusPending),
		string(models.OrderStatusConfirmed),
		string(models.OrderStatusProcessing),
		string(models.OrderStatusShipped),
		string(models.OrderStatusDelivered),
		string(models.OrderStatusCancelled),
	}

	isValid := false
	for _, status := range validStatuses {
		if status == updateData.Status {
			isValid = true
			break
		}
	}

	if !isValid {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid status",
			"message": "Invalid order status provided",
		})
		return
	}

	// Update order
	var order models.Order
	if err := h.db.First(&order, "id = ?", orderID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Order not found",
				"message": "The requested order does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to find order",
		})
		return
	}

	order.Status = models.OrderStatus(updateData.Status)
	if err := h.db.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to update order status",
		})
		return
	}

	// Load updated order with relations
	h.db.Preload("Items.Product").Preload("User").First(&order, "id = ?", order.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Order status updated successfully",
		"data":    order,
	})
}

// CancelOrder cancels an order
func (h *OrderHandler) CancelOrder(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	orderID := c.Param("id")

	var order models.Order
	query := h.db.Preload("Items.Product")

	// Non-admin users can only cancel their own orders
	if !middleware.IsAdmin(c) {
		query = query.Where("user_id = ?", userID)
	}

	if err := query.First(&order, "id = ?", orderID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Order not found",
				"message": "The requested order does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch order",
		})
		return
	}

	// Check if order can be cancelled
	if order.Status == models.OrderStatusShipped || order.Status == models.OrderStatusDelivered {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Cannot cancel order",
			"message": "Order has already been shipped or delivered",
		})
		return
	}

	if order.Status == models.OrderStatusCancelled {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Order already cancelled",
			"message": "This order has already been cancelled",
		})
		return
	}

	// Start transaction
	tx := h.db.Begin()

	// Restore product stock
	for _, item := range order.Items {
		if err := tx.Model(&item.Product).
			Update("stock_quantity", gorm.Expr("stock_quantity + ?", item.Quantity)).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Database error",
				"message": "Failed to restore product stock",
			})
			return
		}
	}

	// Update order status
	order.Status = models.OrderStatusCancelled
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to cancel order",
		})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to commit order cancellation",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Order cancelled successfully",
		"data":    order,
	})
}

// CreatePaymentIntent creates a Stripe PaymentIntent for an order
func (h *OrderHandler) CreatePaymentIntent(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var req CreatePaymentIntentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Get order
	var order models.Order
	if err := h.db.Where("user_id = ? AND id = ?", userID, req.OrderID).First(&order).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Order not found",
				"message": "The requested order does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch order",
		})
		return
	}

	// Check if order is payable
	if order.PaymentStatus == models.PaymentStatusPaid {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Order already paid",
			"message": "This order has already been paid",
		})
		return
	}

	// Create Stripe PaymentIntent
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(int64(order.Total * 100)), // Convert to cents
		Currency: stripe.String("usd"),
		Metadata: map[string]string{
			"order_id": order.ID,
			"user_id":  userID,
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Payment error",
			"message": "Failed to create payment intent",
		})
		return
	}

	// Update order with payment intent ID
	order.PaymentIntentID = pi.ID
	h.db.Save(&order)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"clientSecret":    pi.ClientSecret,
			"paymentIntentId": pi.ID,
		},
	})
}

// ConfirmPayment confirms a payment and updates order status
func (h *OrderHandler) ConfirmPayment(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var req ConfirmPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Get order
	var order models.Order
	if err := h.db.Where("user_id = ? AND id = ?", userID, req.OrderID).First(&order).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Order not found",
				"message": "The requested order does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch order",
		})
		return
	}

	// Verify PaymentIntent with Stripe
	pi, err := paymentintent.Get(req.PaymentIntentID, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Payment verification failed",
			"message": "Failed to verify payment with Stripe",
		})
		return
	}

	if pi.Status != "succeeded" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Payment not completed",
			"message": "Payment has not been completed successfully",
		})
		return
	}

	// Update order payment status
	order.PaymentStatus = models.PaymentStatusPaid
	order.Status = models.OrderStatusConfirmed
	if err := h.db.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to update order payment status",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Payment confirmed successfully",
		"data":    order,
	})
}
