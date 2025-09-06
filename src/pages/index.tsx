import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline'
import Layout from '@/components/layout/Layout'
import ProductCard from '@/components/products/ProductCard'
import { Product, Category } from '@/types'

// Mock data for development - replace with actual API calls
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Phrozen Sonic Mighty Revo 16K',
    description: 'Ultra-fine printing with no visible layer lines. Aerospace-grade aluminum structure with dual linear guides for stable and reliable performance.',
    price: 899.99,
    originalPrice: 999.99,
    currency: 'USD',
    categoryId: 'printers',
    category: { id: 'printers', name: '3D Printers', slug: '3d-printers', productCount: 12 },
    images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500'],
    specifications: {
      'Build Volume': '218.88 × 123 × 235 mm',
      'Layer Resolution': '0.01-0.3mm',
      'Print Speed': '30-50mm/h',
    },
    inStock: true,
    stockQuantity: 15,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Phrozen Arco FDM 3D Printer Set',
    description: 'Large, fast, and stable - 300×300×300mm build volume with up to 1,000mm/s speed. Includes Chroma Kit for 4-color printing.',
    price: 1299.99,
    currency: 'USD',
    categoryId: 'printers',
    category: { id: 'printers', name: '3D Printers', slug: '3d-printers', productCount: 12 },
    images: ['https://images.unsplash.com/photo-1612198985863-fbbf7b95b2c4?w=500'],
    specifications: {
      'Build Volume': '300 × 300 × 300 mm',
      'Print Speed': 'Up to 1,000mm/s',
      'Filament': '1.75mm',
    },
    inStock: true,
    stockQuantity: 8,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Premium 3D Printing Resin',
    description: 'High-quality resin for detailed 3D prints with excellent surface finish.',
    price: 29.99,
    currency: 'USD',
    categoryId: 'materials',
    category: { id: 'materials', name: 'Printing Materials', slug: 'materials', productCount: 25 },
    images: ['https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=500'],
    specifications: {
      'Volume': '1L',
      'Color': 'Clear',
      'Curing Time': '8-12 seconds',
    },
    inStock: true,
    stockQuantity: 50,
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Professional Curing Station',
    description: 'UV curing and washing station for post-processing 3D printed parts.',
    price: 199.99,
    originalPrice: 249.99,
    currency: 'USD',
    categoryId: 'equipment',
    category: { id: 'equipment', name: 'Post-Processing Equipment', slug: 'equipment', productCount: 18 },
    images: ['https://images.unsplash.com/photo-1563089145-599997674d42?w=500'],
    specifications: {
      'UV Power': '40W',
      'Washing Volume': '2L',
      'Timer': '1-99 minutes',
    },
    inStock: true,
    stockQuantity: 12,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

const mockCategories: Category[] = [
  {
    id: 'printers',
    name: '3D Printers',
    slug: '3d-printers',
    description: 'High-precision 3D printers for professional and hobbyist use',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
    productCount: 12,
  },
  {
    id: 'materials',
    name: 'Printing Materials',
    slug: 'materials',
    description: 'Premium resins, filaments, and printing materials',
    image: 'https://images.unsplash.com/photo-1593440552154-a4e1b2c2fecc?w=400',
    productCount: 25,
  },
  {
    id: 'equipment',
    name: 'Post-Processing Equipment',
    slug: 'equipment',
    description: 'Curing, washing, and finishing equipment',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400',
    productCount: 18,
  },
  {
    id: 'scanners',
    name: '3D Scanners',
    slug: 'scanners',
    description: 'Professional 3D scanning solutions',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    productCount: 8,
  },
]

interface HomeProps {
  products: Product[]
  categories: Category[]
}

export default function Home({ products, categories }: HomeProps) {
  const { t } = useTranslation('common')

  const featuredProducts = products.filter(product => product.featured)

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

      {/* Featured Products */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular 3D printers and equipment, trusted by professionals worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
              View All Products
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
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find everything you need for your 3D printing journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
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
                    <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-200">
                      {category.productCount} products
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
      products: mockProducts,
      categories: mockCategories,
      ...(await serverSideTranslations(locale ?? 'zh-TW', ['common'])),
    },
    revalidate: 60, // Revalidate every minute
  }
}
