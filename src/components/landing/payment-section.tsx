'use client'

import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CreditCard, Shield, Lock } from 'lucide-react'

interface PaymentSectionProps {
  isVisible: boolean
  onPaymentSetup: (paymentMethodId: string) => void
  isProcessing: boolean
  error: string | null
}

export function PaymentSection({ 
  isVisible, 
  onPaymentSetup, 
  isProcessing, 
  error 
}: PaymentSectionProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [setupError, setSetupError] = useState<string | null>(null)
  const [isSettingUp, setIsSettingUp] = useState(false)

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9CA3AF',
        },
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: false,
  }

  const handleSetupPayment = async () => {
    if (!stripe || !elements) {
      setSetupError('Payment system not ready. Please try again.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setSetupError('Card element not found. Please refresh the page.')
      return
    }

    setIsSettingUp(true)
    setSetupError(null)

    try {
      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (paymentError) {
        setSetupError(paymentError.message || 'Failed to process card information')
        return
      }

      if (!paymentMethod) {
        setSetupError('Failed to create payment method')
        return
      }

      // Call parent component with payment method ID
      onPaymentSetup(paymentMethod.id)
      
    } catch (err) {
      setSetupError('An unexpected error occurred. Please try again.')
      console.error('Payment setup error:', err)
    } finally {
      setIsSettingUp(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
        <div className="w-6 h-6 bg-[var(--color-primary-100)] rounded-md flex items-center justify-center">
          <CreditCard className="w-3 h-3 text-[var(--color-primary-600)]" />
        </div>
        <h3 className="text-base font-serif font-medium text-neutral-900">Secure Your Spot</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              No charge today - secures your spot
            </p>
            <p className="text-xs text-blue-700">
              We&apos;ll save your payment method for when you&apos;re accepted. Your first charge occurs when membership begins (3-month minimum).
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium text-neutral-700">
          Card Information <span className="text-[var(--color-primary-500)]">*</span>
        </Label>
        
        <div className="relative">
          <div className={`border rounded-md p-3 transition-colors ${
            setupError ? 'border-red-300' : 'border-neutral-200 focus-within:border-[var(--color-primary-500)]'
          }`}>
            <CardElement 
              options={cardElementOptions}
              onChange={(event) => {
                if (event.error) {
                  setSetupError(event.error.message)
                } else {
                  setSetupError(null)
                }
              }}
            />
          </div>
          
          {(setupError || error) && (
            <p className="text-xs text-red-600 mt-1">
              {setupError || error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Secured by Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-4" />
            <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-4" />
            <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd31dc8d2ba425e23d9ca.svg" alt="Amex" className="h-4" />
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSetupPayment}
        disabled={!stripe || !elements || isSettingUp || isProcessing}
        className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white py-3 text-base font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSettingUp || isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Setting up payment...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4" />
            Save Payment Method
          </>
        )}
      </Button>

      <div className="text-xs text-center text-gray-500">
        <p>By saving your payment method, you agree to our Terms of Service.</p>
        <p>You can cancel anytime before your membership begins.</p>
      </div>
    </div>
  )
}