'use client'

import React, { useState } from 'react'

interface ContactFormSimpleProps {
  contactData: Record<string, any>
}

const ContactFormSimple = ({ contactData }: ContactFormSimpleProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (_e: React.FormEvent) => {
    setIsSubmitting(true)
    // Formspree handles the submission automatically
    // The form will redirect to Formspree's success page
  }

  return (
    <div className="contact-form-section">
      <div className="form-header">
        <div className="form-badge">{contactData?.form?.header?.badge || 'Ready to Connect'}</div>
        <h2 className="form-title">{contactData?.form?.header?.title || 'Contact Crown Coastal Concierge'}</h2>
        <p className="form-subtitle">
          {contactData?.form?.header?.subtitle || 'Ready to start your real estate journey? Get in touch today and let\'s discuss your dream property in San Diego.'}
        </p>
      </div>

      {/* 
        FORMSPREE SETUP:
        1. Go to https://formspree.io/
        2. Create account and get your form ID
        3. Replace YOUR_FORM_ID below with your actual form ID
        4. That's it! Form will work immediately.
      */}
      
      <form 
        className="contact-form" 
        action="https://formspree.io/f/YOUR_FORM_ID" 
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.name?.label || 'Full Name'}</span>
              <span className="required">{contactData?.form?.fields?.name?.required || '*'}</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">👤</div>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder={contactData?.form?.fields?.name?.placeholder || 'Enter your full name'}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.phone?.label || 'Phone Number'}</span>
              <span className="required">{contactData?.form?.fields?.phone?.required || '*'}</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">📞</div>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder={contactData?.form?.fields?.phone?.placeholder || 'Enter your phone number'}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.email?.label || 'Email Address'}</span>
              <span className="required">{contactData?.form?.fields?.email?.required || '*'}</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">✉️</div>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder={contactData?.form?.fields?.email?.placeholder || 'Enter your email address'}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="message" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.message?.label || 'Message'}</span>
              <span className="required">{contactData?.form?.fields?.message?.required || '*'}</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">💬</div>
              <textarea
                id="message"
                name="message"
                className="form-textarea"
                placeholder={contactData?.form?.fields?.message?.placeholder || 'Tell us about your real estate needs, preferred locations, budget, and any specific requirements...'}
                rows={5}
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-consent">
          <div className="consent-header">
            <div className="consent-icon">🔒</div>
            <h4>{contactData?.form?.consent?.title || 'Privacy & Consent'}</h4>
          </div>
          <p className="consent-text">
            {contactData?.form?.consent?.text || 'By submitting your information, you agree that the real estate professional identified above may call/text you about your search, which may involve use of automated means and pre-recorded/artificial voices. You don\'t need to consent as a condition of buying any property, goods, or services. Message/data rates may apply. You also agree to our Terms of Use.'}
          </p>
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          <span className="btn-text">
            {isSubmitting ? (contactData?.form?.submit?.sending || 'Sending Message...') : (contactData?.form?.submit?.send || 'Send Message')}
          </span>
          <div className="btn-icon">
            {isSubmitting ? (
              <div className="loading-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </div>
        </button>

        <div className="form-footer">
          <div className="response-time">
            <div className="response-icon">⚡</div>
            <span>{contactData?.form?.footer?.responseTime || 'We typically respond within 2 hours during business hours'}</span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ContactFormSimple
