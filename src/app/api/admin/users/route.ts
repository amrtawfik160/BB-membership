import { NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin-auth'
import { createClient } from '@/lib/supabase'

export const GET = withAdminAuth(async (admin, request) => {
  try {
    const supabase = createClient()
    
    // Get all users with all their data
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        email,
        date_of_birth,
        instagram_handle,
        linkedin_url,
        age_range,
        neighborhood,
        occupation,
        interests,
        marketing_opt_in,
        referral_code,
        referred_by,
        waitlist_position,
        referral_count,
        payment_completed,
        created_at,
        updated_at
      `)
      .order('waitlist_position', { ascending: true })

    if (error) {
      console.error('Error fetching users:', error)
      throw error
    }

    return NextResponse.json({
      users: users || [],
      total: users?.length || 0
    })

  } catch (error) {
    console.error('Admin users API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
})