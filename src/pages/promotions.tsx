import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { TagIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/products/ProductCard'
import { products, promotions } from '@/data/products'

interface PromotionsProps {
  materialProducts: typeof products
  currentPromotions: typeof promotions
}

export default function Promotions({ materialProducts, currentPromotions }: PromotionsProps) {
  const { t } = useTranslation('common')

  return (
    <Layout
      seo={{
        title: 'BIZOE 優惠活動 - 耗材特價 $19.9-$39.9',
        description: '精選3D列印耗材特價優惠，Phrozen樹脂、PLA線材、PETG材料等，價格區間$19.9-$39.9',
        keywords: '3D列印材料, 樹脂, 線材, 特價, 優惠, Phrozen, PLA, PETG',
      }}
    >
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white section-padding">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 text-red-800 px-4 py-2 rounded-full font-bold text-lg animate-bounce">
                🔥 限時優惠
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block">耗材特價</span>
              <span className="block text-yellow-300">$19.9 - $39.9</span>
            </h1>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              精選高品質3D列印材料，超值價格，品質保證！<br/>
              包含Phrozen樹脂、PLA+線材、PETG材料等熱銷產品
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#materials" className="btn-primary bg-yellow-400 text-red-800 hover:bg-yellow-300">
                立即選購
              </Link>
              <Link href="#promotions" className="btn-outline border-white text-white hover:bg-white hover:text-red-600">
                查看活動詳情
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 活動亮點 */}
      <section className="section-padding bg-yellow-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              為什麼選擇我們的耗材？
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TagIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">超值價格</h3>
              <p className="text-gray-600">
                所有耗材產品價格控制在$19.9-$39.9區間，<br/>讓您以最優惠的價格獲得高品質材料
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">品質保證</h3>
              <p className="text-gray-600">
                嚴選Phrozen、Formlabs等知名品牌，<br/>每批材料都經過品質檢測，確保列印效果
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">快速發貨</h3>
              <p className="text-gray-600">
                現貨供應，當天下單當天發貨，<br/>讓您的創作計畫不中斷
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 特價耗材產品 */}
      <section id="materials" className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 特價耗材專區
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              精選高品質列印材料，價格實惠，適合各種列印需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {materialProducts.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    特價
                  </div>
                </div>
                <ProductCard
                  product={product}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 促銷活動詳情 */}
      <section id="promotions" className="section-padding bg-gray-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎉 當前優惠活動
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {currentPromotions.map((promotion) => (
              <div key={promotion.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
                  <p className="text-blue-100">{promotion.description}</p>
                  {promotion.discount > 0 && (
                    <div className="mt-4 inline-block bg-yellow-400 text-blue-800 px-4 py-2 rounded-full font-bold">
                      省{promotion.discount}%
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">活動期限：</span>
                    <span className="font-bold text-red-600">{promotion.validUntil}</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">適用商品：</p>
                    <div className="flex flex-wrap gap-2">
                      {promotion.applicableProducts.slice(0, 3).map((product) => (
                        <span key={product.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {product.name.split(' ')[0]}...
                        </span>
                      ))}
                      {promotion.applicableProducts.length > 3 && (
                        <span className="text-gray-500 text-sm">
                          +{promotion.applicableProducts.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </div>
                  <Link 
                    href="#materials"
                    className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    立即參與活動
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 客戶見證 */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              💬 客戶見證
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "購買了Phrozen樹脂，品質很好價格實惠，列印效果非常滿意！"
              </p>
              <p className="font-bold text-gray-900">- 張先生，模型愛好者</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "PLA+線材顏色豐富，列印穩定，是我們工作室的首選材料。"
              </p>
              <p className="font-bold text-gray-900">- 李小姐，設計工作室</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "服務很好，發貨快速，材料品質穩定，會繼續支持！"
              </p>
              <p className="font-bold text-gray-900">- 王老師，學校實驗室</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 區域 */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              立即開始您的3D列印之旅
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              精選耗材，超值價格，現在就選購您需要的材料
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#materials" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                瀏覽所有耗材
              </Link>
              <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-blue-600">
                聯絡客服
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // 篩選出列印材料類別的產品（價格在19.9-39.9區間）
  const materialProducts = products.filter(product => product.categoryId === '2')
  
  return {
    props: {
      materialProducts,
      currentPromotions: promotions,
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
    revalidate: 60,
  }
}
