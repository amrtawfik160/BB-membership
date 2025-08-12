import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormStore, FORM_STEPS, FormStep } from '../store/form-store'

/**
 * Hook to synchronize form state with URL parameters
 * - Handles referral codes from URL (?ref=CODE)
 * - Manages UTM parameters for tracking
 * - Syncs current step with URL for better UX
 */
export const useFormUrlSync = () => {
  const searchParams = useSearchParams()
  const { 
    currentStep, 
    formData,
    prefillFromReferral, 
    updateFormData,
    goToStep 
  } = useFormStore()

  // Initialize from URL parameters on mount
  useEffect(() => {
    const referralCode = searchParams.get('ref')
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium') 
    const utmCampaign = searchParams.get('utm_campaign')
    const stepParam = searchParams.get('step')

    // Handle referral code
    if (referralCode && !formData.referred_by) {
      prefillFromReferral(referralCode)
    }

    // Handle UTM parameters
    if (utmSource && !formData.utm_source) {
      updateFormData({ 
        utm_source: utmSource,
        ...(utmMedium && { utm_medium: utmMedium }),
        ...(utmCampaign && { utm_campaign: utmCampaign })
      })
    }

    // Handle step parameter (for direct links to specific steps)
    if (stepParam) {
      const stepNumber = parseInt(stepParam)
      if (stepNumber >= 0 && stepNumber <= Object.keys(FORM_STEPS).length - 1) {
        goToStep(stepNumber as FormStep)
      }
    }

    // Capture user agent and IP (IP will be handled server-side)
    if (typeof navigator !== 'undefined' && !formData.user_agent) {
      updateFormData({ 
        user_agent: navigator.userAgent
      })
    }

  }, [searchParams, formData.referred_by, formData.utm_source, formData.user_agent, prefillFromReferral, updateFormData, goToStep]) // Dependencies for effect

  // Update URL when step changes (for bookmarking and back/forward navigation)
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('step', currentStep.toString())
    
    // Use replace to avoid creating browser history entries for each step
    window.history.replaceState({}, '', url.toString())
  }, [currentStep])

  return {
    // Utility functions for components to use
    getReferralUrl: (referralCode: string) => {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      return `${baseUrl}?ref=${referralCode}`
    },
    
    getStepUrl: (step: number) => {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      return `${baseUrl}?step=${step}`
    },

    // Current URL parameters for analytics
    getCurrentUtmParams: () => ({
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_content: searchParams.get('utm_content'),
      utm_term: searchParams.get('utm_term')
    })
  }
}

/**
 * Hook specifically for referral code handling
 * Provides utilities for referral link generation and validation
 */
export const useReferralSystem = () => {
  const { formData, updateFormData } = useFormStore()

  const generateReferralLink = (userReferralCode: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = new URL(baseUrl)
    url.searchParams.set('ref', userReferralCode)
    url.searchParams.set('utm_source', 'referral')
    url.searchParams.set('utm_medium', 'link')
    url.searchParams.set('utm_campaign', 'waitlist')
    return url.toString()
  }

  const validateReferralCode = (code: string): boolean => {
    // Match our database referral code format: 4 letters + 2024 + optional numbers
    return /^[A-Z]{1,4}2024\d*$/.test(code)
  }

  const applyReferralCode = async (code: string): Promise<boolean> => {
    if (!validateReferralCode(code)) {
      return false
    }

    try {
      // In a real implementation, we'd verify the code exists in the database
      // For now, just update the form state
      updateFormData({
        referral_code: code,
        referred_by: code,
        utm_source: 'referral'
      })
      return true
    } catch (error) {
      console.error('Failed to apply referral code:', error)
      return false
    }
  }

  return {
    generateReferralLink,
    validateReferralCode,
    applyReferralCode,
    hasReferralCode: !!formData.referred_by,
    currentReferralCode: formData.referral_code
  }
}

/**
 * Hook for form analytics and tracking
 * Provides utilities for tracking user behavior through the form
 */
export const useFormAnalytics = () => {
  const { formData } = useFormStore()

  const trackStepView = (step: number) => {
    // In production, integrate with Google Analytics, Mixpanel, etc.
    console.log('Step viewed:', step, {
      user_agent: formData.user_agent,
      utm_source: formData.utm_source,
      referred_by: formData.referred_by
    })
    
    // Example GA4 event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).gtag('event', 'form_step_viewed', {
        step_number: step,
        step_name: getStepName(step),
        referral_code: formData.referred_by || 'none'
      })
    }
  }

  const trackStepComplete = (step: number) => {
    console.log('Step completed:', step)
    
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).gtag('event', 'form_step_completed', {
        step_number: step,
        step_name: getStepName(step)
      })
    }
  }

  const trackFormSubmit = () => {
    console.log('Form submitted:', {
      total_steps: Object.keys(FORM_STEPS).length,
      utm_source: formData.utm_source,
      referred_by: formData.referred_by
    })

    if (typeof window !== 'undefined' && 'gtag' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).gtag('event', 'form_submit', {
        method: 'waitlist_signup',
        referral_code: formData.referred_by || 'none'
      })
    }
  }

  return {
    trackStepView,
    trackStepComplete,
    trackFormSubmit
  }
}

// Helper function to get readable step names
const getStepName = (step: number): string => {
  const stepNames = ['personal', 'demographics', 'interests', 'payment', 'confirmation']
  return stepNames[step] || 'unknown'
}