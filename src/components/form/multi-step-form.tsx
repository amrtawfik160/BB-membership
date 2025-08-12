'use client'

import { useFormStore, FORM_STEPS } from '@/lib/store/form-store'
import { useState, useEffect } from 'react'

// Import form steps
import PersonalInfoStep from './steps/personal-info-step'
import DemographicsStep from './steps/demographics-step'
import InterestsStep from './steps/interests-step'
import PaymentStep from './steps/payment-step'
import ConfirmationStep from './steps/confirmation-step'

// Import form components
import ProgressIndicator from './progress-indicator'
import FormNavigation from './form-navigation'

/**
 * Multi-Step Form Container
 * Manages the complete form flow from personal info through interests
 */
export default function MultiStepForm() {
  const { currentStep, goToStep } = useFormStore()
  const [isVisible, setIsVisible] = useState(false)

  // Animate form in on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleFormComplete = () => {
    // This is called when the form is complete
    // For payment step, the submission is handled within the payment component
    console.log('Form step completed')
  }

  const handleStepChange = () => {
    // Smooth scroll to top of form when step changes
    document.getElementById('multi-step-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case FORM_STEPS.PERSONAL:
        return <PersonalInfoStep />
      case FORM_STEPS.DEMOGRAPHICS:
        return <DemographicsStep />
      case FORM_STEPS.INTERESTS:
        return <InterestsStep />
      case FORM_STEPS.PAYMENT:
        return <PaymentStep />
      case FORM_STEPS.CONFIRMATION:
        return <ConfirmationStep />
      default:
        return <PersonalInfoStep />
    }
  }

  return (
    <div 
      id="multi-step-form"
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Enhanced form container with new styling */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border" style={{ borderColor: 'var(--border-light)' }}>
        {/* Enhanced progress indicator */}
        <ProgressIndicator />
        
        {/* Form content */}
        <div className="mt-12">
          <div className="transition-all duration-300 ease-in-out">
            {renderCurrentStep()}
          </div>
          
          {/* Enhanced navigation */}
          {currentStep !== FORM_STEPS.PAYMENT && currentStep !== FORM_STEPS.CONFIRMATION && (
            <FormNavigation 
              onNext={handleFormComplete}
              onPrev={handleStepChange}
            />
          )}
        </div>
      </div>

      {/* Enhanced privacy notice */}
      <div className="text-center mt-8">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          🔒 Your information is secure and encrypted. We respect your privacy.
        </p>
      </div>
    </div>
  )
}

/**
 * Form Section Wrapper
 * Provides context and styling for the form section
 */
export function MultiStepFormSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="form-section" style={{ background: 'var(--background)' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-30" style={{ background: 'var(--sage-green)' }}></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'var(--peach)' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Enhanced section header */}
        <div className="text-center mb-20 space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            LET&apos;S GET TO KNOW YOU
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Apply now to join the BB Membership waitlist.
            </p>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
              ✨ No commitment. 3-month minimum if accepted.
            </p>
          </div>
        </div>

        {/* Enhanced form container */}
        <div className="max-w-3xl mx-auto">
          <MultiStepForm />
        </div>
      </div>
    </section>
  )
}