'use client'

import { useFormStore, FORM_STEPS, useFormProgress, useCanGoNext } from '@/lib/store/form-store'
import { useFormUrlSync, useReferralSystem } from '@/lib/hooks/use-form-url-sync'

/**
 * Debug component to test and visualize the form store state
 * This component should only be used in development
 */
export default function FormDebug() {
    const { currentStep, formData, validation, isSubmitting, submitError, nextStep, prevStep, updateField, resetForm, validateCurrentStep } =
        useFormStore()

    const progress = useFormProgress()
    const canGoNext = useCanGoNext()
    const { getCurrentUtmParams } = useFormUrlSync()
    const { generateReferralLink, validateReferralCode } = useReferralSystem()

    const testReferralCode = 'SARA2024'

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Form Store Debug</h3>

            {/* Current State */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Current State</h4>
                <div className="text-sm space-y-1">
                    <div>
                        Step: {currentStep} / {Object.keys(FORM_STEPS).length - 1}
                    </div>
                    <div>Progress: {progress}%</div>
                    <div>Can Go Next: {canGoNext ? '✅' : '❌'}</div>
                    <div>Submitting: {isSubmitting ? '🔄' : '✅'}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-brand-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={prevStep}
                    disabled={currentStep === FORM_STEPS.PERSONAL}
                    className="px-3 py-1 text-xs bg-gray-100 border rounded disabled:opacity-50"
                >
                    ← Prev
                </button>
                <button
                    onClick={nextStep}
                    disabled={!canGoNext || currentStep === FORM_STEPS.CONFIRMATION}
                    className="px-3 py-1 text-xs bg-brand-primary text-white rounded disabled:opacity-50"
                >
                    Next →
                </button>
                <button onClick={() => validateCurrentStep()} className="px-3 py-1 text-xs bg-brand-secondary text-white rounded">
                    Validate
                </button>
            </div>

            {/* Test Data Input */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Test Data</h4>
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={e => updateField('first_name', e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={e => updateField('email', e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded"
                    />
                    <select
                        value={formData.age_range}
                        onChange={e => updateField('age_range', e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded"
                    >
                        <option value="">Select Age Range</option>
                        <option value="20s">20s</option>
                        <option value="30s">30s</option>
                        <option value="40s">40s</option>
                    </select>
                </div>
            </div>

            {/* Validation Status */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Validation</h4>
                <div className="text-xs space-y-1">
                    <div>Step 1: {validation.step1 ? '✅' : '❌'}</div>
                    <div>Step 2: {validation.step2 ? '✅' : '❌'}</div>
                    <div>Step 3: {validation.step3 ? '✅' : '❌'}</div>
                    <div>Step 4: {validation.step4 ? '✅' : '❌'}</div>
                </div>

                {Object.keys(validation.errors).length > 0 && (
                    <div className="mt-2">
                        <div className="font-semibold text-red-600 text-xs">Errors:</div>
                        {Object.entries(validation.errors).map(([field, error]) => (
                            <div key={field} className="text-xs text-red-500">
                                {field}: {error}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Referral System Test */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Referral Test</h4>
                <div className="text-xs space-y-1">
                    <div>Test Code Valid: {validateReferralCode(testReferralCode) ? '✅' : '❌'}</div>
                    <div className="truncate">Referral URL: {generateReferralLink(testReferralCode).slice(-20)}...</div>
                </div>
            </div>

            {/* Form Data Summary */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Form Data</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(
                        {
                            name: `${formData.first_name} ${formData.last_name}`,
                            email: formData.email,
                            age_range: formData.age_range,
                            neighborhood: formData.neighborhood,
                            interests: formData.interests,
                            utm_params: getCurrentUtmParams(),
                        },
                        null,
                        2
                    )}
                </pre>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button onClick={resetForm} className="px-3 py-1 text-xs bg-red-100 text-red-600 border border-red-200 rounded">
                    Reset
                </button>
                <button
                    onClick={() => {
                        updateField('first_name', 'Sarah')
                        updateField('last_name', 'Johnson')
                        updateField('email', 'sarah@test.com')
                        updateField('date_of_birth', '1992-05-15')
                        updateField('age_range', '30s')
                        updateField('neighborhood', 'Brickell')
                        updateField('occupation', 'Marketing Director')
                        updateField('interests', ['Networking & Mentorship'])
                    }}
                    className="px-3 py-1 text-xs bg-green-100 text-green-600 border border-green-200 rounded"
                >
                    Fill Test Data
                </button>
            </div>

            {submitError && <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">Error: {submitError}</div>}
        </div>
    )
}

// Show debug only in development
export function ConditionalFormDebug() {
    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return <FormDebug />
}
