'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Hero from '@/components/sections/Hero/Hero'
import Stats from '@/components/sections/Stats/Stats'
import Counties from '@/components/sections/Counties/Counties'
import Blog from '@/components/sections/Blog/Blog'
import Services from '@/components/sections/Services/Services'
import Testimonials from '@/components/sections/Testimonials/Testimonials'
import CTA from '@/components/sections/CTA/CTA'
import PrestigeLoading from '@/components/common/PrestigeLoading'

// City CSS imports
import '@/styles/City.css'

const Home = () => {
  const params = useParams()
  const [homeData, setHomeData] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const locale = (params as Record<string, any>).locale || 'en'

  const fetchHomeData = async () => {
    try {
      console.log('🌍 Fetching home data for locale:', locale)
      
      // Use the API route which can access src/data files and prioritizes JSON over MongoDB
      const response = await fetch(`/api/home?locale=${locale}`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Home page loaded successfully for locale:', locale)
        setHomeData(data)
      } else {
        // Fallback to English if requested locale doesn't exist
        if (locale !== 'en') {
          console.log('⚠️ Locale not found, falling back to English...')
          const englishResponse = await fetch('/api/home?locale=en', {
            cache: 'no-store'
          })
          if (englishResponse.ok) {
            const englishData = await englishResponse.json()
            console.log('✅ Fallback to English successful')
            setHomeData(englishData)
          } else {
            throw new Error('Neither requested locale nor English fallback found')
          }
        } else {
          throw new Error('English home data not found')
        }
      }
    } catch (error) {
      console.error('❌ Error loading home data:', error)
      // Show error state
      setHomeData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHomeData()
  }, [locale])

  // Add a refresh function that can be called
  const refreshData = () => {
    setLoading(true)
    fetchHomeData()
  }

  if (loading) {
    return <PrestigeLoading />
  }

  if (!homeData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Page</h1>
          <p>Unable to load home page data. Please try refreshing the page.</p>
          <button 
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-gold text-white rounded hover:bg-gold-dark"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Hero heroData={homeData.hero} />
      <Stats statsData={homeData.stats} />
      <Counties countiesData={homeData.cities} locale={locale} />
      <Testimonials 
        title={homeData.testimonials?.title}
        subtitle={homeData.testimonials?.subtitle}
        items={homeData.testimonials?.items}
      />
      <Blog blogData={homeData.blog} />
      <Services servicesData={homeData.services} />
      
      <CTA ctaData={homeData.cta} />
    </main>
  )
}

export default Home