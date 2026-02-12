'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Shield, Package, ShoppingCart, Settings, Edit3, Save, X, Users, Upload, BarChart3, Clock, ChevronRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { ordersAPI } from '@/lib/api'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

interface Order {
    _id: string
    products: { product: { name: string; price: number }; quantity: number }[]
    totalAmount: number
    status: string
    createdAt: string
}

export default function ProfilePage() {
    const { user } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview')
    const isAdmin = user?.role === 'admin'

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await ordersAPI.getMyOrders()
            setOrders(Array.isArray(res.data) ? res.data : [])
        } catch {
        } finally {
            setLoadingOrders(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400'
        }
    }

    const tabs = [
        { key: 'overview' as const, label: 'Overview', icon: User },
        { key: 'orders' as const, label: 'Orders', icon: Package },
        { key: 'settings' as const, label: 'Settings', icon: Settings },
    ]

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
                <Navbar />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    {/* Profile Header */}
                    <motion.div
                        className="card p-6 md:p-8 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-3xl font-bold text-white shadow-glow-sm flex-shrink-0">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white truncate">{user?.username || 'User'}</h1>
                                    {isAdmin && (
                                        <span className="px-2.5 py-0.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mb-3">{user?.email || 'No email'}</p>
                                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" /> {user?.email || '-'}
                                    </span>
                                    {user?.phonenumber && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" /> {user.phonenumber}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5" /> {user?.role || 'user'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Admin Panel */}
                    {isAdmin && (
                        <motion.div
                            className="mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary-500" /> Admin Panel
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { icon: Users, label: 'Manage Users', desc: 'View and manage all users', path: '/dashboard', color: 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400' },
                                    { icon: Package, label: 'Manage Products', desc: 'Add, edit, or remove products', path: '/dashboard', color: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400' },
                                    { icon: Upload, label: 'Import Products', desc: 'Bulk import via CSV', path: '/dashboard', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
                                ].map((item, idx) => (
                                    <motion.button
                                        key={item.label}
                                        onClick={() => router.push(item.path)}
                                        className="card-hover p-5 text-left group"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + idx * 0.05 }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.label}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] rounded-xl p-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-1 justify-center transition-all ${activeTab === tab.key
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-glow-sm'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Account Info */}
                            <div className="card p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary-500" /> Account Information
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Username', value: user?.username || '-', icon: User },
                                        { label: 'Email', value: user?.email || '-', icon: Mail },
                                        { label: 'Phone', value: user?.phonenumber || 'Not provided', icon: Phone },
                                        { label: 'Role', value: user?.role || 'user', icon: Shield },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-white/[0.04] last:border-0">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center">
                                                <item.icon className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="card p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-primary-500" /> Account Stats
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingCart, color: 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400' },
                                        { label: 'Completed', value: orders.filter(o => o.status === 'completed').length.toString(), icon: Package, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' },
                                        { label: 'Pending', value: orders.filter(o => o.status === 'pending').length.toString(), icon: Clock, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' },
                                        { label: 'Total Spent', value: `$${orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toFixed(0)}`, icon: BarChart3, color: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400' },
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-gray-50 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.06] rounded-xl p-4 text-center">
                                            <div className={`w-8 h-8 rounded-lg ${stat.color} mx-auto flex items-center justify-center mb-2`}>
                                                <stat.icon className="w-4 h-4" />
                                            </div>
                                            <p className="text-xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="card overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-white/[0.04]">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Package className="w-4 h-4 text-primary-500" /> Order History
                                    </h3>
                                </div>

                                {loadingOrders ? (
                                    <div className="p-10 text-center">
                                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <div className="text-5xl mb-3 opacity-30">📦</div>
                                        <p className="text-gray-500 text-sm mb-4">No orders yet</p>
                                        <button onClick={() => router.push('/store')} className="btn-primary px-5 py-2.5 text-xs">
                                            Browse Store
                                        </button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                                        {orders.map((order, idx) => (
                                            <motion.div
                                                key={order._id}
                                                className="p-5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-mono text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-bold text-gradient">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500">
                                                        {order.products?.length || 0} item(s) &middot; {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="card p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-primary-500" /> Account Settings
                                </h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Username</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.username || ''}
                                            className="input"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email || ''}
                                            className="input"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            defaultValue={user?.phonenumber || ''}
                                            className="input"
                                            disabled
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-white/[0.06] pt-5">
                                        <p className="text-xs text-gray-400 mb-4">Contact support to update your account information.</p>
                                        <button className="btn-outline px-5 py-2.5 text-sm" disabled>
                                            Update Profile (Coming Soon)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
