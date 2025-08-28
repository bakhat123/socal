"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X, Globe } from "lucide-react"
import { HomeData } from "@/types"

interface HomeManagerProps {
  homeData: HomeData
  updateHomeData: (data: HomeData, locale: string) => void
  currentLocale: string
  onLocaleChange: (locale: string) => void
}

export default function HomeManager({ 
  homeData, 
  updateHomeData,
  currentLocale,
  onLocaleChange
}: HomeManagerProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<HomeData>(homeData)
  const [uploading, setUploading] = useState(false)

  // Update editData whenever homeData changes (e.g., when locale changes)
  useEffect(() => {
    setEditData(homeData)
  }, [homeData])

  const availableLocales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ]

  const handleEdit = (section: string) => {
    setEditingSection(section)
    setEditData(homeData)
  }

  const handleSave = () => {
    updateHomeData(editData, currentLocale)
    setEditingSection(null)
  }

  const handleCancel = () => {
    setEditingSection(null)
    setEditData(homeData)
  }

  const handleLocaleChange = (locale: string) => {
    onLocaleChange(locale)
    setEditingSection(null) // Close any open editing sections when changing locale
  }

  return (
    <div className="admin-home-content">
      {/* Locale Selector */}
      <div className="locale-selector" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe size={20} color="#64748b" />
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
            Edit Home Page Content for:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {availableLocales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleLocaleChange(locale.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: currentLocale === locale.code ? '2px solid #d4af37' : '1px solid #e2e8f0',
                background: currentLocale === locale.code ? 'rgba(212, 175, 55, 0.1)' : 'white',
                color: currentLocale === locale.code ? '#d4af37' : '#64748b',
                fontSize: '14px',
                fontWeight: currentLocale === locale.code ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '80px',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '16px' }}>{locale.flag}</span>
              <span>{locale.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-header" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, rgba(241, 245, 249, 0) 50%, rgba(212, 175, 55, 0.03) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Home Page Content - {availableLocales.find(l => l.code === currentLocale)?.name}</h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>Manage and customize your home page content for {availableLocales.find(l => l.code === currentLocale)?.name}</p>
        </div>
      </div>

      <div className="content-grid">
        {/* Hero Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Hero Section</h3>
              <p className="card-subtitle">Main landing section</p>
            </div>
            <div className="card-actions">
              {editingSection === 'hero' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('hero')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'hero' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Badge</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.badge}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, badge: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.hero.subtitle}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">View Properties Button</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.viewProperties}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, viewProperties: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Us Button</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.contactUs}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, contactUs: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scroll Down Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.scrollDown}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, scrollDown: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Background Image</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter image URL or upload image"
                  value={editData.hero.backgroundImage || ''}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, backgroundImage: e.target.value }
                  }))}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setUploading(true)
                        try {
                          const formData = new FormData()
                          formData.append('file', file)
                          formData.append('type', 'hero')

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                          })

                          if (response.ok) {
                            const result = await response.json()
                            // Update the backgroundImage with the new file URL
                            setEditData(prev => ({
                              ...prev,
                              hero: { ...prev.hero, backgroundImage: result.fileUrl }
                            }))
                            alert('Image uploaded successfully!')
                          } else {
                            console.error('Upload failed')
                            alert('Failed to upload image')
                          }
                        } catch (error) {
                          console.error('Upload error:', error)
                          alert('Error uploading image')
                        } finally {
                          setUploading(false)
                        }
                      }
                    }}
                    style={{
                      padding: '8px',
                      border: '1px solid #d2d6dc',
                      borderRadius: '6px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      opacity: uploading ? 0.6 : 1
                    }}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        border: '2px solid #e2e8f0',
                        borderTop: '2px solid #d4af37',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Uploading...
                    </div>
                  )}
                </div>
                <small className="form-help">Enter a valid image URL or upload an image file (will replace existing hero image)</small>
                
                {/* Current Image Preview */}
                {editData.hero.backgroundImage && (
                  <div style={{ marginTop: '15px' }}>
                    <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', display: 'block' }}>
                      Current Background Image:
                    </label>
                    <div style={{
                      width: '200px',
                      height: '120px',
                      backgroundImage: `url('${editData.hero.backgroundImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}>
                        Preview
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="hero-preview" style={{
                position: 'relative',
                height: '300px',
                backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url('${homeData.hero.backgroundImage || '/home/hero.jpg'}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '8px',
                padding: '40px',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ maxWidth: '600px' }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid #d4af37',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: '#d4af37',
                    letterSpacing: '1px',
                    marginBottom: '20px',
                    textTransform: 'uppercase'
                  }}>{homeData.hero.badge}</div>
                  
                  <h4 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '28px',
                    fontWeight: '500',
                    lineHeight: '1.1',
                    marginBottom: '15px',
                    maxWidth: '400px'
                  }}>{homeData.hero.title}</h4>
                  
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: '300',
                    marginBottom: '25px',
                    maxWidth: '500px',
                    opacity: '0.9',
                    lineHeight: '1.5'
                  }}>{homeData.hero.subtitle}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <button style={{
                      background: '#d4af37',
                      color: '#1a1a1a',
                      padding: '12px 25px',
                      border: 'none',
                      borderRadius: '2px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>{homeData.hero.viewProperties}</button>
                    
                    <button style={{
                      background: 'transparent',
                      color: 'white',
                      padding: '12px 25px',
                      border: '1px solid white',
                      borderRadius: '2px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>{homeData.hero.contactUs}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Stats Section</h3>
              <p className="card-subtitle">Statistics and numbers</p>
            </div>
            <div className="card-actions">
              {editingSection === 'stats' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('stats')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'stats' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Years Experience Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.yearsExperience}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, yearsExperience: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Years Experience Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.yearsExperienceLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, yearsExperienceLabel: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Billion in Sales Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.billionInSales}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, billionInSales: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Billion in Sales Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.billionInSalesLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, billionInSalesLabel: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Countries Served Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.countriesServed}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, countriesServed: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Countries Served Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.countriesServedLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, countriesServedLabel: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Satisfaction Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.clientSatisfaction}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, clientSatisfaction: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Satisfaction Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.clientSatisfactionLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, clientSatisfactionLabel: e.target.value }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="stats-preview">
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.yearsExperience}</span>
                  <span className="stat-label">{homeData.stats.yearsExperienceLabel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.billionInSales}</span>
                  <span className="stat-label">{homeData.stats.billionInSalesLabel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.countriesServed}</span>
                  <span className="stat-label">{homeData.stats.countriesServedLabel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.clientSatisfaction}</span>
                  <span className="stat-label">{homeData.stats.clientSatisfactionLabel}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cities Section Blueprint */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Cities Section</h3>
              <p className="card-subtitle">Cities showcase</p>
            </div>
            <div className="card-actions">
              {editingSection === 'cities' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('cities')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'cities' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.cities?.title || ''}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cities: { 
                      title: e.target.value,
                      subtitle: prev.cities?.subtitle || ''
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.cities?.subtitle || ''}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cities: { 
                      title: prev.cities?.title || '',
                      subtitle: e.target.value
                    }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="section-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 className="section-title" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  {homeData.cities?.title || ''}
                </h2>
                <p className="section-subtitle" style={{
                  fontSize: '18px',
                  color: 'rgba(26, 26, 26, 0.7)',
                  margin: '0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  {homeData.cities?.subtitle || ''}
                </p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {/* City Card Blueprints */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏙️</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>City Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from cities.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌆</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>City Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from cities.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏘️</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>City Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from cities.json</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Blog Section Blueprint */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Blog Section</h3>
              <p className="card-subtitle">Latest articles</p>
            </div>
            <div className="card-actions">
              {editingSection === 'blog' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('blog')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'blog' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.blog?.title || ''}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    blog: { 
                      title: e.target.value,
                      subtitle: prev.blog?.subtitle || ''
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.blog?.subtitle || ''}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    blog: { 
                      title: prev.blog?.title || '',
                      subtitle: e.target.value
                    }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="section-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 className="section-title" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  {homeData.blog?.title || ''}
                </h2>
                <p className="section-subtitle" style={{
                  fontSize: '18px',
                  color: 'rgba(26, 26, 26, 0.7)',
                  margin: '0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  {homeData.blog?.subtitle || ''}
                </p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {/* Blog Card Blueprints */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📰</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Blog Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from blogs.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Blog Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from blogs.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Blog Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from blogs.json</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Services Section</h3>
              <p className="card-subtitle">Service offerings</p>
            </div>
            <div className="card-actions">
              {editingSection === 'services' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('services')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'services' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { ...prev.services, title: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.subtitle}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { ...prev.services, subtitle: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Acquisition Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.propertyAcquisition.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      propertyAcquisition: { 
                        ...prev.services.propertyAcquisition, 
                        title: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Acquisition Description</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.propertyAcquisition.description}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      propertyAcquisition: { 
                        ...prev.services.propertyAcquisition, 
                        description: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Acquisition Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.propertyAcquisition.icon}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      propertyAcquisition: { 
                        ...prev.services.propertyAcquisition, 
                        icon: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Investment Advisory Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.investmentAdvisory.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      investmentAdvisory: { 
                        ...prev.services.investmentAdvisory, 
                        title: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Investment Advisory Description</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.investmentAdvisory.description}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      investmentAdvisory: { 
                        ...prev.services.investmentAdvisory, 
                        description: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Investment Advisory Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.investmentAdvisory.icon}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      investmentAdvisory: { 
                        ...prev.services.investmentAdvisory, 
                        icon: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relocation Services Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.relocationServices.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      relocationServices: { 
                        ...prev.services.relocationServices, 
                        title: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relocation Services Description</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.relocationServices.description}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      relocationServices: { 
                        ...prev.services.relocationServices, 
                        description: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relocation Services Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.relocationServices.icon}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      relocationServices: { 
                        ...prev.services.relocationServices, 
                        icon: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="section-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 className="section-title" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  {homeData.services.title}
                </h2>
                <p className="section-subtitle" style={{
                  fontSize: '18px',
                  color: 'rgba(26, 26, 26, 0.7)',
                  margin: '0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  {homeData.services.subtitle}
                </p>
              </div>
              <div className="services-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <div className="service-card" style={{
                  padding: '50px 35px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}>
                  <div className="service-premium-leaves" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <div className="service-leaf-top-right" style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '200px',
                      height: '140px',
                      background: 'url("/golden-leaves.png") no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      transformOrigin: '100% 0%',
                      transform: 'scale(0) rotate(-45deg)',
                      opacity: '0',
                      transition: 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      zIndex: '2'
                    }}></div>
                  </div>
                  <div className="service-icon" style={{
                    fontSize: '48px',
                    marginBottom: '25px',
                    color: '#d4af37',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.propertyAcquisition.icon}
                  </div>
                  <h3 className="service-title" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    marginBottom: '18px',
                    color: '#1a1a1a',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.propertyAcquisition.title}
                  </h3>
                  <p className="service-description" style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'rgba(26, 26, 26, 0.7)',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.propertyAcquisition.description}
                  </p>
                </div>

                <div className="service-card" style={{
                  padding: '50px 35px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}>
                  <div className="service-premium-leaves" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <div className="service-leaf-top-right" style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '200px',
                      height: '140px',
                      background: 'url("/golden-leaves.png") no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      transformOrigin: '100% 0%',
                      transform: 'scale(0) rotate(-45deg)',
                      opacity: '0',
                      transition: 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      zIndex: '2'
                    }}></div>
                  </div>
                  <div className="service-icon" style={{
                    fontSize: '48px',
                    marginBottom: '25px',
                    color: '#d4af37',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.investmentAdvisory.icon}
                  </div>
                  <h3 className="service-title" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    marginBottom: '18px',
                    color: '#1a1a1a',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.investmentAdvisory.title}
                  </h3>
                  <p className="service-description" style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'rgba(26, 26, 26, 0.7)',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.investmentAdvisory.description}
                  </p>
                </div>

                <div className="service-card" style={{
                  padding: '50px 35px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}>
                  <div className="service-premium-leaves" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <div className="service-leaf-top-right" style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '200px',
                      height: '140px',
                      background: 'url("/golden-leaves.png") no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      transformOrigin: '100% 0%',
                      transform: 'scale(0) rotate(-45deg)',
                      opacity: '0',
                      transition: 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      zIndex: '2'
                    }}></div>
                  </div>
                  <div className="service-icon" style={{
                    fontSize: '48px',
                    marginBottom: '25px',
                    color: '#d4af37',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.relocationServices.icon}
                  </div>
                  <h3 className="service-title" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    marginBottom: '18px',
                    color: '#1a1a1a',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.relocationServices.title}
                  </h3>
                  <p className="service-description" style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'rgba(26, 26, 26, 0.7)',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.relocationServices.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        

        {/* Testimonials Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Testimonials Section</h3>
              <p className="card-subtitle">Customer testimonials and reviews</p>
            </div>
            <div className="card-actions">
              {editingSection === 'testimonials' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('testimonials')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'testimonials' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.testimonials.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    testimonials: { ...prev.testimonials, title: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.testimonials.subtitle}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    testimonials: { ...prev.testimonials, subtitle: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Testimonials Management</label>
                <div className="testimonials-management">
                  <div className="testimonials-list">
                    {editData.testimonials.items.map((testimonial, index) => (
                      <div key={testimonial.id} className="testimonial-item" style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                        background: '#f8fafc'
                      }}>
                        <div className="testimonial-header" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                            Testimonial {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = editData.testimonials.items.filter((_, i) => i !== index)
                              setEditData(prev => ({
                                ...prev,
                                testimonials: { 
                                  ...prev.testimonials,
                                  items: newItems
                                }
                              }))
                            }}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="testimonial-fields" style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px'
                        }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '12px' }}>Author Name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={testimonial.author}
                              onChange={(e) => {
                                const newItems = [...editData.testimonials.items]
                                newItems[index] = { ...newItems[index], author: e.target.value }
                                setEditData(prev => ({
                                  ...prev,
                                  testimonials: { 
                                    ...prev.testimonials,
                                    items: newItems
                                  }
                                }))
                              }}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '12px' }}>Rating (1-5)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              className="form-input"
                              value={testimonial.rating}
                              onChange={(e) => {
                                const newItems = [...editData.testimonials.items]
                                newItems[index] = { ...newItems[index], rating: parseInt(e.target.value) || 5 }
                                setEditData(prev => ({
                                  ...prev,
                                  testimonials: { 
                                    ...prev.testimonials,
                                    items: newItems
                                  }
                                }))
                              }}
                            />
                          </div>
                          
                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label" style={{ fontSize: '12px' }}>Quote</label>
                            <textarea
                              className="form-textarea"
                              value={testimonial.quote}
                              onChange={(e) => {
                                const newItems = [...editData.testimonials.items]
                                newItems[index] = { ...newItems[index], quote: e.target.value }
                                setEditData(prev => ({
                                  ...prev,
                                  testimonials: { 
                                    ...prev.testimonials,
                                    items: newItems
                                  }
                                }))
                              }}
                              placeholder="Customer testimonial quote"
                              rows={3}
                            />
                          </div>
                          
                          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label" style={{ fontSize: '12px' }}>Author Image</label>
                            <input
                              type="text"
                              className="form-input"
                              value={testimonial.image}
                              onChange={(e) => {
                                const newItems = [...editData.testimonials.items]
                                newItems[index] = { ...newItems[index], image: e.target.value }
                                setEditData(prev => ({
                                  ...prev,
                                  testimonials: { 
                                    ...prev.testimonials,
                                    items: newItems
                                  }
                                }))
                              }}
                              placeholder="Image URL or path (e.g., /testimonials/author1.jpg)"
                            />
                            <small className="form-help">Enter image URL or upload path</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newTestimonial = {
                        id: `t${Date.now()}`,
                        quote: 'New testimonial quote',
                        author: 'New Author',
                        rating: 5,
                        image: '/testimonials/author-default.jpg'
                      }
                      const newItems = [...editData.testimonials.items, newTestimonial]
                      setEditData(prev => ({
                        ...prev,
                        testimonials: { 
                          ...prev.testimonials,
                          items: newItems
                        }
                      }))
                    }}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      marginTop: '16px',
                      width: '100%'
                    }}
                  >
                    + Add New Testimonial
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="section-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  {homeData.testimonials.title}
                </h2>
                <p className="section-subtitle" style={{
                  fontSize: '18px',
                  color: 'rgba(26, 26, 26, 0.7)',
                  margin: '0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  {homeData.testimonials.subtitle}
                </p>
              </div>
              
              <div className="testimonials-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {homeData.testimonials.items.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card" style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div className="testimonial-rating" style={{
                      display: 'flex',
                      gap: '4px',
                      marginBottom: '12px',
                      justifyContent: 'center'
                    }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{
                          color: i < testimonial.rating ? '#fbbf24' : '#d1d5db',
                          fontSize: '18px'
                        }}>
                          ★
                        </span>
                      ))}
                    </div>
                    
                    <blockquote style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#374151',
                      margin: '0 0 16px 0',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      maxHeight: '80px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      "{testimonial.quote.length > 120 ? testimonial.quote.substring(0, 120) + '...' : testimonial.quote}"
                    </blockquote>
                    
                    <div className="testimonial-author" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}>
                      <div className="author-image" style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: '#64748b'
                      }}>
                        {testimonial.image && testimonial.image !== '/testimonials/author-default.jpg' ? (
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.author}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div className="author-info">
                        <div className="author-name" style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>
                          {testimonial.author}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">CTA Section</h3>
              <p className="card-subtitle">Call to action</p>
            </div>
            <div className="card-actions">
              {editingSection === 'cta' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('cta')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'cta' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.cta.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, title: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Text</label>
                <textarea
                  className="form-textarea"
                  value={editData.cta.text}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, text: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.cta.button}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, button: e.target.value }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="cta-preview" style={{
                background: '#1a1a1a',
                color: 'white',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0) 50%, rgba(212, 175, 55, 0.05) 100%)',
                  zIndex: 1
                }}></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h4 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    fontWeight: '500',
                    marginBottom: '15px',
                    color: 'white'
                  }}>{homeData.cta.title}</h4>
                  <p style={{
                    fontSize: '14px',
                    marginBottom: '25px',
                    opacity: '0.8',
                    lineHeight: '1.6',
                    color: 'white'
                  }}>{homeData.cta.text}</p>
                  <button style={{
                    background: 'transparent',
                    color: 'white',
                    padding: '12px 25px',
                    border: '2px solid #d4af37',
                    borderRadius: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease'
                  }}>{homeData.cta.button}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
