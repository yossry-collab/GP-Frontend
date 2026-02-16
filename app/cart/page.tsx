"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Zap,
  Shield,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function CartPage() {
  const {
    items,
    itemCount,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    router.push("/payment/checkout");
  };

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
          <Navbar />
          <div
            className="flex items-center justify-center"
            style={{ minHeight: "calc(100vh - 64px)" }}
          >
            <div className="text-center">
              <div className="text-7xl mb-6 opacity-30">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                Browse our marketplace and find something you love
              </p>
              <motion.button
                onClick={() => router.push("/store")}
                className="btn-primary px-8 py-3.5 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Browse Store
              </motion.button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Back link */}
          <button
            onClick={() => router.push("/store")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Shopping <span className="text-gradient">Cart</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs font-semibold transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  className="card-hover p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex gap-5">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/[0.03] rounded-xl overflow-hidden flex-shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">
                          🎮
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {item.product.description}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2.5">
                          <motion.button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity - 1,
                              )
                            }
                            className="w-7 h-7 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-lg flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity + 1,
                              )
                            }
                            className="w-7 h-7 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-lg flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-gradient">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-[10px] text-gray-400">
                              ${item.product.price.toFixed(2)} each
                            </div>
                          </div>
                          <motion.button
                            onClick={() => removeItem(item.product._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
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
                className="card p-6 sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ${(totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-white/[0.06] pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-2xl font-extrabold text-gradient">
                        ${(totalPrice * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleCheckout}
                >
                  <ShoppingCart className="w-4 h-4" /> Proceed to Checkout
                </motion.button>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs text-center mt-3"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> SSL Encrypted
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Instant Delivery
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
