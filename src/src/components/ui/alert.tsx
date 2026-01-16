import React from 'react'

export const Alert: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, ...props }) => <strong {...props}>{children}</strong>
export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => <div {...props}>{children}</div>

export default Alert
