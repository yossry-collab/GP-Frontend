'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Store, ShoppingCart, User, LogOut, Home, Star, Clock, TrendingUp, Gift, Zap, ChevronRight, BarChart3, Package, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import CartBadge from '@/components/CartBadge'

const featuredGames = [
    { title: 'Elden Ring', genre: 'Action RPG', rating: 4.9, emoji: '⚔️', gradient: 'from-neon-purple to-neon-violet' },
    { title: 'Cyberpunk 2077', genre: 'Open World', rating: 4.7, emoji: '🌃', gradient: 'from-neon-cyan to-neon-blue' },
    { title: 'Baldur\'s Gate 3', genre: 'RPG', rating: 4.9, emoji: '🐉', gradient: 'from-neon-pink to-neon-rose' },
    { title: 'Hogwarts Legacy', genre: 'Adventure', rating: 4.6, emoji: '🧙', gradient: 'from-neon-violet to-neon-purple' },
]

const recentlyPlayed = [
    { title: 'GTA V', hours: 124, emoji: '🚗' },
    { title: 'Minecraft', hours: 89, emoji: '⛏️' },
    { title: 'Fortnite', hours: 67, emoji: '🎯' },
    { title: 'Witcher 3', hours: 55, emoji: '🗡️' },
]

export default function DashboardPage() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    const sidebarItems = [
        { icon: Home, label: 'Dashboard', active: true, path: '/dashboard' },
        { icon: Store, label: 'Store', active: false, path: '/store' },
        { icon: ShoppingCart, label: 'Cart', active: false, path: '/cart' },
        { icon: Package, label: 'My Orders', active: false, path: '#' },
        { icon: User, label: 'Profile', active: false, path: '#' },
    ]

    const stats = [
        { label: 'Products Available', value: '62', icon: Package, gradient: 'from-neon-purple to-neon-violet' },
        { label: 'Total Saved', value: '$148', icon: TrendingUp, gradient: 'from-neon-pink to-neon-rose' },
        { label: 'Orders', value: '3', icon: ShoppingCart, gradient: 'from-neon-blue to-neon-cyan' },
        { label: 'Rewards Points', value: '420', icon: Star, gradient: 'from-neon-cyan to-neon-blue' },
    ]

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neon-dark flex">
                {/* Sidebar */}
                <motion.aside
                    className="hidden md:flex flex-col w-64 bg-neon-darker border-r border-white/5 p-5 sticky top-0 h-screen"
                    initial={{ x: -64 }}
                    animate={{ x: 0 }}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-10 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="w-9 h-9 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-extrabold">GAME<span className="text-neon-gradient">VERSE</span></span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1.5">
                        {sidebarItems.map(item => (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active
                                        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-pink/10 text-white border border-neon-purple/20'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${item.active ? 'text-neon-purple' : ''}`} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* User */}
                    <div className="glass rounded-xl p-4 mt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-sm font-bold">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user?.username || 'User'}</p>
                                <p className="text-[10px] text-gray-500 truncate">{user?.email || ''}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Top bar (mobile) */}
                    <div className="md:hidden sticky top-0 z-50 glass-strong px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                                <Gamepad2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-sm font-bold">GAME<span className="text-neon-gradient">VERSE</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CartBadge />
                            <button onClick={() => router.push('/store')} className="text-xs text-gray-400">Store</button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 max-w-6xl relative">
                        {/* Background orb */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />

                        {/* Welcome */}
                        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h1 className="text-3xl font-black mb-1">
                                Welcome back, <span className="text-neon-gradient">{user?.username || 'Gamer'}</span>
                            </h1>
                            <p className="text-gray-500 text-sm">Here's what's happening with your account</p>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={stat.label}
                                    className="glass rounded-2xl p-5 card-glow"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Featured Games */}
                        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold">Featured <span className="text-neon-gradient">Games</span></h2>
                                <button onClick={() => router.push('/store')} className="text-xs text-neon-purple hover:text-neon-pink font-medium flex items-center gap-1 transition-colors">
                                    View All <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {featuredGames.map((game, idx) => (
                                    <motion.div
                                        key={game.title}
                                        className="group bg-neon-card border border-white/5 rounded-2xl overflow-hidden cursor-pointer card-glow"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.05 }}
                                        onClick={() => router.push('/store')}
                                    >
                                        <div className={`h-28 bg-gradient-to-br ${game.gradient} flex items-center justify-center relative`}>
                                            <span className="text-5xl">{game.emoji}</span>
                                            <div className="absolute inset-0 bg-black/20" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-white text-sm group-hover:text-neon-purple transition-colors">{game.title}</h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500">{game.genre}</span>
                                                <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                                                    <Star className="w-3 h-3 fill-yellow-400" /> {game.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recently Played + Quick Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div
                                className="glass rounded-2xl p-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-neon-purple" /> Recently Played
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {recentlyPlayed.map((game, idx) => (
                                        <div key={game.title} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{game.emoji}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{game.title}</p>
                                                    <p className="text-[10px] text-gray-600">{game.hours} hours played</p>
                                                </div>
                                            </div>
                                            <div className="w-24 h-1.5 bg-neon-dark rounded-full overflow-hidden">
                                                <div className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-pink" style={{ width: `${Math.min(100, game.hours)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                className="glass rounded-2xl p-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-neon-cyan" /> Quick Actions
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Store, label: 'Browse Store', path: '/store', gradient: 'from-neon-purple to-neon-violet' },
                                        { icon: ShoppingCart, label: 'View Cart', path: '/cart', gradient: 'from-neon-pink to-neon-rose' },
                                        { icon: Gift, label: 'Gift Cards', path: '/store', gradient: 'from-neon-cyan to-neon-blue' },
                                        { icon: Star, label: 'Deals', path: '/store', gradient: 'from-neon-violet to-neon-purple' },
                                    ].map(action => (
                                        <button
                                            key={action.label}
                                            onClick={() => router.push(action.path)}
                                            className="flex flex-col items-center gap-2 p-4 bg-neon-dark border border-white/5 rounded-xl hover:border-neon-purple/30 hover:bg-neon-purple/5 transition-all"
                                        >
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                                                <action.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-400">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
