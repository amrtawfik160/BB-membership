import { Button } from '@/components/ui/button'
import { Check, Crown, Gift, Sparkles, Star, Users, Zap } from 'lucide-react'

export function Membership() {
    const tiers = [
        {
            name: 'Basic',
            price: '$38',
            credits: '1',
            description: 'Access to events + platform',
            features: ['Access to events + platform'],
            popular: false,
            icon: Check,
            color: 'bg-neutral-900',
            textColor: 'text-white',
        },
        {
            name: 'Insider',
            price: '$68',
            credits: '3',
            description: 'Most popular choice',
            features: ['Everything in Basic', 'Guest passes'],
            popular: true,
            icon: Star,
            color: 'bg-[var(--color-primary-500)]',
            textColor: 'text-white',
        },
        {
            name: 'Tastemaker',
            price: '$148',
            credits: '7',
            description: 'For the socially connected',
            features: ['Everything in Insider', 'Guest passes'],
            popular: false,
            icon: Sparkles,
            color: 'bg-neutral-900',
            textColor: 'text-white',
        },
        {
            name: 'Founder',
            price: '$298',
            credits: 'Unlimited',
            description: 'Ultimate access',
            features: ['Everything in Tastemaker', 'Curated gift bag with annual contract'],
            popular: false,
            icon: Crown,
            color: 'bg-neutral-900',
            textColor: 'text-white',
        },
    ]

    return (
        <section className="py-24 px-4" style={{ backgroundColor: 'var(--cream)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-serif font-light text-neutral-800 mb-8 tracking-wide">Membership Tiers</h2>
                    <div className="flex items-center justify-center gap-2 text-xl text-neutral-500">
                        <span>3-month minimum commitment required.</span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {tiers.map((tier, index) => {
                        const IconComponent = tier.icon
                        return (
                            <div
                                key={index}
                                className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] h-full ${
                                    tier.popular
                                        ? 'border-[var(--color-primary-500)] bg-white'
                                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                                }`}
                            >
                                {/* Popular Badge */}
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-[var(--color-primary-500)] text-white px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wide">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-col flex-1 text-center">
                                    {/* Icon */}
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 mx-auto ${tier.color}`}>
                                        <IconComponent className={`w-10 h-10 ${tier.popular ? 'text-white' : tier.textColor}`} />
                                    </div>

                                    {/* Tier Name & Description */}
                                    <h3 className="text-2xl font-serif font-medium mb-2 text-neutral-800">{tier.name}</h3>
                                    <p className="text-sm text-neutral-500 mb-6 font-light h-10">{tier.description}</p>

                                    {/* Pricing */}
                                    <div className="mb-6">
                                        <span className="text-5xl font-serif font-light text-neutral-800">{tier.price}</span>
                                        <span className="text-lg text-neutral-500 font-light">/month</span>
                                    </div>

                                    {/* Credits */}
                                    <div className="mb-8 p-4 rounded-2xl" style={{ backgroundColor: 'var(--pearl)' }}>
                                        <div className="flex items-center justify-center gap-2">
                                            <Zap className="w-5 h-5 text-[var(--color-primary-400)]" />
                                            <span className="text-xl font-serif font-medium text-neutral-800">{tier.credits}</span>
                                            <span className="text-sm text-neutral-500 font-light">Credits</span>
                                        </div>
                                        <p className="text-xs text-neutral-400 mt-1 font-light">Use for events & experiences</p>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8 text-left flex-1 min-h-[80px]">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="text-sm flex items-start gap-3 text-neutral-600">
                                                <Check className="w-5 h-5 flex-shrink-0 text-[var(--color-primary-400)] mt-0.5" />
                                                <span className="leading-relaxed font-light">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Button
                                        className={`w-full py-4 rounded-2xl font-medium text-base transition-all duration-300 mt-auto ${
                                            tier.popular
                                                ? 'bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]'
                                                : 'bg-neutral-800 text-white hover:bg-neutral-700'
                                        }`}
                                        onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Join Waitlist
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Waitlist Information */}
                <div className="bg-gradient-to-br bg-white p-16 rounded-3xl border border-neutral-300">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-4xl font-serif font-light text-neutral-800 mb-2">What Can I Expect From The Waitlist?</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="group text-center">
                            <div className="relative mb-8">
                                <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-500)] rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                                    <Users className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Exclusive Waves</h4>
                            <p className="text-neutral-600 leading-relaxed font-light px-4">
                                Due to demand, memberships are released in waves based on waitlist priority.
                            </p>
                        </div>

                        <div className="group text-center">
                            <div className="relative mb-8">
                                <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-500)] rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                                    <Check className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Zero Commitment</h4>
                            <p className="text-neutral-600 leading-relaxed font-light px-4">There&apos;s zero commitment to join.</p>
                        </div>

                        <div className="group text-center">
                            <div className="relative mb-8">
                                <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-500)] rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                                    <Gift className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Referrals = Priority Access</h4>
                            <p className="text-neutral-600 leading-relaxed font-light px-4">
                                Share your unique link to move up the list and gain early access to exclusive programming.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
