package handlers

import (
	"bizoe-3d-store/internal/models"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProductHandler struct {
	db *gorm.DB
}

type ProductQuery struct {
	Page     int    `form:"page,default=1"`
	Limit    int    `form:"limit,default=12"`
	Category string `form:"category"`
	Search   string `form:"search"`
	MinPrice string `form:"minPrice"`
	MaxPrice string `form:"maxPrice"`
	InStock  string `form:"inStock"`
	SortBy   string `form:"sortBy,default=created_desc"`
}

type PaginationResponse struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"totalPages"`
}

func NewProductHandler(db *gorm.DB) *ProductHandler {
	return &ProductHandler{db: db}
}

// GetProducts returns a paginated list of products with filtering
func (h *ProductHandler) GetProducts(c *gin.Context) {
	var query ProductQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid query parameters",
			"message": err.Error(),
		})
		return
	}

	// Build base query
	db := h.db.Model(&models.Product{}).Preload("Category")

	// Apply filters
	if query.Category != "" {
		db = db.Joins("JOIN categories ON products.category_id = categories.id").
			Where("categories.slug = ?", query.Category)
	}

	if query.Search != "" {
		searchTerm := "%" + strings.ToLower(query.Search) + "%"
		db = db.Where("LOWER(products.name) LIKE ? OR LOWER(products.description) LIKE ?", searchTerm, searchTerm)
	}

	if query.MinPrice != "" {
		if minPrice, err := strconv.ParseFloat(query.MinPrice, 64); err == nil {
			db = db.Where("products.price >= ?", minPrice)
		}
	}

	if query.MaxPrice != "" {
		if maxPrice, err := strconv.ParseFloat(query.MaxPrice, 64); err == nil {
			db = db.Where("products.price <= ?", maxPrice)
		}
	}

	if query.InStock == "true" {
		db = db.Where("products.in_stock = ? AND products.stock_quantity > 0", true)
	}

	// Apply sorting
	switch query.SortBy {
	case "price_asc":
		db = db.Order("products.price ASC")
	case "price_desc":
		db = db.Order("products.price DESC")
	case "name_asc":
		db = db.Order("products.name ASC")
	case "name_desc":
		db = db.Order("products.name DESC")
	case "newest":
		db = db.Order("products.created_at DESC")
	default:
		db = db.Order("products.created_at DESC")
	}

	// Count total records
	var total int64
	countQuery := db
	if err := countQuery.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to count products",
		})
		return
	}

	// Calculate pagination
	offset := (query.Page - 1) * query.Limit
	totalPages := int((total + int64(query.Limit) - 1) / int64(query.Limit))

	// Get products
	var products []models.Product
	if err := db.Offset(offset).Limit(query.Limit).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch products",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    products,
		"pagination": PaginationResponse{
			Page:       query.Page,
			Limit:      query.Limit,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

// GetProduct returns a single product by ID
func (h *ProductHandler) GetProduct(c *gin.Context) {
	productID := c.Param("id")

	var product models.Product
	if err := h.db.Preload("Category").First(&product, "id = ?", productID).Error; err != nil {
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

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    product,
	})
}

// GetProductsByCategory returns products for a specific category
func (h *ProductHandler) GetProductsByCategory(c *gin.Context) {
	categorySlug := c.Param("slug")

	// First verify the category exists
	var category models.Category
	if err := h.db.Where("slug = ?", categorySlug).First(&category).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Category not found",
				"message": "The requested category does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch category",
		})
		return
	}

	// Get products in this category
	var products []models.Product
	if err := h.db.Preload("Category").Where("category_id = ?", category.ID).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch products",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"data":     products,
		"category": category,
	})
}

// SearchProducts performs full-text search on products
func (h *ProductHandler) SearchProducts(c *gin.Context) {
	searchTerm := c.Query("q")
	if searchTerm == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Missing search query",
			"message": "Search query parameter 'q' is required",
		})
		return
	}

	searchPattern := "%" + strings.ToLower(searchTerm) + "%"

	var products []models.Product
	if err := h.db.Preload("Category").
		Where("LOWER(name) LIKE ? OR LOWER(description) LIKE ?", searchPattern, searchPattern).
		Order("featured DESC, created_at DESC").
		Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to search products",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    products,
		"query":   searchTerm,
		"count":   len(products),
	})
}

// GetFeaturedProducts returns featured products
func (h *ProductHandler) GetFeaturedProducts(c *gin.Context) {
	var products []models.Product
	if err := h.db.Preload("Category").
		Where("featured = ?", true).
		Order("created_at DESC").
		Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch featured products",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    products,
	})
}

// GetCategories returns all categories
func (h *ProductHandler) GetCategories(c *gin.Context) {
	var categories []models.Category

	// Get categories with product count
	if err := h.db.Preload("Children").Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch categories",
		})
		return
	}

	// Add product count for each category
	for i := range categories {
		var count int64
		h.db.Model(&models.Product{}).Where("category_id = ?", categories[i].ID).Count(&count)
		categories[i].ProductCount = int(count)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categories,
	})
}

// GetCategory returns a single category by ID
func (h *ProductHandler) GetCategory(c *gin.Context) {
	categoryID := c.Param("id")

	var category models.Category
	if err := h.db.Preload("Children").First(&category, "id = ?", categoryID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Category not found",
				"message": "The requested category does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch category",
		})
		return
	}

	// Add product count
	var count int64
	h.db.Model(&models.Product{}).Where("category_id = ?", category.ID).Count(&count)
	category.ProductCount = int(count)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    category,
	})
}

// Admin endpoints for product management

// CreateProduct creates a new product (admin only)
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Verify category exists
	var category models.Category
	if err := h.db.First(&category, "id = ?", product.CategoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid category",
			"message": "The specified category does not exist",
		})
		return
	}

	if err := h.db.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to create product",
		})
		return
	}

	// Load the category relation
	h.db.Preload("Category").First(&product, "id = ?", product.ID)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Product created successfully",
		"data":    product,
	})
}

// UpdateProduct updates an existing product (admin only)
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	productID := c.Param("id")

	var product models.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Product not found",
				"message": "The requested product does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to find product",
		})
		return
	}

	var updateData models.Product
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Verify category if being updated
	if updateData.CategoryID != "" {
		var category models.Category
		if err := h.db.First(&category, "id = ?", updateData.CategoryID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid category",
				"message": "The specified category does not exist",
			})
			return
		}
	}

	if err := h.db.Model(&product).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to update product",
		})
		return
	}

	// Load the updated product with relations
	h.db.Preload("Category").First(&product, "id = ?", product.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Product updated successfully",
		"data":    product,
	})
}

// DeleteProduct deletes a product (admin only)
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	productID := c.Param("id")

	var product models.Product
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Product not found",
				"message": "The requested product does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to find product",
		})
		return
	}

	if err := h.db.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to delete product",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Product deleted successfully",
	})
}

// CreateCategory creates a new category (admin only)
func (h *ProductHandler) CreateCategory(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	if err := h.db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to create category",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Category created successfully",
		"data":    category,
	})
}

// UpdateCategory updates an existing category (admin only)
func (h *ProductHandler) UpdateCategory(c *gin.Context) {
	categoryID := c.Param("id")

	var category models.Category
	if err := h.db.First(&category, "id = ?", categoryID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Category not found",
				"message": "The requested category does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to find category",
		})
		return
	}

	var updateData models.Category
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	if err := h.db.Model(&category).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to update category",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Category updated successfully",
		"data":    category,
	})
}

// DeleteCategory deletes a category (admin only)
func (h *ProductHandler) DeleteCategory(c *gin.Context) {
	categoryID := c.Param("id")

	// Check if category has products
	var productCount int64
	if err := h.db.Model(&models.Product{}).Where("category_id = ?", categoryID).Count(&productCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to check category products",
		})
		return
	}

	if productCount > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Category has products",
			"message": "Cannot delete category that contains products",
		})
		return
	}

	var category models.Category
	if err := h.db.First(&category, "id = ?", categoryID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Category not found",
				"message": "The requested category does not exist",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to find category",
		})
		return
	}

	if err := h.db.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to delete category",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Category deleted successfully",
	})
}
