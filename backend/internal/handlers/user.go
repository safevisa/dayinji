package handlers

import (
	"bizoe-3d-store/internal/middleware"
	"bizoe-3d-store/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserHandler struct {
	db *gorm.DB
}

type UpdateProfileRequest struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" binding:"required,min=6"`
	NewPassword     string `json:"newPassword" binding:"required,min=6"`
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{db: db}
}

// GetProfile returns the current user's profile
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var user models.User
	if err := h.db.First(&user, "id = ?", userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "User not found",
				"message": "User profile not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch user profile",
		})
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    user,
	})
}

// UpdateProfile updates the current user's profile
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Get current user
	var user models.User
	if err := h.db.First(&user, "id = ?", userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "User not found",
				"message": "User profile not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch user profile",
		})
		return
	}

	// Update user fields
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Phone = req.Phone
	user.Address = req.Address

	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to update user profile",
		})
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile updated successfully",
		"data":    user,
	})
}

// ChangePassword changes the user's password
func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// Get current user
	var user models.User
	if err := h.db.First(&user, "id = ?", userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "User not found",
				"message": "User profile not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch user profile",
		})
		return
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid password",
			"message": "Current password is incorrect",
		})
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to hash new password",
		})
		return
	}

	// Update password
	user.Password = string(hashedPassword)
	if err := h.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to update password",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password changed successfully",
	})
}

// GetUserOrders returns the current user's orders
func (h *UserHandler) GetUserOrders(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	status := c.Query("status")

	query := h.db.Preload("Items.Product.Category").Where("user_id = ?", userID)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Count total records
	var total int64
	if err := query.Model(&models.Order{}).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to count user orders",
		})
		return
	}

	// Get orders with pagination
	offset := (page - 1) * limit
	var orders []models.Order
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to fetch user orders",
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

// GetUserStats returns statistics about the user's account
func (h *UserHandler) GetUserStats(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	// Count total orders
	var totalOrders int64
	h.db.Model(&models.Order{}).Where("user_id = ?", userID).Count(&totalOrders)

	// Count orders by status
	var pendingOrders, completedOrders, cancelledOrders int64
	h.db.Model(&models.Order{}).Where("user_id = ? AND status = ?", userID, models.OrderStatusPending).Count(&pendingOrders)
	h.db.Model(&models.Order{}).Where("user_id = ? AND status = ?", userID, models.OrderStatusDelivered).Count(&completedOrders)
	h.db.Model(&models.Order{}).Where("user_id = ? AND status = ?", userID, models.OrderStatusCancelled).Count(&cancelledOrders)

	// Calculate total spent
	var totalSpent float64
	h.db.Model(&models.Order{}).
		Where("user_id = ? AND payment_status = ?", userID, models.PaymentStatusPaid).
		Select("COALESCE(SUM(total), 0)").
		Scan(&totalSpent)

	// Get cart item count
	var cartItems int64
	h.db.Model(&models.CartItem{}).
		Joins("JOIN carts ON cart_items.cart_id = carts.id").
		Where("carts.user_id = ?", userID).
		Count(&cartItems)

	stats := gin.H{
		"totalOrders":     totalOrders,
		"pendingOrders":   pendingOrders,
		"completedOrders": completedOrders,
		"cancelledOrders": cancelledOrders,
		"totalSpent":      totalSpent,
		"cartItems":       cartItems,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}

// DeleteAccount soft deletes the user's account
func (h *UserHandler) DeleteAccount(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Unauthorized",
			"message": "User not authenticated",
		})
		return
	}

	// Check for pending orders
	var pendingOrders int64
	h.db.Model(&models.Order{}).
		Where("user_id = ? AND status IN ?", userID, []string{
			string(models.OrderStatusPending),
			string(models.OrderStatusConfirmed),
			string(models.OrderStatusProcessing),
		}).
		Count(&pendingOrders)

	if pendingOrders > 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Cannot delete account",
			"message": "Account cannot be deleted while there are pending orders",
		})
		return
	}

	// Start transaction
	tx := h.db.Begin()

	// Clear cart
	if err := tx.Where("user_id = ?", userID).Delete(&models.Cart{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to clear user cart",
		})
		return
	}

	// Anonymize orders (keep for record keeping but remove personal info)
	if err := tx.Model(&models.Order{}).Where("user_id = ?", userID).Updates(map[string]interface{}{
		"shipping_first_name": "Deleted",
		"shipping_last_name":  "User",
		"shipping_email":      "deleted@deleted.com",
		"shipping_phone":      "0000000000",
		"billing_first_name":  "Deleted",
		"billing_last_name":   "User",
		"billing_email":       "deleted@deleted.com",
		"billing_phone":       "0000000000",
	}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to anonymize user orders",
		})
		return
	}

	// Delete user
	if err := tx.Delete(&models.User{}, "id = ?", userID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to delete user account",
		})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Database error",
			"message": "Failed to complete account deletion",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Account deleted successfully",
	})
}
