import React from 'react'

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, ...props }) => (
  <span {...props}>{children}</span>
)

export default Badge
