'use client'

import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Download,
  LogOut,
  Mail,
  RefreshCw,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalUsers: number
  todaySignups: number
  totalReferrals: number
  conversionRate: number
  topReferrers: Array<{
    name: string
    referralCount: number
    position: number
  }>
  recentSignups: Array<{
    id: string
    name: string
    email: string
    position: number
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    loadDashboardData()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setUser(data.user)
        } else {
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to load dashboard stats')
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[var(--color-primary-500)] mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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
              <Shield className="h-8 w-8 text-[var(--color-primary-500)] mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">BB Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today&apos;s Signups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todaySignups}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-md">
                <BarChart3 className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Referrers */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Referrers</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.topReferrers.map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center text-sm font-medium text-[var(--color-primary-600)]">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{referrer.name}</p>
                        <p className="text-sm text-gray-500">Position #{referrer.position}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {referrer.referralCount} referrals
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Signups</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentSignups.map((signup) => (
                  <div key={signup.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{signup.name}</p>
                      <p className="text-sm text-gray-500">{signup.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">#{signup.position}</p>
                      <p className="text-sm text-gray-500">{formatDate(signup.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            onClick={() => router.push('/admin/users')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Manage Users
          </Button>
          
          <Button
            onClick={() => router.push('/admin/analytics')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Button>
          
          <Button
            onClick={() => router.push('/admin/export')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </main>
    </div>
  )
}