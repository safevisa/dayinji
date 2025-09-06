import { useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import { 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowLeftIcon,
  TruckIcon,
  ShieldCheckIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function Cart() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { cart, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromoCode, setAppliedPromoCode] = useState<{code: string, discount: number} | null>(null)

  const itemCount = getItemCount()
  const subtotal = getTotal()
  const shipping = subtotal >= 100 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax rate
  const promoDiscount = appliedPromoCode ? (subtotal * appliedPromoCode.discount / 100) : 0
  const total = subtotal + shipping + tax - promoDiscount

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
    toast.success('商品已從購物車移除')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('購物車已清空')
  }

  const handleApplyPromoCode = () => {
    // 模拟促销码验证
    const validPromoCodes = {
      'WELCOME10': 10,
      'SAVE15': 15,
      'NEWUSER': 20,
      'BIZOE2024': 25
    }

    const code = promoCode.toUpperCase()
    if (validPromoCodes[code]) {
      setAppliedPromoCode({ code, discount: validPromoCodes[code] })
      toast.success(`促銷碼 ${code} 已套用，享${validPromoCodes[code]}%折扣！`)
      setPromoCode('')
    } else {
      toast.error('無效的促銷碼')
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('請先登入以繼續結帳')
      router.push(`/auth/login?returnUrl=${encodeURIComponent('/cart')}`)
      return
    }

    if (!cart || cart.items.length === 0) {
      toast.error('購物車為空')
      return
    }

    // 跳转到结账页面
    router.push('/checkout')
  }

  const handleSaveForLater = (productId: string) => {
    // 模拟保存到收藏夹
    handleRemoveItem(productId)
    toast.success('商品已保存到收藏清單')
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Layout
        seo={{
          title: '購物車 - BIZOE',
          description: '查看您的購物車商品',
        }}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="container py-6">
              <div className="flex items-center space-x-4">
                <Link
                  href="/products"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  繼續購物
                </Link>
                <div className="border-l border-gray-300 pl-4">
                  <h1 className="text-2xl font-bold text-gray-900">購物車</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Empty Cart */}
          <div className="container py-16">
            <div className="text-center max-w-md mx-auto">
              <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h2>
              <p className="text-gray-600 mb-8">
                {t('cart.empty_description')}<br />
                {t('cart.discover_products', '立即開始購物，發現我們的精選商品！')}
              </p>
              <div className="space-y-4">
                <Link
                  href="/products"
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
                >
                  開始購物
                </Link>
                <Link
                  href="/promotions"
                  className="w-full border border-primary-600 text-primary-600 py-3 px-6 rounded-lg font-medium hover:bg-primary-50 transition-colors inline-block"
                >
                  查看特價商品
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      seo={{
        title: `購物車 (${itemCount}) - BIZOE`,
        description: '查看和編輯您的購物車商品',
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/products"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  繼續購物
                </Link>
                <div className="border-l border-gray-300 pl-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    購物車 ({itemCount} 件商品)
                  </h1>
                </div>
              </div>
              {cart.items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  清空購物車
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">購物清單</h2>
                  
                  <div className="space-y-6">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        {/* Product Image */}
                        <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-lg font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                          <p className="text-lg font-bold text-primary-600 mt-2">
                            {formatPrice(item.price)}
                          </p>
                          {item.product.originalPrice && item.product.originalPrice > item.price && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600 border border-gray-300 rounded"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600 border border-gray-300 rounded"
                            disabled={item.quantity >= item.product.stockQuantity}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500">
                            庫存: {item.product.stockQuantity}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleSaveForLater(item.productId)}
                            className="text-gray-400 hover:text-primary-600 p-1"
                            title="保存到收藏清單"
                          >
                            <HeartIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-gray-400 hover:text-red-600 p-1"
                            title="從購物車移除"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promotions */}
              <div className="bg-white rounded-lg shadow mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">促銷優惠</h3>
                  
                  {/* Applied Promo Code */}
                  {appliedPromoCode && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TagIcon className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            促銷碼 "{appliedPromoCode.code}" 已套用
                          </span>
                        </div>
                        <span className="text-green-600 font-bold">
                          -{appliedPromoCode.discount}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Promo Code Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="輸入促銷碼"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 input"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                    />
                    <button
                      onClick={handleApplyPromoCode}
                      disabled={!promoCode.trim()}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      套用
                    </button>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>可用促銷碼: WELCOME10 (10%off), SAVE15 (15%off), NEWUSER (20%off)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow sticky top-6">
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">訂單摘要</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">商品小計</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    {appliedPromoCode && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>促銷折扣 ({appliedPromoCode.code})</span>
                        <span>-{formatPrice(promoDiscount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">運費</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                        {shipping === 0 ? '免費' : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">稅金</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">總計</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Notice */}
                  {subtotal < 100 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-blue-800">
                          再購買 {formatPrice(100 - subtotal)} 即可享免運費
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors mt-6"
                  >
                    {isAuthenticated ? '前往結帳' : '登入並結帳'}
                  </button>

                  {/* Security Features */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span>SSL安全加密</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TruckIcon className="w-4 h-4" />
                      <span>滿$100免運費</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TagIcon className="w-4 h-4" />
                      <span>7天退換貨保證</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600 mb-3">支援付款方式：</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                        VISA
                      </div>
                      <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded text-white text-xs font-bold flex items-center justify-center">
                        MC
                      </div>
                      <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
                        PP
                      </div>
                      <div className="w-8 h-5 bg-black rounded text-white text-xs font-bold flex items-center justify-center">
                        PAY
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
  }
}
