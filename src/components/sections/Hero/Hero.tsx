import React from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import '@/styles/Hero.css'

interface HeroProps {
  heroData?: {
    badge: string
    title: string
    subtitle: string
    viewProperties: string
    contactUs: string
    scrollDown: string
    backgroundImage?: string
  }
  currentLocale?: string
}

const Hero = ({ heroData, currentLocale = 'en' }: HeroProps) => {
  const t = useTranslations('hero');
  
  const scrollToStats = () => {
    const statsSection = document.querySelector('.stats-section');
    statsSection?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Use API data if available, otherwise fall back to translations
  const badge = heroData?.badge || t('badge')
  const title = heroData?.title || t('title')
  const subtitle = heroData?.subtitle || t('subtitle')
  const viewProperties = heroData?.viewProperties || t('viewProperties')
  const contactUs = heroData?.contactUs || t('contactUs')
  const scrollDown = heroData?.scrollDown || t('scrollDown')
  const backgroundImage = heroData?.backgroundImage || '/home/hero.jpg'

  // Determine if language is RTL
  const isRTL = currentLocale === 'ar'

  // Language-specific adjustments for hero section dimensions
  const getLanguageAdjustments = () => {
    switch (currentLocale) {
      case 'de':
        return {
          topPadding: '140px', // Same as English
          bottomPadding: '120px', // More bottom padding for German content
          scrollButtonBottom: '60px', // Move scroll button down for German
          contentMaxWidth: '1400px', // Increase width for German text
          titleMaxWidth: '800px', // Increase title width for German
          subtitleMaxWidth: '700px', // Increase subtitle width for German
          contentMarginTop: '20px' // Same as English
        }
      case 'ar':
        return {
          topPadding: '140px', // Same as English
          bottomPadding: '120px', // More bottom padding for Arabic content
          scrollButtonBottom: '60px', // Move scroll button down for Arabic
          contentMaxWidth: '1400px', // Increase width for Arabic text
          titleMaxWidth: '800px', // Increase title width for Arabic
          subtitleMaxWidth: '700px', // Increase subtitle width for Arabic
          contentMarginTop: '20px' // Same as English
        }
      case 'fr':
        return {
          topPadding: '140px', // Same as English
          bottomPadding: '120px', // More bottom padding for French content
          scrollButtonBottom: '60px', // Move scroll button down for French
          contentMaxWidth: '1400px', // Increase width for French text
          titleMaxWidth: '800px', // Increase title width for French
          subtitleMaxWidth: '700px', // Increase subtitle width for French
          contentMarginTop: '20px' // Same as English
        }
      case 'es':
        return {
          topPadding: '140px', // Same as English
          bottomPadding: '120px', // More bottom padding for Spanish content
          scrollButtonBottom: '60px', // Move scroll button down for Spanish
          contentMaxWidth: '1400px', // Increase width for Spanish text
          titleMaxWidth: '800px', // Increase title width for Spanish
          subtitleMaxWidth: '700px', // Increase subtitle width for Spanish
          contentMarginTop: '20px' // Same as English
        }
      case 'zh':
        return {
          topPadding: '140px', // Same as English
          bottomPadding: '120px', // More bottom padding for Chinese content
          scrollButtonBottom: '60px', // Move scroll button down for Chinese
          contentMaxWidth: '1400px', // Increase width for Chinese text
          titleMaxWidth: '800px', // Increase title width for Chinese
          subtitleMaxWidth: '700px', // Increase subtitle width for Chinese
          contentMarginTop: '20px' // Same as English
        }
      default:
        return {
          topPadding: '140px', // Original padding for English
          bottomPadding: '80px', // Original padding for English
          scrollButtonBottom: '80px', // Original scroll button position
          contentMaxWidth: '1200px', // Original width for English
          titleMaxWidth: '700px', // Original title width for English
          subtitleMaxWidth: '600px', // Original subtitle width for English
          contentMarginTop: '20px' // Original margin for English
        }
    }
  }

  const adjustments = getLanguageAdjustments()

  return (
    <section 
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingTop: adjustments.topPadding,
        paddingBottom: adjustments.bottomPadding,
        minHeight: '100vh',
        height: 'auto', // Force height to auto to allow expansion
        overflow: 'visible' // Force overflow to visible to prevent cutting
      }}
    >
      <div 
        className="hero-content" 
        style={{ 
          textAlign: isRTL ? 'right' : 'left',
          marginTop: adjustments.contentMarginTop,
          maxWidth: adjustments.contentMaxWidth,
          width: '100%'
        }}
      >
        <div className="hero-badge">{badge}</div>
        <h1 
          className="hero-title" 
          lang={currentLocale} 
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ 
            marginLeft: isRTL ? 'auto' : '0',
            marginRight: isRTL ? '0' : '0',
            maxWidth: adjustments.titleMaxWidth,
            width: '100%'
          }}
        >
          {title}
        </h1>
        <p 
          className="hero-subtitle" 
          lang={currentLocale} 
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ 
            marginLeft: isRTL ? 'auto' : '0',
            marginRight: isRTL ? '0' : '0',
            maxWidth: adjustments.subtitleMaxWidth,
            width: '100%'
          }}
        >
          {subtitle}
        </p>
        <div 
          className="hero-cta" 
          style={{ 
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: isRTL ? 'flex-end' : 'flex-start',
            marginBottom: '40px' // Force bottom margin to prevent overlap
          }}
        >
          <Link href="/cities" className="btn-primary">
            {viewProperties}
          </Link>
          <Link href="/contact" className="btn-secondary">
            {contactUs}
          </Link>
        </div>
      </div>
      
      <button 
        className="swipe-down-btn" 
        onClick={scrollToStats}
        style={{
          bottom: adjustments.scrollButtonBottom,
          position: 'absolute'
        }}
      >
        <div className="swipe-arrow"></div>
        <div className="swipe-text">{scrollDown}</div>
      </button>
    </section>
  )
}

export default Hero