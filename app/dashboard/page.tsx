'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart3, Users, Package, Upload, Search, Plus, Edit3, Trash2, Save, X,
    Shield, AlertCircle, Check, FileText, RefreshCw,
    Home, ChevronLeft, Menu
} from 'lucide-react'
import {
    AreaChart, Area, Bar, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Line
} from 'recharts'
import { useAuth } from '@/lib/auth-context'
import { usersAPI, productsAPI, adminAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

// ─── Types ──────────────────────────────────────────────
interface UserType {
    _id: string; username: string; email: string; phonenumber?: string; role: string; createdAt?: string
}
interface ProductType {
    _id: string; name: string; description?: string; price: number; category: string; image?: string; stock: number; createdAt?: string
}
interface StatsData {
    totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number
    completedOrders: number; pendingOrders: number; failedOrders: number
    monthlyOrders: { month: string; year: number; orders: number; revenue: number; completed: number; pending: number; failed: number }[]
    monthlyUsers: { month: string; year: number; users: number }[]
    categories: Record<string, number>
    recentUsers: UserType[]
}

type Page = 'overview' | 'users' | 'products' | 'import'

const PIE_COLORS = ['#3366FF', '#00B8D9', '#FFAB00', '#FF5630']

// ─── Main Dashboard ─────────────────────────────────────
export default function DashboardPage() {
    const { user } = useAuth()
    const router = useRouter()
    const isAdmin = user?.role === 'admin'
    const [activePage, setActivePage] = useState<Page>('overview')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        if (user && !isAdmin) router.push('/store')
    }, [user, isAdmin, router])

    if (!isAdmin) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center">
                    <div className="text-center">
                        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                        <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
                        <button onClick={() => router.push('/store')} className="btn-primary px-6 py-3 text-sm">Go to Store</button>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    const sidebarItems: { key: Page; label: string; icon: React.ElementType }[] = [
        { key: 'overview', label: 'Dashboard', icon: Home },
        { key: 'users', label: 'User', icon: Users },
        { key: 'products', label: 'Product', icon: Package },
        { key: 'import', label: 'CSV Import', icon: Upload },
    ]

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0b0b11] flex">
                {/* ── Sidebar ── */}
                <aside className={`fixed left-0 top-0 h-full z-40 bg-white dark:bg-[#16161f] border-r border-gray-200 dark:border-white/[0.06] transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-[260px]' : 'w-[80px]'}`}>
                    {/* Logo */}
                    <div className="h-[72px] flex items-center px-5 border-b border-gray-100 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/store')}>
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-glow-sm flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            {sidebarOpen && <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">GAME<span className="text-gradient">VERSE</span></span>}
                        </div>
                    </div>

                    {/* User Card */}
                    {sidebarOpen && (
                        <div className="mx-4 mt-5 mb-2 p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.username || 'Admin'}</p>
                                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Nav Items */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {sidebarItems.map(item => {
                            const active = activePage === item.key
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => setActivePage(item.key)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        active
                                            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </button>
                            )
                        })}
                    </nav>

                    {/* Collapse Button */}
                    <div className="px-3 py-4 border-t border-gray-100 dark:border-white/[0.04]">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all"
                        >
                            <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
                            {sidebarOpen && <span>Collapse</span>}
                        </button>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[260px]' : 'ml-[80px]'}`}>
                    {/* Top Bar */}
                    <header className="sticky top-0 z-30 h-[72px] bg-white/80 dark:bg-[#16161f]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06] flex items-center justify-between px-6">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]">
                            <Menu className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="relative hidden sm:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/[0.04] border border-transparent focus:border-gray-200 dark:focus:border-white/[0.08] rounded-xl text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none transition-all" />
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => router.push('/store')} className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-white/[0.04] rounded-lg hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all">
                                Visit Store
                            </button>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer" onClick={() => router.push('/profile')}>
                                {user?.username?.charAt(0).toUpperCase() || 'A'}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-6 lg:p-8">
                        <AnimatePresence mode="wait">
                            {activePage === 'overview' && <OverviewPage key="overview" username={user?.username || 'Admin'} />}
                            {activePage === 'users' && <UsersPage key="users" />}
                            {activePage === 'products' && <ProductsPage key="products" />}
                            {activePage === 'import' && <ImportPage key="import" />}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}

// ═══════════════════════════════════════════════════════════
// ─── SPARKLINE COMPONENT (Minimal UI style) ───────────────
// ═══════════════════════════════════════════════════════════
function Sparkline({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
    const chartData = data.map((v, i) => ({ v, i }))
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                <defs>
                    <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                    </linearGradient>
                </defs>
                <Area type="natural" dataKey="v" stroke={color} strokeWidth={2.5} fill={`url(#spark-${color.replace('#', '')})`} dot={false} isAnimationActive={true} animationDuration={1200} />
            </AreaChart>
        </ResponsiveContainer>
    )
}

// Custom label renderer for pie chart (Minimal UI style with lines)
const renderCustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius + 30
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
        <text x={x} y={y} fill="#637381" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={600}>
            {name} {((percent || 0) * 100).toFixed(1)}%
        </text>
    )
}

// ═══════════════════════════════════════════════════════════
// ─── OVERVIEW PAGE (Minimal UI style) ─────────────────────
// ═══════════════════════════════════════════════════════════
function OverviewPage({ username }: { username: string }) {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const res = await adminAPI.getStats()
                setStats(res.data)
            } catch (err) {
                console.error('Failed to load stats', err)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return (
            <motion.div className="flex items-center justify-center h-[60vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
        )
    }

    if (!stats) {
        return (
            <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Failed to load dashboard data</p>
            </motion.div>
        )
    }

    // Generate sparkline data from monthly stats (smooth curves)
    const salesSparkline = stats.monthlyOrders.map(m => m.revenue || 0)
    const usersSparkline = stats.monthlyUsers.map(m => m.users || 0)
    const ordersSparkline = stats.monthlyOrders.map(m => m.orders || 0)
    const productsSparkline = stats.monthlyOrders.map((_, i) => Math.max(1, stats.totalProducts - Math.floor(Math.random() * 5) + i))

    const statCards = [
        { label: 'Weekly Sales', value: `$${stats.totalRevenue.toLocaleString()}`, sparkline: salesSparkline, color: '#00A76F', bg: 'bg-[#C8FAD6]/60 dark:bg-[#00A76F]/10', textColor: 'text-[#004B50] dark:text-[#5BE49B]' },
        { label: 'New Users', value: stats.totalUsers.toLocaleString(), sparkline: usersSparkline, color: '#006C9C', bg: 'bg-[#CAFDF5]/60 dark:bg-[#006C9C]/10', textColor: 'text-[#003768] dark:text-[#61F3F3]' },
        { label: 'Item Orders', value: stats.totalOrders.toLocaleString(), sparkline: ordersSparkline, color: '#B76E00', bg: 'bg-[#FFF5CC]/60 dark:bg-[#B76E00]/10', textColor: 'text-[#7A4100] dark:text-[#FFD666]' },
        { label: 'Total Products', value: stats.totalProducts.toLocaleString(), sparkline: productsSparkline, color: '#B71D18', bg: 'bg-[#FFE9D5]/60 dark:bg-[#B71D18]/10', textColor: 'text-[#7A0916] dark:text-[#FFAC82]' },
    ]

    // Website Visits chart data (bar + line combo like Minimal UI)
    const websiteVisitsData = stats.monthlyOrders.map((mo, i) => ({
        name: mo.month.substring(0, 3),
        completed: mo.completed || 0,
        pending: mo.pending || 0,
        failed: mo.failed || 0,
        total: mo.orders || 0,
    }))

    // Current Visits pie data (categories)
    const currentVisitsData = Object.entries(stats.categories).map(([name, value]) => ({
        name: name === 'gift-card' ? 'Gift Cards' : name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }))
    const currentVisitsColors = ['#3366FF', '#00B8D9', '#FFAB00', '#FF5630']

    // Conversion rates (order status) for bottom bar chart
    const conversionData = [
        { name: 'Completed', value: stats.completedOrders, color: '#00A76F' },
        { name: 'Pending', value: stats.pendingOrders, color: '#FFAB00' },
        { name: 'Failed', value: stats.failedOrders, color: '#FF5630' },
    ]
    const totalOrdersForRate = stats.totalOrders || 1

    const tooltipStyle = {
        backgroundColor: 'rgba(255,255,255,0.96)',
        border: 'none',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '12px',
        boxShadow: '0 0 2px rgba(145,158,171,0.24), -20px 20px 40px -4px rgba(145,158,171,0.24)',
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-[1.5rem] font-bold text-gray-900 dark:text-white">Hi, Welcome back 👋</h1>
                <p className="text-sm text-gray-500 mt-1">{username}&apos;s dashboard overview</p>
            </div>

            {/* ── Stat Cards (Minimal UI style with sparkline) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        className={`${card.bg} rounded-2xl p-6 relative overflow-hidden`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                        {/* Decorative circle */}
                        <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full opacity-[0.08]" style={{ backgroundColor: card.color }} />
                        
                        {/* Sparkline on top right */}
                        <div className="absolute top-4 right-4 w-24 h-14">
                            <Sparkline data={card.sparkline} color={card.color} height={56} />
                        </div>

                        <div className="relative z-10">
                            <h3 className={`text-3xl font-extrabold tracking-tight ${card.textColor}`}>
                                {card.value}
                            </h3>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">
                                {card.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Charts Row: Website Visits + Current Visits ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Website Visits (Bar + Line combo) - 2/3 width */}
                <motion.div
                    className="lg:col-span-2 bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <div className="mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Website Visits</h3>
                        <p className="text-sm text-gray-400 mt-0.5">(+43%) than last year</p>
                    </div>
                    <ResponsiveContainer width="100%" height={340}>
                        <ComposedChart data={websiteVisitsData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="barCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3366FF" stopOpacity={0.85} />
                                    <stop offset="100%" stopColor="#3366FF" stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="barPending" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00B8D9" stopOpacity={0.85} />
                                    <stop offset="100%" stopColor="#00B8D9" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F6F8" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#919EAB' }} dy={8} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#919EAB' }} dx={-8} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(145,158,171,0.08)' }} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px', paddingTop: '16px', color: '#637381' }} />
                            <Bar dataKey="completed" name="Completed" fill="url(#barCompleted)" radius={[4, 4, 0, 0]} barSize={16} />
                            <Bar dataKey="pending" name="Pending" fill="url(#barPending)" radius={[4, 4, 0, 0]} barSize={16} />
                            <Line type="natural" dataKey="total" name="Total Orders" stroke="#FFAB00" strokeWidth={3} dot={false} strokeDasharray="" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Current Visits (Donut Pie) - 1/3 width */}
                <motion.div
                    className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6 flex flex-col"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Visits</h3>
                        <p className="text-sm text-gray-400 mt-0.5">Product distribution by category</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={currentVisitsData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                    label={renderCustomPieLabel}
                                    labelLine={{ stroke: '#DFE3E8', strokeWidth: 1 }}
                                    isAnimationActive={true}
                                    animationDuration={1000}
                                >
                                    {currentVisitsData.map((_, i) => (
                                        <Cell key={i} fill={currentVisitsColors[i % currentVisitsColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
                        {currentVisitsData.map((entry, i) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentVisitsColors[i % currentVisitsColors.length] }} />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Bottom Row: Conversion Rates + User Registrations ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Conversion Rates (horizontal bar chart) */}
                <motion.div
                    className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Conversion Rates</h3>
                        <p className="text-sm text-gray-400 mt-0.5">Order status breakdown</p>
                    </div>
                    <div className="space-y-5">
                        {conversionData.map(item => {
                            const pct = totalOrdersForRate > 0 ? ((item.value / totalOrdersForRate) * 100) : 0
                            return (
                                <div key={item.name}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value} ({pct.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: item.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Total */}
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-500">Total Orders</span>
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">{stats.totalOrders}</span>
                    </div>
                </motion.div>

                {/* User Registrations (smooth area chart) */}
                <motion.div
                    className="lg:col-span-2 bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    <div className="mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Registrations</h3>
                        <p className="text-sm text-gray-400 mt-0.5">New users over last 12 months</p>
                    </div>
                    <ResponsiveContainer width="100%" height={290}>
                        <AreaChart data={stats.monthlyUsers} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="areaUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00B8D9" stopOpacity={0.24} />
                                    <stop offset="100%" stopColor="#00B8D9" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F6F8" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#919EAB' }} dy={8} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#919EAB' }} dx={-8} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Area type="natural" dataKey="users" name="New Users" stroke="#00B8D9" strokeWidth={3} fill="url(#areaUsers)" dot={{ fill: '#00B8D9', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={true} animationDuration={1400} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* ── Recent Users Table ── */}
            <motion.div
                className="mt-8 bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
            >
                <div className="p-6 pb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02]">
                                <th className="px-6 py-3 font-semibold">User</th>
                                <th className="px-6 py-3 font-semibold">Email</th>
                                <th className="px-6 py-3 font-semibold">Role</th>
                                <th className="px-6 py-3 font-semibold">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                            {stats.recentUsers.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${u.role === 'admin' ? 'bg-[#C8FAD6] text-[#118D57] dark:bg-[#00A76F]/15 dark:text-[#5BE49B]' : 'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════
// ─── USERS PAGE ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ username: '', email: '', phonenumber: '' })
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    useEffect(() => { fetchUsers() }, [])

    const fetchUsers = async () => {
        try { setLoading(true); const res = await usersAPI.getAll(); setUsers(res.data.users || []) }
        catch { setMsg({ type: 'error', text: 'Failed to load users' }) }
        finally { setLoading(false) }
    }

    const handleEdit = (u: UserType) => { setEditingId(u._id); setEditForm({ username: u.username, email: u.email, phonenumber: u.phonenumber || '' }); setMsg(null) }

    const handleSave = async (id: string) => {
        try { setSaving(true); await usersAPI.update(id, editForm); setMsg({ type: 'success', text: 'User updated' }); setEditingId(null); fetchUsers() }
        catch (err: any) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update' }) }
        finally { setSaving(false) }
    }

    const handleDelete = async (id: string) => {
        try { await usersAPI.delete(id); setMsg({ type: 'success', text: 'User deleted' }); setDeleteConfirm(null); fetchUsers() }
        catch (err: any) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete' }) }
    }

    const filtered = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-sm text-gray-500 mt-1">View and manage all registered users</p>
            </div>

            <Msg msg={msg} onClose={() => setMsg(null)} />

            <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center gap-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-1"><Users className="w-4 h-4 text-primary-500" /> Users ({filtered.length})</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary-300 dark:focus:border-primary-500/30 transition-all text-gray-700 dark:text-gray-300" />
                    </div>
                    <button onClick={fetchUsers} className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] hover:border-primary-300 dark:hover:border-primary-500/30 transition-all" title="Refresh">
                        <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No users found" /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.04]">
                                    <th className="px-5 py-3">User</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Role</th><th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                                {filtered.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            {editingId === u._id ? <input value={editForm.username} onChange={e => setEditForm({...editForm,username:e.target.value})} className="w-40 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300" /> : (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{u.username.charAt(0).toUpperCase()}</div>
                                                    <span className="font-medium text-gray-900 dark:text-white">{u.username}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">{editingId === u._id ? <input value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})} className="w-48 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300" /> : <span className="text-gray-500">{u.email}</span>}</td>
                                        <td className="px-5 py-4">{editingId === u._id ? <input value={editForm.phonenumber} onChange={e=>setEditForm({...editForm,phonenumber:e.target.value})} className="w-36 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300" /> : <span className="text-gray-500">{u.phonenumber||'-'}</span>}</td>
                                        <td className="px-5 py-4"><RoleBadge role={u.role} /></td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {editingId === u._id ? (<>
                                                    <ActionBtn onClick={()=>handleSave(u._id)} icon={saving?undefined:Save} loading={saving} variant="success" />
                                                    <ActionBtn onClick={()=>setEditingId(null)} icon={X} />
                                                </>) : (<>
                                                    <ActionBtn onClick={()=>handleEdit(u)} icon={Edit3} />
                                                    {deleteConfirm===u._id ? (<div className="flex items-center gap-1"><button onClick={()=>handleDelete(u._id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all">Confirm</button><ActionBtn onClick={()=>setDeleteConfirm(null)} icon={X} /></div>) : <ActionBtn onClick={()=>setDeleteConfirm(u._id)} icon={Trash2} variant="danger" />}
                                                </>)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════
// ─── PRODUCTS PAGE ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function ProductsPage() {
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [showAdd, setShowAdd] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const emptyProduct = { name: '', description: '', price: 0, category: 'game', image: '', stock: 0 }
    const [form, setForm] = useState(emptyProduct)

    useEffect(() => { fetchProducts() }, [])

    const fetchProducts = async () => {
        try { setLoading(true); const res = await productsAPI.getAll(); setProducts(res.data.products || []) }
        catch { setMsg({ type: 'error', text: 'Failed to load products' }) }
        finally { setLoading(false) }
    }

    const handleCreate = async () => {
        if (!form.name || !form.price || !form.category) { setMsg({ type: 'error', text: 'Name, price, and category are required' }); return }
        try { setSaving(true); await productsAPI.create({...form,price:Number(form.price),stock:Number(form.stock)}); setMsg({ type: 'success', text: 'Product created' }); setShowAdd(false); setForm(emptyProduct); fetchProducts() }
        catch (err: any) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create' }) }
        finally { setSaving(false) }
    }

    const handleEdit = (p: ProductType) => { setEditingId(p._id); setForm({ name: p.name, description: p.description||'', price: p.price, category: p.category, image: p.image||'', stock: p.stock }); setMsg(null); setShowAdd(false) }

    const handleUpdate = async (id: string) => {
        try { setSaving(true); await productsAPI.update(id, {...form,price:Number(form.price),stock:Number(form.stock)}); setMsg({ type: 'success', text: 'Product updated' }); setEditingId(null); setForm(emptyProduct); fetchProducts() }
        catch (err: any) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update' }) }
        finally { setSaving(false) }
    }

    const handleDelete = async (id: string) => {
        try { await productsAPI.delete(id); setMsg({ type: 'success', text: 'Product deleted' }); setDeleteConfirm(null); fetchProducts() }
        catch (err: any) { setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete' }) }
    }

    const getCatStyle = (cat: string) => {
        switch (cat) {
            case 'game': return 'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400'
            case 'software': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
            case 'gift-card': return 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    const filtered = products.filter(p => {
        const s = p.name.toLowerCase().includes(search.toLowerCase())
        const c = !categoryFilter || p.category === categoryFilter
        return s && c
    })

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1>
                <p className="text-sm text-gray-500 mt-1">Create, edit and manage store products</p>
            </div>

            <Msg msg={msg} onClose={() => setMsg(null)} />

            {/* Add / Edit Form */}
            <AnimatePresence>
                {(showAdd || editingId) && (
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden mb-6">
                        <div className={`bg-white dark:bg-[#16161f] rounded-2xl border ${editingId ? 'border-primary-300 dark:border-primary-500/30' : 'border-gray-200 dark:border-white/[0.06]'} p-6`}>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                {editingId ? <><Edit3 className="w-4 h-4 text-primary-500" /> Edit Product</> : <><Plus className="w-4 h-4 text-primary-500" /> Add New Product</>}
                            </h3>
                            <ProductForm form={form} setForm={setForm} />
                            <div className="flex items-center gap-3 mt-5">
                                <motion.button onClick={editingId ? ()=>handleUpdate(editingId) : handleCreate} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all disabled:opacity-50" whileTap={{scale:0.98}}>
                                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingId ? 'Update' : 'Create'} Product
                                </motion.button>
                                <button onClick={()=>{setShowAdd(false);setEditingId(null);setForm(emptyProduct)}} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center gap-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-1"><Package className="w-4 h-4 text-primary-500" /> Products ({filtered.length})</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative w-full sm:w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary-300 dark:focus:border-primary-500/30 transition-all text-gray-700 dark:text-gray-300" />
                        </div>
                        <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="px-3 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none text-gray-700 dark:text-gray-300 w-36">
                            <option value="">All Categories</option><option value="game">Games</option><option value="software">Software</option><option value="gift-card">Gift Cards</option>
                        </select>
                        <button onClick={fetchProducts} className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] hover:border-primary-300 transition-all"><RefreshCw className={`w-4 h-4 text-gray-500 ${loading?'animate-spin':''}`} /></button>
                        {!showAdd && !editingId && <motion.button onClick={()=>{setShowAdd(true);setForm(emptyProduct);setMsg(null)}} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all" whileTap={{scale:0.97}}><Plus className="w-4 h-4" /> Add</motion.button>}
                    </div>
                </div>

                {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No products found" /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.04]">
                                    <th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                                {filtered.map(p => (
                                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {p.image ? <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" /> /* eslint-disable-line @next/next/no-img-element */ : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">🎮</div>}
                                                <div className="min-w-0"><p className="font-medium text-gray-900 dark:text-white truncate max-w-[250px]">{p.name}</p><p className="text-[11px] text-gray-400 truncate max-w-[250px]">{p.description||'No description'}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4"><span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getCatStyle(p.category)}`}>{p.category.replace('-',' ')}</span></td>
                                        <td className="px-5 py-4"><span className="font-bold text-gray-900 dark:text-white">${p.price.toFixed(2)}</span></td>
                                        <td className="px-5 py-4"><span className={`font-medium ${p.stock>0?'text-emerald-600 dark:text-emerald-400':'text-red-500'}`}>{p.stock}</span></td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <ActionBtn onClick={()=>handleEdit(p)} icon={Edit3} />
                                                {deleteConfirm===p._id ? (<div className="flex items-center gap-1"><button onClick={()=>handleDelete(p._id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all">Confirm</button><ActionBtn onClick={()=>setDeleteConfirm(null)} icon={X} /></div>) : <ActionBtn onClick={()=>setDeleteConfirm(p._id)} icon={Trash2} variant="danger" />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════
// ─── IMPORT PAGE ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function ImportPage() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [result, setResult] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async () => {
        if (!file) return
        try {
            setUploading(true); setMsg(null); setResult(null)
            const res = await productsAPI.importCSV(file)
            setResult(res.data)
            setMsg({ type: 'success', text: `Import completed! ${res.data.imported||res.data.count||0} products imported.` })
            setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''
        } catch (err: any) { setMsg({ type: 'error', text: err.response?.data?.message || 'Import failed' }) }
        finally { setUploading(false) }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CSV Import</h1>
                <p className="text-sm text-gray-500 mt-1">Bulk import products from CSV files</p>
            </div>

            <Msg msg={msg} onClose={() => setMsg(null)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Card */}
                <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-primary-500" /> Import CSV File</h3>
                    <p className="text-sm text-gray-500 mb-5">Upload a CSV file with columns: name, description, price, category, image, stock.</p>
                    <div onClick={()=>fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 dark:border-white/[0.08] rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-500/30 transition-all group">
                        <Upload className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3 group-hover:text-primary-400 transition-colors" />
                        {file ? <><p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p><p className="text-xs text-gray-400 mt-1">{(file.size/1024).toFixed(1)} KB</p></> : <><p className="text-sm text-gray-500">Click to select a CSV file</p><p className="text-xs text-gray-400 mt-1">or drag and drop</p></>}
                        <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)} />
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                        <motion.button onClick={handleUpload} disabled={!file||uploading} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all disabled:opacity-50" whileTap={{scale:0.98}}>
                            {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                            {uploading ? 'Importing...' : 'Import'}
                        </motion.button>
                        <a href={productsAPI.downloadSampleCSV()} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-primary-300 transition-all">
                            <FileText className="w-4 h-4" /> Sample CSV
                        </a>
                    </div>
                </div>

                {/* Format Guide */}
                <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary-500" /> CSV Format Guide</h3>
                    <div className="space-y-4">
                        <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Columns</p><div className="flex flex-wrap gap-2">{['name','price','category'].map(c=><span key={c} className="px-2.5 py-1 bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400 rounded-lg text-xs font-bold">{c}</span>)}</div></div>
                        <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Optional Columns</p><div className="flex flex-wrap gap-2">{['description','image','stock'].map(c=><span key={c} className="px-2.5 py-1 bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400 rounded-lg text-xs font-medium">{c}</span>)}</div></div>
                        <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Valid Categories</p><div className="flex flex-wrap gap-2">{['game','software','gift-card'].map(c=><span key={c} className="px-2.5 py-1 bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400 rounded-lg text-xs font-medium">{c}</span>)}</div></div>
                        <div className="bg-gray-50 dark:bg-[#0b0b11] rounded-xl p-4 border border-gray-200 dark:border-white/[0.06]">
                            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Example</p>
                            <code className="text-xs text-gray-600 dark:text-gray-400 font-mono leading-relaxed block">name,description,price,category,image,stock<br/>Elden Ring,Fantasy RPG,39.99,game,,175<br/>NordVPN,2-Year Plan,89.99,software,,200</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Import Result */}
            {result && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mt-6 bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary-500" /> Import Results</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Imported', value: result.imported||result.count||0, color: 'text-emerald-600 dark:text-emerald-400' },
                            { label: 'Skipped', value: result.skipped||0, color: 'text-amber-600 dark:text-amber-400' },
                            { label: 'Errors', value: result.errors?.length||0, color: 'text-red-600 dark:text-red-400' },
                            { label: 'Total Rows', value: (result.imported||0)+(result.skipped||0)+(result.errors?.length||0), color: 'text-gray-600 dark:text-gray-400' },
                        ].map(s=>(
                            <div key={s.label} className="bg-gray-50 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.06] rounded-xl p-4 text-center">
                                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{s.label}</p>
                            </div>
                        ))}
                    </div>
                    {result.errors?.length > 0 && (
                        <div className="mt-4 bg-red-50 dark:bg-red-500/10 rounded-xl p-4 border border-red-200 dark:border-red-500/20">
                            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Errors:</p>
                            <ul className="text-xs text-red-500 space-y-1 max-h-32 overflow-y-auto">
                                {result.errors.map((err:any,i:number)=><li key={i}>Row {err.row||i+1}: {err.message||JSON.stringify(err)}</li>)}
                            </ul>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════
// ─── Shared Components ────────────────────────────────────
// ═══════════════════════════════════════════════════════════

function ProductForm({ form, setForm }: {
    form: { name: string; description: string; price: number; category: string; image: string; stock: number }
    setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; price: number; category: string; image: string; stock: number }>>
}) {
    const inputClass = "w-full px-3 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary-300 dark:focus:border-primary-500/30 transition-all text-gray-700 dark:text-gray-300"
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label><input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={inputClass} placeholder="Product name" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={inputClass}><option value="game">Game</option><option value="software">Software</option><option value="gift-card">Gift Card</option></select></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Price *</label><input type="number" step="0.01" min="0" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)||0})} className={inputClass} placeholder="0.00" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stock</label><input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value)||0})} className={inputClass} placeholder="0" /></div>
            <div className="md:col-span-2"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image URL</label><input type="text" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className={inputClass} placeholder="https://example.com/image.jpg" /></div>
            <div className="md:col-span-2"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className={`${inputClass} min-h-[80px] resize-y`} placeholder="Product description..." rows={3} /></div>
        </div>
    )
}

function Msg({ msg, onClose }: { msg: { type: 'success' | 'error'; text: string } | null; onClose: () => void }) {
    if (!msg) return null
    return (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className={`mb-4 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${msg.type==='success'?'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30':'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border border-red-200 dark:border-red-500/30'}`}>
            {msg.type==='success'?<Check className="w-4 h-4" />:<AlertCircle className="w-4 h-4" />} {msg.text}
            <button onClick={onClose} className="ml-auto"><X className="w-4 h-4" /></button>
        </motion.div>
    )
}

function Spinner() { return <div className="p-10 text-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div> }
function Empty({ text }: { text: string }) { return <div className="p-10 text-center text-gray-500 text-sm">{text}</div> }
function RoleBadge({ role }: { role: string }) { return <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${role==='admin'?'bg-gradient-to-r from-primary-600 to-accent-500 text-white':'bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400'}`}>{role}</span> }

function ActionBtn({ onClick, icon: Icon, variant, loading: isLoading }: { onClick: () => void; icon?: React.ElementType; variant?: 'success' | 'danger'; loading?: boolean }) {
    const base = 'p-1.5 rounded-lg transition-all '
    const v = variant === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 hover:bg-emerald-200'
        : variant === 'danger' ? 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400'
        : 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.08]'
    return (
        <button onClick={onClick} className={base + v}>
            {isLoading ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : Icon ? <Icon className="w-3.5 h-3.5" /> : null}
        </button>
    )
}
