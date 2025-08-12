import { FormData } from '../store/form-store'

/**
 * Form validation utilities for the BB Membership waitlist
 */

// Email validation with common patterns
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  // Check for common typos
  const domain = email.split('@')[1]?.toLowerCase()
  
  // Suggest corrections for common typos
  if (domain) {
    const suggestions = {
      'gmail.co': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com'
    }
    
    if (suggestions[domain as keyof typeof suggestions]) {
      return { 
        isValid: false, 
        error: `Did you mean ${email.split('@')[0]}@${suggestions[domain as keyof typeof suggestions]}?` 
      }
    }
  }

  return { isValid: true }
}

// Name validation
export const validateName = (name: string, fieldName: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` }
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` }
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` }
  }

  return { isValid: true }
}

// Date of birth validation
export const validateDateOfBirth = (dob: string): { isValid: boolean; error?: string } => {
  if (!dob) {
    return { isValid: false, error: 'Date of birth is required' }
  }

  const birthDate = new Date(dob)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    // age--;
  }

  if (birthDate >= today) {
    return { isValid: false, error: 'Date of birth must be in the past' }
  }

  if (age < 18) {
    return { isValid: false, error: 'You must be at least 18 years old to join' }
  }

  if (age > 100) {
    return { isValid: false, error: 'Please enter a valid date of birth' }
  }

  return { isValid: true }
}

// Social media handle validation
export const validateInstagramHandle = (handle: string): { isValid: boolean; error?: string } => {
  if (!handle) {
    return { isValid: true } // Optional field
  }

  // Remove @ if user included it
  const cleanHandle = handle.replace(/^@/, '')
  
  // Instagram handle validation
  const instagramRegex = /^[a-zA-Z0-9._]+$/
  if (!instagramRegex.test(cleanHandle)) {
    return { isValid: false, error: 'Instagram handle can only contain letters, numbers, dots, and underscores' }
  }

  if (cleanHandle.length < 1 || cleanHandle.length > 30) {
    return { isValid: false, error: 'Instagram handle must be 1-30 characters long' }
  }

  return { isValid: true }
}

// LinkedIn URL validation
export const validateLinkedInUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: true } // Optional field
  }

  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/
  if (!linkedinRegex.test(url)) {
    return { isValid: false, error: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)' }
  }

  return { isValid: true }
}

// Occupation validation
export const validateOccupation = (occupation: string): { isValid: boolean; error?: string } => {
  if (!occupation || occupation.trim().length < 2) {
    return { isValid: false, error: 'Please describe your occupation' }
  }

  if (occupation.trim().length > 100) {
    return { isValid: false, error: 'Occupation description must be less than 100 characters' }
  }

  return { isValid: true }
}

// Referral code validation
export const validateReferralCode = (code: string): { isValid: boolean; error?: string } => {
  if (!code) {
    return { isValid: true } // Optional field
  }

  const referralRegex = /^[A-Z]{1,4}2024\d*$/
  if (!referralRegex.test(code.toUpperCase())) {
    return { isValid: false, error: 'Invalid referral code format' }
  }

  return { isValid: true }
}

// Comprehensive form validation by step
export const validateFormStep = (formData: FormData, step: number): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  switch (step) {
    case 0: // Personal Information
      const firstNameValidation = validateName(formData.first_name, 'First name')
      if (!firstNameValidation.isValid) {
        errors.first_name = firstNameValidation.error!
      }

      const lastNameValidation = validateName(formData.last_name, 'Last name')
      if (!lastNameValidation.isValid) {
        errors.last_name = lastNameValidation.error!
      }

      const emailValidation = validateEmail(formData.email)
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error!
      }

      const dobValidation = validateDateOfBirth(formData.date_of_birth)
      if (!dobValidation.isValid) {
        errors.date_of_birth = dobValidation.error!
      }

      const instagramValidation = validateInstagramHandle(formData.instagram_handle)
      if (!instagramValidation.isValid) {
        errors.instagram_handle = instagramValidation.error!
      }

      const linkedinValidation = validateLinkedInUrl(formData.linkedin_url)
      if (!linkedinValidation.isValid) {
        errors.linkedin_url = linkedinValidation.error!
      }
      break

    case 1: // Demographics
      if (!formData.age_range) {
        errors.age_range = 'Please select your age range'
      }

      if (!formData.neighborhood) {
        errors.neighborhood = 'Please select your neighborhood'
      }

      const occupationValidation = validateOccupation(formData.occupation)
      if (!occupationValidation.isValid) {
        errors.occupation = occupationValidation.error!
      }
      break

    case 2: // Interests
      if (formData.interests.length === 0) {
        errors.interests = 'Please select at least one interest'
      }
      break

    case 3: // Payment
      const referralValidation = validateReferralCode(formData.referral_code)
      if (!referralValidation.isValid) {
        errors.referral_code = referralValidation.error!
      }
      break
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Form data transformation utilities
export const sanitizeFormData = (formData: FormData): FormData => {
  return {
    ...formData,
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    email: formData.email.toLowerCase().trim(),
    instagram_handle: formData.instagram_handle.replace(/^@/, '').trim(),
    linkedin_url: formData.linkedin_url.trim(),
    occupation: formData.occupation.trim(),
    referral_code: formData.referral_code.toUpperCase().trim()
  }
}

// Generate suggested referral code from name
export const generateSuggestedReferralCode = (firstName: string, lastName: string): string => {
  const cleanFirst = firstName.replace(/[^a-zA-Z]/g, '').toUpperCase()
  const cleanLast = lastName.replace(/[^a-zA-Z]/g, '').toUpperCase()
  
  // Try different combinations
  const combinations = [
    cleanFirst.slice(0, 4) + '2024',
    cleanFirst.slice(0, 3) + cleanLast.slice(0, 1) + '2024',
    cleanFirst.slice(0, 2) + cleanLast.slice(0, 2) + '2024'
  ]

  return combinations[0] || 'USER2024'
}

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// Format form data for API submission
export const formatFormDataForAPI = (formData: FormData) => {
  const sanitized = sanitizeFormData(formData)
  
  return {
    ...sanitized,
    // Ensure arrays are properly formatted
    interests: Array.isArray(sanitized.interests) ? sanitized.interests : [],
    // Remove empty optional fields
    instagram_handle: sanitized.instagram_handle || undefined,
    linkedin_url: sanitized.linkedin_url || undefined,
    referral_code: sanitized.referral_code || undefined,
    // Add calculated fields
    calculated_age: calculateAge(sanitized.date_of_birth)
  }
}

// Progress calculation helpers
export const getStepProgress = (currentStep: number, totalSteps: number): number => {
  return Math.round(((currentStep + 1) / totalSteps) * 100)
}

// User-friendly step names
export const getStepName = (step: number): string => {
  const names = [
    'Personal Information',
    'Location & Background', 
    'Interests & Preferences',
    'Payment Information',
    'Confirmation'
  ]
  return names[step] || 'Unknown Step'
}

// User-friendly step descriptions
export const getStepDescription = (step: number): string => {
  const descriptions = [
    'Tell us about yourself',
    'Where are you based and what do you do?',
    'What are you most excited about?',
    'Secure your spot (no charge today)',
    'Welcome to the BB community!'
  ]
  return descriptions[step] || ''
}