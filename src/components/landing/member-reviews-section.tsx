'use client'

/**
 * Member Reviews Section - Clean, minimal design
 */
export default function MemberReviewsSection() {
  const reviews = [
    {
      quote: "The women I've met here helped me launch my business. Literally.",
      author: "Danielle",
      age: "32",
      location: "South Beach"
    },
    {
      quote: "Between the events, perks, and mentorship, I got more out of this than my MBA.",
      author: "Sam",
      age: "34",
      location: "Downtown Miami"
    },
    {
      quote: "I found my people, my gym, and my dream client, all in the first month.",
      author: "Ava",
      age: "29",
      location: "Brickell"
    }
  ]

  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        {/* Clean section header */}
        <div className="text-center mb-24">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900">
            MEMBER REVIEWS
          </h2>
        </div>

        {/* Clean reviews layout */}
        <div className="space-y-16 max-w-4xl mx-auto">
          {reviews.map((review, index) => (
            <div key={index} className="text-center space-y-6 border-b border-gray-200 pb-16 last:border-b-0 last:pb-0">
              <p className="text-lg text-gray-700 italic leading-relaxed">
                "{review.quote}"
              </p>
              <p className="text-gray-900">
                – {review.author}, {review.age}, {review.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}