import React, { useState } from 'react'

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing! You will receive our latest insights soon.')
      setEmail('')
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2 className="newsletter-title">Stay Informed</h2>
        <p className="newsletter-subtitle">Get the latest luxury real estate insights delivered to your inbox</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="newsletter-input" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSignup 