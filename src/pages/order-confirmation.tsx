import { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { 
  CheckCircleIcon,
  TruckIcon,
  EnvelopeIcon,
  PhoneIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import { useAuthStore } from '@/store/authStore'
// import confetti from 'canvas-confetti'

interface OrderConfirmationProps {
  orderId: string
  total: number
}

export default function OrderConfirmation({ orderId, total }: OrderConfirmationProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  // 如果未登录，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  // 触发庆祝动画（移除confetti依赖）
  useEffect(() => {
    // 可以在这里添加其他庆祝效果
    console.log('Order confirmed successfully!')
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const estimatedDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

  // 模拟订单详情
  const orderDetails = {
    orderNumber: orderId,
    orderDate: new Date().toISOString(),
    status: '已確認',
    paymentStatus: '已付款',
    estimatedDelivery: estimatedDeliveryDate.toISOString(),
    trackingNumber: 'BZ' + Date.now().toString().slice(-8),
    items: [
      {
        name: 'Phrozen 普羅森 標準樹脂',
        price: 29.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
      },
      {
        name: 'PLA+ 高品質線材',
        price: 24.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=500&h=500&fit=crop'
      }
    ],
    shippingAddress: {
      name: `${user?.firstName} ${user?.lastName}`,
      address: '123 Main Street, Apt 4B',
      city: 'New York, NY 10001',
      phone: '+1 (555) 123-4567'
    }
  }

  const handlePrintOrder = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    // 模拟下载发票
    toast.success('發票下載已開始')
  }

  return (
    <Layout
      seo={{
        title: `訂單確認 #${orderId} - BIZOE`,
        description: '感謝您的購買！您的訂單已成功處理',
      }}
      className="print:bg-white"
    >
      <div className="min-h-screen bg-gray-50 print:bg-white">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white print:hidden">
          <div className="container py-12">
            <div className="text-center max-w-2xl mx-auto">
              <CheckCircleIcon className="w-20 h-20 mx-auto mb-4 animate-bounce" />
              <h1 className="text-4xl font-bold mb-4">訂單成功！</h1>
              <p className="text-xl text-green-100 mb-6">
                感謝您的購買！我們已收到您的訂單，正在準備為您發貨。
              </p>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-green-100 mb-2">訂單編號</p>
                <p className="text-2xl font-bold">{orderId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8 print:py-0">
          {/* Order Details */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Order Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow print:shadow-none">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6 print:mb-4">
                      <h2 className="text-2xl font-bold text-gray-900">訂單詳情</h2>
                      <div className="flex space-x-2 print:hidden">
                        <button
                          onClick={handlePrintOrder}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <PrinterIcon className="w-4 h-4" />
                          <span>列印</span>
                        </button>
                        <button
                          onClick={handleDownloadInvoice}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          <span>下載發票</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">訂單資訊</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">訂單編號:</span>
                            <span className="font-medium">{orderDetails.orderNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">訂單日期:</span>
                            <span className="font-medium">
                              {new Date(orderDetails.orderDate).toLocaleDateString('zh-TW')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">狀態:</span>
                            <span className="font-medium text-green-600">{orderDetails.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">付款狀態:</span>
                            <span className="font-medium text-green-600">{orderDetails.paymentStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">配送資訊</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">收件人:</span>
                            <span className="font-medium">{orderDetails.shippingAddress.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">地址:</span>
                            <div className="text-right">
                              <p className="font-medium">{orderDetails.shippingAddress.address}</p>
                              <p className="font-medium">{orderDetails.shippingAddress.city}</p>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">電話:</span>
                            <span className="font-medium">{orderDetails.shippingAddress.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">追蹤號碼:</span>
                            <span className="font-medium text-primary-600">{orderDetails.trackingNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-gray-900 mb-4">購買商品</h3>
                      <div className="space-y-4">
                        {orderDetails.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">數量: {item.quantity}</p>
                              <p className="text-lg font-bold text-primary-600 mt-1">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Next Steps */}
                  <div className="bg-white rounded-lg shadow print:hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">接下來</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-primary-600 font-bold text-sm">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">訂單確認</p>
                            <p className="text-sm text-gray-600">我們將發送確認郵件至您的信箱</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-yellow-600 font-bold text-sm">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">準備出貨</p>
                            <p className="text-sm text-gray-600">1-2個工作日內準備您的訂單</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-green-600 font-bold text-sm">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">配送中</p>
                            <p className="text-sm text-gray-600">
                              預計 {estimatedDeliveryDate.toLocaleDateString('zh-TW')} 送達
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-lg shadow print:shadow-none">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">付款摘要</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">商品小計</span>
                          <span className="font-medium">{formatPrice(total * 0.85)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">運費</span>
                          <span className="font-medium text-green-600">免費</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">稅金</span>
                          <span className="font-medium">{formatPrice(total * 0.08)}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">總計</span>
                            <span className="text-xl font-bold text-primary-600">
                              {formatPrice(total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Support */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 print:hidden">
                    <h3 className="font-medium text-blue-900 mb-3">需要協助？</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-blue-700">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>luotian@joy8899.com</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-blue-700">
                        <PhoneIcon className="w-4 h-4" />
                        <span>線上客服 24/7</span>
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      聯絡客服
                    </Link>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-lg shadow print:hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">快速操作</h3>
                      
                      <div className="space-y-3">
                        <Link
                          href="/account/orders"
                          className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                          <ShoppingBagIcon className="w-5 h-5" />
                          <span>查看所有訂單</span>
                        </Link>
                        
                        <Link
                          href="/products"
                          className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <span>繼續購物</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Tracking */}
            <div className="max-w-4xl mx-auto mt-12 print:hidden">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">配送追蹤</h2>
                  
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-8">
                      {[
                        {
                          status: 'completed',
                          title: '訂單已確認',
                          description: '我們已收到您的訂單並開始處理',
                          time: '剛才',
                          icon: CheckCircleIcon
                        },
                        {
                          status: 'pending',
                          title: '準備出貨',
                          description: '正在為您準備商品',
                          time: '1-2個工作日內',
                          icon: ShoppingBagIcon
                        },
                        {
                          status: 'pending',
                          title: '已發貨',
                          description: '商品已交給配送夥伴',
                          time: '2-3個工作日內',
                          icon: TruckIcon
                        },
                        {
                          status: 'pending',
                          title: '送達',
                          description: `預計送達日期: ${estimatedDeliveryDate.toLocaleDateString('zh-TW')}`,
                          time: estimatedDeliveryDate.toLocaleDateString('zh-TW'),
                          icon: CheckCircleIcon
                        }
                      ].map((step, index) => {
                        const Icon = step.icon
                        return (
                          <div key={index} className="relative flex items-start space-x-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.status === 'completed'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${
                                step.status === 'completed' ? 'text-green-600' : 'text-gray-900'
                              }`}>
                                {step.title}
                              </p>
                              <p className="text-sm text-gray-600">{step.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{step.time}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="max-w-4xl mx-auto mt-8 print:hidden">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="w-6 h-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900 mb-1">確認郵件已發送</h3>
                    <p className="text-yellow-700 text-sm">
                      我們已將訂單確認和收據發送至 <strong>{user?.email}</strong>。
                      請檢查您的收件匣，如未收到請查看垃圾郵件夾。
                    </p>
                    <p className="text-yellow-700 text-sm mt-2">
                      您將在商品發貨時收到追蹤資訊。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Products */}
            <div className="max-w-4xl mx-auto mt-12 print:hidden">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">您可能也喜歡</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: 'PETG 透明線材',
                        price: 32.99,
                        image: 'https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=300&h=300&fit=crop',
                        id: '9'
                      },
                      {
                        name: '專業樹脂清洗劑', 
                        price: 19.99,
                        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
                        id: '11'
                      },
                      {
                        name: '專業UV固化清洗工作站',
                        price: 299.99,
                        image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=300&fit=crop',
                        id: '12'
                      }
                    ].map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover rounded-md mb-3 group-hover:scale-105 transition-transform"
                        />
                        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-lg font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    ))}
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

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { orderId, total } = query

  if (!orderId || !total) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      orderId: orderId as string,
      total: parseFloat(total as string),
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
  }
}
