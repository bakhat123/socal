import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

function readBlogs(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'blogs', locale, 'blogs.json')
  if (!fs.existsSync(filePath)) return []
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const blogs = JSON.parse(raw)
    return Array.isArray(blogs) ? blogs : []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const { locale } = params
  const blogs = readBlogs(locale)
  const featured = blogs.find((b: any) => b.featured) || blogs[0]

  const baseTitle = 'Insights & Market Guides'
  const baseDescription = 'Expert analysis and trending topics in Southern California luxury real estate.'

  const title = featured?.seo?.metaTitle || baseTitle
  const description = featured?.seo?.metaDescription || baseDescription
  const ogImage = featured?.seo?.ogImage || featured?.heroImage
  const canonical = `${siteUrl}/${locale}/blog`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/blog`,
        de: `${siteUrl}/de/blog`,
        fr: `${siteUrl}/fr/blog`,
        zh: `${siteUrl}/zh/blog`,
        ar: `${siteUrl}/ar/blog`,
        es: `${siteUrl}/es/blog`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'SoCal Real Estate',
      locale,
      images: ogImage ? [{ url: ogImage, alt: featured?.heroImageAlt || featured?.title || 'Blog', width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: (featured?.seo?.twitterCard as any) || 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}


