'use client'

import React, { useState } from 'react'

const SalesModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const recentSales = [
    {
      id: 1,
      address: "1234 Ocean View Dr, La Jolla",
      price: "$2,450,000",
      type: "Sold",
      date: "2024",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      address: "5678 Coastal Blvd, Del Mar",
      price: "$1,890,000",
      type: "Sold",
      date: "2024",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      address: "9012 Sunset Cliffs Rd, Point Loma",
      price: "$3,120,000",
      type: "Sold",
      date: "2023",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      address: "3456 Pacific Coast Hwy, Encinitas",
      price: "$2,850,000",
      type: "Sold",
      date: "2023",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      address: "7890 Beach Blvd, Huntington Beach",
      price: "$2,890,000",
      type: "Sold",
      date: "2023",
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      address: "2345 Laguna Dr, Laguna Beach",
      price: "$3,750,000",
      type: "Sold",
      date: "2022",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
      address: "4567 Coronado Island Way, Coronado",
      price: "$4,120,000",
      type: "Sold",
      date: "2022",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
      address: "8901 La Jolla Shores Dr, La Jolla",
      price: "$5,450,000",
      type: "Sold",
      date: "2022",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      address: "1234 Solana Beach Dr, Solana Beach",
      price: "$2,980,000",
      type: "Sold",
      date: "2022",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 10,
      address: "5678 Cardiff By The Sea, Cardiff",
      price: "$3,250,000",
      type: "Sold",
      date: "2021",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 11,
      address: "9012 Carlsbad Village Dr, Carlsbad",
      price: "$2,750,000",
      type: "Sold",
      date: "2021",
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 12,
      address: "3456 Oceanside Blvd, Oceanside",
      price: "$2,450,000",
      type: "Sold",
      date: "2021",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ]

  // Listen for global modal open event
  React.useEffect(() => {
    const handleModalOpen = () => {
      setIsOpen(true)
    }

    // Listen for custom event from ContactHero
    document.addEventListener('openSalesModal', handleModalOpen)
    
    return () => {
      document.removeEventListener('openSalesModal', handleModalOpen)
    }
  }, [])

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  if (!isOpen) return null

  return (
    <div className="sales-modal-overlay" onClick={handleBackdropClick}>
      <div className="sales-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>All Recent Sales</h2>
            <div className="sales-summary">{recentSales.length} Properties Sold</div>
          </div>
          <button className="close-btn" onClick={closeModal}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="sales-grid-modal">
            {recentSales.map((sale) => (
              <div key={sale.id} className="sale-card-modal">
                <div className="sale-image-modal">
                  <img src={sale.image} alt={sale.address} />
                  <div className="sale-overlay-modal">
                    <span className="sale-type-modal">{sale.type}</span>
                  </div>
                </div>
                <div className="sale-content-modal">
                  <h4 className="sale-address-modal">{sale.address}</h4>
                  <p className="sale-price-modal">{sale.price}</p>
                  <span className="sale-date-modal">{sale.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesModal

