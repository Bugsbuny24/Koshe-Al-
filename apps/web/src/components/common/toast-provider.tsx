'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      expand={false}
      closeButton
      toastOptions={{
        style: {
          borderRadius: '0.75rem',
        },
      }}
    />
  )
}

export { toast } from 'sonner'
