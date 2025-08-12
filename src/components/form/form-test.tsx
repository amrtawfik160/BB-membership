'use client'

import { useFormStore, FORM_STEPS } from '@/lib/store/form-store'

/**
 * Form Testing Component
 * Provides quick test functionality for form validation
 */
export default function FormTest() {
  const { 
    updateField, 
    goToStep, 
    resetForm, 
    validateCurrentStep,
    currentStep,
    formData,
    validation 
  } = useFormStore()

  const fillTestData = () => {
    // Fill Step 1
    updateField('first_name', 'Sarah')
    updateField('last_name', 'Johnson')
    updateField('email', 'sarah@example.com')
    updateField('date_of_birth', '1990-05-15')
    updateField('instagram_handle', 'sarah_j')
    updateField('linkedin_url', 'https://linkedin.com/in/sarahjohnson')
    
    // Fill Step 2
    updateField('age_range', '30s')
    updateField('neighborhood', 'Brickell')
    updateField('occupation', 'Marketing Director at Tech Startup')
    
    // Fill Step 3
    updateField('interests', ['Networking & Mentorship', 'Business & Finance Talks'])
    updateField('marketing_opt_in', true)
  }

  const testValidation = () => {
    console.log('=== Form Validation Test ===')
    console.log('Current Step:', currentStep)
    console.log('Form Data:', formData)
    console.log('Validation Status:', validation)
    console.log('Current Step Valid:', validateCurrentStep())
    console.log('=== End Test ===')
  }

  return (
    <div className="fixed bottom-4 left-4 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold text-sm mb-3 text-gray-800">Form Test Panel</h3>
      
      <div className="space-y-2 text-xs">
        <button
          onClick={fillTestData}
          className="w-full px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          Fill Test Data
        </button>
        
        <button
          onClick={testValidation}
          className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Test Validation (Console)
        </button>
        
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => goToStep(FORM_STEPS.PERSONAL)}
            className={`px-2 py-1 rounded text-xs ${
              currentStep === FORM_STEPS.PERSONAL
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Step 1
          </button>
          <button
            onClick={() => goToStep(FORM_STEPS.DEMOGRAPHICS)}
            className={`px-2 py-1 rounded text-xs ${
              currentStep === FORM_STEPS.DEMOGRAPHICS
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Step 2
          </button>
          <button
            onClick={() => goToStep(FORM_STEPS.INTERESTS)}
            className={`px-2 py-1 rounded text-xs ${
              currentStep === FORM_STEPS.INTERESTS
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Step 3
          </button>
        </div>
        
        <button
          onClick={resetForm}
          className="w-full px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Reset Form
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs space-y-1">
          <div>Step: {currentStep + 1}/3</div>
          <div>Valid: {validation[`step${currentStep + 1}` as keyof typeof validation] ? '✅' : '❌'}</div>
          <div>Errors: {Object.keys(validation.errors).length}</div>
        </div>
      </div>
    </div>
  )
}

// Conditional rendering for development
export function ConditionalFormTest() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return <FormTest />
}