'use client'

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useRouter } from 'next/navigation'

export default function CartBadge() {
    const { itemCount } = useCart()
    const router = useRouter()

    return (
        <button
            onClick={() => router.push('/cart')}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
        >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center text-[10px] font-bold text-white min-w-[18px] h-[18px] shadow-glow-purple">
                    {itemCount}
                </span>
            )}
        </button>
    )
}
