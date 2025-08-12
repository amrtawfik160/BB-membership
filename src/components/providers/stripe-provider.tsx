'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { ReactNode, useMemo } from 'react'

// Initialize Stripe outside component to avoid re-creating the Stripe instance on every render
let stripePromise: Promise<Stripe | null> | null = null

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    if (!publishableKey) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable')
      return null
    }

    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

interface StripeProviderProps {
  children: ReactNode
}

/**
 * Stripe Provider Component
 * Wraps the application with Stripe Elements provider for payment processing
 */
export default function StripeProvider({ children }: StripeProviderProps) {
  const stripe = useMemo(() => getStripe(), [])

  // If Stripe fails to load, render children without Stripe context
  if (!stripe) {
    console.warn('Stripe failed to initialize. Payment functionality will be disabled.')
    return <>{children}</>
  }

  // Stripe Elements options
  const options = {
    appearance: {
      theme: 'stripe' as const,
      variables: {
        // Brand colors matching BB Membership design
        colorPrimary: '#FF6B9D',
        colorBackground: '#FFFFFF',
        colorText: '#2D3436',
        colorDanger: '#EF4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          padding: '12px',
          fontSize: '16px',
          border: '1px solid #E5E7EB',
        },
        '.Input:focus': {
          borderColor: '#FF6B9D',
          boxShadow: '0 0 0 3px rgba(255, 107, 157, 0.1)',
        },
        '.Input--invalid': {
          borderColor: '#EF4444',
        },
        '.Label': {
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px',
        }
      }
    }
  }

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  )
}

/**
 * Hook to access Stripe instance
 * Use this hook in components that need direct access to Stripe
 */
export { useStripe, useElements } from '@stripe/react-stripe-js'