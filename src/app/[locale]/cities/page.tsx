'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import CitySearch from '@/components/sections/Cities/CitySearch'
import CityGrid from '@/components/sections/Cities/CityGrid'
import Pagination from '@/components/sections/Cities/Pagination'
import PrestigeLoading from '@/components/common/PrestigeLoading'
import '@/styles/Landing.css'

interface CityData {
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

const CitiesPage = () => {
  const t = useTranslations('cities')
  const params = useParams()
  const [citiesData, setCitiesData] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const citiesPerPage = 9

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const locale = (params as Record<string, any>).locale || 'en'
        const response = await fetch(`/api/cities/${locale}`)
        
        if (response.ok) {
          const cities = await response.json()
          setCitiesData(cities)
        } else {
          // Fallback to English if locale doesn't exist
          const fallbackResponse = await fetch('/api/cities/en')
          if (fallbackResponse.ok) {
            const cities = await fallbackResponse.json()
            setCitiesData(cities)
          } else {
            setCitiesData([])
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        setCitiesData([])
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [(params as Record<string, any>).locale])

  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return citiesData
    
    return citiesData.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      city.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, citiesData])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCities.length / citiesPerPage)
  const startIndex = (currentPage - 1) * citiesPerPage
  const endIndex = startIndex + citiesPerPage
  const currentCities = filteredCities.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  if (loading) {
    return <PrestigeLoading />
  }

  return (
    <main className="cities-page">
      {/* Page Header */}
      <section className="cities-page-header">
        <div className="cities-page-container">
          <div className="page-header-content">
            <span className="page-eyebrow">{t('pageHeader.eyebrow')}</span>
            <h1 className="page-title">{t('pageHeader.title')}</h1>
            <p className="page-subtitle">
              {t('pageHeader.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="cities-search-section">
        <div className="cities-page-container">
          <CitySearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalCities={filteredCities.length}
          />
        </div>
      </section>

      {/* Cities Grid Section */}
      <section className="cities-grid-section">
        <div className="cities-page-container">
          {filteredCities.length > 0 ? (
            <>
              <CityGrid cities={currentCities} locale={(params as any).locale} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-section">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <h3 className="no-results-title">{t('noResults.title')}</h3>
              <p className="no-results-text">
                {t('noResults.text')}
              </p>
              <button 
                className="reset-search-btn"
                onClick={() => setSearchTerm('')}
              >
                {t('noResults.button')}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default CitiesPage 