'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { notFound, useParams } from 'next/navigation'
import RelatedArticles from '@/components/sections/Blog/RelatedArticles'
import PrestigeLoading from '@/components/common/PrestigeLoading'
import type { Blog as BlogType } from '@/types'

// Blog CSS imports
import '@/styles/Blog/Blog_Post.css'
import '@/styles/Blog/Blog_Components.css'

const BlogPage = () => {
  const t = useTranslations('blog')
  const routeParams = useParams() as any
  const locale = routeParams?.locale || 'en'
  const slug = routeParams?.slug
  const [blog, setBlog] = useState<BlogType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchBlog = async () => {
      try {
        setLoading(true)
        if (!slug) return
        const res = await fetch(`/api/blogs/${locale}/${slug}`)
        if (res.ok) {
          const data = await res.json()
          if (isMounted) setBlog(data)
        } else {
          const fallback = await fetch(`/api/blogs/en/${slug}`)
          if (fallback.ok) {
            const data = await fallback.json()
            if (isMounted) setBlog(data)
            else if (isMounted) setBlog(null)
          } else if (isMounted) setBlog(null)
        }
      } catch {
        if (isMounted) setBlog(null)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    fetchBlog()
    return () => { isMounted = false }
  }, [locale, slug])

  if (!loading && !blog) {
    notFound()
  }

  // Reading progress bar effect
  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.querySelector('.article-content')
      if (!(article instanceof HTMLElement)) return

      const scrollTop = window.scrollY
      const articleTop = article.getBoundingClientRect().top + window.scrollY
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      
      const start = articleTop - windowHeight / 2
      const end = articleTop + articleHeight - windowHeight / 2
      
      const progressBar = document.getElementById('readingProgress')
      if (!progressBar) return
      
      if (scrollTop < start) {
        progressBar.style.width = '0%'
      } else if (scrollTop > end) {
        progressBar.style.width = '100%'
      } else {
        const progress = ((scrollTop - start) / (end - start)) * 100
        progressBar.style.width = progress + '%'
      }
    }

    // Sticky navigation effect
    const updateNavigation = () => {
      const nav = document.getElementById('navigation')
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled')
        } else {
          nav.classList.remove('scrolled')
        }
      }
    }

    window.addEventListener('scroll', () => {
      updateReadingProgress()
      updateNavigation()
    })

    return () => {
      window.removeEventListener('scroll', updateReadingProgress)
      window.removeEventListener('scroll', updateNavigation)
    }
  }, [])

  const handleShare = () => {
    if (!blog) return
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.subtitle,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Article link copied to clipboard!')
      })
    }
  }



  if (loading || !blog) {
    return <PrestigeLoading />
  }

  return (
    <main className="blog-post-page">
      {/* Reading Progress Bar */}
      <div className="reading-progress" id="readingProgress"></div>

      {/* Blog Hero Section */}
      <section className="blog-hero">
        <div className="hero-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <div className="breadcrumb-separator"></div>
            <Link href="/blog">Insights</Link>
            <div className="breadcrumb-separator"></div>
            <span className="active">{blog.category}</span>
          </div>

          {/* Category Badge */}
          <div className="category-badge">{blog.category}</div>

          {/* Title */}
          <h1 className="blog-title">{blog.title}</h1>

          {/* Subtitle */}
          <p className="blog-subtitle">{blog.subtitle}</p>

          {/* Meta Information */}
          <div className="blog-meta">
            <div className="author-info">
              <div className="author-avatar">{blog.author.avatar}</div>
              <div className="author-details">
                <h4>{blog.author.name}</h4>
                <span>{blog.author.title}</span>
              </div>
            </div>
            
            <div className="meta-items">
              <div className="meta-item">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {blog.date}
              </div>
              <div className="meta-item">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                {blog.readTime}
              </div>

            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleShare}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16,6 12,2 8,6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image">
            <img src={blog.heroImage} alt={blog.title} />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <div className="article-container">
        {/* Main Content */}
        <article className="article-content">
          {blog.content ? (
            <>
              <p className="lead">{blog.content.lead}</p>
              
              {blog.content.sections.map((section: any, index: number) => (
                <div key={index}>
                  <h2>{section.title}</h2>
                  <p>{section.content}</p>
                  
                  {section.quote && (
                    <blockquote>
                      "{section.quote.text}"
                      <cite>— {section.quote.author}</cite>
                    </blockquote>
                  )}
                  
                  {section.additional && <p>{section.additional}</p>}
                  
                  {section.subsections && (
                    <>
                      {section.subsections.map((subsection: any, subIndex: number) => (
                        <div key={subIndex}>
                          <h3>{subsection.title}</h3>
                          <p>{subsection.content}</p>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {section.list && (
                    <ul>
                      {section.list.map((item: any, listIndex: number) => (
                        <li key={listIndex}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="lead">Content coming soon...</p>
          )}
        </article>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Author Info */}
          <div className="sidebar-card author-card">
            <div className="sidebar-author">
              <div className="sidebar-author-avatar">{blog.author.avatar}</div>
              <div className="sidebar-author-info">
                <h3>{blog.author.name}</h3>
                <p>{blog.author.title}</p>
              </div>
            </div>
            {blog.author.bio && (
              <p className="author-bio">{blog.author.bio}</p>
            )}
          </div>

          {/* Table of Contents */}
          {blog.content && (
            <div className="sidebar-card toc">
              <h3>Table of Contents</h3>
              <ul className="toc-list">
                {blog.content.sections.map((section: any, index: number) => (
                  <li key={index}>
                    <a href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Related Articles */}
      <RelatedArticles currentBlogId={(blog as any).id ?? blog.slug} />


    </main>
  )
}

export default BlogPage 