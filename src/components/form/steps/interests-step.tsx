'use client'

import { useFormStore, INTEREST_OPTIONS } from '@/lib/store/form-store'
import { useState } from 'react'

/**
 * Step 3: Interests & Preferences
 * Collects user interests and marketing preferences
 */
export default function InterestsStep() {
  const { formData, updateField, validation } = useFormStore()
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests || []
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest]
    
    updateField('interests', newInterests)
    setTouchedFields(prev => new Set([...prev, 'interests']))
  }

  const handleMarketingOptIn = (value: boolean) => {
    updateField('marketing_opt_in', value)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-text-primary mb-2 font-heading">
          What Excites You Most?
        </h3>
        <p className="text-text-secondary">
          Select all the experiences that resonate with you. This helps us curate the perfect membership experience.
        </p>
      </div>

      {/* Interest Selection */}
      <div>
        <fieldset 
          onBlur={() => handleFieldBlur('interests')}
          className={isFieldInvalid('interests') ? 'ring-2 ring-red-100 rounded-lg' : ''}
        >
          <legend className="text-sm font-medium text-text-primary mb-4">
            Choose Your Interests *
          </legend>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTEREST_OPTIONS.map(interest => {
              const isSelected = (formData.interests || []).includes(interest)
              return (
                <label
                  key={interest}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary-light text-text-primary'
                      : 'border-soft-gray bg-white hover:border-brand-secondary hover:bg-brand-secondary-light text-text-secondary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleInterestToggle(interest)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-soft-gray bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3"
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
                    )}
                  </div>
                  <span className="font-medium">{interest}</span>
                </label>
              )
            })}
          </div>
          
          {getFieldError('interests') && (
            <p className="mt-2 text-sm text-error">{getFieldError('interests')}</p>
          )}
          
          <div className="mt-4 text-xs text-text-muted">
            Selected: {(formData.interests || []).length} of {INTEREST_OPTIONS.length} options
          </div>
        </fieldset>
      </div>

      {/* Selected Interests Preview */}
      {(formData.interests || []).length > 0 && (
        <div className="bg-brand-secondary-light p-6 rounded-lg">
          <h4 className="font-medium text-text-primary mb-3">
            Your BB Membership Experience Will Include:
          </h4>
          <div className="space-y-2">
            {(formData.interests || []).map(interest => (
              <div key={interest} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                <span className="text-sm text-text-primary">{interest}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marketing Opt-in */}
      <div className="border-t border-soft-gray pt-6 mt-8">
        <h4 className="text-lg font-medium text-text-primary mb-4">
          Stay Connected
        </h4>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={formData.marketing_opt_in}
                onChange={(e) => handleMarketingOptIn(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  formData.marketing_opt_in
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-soft-gray bg-white'
                }`}
              >
                {formData.marketing_opt_in && (
                  <svg
                    className="w-3 h-3"
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
                )}
              </div>
            </div>
            <div>
              <span className="font-medium text-text-primary">
                Yes, keep me updated about BB Membership!
              </span>
              <p className="text-sm text-text-secondary mt-1">
                Receive exclusive updates about upcoming events, new member spotlights, 
                and community highlights. You can unsubscribe at any time.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Community Preview */}
      <div className="bg-gradient-to-r from-brand-primary-light to-brand-secondary-light p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">✨</div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">
              You're Almost Part of Something Amazing
            </h4>
            <p className="text-sm text-text-secondary">
              Based on your interests, you'll be connected with like-minded women who share your 
              passions for personal growth, professional development, and building meaningful 
              relationships in Miami's vibrant community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}