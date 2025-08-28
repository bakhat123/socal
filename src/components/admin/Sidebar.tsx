"use client"

import { LayoutDashboard, Users, MapPin, Edit3, Menu, Home } from "lucide-react"

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "home", label: "Home", icon: Home },
  { key: "users", label: "Users", icon: Users },
  { key: "cities", label: "Cities", icon: MapPin },
  { key: "blogs", label: "Blogs", icon: Edit3 },
]

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ 
  activeSection, 
  setActiveSection, 
  sidebarCollapsed, 
  setSidebarCollapsed 
}: SidebarProps) {
  return (
    <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-content">
          <div className="logo-icon">
            <LayoutDashboard size={24} />
          </div>
          <div className="logo-text">
            <h1>Admin Panel</h1>
            <p>Management System</p>
          </div>
        </div>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="toggle-btn">
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              className={`nav-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <Icon size={20} />
              <span className="nav-text">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
