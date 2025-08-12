import { Button } from '@/components/ui/button'
import { Check, Star, Crown, Sparkles, Users, Calendar, Gift, Zap } from 'lucide-react'

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
            color: 'bg-stone-100',
            textColor: 'text-stone-700',
        },
        {
            name: 'Insider',
            price: '$68',
            credits: '3',
            description: 'Most popular choice',
            features: [
                'Everything in Basic',
                'Guest passes',
            ],
            popular: true,
            icon: Star,
            color: 'bg-rose-300',
            textColor: 'text-white',
        },
        {
            name: 'Tastemaker',
            price: '$148',
            credits: '7',
            description: 'For the socially connected',
            features: [
                'Everything in Insider',
                'Guest passes',
            ],
            popular: false,
            icon: Sparkles,
            color: 'bg-amber-100',
            textColor: 'text-amber-700',
        },
        {
            name: 'Founder',
            price: '$298',
            credits: 'Unlimited',
            description: 'Ultimate access',
            features: [
                'Everything in Tastemaker',
                'Curated gift bag with annual contract',
            ],
            popular: false,
            icon: Crown,
            color: 'bg-stone-800',
            textColor: 'text-white',
        },
    ]

    return (
        <section className="py-24 px-4" style={{ backgroundColor: 'var(--cream)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-serif font-light text-stone-800 mb-6 tracking-wide">👑 Membership Tiers (Preview)</h2>
                    <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
                        <span>📝 3-month minimum commitment required.</span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {tiers.map((tier, index) => {
                        const IconComponent = tier.icon
                        return (
                            <div
                                key={index}
                                className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
                                    tier.popular ? 'border-rose-300 bg-white' : 'border-stone-200 bg-white hover:border-stone-300'
                                }`}
                            >
                                {/* Popular Badge */}
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-rose-300 text-white px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wide">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center">
                                    {/* Icon */}
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 mx-auto ${tier.color}`}>
                                        <IconComponent className={`w-10 h-10 ${tier.popular ? 'text-white' : tier.textColor}`} />
                                    </div>

                                    {/* Tier Name & Description */}
                                    <h3 className="text-2xl font-serif font-medium mb-2 text-stone-800">{tier.name}</h3>
                                    <p className="text-sm text-stone-500 mb-6 font-light">{tier.description}</p>

                                    {/* Pricing */}
                                    <div className="mb-6">
                                        <span className="text-5xl font-serif font-light text-stone-800">{tier.price}</span>
                                        <span className="text-lg text-stone-500 font-light">/month</span>
                                    </div>

                                    {/* Credits */}
                                    <div className="mb-8 p-4 rounded-2xl" style={{ backgroundColor: 'var(--pearl)' }}>
                                        <div className="flex items-center justify-center gap-2">
                                            <Zap className="w-5 h-5 text-rose-400" />
                                            <span className="text-xl font-serif font-medium text-stone-800">{tier.credits}</span>
                                            <span className="text-sm text-stone-500 font-light">Credits</span>
                                        </div>
                                        <p className="text-xs text-stone-400 mt-1 font-light">Use for events & experiences</p>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8 text-left">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="text-sm flex items-start gap-3 text-stone-600">
                                                <Check className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                                                <span className="leading-relaxed font-light">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Button
                                        className={`w-full py-4 rounded-2xl font-medium text-base transition-all duration-300 ${
                                            tier.popular ? 'bg-rose-300 text-white hover:bg-rose-400' : 'bg-stone-800 text-white hover:bg-stone-700'
                                        }`}
                                    >
                                        Join Waitlist
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Waitlist Information */}
                <div className="bg-white p-12 rounded-3xl border border-stone-200">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-serif font-light text-stone-800 mb-4">What Can I Expect From The Waitlist?</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-rose-200 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                                <Users className="w-10 h-10 text-rose-600" />
                            </div>
                            <p className="text-stone-600 leading-relaxed font-light">
                                Due to demand, memberships are released in waves based on waitlist priority.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                                <Check className="w-10 h-10 text-amber-600" />
                            </div>
                            <p className="text-stone-600 leading-relaxed font-light">
                                There's zero commitment to join.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-stone-200 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                                <Gift className="w-10 h-10 text-stone-700" />
                            </div>
                            <p className="text-stone-600 leading-relaxed font-light">
                                Referrals = Priority Access<br />
                                Share your unique link to move up the list and gain early access to exclusive programming.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
