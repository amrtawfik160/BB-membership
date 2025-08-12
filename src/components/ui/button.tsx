import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-[var(--brand-primary)] text-[var(--text-primary)] hover:bg-[#9bc2a3] shadow-[0px_2px_0px_0px_rgba(176,207,184,0.3)_inset]',
                destructive: 'bg-[var(--destructive)] text-white hover:bg-[#dc2626] border-0',
                outline:
                    'border border-[var(--border-light)] bg-[var(--background-alt)] hover:bg-[var(--sage-green)]/10 hover:border-[var(--sage-green)] text-[var(--text-primary)]',
                secondary: 'bg-[var(--accent-warm)] text-[var(--text-primary)] hover:bg-[#ffc8a8] border-0',
                ghost: 'hover:bg-[var(--sage-green)]/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                link: 'text-[var(--sage-green)] underline-offset-4 hover:underline hover:text-[#9bc2a3]',
                'outline-white': 'border text-white bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30',
            },
            size: {
                default: 'px-4 py-2',
                sm: 'px-3 py-1.5 text-xs',
                lg: 'px-8 py-3',
                xl: 'px-8 py-4 text-[0.95rem] font-semibold rounded-xl',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
