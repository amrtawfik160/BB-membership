'use client'

/**
 * Membership Features Section - Clean, minimal design
 */
export default function MembershipFeaturesSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-24">
          <h2 className="text-xl md:text-2xl font-normal text-gray-900">
            WHAT DOES MEMBERSHIP INCLUDE?
          </h2>
        </div>

        {/* Clean content sections with generous spacing */}
        <div className="space-y-32">
          {/* 1. BB CIRCUIT */}
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-baseline space-x-4 mb-4">
                <span className="text-lg font-normal text-gray-900">1.</span>
                <h3 className="text-lg md:text-xl font-normal text-gray-900">
                  BB CIRCUIT: SOCIAL + STRATEGIC EVENTS
                </h3>
              </div>
              <p className="text-gray-700 ml-8">
                Use your credits to unlock 8–12 curated experiences per month:
              </p>
            </div>
            
            <div className="ml-8 space-y-4">
              <p className="text-gray-700">Rooftop happy hours & sculpting workouts</p>
              <p className="text-gray-700">Curated networking dinners with founders, creatives, and execs</p>
              <p className="text-gray-700">Finance & business talks (investing, Bitcoin, tax strategy, real estate, and entrepreneurship)</p>
              <p className="text-gray-700">Wellness & Mindfulness sessions to recharge and reconnect</p>
            </div>
            
            <p className="text-gray-600 italic ml-8 pt-4">
              Think: ClassPass meets your dream mentor group.
            </p>
          </div>

          {/* 2. DIGITAL PLATFORM */}
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-baseline space-x-4 mb-4">
                <span className="text-lg font-normal text-gray-900">2.</span>
                <h3 className="text-lg md:text-xl font-normal text-gray-900">
                  DIGITAL PLATFORM: YOUR PRIVATE NETWORK
                </h3>
              </div>
              <p className="text-gray-700 ml-8">
                Connect with women who get you in a safe, curated space:
              </p>
            </div>
            
            <div className="ml-8 space-y-4">
              <p className="text-gray-700">Create a member profile (age, industry, neighborhood, interests)</p>
              <p className="text-gray-700">Filter by job title, shared goals, or past event attendance</p>
              <p className="text-gray-700">Direct chat with members pre/post events</p>
              <p className="text-gray-700">Discover likeminded women (like Bumble BFF, but better)</p>
              <p className="text-gray-700">Join subgroups: Women in Tech, Creators, Founders, Bitcoin Babes, New Moms</p>
              <p className="text-gray-700">Community forum with anonymous posting + AI bot (Brickette)</p>
            </div>
            
            <p className="text-gray-600 italic ml-8 pt-4">
              Think: LinkedIn meets Reddit meets your group chat.
            </p>
          </div>

          {/* 3. PERKS */}
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-baseline space-x-4 mb-4">
                <span className="text-lg font-normal text-gray-900">3.</span>
                <h3 className="text-lg md:text-xl font-normal text-gray-900">
                  PERKS: GIFTS, DEALS & PRIORITY ACCESS
                </h3>
              </div>
              <p className="text-gray-700 ml-8">
                Unlock hundreds in local & national value each month:
              </p>
            </div>
            
            {/* Clean perks sections */}
            <div className="ml-8 space-y-12">
              {/* FITNESS */}
              <div className="space-y-4">
                <h4 className="font-normal text-gray-900">FITNESS</h4>
                <div className="space-y-2 text-gray-700">
                  <p>2 weeks unlimited at Pure Barre</p>
                  <p>5-class pack at OneTribe</p>
                  <p>1 week free at Legacy Fitness</p>
                  <p>1 week free at SoulCycle</p>
                </div>
              </div>

              {/* DINING & LIFESTYLE */}
              <div className="space-y-4">
                <h4 className="font-normal text-gray-900">DINING & LIFESTYLE</h4>
                <div className="space-y-2 text-gray-700">
                  <p>10% off at Maman</p>
                  <p>15% off Carrot Express</p>
                  <p>Free dessert/cocktail at Groot restaurants</p>
                  <p>VIP booking at Riviera Dining Group spots</p>
                </div>
              </div>

              {/* BUSINESS & ENTREPRENEURSHIP */}
              <div className="space-y-4">
                <h4 className="font-normal text-gray-900">BUSINESS & ENTREPRENEURSHIP</h4>
                <div className="space-y-2 text-gray-700">
                  <p>Open up a free LLC with XYZ (a $298 value)</p>
                  <p>1:1 startup legal consult or contract review (from a vetted partner law firm)</p>
                  <p>Discount on trademark filing through a legal partner</p>
                  <p>25% off business insurance setup</p>
                  <p>6 months free of Canva Pro</p>
                  <p>6 months free of Notion Plus</p>
                  <p>20% off Squarespace</p>
                  <p>1 month free of Flodesk</p>
                </div>
              </div>

              {/* BEAUTY & BRANDING */}
              <div className="space-y-4">
                <h4 className="font-normal text-gray-900">BEAUTY & BRANDING</h4>
                <div className="space-y-2 text-gray-700">
                  <p>Exclusive packages at Surface Level</p>
                  <p>Media & content perks for business owners</p>
                  <p>BB collab opportunities for tastemakers and creators</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 italic ml-8 pt-4">
              Think: American Express perks, but made for your Miami lifestyle.
            </p>
          </div>

        </div>

        {/* LEVEL UP YOUR NETWORK - Clean section */}
        <div className="mt-32 pt-16 border-t border-gray-200">
          <div className="text-center space-y-16">
            <h3 className="text-xl md:text-2xl font-normal text-gray-900">
              LEVEL UP YOUR NETWORK
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We&apos;re not just brunch and beach days. BB is your unfair advantage.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto text-gray-700">
              <div>Find a mentor.</div>
              <div>Meet future cofounders.</div>
              <div>Get your finances right.</div>
              <div>Build your brand with women who want to see you win.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}