'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Briefcase, Heart, CheckCircle, ArrowRight, Copy, Share2, CreditCard } from 'lucide-react'
import { PaymentSection } from './payment-section'

interface UserCompletionData {
    id: string
    email: string
    referralCode: string
    waitlistPosition: number
    timestamp?: number // For expiration tracking
}

// localStorage key for persistence
const SUBMISSION_STORAGE_KEY = 'bb-waitlist-submission'
const SUBMISSION_EXPIRY_HOURS = 24

// Helper functions for localStorage management
const saveSubmissionToStorage = (data: UserCompletionData) => {
    try {
        const storageData = {
            ...data,
            timestamp: Date.now()
        }
        localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(storageData))
    } catch (error) {
        console.error('Failed to save submission to localStorage:', error)
    }
}

const getSubmissionFromStorage = (): UserCompletionData | null => {
    try {
        const stored = localStorage.getItem(SUBMISSION_STORAGE_KEY)
        if (!stored) return null

        const data = JSON.parse(stored) as UserCompletionData
        
        // Check if data is expired (older than 24 hours)
        const now = Date.now()
        const expiryTime = SUBMISSION_EXPIRY_HOURS * 60 * 60 * 1000 // 24 hours in ms
        
        if (data.timestamp && (now - data.timestamp) > expiryTime) {
            // Data is expired, remove it
            localStorage.removeItem(SUBMISSION_STORAGE_KEY)
            return null
        }

        // Validate required fields
        if (!data.id || !data.email || !data.referralCode || !data.waitlistPosition) {
            localStorage.removeItem(SUBMISSION_STORAGE_KEY)
            return null
        }

        return data
    } catch (error) {
        console.error('Failed to retrieve submission from localStorage:', error)
        localStorage.removeItem(SUBMISSION_STORAGE_KEY)
        return null
    }
}

const clearSubmissionFromStorage = () => {
    try {
        localStorage.removeItem(SUBMISSION_STORAGE_KEY)
    } catch (error) {
        console.error('Failed to clear submission from localStorage:', error)
    }
}

export function WaitlistForm() {
    const searchParams = useSearchParams()
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        instagram: '',
        linkedin: '',
        ageRange: '',
        neighborhood: '',
        occupation: '',
        interests: [] as string[],
        newsletter: false,
        referralCode: '', // Hidden field for referral tracking
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [userCompletionData, setUserCompletionData] = useState<UserCompletionData | null>(null)
    
    // Payment related state
    const [showPayment, setShowPayment] = useState(false)
    const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null)
    const [paymentError, setPaymentError] = useState<string | null>(null)

    // Handle referral code from URL parameters
    useEffect(() => {
        const referralCode = searchParams.get('ref')
        if (referralCode) {
            setFormData(prev => ({
                ...prev,
                referralCode: referralCode
            }))
        }
    }, [searchParams])

    // Restore submission state from localStorage on component mount
    useEffect(() => {
        const storedSubmission = getSubmissionFromStorage()
        if (storedSubmission) {
            setUserCompletionData(storedSubmission)
            setIsSubmitted(true)
        }
    }, [])

    const validateForm = () => {
        const errors: Record<string, string> = {}

        // Required field validation
        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required'
        }
        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required'
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address'
        }
        if (!formData.dateOfBirth) {
            errors.dateOfBirth = 'Date of birth is required'
        } else {
            // Check age (must be 18+)
            const birthDate = new Date(formData.dateOfBirth)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                // Haven't had birthday yet this year
            }
            
            if (age < 18) {
                errors.dateOfBirth = 'You must be at least 18 years old'
            }
        }
        if (!formData.ageRange) {
            errors.ageRange = 'Please select your age range'
        }
        if (!formData.neighborhood) {
            errors.neighborhood = 'Please select your neighborhood'
        }
        if (!formData.occupation.trim()) {
            errors.occupation = 'Please describe your occupation'
        }
        if (formData.interests.length === 0) {
            errors.interests = 'Please select at least one interest'
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handlePaymentSetup = (paymentMethodId: string) => {
        setPaymentMethodId(paymentMethodId)
        setPaymentError(null)
        // Automatically submit form after payment is set up
        setTimeout(() => handleFormSubmission(paymentMethodId), 100)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validate form before showing payment
        if (!validateForm()) {
            return
        }

        // Show payment section if it's not already visible
        if (!showPayment && !paymentMethodId) {
            setShowPayment(true)
            return
        }

        // If payment method is already set, proceed with form submission
        if (paymentMethodId) {
            handleFormSubmission(paymentMethodId)
        }
    }

    const handleFormSubmission = async (paymentMethodId?: string) => {
        setIsSubmitting(true)
        setSubmitError(null)
        setFieldErrors({})

        try {
            // Transform form data to match API schema
            const apiData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                date_of_birth: formData.dateOfBirth,
                instagram_handle: formData.instagram || null,
                linkedin_url: formData.linkedin || null,
                age_range: formData.ageRange,
                neighborhood: formData.neighborhood,
                occupation: formData.occupation,
                interests: formData.interests,
                marketing_opt_in: formData.newsletter,
                referral_code: formData.referralCode || null,
                payment_method_id: paymentMethodId || null,
                user_agent: navigator.userAgent,
                utm_source: searchParams.get('utm_source') || null,
            }

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit form')
            }

            // Store user completion data
            const completionData = {
                id: result.data.user.id,
                email: result.data.user.email,
                referralCode: result.data.user.referralCode,
                waitlistPosition: result.data.user.waitlistPosition,
            }
            
            setUserCompletionData(completionData)
            
            // Save to localStorage for persistence across page refreshes
            saveSubmissionToStorage(completionData)
            
            setIsSubmitted(true)
        } catch (error) {
            console.error('Form submission error:', error)
            
            if (error instanceof Error) {
                // Try to parse API validation errors
                try {
                    const errorResponse = JSON.parse(error.message)
                    if (errorResponse.details && Array.isArray(errorResponse.details)) {
                        // Handle field-specific validation errors from API
                        const apiFieldErrors: Record<string, string> = {}
                        errorResponse.details.forEach((detail: {field: string, message: string}) => {
                            // Map API field names back to form field names
                            const fieldMap: Record<string, string> = {
                                'first_name': 'firstName',
                                'last_name': 'lastName',
                                'date_of_birth': 'dateOfBirth',
                                'instagram_handle': 'instagram',
                                'linkedin_url': 'linkedin',
                                'age_range': 'ageRange',
                            }
                            const formFieldName = fieldMap[detail.field] || detail.field
                            apiFieldErrors[formFieldName] = detail.message
                        })
                        setFieldErrors(apiFieldErrors)
                        setSubmitError('Please fix the errors below and try again.')
                    } else {
                        setSubmitError(errorResponse.error || error.message)
                    }
                } catch {
                    setSubmitError(error.message)
                }
            } else {
                setSubmitError('An unexpected error occurred')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleInterestChange = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest],
        }))
    }

    const handleCopyReferralLink = async () => {
        if (!userCompletionData) return
        
        const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${userCompletionData.referralCode}`
        
        try {
            await navigator.clipboard.writeText(referralUrl)
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    const handleResetForm = () => {
        // Clear localStorage and reset all states
        clearSubmissionFromStorage()
        setIsSubmitted(false)
        setUserCompletionData(null)
        setSubmitError(null)
        setFieldErrors({})
        
        // Reset payment states
        setShowPayment(false)
        setPaymentMethodId(null)
        setPaymentError(null)
        
        // Reset form data (but keep referral code from URL if present)
        const referralCode = searchParams.get('ref') || ''
        setFormData({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: '',
            instagram: '',
            linkedin: '',
            ageRange: '',
            neighborhood: '',
            occupation: '',
            interests: [],
            newsletter: false,
            referralCode: referralCode,
        })
    }

    const handleSocialShare = (platform: 'instagram' | 'whatsapp' | 'email') => {
        if (!userCompletionData) return
        
        const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${userCompletionData.referralCode}`
        const message = `I just joined the BB Membership waitlist! Join me and let's build something amazing together 🌟`
        
        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + referralUrl)}`)
                break
            case 'email':
                window.open(`mailto:?subject=${encodeURIComponent('Join me on the BB Membership waitlist!')}&body=${encodeURIComponent(message + '\n\n' + referralUrl)}`)
                break
            case 'instagram':
                // Instagram doesn't have direct sharing, so copy to clipboard
                handleCopyReferralLink()
                break
        }
    }

    if (isSubmitted && userCompletionData) {
        return (
            <section className="py-12 px-4" style={{ backgroundColor: 'var(--pearl)' }}>
                <div className="max-w-lg mx-auto text-center">
                    <div className="bg-white p-8 rounded-xl border border-stone-200">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        
                        <h2 className="text-2xl font-serif font-medium text-stone-800 mb-3">You&apos;re on the list!</h2>
                        
                        <div className="bg-pink-50 p-4 rounded-lg mb-4">
                            <p className="text-lg font-semibold text-[var(--color-primary-600)] mb-1">
                                Waitlist Position #{userCompletionData.waitlistPosition}
                            </p>
                            <p className="text-sm text-stone-600">Welcome to the BB community!</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-serif font-medium text-stone-800 mb-3">Share & Move Up</h3>
                            <p className="text-sm text-stone-600 mb-3">
                                Use your referral code to invite friends and improve your position:
                            </p>
                            
                            <div className="bg-gray-50 p-3 rounded-lg mb-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[var(--color-primary-600)] font-bold text-lg">
                                        {userCompletionData.referralCode}
                                    </span>
                                    <Button
                                        onClick={handleCopyReferralLink}
                                        variant="outline"
                                        size="sm"
                                        className="ml-2"
                                    >
                                        <Copy className="w-4 h-4 mr-1" />
                                        Copy Link
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-center">
                                <Button
                                    onClick={() => handleSocialShare('whatsapp')}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Share2 className="w-4 h-4" />
                                    WhatsApp
                                </Button>
                                <Button
                                    onClick={() => handleSocialShare('email')}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Email
                                </Button>
                                <Button
                                    onClick={() => handleSocialShare('instagram')}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Instagram
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs text-stone-500 font-light mb-3">
                                Check your email for confirmation and follow us on social for updates.
                            </p>
                            <Button
                                onClick={handleResetForm}
                                variant="outline"
                                size="sm"
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                Submit Another Entry
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 px-4" style={{ backgroundColor: 'var(--pearl)' }}>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-light text-neutral-800 mb-5 tracking-wide leading-tight">
                        Let&apos;s get to <span className="text-[var(--color-primary-500)]">know you</span>
                    </h2>
                    <p className="text-lg text-neutral-600 mb-3 max-w-xl mx-auto font-light">Apply now to join the BB Membership waitlist.</p>
                    <p className="text-base text-neutral-500 mb-4 max-w-lg mx-auto font-light">(No commitment. 3-month minimum if accepted.)</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Submission Error
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{submitError}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                            <div className="w-6 h-6 bg-[var(--color-primary-100)] rounded-md flex items-center justify-center">
                                <User className="w-3 h-3 text-[var(--color-primary-600)]" />
                            </div>
                            <h3 className="text-base font-serif font-medium text-neutral-900">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="firstName" className="text-xs font-medium text-neutral-700">
                                    First Name <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className={`border rounded-md py-2 px-3 text-sm focus:ring-1 ${
                                        fieldErrors.firstName 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                            : 'border-neutral-200 focus:border-[var(--color-primary-500)] focus:ring-pink-100'
                                    }`}
                                    placeholder="First name"
                                />
                                {fieldErrors.firstName && (
                                    <p className="text-xs text-red-600">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="lastName" className="text-xs font-medium text-neutral-700">
                                    Last Name <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className={`border rounded-md py-2 px-3 text-sm focus:ring-1 ${
                                        fieldErrors.lastName 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                            : 'border-neutral-200 focus:border-[var(--color-primary-500)] focus:ring-pink-100'
                                    }`}
                                    placeholder="Last name"
                                />
                                {fieldErrors.lastName && (
                                    <p className="text-xs text-red-600">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-xs font-medium text-neutral-700">
                                    Email <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`border rounded-md py-2 px-3 text-sm focus:ring-1 ${
                                        fieldErrors.email 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                            : 'border-neutral-200 focus:border-[var(--color-primary-500)] focus:ring-pink-100'
                                    }`}
                                    placeholder="your.email@example.com"
                                />
                                {fieldErrors.email && (
                                    <p className="text-xs text-red-600">{fieldErrors.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="dateOfBirth" className="text-xs font-medium text-neutral-700">
                                    Date of Birth <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                    className={`border rounded-md py-2 px-3 text-sm focus:ring-1 ${
                                        fieldErrors.dateOfBirth 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                            : 'border-neutral-200 focus:border-[var(--color-primary-500)] focus:ring-pink-100'
                                    }`}
                                />
                                {fieldErrors.dateOfBirth && (
                                    <p className="text-xs text-red-600">{fieldErrors.dateOfBirth}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="ageRange" className="text-xs font-medium text-neutral-700">
                                    Age Range <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Select value={formData.ageRange} onValueChange={value => handleSelectChange('ageRange', value)}>
                                    <SelectTrigger className={`rounded-md w-full py-2 px-3 text-sm focus:ring-1 h-9 ${
                                        fieldErrors.ageRange 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                            : 'border-stone-200 focus:border-rose-500 focus:ring-rose-100'
                                    }`}>
                                        <SelectValue placeholder="Select age" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="20s">20s</SelectItem>
                                        <SelectItem value="30s">30s</SelectItem>
                                        <SelectItem value="40s">40s</SelectItem>
                                        <SelectItem value="50s">50s</SelectItem>
                                        <SelectItem value="60s+">60s+</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldErrors.ageRange && (
                                    <p className="text-xs text-red-600">{fieldErrors.ageRange}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="neighborhood" className="text-xs font-medium text-neutral-700">
                                    Neighborhood <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Select value={formData.neighborhood} onValueChange={value => handleSelectChange('neighborhood', value)}>
                                    <SelectTrigger className={`rounded-md w-full py-2 px-3 text-sm focus:ring-1 h-9 ${
                                        fieldErrors.neighborhood 
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                            : 'border-stone-200 focus:border-rose-500 focus:ring-rose-100'
                                    }`}>
                                        <SelectValue placeholder="Select area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Brickell">Brickell</SelectItem>
                                        <SelectItem value="Coconut Grove">Coconut Grove</SelectItem>
                                        <SelectItem value="Coral Gables">Coral Gables</SelectItem>
                                        <SelectItem value="Edgewater or Midtown">Edgewater or Midtown</SelectItem>
                                        <SelectItem value="South Beach">South Beach</SelectItem>
                                        <SelectItem value="Sunset Harbor">Sunset Harbor</SelectItem>
                                        <SelectItem value="Miami Beach">Miami Beach</SelectItem>
                                        <SelectItem value="Fort Lauderdale">Fort Lauderdale</SelectItem>
                                        <SelectItem value="Boca Raton">Boca Raton</SelectItem>
                                        <SelectItem value="Palm Beach">Palm Beach</SelectItem>
                                        <SelectItem value="Other (please list)">Other (please list)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldErrors.neighborhood && (
                                    <p className="text-xs text-red-600">{fieldErrors.neighborhood}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[var(--color-primary-100)]">
                                <Briefcase className="w-3 h-3 text-[var(--color-primary-600)]" />
                            </div>
                            <h3 className="text-base font-serif font-medium text-neutral-900">Professional & Social</h3>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="occupation" className="text-xs font-medium text-neutral-700">
                                Occupation / Industry <span className="text-[var(--color-primary-500)]">*</span>
                            </Label>
                            <textarea
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Your professional background..."
                                className={`w-full px-3 py-2 border bg-input/30 rounded-md text-sm focus:ring-1 resize-none ${
                                    fieldErrors.occupation 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                        : 'border-neutral-200 focus:border-[var(--color-primary-500)] focus:ring-pink-100'
                                }`}
                            />
                            {fieldErrors.occupation && (
                                <p className="text-xs text-red-600">{fieldErrors.occupation}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="instagram" className="text-xs font-medium text-neutral-700">
                                    Instagram Handle
                                </Label>
                                <Input
                                    id="instagram"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="@yourusername"
                                    className="border-neutral-200 rounded-md py-2 px-3 text-sm focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-pink-100"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="linkedin" className="text-xs font-medium text-neutral-700">
                                    LinkedIn Link
                                </Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="linkedin.com/in/yourname"
                                    className="border-neutral-200 rounded-md py-2 px-3 text-sm focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-pink-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                            <div className="w-6 h-6 bg-[var(--color-primary-100)] rounded-md flex items-center justify-center">
                                <Heart className="w-3 h-3 text-[var(--color-primary-600)]" />
                            </div>
                            <h3 className="text-base font-serif font-medium text-neutral-900">What are you most excited about?</h3>
                        </div>

                        <div className="space-y-2">
                            {['Social Events & Fitness', 'Networking & Mentorship', 'Business & Finance Talks', 'Member Perks & Discounts'].map(
                                interest => (
                                    <label
                                        key={interest}
                                        className={`flex items-center p-2 rounded-md border cursor-pointer transition-all duration-200 ${
                                            formData.interests.includes(interest)
                                                ? 'border-[var(--color-primary-500)] bg-pink-50'
                                                : 'border-neutral-200 hover:border-[var(--color-primary-300)]'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.interests.includes(interest)}
                                            onChange={() => handleInterestChange(interest)}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                                                formData.interests.includes(interest)
                                                    ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)]'
                                                    : 'border-gray-300'
                                            }`}
                                        >
                                            {formData.interests.includes(interest) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className="text-sm font-medium text-neutral-700">{interest}</span>
                                    </label>
                                )
                            )}
                            {fieldErrors.interests && (
                                <p className="text-xs text-red-600 mt-2">{fieldErrors.interests}</p>
                            )}
                        </div>
                    </div>

                    <PaymentSection
                        isVisible={showPayment}
                        onPaymentSetup={handlePaymentSetup}
                        isProcessing={isSubmitting}
                        error={paymentError}
                    />

                    <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-md">
                        <input
                            id="newsletter"
                            name="newsletter"
                            type="checkbox"
                            checked={formData.newsletter}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 text-[var(--color-primary-600)] border-gray-300 rounded focus:ring-[var(--color-primary-500)]"
                        />
                        <div>
                            <Label htmlFor="newsletter" className="text-sm font-medium text-neutral-700 cursor-pointer">
                                Keep me in the loop about events and early access.
                            </Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white py-3 text-base font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {paymentMethodId ? 'Submitting Application...' : 'Processing...'}
                            </>
                        ) : showPayment && !paymentMethodId ? (
                            <>
                                <CreditCard className="w-4 h-4" />
                                Continue to Payment
                            </>
                        ) : (
                            <>
                                {paymentMethodId ? 'Complete Application' : 'Join the Waitlist'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </section>
    )
}
