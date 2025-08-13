import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin-auth'
import { createClient } from '@/lib/supabase'

export const GET = withAdminAuth(async (admin, request) => {
  try {
    const supabase = createClient()
    
    // Get date filter from query params
    const url = new URL(request.url)
    const range = url.searchParams.get('range') || '30d'
    
    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case 'all':
        startDate.setFullYear(2020) // Go way back
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    const dateFilter = range === 'all' ? '' : `AND created_at >= '${startDate.toISOString()}'`

    // 1. Signups by date
    const { data: signupsByDate, error: signupsError } = await supabase
      .rpc('get_signups_by_date', { 
        start_date: startDate.toISOString(),
        include_all: range === 'all'
      })

    // If the RPC doesn't exist, fall back to a simpler query
    let signupsByDateFallback: Array<{ date: string; count: number }> = []
    if (signupsError) {
      const { data: fallbackData } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())
        .order('created_at', { ascending: true })

      // Group by date
      const groupedByDate = (fallbackData || []).reduce((acc: any, user) => {
        const date = new Date(user.created_at).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

      signupsByDateFallback = Object.entries(groupedByDate).map(([date, count]) => ({
        date,
        count: count as number
      }))
    }

    // 2. Signups by neighborhood
    const { data: signupsByNeighborhood } = await supabase
      .from('users')
      .select('neighborhood')
      .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())

    const neighborhoodCounts = (signupsByNeighborhood || []).reduce((acc: any, user) => {
      const neighborhood = user.neighborhood || 'Unknown'
      acc[neighborhood] = (acc[neighborhood] || 0) + 1
      return acc
    }, {})

    const signupsByNeighborhoodFormatted = Object.entries(neighborhoodCounts)
      .map(([neighborhood, count]) => ({ neighborhood, count: count as number }))
      .sort((a, b) => b.count - a.count)

    // 3. Signups by age range
    const { data: signupsByAge } = await supabase
      .from('users')
      .select('age_range')
      .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())

    const ageCounts = (signupsByAge || []).reduce((acc: any, user) => {
      const ageRange = user.age_range || 'Unknown'
      acc[ageRange] = (acc[ageRange] || 0) + 1
      return acc
    }, {})

    const signupsByAgeFormatted = Object.entries(ageCounts)
      .map(([age_range, count]) => ({ age_range, count: count as number }))
      .sort((a, b) => {
        // Sort age ranges in logical order
        const order = ['20s', '30s', '40s', '50s', '60s+', 'Unknown']
        return order.indexOf(a.age_range) - order.indexOf(b.age_range)
      })

    // 4. Signups by occupation (top 10)
    const { data: signupsByOccupation } = await supabase
      .from('users')
      .select('occupation')
      .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())

    const occupationCounts = (signupsByOccupation || []).reduce((acc: any, user) => {
      const occupation = user.occupation?.trim() || 'Unknown'
      acc[occupation] = (acc[occupation] || 0) + 1
      return acc
    }, {})

    const signupsByOccupationFormatted = Object.entries(occupationCounts)
      .map(([occupation, count]) => ({ occupation, count: count as number }))
      .sort((a, b) => b.count - a.count)

    // 5. Referral statistics
    const { data: referralData } = await supabase
      .from('users')
      .select('referral_count, first_name, last_name, referral_code')
      .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())

    const totalReferrals = (referralData || []).reduce((sum, user) => sum + (user.referral_count || 0), 0)
    const usersWithReferrals = (referralData || []).filter(user => (user.referral_count || 0) > 0).length
    const averageReferralsPerUser = usersWithReferrals > 0 ? totalReferrals / usersWithReferrals : 0

    const topReferralCodes = (referralData || [])
      .filter(user => (user.referral_count || 0) > 0)
      .sort((a, b) => (b.referral_count || 0) - (a.referral_count || 0))
      .slice(0, 5)
      .map(user => ({
        code: user.referral_code,
        count: user.referral_count || 0,
        user_name: `${user.first_name} ${user.last_name}`
      }))

    // 6. Conversion funnel
    const { count: totalSignups } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())

    const { count: withPayment } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('payment_completed', true)
      .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())

    const { count: withReferrals } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gt('referral_count', 0)
      .gte('created_at', range === 'all' ? '2020-01-01' : startDate.toISOString())

    const conversionRate = totalSignups ? Math.round(((withPayment || 0) / totalSignups) * 100) : 0

    return NextResponse.json({
      signupsByDate: signupsError ? signupsByDateFallback : (signupsByDate || []),
      signupsByNeighborhood: signupsByNeighborhoodFormatted,
      signupsByAge: signupsByAgeFormatted,
      signupsByOccupation: signupsByOccupationFormatted,
      referralStats: {
        totalReferrals,
        usersWithReferrals,
        averageReferralsPerUser,
        topReferralCodes
      },
      conversionFunnel: {
        totalSignups: totalSignups || 0,
        withPayment: withPayment || 0,
        withReferrals: withReferrals || 0,
        conversionRate
      }
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
})