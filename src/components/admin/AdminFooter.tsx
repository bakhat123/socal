"use client"

import { Home, MapPin, FileText, Users, Settings, Database, RefreshCw } from "lucide-react"

interface AdminFooterProps {
  onUpdateJson: () => void
  onRefreshData: () => void
  lastUpdated?: string
  isUpdatingJson?: boolean
}

export default function AdminFooter({ onUpdateJson, onRefreshData, lastUpdated, isUpdatingJson = false }: AdminFooterProps) {
  return (
    <footer className="admin-footer" style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      padding: '24px 0',
      marginTop: 'auto'
    }}>
      <div className="admin-footer-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Data Flow Status */}
          <div className="admin-footer-section">
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '16px',
              fontWeight: '600',
              color: '#d4af37',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Database size={18} />
              Data Flow Status
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  flexShrink: 0
                }}></div>
                Database → JSON Files
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  flexShrink: 0
                }}></div>
                JSON Files → Frontend
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  flexShrink: 0
                }}></div>
                Real-time Updates
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-footer-section">
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '16px',
              fontWeight: '600',
              color: '#d4af37',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <RefreshCw size={18} />
              Quick Actions
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <button
                onClick={onUpdateJson}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '6px',
                  color: '#d4af37',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'
                }}
              >
                <Database size={14} />
                Update JSON Files
              </button>
              <button
                onClick={onRefreshData}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  color: '#3b82f6',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: 'fit-content'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
                }}
              >
                <RefreshCw size={14} />
                Refresh Data
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="admin-footer-section">
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '16px',
              fontWeight: '600',
              color: '#d4af37',
              margin: '0 0 16px 0'
            }}>
              System Information
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <div>Environment: Production</div>
              <div>Version: 1.0.0</div>
              <div>Last Updated: {lastUpdated || 'Never'}</div>
              <div>Status: Active</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="admin-footer-section">
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '16px',
              fontWeight: '600',
              color: '#d4af37',
              margin: '0 0 16px 0'
            }}>
              Quick Navigation
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {[
                { icon: Home, label: 'Home Content', href: '#home' },
                { icon: MapPin, label: 'Cities Management', href: '#cities' },
                { icon: FileText, label: 'Blog Management', href: '#blogs' },
                { icon: Users, label: 'User Management', href: '#users' },
                { icon: Settings, label: 'System Settings', href: '#settings' }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <a
                    key={index}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#d4af37'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    <Icon size={14} />
                    {item.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          <div>
            © 2024 Socal Real Estate. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: '16px'
          }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
