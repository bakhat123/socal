import type { Metadata } from 'next'
import { connectToDatabase } from '@/lib/mongodb'

async function readBlogs(locale: string) {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs')
      .find({ 
        language: locale,
        status: 'Published'
      })
      .toArray()
    
    return blogs || []
  } catch (error) {
    return []
  }
}

async function readBlogBySlug(locale: string, slug: string) {
  try {
    const { db } = await connectToDatabase()
    const blog = await db.collection('blogs').findOne({ 
      slug: slug,
      language: locale,
      status: 'Published'
    })
    
    if (!blog) {
      // Try English fallback
      if (locale !== 'en') {
        return await db.collection('blogs').findOne({ 
          slug: slug,
          language: 'en',
          status: 'Published'
        })
      }
    }
    
    return blog
  } catch (error) {
    return null
  }
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const { locale, slug } = params

  const blog = await readBlogBySlug(locale, slug) || await readBlogBySlug('en', slug)
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


