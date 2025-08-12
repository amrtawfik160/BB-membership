import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { StripeProvider } from '@/components/providers'
import './globals.css'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
})

const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
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
            <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
                <StripeProvider>{children}</StripeProvider>
            </body>
        </html>
    )
}
