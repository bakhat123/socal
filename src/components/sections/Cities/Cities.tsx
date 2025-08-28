"use client"

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import '@/styles/Landing.css'

interface CitiesProps {
  citiesData?: {
    title: string
    subtitle: string
  }
  locale?: string
}

type CityListing = {
  slug: string
  name: string
  state: string
  shortDescription: string
  heroImage: string
  population: string
  avgHomePrice: string
  tags: string[]
  neighborhoods: any[]
}

const Cities = ({ citiesData, locale }: CitiesProps) => {
  const t = useTranslations('cities');
  const [fetchedCities, setFetchedCities] = useState<CityListing[]>([])
  const [loading, setLoading] = useState(false)
  
  // Use API data if available, otherwise fall back to translations
  const title = citiesData?.title || t('title')
  const subtitle = citiesData?.subtitle || t('subtitle')
  
  // Fetch per-locale cities for top 3 cards
  useEffect(() => {
    let isMounted = true
    const fetchCities = async () => {
      if (!locale) return
      try {
        setLoading(true)
        const res = await fetch(`/api/cities/${locale}`, { cache: 'no-store' })
        if (res.ok) {
          const data: CityListing[] = await res.json()
          if (isMounted) setFetchedCities(data.slice(0, 3))
        } else {
          if (isMounted) setFetchedCities([])
        }
      } catch {
        if (isMounted) setFetchedCities([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchCities()
    return () => { isMounted = false }
  }, [locale])

  // Use fetched cities or show loading/empty state
  const displayedCities: CityListing[] = fetchedCities

  if (loading) {
    return (
      <section className="cities-section-beautiful" id="cities">
        <div className="cities-container-beautiful">
          <div className="section-header-beautiful">
            <span className="section-eyebrow-beautiful">Destinations</span>
            <h2 className="section-title-beautiful">{title}</h2>
            <p className="section-subtitle-beautiful">{subtitle}</p>
          </div>
          <div className="cities-grid-beautiful">
            <div className="loading-placeholder">Loading cities...</div>
          </div>
        </div>
      </section>
    )
  }

  if (displayedCities.length === 0) {
    return (
      <section className="cities-section-beautiful" id="cities">
        <div className="cities-container-beautiful">
          <div className="section-header-beautiful">
            <span className="section-eyebrow-beautiful">Destinations</span>
            <h2 className="section-title-beautiful">{title}</h2>
            <p className="section-subtitle-beautiful">{subtitle}</p>
          </div>
          <div className="cities-grid-beautiful">
            <div className="no-cities-placeholder">No cities available at the moment.</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="cities-section-beautiful" id="cities">
      <div className="cities-container-beautiful">
        <div className="section-header-beautiful">
          <span className="section-eyebrow-beautiful">Destinations</span>
          <h2 className="section-title-beautiful">{title}</h2>
          <p className="section-subtitle-beautiful">{subtitle}</p>
        </div>
        
        <div className="cities-grid-beautiful">
          {displayedCities.map((city, index) => (
            <Link 
              key={`${locale || 'en'}-${city.slug}-${index}`} 
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
                      {city.neighborhoods?.length || 0} neighborhoods
                    </div>
                  </div>
                  
                  <p className="city-description-beautiful">{city.shortDescription}</p>
                  
                  <div className="city-tags-row-beautiful">
                    {city.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="city-tag-beautiful">{tag}</span>
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
          ))}
        </div>
        
        <div className="cities-section-footer-beautiful">
          <Link href="/cities" locale={locale} className="see-more-btn-beautiful">
            <span>See All Cities</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Cities