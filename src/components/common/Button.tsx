import React from 'react'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'cta'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const Button = ({ variant = 'primary', children, className = '', onClick }: ButtonProps) => {
  const baseClasses = 'font-sans font-medium uppercase tracking-wider transition-all duration-300 ease-in-out'
  
  const variantClasses = {
    primary: 'bg-gold text-charcoal hover:bg-opacity-90 hover:-translate-y-0.5 px-10 py-4 text-sm',
    secondary: 'border border-white text-white hover:bg-white hover:bg-opacity-10 px-10 py-4 text-sm',
    cta: 'relative overflow-hidden border-2 border-gold text-white px-12 py-5 text-sm before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gold before:transition-all before:duration-400 before:ease-in-out before:z-[-1] hover:before:left-0 hover:text-charcoal hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/30'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button