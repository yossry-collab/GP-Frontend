'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Plus, Minus, Zap, Shield, Clock, Package, Gamepad2 } from 'lucide-react'
import { Product } from '@/lib/cart-context'
import { useCart } from '@/lib/cart-context'
import { productsAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { addItem } = useCart()
    const router = useRouter()

    useEffect(() => {
        fetchProduct()
    }, [params.id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await productsAPI.getById(params.id)
            setProduct(response.data)
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
            case 'game': return 'bg-neon-purple/15 text-neon-purple border-neon-purple/30'
            case 'software': return 'bg-neon-blue/15 text-neon-blue border-neon-blue/30'
            case 'gift-card': return 'bg-neon-pink/15 text-neon-pink border-neon-pink/30'
            default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
        }
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-neon-dark flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
                </div>
            </ProtectedRoute>
        )
    }

    if (error || !product) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-neon-dark flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😞</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
                        <p className="text-gray-500 mb-6">{error || 'This product does not exist'}</p>
                        <button onClick={() => router.push('/store')} className="px-6 py-3 btn-neon rounded-xl text-white font-semibold text-sm">
                            Back to Store
                        </button>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neon-dark relative">
                {/* Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 right-20 w-80 h-80 bg-neon-purple/8 rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-neon-pink/5 rounded-full blur-[100px]" />
                </div>

                {/* Nav */}
                <div className="sticky top-0 z-50 glass-strong">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/store')} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Store
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                                <Gamepad2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-sm">GAME<span className="text-neon-gradient">VERSE</span></span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <motion.div
                            className="bg-neon-card rounded-2xl overflow-hidden border border-white/5"
                            initial={{ opacity: 0, x: -40 }}
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
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${getCategoryStyle(product.category)}`}>
                                {product.category.replace('-', ' ')}
                            </span>

                            <h1 className="text-3xl md:text-4xl font-black text-white">{product.name}</h1>

                            <p className="text-gray-400 leading-relaxed">
                                {product.description || 'No description available for this product.'}
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-card rounded-lg border border-white/5 text-xs text-gray-400">
                                    <Zap className="w-3.5 h-3.5 text-neon-cyan" /> Instant Delivery
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-card rounded-lg border border-white/5 text-xs text-gray-400">
                                    <Shield className="w-3.5 h-3.5 text-neon-purple" /> Secure Purchase
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-card rounded-lg border border-white/5 text-xs text-gray-400">
                                    <Package className="w-3.5 h-3.5 text-neon-pink" />
                                    {product.stock > 0 ? <span className="text-emerald-400">{product.stock} in stock</span> : <span className="text-red-400">Out of stock</span>}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-4xl font-black text-neon-gradient">
                                ${product.price.toFixed(2)}
                            </div>

                            {/* Quantity + CTA */}
                            {product.stock > 0 && (
                                <div className="glass-strong rounded-2xl p-6 space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quantity</label>
                                        <div className="flex items-center gap-4">
                                            <motion.button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 bg-neon-dark border border-white/10 rounded-xl flex items-center justify-center text-white hover:border-neon-purple/30 transition-all"
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </motion.button>
                                            <div className="w-14 text-center text-xl font-bold text-white">{quantity}</div>
                                            <motion.button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="w-10 h-10 bg-neon-dark border border-white/10 rounded-xl flex items-center justify-center text-white hover:border-neon-purple/30 transition-all"
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={handleAddToCart}
                                        className="w-full py-4 btn-neon rounded-xl font-bold text-white flex items-center justify-center gap-3"
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
