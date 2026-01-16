import React from 'react'

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = '', children, ...props }) => {
  return (
    <label 
      className={`block text-sm font-medium text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

export default Label
