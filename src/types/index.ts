// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  categoryId: string
  category: Category
  images: string[]
  specifications: Record<string, string>
  inStock: boolean
  stockQuantity: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
  productCount: number
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Cart {
  id: string
  userId?: string
  items: CartItem[]
  totalAmount: number
  totalItems: number
  createdAt: string
  updatedAt: string
}

// Order Types
export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: PaymentStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface CheckoutFormData {
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  sameAsBilling: boolean
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Filter Types
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
  search?: string
}

// Store Types
export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface CartState {
  cart: Cart | null
  isLoading: boolean
}

export interface ProductState {
  products: Product[]
  categories: Category[]
  selectedProduct: Product | null
  filters: ProductFilters
  isLoading: boolean
}

// Component Props Types
export interface ProductCardProps {
  product: Product
  showQuickView?: boolean
  className?: string
}

export interface CategoryCardProps {
  category: Category
  className?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

// Utility Types
export interface SEOProps {
  title: string
  description: string
  keywords?: string
  image?: string
  canonical?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface MenuItem {
  label: string
  href?: string
  children?: MenuItem[]
}
