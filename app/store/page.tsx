'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Gamepad2, Monitor, Gift, LayoutGrid, X } from 'lucide-react'
import { productsAPI } from '@/lib/api'
import { Product } from '@/lib/cart-context'
import ProductCard from '@/components/ProductCard'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filtered, setFiltered] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')

    const categories = [
        { key: 'all', label: 'All Products', icon: LayoutGrid },
        { key: 'game', label: 'Games', icon: Gamepad2 },
        { key: 'software', label: 'Software', icon: Monitor },
        { key: 'gift-card', label: 'Gift Cards', icon: Gift },
    ]

    useEffect(() => { fetchProducts() }, [])

    useEffect(() => {
        let result = [...products]
        if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory)
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
        }
        setFiltered(result)
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

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    {/* Header */}
                    <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                            Digital <span className="text-gradient">Marketplace</span>
                        </h1>
                        <p className="text-gray-500 text-sm">{filtered.length} products available</p>
                    </motion.div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="input pl-10 pr-10"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.key
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-glow-sm'
                                    : 'bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-primary-300 dark:hover:border-primary-500/20'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Product grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="card h-72 animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4 opacity-30">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
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
