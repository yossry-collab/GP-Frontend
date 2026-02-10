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
            // Store the attempted URL to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', pathname)
            router.push('/')
        }
    }, [isAuthenticated, isLoading, router, pathname])

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-[#1a1a2e] to-gaming-darker flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gaming-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    // Only render children if authenticated
    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
