'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import HeroBlogCard from '@/components/sections/Blog/HeroBlogCard'
import BlogGridCard from '@/components/sections/Blog/BlogGridCard'

// Blog CSS imports
import '@/styles/Blog/Blog_Listing.css'

const BlogPage = () => {
  const t = useTranslations('blog')
  const params = useParams()
  const locale = (params as Record<string, any>)?.locale || 'en'
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 8
  const [blogs, setBlogs] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blogs/${locale}`)
        if (res.ok) {
          const data = await res.json()
          if (isMounted) setBlogs(Array.isArray(data) ? data : [])
        } else {
          const fallback = await fetch(`/api/blogs/en`)
          if (fallback.ok) {
            const data = await fallback.json()
            if (isMounted) setBlogs(Array.isArray(data) ? data : [])
          } else if (isMounted) {
            setBlogs([])
          }
        }
      } catch {
        if (isMounted) setBlogs([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchBlogs()
    return () => { isMounted = false }
  }, [locale])

  const featuredBlog = blogs.find(blog => blog.featured)
  // Show every blog in the grid except the one used as the hero
  const gridBlogs = blogs.filter(blog => !featuredBlog || blog.id !== featuredBlog.id)

  // Calculate pagination
  const totalPages = Math.ceil(gridBlogs.length / blogsPerPage)
  const startIndex = (currentPage - 1) * blogsPerPage
  const endIndex = startIndex + blogsPerPage
  const currentBlogs = gridBlogs.slice(startIndex, endIndex)

  // Sticky navigation effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.navigation')
      if (nav instanceof HTMLElement) {
        if (window.scrollY > 50) {
          nav.style.padding = '15px 0'
          nav.style.background = 'rgba(26, 26, 26, 0.98)'
          nav.style.backdropFilter = 'blur(15px)'
        } else {
          nav.style.padding = '20px 0'
          nav.style.background = 'rgba(26, 26, 26, 0.95)'
          nav.style.backdropFilter = 'blur(10px)'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return (
      <main className="blog-page">
        <section className="blog-listing-hero"><div className="blog-listing-hero-container" /></section>
      </main>
    )
  }

  return (
    <main className="blog-page">
      {/* Blog Hero Section */}
      <section className="blog-listing-hero">
        <div className="blog-listing-hero-container">
          {featuredBlog && (
            <HeroBlogCard blog={featuredBlog} />
          )}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Blog Grid Section */}
      <section className="blog-grid-section">
        <div className="blog-grid-container">
          <div className="section-header">
            <h2 className="section-title">{t('sectionHeader.title')}</h2>
            <p className="section-subtitle">{t('sectionHeader.subtitle')}</p>
          </div>

          <div className="blog-grid" id="blogGrid">
            {currentBlogs.map((blog, index) => (
              <React.Fragment key={blog.id}>
                <BlogGridCard blog={blog} />
                {(index + 1) % 2 === 0 && index < currentBlogs.length - 1 && (
                  <div className="row-divider"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← {t('pagination.previous')}
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-btn" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {t('pagination.next')} →
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default BlogPage 