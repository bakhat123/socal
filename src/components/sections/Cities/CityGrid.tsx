'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import '@/styles/Landing.css'

interface City {
  slug: string
  name: string
  state: string
  shortDescription: string
  heroImage: string
  population: string
  avgHomePrice: string
  tags: string[]
  neighborhoods: string[]
}

interface CityGridProps {
  cities: City[]
  locale?: string
}

const CityGrid: React.FC<CityGridProps> = ({ cities, locale }) => {
  const t = useTranslations('cities')

  return (
    <div className="city-grid-container">
      <div className="cities-grid-beautiful">
        {cities.map((city, index) => (
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
                    {city.neighborhoods?.length || 0} {t('neighborhoods')}
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
    </div>
  )
}

export default CityGrid 