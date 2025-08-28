import React from 'react'
import Button from '../../common/Button'

type HeroButtonProps = {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const HeroButton = ({ variant = 'primary', children, className = '', onClick }: HeroButtonProps) => {
  const buttonClasses = {
    primary: 'bg-gold text-charcoal hover:bg-gold-400 px-10 py-4 text-sm',
    secondary: 'border border-white text-white hover:bg-white/10 px-10 py-4 text-sm'
  }

  return (
    <Button 
      variant={variant}
      className={`${buttonClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default HeroButton