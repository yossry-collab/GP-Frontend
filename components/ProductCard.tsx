'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Zap, Star } from 'lucide-react'
import { Product, useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { addItem } = useCart()
    const router = useRouter()

    const getCategoryStyle = (cat: string) => {
        switch (cat) {
            case 'game': return 'bg-neon-purple/15 text-neon-purple border-neon-purple/30'
            case 'software': return 'bg-neon-blue/15 text-neon-blue border-neon-blue/30'
            case 'gift-card': return 'bg-neon-pink/15 text-neon-pink border-neon-pink/30'
            default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30'
        }
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (product.stock > 0) {
            addItem(product, 1)
        }
    }

    return (
        <motion.div
            className="group bg-neon-card border border-white/5 rounded-2xl overflow-hidden cursor-pointer card-glow"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/store/${product._id}`)}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            {/* Image */}
            <div className="relative h-48 bg-neon-surface overflow-hidden">
                {product.image ? (
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.08 : 1 }}
                        transition={{ duration: 0.4 }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🎮</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neon-card via-transparent to-transparent opacity-70" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryStyle(product.category)}`}>
                        {product.category === 'gift-card' ? 'Gift Card' : product.category}
                    </span>
                </div>

                {/* Instant badge */}
                <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 rounded text-[10px] font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Instant
                    </span>
                </div>

                {/* Hover overlay */}
                <motion.div
                    className="absolute inset-0 bg-neon-purple/10 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.button
                        onClick={handleAddToCart}
                        className="px-5 py-2.5 btn-neon rounded-xl text-sm font-bold text-white flex items-center gap-2"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </motion.button>
                </motion.div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-neon-purple transition-colors">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-lg font-black text-neon-gradient">${product.price.toFixed(2)}</span>
                    <span className={`text-xs font-medium ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}
