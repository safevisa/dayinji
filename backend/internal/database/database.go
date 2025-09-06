package database

import (
	"bizoe-3d-store/internal/models"
	"fmt"
	"log"
	"strings"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Initialize creates a new database connection
func Initialize(databaseURL string) (*gorm.DB, error) {
	// Configure GORM
	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	}

	var db *gorm.DB
	var err error

	// Check if it's SQLite or MySQL
	if strings.HasPrefix(databaseURL, "sqlite://") {
		// SQLite database
		dbPath := strings.TrimPrefix(databaseURL, "sqlite://")
		db, err = gorm.Open(sqlite.Open(dbPath), config)
	} else {
		// MySQL database
		db, err = gorm.Open(mysql.Open(databaseURL), config)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Configure connection pool
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB: %w", err)
	}

	// SetMaxIdleConns sets the maximum number of connections in the idle connection pool
	sqlDB.SetMaxIdleConns(10)

	// SetMaxOpenConns sets the maximum number of open connections to the database
	sqlDB.SetMaxOpenConns(100)

	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connection established successfully")
	return db, nil
}

// Migrate runs database migrations
func Migrate(db *gorm.DB) error {
	log.Println("Running database migrations...")

	// Auto-migrate all models
	err := db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
	)

	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	// Seed initial data
	if err := seedInitialData(db); err != nil {
		return fmt.Errorf("failed to seed initial data: %w", err)
	}

	log.Println("Database migrations completed successfully")
	return nil
}

// seedInitialData creates initial categories and sample products
func seedInitialData(db *gorm.DB) error {
	// Check if categories already exist
	var count int64
	db.Model(&models.Category{}).Count(&count)
	if count > 0 {
		log.Println("Initial data already exists, skipping seed")
		return nil
	}

	log.Println("Seeding initial data...")

	// Create categories
	categories := []models.Category{
		{
			Name:        "3D Printers",
			Slug:        "3d-printers",
			Description: "High-precision 3D printers for professional and hobbyist use",
			Image:       "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400",
		},
		{
			Name:        "Printing Materials",
			Slug:        "materials",
			Description: "Premium resins, filaments, and printing materials",
			Image:       "https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=400",
		},
		{
			Name:        "Post-Processing Equipment",
			Slug:        "equipment",
			Description: "Curing, washing, and finishing equipment",
			Image:       "https://images.unsplash.com/photo-1563089145-599997674d42?w=400",
		},
		{
			Name:        "3D Scanners",
			Slug:        "scanners",
			Description: "Professional 3D scanning solutions",
			Image:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
		},
	}

	for i := range categories {
		if err := db.Create(&categories[i]).Error; err != nil {
			return fmt.Errorf("failed to create category %s: %w", categories[i].Name, err)
		}
	}

	// Create sample products
	products := []models.Product{
		{
			Name:          "Phrozen Sonic Mighty Revo 16K",
			Description:   "Ultra-fine printing with no visible layer lines. Aerospace-grade aluminum structure with dual linear guides for stable and reliable performance. 30-minute preheating for consistent temperature printing quality. Smart alerts and remote monitoring for efficiency and peace of mind.",
			Price:         899.99,
			OriginalPrice: func() *float64 { p := 999.99; return &p }(),
			Currency:      "USD",
			CategoryID:    categories[0].ID,
			Images: []string{
				"https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500",
				"https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=500",
			},
			Specifications: map[string]string{
				"Build Volume":     "218.88 × 123 × 235 mm",
				"Layer Resolution": "0.01-0.3mm",
				"Print Speed":      "30-50mm/h",
				"Screen":           "16K Mono LCD",
				"Light Source":     "UV LED Array",
			},
			InStock:       true,
			StockQuantity: 15,
			Featured:      true,
		},
		{
			Name:        "Phrozen Arco FDM 3D Printer Set",
			Description: "Large, fast, and stable - 300×300×300mm build volume with up to 1,000mm/s speed, reliable performance. Multi-color creativity with Chroma Kit 4-color printing + intelligent material drying system, 50% faster switching. Special enclosure with five-sided tempered glass module maintains quiet, constant temperature for more stable quality.",
			Price:       1299.99,
			Currency:    "USD",
			CategoryID:  categories[0].ID,
			Images: []string{
				"https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=500",
				"https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500",
			},
			Specifications: map[string]string{
				"Build Volume": "300 × 300 × 300 mm",
				"Print Speed":  "Up to 1,000mm/s",
				"Filament":     "1.75mm",
				"Nozzle":       "0.4mm",
				"Bed Leveling": "Auto",
			},
			InStock:       true,
			StockQuantity: 8,
			Featured:      true,
		},
		{
			Name:        "Premium 3D Printing Resin - Clear",
			Description: "High-quality resin for detailed 3D prints with excellent surface finish. Low odor formula with high precision for intricate models and prototypes.",
			Price:       29.99,
			Currency:    "USD",
			CategoryID:  categories[1].ID,
			Images: []string{
				"https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=500",
			},
			Specifications: map[string]string{
				"Volume":      "1L",
				"Color":       "Clear",
				"Curing Time": "8-12 seconds",
				"Viscosity":   "200-300 cPs",
				"Shore D":     "82-86",
			},
			InStock:       true,
			StockQuantity: 50,
			Featured:      false,
		},
		{
			Name:          "Professional Curing & Washing Station",
			Description:   "UV curing and washing station for post-processing 3D printed parts. Dual-function design with separate curing and washing chambers for optimal results.",
			Price:         199.99,
			OriginalPrice: func() *float64 { p := 249.99; return &p }(),
			Currency:      "USD",
			CategoryID:    categories[2].ID,
			Images: []string{
				"https://images.unsplash.com/photo-1563089145-599997674d42?w=500",
			},
			Specifications: map[string]string{
				"UV Power":       "40W",
				"Washing Volume": "2L",
				"Curing Volume":  "1.5L",
				"Timer":          "1-99 minutes",
				"Turntable":      "360° rotation",
			},
			InStock:       true,
			StockQuantity: 12,
			Featured:      true,
		},
		{
			Name:        "High-Temp PLA+ Filament",
			Description: "Premium PLA+ filament with enhanced strength and temperature resistance. Perfect for functional prints and prototypes.",
			Price:       24.99,
			Currency:    "USD",
			CategoryID:  categories[1].ID,
			Images: []string{
				"https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=500",
			},
			Specifications: map[string]string{
				"Diameter":   "1.75mm",
				"Weight":     "1kg",
				"Color":      "Natural White",
				"Print Temp": "210-230°C",
				"Bed Temp":   "60-70°C",
			},
			InStock:       true,
			StockQuantity: 30,
			Featured:      false,
		},
		{
			Name:        "Precision 3D Scanner Pro",
			Description: "Professional handheld 3D scanner with high accuracy and fast scanning speed. Perfect for reverse engineering and quality control.",
			Price:       1999.99,
			Currency:    "USD",
			CategoryID:  categories[3].ID,
			Images: []string{
				"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
			},
			Specifications: map[string]string{
				"Accuracy":      "0.1mm",
				"Resolution":    "0.2mm",
				"Scan Speed":    "1.5M points/s",
				"Working Range": "300-1200mm",
				"Output Format": "STL, OBJ, PLY",
			},
			InStock:       true,
			StockQuantity: 5,
			Featured:      false,
		},
	}

	for i := range products {
		if err := db.Create(&products[i]).Error; err != nil {
			return fmt.Errorf("failed to create product %s: %w", products[i].Name, err)
		}
	}

	log.Println("Initial data seeding completed successfully")
	return nil
}
