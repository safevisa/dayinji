import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { TruckIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'

export default function Shipping() {
  const { t } = useTranslation('common')

  return (
    <Layout
      seo={{
        title: '配送資訊 - BIZOE',
        description: '了解BIZOE的配送政策、時間和費用',
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container py-16">
            <div className="max-w-4xl mx-auto text-center">
              <TruckIcon className="w-20 h-20 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                配送資訊
              </h1>
              <p className="text-xl text-primary-100">
                全球快速配送，讓您的3D列印設備儘快送達
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Zones */}
        <section className="section-padding">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">配送區域和時效</h2>
              <p className="text-lg text-gray-600">我們服務全球客戶</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  region: '香港',
                  flag: '🇭🇰',
                  time: '1-2個工作日',
                  fee: '$4.99',
                  free: '$80'
                },
                {
                  region: '台灣',
                  flag: '🇹🇼',
                  time: '3-5個工作日',
                  fee: '$8.99',
                  free: '$100'
                },
                {
                  region: '北美',
                  flag: '🇺🇸',
                  time: '5-10個工作日',
                  fee: '$15.99',
                  free: '$150'
                }
              ].map((zone, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="text-center mb-4">
                    <span className="text-4xl mb-2 block">{zone.flag}</span>
                    <h3 className="text-xl font-bold text-gray-900">{zone.region}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">配送時間:</span>
                      <span className="font-medium">{zone.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">運費:</span>
                      <span className="font-medium">{zone.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">免運門檻:</span>
                      <span className="font-bold text-green-600">{zone.free}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-padding bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              配送特色
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">即時追蹤</h3>
                <p className="text-gray-600">即時追蹤您的訂單狀態和配送進度</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">快速配送</h3>
                <p className="text-gray-600">與知名物流合作，確保快速安全送達</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">全球服務</h3>
                <p className="text-gray-600">服務全球多個國家和地區</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section-padding bg-primary-50">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                配送相關問題？
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                聯絡我們的客服團隊獲得協助
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${t('company.email')}`}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  📧 郵件諮詢
                </a>
                <a
                  href="/contact"
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  💬 聯絡客服
                </a>
              </div>
            </div>
          </div>
        </section>
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