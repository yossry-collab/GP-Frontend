'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Plus, Minus, Zap, Shield, Package } from 'lucide-react'
import { Product } from '@/lib/cart-context'
import { useCart } from '@/lib/cart-context'
import { productsAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { addItem } = useCart()
    const router = useRouter()

    useEffect(() => { fetchProduct() }, [params.id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await productsAPI.getById(params.id)
            setProduct(response.data.product)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load product')
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity)
            router.push('/cart')
        }
    }

    const getCategoryStyle = (cat: string) => {
        switch (cat) {
            case 'game': return 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-500/15 dark:text-primary-400 dark:border-primary-500/30'
            case 'software': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30'
            case 'gift-card': return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-500/15 dark:text-pink-400 dark:border-pink-500/30'
            default: return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/15 dark:text-gray-400 dark:border-gray-500/30'
        }
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center">
                    <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </ProtectedRoute>
        )
    }

    if (error || !product) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😞</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
                        <p className="text-gray-500 mb-6">{error || 'This product does not exist'}</p>
                        <button onClick={() => router.push('/store')} className="btn-primary px-6 py-3 text-sm">
                            Back to Store
                        </button>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    {/* Back */}
                    <button onClick={() => router.push('/store')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Product Image */}
                        <motion.div
                            className="card overflow-hidden"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover min-h-[300px] max-h-[500px]" />
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center">
                                    <div className="text-[100px] opacity-20">🎮</div>
                                </div>
                            )}
                        </motion.div>

                        {/* Product Info */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${getCategoryStyle(product.category)}`}>
                                {product.category.replace('-', ' ')}
                            </span>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{product.name}</h1>

                            <p className="text-gray-500 leading-relaxed">
                                {product.description || 'No description available for this product.'}
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: Zap, label: 'Instant Delivery', color: 'text-primary-500' },
                                    { icon: Shield, label: 'Secure Purchase', color: 'text-primary-500' },
                                ].map(f => (
                                    <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/[0.04] rounded-lg border border-gray-200 dark:border-white/[0.06] text-xs text-gray-500 dark:text-gray-400">
                                        <f.icon className={`w-3.5 h-3.5 ${f.color}`} /> {f.label}
                                    </div>
                                ))}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/[0.04] rounded-lg border border-gray-200 dark:border-white/[0.06] text-xs">
                                    <Package className="w-3.5 h-3.5 text-primary-500" />
                                    {product.stock > 0 ? <span className="text-emerald-600 dark:text-emerald-400">{product.stock} in stock</span> : <span className="text-red-500">Out of stock</span>}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-4xl font-extrabold text-gradient">
                                ${product.price.toFixed(2)}
                            </div>

                            {/* Quantity + CTA */}
                            {product.stock > 0 && (
                                <div className="card p-6 space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quantity</label>
                                        <div className="flex items-center gap-4">
                                            <motion.button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-xl flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </motion.button>
                                            <div className="w-14 text-center text-xl font-bold text-gray-900 dark:text-white">{quantity}</div>
                                            <motion.button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="w-10 h-10 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-xl flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={handleAddToCart}
                                        className="w-full btn-primary py-4 flex items-center justify-center gap-3"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <ShoppingCart className="w-5 h-5" /> Add to Cart — ${(product.price * quantity).toFixed(2)}
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
