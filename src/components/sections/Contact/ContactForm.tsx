'use client'

import React, { useState, useEffect } from 'react'
// import { useTranslations } from 'next-intl'
import emailjs from '@emailjs/browser'

/*
 * CONTACT FORM SETUP OPTIONS:
 * 
 * OPTION 1: EmailJS (Current Implementation)
 * - Requires EmailJS account setup
 * - More customizable
 * - Works on localhost
 * 
 * OPTION 2: Formspree (Easier Setup)
 * - Just add action="https://formspree.io/f/YOUR_FORM_ID"
 * - No account setup needed
 * - Works immediately
 * 
 * OPTION 3: Netlify Forms
 * - Add data-netlify="true" to form
 * - Works when deployed to Netlify
 * 
 * See CONTACT_FORM_SETUP.md for detailed instructions
 */

interface ContactFormProps {
  contactData: Record<string, any>
}

const ContactForm = ({ contactData }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  // Initialize EmailJS
  useEffect(() => {
    try {
      if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
        console.log('EmailJS initialized successfully')
      } else {
        console.error('EmailJS public key not found in environment variables')
      }
    } catch (error) {
      console.error('EmailJS initialization failed:', error)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setStatusMessage('')
    
    try {
      // EmailJS template parameters - using standard EmailJS variables
      const templateParams = {
        to_name: 'Reza Barghlameno',
        to_email: 'Reza@socalprimehomes.com',
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message,
        reply_to: formData.email
      }

      // Check if all required environment variables are set
      if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
        throw new Error('EmailJS configuration not found in environment variables')
      }

      // Send email using EmailJS
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams
      )

      if (result.status === 200) {
        setSubmitStatus('success')
        setStatusMessage('Message sent successfully! We\'ll get back to you soon.')
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error: any) {
      console.error('Email sending failed:', error)
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        status: error?.status,
        response: error?.response
      })
      setSubmitStatus('error')
      setStatusMessage(`Failed to send message: ${error?.message || 'Unknown error'}. Please try again or contact us directly.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetStatus = () => {
    setSubmitStatus('idle')
    setStatusMessage('')
  }

  return (
    <div className="contact-form-section">
      <div className="form-header">
        <div className="form-badge">{contactData?.form?.header?.badge || 'Ready to Connect'}</div>
        <h2 className="form-title" style={{ color: 'var(--charcoal)' }}>
          {contactData?.form?.header?.title || 'Contact Crown Coastal Concierge'}
        </h2>
        <p className="form-subtitle" style={{ color: 'var(--charcoal)' }}>
          {contactData?.form?.header?.subtitle || 'Ready to start your real estate journey? Get in touch today and let\'s discuss your dream property in San Diego.'}
        </p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div style={{
          background: '#d1fae5',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          color: '#065f46',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <span>{statusMessage}</span>
          <button 
            onClick={resetStatus}
            style={{
              background: 'none',
              border: 'none',
              color: '#065f46',
              cursor: 'pointer',
              fontSize: '18px',
              marginLeft: 'auto'
            }}
          >
            ×
          </button>
        </div>
      )}

      {submitStatus === 'error' && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>❌</span>
          <span>{statusMessage}</span>
          <button 
            onClick={resetStatus}
            style={{
              background: 'none',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              fontSize: '18px',
              marginLeft: 'auto'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* 
        QUICK SETUP ALTERNATIVE:
        If you want to use Formspree instead of EmailJS, replace the form tag with:
        <form className="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
        And remove the onSubmit={handleSubmit} handler
      */}
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.name?.label || 'Full Name'}</span>
              <span className="required">{contactData?.form?.fields?.name?.required || '*'}</span>
            </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder={contactData?.form?.fields?.name?.placeholder || 'Enter your full name'}
                required
                disabled={isSubmitting}
              />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.phone?.label || 'Phone Number'}</span>
              <span className="required">{contactData?.form?.fields?.phone?.required || '*'}</span>
            </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder={contactData?.form?.fields?.phone?.placeholder || 'Enter your phone number'}
                required
                disabled={isSubmitting}
              />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.email?.label || 'Email Address'}</span>
              <span className="required">{contactData?.form?.fields?.email?.required || '*'}</span>
            </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder={contactData?.form?.fields?.email?.placeholder || 'Enter your email address'}
                required
                disabled={isSubmitting}
              />
          </div>

          <div className="form-group full-width">
            <label htmlFor="message" className="form-label">
              <span className="label-text">{contactData?.form?.fields?.message?.label || 'Message'}</span>
              <span className="required">{contactData?.form?.fields?.message?.required || '*'}</span>
            </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                placeholder={contactData?.form?.fields?.message?.placeholder || 'Tell us about your real estate needs, preferred locations, budget, and any specific requirements...'}
                rows={5}
                required
                disabled={isSubmitting}
              ></textarea>
          </div>
        </div>

        <div className="form-consent">
          <div className="consent-header">
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

export default ContactForm

