package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server
	Environment string
	Port        string
	APIBaseURL  string

	// Database
	DatabaseURL string

	// JWT
	JWTSecret    string
	JWTExpiresIn time.Duration

	// Stripe
	StripeSecretKey      string
	StripePublishableKey string
	StripeWebhookSecret  string

	// Email
	EmailFrom string
	SMTPHost  string
	SMTPPort  int
	SMTPUser  string
	SMTPPass  string

	// Company Info
	CompanyName  string
	CompanyEmail string
}

func Load() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	cfg := &Config{
		Environment:          getEnv("ENVIRONMENT", "development"),
		Port:                 getEnv("PORT", "8080"),
		APIBaseURL:           getEnv("API_BASE_URL", "http://localhost:8080"),
		DatabaseURL:          getEnv("DATABASE_URL", "sqlite://bizoe_store.db"),
		JWTSecret:            getEnv("JWT_SECRET", "your-secret-key-change-this-in-production"),
		StripeSecretKey:      getEnv("STRIPE_SECRET_KEY", ""),
		StripePublishableKey: getEnv("STRIPE_PUBLISHABLE_KEY", ""),
		StripeWebhookSecret:  getEnv("STRIPE_WEBHOOK_SECRET", ""),
		EmailFrom:            getEnv("EMAIL_FROM", "luotian@joy8899.com"),
		SMTPHost:             getEnv("SMTP_HOST", "localhost"),
		SMTPPort:             getEnvAsInt("SMTP_PORT", 587),
		SMTPUser:             getEnv("SMTP_USER", ""),
		SMTPPass:             getEnv("SMTP_PASS", ""),
		CompanyName:          getEnv("COMPANY_NAME", "BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED"),
		CompanyEmail:         getEnv("COMPANY_EMAIL", "luotian@joy8899.com"),
	}

	// Parse JWT expiration
	jwtExpiresIn := getEnv("JWT_EXPIRES_IN", "7d")
	if duration, err := parseDuration(jwtExpiresIn); err == nil {
		cfg.JWTExpiresIn = duration
	} else {
		cfg.JWTExpiresIn = 7 * 24 * time.Hour // Default to 7 days
	}

	return cfg
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(name string, defaultVal int) int {
	valueStr := getEnv(name, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}

func getEnvAsBool(name string, defaultVal bool) bool {
	valueStr := getEnv(name, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultVal
}

func parseDuration(s string) (time.Duration, error) {
	// Handle common duration formats
	switch s {
	case "1d":
		return 24 * time.Hour, nil
	case "7d":
		return 7 * 24 * time.Hour, nil
	case "30d":
		return 30 * 24 * time.Hour, nil
	default:
		return time.ParseDuration(s)
	}
}
