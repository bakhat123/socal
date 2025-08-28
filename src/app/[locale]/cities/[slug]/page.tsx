// Keep as client for UI, but move SEO to server via generateMetadata in adjacent file
// ⚠️ WARNING: DO NOT MODIFY THE CONSULTATION SECTION BELOW - IT IS WORKING PERFECTLY! ⚠️
// The consultation section has been carefully crafted with FULL SECTION FLIP and should not be changed.
// Any modifications will break the beautiful flip animation and design.

'use client'

import React, { useState, useEffect } from 'react'
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

// using useParams in client to avoid accessing Promise-based params prop

interface CityData {
  slug: string
  name: string
  state: string
  shortDescription: string
  fullDescription: string
  heroImage: string
  heroImageAlt?: string
  population: string
  avgHomePrice: string
  tags: string[]
  neighborhoods: Array<{
    name: string
    type: string
    slug: string
    description: string
    image: string
    imageAlt?: string
    distance: string
    avgHomePrice: string
    county: string
  }>
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

const CityPage = () => {
  const t = useTranslations('cities')
  const params = useParams()
  const locale = (params as any)?.locale
  const slug = (params as any)?.slug
  const [city, setCity] = useState<CityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')


  useEffect(() => {
    const fetchCityData = async () => {
      try {
        // Try to fetch from the new multi-language structure
        const response = await fetch(`/api/cities/${locale}/${slug}`)
        
        if (response.ok) {
          const cityData = await response.json()
          setCity(cityData)
        } else {
          // Fallback to English if the locale doesn't exist
          const fallbackResponse = await fetch(`/api/cities/en/${slug}`)
          if (fallbackResponse.ok) {
            const cityData = await fallbackResponse.json()
            setCity(cityData)
          } else {
            notFound()
          }
        }
      } catch (error) {
        console.error('Error fetching city data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchCityData()
  }, [slug, locale])

  if (loading) {
    return <PrestigeLoading />
  }

  if (!city) {
    notFound()
  }

  const categories = ['all', ...new Set(city.faqs.map(faq => faq.category))]
  const filteredFaqs = activeTab === 'all' ? city.faqs : city.faqs.filter(faq => faq.category === activeTab)

  // Use new URL slug if available, otherwise fallback to original slug
  const cityUrlSlug = city.url_slug || `/cities/${city.slug}`



  return (
    <>
      <main className="city-page">
        {/* Ultra Modern Hero Section */}
        <section className="city-hero-ultra">
          {/* Dynamic Background with Parallax */}
          <div className="hero-background-container">
            <div className="hero-bg-primary" style={{ backgroundImage: `url('${city.heroImage}')` }}>
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
                  <span className="location-text">{city.state}</span>
                </div>
                
                <div className="hero-quick-stats">
                  <div className="quick-stat">
                    <span className="stat-number">{city.population}</span>
                    <span className="stat-label">{t('cityPage.residents')}</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="quick-stat">
                    <span className="stat-number">{city.avgHomePrice}</span>
                    <span className="stat-label">{t('cityPage.avgPrice')}</span>
                  </div>
                </div>
              </div>

              {/* Main Title Section - Using new h1_title with proper layout */}
              <div className="hero-title-section">
                <div className="hero-eyebrow">
                  <span className="eyebrow-text">{t('cityPage.premiumDestination')}</span>
                  <div className="eyebrow-line"></div>
                </div>
                
                <h1 className="hero-main-title">
                  {city.h1_title ? (
                    <span className="title-line-2">{city.h1_title}</span>
                  ) : (
                    <>
                      <span className="title-line-1">{t('cityPage.discoverMagicOf')}</span>
                      <span className="title-line-2">{city.name}</span>
                    </>
                  )}
                </h1>
                
                <p className="hero-description">{city.shortDescription}</p>
              </div>

              {/* Interactive Buttons */}
              <div className="hero-actions">
                <button className="hero-btn-primary">
                  <div className="btn-content">
                    <span className="btn-text">{t('cityPage.exploreProperties')}</span>
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
                    <span className="btn-text">{t('cityPage.contactAgent')}</span>
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
                <div className="stat-number">{city.population}</div>
                <div className="stat-label">{t('cityPage.population')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">{city.avgHomePrice}</div>
                <div className="stat-label">{t('cityPage.avgHomePrice')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">{city.neighborhoods.length}</div>
                <div className="stat-label">{t('cityPage.neighborhoods')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-number">{city.highlights.length}</div>
                <div className="stat-label">{t('cityPage.highlights')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* City About Section */}
        <section className="city-about-section">
          <div className="city-about-container">
            <h2 className="section-title-large">{t('cityPage.about')} {city.name}</h2>
            <p className="about-description">{city.fullDescription}</p>
            
            <div className="city-tags-enhanced">
              {city.tags.map((tag, index) => (
                <span key={index} className="city-tag-enhanced">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* New Landing Page Text Section - Beautiful Design */}
        {city.landing_page_text && (
          <section className="city-landing-section">
            <div className="neighborhood-guide-container">
              <div className="section-header-center">
                <span className="section-eyebrow">Welcome to {city.name}</span>
                <h2 className="section-title-large">Your Real Estate Journey Starts Here</h2>
              </div>
              <div className="cities-grid-beautiful">
                {city.landing_page_text.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Express Service Section - Beautiful Design */}
        {city.express_service && (
          <section className="city-express-section">
            <div className="neighborhood-guide-container">
              <div className="section-header-center">
                <span className="section-eyebrow">Express Service</span>
                <h2 className="section-title-large">When Time is of the Essence</h2>
              </div>
              <div className="cities-grid-beautiful">
                {city.express_service.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* City Highlights Section */}
        <section className="city-highlights-enhanced">
          <div className="highlights-container">
            <div className="section-header-center">
              <span className="section-eyebrow">{t('cityPage.highlights')}</span>
              <h2 className="section-title-large">{t('cityPage.whatMakesSpecial', { cityName: city.name })}</h2>
            </div>
            
            <div className="cities-grid-beautiful">
              {city.highlights && city.highlights.length > 0 ? (
                city.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-card-enhanced">
                    <div className="highlight-bg" style={{ backgroundImage: `url('${highlight.bgImage}')` }}>
                      <div className="highlight-overlay">
                        <div className="highlight-content">
                          <div className="highlight-icon-large">
                            {/* <span className="highlight-icon-text">{highlight.icon}</span> */}
                          </div>
                          <h3 className="highlight-title">{highlight.title}</h3>
                          <p className="highlight-description">{highlight.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>{t('cityPage.noHighlightsAvailable', { cityName: city.name })}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* New Market Analysis Section - Simple Card Design */}
        {city.market_analysis && (
          <section className="city-market-analysis-section">
            <div className="neighborhood-guide-container">
              <div className="section-header-center">
                <span className="section-eyebrow">Market Analysis</span>
                <h2 className="section-title-large">Current {city.name} Real Estate Trends</h2>
              </div>
              
              <div className="cities-grid-beautiful">
                {city.market_analysis.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Neighborhood Guide Section - Beautiful Design */}
        {city.neighborhood_guide && (
          <section className="city-neighborhood-guide-section">
            <div className="neighborhood-guide-container">
              <div className="section-header-center">
                <span className="section-eyebrow">Neighborhood Guide</span>
                <h2 className="section-title-large">Discover {city.name}'s Best Areas</h2>
              </div>
              <div className="cities-grid-beautiful">
                {city.neighborhood_guide.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="neighborhood-guide-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="guide-description-large">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Beautiful Neighborhood Cities Section */}
        <section className="cities-section-beautiful" id="neighborhoods">
          <div className="cities-container-beautiful">
            <div className="section-header-beautiful">
              <span className="section-eyebrow-beautiful">{t('cityPage.nearbyCities')}</span>
              <h2 className="section-title-beautiful">{t('cityPage.exploreSurroundingAreas')}</h2>
              <p className="section-subtitle-beautiful">{t('cityPage.discoverDiverseNeighborhoods', { cityName: city.name })}</p>
            </div>
            
            

            <div className="cities-grid-beautiful">
              {city.neighborhoods.map((neighborhood, index) => (
                <Link 
                  key={neighborhood.slug} 
                  href={`/cities/${neighborhood.slug}`}
                  locale={locale}
                  className="city-card-beautiful"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="city-card-inner-beautiful">
                    <div className="city-image-beautiful" style={{ backgroundImage: `url('${neighborhood.image}')` }}>
                      <div className="city-gradient-overlay-beautiful"></div>
                      <div className="city-badges-beautiful">
                        <span className="city-state-badge-beautiful">{neighborhood.county} {t('cityPage.county')}</span>
                        <span className="city-price-badge-beautiful">{neighborhood.avgHomePrice}</span>
                      </div>
                    </div>
                    
                    <div className="city-content-beautiful">
                      <div className="city-header-beautiful">
                        <h3 className="city-name-beautiful">{neighborhood.name}</h3>
                        <div className="city-neighborhoods-count-beautiful">
                          {neighborhood.type}
                        </div>
                      </div>
                      
                      <p className="city-description-beautiful">{neighborhood.description}</p>
                      
                      <div className="city-tags-row-beautiful">
                        <span className="city-tag-beautiful">{neighborhood.county} {t('cityPage.county')}</span>
                        <span className="city-tag-beautiful">{neighborhood.distance}</span>
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
              ))}
            </div>
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
          title={t('cityPage.readyToFindDreamProperty')}
          text={t('cityPage.contactExpertTeam')}
          button={t('cityPage.scheduleConsultation')}
          cityName={city?.name}
          showCitySpecific={true}
          salutationLabel={t('cityPage.title')}
          rezaBarghlameno={t('cityPage.rezaBarghlameno')}
          primeLocalHomes={t('cityPage.primeLocalHomes')}
          readyToBuyOrSell={t('cityPage.readyToBuyOrSell', { cityName: city?.name || 'Southern California' })}
          name={t('cityPage.name')}
          enterYourName={t('cityPage.enterYourName')}
          phone={t('cityPage.phone')}
          enterYourPhone={t('cityPage.enterYourPhone')}
          email={t('cityPage.email')}
          enterYourEmail={t('cityPage.enterYourEmail')}
          message={t('cityPage.message')}
          enterYourMessage={t('cityPage.enterYourMessage')}
          sendMessage={t('cityPage.sendMessage')}
          back={t('cityPage.backToHome')}
          sending={t('cityPage.sending')}
        />

        {/* Back to Cities Link */}
        <section className="city-back-enhanced">
          <div className="back-container">
            <Link href="/cities" locale={locale} className="back-btn-enhanced">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('cityPage.exploreAllCities')}</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default CityPage