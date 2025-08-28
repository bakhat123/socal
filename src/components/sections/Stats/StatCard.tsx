import React from 'react'

type StatCardProps = {
  value: number
  label: string
  suffix?: string
}

const StatCard = ({ value, label, suffix }: StatCardProps) => {
  return (
    <div className="bg-white text-center p-12 rounded shadow-lg hover:-translate-y-3 hover:shadow-xl transition-all duration-400 relative overflow-hidden group">
      <div 
        className="stat-number font-serif text-5xl font-medium mb-3 text-gold" 
        data-target={value} 
        data-suffix={suffix}
      >
        0{suffix}
      </div>
      <div className="text-sm uppercase tracking-wider text-charcoal opacity-80">
        {label}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-600"></div>
    </div>
  )
}

export default StatCard