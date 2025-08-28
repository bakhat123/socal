import React from 'react'
import { useTranslations } from 'next-intl'
import '@/styles/Services.css'

interface ServicesProps {
  servicesData?: {
    title: string
    subtitle: string
    propertyAcquisition: {
      title: string
      description: string
      icon: string
    }
    investmentAdvisory: {
      title: string
      description: string
      icon: string
    }
    relocationServices: {
      title: string
      description: string
      icon: string
    }
  }
}

const Services = ({ servicesData }: ServicesProps) => {
  const t = useTranslations('services');

  // Use API data if available, otherwise fall back to translations
  const title = servicesData?.title || t('title')
  const subtitle = servicesData?.subtitle || t('subtitle')
  const propertyAcquisition = servicesData?.propertyAcquisition || {
    title: t('propertyAcquisition.title'),
    description: t('propertyAcquisition.description'),
    icon: ''
  }
  const investmentAdvisory = servicesData?.investmentAdvisory || {
    title: t('investmentAdvisory.title'),
    description: t('investmentAdvisory.description'),
    icon: ''
  }
  const relocationServices = servicesData?.relocationServices || {
    title: t('relocationServices.title'),
    description: t('relocationServices.description'),
    icon: ''
  }

  return (
    <section className="services-section" id="services">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <div className="services-grid">
        {/* Property Acquisition */}
        <div className="service-card relative overflow-hidden group">
          {/* Subtle hover background image */}
          <div
            className="absolute inset-0 bg-center bg-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0 pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=60')",
            }}
          />
          {/* Content */}
          <div className="relative z-10">
            {/* <div className="service-icon">{propertyAcquisition.icon}</div> */}
            <h3 className="service-title">{propertyAcquisition.title}</h3>
            <p className="service-description">{propertyAcquisition.description}</p>
          </div>
        </div>

        {/* Investment Advisory */}
        <div className="service-card relative overflow-hidden group">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0 pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=60')",
            }}
          />
          <div className="relative z-10">
            {/* <div className="service-icon">{investmentAdvisory.icon}</div> */}
            <h3 className="service-title">{investmentAdvisory.title}</h3>
            <p className="service-description">{investmentAdvisory.description}</p>
          </div>
        </div>

        {/* Relocation Services */}
        <div className="service-card relative overflow-hidden group">
          <div
            className="absolute inset-0 bg-center bg-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0 pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=60')",
            }}
          />
          <div className="relative z-10">
            {/* <div className="service-icon">{relocationServices.icon}</div> */}
            <h3 className="service-title">{relocationServices.title}</h3>
            <p className="service-description">{relocationServices.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services