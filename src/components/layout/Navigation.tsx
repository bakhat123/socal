'use client';
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';
import Image from 'next/image';
import '@/styles/Navigation.css';

const Navigation = () => {
  const t = useTranslations('navigation');
  const params = useParams();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const locale = (params as any).locale;

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (target: string, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    const currentPath = window.location.pathname;

    if (target === 'cities') {
      // Always navigate to cities page
      router.push(`/${locale}/cities`);
    } else if (target === 'blog') {
      // Always navigate to blog page
      router.push(`/${locale}/blog`);
    } else if (target === 'contact') {
      // Always navigate to contact page
      router.push(`/${locale}/contact`);
    } else {
      // Services are only sections on homepage
      if (currentPath === `/${locale}` || currentPath === `/${locale}/`) {
        const el = document.getElementById(target);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      } else {
        router.push(`/${locale}#${target}`);
      }
    }

    setIsMobileMenuOpen(false);
  };

  // Smooth scroll if homepage loaded with a hash
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200); // wait until layout is ready
      }
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-nav-menu') && !target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={`navigation ${scrolled ? 'bg-[rgba(26,26,26,0.98)] backdrop-blur-[15px]' : 'bg-[rgba(26,26,26,0.95)] backdrop-blur-[10px]'}`}>
      <div className="nav-container">
        <Link href="/" locale={locale} className="logo-container">
          <Image
            src="/logo.png"
            alt="SoCal Prime Homes Logo"
            width={64}
            height={64}
            className="logo-image rounded-lg"
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              filter: 'brightness(0) invert(1)'
            }}
          />
          <div className="logo-text" style={{ lineHeight: 1 }}>SoCal Prime Homes</div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-menu">
          <li><button onClick={(e) => handleNavClick('cities', e)} className="nav-link">{t('cities')}</button></li>
          <li><button onClick={(e) => handleNavClick('blog', e)} className="nav-link">{t('blogs')}</button></li>
          <li><button onClick={(e) => handleNavClick('contact', e)} className="nav-link">{t('contact')}</button></li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <LanguageSelector />
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-menu">
          <ul className="mobile-nav-list">
            <li><button onClick={(e) => handleNavClick('cities', e)} className="mobile-nav-link">{t('cities')}</button></li>
            <li><button onClick={(e) => handleNavClick('blog', e)} className="mobile-nav-link">{t('blogs')}</button></li>
            <li><button onClick={(e) => handleNavClick('contact', e)} className="mobile-nav-link">{t('contact')}</button></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
