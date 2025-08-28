"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Plus, Edit2, Trash2, Users, Home, MapPin, Search } from "lucide-react"
import { City as CityType } from "@/types"

interface CityManagerProps {
  cities: CityType[]
  setShowCityModal: (show: boolean) => void
  setEditingCity: (id: string | null) => void
  setCityForm: (form: any) => void
  deleteCity: (id: string) => void
  handleAddCity: (preferredLanguage?: string) => void
}

export default function CityManager({ 
  cities, 
  setShowCityModal, 
  setEditingCity, 
  setCityForm, 
  deleteCity,
  handleAddCity
}: CityManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocale, setSelectedLocale] = useState<string>("en")
  const locales = ["ar", "de", "en", "es", "fr", "zh"]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminCitiesLang')
      if (saved && locales.includes(saved)) {
        setSelectedLocale(saved)
      }
    }
  }, [])

  const filteredCities = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()

    return cities.filter((city) => {
      // Filter by city.language exact match with fallback: no language => treat as 'en'
      const cityLang = city.language || 'en'
      const matchesLocale = cityLang === selectedLocale

      if (!matchesLocale) return false

      if (!normalizedQuery) return true

      const inName = city.name?.toLowerCase().includes(normalizedQuery)
      const inState = city.state?.toLowerCase().includes(normalizedQuery)
      const inSlug = city.slug?.toLowerCase().includes(normalizedQuery)
      const inTags = (city.tags || []).some((t: string) => t.toLowerCase().includes(normalizedQuery))
      const inDesc = city.shortDescription?.toLowerCase().includes(normalizedQuery)

      return inName || inState || inSlug || inTags || inDesc
    })
  }, [cities, searchTerm, selectedLocale])

  return (
    <div className="content-section">
      <div className="section-header">
        <div className="section-info">
          <div className="count-badge green">
            <span>Total Cities: </span>
            <span>{cities.length}</span>
          </div>
        </div>
        <button onClick={() => handleAddCity(selectedLocale)} className="add-btn green">
          <Plus size={20} />
          <span>Add City</span>
        </button>
      </div>

      {/* Tools: Search + Locale selector (styled) */}
      <div className="admin-toolbar admin-toolbar--light">
        <div className="admin-toolbar-group" style={{ flex: 1 }}>
          <div className="admin-search-wrapper" style={{ position: 'relative', width: '100%' }}>
            <span className="admin-search-icon">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input admin-search-input--light"
              placeholder="Search cities by name, state, slug, tags..."
            />
          </div>
        </div>
        <div className="admin-toolbar-group">
          <label htmlFor="localeSelect" className="admin-label admin-label--light">Language</label>
          <span className="admin-select-wrapper">
            <select
              id="localeSelect"
              value={selectedLocale}
              onChange={(e) => {
                const value = e.target.value
                setSelectedLocale(value)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('adminCitiesLang', value)
                  window.dispatchEvent(new CustomEvent('adminCitiesLangChanged', { detail: { language: value } }))
                }
              }}
              className="admin-select admin-select--light"
            >
              {locales.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </span>
        </div>
      </div>

      {/* Visible count */}
      <div className="admin-muted">Showing {filteredCities.length} of {cities.length}</div>

      <div className="content-grid two-cols">
        {filteredCities.map((city) => (
          <div key={city._id || city.id || Math.random()} className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{city.name}, {city.state}</h3>
                <p className="card-subtitle">{city.shortDescription}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    const cityId = city._id || city.id || ''
                    setEditingCity(cityId)
                    setCityForm({
                      _id: cityId,
                      slug: city.slug,
                      name: city.name,
                      state: city.state,
                      population: city.population,
                      avgHomePrice: city.avgHomePrice,
                      heroImage: city.heroImage || '',
                      heroImageAlt: city.heroImageAlt || '',
                      shortDescription: city.shortDescription,
                      fullDescription: city.fullDescription || '',
                      canonicalUrl: city.canonicalUrl || '',
                      tags: city.tags?.join(', ') || '',
                      neighborhoods: (Array.isArray(city.neighborhoods) && (city.neighborhoods as any[]).length > 0) ? (city.neighborhoods as any[]) : [{
                        name: '', type: 'neighborhood', slug: '', description: '', image: '', imageAlt: '', distance: '', avgHomePrice: '', county: ''
                      }],
                      highlights: city.highlights?.length > 0 ? city.highlights : [{ 
                        title: '', 
                        description: '', 
                        icon: '', 
                        bgImage: '',
                        bgImageAlt: ''
                      }],
                      faqs: city.faqs?.length > 0 ? city.faqs : [{ 
                        question: '', 
                        answer: '', 
                        category: 'Neighborhoods' 
                      }],
                      clients: city.clients && city.clients.length > 0 ? city.clients : [{ 
                        name: '', 
                        description: '', 
                        image: '', 
                        imageAlt: '',
                        rating: 5, 
                        review: '' 
                      }],
                      hreflang_tags: (city.hreflang_tags && city.hreflang_tags.length > 0) ? city.hreflang_tags : [{ 
                        hreflang: 'en', 
                        href: '' 
                      }],
                      language: city.language || 'en',
                      seo: city.seo || {
                        metaTitle: '',
                        metaDescription: '',
                        keywords: '',
                        ogTitle: '',
                        ogDescription: '',
                        ogImage: '',
                        ogImageAlt: '',
                        twitterCard: 'summary_large_image'
                      },
                      landing_page_text: city.landing_page_text || '',
                      express_service: city.express_service || '',
                      neighborhood_guide: city.neighborhood_guide || '',
                      market_analysis: city.market_analysis || '',
                      // New fields
                      city: city.city || '',
                      county: city.county || '',
                      url_slug: city.url_slug || '',
                      meta_title: city.meta_title || '',
                      meta_description: city.meta_description || '',
                      h1_title: city.h1_title || '',
                      primary_keywords: city.primary_keywords || [],
                      secondary_keywords: city.secondary_keywords || [],
                      express_keywords: city.express_keywords || [],
                      agent_keywords: city.agent_keywords || [],
                      agent_name: city.agent_name || '',
                      cta_text: city.cta_text || '',
                      contact_phone: city.contact_phone || '',
                      contact_email: city.contact_email || '',
                      company_name: city.company_name || '',
                      schema_markup: (city.schema_markup && city.schema_markup.length > 0) ? city.schema_markup : [],
                      internal_links: (city.internal_links && city.internal_links.length > 0) ? city.internal_links : [{ 
                        href: '', 
                        anchor: '', 
                        context: '' 
                      }],
                      
                      // Additional fields to preserve
                      city: city.city || '',
                      county: city.county || '',
                      url_slug: city.url_slug || '',
                      meta_title: city.meta_title || '',
                      meta_description: city.meta_description || '',
                      h1_title: city.h1_title || '',
                      primary_keywords: city.primary_keywords || [],
                      secondary_keywords: city.secondary_keywords || [],
                      express_keywords: city.express_keywords || [],
                      agent_keywords: city.agent_keywords || [],
                      landing_page_text: city.landing_page_text || '',
                      express_service: city.express_service || '',
                      neighborhood_guide: city.neighborhood_guide || '',
                      market_analysis: city.market_analysis || '',
                      agent_name: city.agent_name || '',
                      company_name: city.company_name || '',
                      contact_phone: city.contact_phone || '',
                      contact_email: city.contact_email || '',
                      cta_text: city.cta_text || ''
                    })
                    setShowCityModal(true)
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button className="action-btn delete" onClick={() => {
                  console.log('City object for deletion:', city)
                  const cityId = city._id || city.id || ''
                  console.log('Extracted city ID:', cityId)
                  if (cityId) {
                    deleteCity(cityId)
                  } else {
                    alert('Cannot delete city: No valid ID found')
                  }
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="city-stats">
              <div className="city-stat blue">
                <Users className="city-stat-icon blue" size={20} />
                <p>{city.population}</p>
                <p>Population</p>
              </div>
              <div className="city-stat green">
                <Home className="city-stat-icon green" size={20} />
                <p>{city.avgHomePrice}</p>
                <p>Avg Price</p>
              </div>
              <div className="city-stat purple">
                <MapPin className="city-stat-icon purple" size={20} />
                <p>{city.neighborhoods?.length || 0}</p>
                <p>Areas</p>
              </div>
            </div>

            <div className="tags">
              {city.tags?.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
              {city.tags?.length > 3 && (
                <span className="tag gray">+{city.tags.length - 3} more</span>
              )}
            </div>

            <div className="card-meta">
              <span>Slug: {city.slug}</span>
              <span>{city.highlights?.length || 0} highlights</span>
              <span>{city.faqs?.length || 0} FAQs</span>
            </div>
          </div>
        ))}
        {filteredCities.length === 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">No cities found</h3>
                <p className="card-subtitle">Try adjusting your search or language filter</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
