'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import PrestigeLoading from '@/components/common/PrestigeLoading'
import ConsultationForm from '@/components/common/ConsultationForm'

// Single Landing CSS import - NO MORE CONFLICTS!
import '@/styles/Landing.css'

// Base CSS for variables
import '@/app/globals.css'

interface CountyData {
  slug: string
  name: string
  state: string
  shortDescription: string
  fullDescription: string
  heroImage: string
  heroImageAlt?: string
  cityCount: string
  avgHomePrice?: string
  tags: string[]
  highlights: Array<{
    title: string
    description: string
    icon: string
    bgImage: string
    bgImageAlt?: string
  }>
  faqs: Array<{
    question: string
    answer: string
    category: string
  }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogImageAlt?: string
    twitterCard?: string
  }
  schema_markup?: any[]
  // New fields from updated structure
  url_slug?: string
  meta_title?: string
  meta_description?: string
  h1_title?: string
  primary_keywords?: string[]
  secondary_keywords?: string[]
  express_keywords?: string[]
  agent_keywords?: string[]
  landing_page_text?: string
  express_service?: string
  neighborhood_guide?: string
  market_analysis?: string
  agent_name?: string
  company_name?: string
  contact_phone?: string
  contact_email?: string
  cta_text?: string
}

interface CityData {
  slug: string
  name: string
  state: string
  shortDescription: string
  heroImage: string
  population: string
  avgHomePrice: string
  tags: string[]
  county: string
}

const CountyPage = () => {
  const t = useTranslations('cities')
  const params = useParams()
  const locale = (params as any)?.locale
  const countySlug = (params as any)?.slug
  const [county, setCounty] = useState<CountyData | null>(null)
  const [allCities, setAllCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Debug logging
  useEffect(() => {
    console.log('CountyPage mounted with:', { locale, countySlug })
  }, [locale, countySlug])

  // Reset state when locale or countySlug changes
  useEffect(() => {
    setCounty(null)
    setAllCities([])
    setLoading(true)
    setError(null)
    setActiveTab('all')
    setSearchTerm('')
  }, [locale, countySlug])

  // Fetch county data
  useEffect(() => {
    const fetchCountyData = async () => {
      if (!locale || !countySlug) {
        console.log('Missing locale or countySlug:', { locale, countySlug })
        setError('Missing locale or county slug')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching county data from:', `/api/counties/${locale}/${countySlug}`)
        const response = await fetch(`/api/counties/${locale}/${countySlug}`)
        
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('County data fetched successfully:', data)
          setCounty(data)
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch county data:', response.status, errorData)
          setError(`Failed to load county data: ${response.status}`)
        }
      } catch (error) {
        console.error('Error fetching county data:', error)
        setError('Failed to load county data')
      } finally {
        setLoading(false)
      }
    }

    fetchCountyData()
  }, [locale, countySlug])

  // Fetch all cities to filter by county
  useEffect(() => {
    const fetchCities = async () => {
      if (!locale) return

      try {
        console.log('Fetching cities from:', `/api/cities/${locale}`)
        const response = await fetch(`/api/cities/${locale}`)
        if (response.ok) {
          const cities = await response.json()
          console.log('Cities fetched successfully:', cities.length)
          
          // Check if we got cities from fallback locale
          if (cities.length > 0 && locale !== 'en') {
            console.log(`Note: Cities loaded from fallback locale (en) for requested locale (${locale})`)
          }
          
          setAllCities(cities)
        } else {
          console.error('Failed to fetch cities:', response.status)
          // Set empty array instead of leaving undefined
          setAllCities([])
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        // Set empty array on error
        setAllCities([])
      }
    }

    fetchCities()
  }, [locale])

  // Filter cities by county
  const countyCities = useMemo(() => {
    if (!county || !allCities.length) return []
    
    const filtered = allCities.filter((city: any) => {
      if (!city.county) return false
      
      // Convert county slug to readable format for comparison
      const countySlugReadable = countySlug
        .replace('-', ' ')
        .replace('county', '')
        .trim()
      
      // Check if city's county contains the county name
      const cityCounty = city.county.toLowerCase()
      const targetCounty = countySlugReadable.toLowerCase()
      
      // More robust matching - check if city county contains target county or vice versa
      // Also check if it matches the county name directly
      const countyNameMatch = county.name.toLowerCase() === cityCounty
      const slugMatch = cityCounty.includes(targetCounty) || targetCounty.includes(cityCounty)
      
      return countyNameMatch || slugMatch
    })
    
    console.log('Cities filtered for county:', county.name, 'Count:', filtered.length)
    return filtered
  }, [county, allCities, countySlug])

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    if (!searchTerm) return countyCities
    
    return countyCities.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [countyCities, searchTerm])

  // Pagination for cities - show max 9 cities per page
  const citiesPerPage = 9
  const totalPages = Math.ceil(filteredCities.length / citiesPerPage)
  const startIndex = (currentPage - 1) * citiesPerPage
  const endIndex = startIndex + citiesPerPage
  const displayedCities = filteredCities.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // FAQ categories
  const categories = ['all', ...new Set(county?.faqs?.map(faq => faq.category) || [])]

  // Filter FAQs by active tab
  const filteredFaqs = useMemo(() => {
    if (!county?.faqs) return []
    if (activeTab === 'all') return county.faqs
    return county.faqs.filter(faq => faq.category === activeTab)
  }, [county?.faqs, activeTab])

  // Debug section - show current state
  if (process.env.NODE_ENV === 'development') {
    console.log('CountyPage render state:', { 
      loading, 
      error, 
      county: county?.name, 
      locale, 
      countySlug,
      citiesCount: allCities.length 
    })
  }

  // Show error state
  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
                 <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading County</h1>
         <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
         <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '14px' }}>
           Debug info: locale={locale}, slug={countySlug}
         </p>
         <Link href="/" locale={locale} style={{
           padding: '12px 24px',
           backgroundColor: '#3b82f6',
           color: 'white',
           borderRadius: '8px',
           textDecoration: 'none',
           fontWeight: '600'
         }}>
           {t('countyPage.backToHome')}
         </Link>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <PrestigeLoading />
        <p style={{ color: '#6b7280', marginTop: '1rem', fontSize: '14px' }}>
          Loading county data... (locale: {locale}, slug: {countySlug})
        </p>
      </div>
    )
  }

  // Show not found state
  if (!county) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
                 <h1 style={{ color: '#6b7280', marginBottom: '1rem' }}>County Not Found</h1>
         <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>The county you're looking for doesn't exist.</p>
         <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '14px' }}>
           Debug info: locale={locale}, slug={countySlug}
         </p>
         <Link href="/" locale={locale} style={{
           padding: '12px 24px',
           backgroundColor: '#3b82f6',
           color: 'white',
           borderRadius: '8px',
           textDecoration: 'none',
           fontWeight: '600'
         }}>
           {t('countyPage.backToHome')}
         </Link>
      </div>
    )
  }

  return (
    <>
      <main>
        {/* Ultra Modern Hero Section */}
        <section className="city-hero-ultra">
          {/* Dynamic Background with Parallax */}
          <div className="hero-background-container">
            <div className="hero-bg-primary" style={{ backgroundImage: `url('${county.heroImage}')` }}>
              <div className="hero-bg-overlay"></div>
            </div>
            <div className="hero-bg-secondary"></div>
            <div className="hero-bg-pattern"></div>
            
            {/* Animated Floating Elements */}
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="hero-content-wrapper">
            <div className="hero-content-container">
              {/* Top Badge Section */}
              <div className="hero-top-section">
                <div className="hero-location-badge">
                  <div className="location-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="location-text">{county.state}</span>
                </div>
                
                                 <div className="hero-quick-stats">
                   <div className="quick-stat">
                     <span className="stat-number">{county.cityCount}</span>
                     <span className="stat-label">{t('countyPage.cities')}</span>
                   </div>
                   <div className="stat-divider"></div>
                   <div className="quick-stat">
                     <span className="stat-number">{county.avgHomePrice || 'N/A'}</span>
                     <span className="stat-label">{t('countyPage.avgPrice')}</span>
                   </div>
                 </div>
              </div>

              {/* Main Title Section - Using new h1_title with proper layout */}
              <div className="hero-title-section">
                                 <div className="hero-eyebrow">
                   <span className="eyebrow-text">{t('countyPage.premiumDestination')}</span>
                   <div className="eyebrow-line"></div>
                 </div>
                
                <h1 className="hero-main-title">
                  {county.h1_title ? (
                    <span className="title-line-2">{county.h1_title}</span>
                  ) : (
                                         <>
                       <span className="title-line-1">{t('countyPage.discoverMagicOf')}</span>
                       <span className="title-line-2">{county.name}</span>
                     </>
                  )}
                </h1>
                
                <p className="hero-description">{county.shortDescription}</p>
              </div>

              {/* Interactive Buttons */}
              <div className="hero-actions">
                                 <button className="hero-btn-primary">
                   <div className="btn-content">
                     <span className="btn-text">{t('countyPage.exploreProperties')}</span>
                     <div className="btn-icon">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                         <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </div>
                   </div>
                   <div className="btn-glow"></div>
                 </button>
                 
                 <Link href="/contact" locale={locale} className="hero-btn-secondary">
                   <div className="btn-content">
                     <span className="btn-text">{t('countyPage.contactAgent')}</span>
                     <div className="btn-icon">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                         <path d="M22 2H2L10 12.46V19L14 17V12.46L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </div>
                   </div>
                 </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced City Stats */}
        <section className="city-stats-enhanced">
          <div className="city-stats-container">
            <div className="stats-grid">
              <div className="stat-card">
                                 <div className="stat-number">{county.cityCount}</div>
                 <div className="stat-label">{t('countyPage.cities')}</div>
               </div>
               
               <div className="stat-card">
                 <div className="stat-number">{county.avgHomePrice || 'N/A'}</div>
                 <div className="stat-label">{t('countyPage.avgPrice')}</div>
               </div>
              
              <div className="stat-card">
                                 <div className="stat-number">{county.highlights?.length || 0}</div>
                 <div className="stat-label">{t('countyPage.highlights')}</div>
               </div>
               
               <div className="stat-card">
                 <div className="stat-number">{county.faqs?.length || 0}</div>
                 <div className="stat-label">{t('countyPage.faqs')}</div>
               </div>
            </div>
          </div>
        </section>

        {/* County About Section */}
        <section className="city-about-section">
          <div className="city-about-container">
                         <h2 className="section-title-large">{t('countyPage.about')} {county.name}</h2>
            <p className="about-description">{county.fullDescription}</p>
            
            <div className="city-tags-enhanced">
              {county.tags.map((tag, index) => (
                <span key={index} className="city-tag-enhanced">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* New Landing Page Text Section - Beautiful Design */}
        {county.landing_page_text && (
          <section className="city-landing-section">
            <div className="neighborhood-guide-container">
                             <div className="section-header-center">
                 <span className="section-eyebrow">{t('countyPage.welcomeTo')} {county.name}</span>
                 <h2 className="section-title-large">{t('countyPage.yourRealEstateJourney')}</h2>
               </div>
              <div className="cities-grid-beautiful">
                {county.landing_page_text.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Express Service Section - Beautiful Design */}
        {county.express_service && (
          <section className="city-express-section">
            <div className="neighborhood-guide-container">
                             <div className="section-header-center">
                 <span className="section-eyebrow">{t('countyPage.expressService')}</span>
                 <h2 className="section-title-large">{t('countyPage.whenTimeIsEssence')}</h2>
               </div>
              <div className="cities-grid-beautiful">
                {county.express_service.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* County Highlights Section */}
        <section className="city-highlights-enhanced">
          <div className="highlights-container">
            <div className="section-header-center">
              <span className="section-eyebrow">{t('cityPage.highlights')}</span>
                             <h2 className="section-title-large">{t('countyPage.whatMakesSpecial', { countyName: county.name })}</h2>
            </div>
            
            <div className="cities-grid-beautiful">
              {county.highlights && county.highlights.length > 0 ? (
                county.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-card-enhanced">
                    <div className="highlight-bg" style={{ backgroundImage: `url('${highlight.bgImage}')` }}>
                      <div className="highlight-overlay">
                        <div className="highlight-content">
                           <h3 className="highlight-title">{highlight.title}</h3>
                           <p className="highlight-description">{highlight.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>No highlights available for {county.name} at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* New Market Analysis Section - Simple Card Design */}
        {county.market_analysis && (
          <section className="city-market-analysis-section">
            <div className="neighborhood-guide-container">
                             <div className="section-header-center">
                 <span className="section-eyebrow">{t('countyPage.marketAnalysis')}</span>
                 <h2 className="section-title-large">{t('countyPage.currentRealEstateTrends', { countyName: county.name })}</h2>
               </div>
              
              <div className="cities-grid-beautiful">
                {county.market_analysis.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Neighborhood Guide Section - Beautiful Design */}
        {county.neighborhood_guide && (
          <section className="city-neighborhood-guide-section">
            <div className="neighborhood-guide-container">
                             <div className="section-header-center">
                 <span className="section-eyebrow">{t('countyPage.countyGuide')}</span>
                 <h2 className="section-title-large">{t('countyPage.discoverBestAreas', { countyName: county.name })}</h2>
               </div>
              <div className="cities-grid-beautiful">
                {county.neighborhood_guide.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Beautiful Cities Section - Replaces Neighborhoods */}
        <section className="cities-section-beautiful" id="cities">
          <div className="cities-container-beautiful">
                         <div className="section-header-beautiful">
               <span className="section-eyebrow">{t('countyPage.citiesInCounty', { countyName: county.name })}</span>
               <h2 className="section-title-beautiful">{t('countyPage.exploreCitiesInCounty', { countyName: county.name })}</h2>
               <p className="section-subtitle-beautiful">{t('countyPage.discoverDiverseCities', { countyName: county.name })}</p>
             </div>

            {/* Show message if cities couldn't be loaded */}
            {allCities.length === 0 && (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                                 <p style={{ marginBottom: '1rem' }}>
                   {locale === 'en' 
                     ? t('countyPage.citiesInfoUpdating')
                     : t('countyPage.citiesInfoEnglishOnly')
                   }
                 </p>
                 {locale !== 'en' && (
                   <Link 
                     href={`/en/county/${countySlug}`}
                     style={{
                       padding: '8px 16px',
                       backgroundColor: '#3b82f6',
                       color: 'white',
                       borderRadius: '6px',
                       textDecoration: 'none',
                       fontSize: '14px'
                     }}
                   >
                     {t('countyPage.viewInEnglish')}
                   </Link>
                 )}
              </div>
            )}

            {/* Search Bar - Only show if cities exist */}
            {allCities.length > 0 && (
              <div className="search-container" style={{ 
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="search-input-wrapper" style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '500px'
                }}>
                  <div className="search-icon" style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    zIndex: 1
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                                     <input
                     type="text"
                     placeholder={t('countyPage.searchCities')}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="search-input"
                    style={{
                      width: '100%',
                      padding: '16px 20px 16px 50px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="clear-search-btn"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                                 <div className="search-results-info" style={{ 
                   textAlign: 'center', 
                   marginTop: '12px', 
                   color: '#6b7280',
                   fontSize: '14px',
                   fontWeight: '500'
                 }}>
                   {filteredCities.length} {t('countyPage.citiesFound')}
                 </div>
              </div>
            )}
            
            {/* Cities Grid - Only show if cities exist */}
            {allCities.length > 0 && (
              <div className="cities-grid-beautiful">
                {displayedCities.length > 0 ? (
                  displayedCities.map((city, index) => (
                    <Link 
                      key={city.slug} 
                      href={`/cities/${city.slug}`}
                      locale={locale}
                      className="city-card-beautiful"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="city-card-inner-beautiful">
                        <div className="city-image-beautiful" style={{ backgroundImage: `url('${city.heroImage}')` }}>
                          <div className="city-gradient-overlay-beautiful"></div>
                          <div className="city-badges-beautiful">
                            <span className="city-state-badge-beautiful">{city.state}</span>
                            <span className="city-price-badge-beautiful">{city.avgHomePrice}</span>
                          </div>
                        </div>
                        
                        <div className="city-content-beautiful">
                          <div className="city-header-beautiful">
                            <h3 className="city-name-beautiful">{city.name}</h3>
                                                       <div className="city-neighborhoods-count-beautiful">
                             {t('countyPage.population')}: {city.population}
                           </div>
                          </div>
                          
                          <p className="city-description-beautiful">{city.shortDescription}</p>
                          
                          <div className="city-tags-row-beautiful">
                            {city.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span key={tagIndex} className="city-tag-beautiful">{tag}</span>
                            ))}
                          </div>
                          
                          <div className="city-card-footer-beautiful">
                            <div className="explore-arrow-beautiful">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                                 ) : (
                   <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                     <p>{t('countyPage.noCitiesFound', { countyName: county.name })}</p>
                   </div>
                 )}
              </div>
            )}

            {/* Pagination - Only show if cities exist and there are multiple pages */}
            {allCities.length > 0 && totalPages > 1 && (
              <div className="pagination-section" style={{
                marginTop: '4rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div className="pagination-container" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative'
                }}>
                  {/* Previous Button */}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn prev-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '12px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      backgroundColor: currentPage === 1 ? 'rgba(156, 163, 175, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                      color: currentPage === 1 ? 'rgba(156, 163, 175, 0.6)' : '#3b82f6',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '100px',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
                      transition: 'transform 0.2s ease'
                    }}>
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                                         {t('countyPage.previous')}
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="pagination-pages" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    margin: '0 1rem'
                  }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      if (pageNum > totalPages) return null
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: currentPage === pageNum ? '#3b82f6' : 'rgba(156, 163, 175, 0.1)',
                            color: currentPage === pageNum ? '#ffffff' : '#6b7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '14px',
                            fontWeight: currentPage === pageNum ? '700' : '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== pageNum) {
                              e.currentTarget.style.backgroundColor = currentPage === pageNum ? '#3b82f6' : 'rgba(156, 163, 175, 0.2)'
                              e.currentTarget.style.transform = 'scale(1.1)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== pageNum) {
                              e.currentTarget.style.backgroundColor = currentPage === pageNum ? '#3b82f6' : 'rgba(156, 163, 175, 0.1)'
                              e.currentTarget.style.transform = 'scale(1)'
                            }
                          }}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span style={{ color: '#9ca3af', margin: '0 4px' }}>...</span>}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: currentPage === totalPages ? '#3b82f6' : 'rgba(156, 163, 175, 0.1)',
                            color: currentPage === totalPages ? '#ffffff' : '#6b7280',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '14px',
                            fontWeight: currentPage === totalPages ? '700' : '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== totalPages) {
                              e.currentTarget.style.backgroundColor = 'rgba(156, 163, 175, 0.2)'
                              e.currentTarget.style.transform = 'scale(1.1)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== totalPages) {
                              e.currentTarget.style.backgroundColor = currentPage === totalPages ? '#3b82f6' : 'rgba(156, 163, 175, 0.1)'
                              e.currentTarget.style.transform = 'scale(1)'
                            }
                          }}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Next Button */}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn next-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '12px 20px',
                      border: 'none',
                      borderRadius: '12px',
                      backgroundColor: currentPage === totalPages ? 'rgba(156, 163, 175, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                      color: currentPage === totalPages ? 'rgba(156, 163, 175, 0.6)' : '#3b82f6',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '100px',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.25)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.backgroundColor = currentPage === totalPages ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    {t('countyPage.next')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
                      transition: 'transform 0.2s ease'
                    }}>
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced FAQs Section */}
        <section className="city-faqs-enhanced">
          <div className="faqs-container">
            <div className="section-header-center">
              <span className="section-eyebrow">{t('cityPage.faq')}</span>
              <h2 className="section-title-large">{t('cityPage.everythingYouNeedToKnow')}</h2>
            </div>
            
            {/* FAQ Categories */}
            <div className="faq-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`faq-category-btn ${activeTab === category ? 'active' : ''}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category === 'all' ? t('cityPage.allQuestions') : category}
                </button>
              ))}
            </div>

            {/* FAQ Grid */}
            <div className="faqs-grid">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="faq-card-enhanced">
                  <div className="faq-category-tag">{faq.category}</div>
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Consultation Section - EXACTLY like Home Page */}
                 <ConsultationForm
           title={t('countyPage.readyToFindDreamProperty')}
           text={t('countyPage.contactExpertTeam')}
           button={t('countyPage.scheduleConsultation')}
           cityName={county?.name}
           showCitySpecific={true}
           salutationLabel={t('countyPage.title')}
           rezaBarghlameno={t('countyPage.rezaBarghlameno')}
           primeLocalHomes={t('countyPage.primeLocalHomes')}
           readyToBuyOrSell={t('countyPage.readyToBuyOrSell', { countyName: county?.name || 'Southern California' })}
           name={t('countyPage.name')}
           enterYourName={t('countyPage.enterYourName')}
           phone={t('countyPage.phone')}
           enterYourPhone={t('countyPage.enterYourPhone')}
           email={t('countyPage.email')}
           enterYourEmail={t('countyPage.enterYourEmail')}
           message={t('countyPage.message')}
           enterYourMessage={t('countyPage.enterYourMessage')}
           sendMessage={t('countyPage.sendMessage')}
           back={t('countyPage.backToHome')}
           sending={t('countyPage.sending')}
         />

        {/* Back to Counties Link */}
        <section className="city-back-enhanced">
          <div className="back-container">
            <Link href="/" locale={locale} className="back-btn-enhanced">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
                             <span>{t('countyPage.backToHome')}</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default CountyPage
