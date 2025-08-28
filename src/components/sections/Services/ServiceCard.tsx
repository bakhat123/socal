import React from 'react'

type ServiceCardProps = {
  icon: string
  title: string
  description: string
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <div className="bg-white p-10 rounded-xl shadow-lg border border-gold/10 hover:-translate-y-3 hover:shadow-xl hover:border-gold/30 transition-all duration-600 [transform-style:preserve-3d] relative overflow-hidden group">
      {/* Subtle real-estate background on hover */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=60')",
        }}
      />
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* <div className="text-5xl mb-6 transition-all duration-400 group-hover:scale-110">
          {icon}
        </div> */}
        <h3 className="font-serif text-2xl mb-4 text-charcoal group-hover:text-charcoal">
          {title}
        </h3>
        <p className="text-charcoal/70 leading-relaxed group-hover:text-charcoal/80">
          {description}
        </p>
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br from-gold via-gold-400 to-gold [mask:linear-gradient(white,white)_padding-box,linear-gradient(white,white)] [mask-composite:exclude] opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
    </div>
  )
}

export default ServiceCard