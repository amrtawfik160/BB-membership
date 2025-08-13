import { getAdminSession } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Check authentication server-side
  const session = getAdminSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}