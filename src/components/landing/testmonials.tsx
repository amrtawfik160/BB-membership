import { Star, Quote } from 'lucide-react'

export function Testimonials() {
    const testimonials = [
        {
            quote: 'The women I&apos;ve met here helped me launch my business. Literally.',
            author: 'Danielle, 32, South Beach',
            rating: 5,
        },
        {
            quote: 'Between the events, perks, and mentorship, I got more out of this than my MBA.',
            author: 'Sam, 34, Downtown Miami',
            rating: 5,
        },
        {
            quote: 'I found my people, my gym, and my dream client, all in the first month.',
            author: 'Ava, 29, Brickell',
            rating: 5,
        },
    ]

    return (
        <section className="py-24 px-4 bg-gradient-to-br from-white via-pink-50/20 to-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif font-light text-neutral-800 mb-8 tracking-wide">Member Reviews</h2>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">Real stories from women who transformed their networks</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl hover:shadow-lg transition-all duration-300 border border-neutral-200">
                            <div className="mb-6">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-6 h-6 text-[var(--color-primary-400)] fill-current" />
                                    ))}
                                </div>
                                <div className="w-12 h-12 bg-[var(--color-primary-400)] rounded-2xl flex items-center justify-center mb-6">
                                    <Quote className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <blockquote className="text-lg text-neutral-700 mb-8 leading-relaxed font-light font-serif italic">
                                &quot;{testimonial.quote}&quot;
                            </blockquote>
                            <cite className="text-sm font-medium text-neutral-600 not-italic">– {testimonial.author}</cite>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
