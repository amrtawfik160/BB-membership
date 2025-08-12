import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Form step definitions
export const FORM_STEPS = {
  PERSONAL: 0,
  DEMOGRAPHICS: 1, 
  INTERESTS: 2,
  PAYMENT: 3,
  CONFIRMATION: 4
} as const

export type FormStep = typeof FORM_STEPS[keyof typeof FORM_STEPS]

// Interest categories matching our database
export const INTEREST_OPTIONS = [
  'Social Events & Fitness',
  'Networking & Mentorship', 
  'Business & Finance Talks',
  'Member Perks & Discounts'
] as const

// Miami neighborhoods matching our database
export const NEIGHBORHOOD_OPTIONS = [
  'Brickell',
  'Coconut Grove',
  'Coral Gables',
  'Edgewater or Midtown',
  'South Beach',
  'Sunset Harbor',
  'Miami Beach',
  'Fort Lauderdale',
  'Boca Raton',
  'Palm Beach',
  'Other (please list)'
] as const

// Age range options
export const AGE_RANGE_OPTIONS = ['20s', '30s', '40s', '50s', '60s+'] as const

// Form data interface matching our database schema
export interface FormData {
  // Step 1: Personal Information
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  instagram_handle: string
  linkedin_url: string

  // Step 2: Demographics & Location
  age_range: (typeof AGE_RANGE_OPTIONS)[number] | ''
  neighborhood: (typeof NEIGHBORHOOD_OPTIONS)[number] | ''
  occupation: string

  // Step 3: Interests & Preferences
  interests: string[]
  marketing_opt_in: boolean

  // Step 4: Payment & Referral
  referral_code: string // Code entered by user (if referred)
  payment_method_id?: string
  
  // Tracking (auto-populated)
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referred_by?: string
  user_agent?: string
}

// User completion data from backend
export interface UserCompletionData {
  userId: string
  assignedReferralCode: string // User's own referral code for sharing
  waitlistPosition: number
  stripeCustomerId?: string
  setupIntentId?: string
}

// Form validation state
export interface FormValidation {
  step1: boolean
  step2: boolean
  step3: boolean
  step4: boolean
  errors: Record<string, string>
}

// Store interface
interface FormStore {
  // Current state
  currentStep: FormStep
  formData: FormData
  validation: FormValidation
  isSubmitting: boolean
  submitError: string | null
  userCompletionData: UserCompletionData | null

  // Navigation actions
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: FormStep) => void
  
  // Data update actions
  updateFormData: (data: Partial<FormData>) => void
  updateField: (field: keyof FormData, value: string | string[] | boolean) => void
  setUserCompletionData: (data: UserCompletionData) => void
  
  // Validation actions
  validateCurrentStep: () => boolean
  setValidationError: (field: string, error: string) => void
  clearValidationError: (field: string) => void
  
  // Form submission
  setSubmitting: (loading: boolean) => void
  setSubmitError: (error: string | null) => void
  
  // Utility actions
  resetForm: () => void
  prefillFromReferral: (referralCode: string) => void
}

// Initial form data
const initialFormData: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  date_of_birth: '',
  instagram_handle: '',
  linkedin_url: '',
  age_range: '',
  neighborhood: '',
  occupation: '',
  interests: [],
  marketing_opt_in: false,
  referral_code: ''
}

// Initial validation state
const initialValidation: FormValidation = {
  step1: false,
  step2: false,
  step3: false, 
  step4: false,
  errors: {}
}

// Validation functions with error messages
const validateStep1 = (data: FormData, setError?: (field: string, error: string) => void): boolean => {
  let isValid = true
  
  if (!data.first_name.trim()) {
    setError?.('first_name', 'First name is required')
    isValid = false
  }
  
  if (!data.last_name.trim()) {
    setError?.('last_name', 'Last name is required')
    isValid = false
  }
  
  if (!data.email.trim()) {
    setError?.('email', 'Email address is required')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    setError?.('email', 'Please enter a valid email address')
    isValid = false
  }
  
  if (!data.date_of_birth) {
    setError?.('date_of_birth', 'Date of birth is required')
    isValid = false
  } else if (new Date(data.date_of_birth) >= new Date()) {
    setError?.('date_of_birth', 'Please enter a valid birth date')
    isValid = false
  }
  
  return isValid
}

const validateStep2 = (data: FormData, setError?: (field: string, error: string) => void): boolean => {
  let isValid = true
  
  if (!data.age_range) {
    setError?.('age_range', 'Please select your age range')
    isValid = false
  }
  
  if (!data.neighborhood) {
    setError?.('neighborhood', 'Please select your Miami area')
    isValid = false
  }
  
  if (!data.occupation.trim()) {
    setError?.('occupation', 'Please describe your occupation')
    isValid = false
  }
  
  return isValid
}

const validateStep3 = (data: FormData, setError?: (field: string, error: string) => void): boolean => {
  if (data.interests.length === 0) {
    setError?.('interests', 'Please select at least one interest')
    return false
  }
  return true
}

const validateStep4 = (): boolean => {
  // Payment step is always valid since Stripe handles validation
  // We'll validate payment method in the payment component itself
  return true
}

// Create the store with persistence
export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: FORM_STEPS.PERSONAL,
      formData: initialFormData,
      validation: initialValidation,
      isSubmitting: false,
      submitError: null,
      userCompletionData: null,

      // Navigation actions
      nextStep: () => {
        const { currentStep, validateCurrentStep } = get()
        if (validateCurrentStep() && currentStep < FORM_STEPS.CONFIRMATION) {
          set({ currentStep: (currentStep + 1) as FormStep })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > FORM_STEPS.PERSONAL) {
          set({ currentStep: (currentStep - 1) as FormStep })
        }
      },

      goToStep: (step: FormStep) => {
        set({ currentStep: step })
      },

      // Data update actions
      updateFormData: (data: Partial<FormData>) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
          validation: {
            ...state.validation,
            errors: { ...state.validation.errors } // Clear errors for updated fields
          }
        }))
        
        // Re-validate after update
        get().validateCurrentStep()
      },

      updateField: (field: keyof FormData, value: string | string[] | boolean) => {
        // Clear error for this field first
        get().clearValidationError(field)
        
        set((state) => ({
          formData: { ...state.formData, [field]: value }
        }))
        
        // Re-validate current step
        get().validateCurrentStep()
      },

      setUserCompletionData: (data: UserCompletionData) => {
        set({ userCompletionData: data })
      },

      // Validation actions
      validateCurrentStep: () => {
        const { currentStep, formData, setValidationError } = get()
        let isValid = false

        // Clear existing errors for current step
        const currentErrors: Record<string, string> = {}

        switch (currentStep) {
          case FORM_STEPS.PERSONAL:
            isValid = validateStep1(formData, (field, error) => {
              currentErrors[field] = error
            })
            break
          case FORM_STEPS.DEMOGRAPHICS:
            isValid = validateStep2(formData, (field, error) => {
              currentErrors[field] = error
            })
            break
          case FORM_STEPS.INTERESTS:
            isValid = validateStep3(formData, (field, error) => {
              currentErrors[field] = error
            })
            break
          case FORM_STEPS.PAYMENT:
            isValid = validateStep4()
            break
          case FORM_STEPS.CONFIRMATION:
            isValid = true
            break
        }

        // Update validation state
        set((state) => ({
          validation: {
            ...state.validation,
            [`step${currentStep + 1}`]: isValid,
            errors: {
              ...state.validation.errors,
              ...currentErrors
            }
          }
        }))

        return isValid
      },

      setValidationError: (field: string, error: string) => {
        set((state) => ({
          validation: {
            ...state.validation,
            errors: { ...state.validation.errors, [field]: error }
          }
        }))
      },

      clearValidationError: (field: string) => {
        set((state) => {
          const newErrors = { ...state.validation.errors }
          delete newErrors[field]
          return {
            validation: {
              ...state.validation,
              errors: newErrors
            }
          }
        })
      },

      // Form submission
      setSubmitting: (loading: boolean) => {
        set({ isSubmitting: loading })
      },

      setSubmitError: (error: string | null) => {
        set({ submitError: error })
      },

      // Utility actions
      resetForm: () => {
        set({
          currentStep: FORM_STEPS.PERSONAL,
          formData: initialFormData,
          validation: initialValidation,
          isSubmitting: false,
          submitError: null
        })
      },

      prefillFromReferral: (referralCode: string) => {
        set((state) => ({
          formData: {
            ...state.formData,
            referral_code: referralCode,
            referred_by: referralCode,
            utm_source: 'referral'
          }
        }))
      }
    }),
    {
      name: 'bb-membership-form', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist form data and current step, not validation state
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData
      })
    }
  )
)

// Selector hooks for optimized re-renders
export const useCurrentStep = () => useFormStore((state) => state.currentStep)
export const useFormData = () => useFormStore((state) => state.formData)
export const useValidation = () => useFormStore((state) => state.validation)
export const useIsSubmitting = () => useFormStore((state) => state.isSubmitting)

// Progress calculation
export const useFormProgress = () => {
  const currentStep = useCurrentStep()
  return Math.round(((currentStep + 1) / Object.keys(FORM_STEPS).length) * 100)
}

// Step validation helpers
export const useCanGoNext = () => {
  const validation = useValidation()
  const currentStep = useCurrentStep()
  
  switch (currentStep) {
    case FORM_STEPS.PERSONAL:
      return validation.step1
    case FORM_STEPS.DEMOGRAPHICS:
      return validation.step2
    case FORM_STEPS.INTERESTS:
      return validation.step3
    case FORM_STEPS.PAYMENT:
      return validation.step4
    default:
      return false
  }
}

// Form completion status
export const useIsFormComplete = () => {
  const validation = useValidation()
  return validation.step1 && validation.step2 && validation.step3 && validation.step4
}