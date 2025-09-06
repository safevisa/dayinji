# BIZOE 3D Printer Store

A full-stack e-commerce platform for 3D printing equipment and materials. Built with Next.js, Go, and MySQL with multilingual support (Traditional Chinese & English).

## Company Information
- **Company**: BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED
- **Contact**: luotian@joy8899.com
- **Price Range**: $19.9 - $39.9

## Features

### 🛍️ E-commerce Features
- **Product Catalog**: Browse 3D printers, materials, scanners, and post-processing equipment
- **Advanced Search & Filtering**: Find products by category, price range, and availability
- **Shopping Cart**: Add, update, and remove items with real-time calculations
- **Order Management**: Complete order lifecycle from checkout to delivery
- **User Accounts**: Registration, login, profile management, and order history

### 🌍 Multilingual Support
- **Traditional Chinese (繁體中文)**: Default language
- **English**: Full translation support
- **Dynamic Language Switching**: Real-time language switching without page refresh

### 💳 Payment Integration
- **Stripe Integration**: Secure payment processing
- **Multiple Payment Methods**: Credit cards, digital wallets
- **Payment Status Tracking**: Real-time payment status updates

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with beautiful layouts
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design
- **Dark/Light Mode**: Theme switching support

### 🔧 Technical Features
- **Authentication & Authorization**: JWT-based secure authentication
- **Database**: MySQL with GORM ORM
- **API**: RESTful API with comprehensive endpoints
- **State Management**: Zustand for efficient state management
- **SEO Optimized**: Server-side rendering and meta tag optimization

## Tech Stack

### Frontend
- **Framework**: Next.js 13 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand
- **Internationalization**: next-i18next
- **HTTP Client**: Axios with React Query
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion

### Backend
- **Language**: Go 1.21
- **Framework**: Gin
- **Database**: MySQL with GORM ORM
- **Authentication**: JWT tokens
- **Payment**: Stripe API
- **File Upload**: Cloudinary integration ready
- **CORS**: Configurable cross-origin resource sharing

### Database
- **Primary**: MySQL 8.0+
- **ORM**: GORM with auto-migrations
- **Features**: Foreign key constraints, indexing, transactions

## Project Structure

```
📦 BIZOE 3D Printer Store
├── 📁 frontend/                 # Next.js frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable React components
│   │   │   ├── 📁 auth/         # Authentication components
│   │   │   ├── 📁 cart/         # Shopping cart components
│   │   │   ├── 📁 common/       # Common UI components
│   │   │   ├── 📁 layout/       # Layout components
│   │   │   ├── 📁 orders/       # Order management components
│   │   │   └── 📁 products/     # Product display components
│   │   ├── 📁 hooks/            # Custom React hooks
│   │   ├── 📁 lib/              # Utility functions
│   │   ├── 📁 pages/            # Next.js pages
│   │   ├── 📁 store/            # Zustand store configurations
│   │   ├── 📁 styles/           # CSS and styling files
│   │   └── 📁 types/            # TypeScript type definitions
│   ├── 📁 public/
│   │   ├── 📁 images/           # Static images
│   │   └── 📁 locales/          # Translation files
│   │       ├── 📁 en/           # English translations
│   │       └── 📁 zh-TW/        # Traditional Chinese translations
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   └── 📄 tsconfig.json
├── 📁 backend/                  # Go backend API
│   ├── 📁 cmd/server/           # Application entry point
│   ├── 📁 internal/
│   │   ├── 📁 config/           # Configuration management
│   │   ├── 📁 database/         # Database connection and migrations
│   │   ├── 📁 handlers/         # HTTP request handlers
│   │   ├── 📁 middleware/       # HTTP middleware
│   │   ├── 📁 models/           # Database models
│   │   └── 📁 services/         # Business logic services
│   ├── 📁 pkg/
│   │   ├── 📁 auth/             # Authentication utilities
│   │   └── 📁 utils/            # General utilities
│   ├── 📄 go.mod
│   └── 📄 go.sum
└── 📄 README.md                 # This file
```

## Quick Start

### Prerequisites
- **Node.js**: 18.x or higher
- **Go**: 1.21 or higher
- **MySQL**: 8.0 or higher
- **npm** or **yarn**: Latest version

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bizoe-3d-store
```

### 2. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE bizoe_3d_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bizoe_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON bizoe_3d_store.* TO 'bizoe_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env file with your configurations
nano .env

# Install Go dependencies
go mod tidy

# Run database migrations and start server
go run cmd/server/main.go
```

The backend API will be available at `http://localhost:8080`

### 4. Frontend Setup
```bash
# Navigate to project root (if in backend directory)
cd ..

# Install frontend dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit environment variables
nano .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=mysql://bizoe_user:your_password@localhost:3306/bizoe_3d_store?charset=utf8mb4&parseTime=True&loc=Local

# Server
ENVIRONMENT=development
PORT=8080
API_BASE_URL=http://localhost:8080

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (optional)
EMAIL_FROM=luotian@joy8899.com
SMTP_HOST=smtp.your-host.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Company
COMPANY_NAME=BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED
COMPANY_EMAIL=luotian@joy8899.com
```

### Frontend (.env.local)
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Company Info
NEXT_PUBLIC_COMPANY_NAME=BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED
NEXT_PUBLIC_COMPANY_EMAIL=luotian@joy8899.com
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:slug` - Get products by category
- `GET /api/products/search?q=term` - Search products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### User (Protected)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/orders` - Get user's orders

### Payment (Protected)
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/payment/confirm` - Confirm payment

### Admin (Protected + Admin Role)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Development

### Running Tests
```bash
# Backend tests
cd backend
go test ./...

# Frontend tests
npm run test
```

### Code Quality
```bash
# Backend linting
cd backend
golangci-lint run

# Frontend linting
npm run lint

# Type checking
npm run type-check
```

### Building for Production
```bash
# Build frontend
npm run build

# Build backend
cd backend
go build -o bin/server cmd/server/main.go
```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository to Vercel or Netlify
2. Set environment variables in the platform dashboard
3. Deploy with automatic builds on git push

### Backend (DigitalOcean/AWS/Railway)
1. Set up MySQL database
2. Configure environment variables
3. Build and deploy the Go binary
4. Set up reverse proxy (Nginx) if needed

### Database Migration
The application automatically runs database migrations on startup. For production:
1. Ensure database connection is established
2. Run migrations manually if preferred:
   ```bash
   go run cmd/migrate/main.go
   ```

## Features Roadmap

### Phase 1 (Current) ✅
- [x] Basic e-commerce functionality
- [x] User authentication
- [x] Product catalog
- [x] Shopping cart
- [x] Order management
- [x] Stripe payment integration
- [x] Multilingual support

### Phase 2 (Future)
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Multi-vendor support
- [ ] Subscription products
- [ ] Advanced shipping options
- [ ] Loyalty program
- [ ] Social media integration
- [ ] Live chat support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Email: luotian@joy8899.com
- Company: BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED

## Acknowledgments

- Built with inspiration from modern e-commerce platforms
- UI design influenced by contemporary 3D printing industry websites
- Special thanks to the open-source community for the amazing tools and libraries

---

**BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED**  
Professional 3D Printing Solutions | luotian@joy8899.com
