'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
    ArrowLeft, 
    Zap, 
    Calendar, 
    Users, 
    Coffee,
    Briefcase,
    Crown,
    CreditCard,
    TrendingUp,
    RotateCcw,
    Lightbulb,
    Star
} from 'lucide-react'

export default function CreditsPage() {
    const creditTiers = [
        {
            name: 'Basic',
            credits: '1 Credit',
            highlights: 'Access to core events & discounted add-ons'
        },
        {
            name: 'Insider',
            credits: '3 Credits',
            highlights: 'Most popular tier — balance of fun & access'
        },
        {
            name: 'Tastemaker',
            credits: '7 Credits',
            highlights: 'Guest passes + premium perks'
        },
        {
            name: 'Founder',
            credits: 'Unlimited Credits',
            highlights: 'All-access pass + VIP-only invites'
        }
    ]

    const eventTypes = [
        {
            credits: '1 Credit',
            events: ['Happy hours', 'Group fitness class', 'Networking']
        },
        {
            credits: '2 Credits',
            events: ['Business workshops', 'Lunch & learn series', 'Experiences']
        },
        {
            credits: '3–5 Credits',
            events: ['Private dining experiences', 'VIP events']
        }
    ]

    return (
        <main className="min-h-screen bg-neutral-50">
            {/* Navigation */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-sm font-medium text-neutral-600">How Credits Work</div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-neutral-50 to-yellow-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-neutral-800 mb-8 tracking-tight leading-tight">
                        How Credits Work
                    </h1>
                    <p className="text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                        Think of credits as your passport to the BB experience.
                    </p>
                </div>
            </section>

            {/* What Are Credits Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-neutral-200 mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-800">What Are Credits?</h2>
                        </div>
                        <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
                            <p>Credits are the currency of your BB Membership.</p>
                            <p>They give you access to curated events, experiences, and perks throughout the month — from sweat sessions and rooftop happy hours to professional dinners and private workshops.</p>
                            <p>Every event has a credit value. You use your monthly credits to reserve your spot.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Types Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-800">What Kinds of Events Can I Use Them On?</h2>
                    </div>
                    
                    <p className="text-lg text-neutral-600 text-center mb-12">Credits can be used for:</p>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {eventTypes.map((type, index) => (
                            <div key={index} className="bg-neutral-50 rounded-2xl p-8 text-center">
                                <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                                    {type.credits}
                                </div>
                                <div className="space-y-3">
                                    {type.events.map((event, idx) => (
                                        <p key={idx} className="text-neutral-700">{event}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-neutral-600 italic">
                        Some events may allow guests with an extra credit or small upgrade fee.
                    </p>
                </div>
            </section>

            {/* Credit Tiers Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-800">How Many Credits Do I Get?</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {creditTiers.map((tier, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-2">{tier.name}</h3>
                                <div className="text-2xl font-semibold text-[var(--color-primary-500)] mb-4">{tier.credits}</div>
                                <p className="text-neutral-600 text-sm leading-relaxed">{tier.highlights}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* What If I Run Out */}
                    <div className="bg-neutral-50 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-neutral-800">What If I Run Out of Credits?</h3>
                        </div>
                        <p className="text-lg text-neutral-600 mb-4">No stress — you can:</p>
                        <ul className="space-y-2 text-neutral-700">
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-400 mt-3 flex-shrink-0" />
                                <span>Buy additional credits à la carte anytime</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-400 mt-3 flex-shrink-0" />
                                <span>Upgrade your membership tier for more included credits</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-400 mt-3 flex-shrink-0" />
                                <span>Use referral bonuses</span>
                            </li>
                        </ul>
                    </div>

                    {/* Do Credits Roll Over */}
                    <div className="bg-neutral-50 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                                <RotateCcw className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-neutral-800">Do Credits Roll Over?</h3>
                        </div>
                        <div className="space-y-4 text-lg text-neutral-600">
                            <p>Credits reset monthly on your billing date</p>
                            <p>Unused credits do not roll over, but you can always upgrade for more flexibility</p>
                        </div>
                    </div>

                    {/* Why Credits */}
                    <div className="bg-gradient-to-br from-pink-50 to-neutral-50 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-neutral-800">Why Credits?</h3>
                        </div>
                        <div className="space-y-4 text-lg text-neutral-600">
                            <p>Using credits keeps the experience flexible, fair, and rewarding.</p>
                            <p>Whether you're in a social season or a recharge era, you're never paying for what you don't use.</p>
                            <p>The more active you are, the more value you unlock.</p>
                            <p>And you'll always know exactly what you're getting each month.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BB Tips Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[var(--color-primary-50)] border-l-4 border-[var(--color-primary-400)] rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center">
                                <Lightbulb className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-neutral-800">BB Tip:</h3>
                        </div>
                        <div className="space-y-4 text-lg text-neutral-700">
                            <p>Want to attend multiple events in one week? Choose a higher tier or plan ahead using your monthly drop.</p>
                            <p className="font-medium">Popular events fill fast — book early and get rewarded.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-yellow-50 to-neutral-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-800 mb-8 leading-tight">
                        Ready to start earning credits?
                    </h2>
                    <Link href="/">
                        <Button 
                            size="xl" 
                            className="bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] px-12 py-4 text-lg font-semibold rounded-2xl"
                        >
                            Join the Waitlist
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    )
}