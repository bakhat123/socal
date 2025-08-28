import React from 'react'

type SectionHeaderProps = {
  title: string
  subtitle: string
  className?: string
}

const SectionHeader = ({ title, subtitle, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="font-serif text-4xl font-medium mb-4 text-charcoal">
        {title}
      </h2>
      <p className="text-charcoal/70 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  )
}

export default SectionHeader