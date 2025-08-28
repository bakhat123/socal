"use client"

import { Users, MapPin, Edit3, User, Calendar } from "lucide-react"
import { DashboardStats, User as UserType, Blog as BlogType } from "@/types"

interface DashboardProps {
  stats: DashboardStats
  users: UserType[]
  blogs: BlogType[]
}

export default function Dashboard({ stats, users, blogs }: DashboardProps) {
  // Sort blogs by date (most recent first)
  const recentBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  }).slice(0, 3)

  // Sort users by creation date (most recent first)
  const recentUsers = [...users].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  }).slice(0, 3)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="content-section">
      {/* Stats Grid - Now 3 cards instead of 4 */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p>Total Users</p>
              <p className="stat-number">{users.length}</p>
              <p className="stat-change" style={{ color: '#10b981' }}>Active</p>
            </div>
            <div className="stat-icon blue">
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p>Total Cities</p>
              <p className="stat-number">{stats.cities}</p>
              <p className="stat-change" style={{ color: '#10b981' }}>Published</p>
            </div>
            <div className="stat-icon green">
              <MapPin size={24} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p>Total Blogs</p>
              <p className="stat-number">{blogs.length}</p>
              <p className="stat-change" style={{ color: '#10b981' }}>Published</p>
            </div>
            <div className="stat-icon purple">
              <Edit3 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Improved layout */}
      <div className="activity-grid" style={{ marginTop: '32px', gap: '24px' }}>
        <div className="activity-card">
          <h3 className="activity-title">Recent Users</h3>
          <div className="activity-list">
            {recentUsers.map((user) => (
              <div key={user._id || user.id} className="activity-item">
                <div className="activity-avatar">
                  <User size={20} />
                </div>
                <div className="activity-info">
                  <p style={{ fontWeight: '600', color: '#1f2937' }}>{user.email}</p>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {user.role || 'User'} • {formatDate(user.createdAt)}
                  </p>
                </div>
                <span className="status-badge status-active">{user.status || 'active'}</span>
              </div>
            ))}
            {users.length === 0 && (
              <div className="activity-item">
                <div className="activity-info">
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No users found</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="activity-card">
          <h3 className="activity-title">Recent Posts</h3>
          <div className="activity-list">
            {recentBlogs.map((blog) => (
              <div key={blog._id || blog.id} className="activity-item">
                <div className="activity-avatar purple">
                  <Edit3 size={20} />
                </div>
                <div className="activity-info">
                  <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                    {blog.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <Calendar size={14} />
                    <span>{formatDate(blog.date)}</span>
                    <span>•</span>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: blog.status === 'Published' ? '#dcfce7' : '#fef3c7',
                      color: blog.status === 'Published' ? '#166534' : '#92400e'
                    }}>
                      {blog.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="activity-item">
                <div className="activity-info">
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No blog posts found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
