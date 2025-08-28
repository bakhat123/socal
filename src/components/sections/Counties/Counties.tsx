"use client"

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import '@/styles/Landing.css'

interface CountiesProps {
  countiesData?: {
    title: string
    subtitle: string
  }
  locale?: string
}

type CountyListing = {
  slug: string
  name: string
  state: string
  shortDescription: string
  heroImage: string
  cityCount: string
  tags: string[]
}

const Counties = ({ countiesData, locale }: CountiesProps) => {
  const t = useTranslations('cities');
  
  // Try to get countyCards translations, but handle missing namespace gracefully
  let tCounties: any;
  
  // Fallback translations in English
  const fallbackTranslations: { [key: string]: string } = {
    'destinations': 'Destinations',
    'loadingCounties': 'Loading counties...',
    'noCountiesAvailable': 'No counties available at the moment.',
    'seeAllCities': 'See All Cities',
    'cities': 'cities',
    'orangeCounty.name': 'Orange County',
    'orangeCounty.description': 'A coastal region known for its stunning beaches, upscale neighborhoods, and family-friendly communities, with world-class dining and shopping.',
    'orangeCounty.tags.coastalLiving': 'Coastal Living',
    'orangeCounty.tags.familyFriendly': 'Family-friendly',
    'losAngelesCounty.name': 'Los Angeles County',
    'losAngelesCounty.description': 'A diverse cultural hub offering everything from entertainment and arts to bustling business districts and scenic coastal escapes.',
    'losAngelesCounty.tags.culturalDiversity': 'Cultural Diversity',
    'losAngelesCounty.tags.entertainment': 'Entertainment',
    'sanDiegoCounty.name': 'San Diego County',
    'sanDiegoCounty.description': 'A laid-back paradise with beautiful beaches, a thriving tech and biotech scene, and year-round perfect weather.',
    'sanDiegoCounty.tags.beaches': 'Beaches',
    'sanDiegoCounty.tags.outdoorLiving': 'Outdoor Living'
  };

  // Try to get the countyCards translations, fallback to English if namespace doesn't exist
  let tCountiesHook;
  try {
    tCountiesHook = useTranslations('cities.countyCards');
  } catch {
    tCountiesHook = null;
  }
  
  tCounties = (key: string) => {
    if (tCountiesHook) {
      try {
        return tCountiesHook(key);
      } catch {
        // If the specific key doesn't exist, use fallback
        return fallbackTranslations[key] || key;
      }
    }
    // If the entire namespace doesn't exist, use fallbacks
    return fallbackTranslations[key] || key;
  };
  
  const [fetchedCounties, setFetchedCounties] = useState<CountyListing[]>([])
  const [loading, setLoading] = useState(false)
  
  // Use API data if available, otherwise fall back to translations
  const title = countiesData?.title || t('title')
  const subtitle = countiesData?.subtitle || t('subtitle')
  
  // Hardcoded county data for the 3 cards
  useEffect(() => {
    let isMounted = true
    const loadCounties = async () => {
      if (!locale) return
      try {
        setLoading(true)
        
        // County data using translations
        const hardcodedCounties: CountyListing[] = [
          {
            slug: 'orange-county',
            name: tCounties('orangeCounty.name'),
            state: 'CA',
            shortDescription: tCounties('orangeCounty.description'),
            heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1920&q=80',
            cityCount: '34',
            tags: [tCounties('orangeCounty.tags.coastalLiving'), tCounties('orangeCounty.tags.familyFriendly')]
          },
          {
            slug: 'los-angeles-county',
            name: tCounties('losAngelesCounty.name'),
            state: 'CA',
            shortDescription: tCounties('losAngelesCounty.description'),
            heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
            cityCount: '88',
            tags: [tCounties('losAngelesCounty.tags.culturalDiversity'), tCounties('losAngelesCounty.tags.entertainment')]
          },
          {
            slug: 'san-diego-county',
            name: tCounties('sanDiegoCounty.name'),
            state: 'CA',
            shortDescription: tCounties('sanDiegoCounty.description'),
            heroImage: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Skyline_of_San_Diego.jpg',
            cityCount: '18',
            tags: [tCounties('sanDiegoCounty.tags.beaches'), tCounties('sanDiegoCounty.tags.outdoorLiving')]
          }
        ]
        
        if (isMounted) setFetchedCounties(hardcodedCounties)
      } catch {
        if (isMounted) setFetchedCounties([])
      } finally {
        if (isMounted) setLoading(false)
      }
         }
     loadCounties()
     return () => { isMounted = false }
   }, [locale])

  // Use fetched counties or show loading/empty state
  const displayedCounties: CountyListing[] = fetchedCounties



  if (loading) {
    return (
      <section className="cities-section-beautiful" id="cities">
        <div className="cities-container-beautiful">
          <div className="section-header-beautiful">
            <span className="section-eyebrow-beautiful">{tCounties('destinations')}</span>
            <h2 className="section-title-beautiful">{title}</h2>
            <p className="section-subtitle-beautiful">{subtitle}</p>
          </div>
          <div className="cities-grid-beautiful">
            <div className="loading-placeholder">{tCounties('loadingCounties')}</div>
          </div>
        </div>
      </section>
    )
  }

  if (displayedCounties.length === 0) {
    return (
      <section className="cities-section-beautiful" id="cities">
        <div className="cities-container-beautiful">
          <div className="section-header-beautiful">
            <span className="section-eyebrow-beautiful">{tCounties('destinations')}</span>
            <h2 className="section-title-beautiful">{title}</h2>
            <p className="section-subtitle-beautiful">{subtitle}</p>
          </div>
          <div className="cities-grid-beautiful">
            <div className="no-cities-placeholder">{tCounties('noCountiesAvailable')}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="cities-section-beautiful" id="cities">
              <div className="cities-container-beautiful">
          <div className="section-header-beautiful">
            <span className="section-eyebrow-beautiful">{tCounties('destinations')}</span>
            <h2 className="section-title-beautiful">{title}</h2>
            <p className="section-subtitle-beautiful">{subtitle}</p>
          </div>
        
        <div className="cities-grid-beautiful">
          {displayedCounties.map((county, index) => (
            <Link 
              key={`${locale || 'en'}-${county.slug}-${index}`} 
              href={`/county/${county.slug}`}
              locale={locale}
              className="city-card-beautiful"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="city-card-inner-beautiful">
                <div className="city-image-beautiful" style={{ backgroundImage: `url('${county.heroImage}')` }}>
                  <div className="city-gradient-overlay-beautiful"></div>
                  <div className="city-badges-beautiful">
                    <span className="city-state-badge-beautiful">{county.state}</span>
                    <span className="city-price-badge-beautiful">{county.cityCount} {tCounties('cities')}</span>
                  </div>
                </div>
                
                <div className="city-content-beautiful">
                  <div className="city-header-beautiful">
                    <h3 className="city-name-beautiful">{county.name}</h3>
                    <div className="city-neighborhoods-count-beautiful">
                      {county.cityCount} {tCounties('cities')}
                    </div>
                  </div>
                  
                  <p className="city-description-beautiful">{county.shortDescription}</p>
                  
                  <div className="city-tags-row-beautiful">
                    {county.tags.slice(0, 2).map((tag, index) => (
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
            <span>{tCounties('seeAllCities')}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Counties
