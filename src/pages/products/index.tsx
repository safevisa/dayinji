import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/products/ProductCard'
import { products, categories } from '@/data/products'

interface ProductsPageProps {
  allProducts: typeof products
  allCategories: typeof categories
}

export default function ProductsPage({ allProducts, allCategories }: ProductsPageProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 应用过滤器
  const applyFilters = () => {
    let filtered = [...allProducts]

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 类别过滤
    if (selectedCategory) {
      const category = allCategories.find(cat => cat.slug === selectedCategory)
      if (category) {
        filtered = filtered.filter(product => product.categoryId === category.id)
      }
    }

    // 排序
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        filtered.sort(() => Math.random() - 0.5) // 随机排序模拟newest
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
  }

  // 从URL获取过滤器参数
  useEffect(() => {
    if (router.isReady) {
      const { category, search } = router.query
      
      if (category && typeof category === 'string') {
        setSelectedCategory(category)
      }
      if (search && typeof search === 'string') {
        setSearchQuery(search)
      }
    }
  }, [router.isReady, router.query])

  // 当过滤器改变时重新筛选
  useEffect(() => {
    if (mounted) {
      applyFilters()
    }
  }, [selectedCategory, searchQuery, sortBy, mounted])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSortBy('featured')
    setFilteredProducts(allProducts)
  }

  if (!mounted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('messages.loading')}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      seo={{
        title: `${t('products.product_catalog')} - BIZOE`,
        description: '瀏覽我們的3D列印設備、材料和配件',
      }}
    >
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('products.product_catalog')}</h1>
                <p className="text-gray-600 mt-1">
                  {filteredProducts.length} {t('products.items_found')}
                  {selectedCategory && (
                    <span className="ml-2">
                      在 "{allCategories.find(cat => cat.slug === selectedCategory) ? t(allCategories.find(cat => cat.slug === selectedCategory)!.name) : ''}"
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">{t('products.filter')}</h2>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('products.search_products')}
                    </label>
                    <form onSubmit={handleSearch} className="flex space-x-2">
                      <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input flex-1"
                        placeholder={t('products.search_products')}
                      />
                      <button
                        type="submit"
                        className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700"
                      >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                      </button>
                    </form>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">{t('navigation.categories')}</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={selectedCategory === ''}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{t('products.all_categories')}</span>
                      </label>
                      {allCategories.map((category) => (
                        <label key={category.id} className="flex items-center">
                          <input
                            type="radio"
                            name="category"
                            value={category.slug}
                            checked={selectedCategory === category.slug}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {t(category.name)} ({category.productCount})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Apply/Clear Filters */}
                  <div className="space-y-2">
                    <button
                      onClick={applyFilters}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      {t('buttons.apply')}
                    </button>
                    <button
                      onClick={clearFilters}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {t('buttons.clear')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort Controls */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">{t('products.sort_by')}:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="featured">{t('products.featured_products')}</option>
                      <option value="newest">{t('products.newest')}</option>
                      <option value="price_low">{t('products.price_low_to_high')}</option>
                      <option value="price_high">{t('products.price_high_to_low')}</option>
                      <option value="name">{t('products.name_a_to_z')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{t('products.no_products_found')}</h3>
                  <p className="text-gray-600 mb-6">
                    請嘗試調整您的搜尋條件或篩選器
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    重置篩選
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className="hover:scale-105 transition-transform duration-200"
                    />
                  ))}
                </div>
              )}
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
      allProducts: products,
      allCategories: categories,
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
  }
}