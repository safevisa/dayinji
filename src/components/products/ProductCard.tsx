import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
  showQuickView?: boolean
}

export default function ProductCard({ 
  product, 
  className = '', 
  showQuickView = true 
}: ProductCardProps) {
  const { t } = useTranslation('common')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem(product, 1)
    toast.success(t('messages.success'))
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // TODO: Implement quick view modal
    toast('Quick view coming soon!')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className={`group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Product Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-full">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className={`object-cover transition-transform duration-200 group-hover:scale-105 ${
                  imageLoading ? 'blur-sm' : 'blur-0'
                }`}
                onLoadingComplete={() => setImageLoading(false)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </Link>

        {/* Sale Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}

        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWishlist}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          {showQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              title="Quick view"
            >
              <EyeIcon className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Add to Cart Button - Mobile */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:hidden">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              product.inStock
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4 inline mr-2" />
            {t('products.add_to_cart')}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        {/* Category */}
        <p className="text-xs text-gray-500 mb-2">{product.category?.name}</p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button - Desktop */}
        <div className="hidden md:block">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              product.inStock
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4 inline mr-2" />
            {product.inStock ? t('products.add_to_cart') : 'Out of Stock'}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}</span>
          <Link
            href={`/products/${product.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('products.view_details')}
          </Link>
        </div>
      </div>
    </div>
  )
}
