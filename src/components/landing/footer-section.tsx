'use client'

import { useState } from 'react'

/**
 * Footer Section Component for BB Membership Landing Page
 * Contains links, social media, contact info, and legal information
 */
export default function FooterSection() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')

  const footerLinks = {
    learn: [
      { name: 'Waitlist Info', href: '#waitlist-info' },
      { name: 'Events', href: '#events' },
      { name: 'Press', href: '#press' }
    ],
    about: [
      { name: 'Our Story', href: '#story' },
      { name: 'Join as an Ambassador', href: '#ambassador' },
      { name: 'Partner With Us', href: '#partner' }
    ],
    support: [
      { name: 'FAQ', href: '#faq' },
      { name: 'Contact', href: '#contact' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms', href: '#terms' }
    ]
  }

  const socialLinks = [
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/bbmembership',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
        </svg>
      )
    },
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/bbmembership',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/company/bb-membership',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--sage-green) 0%, var(--cream) 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/15"></div>
      </div>
      
      {/* Enhanced footer content */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Enhanced navigation layout */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            {/* Learn Section */}
            <div>
              <h5 className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Learn</h5>
              <ul className="space-y-4">
                {footerLinks.learn.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Section */}
            <div>
              <h5 className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>About</h5>
              <ul className="space-y-4">
                {footerLinks.about.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h5 className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Support</h5>
              <ul className="space-y-4">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h5 className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Legal</h5>
              <ul className="space-y-4">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h5 className="font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Stay Connected</h5>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: 'var(--border-light)',
                    backgroundColor: 'white',
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--brand-primary)'
                  }}
                  required
                />
                <button
                  type="submit"
                  className="btn-primary w-full text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Enhanced social section */}
          <div className="border-t pt-12" style={{ borderColor: 'var(--border-light)' }}>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
              <div className="flex space-x-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110"
                    style={{ color: 'var(--text-primary)' }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
                &copy; {currentYear} BB Membership. Made with 💚 in Miami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}