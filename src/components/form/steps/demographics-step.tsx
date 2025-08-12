'use client'

import { useFormStore, AGE_RANGE_OPTIONS, NEIGHBORHOOD_OPTIONS } from '@/lib/store/form-store'
import { useState } from 'react'

/**
 * Step 2: Location & Background
 * Collects age range, neighborhood, and occupation information
 */
export default function DemographicsStep() {
  const { formData, updateField, validation } = useFormStore()
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    updateField(field, value)
    setTouchedFields(prev => new Set([...prev, field]))
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
          Tell Us About Your Life
        </h3>
        <p className="text-text-secondary">
          Help us understand your background so we can create the perfect community fit.
        </p>
      </div>

      {/* Age Range */}
      <div>
        <label htmlFor="age_range" className="block text-sm font-medium text-text-primary mb-2">
          Age Range *
        </label>
        <select
          id="age_range"
          value={formData.age_range}
          onChange={(e) => handleFieldChange('age_range', e.target.value)}
          onBlur={() => handleFieldBlur('age_range')}
          className={`w-full px-4 py-3 rounded-md border transition-all duration-200 ${
            isFieldInvalid('age_range')
              ? 'border-error focus:border-error focus:ring-2 focus:ring-red-100'
              : 'border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
          } bg-white text-text-primary`}
        >
          <option value="">Select your age range</option>
          {AGE_RANGE_OPTIONS.map(range => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        {getFieldError('age_range') && (
          <p className="mt-1 text-sm text-error">{getFieldError('age_range')}</p>
        )}
      </div>

      {/* Neighborhood */}
      <div>
        <label htmlFor="neighborhood" className="block text-sm font-medium text-text-primary mb-2">
          Miami Area *
        </label>
        <select
          id="neighborhood"
          value={formData.neighborhood}
          onChange={(e) => handleFieldChange('neighborhood', e.target.value)}
          onBlur={() => handleFieldBlur('neighborhood')}
          className={`w-full px-4 py-3 rounded-md border transition-all duration-200 ${
            isFieldInvalid('neighborhood')
              ? 'border-error focus:border-error focus:ring-2 focus:ring-red-100'
              : 'border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
          } bg-white text-text-primary`}
        >
          <option value="">Select your area</option>
          {NEIGHBORHOOD_OPTIONS.map(neighborhood => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
        {getFieldError('neighborhood') && (
          <p className="mt-1 text-sm text-error">{getFieldError('neighborhood')}</p>
        )}
        <p className="mt-1 text-xs text-text-muted">
          This helps us plan events and meetups in convenient locations.
        </p>
      </div>

      {/* Occupation */}
      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-text-primary mb-2">
          Occupation/Industry *
        </label>
        <textarea
          id="occupation"
          value={formData.occupation}
          onChange={(e) => handleFieldChange('occupation', e.target.value)}
          onBlur={() => handleFieldBlur('occupation')}
          className={`w-full px-4 py-3 rounded-md border transition-all duration-200 resize-none ${
            isFieldInvalid('occupation')
              ? 'border-error focus:border-error focus:ring-2 focus:ring-red-100'
              : 'border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
          } bg-white text-text-primary placeholder-text-muted`}
          placeholder="e.g., Marketing Director at Tech Startup, Freelance Graphic Designer, Real Estate Agent..."
          rows={3}
          maxLength={500}
        />
        {getFieldError('occupation') && (
          <p className="mt-1 text-sm text-error">{getFieldError('occupation')}</p>
        )}
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-text-muted">
            Share your professional background to connect with like-minded members.
          </p>
          <span className="text-xs text-text-muted">
            {formData.occupation.length}/500
          </span>
        </div>
      </div>

      {/* Career Stage Insight */}
      <div className="bg-brand-primary-light p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-medium text-text-primary mb-2">
              Why We Ask About Your Career
            </h4>
            <p className="text-sm text-text-secondary">
              BB Membership is about building meaningful professional connections. Understanding your 
              career background helps us introduce you to members in complementary industries, 
              potential mentors, and collaboration opportunities that align with your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}