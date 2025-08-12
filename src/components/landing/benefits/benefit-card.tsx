import { LucideIcon } from 'lucide-react'

interface BenefitCardProps {
    icon: LucideIcon
    title: string
    description: string
    tagline: string
}

export function BenefitCard({ icon: Icon, title, description, tagline }: BenefitCardProps) {
    return (
        <div className="bg-white p-8 rounded-2xl hover:bg-stone-50 transition-all duration-300 border border-stone-200">
            <div className="w-14 h-14 bg-[var(--color-primary-500)] rounded-2xl flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-800 mb-4 tracking-tight">{title}</h3>
            <p className="text-stone-600 mb-4 leading-relaxed">{description}</p>
            <p className="text-sm text-[var(--color-primary-400)] font-semibold">{tagline}</p>
        </div>
    )
}
