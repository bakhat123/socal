"use client"

import { Plus, Edit2, Trash2, User, Calendar, Clock, Eye, Heart, FileText, Filter, Zap, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import { Blog as BlogType } from "@/types"
import { useState, useMemo } from "react"

// Extended blog type to handle both _id and id fields
interface ExtendedBlogType extends BlogType {
  id?: string
}

interface BlogManagerProps {
  blogs: BlogType[]
  setShowBlogModal: (show: boolean) => void
  setEditingBlog: (id: string | null) => void
  setBlogForm: (form: BlogType) => void
  deleteBlog: (id: string) => void
  handleAddBlog: () => void
  onBlogStatusUpdate?: (blogId: string, newStatus: string) => void
}

export default function BlogManager({ 
  blogs, 
  setShowBlogModal, 
  setEditingBlog, 
  setBlogForm, 
  deleteBlog,
  handleAddBlog,
  onBlogStatusUpdate
}: BlogManagerProps) {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [languageFilter, setLanguageFilter] = useState<string>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Generate webhook state
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // State for tracking which blogs are being published
  const [publishingBlogs, setPublishingBlogs] = useState<Set<string>>(new Set())

  // Helper function to get the correct ID field
  const getBlogId = (blog: ExtendedBlogType) => {
    return blog._id || blog.id || `blog-${Math.random()}`
  }

  // Helper function to get author name safely
  const getAuthorName = (blog: ExtendedBlogType) => {
    if (typeof blog.author === 'string') {
      return blog.author
    }
    return blog.author?.name || 'Unknown Author'
  }

  // Helper function to convert string author to object
  const convertAuthorToObject = (author: string | { name: string; title: string; avatar: string; bio: string; url?: string }) => {
    if (typeof author === 'string') {
      return {
        name: author,
        title: 'Author',
        avatar: author.charAt(0).toUpperCase(),
        bio: 'Author bio'
      }
    }
    return author
  }

  // Get unique categories and languages for filter options
  const categories = useMemo(() => {
    const cats = [...new Set(blogs.map(blog => blog.category))]
    return cats.sort()
  }, [blogs])

  const languages = useMemo(() => {
    const langs = [...new Set(blogs.map(blog => blog.language || 'en'))]
    return langs.sort()
  }, [blogs])

  const groupIds = useMemo(() => {
    const groups = [...new Set(blogs.map(blog => Number(blog.group_id ?? 0)))]
    return groups.sort((a, b) => a - b)
  }, [blogs])

  // Filter blogs based on current filters
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: ExtendedBlogType) => {
      const matchesStatus = statusFilter === 'all' || (blog.status || 'Draft') === statusFilter
      const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter
      const matchesLanguage = languageFilter === 'all' || (blog.language || 'en') === languageFilter
      const matchesGroup = groupFilter === 'all' || Number(blog.group_id ?? 0) === Number(groupFilter)
      const matchesSearch = searchTerm === '' || 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAuthorName(blog).toLowerCase().includes(searchTerm.toLowerCase())

      return matchesStatus && matchesCategory && matchesLanguage && matchesGroup && matchesSearch
    })
  }, [blogs, statusFilter, categoryFilter, languageFilter, groupFilter, searchTerm])

  // Handle generate webhook call
  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Your webhook logic here
      console.log('Generating webhook...')
    } catch (error) {
      console.error('Error calling webhook:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Toggle blog status
  const toggleBlogStatus = async (blogId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published'
    
    // Add this blog to the publishing set
    setPublishingBlogs(prev => new Set(prev).add(blogId))
    
    try {
      const response = await fetch('/admin/api/blogs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: blogId,
          status: newStatus
        })
      })

      if (response.ok) {
        // Call the callback to update the parent component's blogs state
        if (onBlogStatusUpdate) {
          onBlogStatusUpdate(blogId, newStatus)
        }
        
        // Remove from publishing set
        setPublishingBlogs(prev => {
          const newSet = new Set(prev)
          newSet.delete(blogId)
          return newSet
        })
        
        // Show success feedback (you can add a toast notification here)
        console.log(`Blog status updated to ${newStatus}`)
      } else {
        console.error('Failed to update blog status')
        // Remove from publishing set on error
        setPublishingBlogs(prev => {
          const newSet = new Set(prev)
          newSet.delete(blogId)
          return newSet
        })
      }
    } catch (error) {
      console.error('Error updating blog status:', error)
      // Remove from publishing set on error
      setPublishingBlogs(prev => {
        const newSet = new Set(prev)
        newSet.delete(blogId)
        return newSet
      })
    }
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <div className="section-info">
          <div className="count-badge purple">
            <span>Total Posts: </span>
            <span>{filteredBlogs.length} / {blogs.length}</span>
          </div>
        </div>
        <div className="section-actions">
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="generate-btn"
          >
            <Zap size={20} />
            <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="filter-btn"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
          <button onClick={handleAddBlog} className="add-btn purple">
            <Plus size={20} />
            <span>Add Blog</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="filter-section">
          <div className="filter-grid">
            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Language:</label>
              <select 
                value={languageFilter} 
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language}>{language.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Group:</label>
              <select 
                value={groupFilter} 
                onChange={(e) => setGroupFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Groups</option>
                {groupIds.map(groupId => (
                  <option key={groupId} value={String(groupId)}>Group {groupId}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-actions">
            <button 
              onClick={() => {
                setStatusFilter('all')
                setCategoryFilter('all')
                setLanguageFilter('all')
                setGroupFilter('all')
                setSearchTerm('')
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="content-grid two-cols">
        {filteredBlogs.map((blog) => (
          <div key={getBlogId(blog as ExtendedBlogType)} className="card">
            <div className="card-header">
              <div className="blog-badges">
                <span className={`badge ${(blog.status || 'Draft').toLowerCase()}`}>
                  {blog.status || 'Draft'}
                </span>
                {blog.featured && <span className="badge featured">Featured</span>}
                {(blog.language || 'en') && <span className="badge language">{(blog.language || 'en').toUpperCase()}</span>}
              </div>
              <div className="card-actions">
                <button 
                  className={`action-btn toggle-status ${(blog.status || 'Draft') === 'Published' ? 'published' : 'draft'} ${publishingBlogs.has(getBlogId(blog as ExtendedBlogType)) ? 'publishing' : ''}`}
                  onClick={() => toggleBlogStatus(getBlogId(blog as ExtendedBlogType), blog.status || 'Draft')}
                  title={`Toggle to ${(blog.status || 'Draft') === 'Published' ? 'Draft' : 'Published'}`}
                  disabled={publishingBlogs.has(getBlogId(blog as ExtendedBlogType))}
                >
                  {publishingBlogs.has(getBlogId(blog as ExtendedBlogType)) ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    (blog.status || 'Draft') === 'Published' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />
                  )}
                </button>
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    const blogId = getBlogId(blog as ExtendedBlogType)
                    setEditingBlog(blogId)
                    setBlogForm({
                      _id: blogId,
                      group_id: blog.group_id || 0,
                      slug: blog.slug,
                      title: blog.title,
                      subtitle: blog.subtitle || '',
                      canonicalUrl: blog.canonicalurl || '',
                      language: blog.language || 'en',
                      category: blog.category,
                      author: convertAuthorToObject(blog.author),
                      date: blog.date || '',
                      readTime: blog.readTime || '5 min read',
                      word_count: blog.wordcount || 0,
                      status: blog.status || 'Draft',
                      featured: blog.featured || false,
                      heroImage: blog.heroImage || '',
                      heroImageAlt: blog.heroimagealt || '',
                      city: blog.city || '',
                      topic: blog.topic || '',
                      keyword: blog.keyword || '',
                      hreflang_tags: blog.hreflang_tags || [],
                      internal_links: blog.internal_links || [],
                      schema_markup: blog.schema_markup || {},
                      images: blog.images || [],
                      content: blog.content || { lead: '', sections: [] },
                      ctaSection: blog.ctaSection || { title: '', ctaText: '', ctaLink: '' },
                      seo: blog.seo || { metaTitle: '', metaDescription: '' },
                      views: blog.views || 0,
                      likes: blog.likes || 0
                    })
                    setShowBlogModal(true)
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button className="action-btn delete" onClick={() => {
                  const blogId = getBlogId(blog as ExtendedBlogType)
                  if (blogId) {
                    deleteBlog(blogId)
                  }
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {blog.heroImage && (
              <div className="blog-hero-image">
                <img 
                  src={blog.heroImage} 
                  alt={blog.heroImageAlt || blog.title}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}

            <h3 className="card-title">{blog.title}</h3>
            <p className="card-subtitle">{blog.subtitle || 'No subtitle'}</p>

            <div className="card-meta">
              <span>
                <User size={16} />
                {getAuthorName(blog as ExtendedBlogType)}
              </span>
              <span>
                <Calendar size={16} />
                {new Date(blog.date).toLocaleDateString()}
              </span>
              <span>
                <Clock size={16} />
                {blog.readTime || '5 min read'}
              </span>
              {blog.word_count && (
                <span>
                  <FileText size={16} />
                  {blog.word_count} words
                </span>
              )}
            </div>

            <div className="card-meta">
              <span>Slug: {blog.slug}</span>
              <span>Category: {blog.category}</span>
              {(blog.language || 'en') && <span>Language: {(blog.language || 'en').toUpperCase()}</span>}
            </div>

            <p className="blog-content">{blog.content?.lead || 'No content available...'}</p>

            {blog.content?.sections && blog.content.sections.length > 0 && (
              <div className="blog-sections-info">
                <span className="text-sm text-gray-600">
                  {blog.content.sections.length} section{blog.content.sections.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="blog-stats">
              <span>
                <Eye size={16} />
                {blog.views || 0}
              </span>
              <span>
                <Heart size={16} />
                {blog.likes || 0}
              </span>
            </div>
          </div>
        ))}
        {filteredBlogs.length === 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  {blogs.length === 0 ? 'No blog posts found' : 'No blogs match your filters'}
                </h3>
                <p className="card-subtitle">
                  {blogs.length === 0 
                    ? 'Create your first blog post to get started' 
                    : 'Try adjusting your filters or search terms'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
