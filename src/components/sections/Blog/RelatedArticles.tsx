'use client'

import React, { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useParams } from 'next/navigation'

// Blog CSS imports
import '@/styles/Blog/Blog_Components.css'

interface RelatedArticlesProps {
  currentBlogId: string
}

interface Blog {
  id: string
  slug: string
  title: string
  subtitle: string
  heroImage: string
  category: string
  date: string
  author: {
    name: string
  }
  readTime: string
  language: string
}

const RelatedArticles = ({ currentBlogId }: RelatedArticlesProps) => {
  const params = useParams() as any
  const locale = params?.locale || 'en'
  const [blogsData, setBlogsData] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlogsData = async () => {
      try {
        setLoading(true)
        // Dynamically import the language-specific blogs.json file
        const blogsModule = await import(`@/data/blogs/${locale}/blogs.json`)
        setBlogsData(blogsModule.default || blogsModule)
      } catch (error) {
        console.error(`Failed to load blogs for locale ${locale}:`, error)
        // Fallback to English if the locale-specific file doesn't exist
        try {
          const fallbackModule = await import('@/data/blogs/en/blogs.json')
          setBlogsData(fallbackModule.default || fallbackModule)
        } catch (fallbackError) {
          console.error('Failed to load fallback blogs:', fallbackError)
          setBlogsData([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadBlogsData()
  }, [locale])

  // Filter blogs by current locale and exclude current blog
  const sameLocale = blogsData.filter((blog: Blog) => blog.language === locale)
  const pool = sameLocale.length > 0 ? sameLocale : blogsData
  const relatedBlogs = pool.filter(blog => blog.id !== currentBlogId).slice(0, 3)

  if (loading) {
    return (
      <section className="related-section">
        <div className="related-container">
          <div className="section-header">
            <h2 className="section-title">Related Insights</h2>
            <p className="section-subtitle">Continue exploring our latest analysis and trends in luxury real estate markets worldwide</p>
          </div>
          <div className="related-grid">
            <div className="loading-placeholder">Loading related articles...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="related-section">
      <div className="related-container">
        <div className="section-header">
          <h2 className="section-title">Related Insights</h2>
          <p className="section-subtitle">Continue exploring our latest analysis and trends in luxury real estate markets worldwide</p>
        </div>

        <div className="related-grid">
          {relatedBlogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} locale={locale} className="related-card fade-in">
              <div className="related-card-image">
                <img src={blog.heroImage} alt={blog.title} />
              </div>
              <div className="related-card-content">
                <div className="related-card-meta">
                  <div className="related-card-category">{blog.category}</div>
                  <div className="related-card-date">{blog.date}</div>
                </div>
                <h3 className="related-card-title">{blog.title}</h3>
                <p className="related-card-excerpt">{blog.subtitle}</p>
                <div className="related-card-footer">
                  <span>{blog.author.name}</span>
                  <span>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedArticles 