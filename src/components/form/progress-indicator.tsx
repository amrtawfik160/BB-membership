'use client'

import { useFormStore, FORM_STEPS } from '@/lib/store/form-store'

/**
 * Progress Indicator Component
 * Shows current step progress with visual indicators
 */
export default function ProgressIndicator() {
  const { currentStep, validation } = useFormStore()
  
  // Don't show progress indicator on confirmation step
  if (currentStep === FORM_STEPS.CONFIRMATION) {
    return null
  }

  const steps = [
    {
      id: FORM_STEPS.PERSONAL,
      title: 'Personal',
      description: 'Basic information',
      isValid: validation.step1
    },
    {
      id: FORM_STEPS.DEMOGRAPHICS,
      title: 'Background', 
      description: 'Location & career',
      isValid: validation.step2
    },
    {
      id: FORM_STEPS.INTERESTS,
      title: 'Interests',
      description: 'What excites you',
      isValid: validation.step3
    },
    {
      id: FORM_STEPS.PAYMENT,
      title: 'Payment',
      description: 'Secure your spot',
      isValid: validation.step4
    }
  ]

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'upcoming'
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="w-full h-2 bg-soft-gray rounded-full">
          <div 
            className="h-2 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step Progress Text */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-text-muted">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs text-text-muted">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center relative flex-1">
              {/* Step Circle */}
              <div className="relative z-10 flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : status === 'current'
                      ? 'bg-white border-brand-primary text-brand-primary ring-4 ring-brand-primary-light'
                      : 'bg-white border-soft-gray text-text-muted'
                  }`}
                >
                  {status === 'completed' ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{step.id + 1}</span>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 h-0.5 bg-soft-gray mx-4">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      status === 'completed' ? 'bg-brand-primary' : 'bg-soft-gray'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Step Labels */}
      <div className="flex items-start justify-between mt-4">
        {steps.map((step) => {
          const status = getStepStatus(step.id)
          
          return (
            <div 
              key={step.id}
              className="flex flex-col items-center text-center max-w-[80px] md:max-w-[120px]"
            >
              <h4 
                className={`text-sm font-medium mb-1 ${
                  status === 'current'
                    ? 'text-brand-primary'
                    : status === 'completed'
                    ? 'text-text-primary'
                    : 'text-text-muted'
                }`}
              >
                {step.title}
              </h4>
              <p 
                className={`text-xs ${
                  status === 'current' || status === 'completed'
                    ? 'text-text-secondary'
                    : 'text-text-muted'
                }`}
              >
                {step.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Mobile Progress Text */}
      <div className="md:hidden mt-6 text-center">
        <div 
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            currentStep === FORM_STEPS.PERSONAL
              ? 'bg-brand-primary-light text-brand-primary'
              : currentStep === FORM_STEPS.DEMOGRAPHICS
              ? 'bg-brand-secondary-light text-brand-secondary'
              : currentStep === FORM_STEPS.INTERESTS
              ? 'bg-purple-100 text-purple-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {currentStep === FORM_STEPS.PERSONAL && '📝 Getting to know you'}
          {currentStep === FORM_STEPS.DEMOGRAPHICS && '🏡 Learning about your life'}
          {currentStep === FORM_STEPS.INTERESTS && '✨ Discovering your interests'}
          {currentStep === FORM_STEPS.PAYMENT && '💳 Securing your spot'}
        </div>
      </div>
    </div>
  )
}