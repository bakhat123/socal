"use client"

import { Search, Bell, Settings, User } from "lucide-react"

interface HeaderProps {
  pageInfo: { title: string; subtitle: string }
  activeSection: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleLogout: () => void
  addToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void
}

export default function Header({ 
  pageInfo, 
  activeSection, 
  searchQuery, 
  setSearchQuery, 
  handleLogout,
  addToast
}: HeaderProps) {
  return (
    <header className="admin-header">
      <div className="header-content">
        <div>
          <h2 className="page-title">{pageInfo.title}</h2>
          <p className="page-subtitle">{pageInfo.subtitle}</p>
        </div>
        <div className="header-actions">
          <div className="admin-search-container">
            <Search className="admin-search-icon" size={16} />
            <input 
              type="text" 
              placeholder={
                activeSection === "cities" ? "Search cities..." : 
                activeSection === "users" ? "Search users..." : 
                "Search..."
              } 
              className="admin-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="header-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <button 
            className="header-btn"
            onClick={async () => {
              try {
                const response = await fetch('/admin/api/update-json', { method: 'POST' })
                if (response.ok) {
                  addToast('success', 'JSON files updated successfully!')
                } else {
                  addToast('error', 'Failed to update JSON files')
                }
              } catch (error) {
                console.error('Error updating JSON files:', error)
                addToast('error', 'Error updating JSON files')
              }
            }}
            title="Update JSON Files"
          >
            <Settings size={20} />
          </button>
          <button onClick={handleLogout} className="header-btn">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
