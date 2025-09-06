import { ReactNode } from 'react'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import Header from './Header'
import Footer from './Footer'
import { SEOProps } from '@/types'

interface LayoutProps {
  children: ReactNode
  seo?: SEOProps
  className?: string
}

export default function Layout({ children, seo, className = '' }: LayoutProps) {
  const { t } = useTranslation('common')

  const defaultSEO: SEOProps = {
    title: t('company.name'),
    description: 'Professional 3D printer store with high-quality printers, materials, and equipment',
    keywords: '3D printer, 3D printing, Phrozen, Formlabs, Bambu Lab, resin, filament',
  }

  const metaData = { ...defaultSEO, ...seo }

  return (
    <>
      <Head>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        {metaData.keywords && <meta name="keywords" content={metaData.keywords} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        {metaData.image && <meta property="og:image" content={metaData.image} />}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={metaData.title} />
        <meta property="twitter:description" content={metaData.description} />
        {metaData.image && <meta property="twitter:image" content={metaData.image} />}
        
        {/* Canonical URL */}
        {metaData.canonical && <link rel="canonical" href={metaData.canonical} />}
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className={`flex-grow ${className}`}>
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  )
}
