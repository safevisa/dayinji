import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/products/ProductCard'
import { Product, Category } from '@/types'

import { products, categories, featuredProducts, promotions } from '@/data/products'

interface HomeProps {
  allProducts: typeof products
  allCategories: typeof categories
}

export default function Home({ allProducts, allCategories }: HomeProps) {
  const { t } = useTranslation('common')

  const featuredItems = allProducts.filter(product => product.featured)

  return (
    <Layout
      seo={{
        title: `${t('company.name')} - Professional 3D Printers & Equipment`,
        description: 'Discover high-quality 3D printers, materials, and equipment. From $19.9 to $39.9. Professional solutions for all your 3D printing needs.',
        keywords: '3D printer, Phrozen, Formlabs, Bambu Lab, resin, filament, 3D scanning',
      }}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block">Professional</span>
                <span className="block text-gradient">3D Printing</span>
                <span className="block">Solutions</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Discover precision 3D printers, premium materials, and professional equipment. 
                From hobbyists to industry professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
                >
                  Explore Products
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Get Consultation
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800"
                  alt="3D Printer"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white text-primary-600 p-6 rounded-xl shadow-2xl">
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <p className="font-bold mt-1">1000+ Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特價耗材推廣 */}
      <section className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                🔥 {t('promotions.special_price')} | {t('promotions.limited_time')}
              </h2>
              <p className="text-red-100 text-lg">
                {t('promotions.featured_materials')} <span className="font-bold text-yellow-300">{t('promotions.price_range')}</span> {t('promotions.super_value')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/promotions"
                className="bg-yellow-400 text-red-800 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
              >
                {t('promotions.shop_now')}
              </Link>
              <Link 
                href="/promotions#materials"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-red-500 transition-colors"
              >
                {t('promotions.view_all')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.featured_products')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('products.featured_description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="animate-fade-in"
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/products"
              className="btn-primary"
            >
              {t('products.view_all_products')}
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.shop_by_category')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('products.category_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group card hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={category.image || '/placeholder-image.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{t(category.name)}</h3>
                    <p className="text-sm text-gray-200">
                      {category.productCount} {t('products.products_count')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose BIZOE?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best 3D printing solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guaranteed</h3>
              <p className="text-gray-300">
                All our products are tested and certified for professional use
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Shipping</h3>
              <p className="text-gray-300">
                Quick delivery worldwide with tracking and insurance included
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.106-1.106A6.003 6.003 0 004 10c0 .929.212 1.808.587 2.593l1.571-1.476zm4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.106-1.106A6.003 6.003 0 004 10c0 .929.212 1.808.587 2.593l1.571-1.476zm1.665-2.235a4.006 4.006 0 001.789.027l1.58 1.58A5.98 5.98 0 0110 4c-.916 0-1.77.21-2.516.448l1.562 1.562zm2.516-2.016A5.98 5.98 0 0110 4c-.916 0-1.77.21-2.516.448l1.562 1.562a4.006 4.006 0 001.789.027l1.58 1.58z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-300">
                Professional technical support and consultation available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-primary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the latest news about new products, special offers, and 3D printing tips
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              No spam, unsubscribe at any time
            </p>
          </div>
        </div>
      </section>
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
    revalidate: 60, // Revalidate every minute
  }
}
