'use client'

import { useFormStore } from '@/lib/store/form-store'
import { useState, useEffect } from 'react'

/**
 * Step 5: Confirmation & Success
 * Shows success message with waitlist position and referral code
 */
export default function ConfirmationStep() {
  const { formData, resetForm, userCompletionData } = useFormStore()
  const [showSocialShare, setShowSocialShare] = useState(false)
  const [copied, setCopied] = useState(false)

  // Use actual user data from backend instead of form data
  const userReferralCode = userCompletionData?.assignedReferralCode || 'LOADING...'
  const userWaitlistPosition = userCompletionData?.waitlistPosition || 0
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://bb.com'}/join?ref=${userReferralCode}`
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleSocialShare = (platform: string) => {
    const shareText = `I just joined the BB Membership waitlist! 🌸 Join me and we'll both move up in line together. Use my code: ${userReferralCode}`
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(referralLink)

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent('Join BB Membership with me!')}&body=${encodedText}%20${encodedUrl}`,
    }

    const url = shareUrls[platform as keyof typeof shareUrls]
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const handleStartOver = () => {
    resetForm()
  }

  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto">
      {/* Success Animation */}
      <div className="relative">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        {/* Celebration Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 bg-brand-primary rounded-full animate-bounce`}
              style={{
                left: `${20 + i * 10}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 font-heading">
          Welcome to BB Membership! 🌸
        </h2>
        <p className="text-xl text-text-secondary mb-6">
          Your spot is secured! We&apos;ll be in touch soon with next steps.
        </p>
      </div>

      {/* Waitlist Status Card */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-sm">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-purple-900 mb-2">
          You&apos;re Position #{userWaitlistPosition}!
        </h3>
        <p className="text-purple-700 mb-6">
          We&apos;ll notify you as spots become available. Keep an eye on your inbox for updates.
        </p>
        
        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Registration Status</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Complete
            </span>
          </div>
        </div>
      </div>

      {/* Referral Sharing Card */}
      <div className="bg-gradient-to-r from-brand-primary-light to-brand-secondary-light p-8 rounded-2xl">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-sm">
            <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-brand-primary mb-2">
          Share & Move Up Together
        </h3>
        <p className="text-brand-primary-dark mb-6">
          Invite friends to join and you&apos;ll both move up in line! Your unique referral code:
        </p>
        
        <div className="bg-white p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <code className="font-mono text-lg font-bold text-brand-primary">
              {userReferralCode}
            </code>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-4">
          <p className="text-sm text-brand-primary-dark">Share with friends:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>
            
            <button
              onClick={() => handleSocialShare('email')}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-soft-gray-light p-6 rounded-xl">
        <h4 className="text-lg font-semibold text-text-primary mb-4">What happens next?</h4>
        <div className="space-y-3 text-left">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-brand-primary-light rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-bold text-brand-primary">1</span>
            </div>
            <p className="text-sm text-text-secondary">
              We&apos;ll review your application and may reach out with follow-up questions
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-brand-primary-light rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-bold text-brand-primary">2</span>
            </div>
            <p className="text-sm text-text-secondary">
              If accepted, you&apos;ll receive an invitation email with membership details
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-brand-primary-light rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-bold text-brand-primary">3</span>
            </div>
            <p className="text-sm text-text-secondary">
              Your saved payment method will be charged for the membership fee
            </p>
          </div>
        </div>
      </div>

      {/* Start Over Button (for testing) */}
      <div className="pt-6 border-t border-soft-gray">
        <button
          onClick={handleStartOver}
          className="text-sm text-text-muted hover:text-brand-primary transition-colors"
        >
          Start a new application →
        </button>
      </div>
    </div>
  )
}