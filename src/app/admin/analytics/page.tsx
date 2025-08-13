'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  RefreshCw,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  signupsByDate: Array<{ date: string; count: number }>
  signupsByNeighborhood: Array<{ neighborhood: string; count: number }>
  signupsByAge: Array<{ age_range: string; count: number }>
  signupsByOccupation: Array<{ occupation: string; count: number }>
  referralStats: {
    totalReferrals: number
    usersWithReferrals: number
    averageReferralsPerUser: number
    topReferralCodes: Array<{ code: string; count: number; user_name: string }>
  }
  conversionFunnel: {
    totalSignups: number
    withPayment: number
    withReferrals: number
    conversionRate: number
  }
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        console.error('Failed to load analytics')
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getBarWidth = (value: number, max: number) => {
    return Math.max(1, (value / max) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[var(--color-primary-500)] mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
          <p className="text-gray-500">Unable to load analytics data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button
                onClick={() => router.push('/admin')}
                variant="ghost"
                size="sm"
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <BarChart3 className="h-8 w-8 text-[var(--color-primary-500)] mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
              <Button
                onClick={loadAnalytics}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analytics.conversionFunnel.totalSignups.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Signups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {analytics.conversionFunnel.withPayment.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">With Payment</div>
              <div className="text-xs text-green-600 mt-1">
                {Math.round((analytics.conversionFunnel.withPayment / analytics.conversionFunnel.totalSignups) * 100)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {analytics.conversionFunnel.withReferrals.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Made Referrals</div>
              <div className="text-xs text-purple-600 mt-1">
                {Math.round((analytics.conversionFunnel.withReferrals / analytics.conversionFunnel.totalSignups) * 100)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-primary-600)]">
                {analytics.conversionFunnel.conversionRate}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Overall Rate</div>
            </div>
          </div>
        </div>

        {/* Signups Over Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Signups Over Time</h2>
          {analytics.signupsByDate.length > 0 ? (
            <div className="space-y-3">
              {analytics.signupsByDate.map((item, index) => {
                const maxCount = Math.max(...analytics.signupsByDate.map(d => d.count))
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-gray-600 text-right">
                      {formatDate(item.date)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="bg-[var(--color-primary-500)] h-6 rounded-sm transition-all duration-500"
                          style={{ width: `${getBarWidth(item.count, maxCount)}%` }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {item.count} signup{item.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No signup data available for this period.</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demographics: Neighborhoods */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Neighborhoods
            </h2>
            {analytics.signupsByNeighborhood.length > 0 ? (
              <div className="space-y-3">
                {analytics.signupsByNeighborhood.slice(0, 8).map((item, index) => {
                  const maxCount = Math.max(...analytics.signupsByNeighborhood.map(d => d.count))
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-gray-600 text-right truncate">
                        {item.neighborhood}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="bg-blue-500 h-4 rounded-sm"
                            style={{ width: `${getBarWidth(item.count, maxCount)}%` }}
                          />
                          <span className="text-sm text-gray-900">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No neighborhood data available.</p>
            )}
          </div>

          {/* Demographics: Age Ranges */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Age Distribution
            </h2>
            {analytics.signupsByAge.length > 0 ? (
              <div className="space-y-3">
                {analytics.signupsByAge.map((item, index) => {
                  const maxCount = Math.max(...analytics.signupsByAge.map(d => d.count))
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600 text-right">
                        {item.age_range}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="bg-green-500 h-4 rounded-sm"
                            style={{ width: `${getBarWidth(item.count, maxCount)}%` }}
                          />
                          <span className="text-sm text-gray-900">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No age data available.</p>
            )}
          </div>
        </div>

        {/* Referral Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Referral Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.referralStats.totalReferrals.toLocaleString()}
              </div>
              <div className="text-sm text-purple-600">Total Referrals</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.referralStats.usersWithReferrals.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600">Active Referrers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analytics.referralStats.averageReferralsPerUser.toFixed(1)}
              </div>
              <div className="text-sm text-green-600">Avg Per User</div>
            </div>
          </div>

          {analytics.referralStats.topReferralCodes.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Top Referral Codes</h3>
              <div className="space-y-3">
                {analytics.referralStats.topReferralCodes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center text-sm font-medium text-[var(--color-primary-600)]">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.user_name}</div>
                        <div className="text-sm text-gray-600 font-mono">{item.code}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{item.count}</div>
                      <div className="text-sm text-gray-600">referrals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Occupations */}
        {analytics.signupsByOccupation.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Popular Occupations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.signupsByOccupation.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900 truncate pr-4">
                    {item.occupation}
                  </div>
                  <div className="text-sm font-medium text-gray-600 flex-shrink-0">
                    {item.count} user{item.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}