import { NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin-auth'
import { createClient } from '@/lib/supabase'

export const GET = withAdminAuth(async (admin, request) => {
  try {
    const supabase = createClient()
    
    // Get all users for export
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        waitlist_position,
        first_name,
        last_name,
        email,
        date_of_birth,
        age_range,
        neighborhood,
        occupation,
        interests,
        instagram_handle,
        linkedin_url,
        marketing_opt_in,
        referral_code,
        referred_by,
        referral_count,
        payment_completed,
        created_at
      `)
      .order('waitlist_position', { ascending: true })

    if (error) {
      console.error('Error fetching users for export:', error)
      throw error
    }

    // Convert to CSV format
    const csvHeader = [
      'Position',
      'First Name',
      'Last Name', 
      'Email',
      'Date of Birth',
      'Age Range',
      'Neighborhood',
      'Occupation',
      'Interests',
      'Instagram Handle',
      'LinkedIn URL',
      'Marketing Opt In',
      'Referral Code',
      'Referred By',
      'Referral Count',
      'Payment Completed',
      'Signup Date'
    ].join(',')

    const csvRows = (users || []).map(user => {
      // Calculate age from date_of_birth
      const calculateAge = (birthDate: string) => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--
        }
        
        return age
      }

      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US')
      }

      const escapeCSV = (value: any) => {
        if (value === null || value === undefined) return ''
        const str = String(value)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      return [
        user.waitlist_position || '',
        escapeCSV(user.first_name),
        escapeCSV(user.last_name),
        escapeCSV(user.email),
        user.date_of_birth || '',
        escapeCSV(user.age_range),
        escapeCSV(user.neighborhood),
        escapeCSV(user.occupation),
        escapeCSV((user.interests || []).join('; ')),
        escapeCSV(user.instagram_handle || ''),
        escapeCSV(user.linkedin_url || ''),
        user.marketing_opt_in ? 'Yes' : 'No',
        escapeCSV(user.referral_code),
        escapeCSV(user.referred_by || ''),
        user.referral_count || 0,
        user.payment_completed ? 'Yes' : 'No',
        formatDate(user.created_at)
      ].join(',')
    })

    const csvContent = [csvHeader, ...csvRows].join('\n')
    const filename = `bb-waitlist-export-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
})