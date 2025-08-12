'use client'

import HeroSection from './hero-section'
import BenefitsSection from './benefits-section'
import MembershipFeaturesSection from './membership-features-section'
import MembershipTiersSection from './membership-tiers-section'
import MemberReviewsSection from './member-reviews-section'
import FooterSection from './footer-section'
import { MultiStepFormSection } from '@/components/form/multi-step-form'

/**
 * Main Landing Page Component for BB Membership
 * Combines all static sections in the correct order
 */
export default function LandingPage() {
    return (
        <main className="min-h-screen">
            <HeroSection />

            <BenefitsSection />

            {/* <MembershipFeaturesSection />

            <MultiStepFormSection />

            <MembershipTiersSection />

            <MemberReviewsSection />

            <FooterSection /> */}
        </main>
    )
}
