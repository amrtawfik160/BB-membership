'use client'

import { useFormStore } from '@/lib/store/form-store'
import { useState } from 'react'

/**
 * Step 1: Personal Information
 * Collects first name, last name, email, date of birth, and optional social links
 */
export default function PersonalInfoStep() {
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
          Tell Us About Yourself
        </h3>
        <p className="text-text-secondary">
          Let&apos;s start with some basic information to get to know you better.
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-text-primary mb-2">
            First Name *
          </label>
          <input
            id="first_name"
            type="text"
            value={formData.first_name}
            onChange={(e) => handleFieldChange('first_name', e.target.value)}
            onBlur={() => handleFieldBlur('first_name')}
            className={`w-full px-4 py-3 rounded-md border transition-all duration-200 ${
              isFieldInvalid('first_name')
                ? 'border-error focus:border-error focus:ring-2 focus:ring-red-100'
                : 'border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
            } bg-white text-text-primary placeholder-text-muted`}
            placeholder="Enter your first name"
            maxLength={100}
          />
          {getFieldError('first_name') && (
            <p className="mt-1 text-sm text-error">{getFieldError('first_name')}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-text-primary mb-2">
            Last Name *
          </label>
          <input
            id="last_name"
            type="text"
            value={formData.last_name}
            onChange={(e) => handleFieldChange('last_name', e.target.value)}
            onBlur={() => handleFieldBlur('last_name')}
            className={`w-full px-4 py-3 rounded-md border transition-all duration-200 ${
              isFieldInvalid('last_name')
                ? 'border-error focus:border-error focus:ring-2 focus:ring-red-100'
                : 'border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
            } bg-white text-text-primary placeholder-text-muted`}
            placeholder="Enter your last name"
            maxLength={100}
          />
          {getFieldError('last_name') && (
            <p className="mt-1 text-sm text-error">{getFieldError('last_name')}</p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          onBlur={() => handleFieldBlur('email')}
          className={`w-full px-4 py-3 rounded-md border transition-all duration-200 ${
            isFieldInvalid('email')
              ? 'border-error focus:border-error focus:ring-2 focus:ring-red-100'
              : 'border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
          } bg-white text-text-primary placeholder-text-muted`}
          placeholder="your@email.com"
          maxLength={255}
        />
        {getFieldError('email') && (
          <p className="mt-1 text-sm text-error">{getFieldError('email')}</p>
        )}
        <p className="mt-1 text-xs text-text-muted">
          We&apos;ll use this to send you important updates about your membership.
        </p>
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-text-primary mb-2">
          Date of Birth *
        </label>
        <input
          id="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
          onBlur={() => handleFieldBlur('date_of_birth')}
          className={`w-full px-4 py-3 rounded-md border transition-all duration-200 ${
            isFieldInvalid('date_of_birth')
              ? 'border-error focus:border-error focus:ring-2 focus:ring-red-100'
              : 'border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light'
          } bg-white text-text-primary`}
          max={new Date().toISOString().split('T')[0]}
        />
        {getFieldError('date_of_birth') && (
          <p className="mt-1 text-sm text-error">{getFieldError('date_of_birth')}</p>
        )}
      </div>

      {/* Optional Social Links */}
      <div className="border-t border-soft-gray pt-6 mt-8">
        <h4 className="text-lg font-medium text-text-primary mb-4">
          Connect With Us (Optional)
        </h4>
        <p className="text-sm text-text-secondary mb-4">
          Help us build a more connected community by sharing your social profiles.
        </p>

        <div className="space-y-4">
          {/* Instagram Handle */}
          <div>
            <label htmlFor="instagram_handle" className="block text-sm font-medium text-text-primary mb-2">
              Instagram Handle
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-text-muted">@</span>
              <input
                id="instagram_handle"
                type="text"
                value={formData.instagram_handle}
                onChange={(e) => handleFieldChange('instagram_handle', e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-md border border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light bg-white text-text-primary placeholder-text-muted transition-all duration-200"
                placeholder="your_handle"
                maxLength={100}
              />
            </div>
          </div>

          {/* LinkedIn URL */}
          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-text-primary mb-2">
              LinkedIn Profile URL
            </label>
            <input
              id="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-soft-gray focus:border-brand-primary focus:ring-2 focus:ring-brand-primary-light bg-white text-text-primary placeholder-text-muted transition-all duration-200"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </div>
    </div>
  )
}