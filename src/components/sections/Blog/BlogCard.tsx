import React from 'react'
import { Link } from '@/i18n/navigation'

// Blog CSS imports
import '@/styles/Blog/Blog_Components.css'

type BlogCardProps = {
  date: string
  title: string
  excerpt: string
  imageUrl: string
}

const BlogCard = ({ date, title, excerpt, imageUrl }: BlogCardProps) => {
  return (
    <Link href="/blog" className="blog-card">
      <div 
        className="blog-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="blog-content">
        <div className="blog-date">{date}</div>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        <span className="blog-link">
          Read Article
          <span className="arrow">→</span>
        </span>
      </div>
    </Link>
  )
}

export default BlogCard