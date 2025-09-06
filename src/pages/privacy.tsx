import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/Layout'

export default function Privacy() {
  const { t } = useTranslation('common')

  return (
    <Layout
      seo={{
        title: '隱私政策 - BIZOE',
        description: 'BIZOE隱私政策 - 了解我們如何保護您的個人資料',
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('footer.privacy_policy')}
              </h1>
              <p className="text-gray-600">
                最後更新日期：2024年1月1日
              </p>
              <p className="text-gray-600 mt-2">
                生效日期：2024年1月1日
              </p>
            </div>

            <div className="prose max-w-none">
              <h2>1. 資料收集</h2>
              <p>
                我們收集以下類型的個人資料：
              </p>
              <ul>
                <li><strong>帳戶資訊</strong>：姓名、電子郵件地址、電話號碼、密碼</li>
                <li><strong>訂單資訊</strong>：配送地址、付款資訊、購買記錄</li>
                <li><strong>技術資訊</strong>：IP地址、瀏覽器類型、裝置資訊</li>
                <li><strong>使用資訊</strong>：網站使用情況、偏好設定</li>
              </ul>

              <h2>2. 資料使用</h2>
              <p>
                我們使用您的個人資料用於：
              </p>
              <ul>
                <li>處理和履行您的訂單</li>
                <li>提供客戶服務和技術支援</li>
                <li>發送產品更新和優惠資訊（經您同意）</li>
                <li>改善我們的產品和服務</li>
                <li>防止欺詐和確保安全</li>
                <li>遵守法律義務</li>
              </ul>

              <h2>3. 資料分享</h2>
              <p>
                我們不會出售、交易或出租您的個人資料。我們只會在以下情況下分享您的資料：
              </p>
              <ul>
                <li><strong>服務提供商</strong>：與協助我們運營業務的第三方服務商（如付款處理商、物流公司）</li>
                <li><strong>法律要求</strong>：當法律要求或為保護我們的權利時</li>
                <li><strong>業務轉讓</strong>：在併購、出售或資產轉讓的情況下</li>
              </ul>

              <h2>4. 資料安全</h2>
              <p>
                我們實施以下安全措施保護您的個人資料：
              </p>
              <ul>
                <li>256位SSL加密保護資料傳輸</li>
                <li>安全的資料儲存和定期備份</li>
                <li>嚴格的員工存取控制</li>
                <li>定期安全審計和更新</li>
                <li>PCI DSS合規的付款處理</li>
              </ul>

              <h2>5. Cookies政策</h2>
              <p>
                我們使用Cookies來：
              </p>
              <ul>
                <li>記住您的偏好設定和登入狀態</li>
                <li>分析網站使用情況以改善用戶體驗</li>
                <li>提供個性化內容和廣告</li>
                <li>確保網站安全和防止欺詐</li>
              </ul>
              <p>
                您可以通過瀏覽器設定管理或禁用Cookies，但這可能影響網站的某些功能。
              </p>

              <h2>6. 您的權利</h2>
              <p>
                根據適用的資料保護法律，您有以下權利：
              </p>
              <ul>
                <li><strong>存取權</strong>：查看我們持有的關於您的資料</li>
                <li><strong>更正權</strong>：要求更正不準確的資料</li>
                <li><strong>刪除權</strong>：要求刪除您的個人資料</li>
                <li><strong>限制權</strong>：限制我們處理您的資料</li>
                <li><strong>可攜權</strong>：以結構化格式獲取您的資料</li>
                <li><strong>反對權</strong>：反對我們處理您的資料</li>
              </ul>

              <h2>7. 資料保留</h2>
              <p>
                我們只會在必要期間保留您的個人資料：
              </p>
              <ul>
                <li>帳戶資料：直到您刪除帳戶為止</li>
                <li>訂單記錄：7年（為了會計和法律目的）</li>
                <li>技術日誌：最多2年</li>
                <li>行銷資料：直到您取消訂閱為止</li>
              </ul>

              <h2>8. 國際轉移</h2>
              <p>
                您的個人資料可能被傳輸到您所在國家/地區以外的地方進行處理和儲存。我們確保所有跨境資料傳輸都符合適用的資料保護法律。
              </p>

              <h2>9. 政策更新</h2>
              <p>
                我們可能會定期更新此隱私政策。任何重大變更將通過電子郵件或網站通知的方式提前30天通知您。
              </p>

              <h2>10. 聯絡我們</h2>
              <p>
                如果您對此隱私政策有任何疑問或要行使您的權利，請聯絡我們：
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <p><strong>BIZOE INTERACTIVE INFORMATION TECHNOLOGY CO., LIMITED</strong></p>
                <p>地址：香港中環皇后大道中99號中環中心15樓</p>
                <p>電子郵件：{t('company.email')}</p>
                <p>電話：+852 2123-4567</p>
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
