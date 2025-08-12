'use client'

import Silk from '@Silk/Silk'
import { PointerHighlight } from '@/components/ui/pointer-highlight'
import { Button } from '@/components/ui/button'

/**
 * Hero Section Component for BB Membership Landing Page
 * Clean, minimal design inspired by Soho Beach House
 */
export default function HeroSection() {
    const scrollToForm = () => {
        const formSection = document.getElementById('form-section')
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Silk Background */}
            <div className="absolute inset-0">
                <Silk color="#c8b58d" />
            </div>

            {/* Background overlay for text readability */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
                <div className="space-y-12">
                    {/* Main Headline - Large and impactful */}
                    <div className="space-y-8">
                        <h1 className="flex items-center !text-white flex-col !font-bold text-6xl md:text-8xl lg:text-9xl leading-none text-center max-w-6xl mx-auto tracking-tight">
                            BUILD YOUR
                            <br />
                            <PointerHighlight rectangleClassName="bg-white/10 border-white/20" pointerClassName="text-[var(--cream)]">
                                <span className="relative z-10">BEST LIFE</span>
                            </PointerHighlight>
                        </h1>
                    </div>

                    {/* Subheading with enhanced styling */}
                    <div className="space-y-7 max-w-5xl mx-auto pt-5 text-white/80">
                        <p className="text-2xl md:text-3xl font-medium leading-tight text-center">
                            Through curated events, career connections, and powerful community.
                        </p>
                        <p className="text-xl md:text-2xl font-medium leading-tight text-center">Your new circle starts here.</p>
                    </div>

                    {/* Enhanced CTA Section */}
                    <div className="pt-10">
                        <Button onClick={scrollToForm} className="text-xl font-bold px-12 py-5" size="xl" variant={'secondary'}>
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
