'use client'

import React, { useState, useEffect } from 'react'

interface ContactHeroProps {
  contactData: Record<string, any>
}

const ContactHero = ({ contactData }: ContactHeroProps) => {
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0)
  
  const properties = contactData?.hero?.recentSales?.properties || []
  const totalProperties = properties.length
  
  // Debug: Log the properties to see what imageUrl values we have
  console.log('ContactHero properties:', properties)
  console.log('ContactHero imageUrls:', properties.map((p: any) => p.imageUrl))
  
  // Test image loading
  useEffect(() => {
    properties.forEach((property: any, index: number) => {
      if (property.imageUrl) {
        const img = new Image()
        img.onload = () => console.log(`✅ Image ${index} loaded successfully:`, property.imageUrl)
        img.onerror = () => console.log(`❌ Image ${index} failed to load:`, property.imageUrl)
        img.src = property.imageUrl
      }
    })
  }, [properties])
  
  const nextProperties = () => {
    if (totalProperties > 4) {
      setCurrentPropertyIndex((prev) => 
        prev + 4 >= totalProperties ? 0 : prev + 4
      )
    }
  }

  const prevProperties = () => {
    if (totalProperties > 4) {
      setCurrentPropertyIndex((prev) => 
        prev - 4 < 0 ? Math.max(0, totalProperties - 4) : prev - 4
      )
    }
  }

  // Get current 4 properties to display
  const currentProperties = properties.slice(currentPropertyIndex, currentPropertyIndex + 4)

  return (
    <section className="contact-profile-hero">
      <div className="contact-container">
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-image-container">
              <div className="profile-image" style={{ width: '140px', height: '140px', overflow: 'hidden' }}>
                {contactData?.author?.photo ? (
                  <img 
                    src={contactData.author.photo} 
                    alt={contactData.author.name || 'Author'} 
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center top'
                    }}
                  />
                ) : (
                  <div className="profile-placeholder">RB</div>
                )}
              </div>
              <div className="profile-status">
                <div className="status-dot"></div>
                <span>{contactData?.hero?.profileStatus || 'Available Now'}</span>
              </div>
            </div>
            
            <div className="profile-details">
              <h2 className="profile-name">
                {contactData?.author?.name || 'Reza Barghlameno'}
              </h2>
              <span className="form-badge dre-badge">CA DRE # 02211952</span>
              <p className="profile-company">{contactData?.hero?.profileCompany || 'eXp of California'}</p>
              <p className="profile-title">{contactData?.hero?.profileTitle || 'Lead of Crown Coastal Concierge'}</p>
            </div>
          </div>

          <div className="profile-hero-right">
            <div className="recent-sales-preview">
              <div className="sales-preview-header">
                <h3>{contactData?.hero?.recentSales?.title || 'Recent Sales'} ({totalProperties})</h3>
              </div>
              <div className="sales-preview-grid-compact">
                {currentProperties.map((property: Record<string, any>, index: number) => {
                  // Debug: Log each property's imageUrl
                  console.log(`Property ${index}:`, property.address, 'Image URL:', property.imageUrl);
                  
                  return (
                    <div key={index} className="sale-preview-card-compact" style={{
                      transition: 'all 0.3s ease',
                      opacity: 1,
                      transform: 'translateX(0)'
                    }}>
                      <div className="sale-preview-image-compact">
                        <div style={{ position: 'relative' }}>
                          <img
                            src={property.imageUrl || "/raza.jpg"}
                            alt="Property"
                            style={{
                              width: '100%',
                              height: '160px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              // Fallback to default image if property image fails to load
                              const target = e.target as HTMLImageElement;
                              console.log('Image failed to load:', property.imageUrl, 'falling back to /raza.jpg');
                              target.src = "/raza.jpg";
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', property.imageUrl);
                            }}
                          />
                        </div>
                        <span className="sale-preview-type-compact">{contactData?.hero?.recentSales?.sold || 'Sold'}</span>
                      </div>
                      <div className="sale-preview-content-compact">
                        <h4>{property.address}</h4>
                        <p className="sale-preview-price">{property.price}</p>
                        <span className="sale-preview-date">{property.year}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Carousel Navigation */}
              {totalProperties > 4 && (
                <div className="carousel-navigation" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '20px',
                  marginTop: '24px'
                }}>
                  <button
                    onClick={prevProperties}
                    className="carousel-arrow prev"
                    style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #fbbf24 100%)',
                      color: 'white',
                      border: 'none',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3"
                      style={{ marginLeft: '-2px' }}
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#d4af37',
                      fontWeight: '600'
                    }}>
                      {Math.floor(currentPropertyIndex / 4) + 1}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      of
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#d4af37',
                      fontWeight: '600'
                    }}>
                      {Math.ceil(totalProperties / 4)}
                    </span>
                  </div>
                  
                  <button
                    onClick={nextProperties}
                    className="carousel-arrow next"
                    style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #fbbf24 100%)',
                      color: 'white',
                      border: 'none',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3"
                      style={{ marginRight: '-2px' }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHero

