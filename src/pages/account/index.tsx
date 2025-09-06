import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { 
  UserIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  HeartIcon,
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function Account() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  const handleLogout = () => {
    logout()
    toast.success('已安全登出')
    router.push('/')
  }

  // 模拟订单数据
  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: '已發貨',
      total: 299.99,
      items: [
        { name: 'Phrozen 普羅森 標準樹脂', price: 29.99, quantity: 10 }
      ]
    },
    {
      id: 'ORD-002', 
      date: '2024-01-10',
      status: '已完成',
      total: 1599.98,
      items: [
        { name: 'Phrozen Sonic Mighty Revo 16K', price: 899.99, quantity: 1 },
        { name: '專業UV固化清洗工作站', price: 299.99, quantity: 1 },
        { name: 'PLA+ 高品質線材', price: 24.99, quantity: 16 }
      ]
    }
  ]

  // 模拟支付方式
  const mockPaymentMethods = [
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5555',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]

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
      default:
        return <CreditCardIcon className="w-8 h-8 text-gray-400" />
    }
  }

  const menuItems = [
    { id: 'profile', label: '個人資料', icon: UserIcon, href: '/account' },
    { id: 'orders', label: '訂單紀錄', icon: ShoppingBagIcon, href: '/account/orders' },
    { id: 'payment', label: '付款方式', icon: CreditCardIcon, href: '/account/payment' },
    { id: 'wishlist', label: '收藏清單', icon: HeartIcon, href: '/account/wishlist' },
    { id: 'notifications', label: '通知設定', icon: BellIcon, href: '/account/notifications' },
    { id: 'security', label: '帳戶安全', icon: ShieldCheckIcon, href: '/account/security' },
    { id: 'settings', label: '偏好設定', icon: Cog6ToothIcon, href: '/account/settings' },
  ]

  return (
    <Layout
      seo={{
        title: '我的帳戶 - BIZOE',
        description: '管理您的個人資料、訂單和偏好設定',
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">我的帳戶</h1>
                <p className="text-gray-600">管理您的個人資料和偏好設定</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  歡迎回來，{user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>登出</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Account Overview */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">帳戶總覽</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Orders Stats */}
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm">總訂單數</p>
                            <p className="text-3xl font-bold">{mockOrders.length}</p>
                          </div>
                          <ShoppingBagIcon className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>

                      {/* Total Spent */}
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm">總消費金額</p>
                            <p className="text-3xl font-bold">$1,899</p>
                          </div>
                          <CreditCardIcon className="w-8 h-8 text-green-200" />
                        </div>
                      </div>

                      {/* Rewards Points */}
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100 text-sm">獎勵積分</p>
                            <p className="text-3xl font-bold">2,340</p>
                          </div>
                          <ShieldCheckIcon className="w-8 h-8 text-purple-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">最近訂單</h2>
                      <Link
                        href="/account/orders"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        查看全部
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {mockOrders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium text-gray-900">#{order.id}</span>
                              <span className="text-sm text-gray-500">{order.date}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === '已完成' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <span className="font-bold text-gray-900">
                              ${order.total}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items.length} 件商品
                            {order.items.slice(0, 2).map((item, index) => (
                              <span key={index}>
                                {index > 0 && ', '}
                                {item.name}
                              </span>
                            ))}
                            {order.items.length > 2 && ` 等${order.items.length - 2}項`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">快速操作</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link
                        href="/account/profile"
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                      >
                        <UserIcon className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-primary-900">
                            編輯個人資料
                          </h3>
                          <p className="text-sm text-gray-500">更新您的基本資料</p>
                        </div>
                      </Link>

                      <Link
                        href="/account/payment"
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                      >
                        <CreditCardIcon className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-primary-900">
                            管理付款方式
                          </h3>
                          <p className="text-sm text-gray-500">添加或編輯信用卡</p>
                        </div>
                      </Link>

                      <Link
                        href="/account/security"
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                      >
                        <ShieldCheckIcon className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-primary-900">
                            帳戶安全
                          </h3>
                          <p className="text-sm text-gray-500">變更密碼和安全設定</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Preview */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">付款方式</h2>
                      <Link
                        href="/account/payment"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span>新增</span>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockPaymentMethods.slice(0, 2).map((method) => (
                        <div
                          key={method.id}
                          className={`border-2 rounded-lg p-4 ${
                            method.isDefault 
                              ? 'border-primary-300 bg-primary-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            {getPaymentMethodIcon(method.type)}
                            {method.isDefault && (
                              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                                預設
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-gray-900">
                            **** **** **** {method.last4}
                          </p>
                          <p className="text-sm text-gray-500">
                            到期日: {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                          </p>
                        </div>
                      ))}
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
