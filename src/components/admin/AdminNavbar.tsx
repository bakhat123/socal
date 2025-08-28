"use client"

import { useState } from "react"
import { Menu, X, Home, MapPin, FileText, Users, Settings, LogOut, BarChart3 } from "lucide-react"

interface AdminNavbarProps {
  onLogout: () => void
  onSectionChange: (section: string) => void
  activeSection: string
}

export default function AdminNavbar({ onLogout, onSectionChange, activeSection }: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'contact', label: 'Contact', icon: Users },
    { id: 'cities', label: 'Cities', icon: MapPin },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
  ]

  return (
    <nav className="admin-navbar" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="admin-navbar-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <div className="admin-navbar-logo" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #d4af37, #e6c34a)',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Home size={20} color="#1a1a1a" />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff',
              margin: '0',
              letterSpacing: '0.5px'
            }}>
              Socal Admin
            </h1>
            <p style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '0',
              fontWeight: '400'
            }}>
              Content Management
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="admin-navbar-desktop" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                  borderRadius: '8px',
                  color: isActive ? '#d4af37' : 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#ffffff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                  }
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Right Side Actions */}
        <div className="admin-navbar-actions" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer'
            }}
            className="admin-navbar-mobile-toggle"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="admin-navbar-mobile" style={{
          background: 'rgba(26, 26, 26, 0.95)',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '16px 24px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                    borderRadius: '8px',
                    color: isActive ? '#d4af37' : 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
