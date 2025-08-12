'use client'

import { useFormStore, FORM_STEPS } from '@/lib/store/form-store'

interface FormNavigationProps {
  onNext?: () => void
  onPrev?: () => void
}

/**
 * Form Navigation Component
 * Handles step navigation with validation
 */
export default function FormNavigation({ onNext, onPrev }: FormNavigationProps) {
  const { 
    currentStep, 
    nextStep, 
    prevStep, 
    validation, 
    validateCurrentStep,
    isSubmitting 
  } = useFormStore()

  const canGoBack = currentStep > FORM_STEPS.PERSONAL
  const isLastStep = currentStep === FORM_STEPS.INTERESTS
  
  // Get current step validation status
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case FORM_STEPS.PERSONAL:
        return validation.step1
      case FORM_STEPS.DEMOGRAPHICS:
        return validation.step2
      case FORM_STEPS.INTERESTS:
        return validation.step3
      default:
        return false
    }
  }

  const handleNext = () => {
    // Validate current step before proceeding
    const isValid = validateCurrentStep()
    
    if (isValid) {
      if (isLastStep) {
        // On the last step, call the provided onNext handler
        onNext?.()
      } else {
        // Move to next step
        nextStep()
      }
    }
  }

  const handlePrev = () => {
    if (canGoBack) {
      onPrev?.()
      prevStep()
    }
  }

  const getNextButtonText = () => {
    if (isLastStep) {
      return 'Continue to Payment'
    }
    return 'Continue'
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case FORM_STEPS.PERSONAL:
        return 'Personal Information'
      case FORM_STEPS.DEMOGRAPHICS:
        return 'Background & Location'
      case FORM_STEPS.INTERESTS:
        return 'Your Interests'
      default:
        return 'Form Step'
    }
  }

  return (
    <div className="mt-8 pt-6 border-t border-soft-gray">
      {/* Current Step Indicator (Mobile) */}
      <div className="md:hidden mb-6 text-center">
        <p className="text-sm text-text-muted">Step {currentStep + 1} of 3</p>
        <h3 className="text-lg font-medium text-text-primary">{getStepTitle()}</h3>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
        {/* Back Button */}
        <div className="order-2 md:order-1">
          {canGoBack ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary border-2 border-soft-gray rounded-md hover:border-brand-primary hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Previous
            </button>
          ) : (
            <div></div> // Empty div for flex spacing
          )}
        </div>

        {/* Progress & Validation Hint */}
        <div className="order-1 md:order-2 text-center">
          {!isCurrentStepValid() && (
            <p className="text-sm text-text-muted mb-2">
              {currentStep === FORM_STEPS.PERSONAL && 'Please fill in all required fields'}
              {currentStep === FORM_STEPS.DEMOGRAPHICS && 'Please complete your background information'}
              {currentStep === FORM_STEPS.INTERESTS && 'Please select at least one interest'}
            </p>
          )}
        </div>

        {/* Next Button */}
        <div className="order-3">
          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepValid() || isSubmitting}
            className="inline-flex items-center px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-primary to-brand-secondary rounded-md hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {getNextButtonText()}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Additional Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-text-muted">
          Your progress is automatically saved. You can return to complete this application later.
        </p>
      </div>
    </div>
  )
}