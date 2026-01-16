import React from 'react'
import { Toaster as SonnerToaster } from 'sonner'

export const Toaster: React.FC = () => {
  return (
    <SonnerToaster 
      position="top-center"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        className: 'rounded-lg shadow-lg',
        style: {
          padding: '16px',
          fontSize: '14px',
        },
      }}
    />
  )
}

export default Toaster
