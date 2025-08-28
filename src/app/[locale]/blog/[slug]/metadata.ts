import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'

function readBlogs(locale: string) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'blogs', locale, 'blogs.json')
  if (!fs.existsSync(filePath)) return null
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function readBlogBySlug(locale: string, slug: string) {
  const blogs = readBlogs(locale)
  if (!Array.isArray(blogs)) return null
  return blogs.find((b: any) => b.slug === slug) || null
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const { locale, slug } = params

  const blog = readBlogBySlug(locale, slug) || readBlogBySlug('en', slug)
  if (!blog) return {}

  const title = blog.seo?.metaTitle || blog.title
  const description = blog.seo?.metaDescription || blog.subtitle
  const ogImage = blog.seo?.ogImage || blog.heroImage
  const canonical = `${siteUrl}/${locale}/blog/${slug}`

  // Build alternates from hreflang_tags if present; otherwise default mapping
  const languages: Record<string, string> = {}
  if (Array.isArray(blog.hreflang_tags) && blog.hreflang_tags.length > 0) {
    for (const tag of blog.hreflang_tags) {
      if (tag?.hreflang && tag?.href) languages[tag.hreflang] = tag.href
    }
  } else {
    const supported = ['en', 'de', 'fr', 'zh', 'ar', 'es']
    for (const lng of supported) {
      languages[lng] = `${siteUrl}/${lng}/blog/${slug}`
    }
  }

  const keywords = typeof blog.seo?.keywords === 'string'
    ? blog.seo.keywords.split(',').map((s: string) => s.trim()).filter(Boolean)
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: { index: true, follow: true },
    keywords,
    openGraph: {
      type: 'article',
      url: canonical,
      title: blog.seo?.ogTitle || title,
      description: blog.seo?.ogDescription || description,
      siteName: 'SoCal Real Estate',
      locale,
      images: ogImage ? [{ url: ogImage, alt: blog.heroImageAlt || blog.title, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: (blog.seo?.twitterCard as any) || 'summary_large_image',
      title: blog.seo?.ogTitle || title,
      description: blog.seo?.ogDescription || description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}


