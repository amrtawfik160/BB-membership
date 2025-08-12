import { StripeProvider } from '@/components/providers'
import type { Metadata } from 'next'
import { Inter, Libre_Baskerville } from 'next/font/google'
import './globals.css'

const libreBaskerville = Libre_Baskerville({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-libre-baskerville',
    weight: ['400', '700'],
})

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: 'BB Membership - Join the Waitlist',
    description: 'Build your best life through curated events, career connections, and powerful community. Join the BB Membership waitlist today.',
    keywords: ['BB Membership', 'women community', 'networking', 'career', 'Miami', 'Brickell Babes'],
    openGraph: {
        title: 'BB Membership - Join the Waitlist',
        description: 'Build your best life through curated events, career connections, and powerful community.',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BB Membership - Join the Waitlist',
        description: 'Build your best life through curated events, career connections, and powerful community.',
    },
    robots: 'index, follow',
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${libreBaskerville.variable} ${inter.variable} antialiased`}>
                <StripeProvider>{children}</StripeProvider>
            </body>
        </html>
    )
}
