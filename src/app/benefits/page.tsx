'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    ArrowLeft,
    Calendar,
    TrendingUp,
    Sparkles,
    Network,
    Briefcase,
    Crown,
} from 'lucide-react'

export default function BenefitsPage() {
    const benefits = [
        {
            title: 'Social Life, Reimagined',
            subtitle: 'Say goodbye to awkward meetups and random group chats.',
            description: 'Tap into a curated calendar of high-vibe, high-impact experiences built for connection.',
            icon: Calendar,
            features: [
                'Monthly events you actually want to go to',
                'Boutique fitness, rooftop happy hours, and sculpting workouts',
                'Invite-only networking dinners and cofounder meetups',
                'Priority access to members-only activations',
                'Credit-based event system (like ClassPass but for your social life)',
            ],
            outcome: 'Meet new friends, business partners, and workout buddies, all effortlessly.',
            color: 'from-pink-400 to-pink-500',
        },
        {
            title: 'Career & Business Support',
            subtitle: "Whether you're pivoting, launching, or scaling—we've got you.",
            description: '',
            icon: Briefcase,
            features: [
                'Free or discounted LLC registration + biz formation support',
                'Legal + accounting partner perks (trademark help, bookkeeping, tax prep)',
                'Resume audits, LinkedIn refreshes, and job board access',
                'Personal branding & pitch deck templates',
                'Founder-specific group chats + visibility opportunities (podcasts, press, panels)',
            ],
            outcome: 'Build your dream job, brand, or business—faster and with less friction.',
            color: 'from-blue-400 to-blue-500',
        },
        {
            title: 'Personal Finance & Investing',
            subtitle: 'Because financial confidence = freedom.',
            description: '',
            icon: TrendingUp,
            features: [
                'Monthly talks on investing, budgeting, taxes, and entrepreneurship',
                'Bitcoin wallet setup & investing education',
                'Bookkeeping and accounting partner discounts',
            ],
            outcome: "Learn to manage your money like a CEO, even if you're just getting started.",
            color: 'from-green-400 to-green-500',
        },
        {
            title: 'Private Digital Platform',
            subtitle: 'Your curated network, one click away.',
            description: 'Skip the noise of Facebook, WhatsApp, and Instagram DMs.',
            icon: Network,
            features: [
                'Filtered member profiles by industry, age, vibe, and interests',
                '1:1 direct chat and pre/post-event threads',
                'Community forum with subgroups (Founders, Moms, Tech, Creators)',
                'Anonymous posting + AI-powered chat bot (Brickette)',
                'Create your digital calling card to get discovered + build trust',
            ],
            outcome: 'Connect, collaborate, and grow without leaving the BB ecosystem.',
            color: 'from-purple-400 to-purple-500',
        },
        {
            title: 'Insane Perks & VIP Access',
            subtitle: 'Thousands in annual value. Miami-tested, member-approved.',
            description: '',
            icon: Crown,
            features: [
                'Discounted coffee, exclusive workouts, premium booking access',
                "Monthly perks at Miami's best restaurants, gyms, and beauty spots",
                'Early access to collabs, retreats, and pop-ups',
            ],
            outcome: 'Live like a local insider with a luxury twist.',
            color: 'from-yellow-400 to-yellow-500',
        },
        {
            title: 'Growth That Actually Sticks',
            subtitle: "This isn't just about networking. It's about becoming your best self.",
            description: '',
            icon: Sparkles,
            features: [
                'Events that inspire real connection, not just surface convos',
                'Wellness integrations: breathwork, mindset coaching, longevity workshops',
                'Branding yourself like a pro (with feedback from the BB community)',
                'Meet women who challenge, cheerlead, and connect you to your next move',
                'Optional accountability pods to help you hit personal + professional goals',
            ],
            outcome: "You don't need a coach or another course. You need the right circle.",
            color: 'from-rose-400 to-rose-500',
        },
    ]

    return (
        <main className="min-h-screen bg-neutral-50">
            {/* Navigation */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-sm font-medium text-neutral-600">Member Benefits</div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-neutral-50 to-pink-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-neutral-800 mb-8 tracking-tight leading-tight">
                        Your life.
                        <span className="block text-[var(--color-primary-400)]">Leveled up.</span>
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                        Break this into clear, elevated categories — a mix of tangible perks and aspirational results.
                    </p>
                </div>
            </section>

            {/* Benefits Sections */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto space-y-16">
                    {benefits.map((benefit, index) => {
                        const IconComponent = benefit.icon
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-12 shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-start md:gap-8 mb-10">
                                    <div
                                        className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-6 md:mb-0 flex-shrink-0`}
                                    >
                                        <IconComponent className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-800 mb-4">{benefit.title}</h2>
                                        <p className="text-xl text-neutral-600 mb-4 leading-relaxed">{benefit.subtitle}</p>
                                        {benefit.description && <p className="text-lg text-neutral-600 leading-relaxed">{benefit.description}</p>}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="grid md:grid-cols-2 gap-4 mb-8">
                                    {benefit.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.color} mt-3 flex-shrink-0`} />
                                            <span className="text-neutral-700 leading-relaxed">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Outcome */}
                                <div className="bg-neutral-50 rounded-2xl p-6">
                                    <p className="text-lg font-medium text-neutral-800 italic leading-relaxed">{benefit.outcome}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-pink-50 to-neutral-50">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Whether you&apos;re new in town, entering your career-girl era, or ready to uplevel, Brickell Babes is here to help you find
                        your people and build your path.
                    </p>
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
