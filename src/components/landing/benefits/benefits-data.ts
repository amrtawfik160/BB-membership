import { Users, Globe, Gift, Target, TrendingUp, DollarSign, Zap } from 'lucide-react'

export interface BenefitData {
    icon: any
    title: string
    description: string
    tagline: string
}

export interface FeatureData {
    icon: any
    title: string
    description: string
}

export const benefitsData: BenefitData[] = [
    {
        icon: Users,
        title: 'BB CIRCUIT: SOCIAL + STRATEGIC EVENTS',
        description: 'Use your credits to unlock 8–12 curated experiences per month: Rooftop happy hours & sculpting workouts, networking dinners with founders, finance & business talks, wellness & mindfulness sessions.',
        tagline: 'Think: ClassPass meets your dream mentor group',
    },
    {
        icon: Globe,
        title: 'DIGITAL PLATFORM: YOUR PRIVATE NETWORK',
        description: 'Connect with women who get you in a safe, curated space. Create member profiles, filter by job title and goals, direct chat, discover likeminded women, join subgroups, community forum with AI bot (Brickette).',
        tagline: 'Think: LinkedIn meets Reddit meets your group chat',
    },
    {
        icon: Gift,
        title: 'PERKS: GIFTS, DEALS & PRIORITY ACCESS',
        description: 'Unlock hundreds in local & national value each month. Fitness passes, dining discounts, business tools, beauty packages, BB collab opportunities.',
        tagline: 'Think: American Express perks, but made for your Miami lifestyle',
    },
]

export const featuresData: FeatureData[] = [
    {
        icon: Target,
        title: 'Find a mentor',
        description: 'Connect with experienced women who\'ve been where you are.',
    },
    {
        icon: TrendingUp,
        title: 'Meet future cofounders',
        description: 'Build your next venture with ambitious, like-minded women.',
    },
    {
        icon: DollarSign,
        title: 'Get your finances right',
        description: 'Learn from peers who have mastered money management.',
    },
    {
        icon: Zap,
        title: 'Build your brand',
        description: 'Grow with women who want to see you win.',
    },
]
