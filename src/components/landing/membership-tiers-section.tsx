'use client'

/**
 * Membership Tiers Section for BB Membership Landing Page
 * Since this is a waitlist, we show the future membership structure
 */
export default function MembershipTiersSection() {
  const tiers = [
    {
      name: "Basic",
      price: "$38",
      period: "Monthly",
      credits: "1",
      features: [
        "Access to events + platform"
      ],
      popular: false
    },
    {
      name: "Insider",
      price: "$68",
      period: "Monthly",
      credits: "3",
      features: [
        "Guest passes"
      ],
      popular: true
    },
    {
      name: "Tastemaker",
      price: "$148",
      period: "Monthly",
      credits: "7",
      features: [
        "Guest passes"
      ],
      popular: false
    },
    {
      name: "Founder",
      price: "$298",
      period: "Monthly",
      credits: "Unlimited",
      features: [
        "Curated gift bag with annual contract"
      ],
      popular: false
    }
  ]

  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        {/* Clean section header */}
        <div className="text-center mb-24">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-2">
            MEMBERSHIP TIERS (PREVIEW)
          </h2>
        </div>

        {/* Clean table */}
        <div className="max-w-4xl mx-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 font-normal text-gray-900">Tier</th>
                <th className="text-center py-4 font-normal text-gray-900">Monthly</th>
                <th className="text-center py-4 font-normal text-gray-900">Credits</th>
                <th className="text-left py-4 font-normal text-gray-900">Perks</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4">
                    <span className={`${tier.popular ? 'text-[#FF6B9D]' : 'text-gray-900'}`}>
                      {tier.name}
                    </span>
                  </td>
                  <td className="text-center py-4 text-gray-900">{tier.price}</td>
                  <td className="text-center py-4 text-gray-700">{tier.credits}</td>
                  <td className="py-4 text-gray-700">{tier.features.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clean notice */}
        <div className="text-center mt-16">
          <p className="text-gray-700">
            3-month minimum commitment required.
          </p>
        </div>
      </div>
    </section>
  )
}