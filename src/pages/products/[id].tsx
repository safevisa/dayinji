import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { 
  StarIcon, 
  HeartIcon,
  ShoppingCartIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/products/ProductCard'
import { Product, products } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`已将 ${quantity} 件商品加入购物车`)
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    router.push('/cart')
  }

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('请先登录')
      router.push('/auth/login')
      return
    }
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? '已从收藏夹移除' : '已加入收藏夹')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const calculateSavings = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return ((product.originalPrice - product.price) / product.originalPrice * 100).toFixed(0)
    }
    return 0
  }

  return (
    <Layout
      seo={{
        title: `${product.name} - BIZOE`,
        description: product.description,
        keywords: `${product.brand}, ${product.category}, 3D列印, ${product.name}`,
        image: product.images[0],
      }}
    >
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">首頁</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">商品</Link>
            <span>/</span>
            <Link href={`/products?category=${product.categoryId}`} className="hover:text-primary-600">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-primary-600' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 font-medium">{product.brand}</span>
                <button
                  onClick={handleWishlist}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(128 評價)</span>
                <span className="text-sm text-green-600">✓ 現貨供應</span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm font-bold px-2 py-1 rounded">
                        省{calculateSavings()}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">含稅價格，免運費（訂單滿$100）</p>
              </div>

              {/* Stock Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    現貨 {product.stockQuantity} 件 - 立即發貨
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">數量：</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stockQuantity}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    (庫存: {product.stockQuantity} 件)
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>立即購買</span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border border-primary-600 text-primary-600 py-3 px-6 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>加入購物車</span>
                  </button>
                </div>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5" />
                  <span>免費配送</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>品質保證</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckIcon className="w-5 h-5" />
                  <span>7天退換</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="border-t bg-white">
        <div className="container section-padding">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex border-b mb-8">
              {[
                { id: 'description', label: '產品描述' },
                { id: 'specifications', label: '詳細規格' },
                { id: 'reviews', label: '客戶評價' },
                { id: 'shipping', label: '配送資訊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold mb-4">產品描述</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                  
                  <h4 className="text-lg font-bold mb-3">主要特點</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 高精度列印技術，細節表現優異</li>
                    <li>• 穩定可靠的結構設計，適合長時間工作</li>
                    <li>• 操作簡單，適合專業和業餘用戶</li>
                    <li>• 兼容多種材料，應用範圍廣泛</li>
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">詳細規格</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="border-b pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">{key}</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">客戶評價</h3>
                  <div className="space-y-6">
                    {/* Review Summary */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary-600">4.8</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">128 評價</div>
                        </div>
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2 mb-1">
                              <span className="text-sm w-8">{rating}星</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {rating === 5 ? 89 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 4 : 2}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      {[
                        { name: '張小明', rating: 5, comment: '產品品質很好，列印效果超出預期，服務也很棒！', date: '2024-01-15' },
                        { name: '李小華', rating: 5, comment: '非常滿意，包裝完善，發貨速度快，推薦購買！', date: '2024-01-12' },
                        { name: '王大衛', rating: 4, comment: '整體不錯，性價比很高，唯一不足是說明書可以更詳細一些。', date: '2024-01-10' }
                      ].map((review, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.name}</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarSolidIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">配送資訊</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-bold">配送方式</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• 標準配送：3-5個工作日</li>
                          <li>• 快速配送：1-2個工作日（+$9.99）</li>
                          <li>• 當日配送：限特定地區（+$19.99）</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold">運費說明</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• 訂單滿$100免運費</li>
                          <li>• 一般運費：$9.99</li>
                          <li>• 偏遠地區可能額外收費</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <h4 className="font-bold text-blue-800 mb-2">退換貨政策</h4>
                      <p className="text-blue-700">商品到貨7天內，如有品質問題或不滿意，可申請退換貨。商品需保持完整包裝，我們將提供免費退貨服務。</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">相關商品</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const productId = params?.id as string
  
  // 找到指定產品
  const product = products.find(p => p.id === productId)
  
  if (!product) {
    return {
      notFound: true
    }
  }
  
  // 找到相關產品（同類別的其他產品）
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)
  
  return {
    props: {
      product,
      relatedProducts,
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
  }
}
