import { Metadata } from 'next'

interface CountyMetadataProps {
  params: {
    locale: string
    slug: string
  }
}

export async function generateMetadata({ params }: CountyMetadataProps): Promise<Metadata> {
  const { locale, slug } = params
  
  try {
    // Fetch county data to get SEO information
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/counties/${locale}/${slug}`)
    
    if (!response.ok) {
      return {
        title: 'County Not Found',
        description: 'The requested county could not be found.'
      }
    }
    
    const county = await response.json()
    
    return {
      title: county.meta_title || `${county.name} Real Estate & Lifestyle | ${county.cityCount} Cities Guide - Reza Barghlameno`,
      description: county.meta_description || `Expert ${county.name} real estate service with Reza Barghlameno. Explore ${county.cityCount} cities and find your perfect home. Express service available for urgent buyers.`,
      keywords: county.seo?.keywords || county.primary_keywords?.join(', ') || `${county.name} real estate, ${county.name} homes, ${county.name} cities`,
      openGraph: {
        title: county.seo?.ogTitle || `Discover ${county.name}: Real Estate & Lifestyle`,
        description: county.seo?.ogDescription || `Experience the best of Southern California living in ${county.name} with ${county.cityCount} cities and excellent communities.`,
        images: [
          {
            url: county.seo?.ogImage || county.heroImage,
            alt: county.seo?.ogImageAlt || `${county.name} real estate and lifestyle`,
            width: 1200,
            height: 630,
          },
        ],
        type: 'website',
        locale: locale,
        siteName: 'SoCal Prime Homes',
      },
      twitter: {
        card: county.seo?.twitterCard || 'summary_large_image',
        title: county.seo?.ogTitle || `Discover ${county.name}: Real Estate & Lifestyle`,
        description: county.seo?.ogDescription || `Experience the best of Southern California living in ${county.name} with ${county.cityCount} cities and excellent communities.`,
        images: [county.seo?.ogImage || county.heroImage],
      },
      alternates: {
        canonical: `/county/${slug}`,
        languages: {
          'en': `/en/county/${slug}`,
          'es': `/es/county/${slug}`,
          'fr': `/fr/county/${slug}`,
          'de': `/de/county/${slug}`,
          'ar': `/ar/county/${slug}`,
          'zh': `/zh/county/${slug}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch (error) {
    console.error('Error generating county metadata:', error)
    
    return {
      title: 'County Information',
      description: 'Explore real estate opportunities in Southern California counties.',
    }
  }
}
