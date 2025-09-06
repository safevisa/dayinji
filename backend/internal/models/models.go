package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	Password  string    `json:"-" gorm:"not null"`
	FirstName string    `json:"firstName" gorm:"not null"`
	LastName  string    `json:"lastName" gorm:"not null"`
	Phone     string    `json:"phone"`
	Address   string    `json:"address"`
	IsAdmin   bool      `json:"isAdmin" gorm:"default:false"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	// Relationships
	Orders []Order `json:"orders,omitempty"`
	Cart   *Cart   `json:"cart,omitempty"`
}

// BeforeCreate generates UUID for new users
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}

// Category represents a product category
type Category struct {
	ID          string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Name        string    `json:"name" gorm:"not null"`
	Slug        string    `json:"slug" gorm:"uniqueIndex;not null"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	ParentID    *string   `json:"parentId" gorm:"type:varchar(36)"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`

	// Relationships
	Products     []Product  `json:"products,omitempty"`
	Parent       *Category  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Children     []Category `json:"children,omitempty" gorm:"foreignKey:ParentID"`
	ProductCount int        `json:"productCount" gorm:"-"` // Not stored in DB, calculated dynamically
}

func (c *Category) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	return nil
}

// Product represents a product in the store
type Product struct {
	ID             string            `json:"id" gorm:"primaryKey;type:varchar(36)"`
	Name           string            `json:"name" gorm:"not null"`
	Description    string            `json:"description" gorm:"type:text"`
	Price          float64           `json:"price" gorm:"not null"`
	OriginalPrice  *float64          `json:"originalPrice"`
	Currency       string            `json:"currency" gorm:"default:'USD'"`
	CategoryID     string            `json:"categoryId" gorm:"type:varchar(36);not null"`
	Images         []string          `json:"images" gorm:"serializer:json"`
	Specifications map[string]string `json:"specifications" gorm:"serializer:json"`
	InStock        bool              `json:"inStock" gorm:"default:true"`
	StockQuantity  int               `json:"stockQuantity" gorm:"default:0"`
	Featured       bool              `json:"featured" gorm:"default:false"`
	CreatedAt      time.Time         `json:"createdAt"`
	UpdatedAt      time.Time         `json:"updatedAt"`

	// Relationships
	Category   Category    `json:"category" gorm:"foreignKey:CategoryID"`
	CartItems  []CartItem  `json:"cartItems,omitempty"`
	OrderItems []OrderItem `json:"orderItems,omitempty"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	return nil
}

// Cart represents a shopping cart
type Cart struct {
	ID          string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	UserID      *string   `json:"userId" gorm:"type:varchar(36)"`
	SessionID   string    `json:"sessionId" gorm:"index"`
	TotalAmount float64   `json:"totalAmount" gorm:"default:0"`
	TotalItems  int       `json:"totalItems" gorm:"default:0"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`

	// Relationships
	User  *User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Items []CartItem `json:"items"`
}

func (c *Cart) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	return nil
}

// CartItem represents an item in the shopping cart
type CartItem struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	CartID    string    `json:"cartId" gorm:"type:varchar(36);not null"`
	ProductID string    `json:"productId" gorm:"type:varchar(36);not null"`
	Quantity  int       `json:"quantity" gorm:"not null;default:1"`
	Price     float64   `json:"price" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	// Relationships
	Cart    Cart    `json:"cart" gorm:"foreignKey:CartID"`
	Product Product `json:"product" gorm:"foreignKey:ProductID"`
}

func (ci *CartItem) BeforeCreate(tx *gorm.DB) error {
	if ci.ID == "" {
		ci.ID = uuid.New().String()
	}
	return nil
}

// Order represents a customer order
type Order struct {
	ID              string        `json:"id" gorm:"primaryKey;type:varchar(36)"`
	UserID          string        `json:"userId" gorm:"type:varchar(36);not null"`
	OrderNumber     string        `json:"orderNumber" gorm:"uniqueIndex;not null"`
	Status          OrderStatus   `json:"status" gorm:"default:'pending'"`
	ShippingAddress Address       `json:"shippingAddress" gorm:"embedded;embeddedPrefix:shipping_"`
	BillingAddress  Address       `json:"billingAddress" gorm:"embedded;embeddedPrefix:billing_"`
	PaymentMethod   string        `json:"paymentMethod"`
	PaymentStatus   PaymentStatus `json:"paymentStatus" gorm:"default:'pending'"`
	PaymentIntentID string        `json:"paymentIntentId"`
	Subtotal        float64       `json:"subtotal" gorm:"not null"`
	Tax             float64       `json:"tax" gorm:"default:0"`
	Shipping        float64       `json:"shipping" gorm:"default:0"`
	Total           float64       `json:"total" gorm:"not null"`
	CreatedAt       time.Time     `json:"createdAt"`
	UpdatedAt       time.Time     `json:"updatedAt"`

	// Relationships
	User  User        `json:"user" gorm:"foreignKey:UserID"`
	Items []OrderItem `json:"items"`
}

func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.New().String()
	}
	if o.OrderNumber == "" {
		// Generate order number (format: BIZOE-YYYYMMDD-XXXX)
		o.OrderNumber = generateOrderNumber()
	}
	return nil
}

// OrderItem represents an item in an order
type OrderItem struct {
	ID        string    `json:"id" gorm:"primaryKey;type:varchar(36)"`
	OrderID   string    `json:"orderId" gorm:"type:varchar(36);not null"`
	ProductID string    `json:"productId" gorm:"type:varchar(36);not null"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Price     float64   `json:"price" gorm:"not null"`
	Total     float64   `json:"total" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	// Relationships
	Order   Order   `json:"order" gorm:"foreignKey:OrderID"`
	Product Product `json:"product" gorm:"foreignKey:ProductID"`
}

func (oi *OrderItem) BeforeCreate(tx *gorm.DB) error {
	if oi.ID == "" {
		oi.ID = uuid.New().String()
	}
	oi.Total = float64(oi.Quantity) * oi.Price
	return nil
}

// Address represents a shipping/billing address
type Address struct {
	FirstName string `json:"firstName" gorm:"not null"`
	LastName  string `json:"lastName" gorm:"not null"`
	Email     string `json:"email" gorm:"not null"`
	Phone     string `json:"phone" gorm:"not null"`
	Address   string `json:"address" gorm:"not null"`
	City      string `json:"city" gorm:"not null"`
	State     string `json:"state" gorm:"not null"`
	Country   string `json:"country" gorm:"not null"`
	ZipCode   string `json:"zipCode" gorm:"not null"`
}

// Enums
type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "pending"
	OrderStatusConfirmed  OrderStatus = "confirmed"
	OrderStatusProcessing OrderStatus = "processing"
	OrderStatusShipped    OrderStatus = "shipped"
	OrderStatusDelivered  OrderStatus = "delivered"
	OrderStatusCancelled  OrderStatus = "cancelled"
)

type PaymentStatus string

const (
	PaymentStatusPending  PaymentStatus = "pending"
	PaymentStatusPaid     PaymentStatus = "paid"
	PaymentStatusFailed   PaymentStatus = "failed"
	PaymentStatusRefunded PaymentStatus = "refunded"
)

// Helper function to generate order number
func generateOrderNumber() string {
	now := time.Now()
	return "BIZOE-" + now.Format("20060102") + "-" + uuid.New().String()[:8]
}
