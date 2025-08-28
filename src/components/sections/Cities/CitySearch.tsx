'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

interface CitySearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  totalCities: number
}

const CitySearch: React.FC<CitySearchProps> = ({ 
  searchTerm, 
  onSearchChange, 
  totalCities 
}) => {
  const t = useTranslations('cities')

  return (
    <div className="city-search-container">
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search cities, states, or features..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="clear-search-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        
        <div className="search-results">
          <span className="results-count">
            {totalCities} {totalCities === 1 ? 'city' : 'cities'} found
          </span>
        </div>
      </div>
    </div>
  )
}

export default CitySearch 