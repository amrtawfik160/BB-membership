import { Button } from '@/components/ui/button'
import { BenefitCard } from './benefit-card'
import { FeatureCard } from './feature-card'
import { benefitsData, featuresData } from './benefits-data'
import Link from 'next/link'

export function Benefits() {
    return (
        <section className="py-24 px-4 bg-neutral-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-neutral-800 mb-8 tracking-tight leading-tight">
                        This isn&apos;t just a membership.
                        <span className="block text-[var(--color-primary-400)]">It&apos;s your advantage.</span>
                    </h2>
                    <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed mb-12">
                        The Brickell Babes is the ultimate platform for ambitious, socially curious women who want it all: community, opportunity, and
                        connection.
                    </p>
                    <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                        Whether you&apos;re launching your brand, changing careers, or simply looking to level up your circle, this is where high-vibe
                        friendships and strategic networking meet.
                    </p>
                </div>

                {/* Benefits Cards Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {benefitsData.map((benefit, index) => (
                        <BenefitCard
                            key={index}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            tagline={benefit.tagline}
                        />
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-neutral-800 p-16 rounded-3xl relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h3 className="text-4xl md:text-5xl font-serif font-bold text-neutral-100 mb-6 leading-tight tracking-tight">
                            Level up your network
                        </h3>
                        <p className="text-xl text-neutral-300 mb-10">We&apos;re not just brunch and beach days. BB is your unfair advantage.</p>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            {featuresData.map((feature, index) => (
                                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                            ))}
                        </div>

                        {/* CTA Button */}
                        <Link href="/benefits">
                            <Button size="xl" className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]">
                                Explore Member Benefits
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
