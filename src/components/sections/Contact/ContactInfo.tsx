'use client'

import React from 'react'
// import { useTranslations } from 'next-intl'

interface ContactInfoProps {
  contactData: Record<string, any>
}

const ContactInfo = ({ contactData }: ContactInfoProps) => {
  return (
    <div className="contact-info-section">
      {/* Profile Description Card */}
      <div className="profile-description-card">
        <div className="profile-description">
          <h3 className="description-title">{contactData?.info?.description?.title || 'Get to know about Reza'}</h3>
          <p className="description-subtitle">{contactData?.info?.description?.subtitle || 'Real Estate Professional'}</p>
          
          <p className="description-text">
            {contactData?.info?.description?.text1 || 'With a journey that has taken him across 32 countries and over a hundred cities, Reza brings a world of experience and a unique global perspective to San Diego\'s real estate market. He firmly believes there\'s no place like San Diego, with its unparalleled coastal lines, vibrant cityscape, and endless adventures.'}
          </p>
          
          <p className="description-text">
            {contactData?.info?.description?.text2 || 'Utilizing 17 years of client management & negotiation expertise, Reza has perfected the art of understanding his clients\' needs and exceeding their expectations. But it\'s not just about transactions for him. Whether guiding sellers to maximize their home\'s value or helping buyers find their dream property, Reza\'s true passion lies in scoring big for his clients.'}
          </p>
          
          <p className="description-text">
            {contactData?.info?.description?.text3 || 'Beyond real estate, Reza is deeply embedded in the fabric of the San Diego community. He\'s championed righteous causes through grassroots petitions, actively participated in beach clean-ups, and tirelessly worked to uplift underserved communities via various government-subsidized programs. For Reza, real estate isn\'t just business—it\'s a platform to further serve and enrich the community he cherishes most.'}
          </p>
        </div>

        <div className="profile-specialties">
          <h4 className="specialties-title">{contactData?.info?.specialties?.title || 'Specialties'}</h4>
          <div className="specialties-grid">
            {contactData?.info?.specialties?.tags?.map((tag: string, index: number) => (
              <span key={index} className="specialty-tag">{tag}</span>
            ))}
          </div>
          <div className="languages-section">
            <p className="languages">{contactData?.info?.specialties?.languages || 'Speaks: English, Arabic, Farsi, Turkish'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo

