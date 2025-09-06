import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { 
  LockClosedIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentMethodOption {
  id: string
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
  name: string
  description: string
  last4?: string
  icon: React.ComponentType<any>
}

export default function Checkout() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { cart, clearCart, getTotal, getItemCount } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  // 如果未登录或购物车为空，重定向
  if (!isAuthenticated) {
    router.push('/auth/login?returnUrl=' + encodeURIComponent('/checkout'))
    return null
  }

  if (!cart || cart.items.length === 0) {
    router.push('/cart')
    return null
  }

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'visa_4242',
      type: 'credit_card',
      name: 'Visa ending in 4242',
      description: '到期日 12/2025',
      last4: '4242',
      icon: CreditCardIcon
    },
    {
      id: 'mastercard_5555',
      type: 'credit_card', 
      name: 'Mastercard ending in 5555',
      description: '到期日 08/2026',
      last4: '5555',
      icon: CreditCardIcon
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      description: '使用您的PayPal帳戶付款',
      icon: CreditCardIcon
    },
    {
      id: 'apple_pay',
      type: 'apple_pay',
      name: 'Apple Pay',
      description: 'Touch ID 或 Face ID 快速付款',
      icon: CreditCardIcon
    }
  ]

  const subtotal = getTotal()
  const shipping = subtotal >= 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证地址信息
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const missing = required.filter(field => !shippingAddress[field as keyof ShippingAddress])
    
    if (missing.length > 0) {
      toast.error('請填寫所有必填欄位')
      return
    }

    setCurrentStep(2)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPaymentMethod) {
      toast.error('請選擇付款方式')
      return
    }

    setIsProcessing(true)

    try {
      // 模拟付款处理
      await new Promise(resolve => setTimeout(resolve, 3000))

      // 模拟订单创建
      const orderId = 'BIZOE-' + Date.now().toString().slice(-6)
      
      // 清空购物车
      clearCart()
      
      // 跳转到订单确认页面
      router.push(`/order-confirmation?orderId=${orderId}&total=${total}`)
      
    } catch (error) {
      toast.error('付款失敗，請重試')
      setIsProcessing(false)
    }
  }

  const getPaymentMethodIcon = (type: string, last4?: string) => {
    switch (type) {
      case 'credit_card':
        if (last4?.startsWith('4')) {
          return (
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
          )
        } else {
          return (
            <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
              MC
            </div>
          )
        }
      case 'paypal':
        return (
          <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
            PP
          </div>
        )
      case 'apple_pay':
        return (
          <div className="w-10 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
            PAY
          </div>
        )
      default:
        return <CreditCardIcon className="w-6 h-6 text-gray-400" />
    }
  }

  return (
    <Layout
      seo={{
        title: '結帳 - BIZOE',
        description: '安全結帳，完成您的訂單',
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/cart"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                返回購物車
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">安全結帳</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <LockClosedIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">SSL安全加密</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white border-b">
          <div className="container py-4">
            <div className="flex items-center justify-center space-x-8">
              {[
                { step: 1, label: '配送資訊' },
                { step: 2, label: '付款方式' },
                { step: 3, label: '訂單確認' }
              ].map((item) => (
                <div key={item.step} className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= item.step
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > item.step ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      item.step
                    )}
                  </div>
                  <span className={`text-sm ${currentStep >= item.step ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">配送資訊</h2>
                    
                    <form onSubmit={handleShippingSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            姓氏 *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            value={shippingAddress.firstName}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            名字 *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={shippingAddress.lastName}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                            className="input"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            電子郵件 *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={shippingAddress.email}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            電話號碼 *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                            className="input"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          地址 *
                        </label>
                        <input
                          type="text"
                          id="address"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                          className="input"
                          placeholder="街道地址"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                          公寓/套房號碼（選填）
                        </label>
                        <input
                          type="text"
                          id="apartment"
                          value={shippingAddress.apartment}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, apartment: e.target.value }))}
                          className="input"
                          placeholder="公寓、套房、樓層等"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            城市 *
                          </label>
                          <input
                            type="text"
                            id="city"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            州/省 *
                          </label>
                          <input
                            type="text"
                            id="state"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            郵遞區號 *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            value={shippingAddress.zipCode}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                            className="input"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          國家 *
                        </label>
                        <select
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                          className="input"
                          required
                        >
                          <option value="US">美國</option>
                          <option value="CA">加拿大</option>
                          <option value="TW">台灣</option>
                          <option value="HK">香港</option>
                          <option value="SG">新加坡</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        繼續至付款
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">配送至</h3>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        修改
                      </button>
                    </div>
                    <div className="mt-2 text-gray-600">
                      <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p>{shippingAddress.address}</p>
                      {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">選擇付款方式</h2>
                      
                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        {paymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              selectedPaymentMethod === method.id
                                ? 'border-primary-300 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={selectedPaymentMethod === method.id}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            
                            <div className="flex items-center space-x-3 flex-1">
                              {getPaymentMethodIcon(method.type, method.last4)}
                              <div>
                                <p className="font-medium text-gray-900">{method.name}</p>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </div>
                            </div>

                            {selectedPaymentMethod === method.id && (
                              <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                            )}
                          </label>
                        ))}

                        {/* Add New Payment Method */}
                        <Link
                          href="/account/payment"
                          className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                        >
                          <CreditCardIcon className="w-5 h-5" />
                          <span>添加新的付款方式</span>
                        </Link>

                        {/* Security Notice */}
                        <div className="bg-gray-50 rounded-lg p-4 mt-6">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <LockClosedIcon className="w-4 h-4" />
                            <span>您的付款資訊受到256位SSL加密保護</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 pt-6">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            返回配送
                          </button>
                          <button
                            type="submit"
                            disabled={!selectedPaymentMethod || isProcessing}
                            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>處理中...</span>
                              </>
                            ) : (
                              <span>完成付款 {formatPrice(total)}</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow sticky top-6">
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    訂單摘要 ({getItemCount()} 件商品)
                  </h2>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover rounded-md"
                          />
                          <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">商品小計</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">運費</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                        {shipping === 0 ? '免費' : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">稅金 (8%)</span>
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

                  {/* Estimated Delivery */}
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          預計送達時間
                        </p>
                        <p className="text-sm text-green-700">
                          {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-TW', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <LockClosedIcon className="w-4 h-4" />
                      <span>安全結帳由SSL加密保護</span>
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
  }
}
