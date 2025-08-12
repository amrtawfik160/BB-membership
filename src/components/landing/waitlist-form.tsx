'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Briefcase, Heart, CheckCircle, ArrowRight } from 'lucide-react'

export function WaitlistForm() {
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
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000))

        console.log('Form submitted:', formData)
        setIsSubmitting(false)
        setIsSubmitted(true)
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

    if (isSubmitted) {
        return (
            <section className="py-12 px-4" style={{ backgroundColor: 'var(--pearl)' }}>
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white p-6 rounded-xl border border-stone-200">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-serif font-medium text-stone-800 mb-2">You&apos;re on the list!</h2>
                        <p className="text-stone-600 text-sm mb-3 font-light">
                            Welcome to the BB community. We&apos;ll be in touch soon with next steps.
                        </p>
                        <p className="text-xs text-stone-500 font-light">Check your email for confirmation and follow us on social for updates.</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 px-4" style={{ backgroundColor: 'var(--pearl)' }}>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl flex items-center justify-center gap-3 md:text-4xl font-serif font-light text-neutral-800 mb-3 tracking-wide leading-tight">
                        Let&apos;s get to
                        <br />
                        <span className="text-[var(--color-primary-500)]">know you</span>
                    </h2>
                    <p className="text-base text-neutral-600 mb-2 max-w-xl mx-auto font-light">Apply now to join the BB Membership waitlist.</p>
                    <p className="text-sm text-neutral-500 mb-4 max-w-lg mx-auto font-light">(No commitment. 3-month minimum if accepted.)</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                            <div className="w-6 h-6 bg-pink-100 rounded-md flex items-center justify-center">
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
                                    className="border-neutral-200 rounded-md py-2 px-3 text-sm focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-pink-100"
                                    placeholder="First name"
                                />
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
                                    className="border-neutral-200 rounded-md py-2 px-3 text-sm focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-pink-100"
                                    placeholder="Last name"
                                />
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
                                    className="border-neutral-200 rounded-md py-2 px-3 text-sm focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-pink-100"
                                    placeholder="your.email@example.com"
                                />
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
                                    className="border-neutral-200 rounded-md py-2 px-3 text-sm focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-pink-100"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="ageRange" className="text-xs font-medium text-neutral-700">
                                    Age Range <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Select value={formData.ageRange} onValueChange={value => handleSelectChange('ageRange', value)}>
                                    <SelectTrigger className="border-stone-200 rounded-md w-full py-2 px-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-100 h-9">
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
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="neighborhood" className="text-xs font-medium text-neutral-700">
                                    Neighborhood <span className="text-[var(--color-primary-500)]">*</span>
                                </Label>
                                <Select value={formData.neighborhood} onValueChange={value => handleSelectChange('neighborhood', value)}>
                                    <SelectTrigger className="border-stone-200 rounded-md w-full py-2 px-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-100 h-9">
                                        <SelectValue placeholder="Select area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Brickell">Brickell</SelectItem>
                                        <SelectItem value="Coconut Grove">Coconut Grove</SelectItem>
                                        <SelectItem value="Coral Gables">Coral Gables</SelectItem>
                                        <SelectItem value="Edgewater or Midtown">Edgewater/Midtown</SelectItem>
                                        <SelectItem value="South Beach">South Beach</SelectItem>
                                        <SelectItem value="Miami Beach">Miami Beach</SelectItem>
                                        <SelectItem value="Fort Lauderdale">Fort Lauderdale</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                            <div className="w-6 h-6 bg-pink-100 rounded-md flex items-center justify-center">
                                <Briefcase className="w-3 h-3 text-[var(--color-primary-600)]" />
                            </div>
                            <h3 className="text-base font-serif font-medium text-neutral-900">Professional & Social</h3>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="occupation" className="text-xs font-medium text-neutral-700">
                                Occupation / Industry
                            </Label>
                            <textarea
                                id="occupation"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Your professional background..."
                                className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-pink-100 resize-none"
                            />
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
                            <div className="w-6 h-6 bg-pink-100 rounded-md flex items-center justify-center">
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
                        </div>
                    </div>

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
                                Submitting Application...
                            </>
                        ) : (
                            <>
                                Join the Waitlist
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </section>
    )
}
