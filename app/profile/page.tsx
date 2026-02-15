'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Shield, Package, ShoppingCart, Settings, Edit3, Save, X, Users, Upload, BarChart3, Clock, ChevronRight, Lock, Eye, EyeOff, Check } from 'lucide-react'
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
    const { user, updateProfile } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'settings'>('overview')
    const isAdmin = user?.role === 'admin'

    // Profile edit state
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phonenumber: user?.phonenumber || '',
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
    const [changingPassword, setChangingPassword] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phonenumber: user.phonenumber || '',
            })
        }
    }, [user])

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await ordersAPI.getUserOrders()
            setOrders(Array.isArray(res.data) ? res.data : [])
        } catch {
        } finally {
            setLoadingOrders(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            setSaving(true)
            setProfileMsg(null)
            await updateProfile({
                username: formData.username,
                email: formData.email,
                phonenumber: formData.phonenumber,
            })
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
            setIsEditing(false)
        } catch (err: any) {
            setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' })
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setProfileMsg({ type: 'error', text: 'New passwords do not match' })
                return
            }
            if (passwordData.newPassword.length < 6) {
                setProfileMsg({ type: 'error', text: 'New password must be at least 6 characters' })
                return
            }
            setSaving(true)
            setProfileMsg(null)
            await updateProfile({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })
            setProfileMsg({ type: 'success', text: 'Password changed successfully!' })
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setChangingPassword(false)
        } catch (err: any) {
            setProfileMsg({ type: 'error', text: err.message || 'Failed to change password' })
        } finally {
            setSaving(false)
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setProfileMsg(null)
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
            phonenumber: user?.phonenumber || '',
        })
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            {/* Success / Error Message */}
                            {profileMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${profileMsg.type === 'success'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                        : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                                        }`}
                                >
                                    {profileMsg.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    {profileMsg.text}
                                </motion.div>
                            )}

                            {/* Profile Information */}
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-primary-500" /> Profile Information
                                    </h3>
                                    {!isEditing ? (
                                        <motion.button
                                            onClick={() => { setIsEditing(true); setProfileMsg(null) }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" /> Edit
                                        </motion.button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                onClick={handleCancelEdit}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <X className="w-3.5 h-3.5" /> Cancel
                                            </motion.button>
                                            <motion.button
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {saving ? (
                                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Save className="w-3.5 h-3.5" />
                                                )}
                                                Save
                                            </motion.button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                className="input pl-10"
                                                disabled={!isEditing}
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="input pl-10"
                                                disabled={!isEditing}
                                                placeholder="Email"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phonenumber}
                                                onChange={e => setFormData({ ...formData, phonenumber: e.target.value })}
                                                className="input pl-10"
                                                disabled={!isEditing}
                                                placeholder="Phone Number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Change Password */}
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-primary-500" /> Change Password
                                    </h3>
                                    {!changingPassword && (
                                        <motion.button
                                            onClick={() => { setChangingPassword(true); setProfileMsg(null) }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" /> Change
                                        </motion.button>
                                    )}
                                </div>

                                {changingPassword ? (
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type={showPasswords.current ? 'text' : 'password'}
                                                    value={passwordData.currentPassword}
                                                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="input pl-10 pr-10"
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type={showPasswords.new ? 'text' : 'password'}
                                                    value={passwordData.newPassword}
                                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="input pl-10 pr-10"
                                                    placeholder="Enter new password (min 6 chars)"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type={showPasswords.confirm ? 'text' : 'password'}
                                                    value={passwordData.confirmPassword}
                                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="input pl-10 pr-10"
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <motion.button
                                                onClick={() => {
                                                    setChangingPassword(false)
                                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                                    setProfileMsg(null)
                                                }}
                                                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <X className="w-3.5 h-3.5" /> Cancel
                                            </motion.button>
                                            <motion.button
                                                onClick={handleChangePassword}
                                                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all disabled:opacity-50"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {saving ? (
                                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Save className="w-3.5 h-3.5" />
                                                )}
                                                Update Password
                                            </motion.button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Click &quot;Change&quot; to update your password. You will need to provide your current password.</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
