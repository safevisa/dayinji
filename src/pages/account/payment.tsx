import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { 
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface PaymentMethod {
  id: string
  type: 'visa' | 'mastercard' | 'american_express' | 'paypal' | 'apple_pay' | 'google_pay'
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  holderName?: string
  isDefault: boolean
  email?: string // For PayPal
}

interface AddCardForm {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  holderName: string
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function PaymentMethods() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [showAddCard, setShowAddCard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      holderName: 'John Doe',
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5555',
      expiryMonth: 8,
      expiryYear: 2026,
      holderName: 'John Doe',
      isDefault: false
    },
    {
      id: '3',
      type: 'paypal',
      email: 'john.doe@example.com',
      isDefault: false
    }
  ])

  const [addCardForm, setAddCardForm] = useState<AddCardForm>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: user?.firstName + ' ' + user?.lastName || '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  })

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return (
          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
        )
      case 'mastercard':
        return (
          <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">
            MC
          </div>
        )
      case 'american_express':
        return (
          <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
            AMEX
          </div>
        )
      case 'paypal':
        return (
          <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
            PP
          </div>
        )
      case 'apple_pay':
        return (
          <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
            PAY
          </div>
        )
      case 'google_pay':
        return (
          <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-bold">
            GPay
          </div>
        )
      default:
        return <CreditCardIcon className="w-8 h-8 text-gray-400" />
    }
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
    toast.success('已設為預設付款方式')
  }

  const handleRemovePaymentMethod = (id: string) => {
    const method = paymentMethods.find(m => m.id === id)
    if (method?.isDefault && paymentMethods.length > 1) {
      toast.error('無法刪除預設付款方式，請先設定其他付款方式為預設')
      return
    }

    setPaymentMethods(methods => methods.filter(method => method.id !== id))
    toast.success('付款方式已刪除')
  }

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 模拟添加信用卡API调用
      await new Promise(resolve => setTimeout(resolve, 1500))

      const cardType = addCardForm.cardNumber.startsWith('4') ? 'visa' : 'mastercard'
      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: cardType,
        last4: addCardForm.cardNumber.slice(-4),
        expiryMonth: parseInt(addCardForm.expiryMonth),
        expiryYear: parseInt(addCardForm.expiryYear),
        holderName: addCardForm.holderName,
        isDefault: paymentMethods.length === 0
      }

      setPaymentMethods(prev => [...prev, newCard])
      setShowAddCard(false)
      setAddCardForm({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: user?.firstName + ' ' + user?.lastName || '',
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US'
        }
      })
      
      toast.success('信用卡已成功添加')
    } catch (error) {
      toast.error('添加信用卡失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDigitalWallet = (type: 'paypal' | 'apple_pay' | 'google_pay') => {
    const walletNames = {
      paypal: 'PayPal',
      apple_pay: 'Apple Pay',
      google_pay: 'Google Pay'
    }

    // 模拟添加数字钱包
    const newWallet: PaymentMethod = {
      id: Date.now().toString(),
      type,
      isDefault: paymentMethods.length === 0,
      email: type === 'paypal' ? user?.email : undefined
    }

    setPaymentMethods(prev => [...prev, newWallet])
    toast.success(`${walletNames[type]} 已成功連接`)
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formatted.slice(0, 19) // Limit to 16 digits + 3 spaces
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setAddCardForm(prev => ({ ...prev, cardNumber: formatted.replace(/\s/g, '') }))
  }

  return (
    <Layout
      seo={{
        title: '付款方式管理 - BIZOE',
        description: '管理您的信用卡和數字錢包',
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/account"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                返回帳戶
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">付款方式</h1>
                <p className="text-gray-600">管理您的信用卡和數字錢包</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Current Payment Methods */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">已保存的付款方式</h2>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>添加信用卡</span>
                  </button>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">尚未添加付款方式</h3>
                    <p className="text-gray-600 mb-4">添加信用卡或數字錢包以便快速結帳</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border-2 rounded-lg p-6 relative ${
                          method.isDefault 
                            ? 'border-primary-300 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {method.isDefault && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                              <CheckCircleIcon className="w-3 h-3" />
                              <span>預設</span>
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          {getPaymentMethodIcon(method.type)}
                          <button
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="刪除付款方式"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {method.last4 ? (
                          <>
                            <p className="font-medium text-gray-900 mb-1">
                              **** **** **** {method.last4}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              {method.holderName}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                              到期日: {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-gray-900 mb-1">
                              {method.type === 'paypal' ? 'PayPal' : method.type === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
                            </p>
                            {method.email && (
                              <p className="text-sm text-gray-600 mb-4">{method.email}</p>
                            )}
                          </>
                        )}

                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            設為預設
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Digital Wallets */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">數字錢包</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* PayPal */}
                  <button
                    onClick={() => handleAddDigitalWallet('paypal')}
                    className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 group-hover:bg-blue-600">
                      PayPal
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">PayPal</h3>
                    <p className="text-sm text-gray-600 text-center">使用您的PayPal帳戶快速付款</p>
                  </button>

                  {/* Apple Pay */}
                  <button
                    onClick={() => handleAddDigitalWallet('apple_pay')}
                    className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm mb-3">
                      Apple Pay
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Apple Pay</h3>
                    <p className="text-sm text-gray-600 text-center">Touch ID 或 Face ID 快速付款</p>
                  </button>

                  {/* Google Pay */}
                  <button
                    onClick={() => handleAddDigitalWallet('google_pay')}
                    className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3">
                      G Pay
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Google Pay</h3>
                    <p className="text-sm text-gray-600 text-center">使用您的Google帳戶付款</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">安全提醒</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 我們使用256位SSL加密保護您的付款資訊</li>
                    <li>• 信用卡資訊由PCI DSS認證的支付處理商安全處理</li>
                    <li>• 我們不會儲存您的CVV安全碼</li>
                    <li>• 所有交易都會即時監控以防止詐騙</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Card Modal */}
        {showAddCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">添加新信用卡</h2>
                  <button
                    onClick={() => setShowAddCard(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">關閉</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddCard} className="space-y-6">
                  {/* Card Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">卡片資訊</h3>
                    
                    <div className="space-y-4">
                      {/* Card Number */}
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          卡號
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          value={formatCardNumber(addCardForm.cardNumber)}
                          onChange={handleCardNumberChange}
                          className="input"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {/* Expiry Month */}
                        <div>
                          <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
                            月
                          </label>
                          <select
                            id="expiryMonth"
                            value={addCardForm.expiryMonth}
                            onChange={(e) => setAddCardForm(prev => ({ ...prev, expiryMonth: e.target.value }))}
                            className="input"
                            required
                          >
                            <option value="">月</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Expiry Year */}
                        <div>
                          <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">
                            年
                          </label>
                          <select
                            id="expiryYear"
                            value={addCardForm.expiryYear}
                            onChange={(e) => setAddCardForm(prev => ({ ...prev, expiryYear: e.target.value }))}
                            className="input"
                            required
                          >
                            <option value="">年</option>
                            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year.toString()}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* CVV */}
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            value={addCardForm.cvv}
                            onChange={(e) => setAddCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            className="input"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <label htmlFor="holderName" className="block text-sm font-medium text-gray-700 mb-1">
                          持卡人姓名
                        </label>
                        <input
                          type="text"
                          id="holderName"
                          value={addCardForm.holderName}
                          onChange={(e) => setAddCardForm(prev => ({ ...prev, holderName: e.target.value }))}
                          className="input"
                          placeholder="如卡片上所示的姓名"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">帳單地址</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                          街道地址
                        </label>
                        <input
                          type="text"
                          id="street"
                          value={addCardForm.billingAddress.street}
                          onChange={(e) => setAddCardForm(prev => ({ 
                            ...prev, 
                            billingAddress: { ...prev.billingAddress, street: e.target.value }
                          }))}
                          className="input"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            城市
                          </label>
                          <input
                            type="text"
                            id="city"
                            value={addCardForm.billingAddress.city}
                            onChange={(e) => setAddCardForm(prev => ({ 
                              ...prev, 
                              billingAddress: { ...prev.billingAddress, city: e.target.value }
                            }))}
                            className="input"
                            placeholder="New York"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            州/省
                          </label>
                          <input
                            type="text"
                            id="state"
                            value={addCardForm.billingAddress.state}
                            onChange={(e) => setAddCardForm(prev => ({ 
                              ...prev, 
                              billingAddress: { ...prev.billingAddress, state: e.target.value }
                            }))}
                            className="input"
                            placeholder="NY"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            郵遞區號
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            value={addCardForm.billingAddress.zipCode}
                            onChange={(e) => setAddCardForm(prev => ({ 
                              ...prev, 
                              billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                            }))}
                            className="input"
                            placeholder="10001"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            國家
                          </label>
                          <select
                            id="country"
                            value={addCardForm.billingAddress.country}
                            onChange={(e) => setAddCardForm(prev => ({ 
                              ...prev, 
                              billingAddress: { ...prev.billingAddress, country: e.target.value }
                            }))}
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
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddCard(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '添加中...' : '添加信用卡'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
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
