'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rateLimited, setRateLimited] = useState(false)

    // Check if already authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/auth', {
                    credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json()
                    if (data.authenticated) {
                        router.push('/admin')
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error)
            }
        }

        checkAuth()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setRateLimited(false)

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                // Login successful
                router.push('/admin')
            } else {
                setError(data.error || 'Login failed')
                if (data.rateLimited) {
                    setRateLimited(true)
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('Connection error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-16 w-16 bg-[var(--color-primary-500)] rounded-full flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">BB Admin Login</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Access the administration dashboard</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="sr-only">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email address"
                                className="relative block w-full border-gray-300 rounded-md focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]"
                            />
                        </div>

                        <div className="relative">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="relative block w-full pr-10 border-gray-300 rounded-md focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className={`rounded-md p-4 ${rateLimited ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}
                        >
                            <div className="flex">
                                <AlertCircle className={`h-5 w-5 ${rateLimited ? 'text-red-400' : 'text-yellow-400'}`} />
                                <div className="ml-3">
                                    <p className={`text-sm ${rateLimited ? 'text-red-800' : 'text-yellow-800'}`}>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 text-sm font-medium text-white bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500">Authorized personnel only. All access is logged.</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
