import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeftIcon,
  EyeIcon,
  TruckIcon,
  XCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import { useAuthStore } from '@/store/authStore'

interface Order {
  id: string
  orderNumber: string
  orderDate: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  itemCount: number
  items: {
    id: string
    name: string
    image: string
    price: number
    quantity: number
  }[]
}

export default function Orders() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [selectedStatus, setSelectedStatus] = useState('all')

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  // 模拟订单数据
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'BIZOE-20240115-001',
      orderDate: '2024-01-15',
      status: 'delivered',
      total: 84.97,
      itemCount: 3,
      items: [
        {
          id: '1',
          name: 'Phrozen 普羅森 標準樹脂',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
          price: 29.99,
          quantity: 2
        },
        {
          id: '2', 
          name: 'PLA+ 高品質線材',
          image: 'https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=100&h=100&fit=crop',
          price: 24.99,
          quantity: 1
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'BIZOE-20240110-002',
      orderDate: '2024-01-10',
      status: 'shipped',
      total: 1529.97,
      itemCount: 3,
      items: [
        {
          id: '1',
          name: 'Phrozen Sonic Mighty Revo 16K',
          image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop',
          price: 899.99,
          quantity: 1
        },
        {
          id: '2',
          name: '專業UV固化清洗工作站',
          image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100&h=100&fit=crop',
          price: 299.99,
          quantity: 1
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'BIZOE-20240105-003',
      orderDate: '2024-01-05',
      status: 'processing',
      total: 64.98,
      itemCount: 2,
      items: [
        {
          id: '1',
          name: 'PETG 透明線材',
          image: 'https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=100&h=100&fit=crop',
          price: 32.99,
          quantity: 2
        }
      ]
    }
  ]

  const filteredOrders = selectedStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedStatus)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />
      case 'confirmed':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'processing':
        return <ClockIcon className="w-4 h-4" />
      case 'shipped':
        return <TruckIcon className="w-4 h-4" />
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />
      default:
        return <ClockIcon className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待確認'
      case 'confirmed':
        return '已確認'
      case 'processing':
        return '處理中'
      case 'shipped':
        return '已發貨'
      case 'delivered':
        return '已送達'
      case 'cancelled':
        return '已取消'
      default:
        return status
    }
  }

  return (
    <Layout
      seo={{
        title: `${t('orders.title')} - BIZOE`,
        description: '查看您在BIZOE的訂單歷史和狀態',
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
                {t('buttons.back')}
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
                <p className="text-gray-600">查看您的所有訂單記錄</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="max-w-6xl mx-auto">
            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'all', label: '所有訂單', count: mockOrders.length },
                    { id: 'pending', label: '待確認', count: mockOrders.filter(o => o.status === 'pending').length },
                    { id: 'processing', label: '處理中', count: mockOrders.filter(o => o.status === 'processing').length },
                    { id: 'shipped', label: '已發貨', count: mockOrders.filter(o => o.status === 'shipped').length },
                    { id: 'delivered', label: '已完成', count: mockOrders.filter(o => o.status === 'delivered').length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedStatus(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        selectedStatus === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                          selectedStatus === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">沒有找到訂單</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedStatus === 'all' ? '您還沒有任何訂單' : '該狀態下沒有訂單'}
                  </p>
                  <Link
                    href="/products"
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    開始購物
                  </Link>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow">
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            #{order.orderNumber}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString('zh-TW')}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          訂購商品 ({order.itemCount} 件)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {order.items.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatPrice(item.price)} x {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="flex items-center justify-center">
                              <span className="text-sm text-gray-500">
                                +{order.items.length - 4} 件商品
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>{t('orders.view_order')}</span>
                          </Link>
                          {(order.status === 'shipped' || order.status === 'delivered') && (
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium text-sm">
                              <TruckIcon className="w-4 h-4" />
                              <span>{t('orders.track_order')}</span>
                            </button>
                          )}
                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm">
                              <XCircleIcon className="w-4 h-4" />
                              <span>{t('orders.cancel_order')}</span>
                            </button>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {order.status === 'delivered' ? '已於' : '預計'}{' '}
                            {new Date(new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-TW')}{' '}
                            {order.status === 'delivered' ? '送達' : '送達'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary Stats */}
            {filteredOrders.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">總訂單數</p>
                      <p className="text-2xl font-bold text-primary-600">{mockOrders.length}</p>
                    </div>
                    <DocumentTextIcon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">累計消費</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(mockOrders.reduce((sum, order) => sum + order.total, 0))}
                      </p>
                    </div>
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">平均訂單</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(mockOrders.reduce((sum, order) => sum + order.total, 0) / mockOrders.length)}
                      </p>
                    </div>
                    <TruckIcon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            )}
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
