import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/data/products'

interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}

interface Cart {
  id: string
  userId?: string
  items: CartItem[]
  totalAmount: number
  totalItems: number
  createdAt: string
  updatedAt: string
}

interface CartState {
  cart: Cart | null
  isLoading: boolean
}

interface CartStore extends CartState {
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
  setLoading: (loading: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      addItem: (product: Product, quantity = 1) => {
        const { cart } = get()
        const existingCart = cart || {
          id: 'local-cart',
          items: [],
          totalAmount: 0,
          totalItems: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const existingItemIndex = existingCart.items.findIndex(
          item => item.productId === product.id
        )

        let updatedItems: CartItem[]

        if (existingItemIndex > -1) {
          // Update existing item quantity
          updatedItems = existingCart.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            price: product.price,
          }
          updatedItems = [...existingCart.items, newItem]
        }

        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        const updatedCart: Cart = {
          ...existingCart,
          items: updatedItems,
          totalItems,
          totalAmount,
          updatedAt: new Date().toISOString(),
        }

        set({ cart: updatedCart })
      },

      removeItem: (productId: string) => {
        const { cart } = get()
        if (!cart) return

        const updatedItems = cart.items.filter(item => item.productId !== productId)
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        const updatedCart: Cart = {
          ...cart,
          items: updatedItems,
          totalItems,
          totalAmount,
          updatedAt: new Date().toISOString(),
        }

        set({ cart: updatedCart })
      },

      updateQuantity: (productId: string, quantity: number) => {
        const { cart } = get()
        if (!cart) return

        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const updatedItems = cart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        )

        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        const updatedCart: Cart = {
          ...cart,
          items: updatedItems,
          totalItems,
          totalAmount,
          updatedAt: new Date().toISOString(),
        }

        set({ cart: updatedCart })
      },

      clearCart: () => {
        set({ cart: null })
      },

      getItemCount: () => {
        const { cart } = get()
        return cart?.totalItems || 0
      },

      getTotal: () => {
        const { cart } = get()
        return cart?.totalAmount || 0
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
)
