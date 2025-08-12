'use client'

import { useFormStore, FORM_STEPS } from '@/lib/store/form-store'
import { useStripe, useElements } from '@/components/providers'
import { CardElement } from '@stripe/react-stripe-js'
import { useState, useEffect, useCallback } from 'react'
import { usePaymentSubmission } from '@/lib/hooks/use-payment-submission'

/**
 * Step 4: Payment Information
 * Collects payment method using Stripe Elements for secure processing
 */
export default function PaymentStep() {
  const { formData, updateField, validation, goToStep } = useFormStore()
  const stripe = useStripe()
  const elements = useElements()
  const { submitPayment, isProcessing, error: paymentError, isStripeReady } = usePaymentSubmission()
  
  const [isCardComplete, setIsCardComplete] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referralValidation, setReferralValidation] = useState<{
    isValidating: boolean
    isValid: boolean | null
    message: string | null
    referrerName: string | null
  }>({
    isValidating: false,
    isValid: null,
    message: null,
    referrerName: null
  })

  const handleCardChange = (event: { error?: { message: string }, complete: boolean }) => {
    setCardError(event.error ? event.error.message : null)
    setIsCardComplete(event.complete)
  }

  // Debounced referral validation
  const validateReferralCode = useCallback(async (code: string) => {
    if (!code || code.length < 3) {
      setReferralValidation({
        isValidating: false,
        isValid: null,
        message: null,
        referrerName: null
      })
      return
    }

    setReferralValidation(prev => ({ ...prev, isValidating: true }))

    try {
      const response = await fetch(`/api/referral?code=${encodeURIComponent(code)}`)
      const result = await response.json()

      if (result.valid) {
        setReferralValidation({
          isValidating: false,
          isValid: true,
          message: result.message,
          referrerName: result.referrer.firstName
        })
      } else {
        setReferralValidation({
          isValidating: false,
          isValid: false,
          message: result.error || 'Invalid referral code',
          referrerName: null
        })
      }
    } catch (error) {
      console.error('Referral validation error:', error)
      setReferralValidation({
        isValidating: false,
        isValid: false,
        message: 'Unable to validate referral code',
        referrerName: null
      })
    }
  }, [])

  // Debounce referral validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.referral_code && touchedFields.has('referral_code')) {
        validateReferralCode(formData.referral_code)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.referral_code, touchedFields, validateReferralCode])

  const handleReferralChange = (value: string) => {
    updateField('referral_code', value.toUpperCase()) // Convert to uppercase for consistency
    setTouchedFields(prev => new Set([...prev, 'referral_code']))
    
    // Reset validation state when user changes the input
    setReferralValidation({
      isValidating: false,
      isValid: null,
      message: null,
      referrerName: null
    })
  }

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set([...prev, field]))
  }

  const getFieldError = (field: string) => {
    if (!touchedFields.has(field)) return null
    return validation.errors[field] || null
  }

  const isFieldInvalid = (field: string) => {
    return touchedFields.has(field) && validation.errors[field]
  }

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!isCardComplete || !acceptedTerms || !isStripeReady || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitPayment()
      
      if (result.success) {
        // Payment successful - move to confirmation step
        goToStep(FORM_STEPS.CONFIRMATION)
      } else {
        // Payment failed - error is handled by the hook
        console.error('Payment submission failed:', result.error)
      }
    } catch (error) {
      console.error('Payment submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if payment step is valid
  const isPaymentValid = isCardComplete && acceptedTerms && isStripeReady && !isSubmitting

  // Card element styling to match brand design
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#2D3436',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: '#9CA3AF',
        },
        iconColor: '#FF6B9D',
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: false,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-text-primary mb-2 font-heading">
          Secure Your Spot
        </h3>
        <p className="text-text-secondary mb-4">
          Add your payment method to reserve your place in line.
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          No charge today - secures your spot
        </div>
      </div>

      {/* Referral Code (Optional) */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-purple-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">
              Have a Referral Code?
            </h4>
            <p className="text-xs text-purple-700 mb-3">
              Enter a friend's referral code to move up in line together!
            </p>
            <div className="relative">
              <input
                type="text"
                value={formData.referral_code}
                onChange={(e) => handleReferralChange(e.target.value)}
                onBlur={() => handleFieldBlur('referral_code')}
                className={`w-full px-3 py-2 pr-10 rounded-md border text-sm transition-all duration-200 ${
                  referralValidation.isValid === false
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : referralValidation.isValid === true
                    ? 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100'
                    : 'border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
                } bg-white text-text-primary placeholder-purple-400`}
                placeholder="Enter referral code (optional)"
                maxLength={50}
              />
              
              {/* Validation Status Icon */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {referralValidation.isValidating && (
                  <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                )}
                {referralValidation.isValid === true && (
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {referralValidation.isValid === false && (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Validation Messages */}
            {referralValidation.message && (
              <p className={`mt-1 text-xs ${
                referralValidation.isValid 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {referralValidation.message}
              </p>
            )}
            
            {getFieldError('referral_code') && (
              <p className="mt-1 text-xs text-error">{getFieldError('referral_code')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-text-primary">
            Payment Method *
          </label>
          <div className="flex items-center space-x-2">
            {/* Stripe badges */}
            <span className="text-xs text-text-muted">Secured by</span>
            <div className="flex items-center space-x-1">
              <svg className="w-8 h-5" viewBox="0 0 40 24" fill="none">
                <path
                  d="M11.6 8.4c0-.4.3-.6.8-.6.9 0 2.1.3 3 .9V6.3c-.8-.4-1.8-.6-3-.6-2.5 0-4.2 1.3-4.2 3.2 0 1.4 1 2.3 2.8 2.8l.8.2c1.1.3 1.6.5 1.6 1 0 .7-.7 1-1.8 1-1.2 0-2.4-.4-3.4-1v2.4c1 .5 2.2.7 3.4.7 2.7 0 4.4-1.3 4.4-3.3 0-1.5-1.1-2.4-2.9-2.9l-.8-.2c-.9-.2-1.5-.4-1.5-.9zm9.4-2.6c-1 0-1.8.5-2.2 1.2h-.1l-.2-1H16v10h2.4v-3.6h.1c.4.6 1.1 1 2.1 1 2.1 0 4-1.7 4-4.3s-1.9-4.3-4-4.3zm-.6 6.9c-.7 0-1.1-.2-1.4-.8-.3-.5-.3-1.3 0-1.8.3-.6.7-.8 1.4-.8s1.1.3 1.4.8c.3.5.3 1.2 0 1.7-.3.6-.7.9-1.4.9zm6.6-6.7h-1.5l-.1-.1c.1-.3.5-.5.9-.5.3 0 .6.1.8.2V5.4c-.3-.1-.7-.2-1.1-.2-1.2 0-2.1.6-2.1 1.6 0 .7.5 1.1 1.3 1.4l.6.2c.5.2.7.3.7.5 0 .4-.4.6-.9.6-.5 0-1-.2-1.4-.4v1.9c.5.2 1 .3 1.5.3 1.4 0 2.3-.7 2.3-1.7 0-.8-.6-1.2-1.4-1.5l-.6-.2c-.4-.1-.6-.3-.6-.5 0-.3.3-.5.7-.5.4 0 .8.1 1.1.3v-1.8zm2.1.2h2.4v8.6h-2.4V6.2z"
                  fill="#6772e5"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-soft-gray rounded-md p-4 bg-white">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>

        {cardError && (
          <p className="mt-2 text-sm text-error flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {cardError}
          </p>
        )}

        <div className="mt-3 flex items-center text-xs text-text-muted">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Your payment information is encrypted and secure. We use industry-standard security practices.
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-soft-gray-light p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 text-brand-primary bg-white border-soft-gray rounded focus:ring-brand-primary-light focus:ring-2"
            />
          </div>
          <label htmlFor="terms" className="text-sm text-text-secondary">
            <span className="block mb-2">
              I agree to the{' '}
              <a href="#" className="text-brand-primary hover:underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand-primary hover:underline font-medium">
                Privacy Policy
              </a>
              .
            </span>
            <span className="text-xs text-text-muted">
              By providing your payment method, you're securing your position in the waitlist. 
              If accepted, you'll be charged the membership fee. No commitment required to join the waitlist.
            </span>
          </label>
        </div>
      </div>

      {/* Payment Security Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-text-secondary">SSL Encrypted</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-text-secondary">PCI Compliant</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-text-secondary">Bank-Level Security</span>
        </div>
      </div>

      {/* Error Display */}
      {(paymentError || cardError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">Payment Error</h4>
              <p className="text-sm text-red-700">
                {paymentError || cardError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handlePaymentSubmit}
          disabled={!isPaymentValid || isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            isPaymentValid && !isProcessing
              ? 'bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg transform hover:scale-[1.02] focus:ring-4 focus:ring-brand-primary-light'
              : 'bg-soft-gray text-text-muted cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing Payment...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure My Spot
            </div>
          )}
        </button>

        <p className="text-center text-xs text-text-muted mt-4">
          By clicking &quot;Secure My Spot&quot;, you agree to save your payment method for future membership charges.
          You will only be charged if accepted from the waitlist.
        </p>
      </div>

      {/* Validation State for Form Store */}
      <input 
        type="hidden" 
        value={isPaymentValid ? 'valid' : 'invalid'} 
        onChange={() => {
          // This will trigger validation update in the form store
          // The payment step validation is handled by checking isCardComplete and acceptedTerms
        }}
      />
    </div>
  )
}