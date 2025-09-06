package main

import (
	"bizoe-3d-store/internal/config"
	"bizoe-3d-store/internal/database"
	"bizoe-3d-store/internal/handlers"
	"bizoe-3d-store/internal/middleware"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate database tables
	if err := database.Migrate(db); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Initialize Gin router
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://your-domain.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cache-Control"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db, cfg)
	productHandler := handlers.NewProductHandler(db)
	cartHandler := handlers.NewCartHandler(db)
	orderHandler := handlers.NewOrderHandler(db, cfg)
	userHandler := handlers.NewUserHandler(db)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "BIZOE 3D Store API is running",
			"version": "1.0.0",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
			auth.POST("/logout", middleware.AuthRequired(cfg.JWTSecret), authHandler.Logout)
		}

		// Product routes
		products := api.Group("/products")
		{
			products.GET("", productHandler.GetProducts)
			products.GET("/:id", productHandler.GetProduct)
			products.GET("/category/:slug", productHandler.GetProductsByCategory)
			products.GET("/search", productHandler.SearchProducts)
			products.GET("/featured", productHandler.GetFeaturedProducts)
		}

		// Category routes
		categories := api.Group("/categories")
		{
			categories.GET("", productHandler.GetCategories)
			categories.GET("/:id", productHandler.GetCategory)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(middleware.AuthRequired(cfg.JWTSecret))
		{
			// User routes
			user := protected.Group("/user")
			{
				user.GET("/profile", userHandler.GetProfile)
				user.PUT("/profile", userHandler.UpdateProfile)
				user.GET("/orders", userHandler.GetUserOrders)
			}

			// Cart routes
			cart := protected.Group("/cart")
			{
				cart.GET("", cartHandler.GetCart)
				cart.POST("/add", cartHandler.AddToCart)
				cart.PUT("/update", cartHandler.UpdateCart)
				cart.DELETE("/remove/:productId", cartHandler.RemoveFromCart)
				cart.DELETE("/clear", cartHandler.ClearCart)
			}

			// Order routes
			orders := protected.Group("/orders")
			{
				orders.POST("", orderHandler.CreateOrder)
				orders.GET("/:id", orderHandler.GetOrder)
				orders.PUT("/:id/cancel", orderHandler.CancelOrder)
			}

			// Payment routes
			payment := protected.Group("/payment")
			{
				payment.POST("/create-intent", orderHandler.CreatePaymentIntent)
				payment.POST("/confirm", orderHandler.ConfirmPayment)
			}
		}

		// Admin routes (TODO: Add admin middleware)
		admin := api.Group("/admin")
		admin.Use(middleware.AuthRequired(cfg.JWTSecret))
		{
			// Product management
			admin.POST("/products", productHandler.CreateProduct)
			admin.PUT("/products/:id", productHandler.UpdateProduct)
			admin.DELETE("/products/:id", productHandler.DeleteProduct)

			// Category management
			admin.POST("/categories", productHandler.CreateCategory)
			admin.PUT("/categories/:id", productHandler.UpdateCategory)
			admin.DELETE("/categories/:id", productHandler.DeleteCategory)

			// Order management
			admin.GET("/orders", orderHandler.GetAllOrders)
			admin.PUT("/orders/:id/status", orderHandler.UpdateOrderStatus)
		}
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	log.Printf("Environment: %s", cfg.Environment)

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
