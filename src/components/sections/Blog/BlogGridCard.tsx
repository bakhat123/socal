import React from 'react'
import { Link } from '@/i18n/navigation'
import { useParams } from 'next/navigation'

// Blog CSS imports
import '@/styles/Blog/Blog_Listing.css'

interface Blog {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  author: {
    name: string
    title: string
    avatar: string
  }
  date: string
  readTime: string
  heroImage: string
}

interface BlogGridCardProps {
  blog: Blog
}

const BlogGridCard = ({ blog }: BlogGridCardProps) => {
  const params = useParams() as any
  const locale = params?.locale || 'en'
  return (
    <Link href={`/blog/${blog.slug}`} locale={locale} className="blog-listing-card">
      <div 
        className="blog-listing-card-image" 
        style={{ backgroundImage: `url('${blog.heroImage}')` }}
      ></div>
      <div className="blog-listing-card-content">
        <div className="blog-listing-card-meta">
          <div className="blog-listing-card-category">{blog.category}</div>
          <div className="blog-listing-card-date">{blog.date}</div>
        </div>
        <h3 className="blog-listing-card-title">{blog.title}</h3>
        <p className="blog-listing-card-excerpt">{blog.subtitle}</p>
        <div className="blog-listing-card-footer">
          <div className="blog-listing-card-author">{blog.author.name}</div>
          <div className="blog-listing-card-read-time">{blog.readTime}</div>
        </div>
      </div>
    </Link>
  )
}

export default BlogGridCard 