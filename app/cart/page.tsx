'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Zap, Shield, Gamepad2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function CartPage() {
    const { items, itemCount, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
    const router = useRouter()

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeItem(productId)
        } else {
            updateQuantity(productId, newQuantity)
        }
    }

    if (items.length === 0) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-neon-dark flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-7xl mb-6 opacity-30">🛒</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-500 mb-8 text-sm">Browse our marketplace and find something you love</p>
                        <motion.button
                            onClick={() => router.push('/store')}
                            className="px-8 py-3.5 btn-neon rounded-xl text-white font-bold text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Browse Store
                        </motion.button>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neon-dark relative">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-neon-purple/8 rounded-full blur-[120px]" />
                </div>

                {/* Nav */}
                <div className="sticky top-0 z-50 glass-strong">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/store')} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Continue Shopping
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

                <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white">Shopping <span className="text-neon-gradient">Cart</span></h1>
                            <p className="text-gray-500 text-sm mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                        </div>
                        <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-xs font-semibold transition-colors">
                            Clear Cart
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.product._id}
                                    className="glass rounded-2xl p-5 card-glow"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex gap-5">
                                        <div className="w-20 h-20 bg-neon-surface rounded-xl overflow-hidden flex-shrink-0">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">🎮</div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-sm truncate">{item.product.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{item.product.description}</p>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-2.5">
                                                    <motion.button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                                                        className="w-7 h-7 bg-neon-dark border border-white/10 rounded-lg flex items-center justify-center text-white hover:border-neon-purple/30"
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </motion.button>
                                                    <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                                                    <motion.button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                                                        className="w-7 h-7 bg-neon-dark border border-white/10 rounded-lg flex items-center justify-center text-white hover:border-neon-purple/30"
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </motion.button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-lg font-black text-neon-gradient">${(item.product.price * item.quantity).toFixed(2)}</div>
                                                        <div className="text-[10px] text-gray-600">${item.product.price.toFixed(2)} each</div>
                                                    </div>
                                                    <motion.button
                                                        onClick={() => removeItem(item.product._id)}
                                                        className="text-gray-600 hover:text-red-400 transition-colors"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                className="glass-strong rounded-2xl p-6 sticky top-24"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>

                                <div className="space-y-3 mb-5 text-sm">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal ({itemCount} items)</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Delivery</span>
                                        <span className="text-emerald-400 font-medium">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Tax</span>
                                        <span>${(totalPrice * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-white/5 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-white">Total</span>
                                            <span className="text-2xl font-black text-neon-gradient">${(totalPrice * 1.1).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    className="w-full py-3.5 btn-neon rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <ShoppingCart className="w-4 h-4" /> Proceed to Checkout
                                </motion.button>

                                <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-gray-600">
                                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Encrypted</span>
                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant Delivery</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
