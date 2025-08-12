'use client'

import { useStripe, useElements } from '@/components/providers'
import { CardElement } from '@stripe/react-stripe-js'
import { useFormStore, UserCompletionData } from '@/lib/store/form-store'
import { useState } from 'react'

interface PaymentSubmissionState {
  isProcessing: boolean
  error: string | null
  isComplete: boolean
  clientSecret: string | null
  setupIntentId: string | null
}

interface PaymentResult {
  success: boolean
  setupIntentId?: string
  paymentMethodId?: string
  error?: string
}

/**
 * Hook for handling payment method setup and submission
 * Manages the complete flow: create setup intent -> confirm card setup -> save payment method
 */
export function usePaymentSubmission() {
  const stripe = useStripe()
  const elements = useElements()
  const { formData, setSubmitting, setSubmitError, setUserCompletionData } = useFormStore()

  const [paymentState, setPaymentState] = useState<PaymentSubmissionState>({
    isProcessing: false,
    error: null,
    isComplete: false,
    clientSecret: null,
    setupIntentId: null,
  })

  /**
   * Step 1: Create setup intent by submitting user data
   * This will create the user in our database and return a Stripe client secret
   */
  const createSetupIntent = async (): Promise<{ clientSecret: string; userId: string } | null> => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Add tracking data
          user_agent: navigator.userAgent,
          // We'll handle the payment method in the next step
          payment_method_id: null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create setup intent')
      }

      // Store user completion data in the form store
      const completionData: UserCompletionData = {
        userId: result.data.user.id,
        assignedReferralCode: result.data.user.referralCode,
        waitlistPosition: result.data.user.waitlistPosition,
        stripeCustomerId: result.data.stripeCustomerId,
      }
      setUserCompletionData(completionData)

      return {
        clientSecret: result.data.clientSecret,
        userId: result.data.user.id,
      }
    } catch (error) {
      console.error('Failed to create setup intent:', error)
      return null
    }
  }

  /**
   * Step 2: Confirm card setup using Stripe Elements
   */
  const confirmCardSetup = async (clientSecret: string): Promise<{ setupIntentId: string; paymentMethodId: string } | null> => {
    if (!stripe || !elements) {
      throw new Error('Stripe has not loaded yet')
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      throw new Error('Card element not found')
    }

    try {
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.first_name} ${formData.last_name}`,
            email: formData.email,
          },
        },
      })

      if (error) {
        throw new Error(error.message || 'Payment setup failed')
      }

      if (!setupIntent || setupIntent.status !== 'succeeded') {
        throw new Error('Payment setup was not completed successfully')
      }

      if (!setupIntent.payment_method) {
        throw new Error('No payment method was created')
      }

      return {
        setupIntentId: setupIntent.id,
        paymentMethodId: setupIntent.payment_method as string,
      }
    } catch (error) {
      console.error('Failed to confirm card setup:', error)
      throw error
    }
  }

  /**
   * Step 3: Save payment method to user record
   */
  const savePaymentMethod = async (userId: string, setupIntentId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/stripe/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          setupIntentId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save payment method')
      }

      return true
    } catch (error) {
      console.error('Failed to save payment method:', error)
      return false
    }
  }

  /**
   * Complete payment submission flow
   * Handles the entire process from creating setup intent to saving payment method
   */
  const submitPayment = async (): Promise<PaymentResult> => {
    if (!stripe || !elements) {
      return { success: false, error: 'Stripe has not loaded yet' }
    }

    setPaymentState(prev => ({ ...prev, isProcessing: true, error: null }))
    setSubmitting(true)
    setSubmitError(null)

    try {
      // Step 1: Create user and setup intent
      const setupData = await createSetupIntent()
      if (!setupData) {
        throw new Error('Failed to create setup intent')
      }

      setPaymentState(prev => ({ 
        ...prev, 
        clientSecret: setupData.clientSecret 
      }))

      // Step 2: Confirm card setup with Stripe
      const confirmResult = await confirmCardSetup(setupData.clientSecret)
      if (!confirmResult) {
        throw new Error('Failed to confirm payment method')
      }

      setPaymentState(prev => ({ 
        ...prev, 
        setupIntentId: confirmResult.setupIntentId 
      }))

      // Step 3: Save payment method to user record
      const saveSuccess = await savePaymentMethod(setupData.userId, confirmResult.setupIntentId)
      if (!saveSuccess) {
        throw new Error('Failed to save payment method')
      }

      // Success!
      setPaymentState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        isComplete: true 
      }))
      
      return {
        success: true,
        setupIntentId: confirmResult.setupIntentId,
        paymentMethodId: confirmResult.paymentMethodId,
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      setPaymentState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage 
      }))
      
      setSubmitError(errorMessage)
      
      return { success: false, error: errorMessage }
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Reset payment state
   */
  const resetPaymentState = () => {
    setPaymentState({
      isProcessing: false,
      error: null,
      isComplete: false,
      clientSecret: null,
      setupIntentId: null,
    })
    setSubmitError(null)
  }

  return {
    submitPayment,
    resetPaymentState,
    isProcessing: paymentState.isProcessing,
    error: paymentState.error,
    isComplete: paymentState.isComplete,
    isStripeReady: !!(stripe && elements),
  }
}