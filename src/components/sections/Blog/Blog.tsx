"use client"

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useParams } from 'next/navigation'
import '@/styles/Blog.css'

// Blog CSS imports
import '@/styles/Blog/Blog_Components.css'

interface BlogProps {
  blogData?: {
    title: string
    subtitle: string
  }
}

const Blog = ({ blogData }: BlogProps) => {
  const t = useTranslations('blog');
  const params = useParams() as any
  const locale = params?.locale || 'en'
  const [firstBlog, setFirstBlog] = useState<any | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const res = await fetch(`/api/blogs/${locale}`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            setFirstBlog(data[0])
          } else if (isMounted) {
            setFirstBlog(null)
          }
        } else if (isMounted) {
          setFirstBlog(null)
        }
      } catch {
        if (isMounted) setFirstBlog(null)
      }
    }
    load()
    return () => { isMounted = false }
  }, [locale])

  // Use API data if available, otherwise fall back to translations
  const title = blogData?.title || t('title')
  const subtitle = blogData?.subtitle || t('subtitle')

  return (
    <section className="blog-section" id="blog">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <div className="blog-container">
        {firstBlog ? (
          <div className="blog-card">
            <div className="blog-image" style={{ backgroundImage: `url('${firstBlog.heroImage}')` }}></div>
            <div className="blog-content">
              <div className="blog-date">{firstBlog.date}</div>
              <h3 className="home-blog-title">{firstBlog.title}</h3>
              <p className="blog-excerpt">{firstBlog.subtitle}</p>
              <Link href={`/blog/${firstBlog.slug}`} locale={locale} className="blog-link">{t('readArticle')}</Link>
            </div>
          </div>
        ) : (
          <div className="blog-card">
            <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2940&q=80')" }}></div>
            <div className="blog-content">
              <div className="blog-date">{t('date')}</div>
              <h3 className="home-blog-title">{t('articleTitle')}</h3>
              <p className="blog-excerpt">{t('excerpt')}</p>
              <Link href="/blog" locale={locale} className="blog-link">{t('readArticle')}</Link>
            </div>
          </div>
        )}
      </div>
      <div className="see-more">
        <Link href="/blog" locale={locale} className="see-more-link">{t('exploreMore')}</Link>
      </div>
    </section>
  )
}

export default Blog