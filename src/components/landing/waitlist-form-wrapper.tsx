'use client'

import { Suspense } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { WaitlistForm } from './waitlist-form'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function WaitlistFormFallback() {
    return (
        <section className="py-12 px-4" style={{ backgroundColor: 'var(--pearl)' }}>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-light text-neutral-800 mb-5 tracking-wide leading-tight">
                        Let&apos;s get to <span className="text-[var(--color-primary-500)]">know you</span>
                    </h2>
                    <p className="text-lg text-neutral-600 mb-3 max-w-xl mx-auto font-light">Loading form...</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-neutral-200">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded mb-3"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function WaitlistFormWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <Suspense fallback={<WaitlistFormFallback />}>
                <WaitlistForm />
            </Suspense>
        </Elements>
    )
}