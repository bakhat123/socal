"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X, Globe, Upload, User, MapPin, Plus, Trash2 } from "lucide-react"
import { ContactData } from "@/types"

interface ContactManagerProps {
  contactData: ContactData
  updateContactData: (data: ContactData, locale: string) => void
  currentLocale: string
  onLocaleChange: (locale: string) => void
}

interface Property {
  id: string
  address: string
  price: string
  year: string
  imageUrl: string
}

export default function ContactManager({ 
  contactData, 
  updateContactData,
  currentLocale,
  onLocaleChange
}: ContactManagerProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<ContactData>(contactData)
  const [isUploading, setIsUploading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    console.log('ContactManager useEffect - contactData:', contactData)
    console.log('ContactManager useEffect - currentLocale:', currentLocale)
    setEditData(contactData)
    // Initialize properties from contactData
    if (contactData?.hero?.recentSales?.properties) {
      setProperties(contactData.hero.recentSales.properties.map((prop, index) => ({
        id: index.toString(),
        address: prop.address || '',
        price: prop.price || '',
        year: prop.year || '',
        imageUrl: prop.imageUrl || ''
      })))
    } else {
      console.log('No properties found in contactData:', contactData)
    }
  }, [contactData, currentLocale])

  const availableLocales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  const handleEdit = (section: string) => {
    console.log('handleEdit called with section:', section)
    console.log('Current contactData:', contactData)
    setEditingSection(section)
    setEditData(contactData)
  }

  const handleSave = () => {
    // Update properties in the editData before saving
    const updatedEditData = {
      ...editData,
      hero: {
        ...editData.hero,
        recentSales: {
          ...editData.hero?.recentSales,
          properties: properties.map(prop => ({
            address: prop.address,
            price: prop.price,
            year: prop.year,
            imageUrl: prop.imageUrl
          }))
        }
      }
    }
    updateContactData(updatedEditData, currentLocale)
    setEditingSection(null)
  }

  const handleCancel = () => {
    setEditingSection(null)
    setEditData(contactData)
    // Reset properties to original data
    if (contactData.hero?.recentSales?.properties) {
      setProperties(contactData.hero.recentSales.properties.map((prop, index) => ({
        id: index.toString(),
        address: prop.address || '',
        price: prop.price || '',
        year: prop.year || '',
        imageUrl: prop.imageUrl || ''
      })))
    }
  }

  const handleLocaleChange = (locale: string) => {
    onLocaleChange(locale)
    setEditingSection(null)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Immediate preview using object URL
    const previewUrl = URL.createObjectURL(file)
    setEditData(prev => ({
      ...prev,
      author: { ...prev.author, photo: previewUrl }
    }))

    setIsUploading(true)
    try {
      const formData = new FormData()
      // API expects 'file' and a 'type' to build file name `${type}.ext`
      formData.append('file', file)
      formData.append('type', 'raza')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const newPhotoUrl = result.fileUrl || result.url || previewUrl
        setEditData(prev => ({
          ...prev,
          author: {
            ...prev.author,
            photo: newPhotoUrl
          }
        }))
        updateContactData({
          ...contactData,
          author: {
            ...contactData.author,
            photo: newPhotoUrl
          }
        }, currentLocale)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const addProperty = () => {
    const newProperty: Property = {
      id: Date.now().toString(),
      address: editData.newProperty?.address || 'New Address',
      price: editData.newProperty?.price || '$0',
      year: editData.newProperty?.year || '2024',
      imageUrl: editData.newProperty?.imageUrl || ''
    }
    setProperties([...properties, newProperty])
    
    // Clear the form
    setEditData(prev => ({
      ...prev,
      newProperty: { address: '', price: '', year: '', imageUrl: '' }
    }))
  }

  const updateProperty = (id: string, field: keyof Property, value: string) => {
    setProperties(properties.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    ))
  }

  const uploadPropertyImage = async (id: string, index: number, file: File) => {
    const previewUrl = URL.createObjectURL(file)
    setProperties(prev => prev.map(p => p.id === id ? { ...p, imageUrl: previewUrl } : p))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', `property_${index + 1}`)

      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      if (response.ok) {
        const result = await response.json()
        // Use the fileUrl from the API response (e.g., "/contact/property_1.png")
        const newUrl = result.fileUrl || previewUrl
        setProperties(prev => prev.map(p => p.id === id ? { ...p, imageUrl: newUrl } : p))

        // Persist into editData and backend immediately
        const updated = {
          ...editData,
          hero: {
            ...editData.hero,
            recentSales: {
              ...editData.hero?.recentSales,
              properties: properties.map((prop, i) => ({
                address: prop.address,
                price: prop.price,
                year: prop.year,
                imageUrl: i === index ? newUrl : prop.imageUrl
              }))
            }
          }
        }
        updateContactData(updated, currentLocale)
      }
    } catch (e) {
      console.error('Failed to upload property image', e)
    }
  }

  const deleteProperty = (id: string) => {
    const updatedProperties = properties.filter(prop => prop.id !== id)
    setProperties(updatedProperties)
    
    // Immediately save the changes to reflect on frontend
    const updatedEditData = {
      ...editData,
      hero: {
        ...editData.hero,
        recentSales: {
          ...editData.hero?.recentSales,
          properties: updatedProperties.map(prop => ({
            address: prop.address,
            price: prop.price,
            year: prop.year,
            imageUrl: prop.imageUrl
          }))
        }
      }
    }
    
    console.log('Saving after property deletion:', updatedEditData)
    updateContactData(updatedEditData, currentLocale)
  }

  // Get current locale data
  const currentData = contactData || {}
  const hero = currentData.hero || {}
  const form = currentData.form || {}
  const info = currentData.info || {}
  const author = currentData.author || {}

  return (
    <div className="admin-contact-content">
      {/* Locale Selector */}
      <div className="locale-selector" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe size={20} color="#64748b" />
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
            Edit Contact Page Content for:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {availableLocales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleLocaleChange(locale.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: currentLocale === locale.code ? '2px solid #d4af37' : '1px solid #e2e8f0',
                background: currentLocale === locale.code ? 'rgba(212, 175, 55, 0.1)' : 'white',
                color: currentLocale === locale.code ? '#d4af37' : '#64748b',
                fontSize: '14px',
                fontWeight: currentLocale === locale.code ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '80px',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '16px' }}>{locale.flag}</span>
              <span>{locale.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-header" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, rgba(241, 245, 249, 0) 50%, rgba(212, 175, 55, 0.03) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Contact Page Content - {availableLocales.find(l => l.code === currentLocale)?.name}</h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>Manage and customize your contact page content for {availableLocales.find(l => l.code === currentLocale)?.name}</p>
        </div>
      </div>

      <div className="content-grid">
        {/* Hero Section - Profile Information */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Hero Section - Profile Information</h3>
              <p className="card-subtitle">Profile photo, name, status, company, title, and badges</p>
            </div>
            <div className="card-actions">
              {editingSection === 'hero' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('hero')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'hero' ? (
            <div className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Profile Photo</label>
                  <div className="image-upload-container">
                    <img
                      src={editData.author?.photo || '/raza.jpg'}
                      alt="Profile"
                      className="preview-image"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #d4af37'
                      }}
                    />
                    <div>
                      <label
                        htmlFor="image-upload"
                        className="btn btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={16} />
                        {isUploading ? 'Uploading...' : 'Upload New Photo'}
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.author?.name || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      author: { ...prev.author, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status Badge</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.hero?.profileStatus || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, profileStatus: e.target.value }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.hero?.profileCompany || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, profileCompany: e.target.value }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Title/Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.hero?.profileTitle || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, profileTitle: e.target.value }
                    }))}
                  />
                </div>
				{/* Remove badges controls - no longer used */}
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div style={{
                background: 'white',
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start'
              }}>
                {/* Left Panel - Profile Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                      src={author.photo || '/raza.jpg'}
                      alt="Profile"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #d4af37',
                        marginBottom: '16px',
                        display: 'block',
                        margin: '0 auto 16px auto'
                      }}
                    />
                    <div style={{
                      background: 'white',
                      color: 'black',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      margin: '0 auto'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10b981'
                      }}></div>
                      {hero.profileStatus || 'Available Now'}
                    </div>
                  </div>
                  <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0', textAlign: 'center' }}>
                    {author.name || 'Reza Barghlameno'}
                  </h4>
                  <p style={{ fontSize: '16px', color: '#d4af37', margin: '0 0 8px 0', textAlign: 'center', fontWeight: '500' }}>
                    {hero.profileCompany || 'eXp of California'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#3b82f6', margin: '0 0 20px 0', textAlign: 'center' }}>
                    {hero.profileTitle || 'Lead of Crown Coastal Concierge'}
                  </p>
                </div>

                {/* Right Panel - Properties Preview */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h5 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                      {hero.recentSales?.title || 'Recent Sales'}
                    </h5>
                    <button style={{
                      background: '#d4af37',
                      color: 'black',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      {hero.recentSales?.seeAll || 'See All'}
                    </button>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px'
                  }}>
                    {properties.slice(0, 4).map((property) => (
                      <div key={property.id} style={{
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{ position: 'relative' }}>
                          <img
                            src={property.imageUrl || "/raza.jpg"}
                            alt="Property"
                            style={{
                              width: '100%',
                              height: '80px',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#d4af37',
                            color: 'black',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            {hero.recentSales?.sold || 'Sold'}
                          </div>
                        </div>
                        <div style={{ padding: '12px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                            {property.address}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#d4af37', marginBottom: '4px' }}>
                            {property.price}
                          </div>
                          <div style={{ fontSize: '11px', color: '#3b82f6' }}>
                            {property.year}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">About Section</h3>
              <p className="card-subtitle">Company description and professional background</p>
            </div>
            <div className="card-actions">
              {editingSection === 'about' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('about')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'about' ? (
            <div className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Main Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.info?.description?.title || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      info: { 
                        ...prev.info, 
                        description: { 
                          ...prev.info?.description, 
                          title: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.info?.description?.subtitle || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      info: { 
                        ...prev.info, 
                        description: { 
                          ...prev.info?.description, 
                          subtitle: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Paragraph 1</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={editData.info?.description?.text1 || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      info: { 
                        ...prev.info, 
                        description: { 
                          ...prev.info?.description, 
                          text1: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Paragraph 2</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={editData.info?.description?.text2 || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      info: { 
                        ...prev.info, 
                        description: { 
                          ...prev.info?.description, 
                          text2: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Paragraph 3</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={editData.info?.description?.text3 || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      info: { 
                        ...prev.info, 
                        description: { 
                          ...prev.info?.description, 
                          text3: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div style={{
                background: 'white',
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'left'
              }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                  {info.description?.title || 'Get to know Crown Coastal Concierge'}
                </h2>
                <p style={{ fontSize: '18px', color: '#3b82f6', margin: '0 0 24px 0', fontWeight: '500' }}>
                  {info.description?.subtitle || 'Real Estate Professional'}
                </p>
                <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
                  <p style={{ margin: '0 0 20px 0' }}>
                    {info.description?.text1 || 'With a journey that has taken him across 32 countries and over a hundred cities, Reza brings a world of experience and a unique global perspective to San Diego\'s real estate market. He firmly believes there\'s no place like San Diego, with its unparalleled coastal lines, vibrant cityscape, and endless adventures.'}
                  </p>
                  <p style={{ margin: '0 0 20px 0' }}>
                    {info.description?.text2 || 'Utilizing 17 years of client management & negotiation expertise, Reza has perfected the art of understanding his clients\' needs and exceeding their expectations. But it\'s not just about transactions for him. Whether guiding sellers to maximize their home\'s value or helping buyers find their dream property, Reza\'s true passion lies in scoring big for his clients.'}
                  </p>
                  <p style={{ margin: '0 0 0 0' }}>
                    {info.description?.text3 || 'Beyond real estate, Reza is deeply embedded in the fabric of the San Diego community. He\'s championed righteous causes through grassroots petitions, actively participated in beach clean-ups, and tirelessly worked to uplift underserved communities via various government-subsidized programs. For Reza, real estate isn\'t just business—it\'s a platform to further serve and enrich the community he cherishes most.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Section - Individual Property Management */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Properties Section</h3>
              <p className="card-subtitle">Manage individual properties with address, price, and year</p>
            </div>
            <div className="card-actions">
              {editingSection === 'properties' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('properties')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'properties' ? (
            <div className="edit-form">
              <div className="form-grid">
                <div style={{ gridColumn: '1 / -1', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                    Add New Property
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter property address"
                        value={editData.newProperty?.address || ''}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          newProperty: { 
                            address: e.target.value,
                            price: prev.newProperty?.price || '',
                            year: prev.newProperty?.year || '',
                            imageUrl: prev.newProperty?.imageUrl || ''
                          }
                        }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter property price"
                        value={editData.newProperty?.price || ''}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          newProperty: { 
                            address: prev.newProperty?.address || '',
                            price: e.target.value,
                            year: prev.newProperty?.year || '',
                            imageUrl: prev.newProperty?.imageUrl || ''
                          }
                        }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter property year"
                        value={editData.newProperty?.year || ''}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          newProperty: { 
                            address: prev.newProperty?.address || '',
                            price: prev.newProperty?.price || '',
                            year: e.target.value,
                            imageUrl: prev.newProperty?.imageUrl || ''
                          }
                        }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          
                          // Show preview immediately
                          const preview = URL.createObjectURL(file)
                          setEditData(prev => ({
                            ...prev,
                            newProperty: {
                              address: prev.newProperty?.address || '',
                              price: prev.newProperty?.price || '',
                              year: prev.newProperty?.year || '',
                              imageUrl: preview
                            }
                          }))
                          
                          // Upload the image and get the proper filename
                          try {
                            const formData = new FormData()
                            formData.append('file', file)
                            formData.append('type', `property_${properties.length + 1}`)
                            
                            const response = await fetch('/api/upload', { method: 'POST', body: formData })
                            if (response.ok) {
                              const result = await response.json()
                              const newUrl = result.fileUrl || preview
                              setEditData(prev => ({
                                ...prev,
                                newProperty: {
                                  address: prev.newProperty?.address || '',
                                  price: prev.newProperty?.price || '',
                                  year: prev.newProperty?.year || '',
                                  imageUrl: newUrl
                                }
                              }))
                            }
                          } catch (error) {
                            console.error('Failed to upload new property image:', error)
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={addProperty}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={16} />
                    Add Property
                  </button>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                    Existing Properties ({properties.length})
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                  }}>
                    {properties.map((property) => (
                      <div key={property.id} style={{
                        background: '#f8fafc',
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        padding: '20px',
                        position: 'relative'
                      }}>
                        {/* Delete Button - Top Right */}
                        <button
                          onClick={() => deleteProperty(property.id)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                            Address
                          </label>
                          <input
                            type="text"
                            value={property.address}
                            onChange={(e) => updateProperty(property.id, 'address', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                            Price
                          </label>
                          <input
                            type="text"
                            value={property.price}
                            onChange={(e) => updateProperty(property.id, 'price', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                            Year
                          </label>
                          <input
                            type="text"
                            value={property.year}
                            onChange={(e) => updateProperty(property.id, 'year', e.target.value)}
                            className="form-input"
                          />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                            Image
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#e5e7eb' }}>
                              {property.imageUrl && (
                                <img src={property.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <label style={{
                              background: '#3b82f6', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                            }}>
                              <Upload size={14} /> Upload
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const index = properties.findIndex(p => p.id === property.id)
                                  uploadPropertyImage(property.id, index, file)
                                }
                              }} />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div style={{
                background: 'white',
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
                  {hero.recentSales?.title || 'Recent Sales'} ({properties.length})
                </h4>
                
                {/* Show only 4 blueprint previews */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 2fr)',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  {properties.slice(0, 4).map((property) => (
                    <div key={property.id} style={{
                      background: '#f8fafc',
                      border: '2px dashed #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '100%',
                        height: '80px',
                        background: '#e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        fontSize: '12px',
                        overflow: 'hidden'
                      }}>
                        {property.imageUrl ? (
                          <img
                            src={property.imageUrl}
                            alt="Property"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          'Property Image'
                        )}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                        {property.address}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#d4af37', marginBottom: '4px' }}>
                        {property.price}
                      </div>
                      <div style={{ fontSize: '11px', color: '#3b82f6' }}>
                        {property.year}
                      </div>
                    </div>
                  ))}
                </div>
                
                {properties.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    No properties added yet. Click Edit to add properties.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Form Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Contact Form Section</h3>
              <p className="card-subtitle">Form header, fields, and styling configuration</p>
            </div>
            <div className="card-actions">
              {editingSection === 'contactForm' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('contactForm')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'contactForm' ? (
            <div className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Golden Banner Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.form?.header?.badge || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      form: { 
                        ...prev.form, 
                        header: { 
                          ...prev.form?.header, 
                          badge: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Main Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.form?.header?.title || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      form: { 
                        ...prev.form, 
                        header: { 
                          ...prev.form?.header, 
                          title: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description Text</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editData.form?.header?.subtitle || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      form: { 
                        ...prev.form, 
                        header: { 
                          ...prev.form?.header, 
                          subtitle: e.target.value 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.form?.fields?.name?.label || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      form: { 
                        ...prev.form, 
                        fields: { 
                          ...prev.form?.fields, 
                          name: { 
                            ...prev.form?.fields?.name, 
                            label: e.target.value 
                          } 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.form?.fields?.phone?.label || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      form: { 
                        ...prev.form, 
                        fields: { 
                          ...prev.form?.fields, 
                          phone: { 
                            ...prev.form?.fields?.phone, 
                            label: e.target.value 
                          } 
                        } 
                      }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.form?.fields?.email?.label || ''}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      form: { 
                        ...prev.form, 
                        fields: { 
                          ...prev.form?.fields, 
                          email: { 
                            ...prev.form?.fields?.email, 
                            label: e.target.value 
                          } 
                        } 
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div style={{
                background: 'white',
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center'
              }}>
                {/* Golden Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#92400e',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  display: 'inline-block'
                }}>
                  {form.header?.badge || 'Ready to Connect'}
                </div>
                
                {/* Main Heading */}
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#1a1a1a', 
                  margin: '0 0 16px 0',
                  fontFamily: 'serif'
                }}>
                  {form.header?.title || 'Contact Crown Coastal Concierge'}
                </h2>
                
                {/* Description */}
                <p style={{ 
                  fontSize: '18px', 
                  color: '#3b82f6', 
                  margin: '0 0 32px 0',
                  lineHeight: '1.5'
                }}>
                  {form.header?.subtitle || 'Ready to start your real estate journey? Get in touch today and let\'s discuss your dream property in San Diego.'}
                </p>
                
                {/* Form Fields Preview */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#1a1a1a',
                      textAlign: 'left'
                    }}>
                      {form.fields?.name?.label || 'Full Name'} *
                    </label>
                    <div style={{
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <User size={16} color="#8b5cf6" />
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        {form.fields?.name?.placeholder || 'Enter your full name'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#1a1a1a',
                      textAlign: 'left'
                    }}>
                      {form.fields?.phone?.label || 'Phone Number'} *
                    </label>
                    <div style={{
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <MapPin size={16} color="#ec4899" />
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        {form.fields?.phone?.placeholder || 'Enter your phone number'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1a1a1a',
                    textAlign: 'left'
                  }}>
                    {form.fields?.email?.label || 'Email Address'} *
                  </label>
                  <div style={{
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    <MapPin size={16} color="#8b5cf6" />
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      {form.fields?.email?.placeholder || 'Enter your email address'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
