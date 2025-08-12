import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role key
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Types based on our database schema
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  instagram_handle?: string
  linkedin_url?: string
  age_range: '20s' | '30s' | '40s' | '50s' | '60s+'
  neighborhood: string
  occupation: string
  interests: string[]
  marketing_opt_in: boolean
  referral_code: string
  referred_by?: string
  waitlist_position?: number
  referral_count: number
  stripe_customer_id?: string
  stripe_payment_method_id?: string
  payment_completed: boolean
  ip_address?: string
  user_agent?: string
  utm_source?: string
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referee_id: string
  referral_code: string
  created_at: string
}

// Helper functions for database operations
export const userService = {
  // Create new user with referral tracking
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'waitlist_position' | 'referral_count'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user by email
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return data
  },

  // Get user by referral code
  async getUserByReferralCode(code: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('referral_code', code)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Update user information
  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get waitlist statistics
  async getWaitlistStats() {
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    const { data: topReferrers, error: referrerError } = await supabase
      .from('users')
      .select('first_name, last_name, referral_count, waitlist_position')
      .order('referral_count', { ascending: false })
      .limit(10)

    if (referrerError) throw referrerError

    return {
      totalUsers: totalUsers || 0,
      topReferrers
    }
  }
}

export const referralService = {
  // Create referral relationship
  async createReferral(referrerId: string, refereeId: string, referralCode: string) {
    const { data, error } = await supabase
      .from('referrals')
      .insert([{
        referrer_id: referrerId,
        referee_id: refereeId,
        referral_code: referralCode
      }])
      .select()
      .single()

    if (error) throw error

    // Update referrer's referral count
    await supabase
      .rpc('increment_referral_count', { user_id: referrerId })

    return data
  },

  // Get user's referrals
  async getUserReferrals(userId: string) {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        id,
        referral_code,
        created_at,
        referee:referee_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('referrer_id', userId)

    if (error) throw error
    return data
  }
}

// Utility functions
export const generateReferralCode = (firstName: string): string => {
  const baseCode = firstName.slice(0, 4).toUpperCase() + '2024'
  return baseCode
}

export const validateReferralCode = (code: string): boolean => {
  return /^[A-Z]{1,4}2024\d*$/.test(code)
}