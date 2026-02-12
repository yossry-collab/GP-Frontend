'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Store, ShoppingCart, Star, Clock, TrendingUp, Gift, Zap, ChevronRight, Package, User } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

const featuredGames = [
    { title: 'Elden Ring', genre: 'Action RPG', rating: 4.9, emoji: '⚔️', color: 'bg-primary-100 dark:bg-primary-500/15' },
    { title: 'Cyberpunk 2077', genre: 'Open World', rating: 4.7, emoji: '🌃', color: 'bg-blue-100 dark:bg-blue-500/15' },
    { title: 'Baldur\'s Gate 3', genre: 'RPG', rating: 4.9, emoji: '🐉', color: 'bg-pink-100 dark:bg-pink-500/15' },
    { title: 'Hogwarts Legacy', genre: 'Adventure', rating: 4.6, emoji: '🧙', color: 'bg-amber-100 dark:bg-amber-500/15' },
]

const recentlyPlayed = [
    { title: 'GTA V', hours: 124, emoji: '🚗' },
    { title: 'Minecraft', hours: 89, emoji: '⛏️' },
    { title: 'Fortnite', hours: 67, emoji: '🎯' },
    { title: 'Witcher 3', hours: 55, emoji: '🗡️' },
]

export default function DashboardPage() {
    const { user } = useAuth()
    const router = useRouter()

    const stats = [
        { label: 'Products Available', value: '62', icon: Package, color: 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400' },
        { label: 'Total Saved', value: '$148', icon: TrendingUp, color: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400' },
        { label: 'Orders', value: '3', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
        { label: 'Rewards Points', value: '420', icon: Star, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' },
    ]

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    {/* Welcome */}
                    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                            Welcome back, <span className="text-gradient">{user?.username || 'Gamer'}</span>
                        </h1>
                        <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening with your account</p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                className="card p-5"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Featured Games */}
                    <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured <span className="text-gradient">Games</span></h2>
                            <button onClick={() => router.push('/store')} className="text-xs text-primary-600 dark:text-primary-400 hover:text-accent-500 font-medium flex items-center gap-1 transition-colors">
                                View All <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {featuredGames.map((game, idx) => (
                                <motion.div
                                    key={game.title}
                                    className="card-hover group overflow-hidden cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    onClick={() => router.push('/store')}
                                >
                                    <div className={`h-28 ${game.color} flex items-center justify-center`}>
                                        <span className="text-5xl">{game.emoji}</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{game.title}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">{game.genre}</span>
                                            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                                                <Star className="w-3 h-3 fill-amber-500" /> {game.rating}
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
                            className="card p-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary-500" /> Recently Played
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {recentlyPlayed.map(game => (
                                    <div key={game.title} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/[0.04] last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{game.emoji}</span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{game.title}</p>
                                                <p className="text-[10px] text-gray-400">{game.hours} hours played</p>
                                            </div>
                                        </div>
                                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${Math.min(100, game.hours)}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="card p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary-500" /> Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: Store, label: 'Browse Store', path: '/store', color: 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400' },
                                    { icon: ShoppingCart, label: 'View Cart', path: '/cart', color: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400' },
                                    { icon: Gift, label: 'Gift Cards', path: '/store', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
                                    { icon: User, label: 'Profile', path: '/profile', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' },
                                ].map(action => (
                                    <button
                                        key={action.label}
                                        onClick={() => router.push(action.path)}
                                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.06] rounded-xl hover:border-primary-300 dark:hover:border-primary-500/20 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all"
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                                            <action.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
