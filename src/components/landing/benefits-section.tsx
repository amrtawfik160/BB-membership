'use client'

/**
 * Benefits Section Component for BB Membership Landing Page
 * Clean, minimal design with lots of white space
 */
export default function BenefitsSection() {
  const scrollToForm = () => {
    const formSection = document.getElementById('form-section')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24" style={{ background: 'var(--background-alt)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Main benefits content */}
        <div className="text-center space-y-16">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              THIS ISN&apos;T JUST A MEMBERSHIP.
            </h2>
            <p className="text-3xl md:text-5xl lg:text-6xl font-bold" style={{ color: 'var(--brand-primary)' }}>
              IT&apos;S YOUR ADVANTAGE.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <p className="text-xl md:text-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The Brickell Babes is the ultimate platform for ambitious, socially curious women who want it all: community, opportunity, and connection.
            </p>
            <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
              Whether you&apos;re launching your brand, changing careers, or simply looking to level up your circle, this is where high-vibe friendships and strategic networking meet.
            </p>
          </div>
          
          <div className="pt-8">
            <button 
              onClick={scrollToForm}
              className="btn-secondary text-lg"
            >
              Explore Member Benefits
            </button>
          </div>
        </div>

        {/* Waitlist expectations section */}
        <div className="mt-32 pt-20 relative">
          {/* Decorative background */}
          <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, var(--cream) 0%, var(--peach) 100%)' }}></div>
          
          <div className="relative z-10 p-12">
            <div className="text-center space-y-16">
              <h3 className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                WHAT CAN I EXPECT FROM THE WAITLIST?
              </h3>
              
              <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--brand-primary)' }}>
                    <span className="text-xl">🌊</span>
                  </div>
                  <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    Due to demand, memberships are released in waves based on waitlist priority.
                  </p>
                </div>
                
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--accent-warm)' }}>
                    <span className="text-xl">✨</span>
                  </div>
                  <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    There&apos;s zero commitment to join.
                  </p>
                </div>
                
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--brand-primary)' }}>
                    <span className="text-xl">🚀</span>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Referrals = Priority Access</h4>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      Share your unique link to move up the list and gain early access to exclusive programming.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}