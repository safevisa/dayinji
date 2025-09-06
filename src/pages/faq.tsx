import { useState } from 'react'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQ() {
  const { t } = useTranslation('common')
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const faqData: FAQItem[] = [
    // 產品相關
    {
      category: 'products',
      question: '你們銷售的3D列印機品牌有哪些？',
      answer: '我們主要銷售Phrozen、Formlabs、Bambu Lab、CREALITY等知名品牌的3D列印機。每個品牌都有其特色和優勢，我們的專業團隊可以根據您的需求推薦最適合的設備。'
    },
    {
      category: 'products', 
      question: '列印材料的價格範圍是多少？',
      answer: '我們的耗材產品價格區間在$19.9到$39.9之間，包括各種樹脂、PLA+線材、PETG材料等。我們致力於提供高品質但價格合理的材料。'
    },
    {
      category: 'products',
      question: '如何選擇適合的3D列印機？',
      answer: '選擇3D列印機需要考慮：1) 列印需求（精度、尺寸）2) 材料類型（樹脂vs線材）3) 預算範圍 4) 使用頻率。歡迎聯絡我們的技術團隊獲得專業建議。'
    },
    
    // 訂單配送
    {
      category: 'shipping',
      question: '配送需要多長時間？',
      answer: '配送時間因地區而異：香港1-3個工作日、台灣3-5個工作日、中國大陸3-5個工作日、北美5-7個工作日、其他地區7-14個工作日。'
    },
    {
      category: 'shipping',
      question: '運費如何計算？',
      answer: '訂單滿$100享免費標準配送，未滿$100的訂單收取$9.99運費。快速配送服務額外收費$19.99。'
    },
    {
      category: 'shipping', 
      question: '可以修改配送地址嗎？',
      answer: '在訂單發貨前，您可以聯絡我們修改配送地址。一旦商品發貨，將無法更改地址。'
    },

    // 付款相關
    {
      category: 'payment',
      question: '支援哪些付款方式？',
      answer: '我們支援Visa、Mastercard、American Express信用卡，以及PayPal、Apple Pay、Google Pay等數字錢包。所有付款都經過SSL加密保護。'
    },
    {
      category: 'payment',
      question: '付款安全嗎？',
      answer: '是的，我們使用256位SSL加密和PCI DSS合規的付款處理系統。您的信用卡資訊不會儲存在我們的服務器上。'
    },
    {
      category: 'payment',
      question: '可以使用促銷碼嗎？',
      answer: '可以！我們定期提供促銷碼優惠。有效的促銷碼包括WELCOME10（10%折扣）、SAVE15（15%折扣）等。請在結帳時輸入促銷碼。'
    },

    // 售後服務
    {
      category: 'support',
      question: '產品有保固嗎？',
      answer: '所有設備都提供1年製造商保固，涵蓋製造缺陷。耗材提供品質保證，非人為損壞可退換。詳細保固條款請參考產品頁面。'
    },
    {
      category: 'support',
      question: '如何申請退貨？',
      answer: '商品收到後7天內，保持原包裝未使用狀態可申請退貨。請聯絡客服申請退貨授權號碼（RMA），並按照指示寄回商品。'
    },
    {
      category: 'support',
      question: '技術支援服務如何獲得？',
      answer: '我們提供多種技術支援：1) 電子郵件支援 2) 線上客服聊天 3) 電話技術支援 4) 遠程協助。大部分問題可在24小時內獲得回應。'
    },

    // 技術問題
    {
      category: 'technical',
      question: '3D列印失敗了怎麼辦？',
      answer: '列印失敗的常見原因：1) 平台調平問題 2) 材料設定不當 3) 模型檔案問題。我們提供詳細的故障排除指南和技術支援。'
    },
    {
      category: 'technical',
      question: '樹脂列印需要什麼設備？',
      answer: '樹脂列印需要：1) SLA/LCD 3D列印機 2) 清洗劑（異丙醇） 3) UV固化設備 4) 防護用品（手套、口罩） 5) 通風良好的工作環境。'
    },
    {
      category: 'technical',
      question: '新手應該從什麼設備開始？',
      answer: '建議新手從FDM列印機開始，如Bambu Lab A1或Phrozen Arco，操作相對簡單，材料安全。熟悉後可嘗試樹脂列印獲得更高精度。'
    }
  ]

  const categories = [
    { id: 'all', label: '全部問題', icon: '📋' },
    { id: 'products', label: '產品相關', icon: '🖨️' },
    { id: 'shipping', label: '訂單配送', icon: '🚚' },
    { id: 'payment', label: '付款相關', icon: '💳' },
    { id: 'support', label: '售後服務', icon: '🛠️' },
    { id: 'technical', label: '技術問題', icon: '⚙️' }
  ]

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory)

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <Layout
      seo={{
        title: '常見問題 FAQ - BIZOE',
        description: '找到關於BIZOE 3D列印產品和服務的常見問題解答',
      }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              常見問題 FAQ
            </h1>
            <p className="text-xl text-primary-100">
              快速找到您需要的答案，或聯絡我們的專業客服團隊
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Filter */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">問題分類</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">沒有找到相關問題</h3>
                    <p className="text-gray-600">請嘗試選擇其他分類或直接聯絡客服</p>
                  </div>
                ) : (
                  filteredFAQs.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow border border-gray-200">
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {item.question}
                        </h3>
                        {openItems.includes(index) ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {openItems.includes(index) && (
                        <div className="px-6 pb-6">
                          <div className="border-t pt-4">
                            <p className="text-gray-700 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Contact CTA */}
              <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">還有其他問題？</h3>
                <p className="text-primary-100 mb-6">
                  我們的專業客服團隊隨時為您提供協助
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`mailto:${t('company.email')}`}
                    className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    📧 發送郵件
                  </a>
                  <a
                    href="/contact"
                    className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    💬 聯絡客服
                  </a>
                </div>
              </div>
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
