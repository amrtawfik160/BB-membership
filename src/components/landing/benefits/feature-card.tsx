import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-sm p-6 flex flex-col items-center rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 text-[var(--color-primary-400)]" />
                <h4 className="text-lg font-serif font-bold text-white">{title}</h4>
            </div>
            <p className="text-stone-300">{description}</p>
        </div>
    )
}
