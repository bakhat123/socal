import React from 'react'

type HeroBadgeProps = {
  children: React.ReactNode
  className?: string
}

const HeroBadge = ({ children, className = '' }: HeroBadgeProps) => {
  return (
    <div className={`inline-block bg-gold/15 border border-gold px-8 py-3 rounded-full text-xs font-medium text-gold tracking-widest uppercase mb-8 ${className}`}>
      {children}
    </div>
  )
}

export default HeroBadge