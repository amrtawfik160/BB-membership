'use client'

import HeroSection from './hero-section'
import { Benefits } from './benefits'

/**
 * Main Landing Page Component for BB Membership
 * Combines all static sections in the correct order
 */
export default function LandingPage() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <Benefits />
        </main>
    )
}
