'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Search, 
  Download,
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Instagram,
  Linkedin,
  Filter,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface WaitlistUser {
  id: string
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  instagram_handle?: string
  linkedin_url?: string
  age_range: string
  neighborhood: string
  occupation: string
  interests: string[]
  marketing_opt_in: boolean
  referral_code: string
  referred_by?: string
  waitlist_position: number
  referral_count: number
  payment_completed: boolean
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<WaitlistUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'position' | 'created_at' | 'referral_count'>('position')
  const [filterBy, setFilterBy] = useState<'all' | 'with_referrals' | 'payment_complete'>('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        console.error('Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportUsers = async () => {
    try {
      const response = await fetch('/api/admin/export')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bb-waitlist-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const filteredAndSortedUsers = users
    .filter(user => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = 
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.neighborhood.toLowerCase().includes(searchLower) ||
          user.occupation.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }

      // Category filter
      if (filterBy === 'with_referrals' && user.referral_count === 0) return false
      if (filterBy === 'payment_complete' && !user.payment_completed) return false

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'position':
          return a.waitlist_position - b.waitlist_position
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'referral_count':
          return b.referral_count - a.referral_count
        default:
          return a.waitlist_position - b.waitlist_position
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[var(--color-primary-500)] mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
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
              <Users className="h-8 w-8 text-[var(--color-primary-500)] mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <span className="ml-3 text-sm text-gray-500">
                ({filteredAndSortedUsers.length} users)
              </span>
            </div>
            
            <Button
              onClick={exportUsers}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, neighborhood, or occupation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="with_referrals">With Referrals</option>
              <option value="payment_complete">Payment Complete</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
            >
              <option value="position">By Position</option>
              <option value="created_at">By Signup Date</option>
              <option value="referral_count">By Referrals</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center text-sm font-medium text-[var(--color-primary-600)]">
                          {user.waitlist_position}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{calculateAge(user.date_of_birth)} years old</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{user.neighborhood}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-32">{user.occupation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{user.referral_count}</div>
                        {user.referred_by && (
                          <div className="text-xs text-gray-500">
                            Referred by: {user.referred_by}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.payment_completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.payment_completed ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'No users have joined the waitlist yet.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredAndSortedUsers.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-primary-600)]">
                  {filteredAndSortedUsers.length}
                </div>
                <div className="text-sm text-gray-600">Total Users Shown</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredAndSortedUsers.filter(u => u.payment_completed).length}
                </div>
                <div className="text-sm text-gray-600">Payment Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredAndSortedUsers.reduce((sum, u) => sum + u.referral_count, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Referrals</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}