'use client'

import { Gamepad2, Store, ShoppingCart, User, LogOut, Home, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { useRouter, usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navLinks = isAuthenticated
    ? [
        ...(isAdmin ? [{ href: '/dashboard', label: 'Dashboard', icon: Home }] : []),
        { href: '/store', label: 'Store', icon: Store },
        { href: '/cart', label: 'Cart', icon: ShoppingCart },
        { href: '/profile', label: 'Profile', icon: User },
      ]
    : [
        { href: '/store', label: 'Store', icon: Store },
      ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => router.push(isAuthenticated ? (isAdmin ? '/dashboard' : '/store') : '/')}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-glow-sm">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
            GAME<span className="text-gradient">VERSE</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
              {link.href === '/cart' && itemCount > 0 && (
                <span className="ml-0.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* User avatar */}
              <button
                onClick={() => router.push('/profile')}
                className="hidden md:flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                  {user?.username}
                </span>
              </button>

              {/* Logout desktop */}
              <button
                onClick={handleLogout}
                className="hidden md:flex w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500/30 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="btn-primary px-5 py-2 text-sm"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-gray-200 dark:border-white/[0.06]"
          >
            <div className="p-4 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => { router.push(link.href); setMobileOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {link.href === '/cart' && itemCount > 0 && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-[11px] font-bold text-white flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              ))}

              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <div className="pt-2 space-y-2">
                  <button onClick={() => { router.push('/login'); setMobileOpen(false) }} className="w-full py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => { router.push('/register'); setMobileOpen(false) }} className="w-full btn-primary py-2.5 text-sm">
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
