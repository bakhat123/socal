'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
]

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = async (languageCode: string) => {
    // Persist preferred locale globally for middleware defaults
    try {
      document.cookie = `NEXT_LOCALE=${languageCode}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
    // If on a blog detail, map slug to target locale by group_id
    const match = pathname.match(/^\/(?:\w{2}\/)?blog\/([^/?#]+)/)
    if (match) {
      const currentLocale = locale
      const currentSlug = decodeURIComponent(match[1])
      try {
        const res = await fetch(`/api/blogs/map/${currentLocale}/${languageCode}/${encodeURIComponent(currentSlug)}`)
        if (res.ok) {
          const data = await res.json()
          const targetSlug: string = data?.slug || currentSlug
          router.replace(`/blog/${encodeURIComponent(targetSlug)}`, { locale: languageCode })
          setIsOpen(false)
          return
        }
      } catch {}
    }
    // Default: replace to same pathname with new locale
    router.replace(pathname, { locale: languageCode })
    setIsOpen(false)
  }

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button 
        className="language-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
        <span className="language-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${language.code === locale ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="language-flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
              {language.code === locale && <span className="language-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector 