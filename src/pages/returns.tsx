import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { 
  TruckIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'

export default function Returns() {
  const { t } = useTranslation('common')

  return (
    <Layout
      seo={{
        title: '退換貨政策 - BIZOE',
        description: 'BIZOE退換貨政策 - 了解我們的退貨條件和流程',
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-white border-b">
          <div className="container py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                退換貨政策
              </h1>
              <p className="text-lg text-gray-600">
                我們致力於確保您對購買的產品完全滿意
              </p>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Overview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h2 className="font-bold text-blue-900 mb-2">7天無條件退貨保證</h2>
                  <p className="text-blue-800">
                    商品收到後7天內，如對產品不滿意，可申請退貨。我們承諾快速處理您的退貨申請。
                  </p>
                </div>
              </div>
            </div>

            {/* Return Conditions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🔄 退貨條件
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center">
                    <CheckCircleIcon className="w-6 h-6 mr-2" />
                    可以退貨的商品
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 3D列印機（保持原包裝，未使用）</li>
                    <li>• 後處理設備（未拆封使用）</li>
                    <li>• 3D掃描器（原包裝完整）</li>
                    <li>• 雷射雕刻機（未使用狀態）</li>
                    <li>• 未開封的耗材產品</li>
                    <li>• 配件和工具（原包裝）</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
                    <XCircleIcon className="w-6 h-6 mr-2" />
                    不可退貨的商品
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 已開封的樹脂材料</li>
                    <li>• 已使用的線材耗材</li>
                    <li>• 定制或個性化商品</li>
                    <li>• 已安裝的軟體產品</li>
                    <li>• 超過7天退貨期限的商品</li>
                    <li>• 人為損壞的商品</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Return Process */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📝 退貨流程
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  {
                    step: '1',
                    title: '聯絡客服',
                    description: '發送郵件到客服信箱或使用線上聊天申請退貨',
                    icon: '📧'
                  },
                  {
                    step: '2', 
                    title: '獲得授權',
                    description: '我們會提供退貨授權號碼(RMA)和退貨地址',
                    icon: '🔢'
                  },
                  {
                    step: '3',
                    title: '寄回商品',
                    description: '將商品連同RMA號碼一起寄回指定地址',
                    icon: '📦'
                  },
                  {
                    step: '4',
                    title: '退款處理',
                    description: '收到商品後3-5個工作日內處理退款',
                    icon: '💰'
                  }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Timeline */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ⏰ 時間說明
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-blue-200 rounded-lg p-6">
                  <ClockIcon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">退貨期限</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">7天</p>
                  <p className="text-gray-600 text-sm">從收到商品當日算起</p>
                </div>

                <div className="border border-green-200 rounded-lg p-6">
                  <TruckIcon className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">退款處理</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">3-5天</p>
                  <p className="text-gray-600 text-sm">收到退貨後處理時間</p>
                </div>

                <div className="border border-purple-200 rounded-lg p-6">
                  <ShieldCheckIcon className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">品質檢查</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">1-2天</p>
                  <p className="text-gray-600 text-sm">退貨商品檢查時間</p>
                </div>
              </div>
            </div>

            {/* Special Cases */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🔍 特殊情況
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">商品缺陷或損壞</h3>
                  <p className="text-gray-700">
                    如果收到的商品有缺陷或在運輸過程中損壞，請立即聯絡我們。我們將：
                  </p>
                  <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                    <li>• 提供免費退貨運費標籤</li>
                    <li>• 優先處理您的退貨申請</li>
                    <li>• 提供換貨或全額退款選擇</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">錯誤配送</h3>
                  <p className="text-gray-700">
                    如果收到錯誤的商品，請保留原包裝並立即聯絡客服。我們將安排取貨並重新配送正確的商品，所有費用由我們承擔。
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">大型設備退貨</h3>
                  <p className="text-gray-700">
                    對於3D列印機等大型設備，我們會安排專業物流公司上門取貨。請確保設備已妥善包裝且包含所有配件。
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">需要申請退貨？</h2>
                <p className="text-primary-100 mb-6">
                  請通過以下方式聯絡我們的客服團隊
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="font-bold mb-3">📧 郵件申請</h3>
                    <p className="text-primary-100 mb-3">
                      發送郵件至：{t('company.email')}
                    </p>
                    <p className="text-sm text-primary-200">
                      請包含：訂單號碼、商品資訊、退貨原因
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="font-bold mb-3">💬 線上客服</h3>
                    <p className="text-primary-100 mb-3">
                      24/7線上聊天支援
                    </p>
                    <p className="text-sm text-primary-200">
                      即時回應，快速處理退貨申請
                    </p>
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
