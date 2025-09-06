import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'

export default function LanguageTest() {
  const { t } = useTranslation('common')
  const router = useRouter()

  const testKeys = [
    'company.name',
    'navigation.home',
    'navigation.products', 
    'navigation.promotions',
    'products.3d_printers',
    'products.printing_materials',
    'products.add_to_cart',
    'cart.title',
    'auth.login',
    'auth.register',
    'promotions.special_price',
    'contact.title'
  ]

  return (
    <Layout
      seo={{
        title: '語言測試頁面 - BIZOE',
        description: '測試多語言功能是否正常',
      }}
    >
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">語言切換測試</h1>
              <div className="text-lg">
                當前語言: <span className="font-bold text-primary-600">{router.locale === 'zh-TW' ? '繁體中文' : 'English'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">翻譯鍵測試</h2>
                <div className="space-y-2">
                  {testKeys.map((key) => (
                    <div key={key} className="flex justify-between items-center p-2 border-b">
                      <span className="text-sm text-gray-600 font-mono">{key}:</span>
                      <span className="font-medium">{t(key)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">快速導航測試</h2>
                <div className="space-y-3">
                  <a href="/" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    🏠 {t('navigation.home')}
                  </a>
                  <a href="/products" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    📦 {t('navigation.products')}
                  </a>
                  <a href="/promotions" className="block p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    🔥 {t('navigation.promotions')}
                  </a>
                  <a href="/contact" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    📞 {t('navigation.contact')}
                  </a>
                  <a href="/auth/login" className="block p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                    👤 {t('navigation.login')}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">測試說明</h3>
              <p className="text-green-700 text-sm">
                請點擊右上角的語言切換按鈕（繁中/EN），然後觀察此頁面的文字是否正確切換。
                如果切換正常，說明多語言系統運作正確。
              </p>
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
