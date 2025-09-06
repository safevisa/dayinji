import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { 
  UserGroupIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'

export default function About() {
  const { t } = useTranslation('common')

  return (
    <Layout
      seo={{
        title: '關於我們 - BIZOE',
        description: 'BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED - 專業3D列印解決方案提供商',
      }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('footer.about_us')}
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              {t('company.name')}
            </p>
            <p className="text-lg text-primary-200 mt-4 max-w-2xl mx-auto">
              專業的3D列印技術公司，致力於為全球客戶提供高品質的3D列印設備、材料和解決方案
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                我們的故事
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  BIZOE成立於香港，是一家專注於3D列印技術的創新公司。我們深信3D列印技術將改變製造業的未來，因此致力於為客戶提供最先進、最可靠的3D列印解決方案。
                </p>
                <p>
                  從成立之初，我們就與全球知名的3D列印品牌建立了緊密的合作關係，包括Phrozen、Formlabs、Bambu Lab等行業領導者。這使我們能夠為客戶提供最新、最優質的產品。
                </p>
                <p>
                  我們不僅是設備供應商，更是您3D列印之旅的專業夥伴。從產品選型到技術支援，從材料推薦到後處理指導，我們的專業團隊始終陪伴在您身邊。
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400"
                alt="BIZOE Office"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-xl">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold">2024年度最佳3D列印服務商</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              我們的核心價值
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              指導我們每一個決策和行動的核心理念
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-lg p-6 shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">品質第一</h3>
              <p className="text-gray-600">
                嚴格的品質控制，確保每一件產品都達到專業標準
              </p>
            </div>

            <div className="text-center bg-white rounded-lg p-6 shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">客戶至上</h3>
              <p className="text-gray-600">
                以客戶需求為中心，提供個性化的解決方案和服務
              </p>
            </div>

            <div className="text-center bg-white rounded-lg p-6 shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">專業團隊</h3>
              <p className="text-gray-600">
                經驗豐富的工程師和技術專家，提供專業諮詢
              </p>
            </div>

            <div className="text-center bg-white rounded-lg p-6 shadow-md">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">快速服務</h3>
              <p className="text-gray-600">
                高效的物流配送和及時的技術支援服務
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">公司資訊</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <GlobeAltIcon className="w-6 h-6 text-primary-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">公司名稱</h3>
                      <p className="text-gray-600">{t('company.name')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-600 rounded mt-1 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">HK</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">總部地址</h3>
                      <p className="text-gray-600">香港中環皇后大道中99號中環中心15樓</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <UserGroupIcon className="w-6 h-6 text-primary-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">服務範圍</h3>
                      <p className="text-gray-600">全球配送，香港、台灣、北美優先服務</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">聯絡方式</h2>
                <div className="space-y-6">
                  <div className="bg-primary-50 rounded-lg p-6">
                    <h3 className="font-bold text-primary-900 mb-3">客戶服務</h3>
                    <div className="space-y-2">
                      <p className="text-primary-800">📧 {t('company.email')}</p>
                      <p className="text-primary-800">📞 +852 2123-4567</p>
                      <p className="text-primary-800">🕐 週一至週五 09:00-18:00 (香港時間)</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-3">技術支援</h3>
                    <div className="space-y-2">
                      <p className="text-gray-800">📧 support@bizoe.com</p>
                      <p className="text-gray-800">💬 線上客服 24/7</p>
                      <p className="text-gray-800">📱 WhatsApp: +852 9876-5432</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">成就數據</h2>
            <p className="text-xl text-primary-100">
              用數字見證我們的專業實力
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5000+</div>
              <p className="text-primary-100">滿意客戶</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-primary-100">合作品牌</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-primary-100">技術支援</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <p className="text-primary-100">國家服務</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              專業團隊
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我們的團隊由資深的3D列印專家和工程師組成
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'David Chen',
                role: '技術總監',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
                description: '10年3D列印行業經驗，專精於SLA和FDM技術'
              },
              {
                name: 'Sarah Liu',
                role: '產品經理',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b03c?w=300&h=300&fit=crop',
                description: '負責產品規劃和市場分析，確保產品符合客戶需求'
              },
              {
                name: 'Michael Wong',
                role: '客戶服務經理',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
                description: '專注於客戶體驗優化，提供專業的售前售後服務'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                🎯 我們的使命
              </h2>
              <p className="text-blue-800 text-lg leading-relaxed">
                讓3D列印技術更加普及和易用，為每個創作者提供實現想法的工具和支援，推動創新製造的發展。
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-green-900 mb-4">
                🌟 我們的願景
              </h2>
              <p className="text-green-800 text-lg leading-relaxed">
                成為亞太地區最受信賴的3D列印解決方案提供商，引領行業創新，為客戶創造最大價值。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">合作夥伴</h2>
            <p className="text-lg text-gray-300">
              與全球頂尖品牌緊密合作，為您提供最優質的產品
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {[
              'Phrozen', 'Formlabs', 'Bambu Lab', 'Shining3D', 'CREALITY', 'Cubiio'
            ].map((brand, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 rounded-lg p-6 hover:bg-white/20 transition-colors">
                  <span className="text-lg font-bold">{brand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-primary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              想了解更多？
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              歡迎聯絡我們，了解BIZOE如何幫助您實現3D列印目標
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${t('company.email')}`}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                聯絡我們
              </a>
              <a
                href="/products"
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                瀏覽產品
              </a>
            </div>
          </div>
        </div>
      </section>
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
