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
        title: 'Exclusive Events',
        description: 'From penthouse mixers to private yacht brunches — access 8–12 curated experiences monthly using our credit system.',
        tagline: 'ClassPass meets your dream mentor group',
    },
    {
        icon: Globe,
        title: 'Private Network',
        description: 'Connect with women who get you in a curated digital space. Filter by industry, join subgroups, chat directly.',
        tagline: 'LinkedIn meets your inner circle',
    },
    {
        icon: Gift,
        title: 'Premium Perks',
        description: "Hundreds in monthly value: fitness classes, dining discounts, business tools, and VIP access to Miami's best.",
        tagline: 'Amex perks for your Miami lifestyle',
    },
]

export const featuresData: FeatureData[] = [
    {
        icon: Target,
        title: 'Find Your Circle',
        description: 'Connect with mentors and future cofounders who share your ambition.',
    },
    {
        icon: TrendingUp,
        title: 'Build Your Brand',
        description: 'Grow alongside women who genuinely want to see you succeed.',
    },
    {
        icon: DollarSign,
        title: 'Level Up Financially',
        description: 'Get your finances right with guidance from successful peers.',
    },
    {
        icon: Zap,
        title: 'Strategic Advantage',
        description: "Access opportunities that aren't available anywhere else.",
    },
]
