'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import '@/styles/Stats.css'

interface StatsProps {
  statsData?: {
    yearsExperience: string
    yearsExperienceLabel: string
    billionInSales: string
    billionInSalesLabel: string
    countriesServed: string
    countriesServedLabel: string
    clientSatisfaction: string
    clientSatisfactionLabel: string
  }
}

const Stats = ({ statsData }: StatsProps) => {
  const t = useTranslations('stats');
  
  // Use API data if available, otherwise fall back to translations
  const yearsExperience = statsData?.yearsExperience || "25+"
  const yearsExperienceLabel = statsData?.yearsExperienceLabel || t('yearsExperience')
  const billionInSales = statsData?.billionInSales || "4.2B"
  const billionInSalesLabel = statsData?.billionInSalesLabel || t('billionInSales')
  const countriesServed = statsData?.countriesServed || "50+"
  const countriesServedLabel = statsData?.countriesServedLabel || t('countriesServed')
  const clientSatisfaction = statsData?.clientSatisfaction || "100%"
  const clientSatisfactionLabel = statsData?.clientSatisfactionLabel || t('clientSatisfaction')

  return (
    <section className="home-stats-section">
      <div className="home-stats-container">
        <div className="home-stat-card">
          <div className="home-stat-number">{yearsExperience}</div>
          <div className="home-stat-label">{yearsExperienceLabel}</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-number">{billionInSales}</div>
          <div className="home-stat-label">{billionInSalesLabel}</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-number">{countriesServed}</div>
          <div className="home-stat-label">{countriesServedLabel}</div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-number">{clientSatisfaction}</div>
          <div className="home-stat-label">{clientSatisfactionLabel}</div>
        </div>
      </div>
    </section>
  )
}

export default Stats