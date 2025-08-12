import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase'

// Schema for referral code validation
const validateReferralSchema = z.object({
    referralCode: z.string().min(1, 'Referral code is required'),
})

// Schema for referral stats
const referralStatsSchema = z.object({
    userId: z.string().uuid('Valid user ID is required'),
})

/**
 * GET /api/referral?code=REFERRAL_CODE
 * Validates a referral code and returns basic info about the referrer
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const referralCode = searchParams.get('code')

        if (!referralCode) {
            return NextResponse.json({ error: 'Referral code parameter is required' }, { status: 400 })
        }

        // Validate the referral code format
        const validatedData = validateReferralSchema.parse({ referralCode })

        const supabase = createClient()

        // Check if the referral code exists and get referrer info
        const { data: referrer, error } = await supabase
            .from('users')
            .select('id, first_name, referral_count, waitlist_position')
            .eq('referral_code', validatedData.referralCode)
            .single()

        if (error || !referrer) {
            return NextResponse.json(
                {
                    valid: false,
                    error: 'Referral code not found',
                },
                { status: 404 }
            )
        }

        // Return valid referral info
        return NextResponse.json({
            valid: true,
            referrer: {
                firstName: referrer.first_name,
                referralCount: referrer.referral_count,
                waitlistPosition: referrer.waitlist_position,
            },
            message: `Valid referral code from ${referrer.first_name}!`,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid referral code format' }, { status: 400 })
        }

        console.error('Referral validation error:', error)
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}

/**
 * POST /api/referral
 * Gets referral statistics for a user
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = referralStatsSchema.parse(body)

        const supabase = createClient()

        // Get user's referral statistics using the database function
        const { data: stats, error } = await supabase.rpc('get_user_dashboard_stats', { user_id: validatedData.userId })

        if (error) {
            console.error('Error getting user stats:', error)
            return NextResponse.json({ error: 'Failed to get referral statistics' }, { status: 500 })
        }

        const userStats = stats && stats.length > 0 ? stats[0] : null

        if (!userStats) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get referral leaderboard position
        const { data: leaderboard, error: leaderboardError } = await supabase.rpc('get_referral_leaderboard', { limit_count: 100 })

        let leaderboardRank = null
        if (leaderboard && !leaderboardError) {
            const userRank = leaderboard.find((entry: { referral_count: number }) => {
                // Since we don't have the user's first name in stats, we'll match by referral count and position
                return entry.referral_count === userStats.referral_count
            })
            if (userRank) {
                leaderboardRank = userRank.rank
            }
        }

        return NextResponse.json({
            success: true,
            stats: {
                waitlistPosition: userStats.waitlist_position,
                totalUsers: userStats.total_users,
                referralCount: userStats.referral_count,
                friendsJoined: userStats.friends_joined,
                spotsToMove: userStats.spots_to_move,
                leaderboardRank,
                percentile: Math.round((userStats.waitlist_position / userStats.total_users) * 100),
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            }))

            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: formattedErrors,
                },
                { status: 400 }
            )
        }

        console.error('Referral stats error:', error)
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}
