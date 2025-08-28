import React, { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import '@/styles/Consultation.css'

interface ConsultationFormProps {
	title?: string
	text?: string
	button?: string
	cityName?: string
	showCitySpecific?: boolean
	// Translation props
	salutationLabel?: string
	rezaBarghlameno?: string
	primeLocalHomes?: string
	readyToBuyOrSell?: string
	name?: string
	enterYourName?: string
	phone?: string
	enterYourPhone?: string
	email?: string
	enterYourEmail?: string
	message?: string
	enterYourMessage?: string
	sendMessage?: string
	back?: string
	sending?: string
}

const ConsultationForm = ({ 
	title,
	text,
	button,
	cityName,
	showCitySpecific = false,
	// Translation props
	salutationLabel,
	rezaBarghlameno,
	primeLocalHomes,
	readyToBuyOrSell,
	name,
	enterYourName,
	phone,
	enterYourPhone,
	email,
	enterYourEmail,
	message,
	enterYourMessage,
	sendMessage,
	back,
	sending
}: ConsultationFormProps) => {
	// Conditional translation hook usage with fallbacks
	let tCta: any = null
	try {
		tCta = useTranslations('cta')
	} catch (error) {
		console.warn('Translations not available, using fallbacks')
		tCta = null
	}

	// Resolve defaults from translations when props are not provided, with fallbacks
	const resolvedTitle = title ?? (tCta ? tCta('title') : 'Ready to Find Your Dream Property?')
	const resolvedText = text ?? (tCta ? tCta('text') : 'Contact our expert team today for a personalized consultation and start your journey to finding the perfect home or investment property.')
	const resolvedButton = button ?? (tCta ? tCta('button') : 'Schedule Consultation')

	const [showConsultation, setShowConsultation] = useState(false)
	const [contactFormData, setContactFormData] = useState({
		salutation: '',   // <-- NEW field
		name: '',
		phone: '',
		email: '',
		purpose: '',      // <-- NEW field
		message: ''
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
	const [statusMessage, setStatusMessage] = useState('')

	// Custom dropdown state and options
	const salutationOptions = ['Mr.', 'Mrs.', 'Ms.', 'Dr.']
	const purposeOptions = ['Buying', 'Selling', 'Renting']
	const [isSalutationOpen, setIsSalutationOpen] = useState(false)
	const [isPurposeOpen, setIsPurposeOpen] = useState(false)

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

	const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setContactFormData({
			...contactFormData,
			[e.target.name]: e.target.value
		})
	}

	const handleContactSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		// Validation
		if (!contactFormData.name.trim() || !contactFormData.email.trim()) {
			setSubmitStatus('error')
			setStatusMessage('Please fill in both name and email fields.')
			return
		}
		
		setIsSubmitting(true)
		setSubmitStatus('idle')
		setStatusMessage('')
		
		try {
			// EmailJS template parameters
			const templateParams = {
				to_name: 'Reza Barghlameno',
				to_email: 'Reza@socalprimehomes.com',
				from_title: contactFormData.salutation,
				from_name: contactFormData.name,
				from_email: contactFormData.email,
				from_phone: contactFormData.phone,
				from_purpose: contactFormData.purpose,
				message: contactFormData.message,
				reply_to: contactFormData.email,
				city: cityName || 'Southern California'
			}

			if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
				throw new Error('EmailJS configuration not found in environment variables')
			}

			const result = await emailjs.send(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
				templateParams
			)

			if (result.status === 200) {
				setSubmitStatus('success')
				setStatusMessage('Message sent successfully! We\'ll get back to you soon.')
				toast.success('Message sent')
				
				setContactFormData({
					salutation: '',
					name: '',
					phone: '',
					email: '',
					purpose: '',
					message: ''
				})
			} else {
				throw new Error('Failed to send message')
			}
		} catch (error: any) {
			console.error('Email sending failed:', error)
			setSubmitStatus('error')
			setStatusMessage(`Failed to send message: ${error?.message || 'Unknown error'}. Please try again or contact us directly.`)
			toast.error('Failed to send message. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className={`consultation-section-wrapper ${showConsultation ? 'flipped' : ''}`}>
			{/* Front Side */}
			<section className="consultation-section-front">
				<div className="cta-container">
					<h2 className="cta-title">{resolvedTitle}</h2>
					<p className="cta-text">{resolvedText}</p>
					<button 
						className="cta-btn"
						onClick={() => setShowConsultation(true)}
					>
						{resolvedButton}
					</button>
				</div>
			</section>
			
			{/* Back Side */}
			<section className="consultation-section-back">
				<div className="consultation-back-content">
					<div className="consultation-grid">
						{/* Agent Info */}
						<div className="agent-info-section">
							<div className="agent-info">
								<h3 className="agent-name">
									{rezaBarghlameno || "Reza Barghlameno"}
								</h3>
								<li className="footer-link">CA DRE # 02211952</li> {/* DRE number */}
								<p className="company-name">{primeLocalHomes || "Prime Local Homes"}</p>
								<div className="contact-details">
									<div className="contact-item">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
											<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>+1 858-305-4362</span>
									</div>
									<div className="contact-item">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
											<path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											<polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span>Reza@socalprimehomes.com</span>
									</div>
									{/* Address */}
									<div className="contact-item">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
											<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
											<circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
										</svg>
										<span>702 Broadway, San Diego, CA, 92101</span>
									</div>
								</div>
								<p className="consultation-cta-text">
									{showCitySpecific && cityName 
										? readyToBuyOrSell?.replace('{countyName}', cityName) || `Ready to buy or sell in ${cityName}? Contact Reza Barghlameno today for expert guidance and express service when you need it most.`
										: readyToBuyOrSell?.replace('{countyName}', 'Southern California') || "Ready to buy or sell in Southern California? Contact Reza Barghlameno today for expert guidance and express service when you need it most."
									}
								</p>
								
								{/* Back Button - Moved here below the CTA text */}
								<button 
									className="consultation-back-btn"
									onClick={() => setShowConsultation(false)}
								>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
										<path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									{back || "Back"}
								</button>
							</div>
						</div>
					
					{/* Contact Form */}
					<div className="right-content-section">
						<div className="contact-form-container">
							<form className="contact-form-simple" onSubmit={handleContactSubmit}>
								
								{/* Row - Salutation */}
								<div className="form-row">
									<div className="form-field full-width">
										<label htmlFor="salutation" className="form-label">{salutationLabel || "Title"}</label>
										<div className="form-dropdown">
											<button
												type="button"
												className="form-dropdown-btn"
												onClick={() => setIsSalutationOpen(!isSalutationOpen)}
											>
												<span>{contactFormData.salutation || (salutationLabel || 'Title')}</span>
												<span className="form-dropdown-arrow">▼</span>
											</button>
											{isSalutationOpen && (
												<div className="form-dropdown-menu">
													{salutationOptions.map((opt) => (
														<button
															key={opt}
															type="button"
															className={`form-dropdown-option ${contactFormData.salutation === opt ? 'active' : ''}`}
															onClick={() => { setContactFormData({ ...contactFormData, salutation: opt }); setIsSalutationOpen(false) }}
														>
															{opt}
														</button>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
								
								{/* Row - Name and Phone */}
								<div className="form-row">
									<div className="form-field">
										<label htmlFor="name" className="form-label">{name || "Name"}</label>
										<input
											type="text"
											id="name"
											name="name"
											className="form-input-field"
											placeholder={enterYourName || "Enter your name"}
											value={contactFormData.name}
											onChange={handleContactFormChange}
											required
										/>
									</div>
									<div className="form-field">
										<label htmlFor="phone" className="form-label">{phone || "Phone"}</label>
										<input
											type="tel"
											id="phone"
											name="phone"
											className="form-input-field"
											placeholder={enterYourPhone || "Enter your phone"}
											value={contactFormData.phone}
											onChange={handleContactFormChange}
											required
										/>
									</div>
								</div>
								
								{/* Row - Email */}
								<div className="form-row">
									<div className="form-field full-width">
										<label htmlFor="email" className="form-label">{email || "Email"}</label>
										<input
											type="email"
											id="email"
											name="email"
											className="form-input-field"
											placeholder={enterYourEmail || "Enter your email"}
											value={contactFormData.email}
											onChange={handleContactFormChange}
											required
										/>
									</div>
								</div>
								
								{/* Row - Purpose */}
								<div className="form-row">
									<div className="form-field full-width">
										<label htmlFor="purpose" className="form-label">Purpose</label>
										<div className="form-dropdown">
											<button
												type="button"
												className="form-dropdown-btn"
												onClick={() => setIsPurposeOpen(!isPurposeOpen)}
											>
												<span>{contactFormData.purpose || 'Select...'}</span>
												<span className="form-dropdown-arrow">▼</span>
											</button>
											{isPurposeOpen && (
												<div className="form-dropdown-menu">
													{purposeOptions.map((opt) => (
														<button
															key={opt}
															type="button"
															className={`form-dropdown-option ${contactFormData.purpose === opt ? 'active' : ''}`}
															onClick={() => { setContactFormData({ ...contactFormData, purpose: opt }); setIsPurposeOpen(false) }}
														>
															{opt}
														</button>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
								
								{/* Row - Message */}
								<div className="form-row">
									<div className="form-field full-width">
										<label htmlFor="message" className="form-label">{message || "Message"}</label>
										<textarea
											id="message"
											name="message"
											className="form-textarea-field"
											placeholder={enterYourMessage || "Enter your message"}
											rows={4}
											value={contactFormData.message}
											onChange={handleContactFormChange}
											required
										></textarea>
									</div>
								</div>
								
								{/* Submit */}
								<div className="form-row">
									<div className="form-field full-width">
										<button type="submit" className="submit-button" disabled={isSubmitting}>
											{isSubmitting ? (sending || 'Sending...') : (sendMessage || 'Send Message')}
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				</div>
			</section>
		</div>
	)
}

export default ConsultationForm
