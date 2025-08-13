import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase';

export const GET = withAdminAuth(async (admin: any, request) => {
  try {
    const supabase = createClient();
    
    // Get total users count
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total users:', countError);
      throw countError;
    }

    // Get today's signups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count: todaySignups, error: todayError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (todayError) {
      console.error('Error getting today signups:', todayError);
    }

    // Get total referrals count
    const { count: totalReferrals, error: referralsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .not('referred_by', 'is', null);

    if (referralsError) {
      console.error('Error getting referrals:', referralsError);
    }

    // Calculate conversion rate (simplified - can be made more complex)
    const conversionRate = totalUsers && totalUsers > 0 
      ? Math.round(((totalReferrals || 0) / totalUsers) * 100)
      : 0;

    // Get top referrers
    const { data: topReferrers, error: topReferrersError } = await supabase
      .from('users')
      .select('first_name, last_name, referral_count, waitlist_position')
      .gt('referral_count', 0)
      .order('referral_count', { ascending: false })
      .limit(5);

    if (topReferrersError) {
      console.error('Error getting top referrers:', topReferrersError);
    }

    // Get recent signups
    const { data: recentSignups, error: recentError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, waitlist_position, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error getting recent signups:', recentError);
    }

    // Format the data
    const formattedTopReferrers = (topReferrers || []).map(user => ({
      name: `${user.first_name} ${user.last_name}`,
      referralCount: user.referral_count || 0,
      position: user.waitlist_position || 0,
    }));

    const formattedRecentSignups = (recentSignups || []).map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      position: user.waitlist_position || 0,
      createdAt: user.created_at,
    }));

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      todaySignups: todaySignups || 0,
      totalReferrals: totalReferrals || 0,
      conversionRate,
      topReferrers: formattedTopReferrers,
      recentSignups: formattedRecentSignups,
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
});