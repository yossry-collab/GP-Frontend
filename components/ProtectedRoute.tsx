'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            sessionStorage.setItem('redirectAfterLogin', pathname)
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router, pathname])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) return null

    return <>{children}</>
}
