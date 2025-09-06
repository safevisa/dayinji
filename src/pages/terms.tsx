import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/Layout'

export default function Terms() {
  const { t } = useTranslation('common')

  return (
    <Layout
      seo={{
        title: '服務條款 - BIZOE',
        description: 'BIZOE服務條款 - 了解我們的服務條件和使用規範',
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('footer.terms_of_service')}
              </h1>
              <p className="text-gray-600">
                最後更新日期：2024年1月1日
              </p>
              <p className="text-gray-600 mt-2">
                生效日期：2024年1月1日
              </p>
            </div>

            <div className="prose max-w-none">
              <h2>1. 接受條款</h2>
              <p>
                歡迎使用BIZOE的服務。通過存取或使用我們的網站和服務，您同意受這些服務條款的約束。如果您不同意這些條款，請不要使用我們的服務。
              </p>

              <h2>2. 服務描述</h2>
              <p>
                BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED（以下簡稱"BIZOE"或"我們"）提供：
              </p>
              <ul>
                <li>3D列印設備銷售</li>
                <li>3D列印材料和耗材</li>
                <li>後處理設備和工具</li>
                <li>3D掃描設備</li>
                <li>技術支援和諮詢服務</li>
                <li>相關的售後服務</li>
              </ul>

              <h2>3. 用戶帳戶</h2>
              <h3>3.1 帳戶註冊</h3>
              <ul>
                <li>您必須提供準確、完整的資料</li>
                <li>您有責任保護帳戶密碼的安全</li>
                <li>您必須年滿18歲才能註冊帳戶</li>
                <li>每個用戶只能註冊一個帳戶</li>
              </ul>

              <h3>3.2 帳戶責任</h3>
              <ul>
                <li>您負責在您帳戶下進行的所有活動</li>
                <li>您必須立即通知我們任何未經授權的使用</li>
                <li>我們有權暫停或終止違反條款的帳戶</li>
              </ul>

              <h2>4. 訂單和付款</h2>
              <h3>4.1 訂單處理</h3>
              <ul>
                <li>所有訂單需經我們確認後方為有效</li>
                <li>我們保留拒絕任何訂單的權利</li>
                <li>產品價格和可用性可能隨時變更</li>
                <li>特價優惠可能有時間限制</li>
              </ul>

              <h3>4.2 付款條件</h3>
              <ul>
                <li>支援的付款方式：Visa、Mastercard、PayPal、Apple Pay、Google Pay</li>
                <li>付款需在下單時完成</li>
                <li>所有價格均以美元計算，包含適用稅費</li>
                <li>我們使用第三方付款處理商確保交易安全</li>
              </ul>

              <h2>5. 配送和交付</h2>
              <h3>5.1 配送政策</h3>
              <ul>
                <li>訂單滿$100享免費標準配送</li>
                <li>標準配送時間：3-7個工作日</li>
                <li>快速配送：1-3個工作日（額外收費）</li>
                <li>國際配送時間可能因海關處理而延長</li>
              </ul>

              <h3>5.2 配送範圍</h3>
              <ul>
                <li>香港、台灣：1-3個工作日</li>
                <li>中國大陸：3-5個工作日</li>
                <li>北美地區：5-7個工作日</li>
                <li>其他地區：7-14個工作日</li>
              </ul>

              <h2>6. 退換貨政策</h2>
              <h3>6.1 退貨條件</h3>
              <ul>
                <li>商品收到後7天內可申請退貨</li>
                <li>商品必須保持原包裝和未使用狀態</li>
                <li>定制商品不適用退貨政策</li>
                <li>耗材（樹脂、線材）開封後不可退貨</li>
              </ul>

              <h3>6.2 退款處理</h3>
              <ul>
                <li>退款將在收到退貨商品後3-5個工作日內處理</li>
                <li>退款將返回到原付款方式</li>
                <li>退貨運費由客戶承擔（商品缺陷除外）</li>
              </ul>

              <h2>7. 保固政策</h2>
              <ul>
                <li><strong>3D列印機</strong>：1年製造商保固</li>
                <li><strong>後處理設備</strong>：1年製造商保固</li>
                <li><strong>掃描設備</strong>：1年製造商保固</li>
                <li><strong>耗材</strong>：品質保證，非人為損壞可退換</li>
              </ul>

              <h2>8. 知識產權</h2>
              <ul>
                <li>網站內容受版權法保護</li>
                <li>商標和標誌屬於各自所有者</li>
                <li>未經許可不得複製或使用網站內容</li>
                <li>用戶上傳的內容仍屬用戶所有</li>
              </ul>

              <h2>9. 責任限制</h2>
              <p>
                在法律允許的最大範圍內：
              </p>
              <ul>
                <li>我們的責任限於您支付的產品價格</li>
                <li>我們不對間接、特殊或後果性損害承擔責任</li>
                <li>產品的具體保固條款以製造商政策為準</li>
                <li>我們不保證服務的持續可用性</li>
              </ul>

              <h2>10. 適用法律</h2>
              <ul>
                <li>本條款受香港特別行政區法律管轄</li>
                <li>任何爭議將提交香港法院管轄</li>
                <li>如條款的任何部分無效，其餘部分仍然有效</li>
              </ul>

              <h2>11. 條款修改</h2>
              <p>
                我們保留隨時修改這些條款的權利。重大變更將提前30天通過電子郵件或網站通知。繼續使用我們的服務表示您接受修改後的條款。
              </p>

              <h2>12. 聯絡資訊</h2>
              <p>
                如果您對這些服務條款有任何疑問，請聯絡我們：
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mt-4">
                <p><strong>BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED</strong></p>
                <p>地址：香港中環皇后大道中99號中環中心15樓</p>
                <p>電子郵件：{t('company.email')}</p>
                <p>電話：+852 2123-4567</p>
                <p>客服時間：週一至週五 09:00-18:00 (香港時間)</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                <h3 className="font-bold text-green-800 mb-2">重要提醒</h3>
                <p className="text-green-700">
                  請仔細閱讀並理解這些條款。如果您對任何條款有疑問，請在購買前聯絡我們的客服團隊。
                </p>
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
