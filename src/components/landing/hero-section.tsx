'use client'

import { Button } from '@/components/ui/button'
import { PointerHighlight } from '@/components/ui/pointer-highlight'

/**
 * Hero Section Component for BB Membership Landing Page
 * Clean, minimal design inspired by Soho Beach House
 */
export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/images/background.png)',
                }}
            ></div>

            {/* Background overlay for text readability */}
            <div className="absolute inset-0 bg-black/60 "></div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center -mt-12">
                <div>
                    {/* Main Headline - Large and impactful */}
                    <div className="space-y-8">
                        <h1 className="flex items-center !text-white flex-col !font-bold text-6xl md:text-[7rem] leading-none text-center max-w-6xl mx-auto tracking-tight">
                            Build Your
                            <br />
                            <PointerHighlight rectangleClassName="bg-white/10 !border-white/20" pointerClassName="text-[var(--color-primary-400)]">
                                <span className="relative text-[var(--color-primary-400)] z-10">Best Life</span>
                            </PointerHighlight>
                        </h1>
                    </div>

                    {/* Subheading with enhanced styling */}
                    <div className="space-y-5 max-w-5xl mx-auto text-white/90 mt-11">
                        <p className="text-2xl leading-tight text-center">Through curated events, career connections, and powerful community.</p>
                        <p className="text-2xl leading-tight text-center">Your new circle starts here.</p>
                    </div>

                    <div className="mt-14">
                        <Button
                            size="lg"
                            className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] px-10 py-4 text-lg font-semibold rounded-xl"
                            onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Join the Waitlist
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex flex-col items-center space-y-2">
                    <p className="text-white/80 text-sm font-medium tracking-wider">SCROLL</p>
                    <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    )
}
