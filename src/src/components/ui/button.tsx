import React from 'react'

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }> = ({ children, className, size, variant, ...props }) => {
  return (
    <button {...props} className={className}>
      {children}
    </button>
  )
}

export default Button
