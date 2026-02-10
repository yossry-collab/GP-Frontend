'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Gamepad2, Monitor, Gift, Key, LayoutGrid, ShoppingCart, ArrowLeft, X } from 'lucide-react'
import { productsAPI } from '@/lib/api'
import { Product } from '@/lib/cart-context'
import { useCart } from '@/lib/cart-context'
import ProductCard from '@/components/ProductCard'
import CartBadge from '@/components/CartBadge'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'

export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filtered, setFiltered] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const router = useRouter()

    const categories = [
        { key: 'all', label: 'All Products', icon: LayoutGrid },
        { key: 'game', label: 'Games', icon: Gamepad2 },
        { key: 'software', label: 'Software', icon: Monitor },
        { key: 'gift-card', label: 'Gift Cards', icon: Gift },
    ]

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        filterProducts()
    }, [search, activeCategory, products])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await productsAPI.getAll()
            const data = Array.isArray(response.data) ? response.data : response.data.products || []
            setProducts(data)
        } catch (err) {
            console.error('Failed to fetch products:', err)
        } finally {
            setLoading(false)
        }
    }

    const filterProducts = () => {
        let result = [...products]
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory)
        }
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
            )
        }
        setFiltered(result)
    }

    const handleSearch = async () => {
        if (!search.trim()) return
        try {
            setLoading(true)
            const response = await productsAPI.search(search)
            const data = Array.isArray(response.data) ? response.data : response.data.products || []
            setFiltered(data)
        } catch (err) {
            console.error('Search failed:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neon-dark">
                {/* Background orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-neon-purple/8 rounded-full blur-[120px]" />
                    <div className="absolute bottom-40 left-10 w-80 h-80 bg-neon-pink/5 rounded-full blur-[130px]" />
                </div>

                {/* Top navbar */}
                <div className="sticky top-0 z-50 glass-strong">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                                    <Gamepad2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-sm">GAME<span className="text-neon-gradient">VERSE</span></span>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-10 py-2.5 bg-neon-card border border-white/5 rounded-xl text-sm text-white outline-none focus:border-neon-purple/30 transition-all placeholder-gray-600"
                                />
                                {search && (
                                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CartBadge />
                            <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-black mb-1">
                            The Digital <span className="text-neon-gradient">Marketplace</span>
                        </h1>
                        <p className="text-gray-500 text-sm">{filtered.length} products available</p>
                    </motion.div>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.key
                                        ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-glow-purple'
                                        : 'bg-neon-card border border-white/5 text-gray-400 hover:text-white hover:border-neon-purple/30'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile search */}
                    <div className="md:hidden mb-6">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 bg-neon-card border border-white/5 rounded-xl text-sm text-white outline-none focus:border-neon-purple/30 transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>

                    {/* Product grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-neon-card rounded-2xl h-72 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4 opacity-30">🔍</div>
                            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                            <p className="text-gray-500 text-sm">Try a different search or category</p>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {filtered.map((product, idx) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
