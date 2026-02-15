'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Home, Grid, BookOpen, Users, Heart, Download, Settings, HelpCircle, Search, Bell, Mail, LogOut, User, TrendingUp, Star } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import CartBadge from './CartBadge'

export default function DashboardLayout() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    const sidebarVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    const navItems = [
        { icon: Home, label: 'Dashboard', active: true, path: '/dashboard' },
        { icon: Grid, label: 'Store', active: false, path: '/store' },
        { icon: BookOpen, label: 'Library', active: false, path: '#' },
        { icon: Users, label: 'Community', active: false, path: '#' },
        { icon: Heart, label: 'Wishlist', active: false, path: '#' },
        { icon: Download, label: 'Downloads', active: false, path: '#' },
    ]

    const stats = [
        { icon: Gamepad2, label: 'Games Owned', value: '12', color: 'from-gaming-accent to-gaming-orange' },
        { icon: Heart, label: 'Wishlist Items', value: '8', color: 'from-gaming-pink to-gaming-accent' },
        { icon: TrendingUp, label: 'Hours Played', value: '156', color: 'from-gaming-cyan to-gaming-blue' },
        { icon: Star, label: 'Achievements', value: '47', color: 'from-gaming-orange to-gaming-pink' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-[#1a1a2e] to-gaming-darker flex">
            {/* SIDEBAR */}
            <motion.div
                className="w-64 bg-gradient-to-b from-black/70 to-gaming-dark/90 border-r border-white/10 backdrop-blur-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] fixed h-full z-50"
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo */}
                <motion.div
                    className="p-6 border-b border-white/5"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-gaming-accent to-gaming-orange rounded-lg">
                            <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-gaming-accent via-gaming-pink to-gaming-orange bg-clip-text text-transparent">
                                GAME PLUG
                            </h1>
                            <p className="text-xs text-gray-400">Enter the universe</p>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation */}
                <motion.div
                    className="flex-1 py-6 px-3 space-y-2 overflow-y-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {navItems.map((item) => (
                        <motion.button
                            key={item.label}
                            onClick={() => item.path !== '#' && router.push(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                                    ? 'bg-gradient-to-r from-gaming-accent/20 to-gaming-orange/20 text-white border border-gaming-accent/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            variants={itemVariants}
                            whileHover={{ x: 5 }}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Bottom Section */}
                <motion.div className="border-t border-white/5 p-4 space-y-2">
                    {[
                        { icon: Settings, label: 'Settings' },
                        { icon: HelpCircle, label: 'Help' },
                    ].map((item) => (
                        <motion.button
                            key={item.label}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            whileHover={{ x: 5 }}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </motion.button>
                    ))}
                    <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                        whileHover={{ x: 5 }}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* MAIN CONTENT */}
            <div className="flex-1 ml-64">
                {/* TOP BAR */}
                <motion.div
                    className="h-16 bg-black/50 border-b border-white/10 backdrop-blur-2xl flex items-center justify-between px-8 shadow-lg sticky top-0 z-40"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search games, DLCs, updates..."
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gaming-accent transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <CartBadge />
                        <motion.button
                            className="p-2 text-gray-400 hover:text-white transition-colors relative"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bell className="w-5 h-5" />
                            <div className="absolute top-1 right-1 w-2 h-2 bg-gaming-accent rounded-full" />
                        </motion.button>
                        <motion.button
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Mail className="w-5 h-5" />
                        </motion.button>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gaming-accent to-gaming-orange flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{user?.username || 'Player'}</p>
                                <p className="text-xs text-gray-400">{user?.role || 'user'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CONTENT AREA */}
                <div className="p-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* Welcome Section */}
                        <motion.div variants={itemVariants}>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-gaming-accent to-gaming-orange bg-clip-text text-transparent mb-2">
                                Welcome back, {user?.username}! 🎮
                            </h1>
                            <p className="text-gray-400 text-lg">Ready to continue your gaming journey?</p>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={itemVariants}>
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-gaming-accent/30 transition-all"
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 51, 51, 0.2)' }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { title: 'Browse Store', desc: 'Discover new games', color: 'from-gaming-accent to-gaming-orange' },
                                    { title: 'My Library', desc: 'Access your games', color: 'from-gaming-pink to-gaming-accent' },
                                    { title: 'Wishlist', desc: 'Track favorite games', color: 'from-gaming-cyan to-gaming-blue' },
                                ].map((action, index) => (
                                    <motion.button
                                        key={action.title}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-left hover:border-gaming-accent/30 transition-all"
                                        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 51, 51, 0.2)' }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className={`text-lg font-bold bg-gradient-to-r ${action.color} bg-clip-text text-transparent mb-2`}>
                                            {action.title}
                                        </div>
                                        <div className="text-sm text-gray-400">{action.desc}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-gaming-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                    animate={{
                        y: [0, 50, 0],
                        x: [0, 30, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 left-1/3 w-96 h-96 bg-gaming-purple rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                    animate={{
                        y: [0, -50, 0],
                        x: [0, -30, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />
            </div>
        </div>
    )
}
