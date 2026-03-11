"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gift,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import FloatingOrb from "@/components/FloatingOrb";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import SafeImage from "@/components/SafeImage";

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

  const tax = useMemo(() => totalPrice * 0.1, [totalPrice]);
  const grandTotal = useMemo(() => totalPrice + tax, [totalPrice, tax]);
  const digitalReadyCount = useMemo(
    () => items.filter((item) => item.product.isDigital !== false).length,
    [items],
  );

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    router.push("/payment/checkout");
  };

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] relative overflow-hidden">
          <Navbar />

          <FloatingOrb className="w-96 h-96 bg-primary-500/12 -top-32 -left-24" />
          <FloatingOrb
            className="w-80 h-80 bg-accent-500/10 bottom-10 -right-20"
            delay={2}
          />

          <div className="relative z-10 flex items-center justify-center px-4 py-20 min-h-[calc(100vh-64px)]">
            <motion.div
              className="w-full max-w-3xl rounded-[2rem] border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#11111a] shadow-[0_0_2px_0_rgba(145,158,171,0.22),0_28px_54px_-18px_rgba(145,158,171,0.16)] dark:shadow-none p-8 sm:p-10 text-center overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.1),transparent_24%)]" />
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-[2rem] mx-auto bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-glow-sm mb-6">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.24em] font-bold text-primary-500 mb-3">
                  Cart Ready When You Are
                </p>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Your cart is empty
                </h1>
                <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-500 dark:text-white/70 leading-relaxed mb-8">
                  Explore the marketplace, stack up your next digital drops, and
                  come back here when you are ready to check out.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
                  {[
                    {
                      icon: Zap,
                      title: "Instant digital delivery",
                      text: "Most items land in your inbox right after payment.",
                    },
                    {
                      icon: Shield,
                      title: "Protected checkout",
                      text: "Secure purchase flow with verified payment handling.",
                    },
                    {
                      icon: Gift,
                      title: "Rewards on purchases",
                      text: "Keep building value every time you buy on GamePlug.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] p-4"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index, duration: 0.35 }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center mb-3">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-white/65 leading-relaxed">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => router.push("/store")}
                  className="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Browse Store
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] relative overflow-hidden">
        <Navbar />

        <FloatingOrb className="w-96 h-96 bg-primary-500/12 -top-32 -left-24" />
        <FloatingOrb
          className="w-80 h-80 bg-accent-500/10 top-72 -right-16"
          delay={2}
        />
        <FloatingOrb
          className="w-72 h-72 bg-cyan-500/10 bottom-8 left-1/3"
          delay={4}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          <button
            onClick={() => router.push("/store")}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>

          <motion.section
            className="relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#11111a] shadow-[0_0_2px_0_rgba(145,158,171,0.22),0_24px_48px_-12px_rgba(145,158,171,0.16)] dark:shadow-none p-6 sm:p-8 lg:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.12),transparent_28%)]" />

            <div className="relative flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/12 dark:text-primary-300 mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Cart Overview
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                    Your GamePlug cart
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-white/70 leading-relaxed max-w-2xl">
                    Review your picks, adjust quantities, and move into checkout
                    with the same fast digital delivery flow used across the
                    store.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full lg:max-w-sm">
                  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/90 dark:bg-white/[0.03] px-4 py-3 min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-1">
                      Items
                    </p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {itemCount}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/90 dark:bg-white/[0.03] px-4 py-3 min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-1">
                      Instant ready
                    </p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      {digitalReadyCount}
                    </p>
                  </div>
                  <div className="col-span-2 min-[420px]:col-span-1 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/90 dark:bg-white/[0.03] px-4 py-3 min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-1">
                      Subtotal
                    </p>
                    <p className="text-2xl font-black text-gradient">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Shield,
                    title: "Protected checkout",
                    text: "SSL encrypted purchase flow from cart to payment.",
                  },
                  {
                    icon: Zap,
                    title: "Fast digital dispatch",
                    text: "Digital items are set up for near-instant fulfillment.",
                  },
                  {
                    icon: Truck,
                    title: "No delivery fee",
                    text: "Every digital order ships free with zero added friction.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.03] p-4"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.35 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center mb-3">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-white/65 leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                    Line Items
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Review your selections
                  </h2>
                </div>
                <button
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {items.map((item, index) => {
                const lineTotal = item.product.price * item.quantity;

                return (
                  <motion.div
                    key={item.product._id}
                    className="rounded-[1.75rem] border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#16161f] shadow-[0_0_2px_0_rgba(145,158,171,0.18),0_16px_30px_-12px_rgba(145,158,171,0.18)] dark:shadow-none p-5 sm:p-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.35 }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                      <div className="w-full sm:w-32 h-28 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.04] flex-shrink-0">
                        {item.product.image ? (
                          <SafeImage
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                            🎮
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400">
                                {item.product.category.replace("-", " ")}
                              </span>
                              {item.product.isDigital !== false && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                                  <Zap className="w-3 h-3" />
                                  Instant Delivery
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                              {item.product.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-white/65 line-clamp-2 leading-relaxed max-w-2xl">
                              {item.product.description}
                            </p>
                          </div>

                          <div className="text-left lg:text-right">
                            <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-1">
                              Line total
                            </p>
                            <p className="text-2xl font-black text-gradient">
                              ${lineTotal.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              ${item.product.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <motion.button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity - 1,
                                )
                              }
                              className="w-10 h-10 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-xl flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30 transition-colors"
                              whileTap={{ scale: 0.92 }}
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="min-w-[3rem] text-center text-lg font-black text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-10 h-10 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-xl flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30 transition-colors"
                              whileTap={{ scale: 0.92 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-white/[0.03] px-3 py-2 text-xs text-gray-500 dark:text-white/60">
                              <Package className="w-3.5 h-3.5" />
                              Ready for checkout
                            </div>
                            <motion.button
                              onClick={() => removeItem(item.product._id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 transition-colors"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.aside
              className="space-y-4 xl:sticky xl:top-24"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="rounded-[1.75rem] border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#16161f] shadow-[0_0_2px_0_rgba(145,158,171,0.18),0_16px_30px_-12px_rgba(145,158,171,0.18)] dark:shadow-none p-6 sm:p-7">
                <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-2">
                  Checkout Summary
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between text-gray-500 dark:text-white/65">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500 dark:text-white/65">
                    <span>Delivery</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Free
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500 dark:text-white/65">
                    <span>Tax</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-white/[0.06] flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-3xl font-black text-gradient">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <motion.button
                  className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 mt-6"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleCheckout}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Proceed to Checkout
                </motion.button>

                <button
                  onClick={() => router.push("/store")}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:border-primary-300 dark:hover:border-primary-500/30"
                >
                  Keep Shopping
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center mb-3">
                      <Shield className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Secure payment
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/65 leading-relaxed">
                      Your checkout flow stays encrypted from start to finish.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Fast fulfillment
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/65 leading-relaxed">
                      Most items are digital and ready right after payment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#16161f] shadow-[0_0_2px_0_rgba(145,158,171,0.18),0_16px_30px_-12px_rgba(145,158,171,0.18)] dark:shadow-none p-6">
                <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-2">
                  Included Benefits
                </p>
                <div className="space-y-3 text-sm text-gray-500 dark:text-white/65">
                  {[
                    "Free digital delivery on your selected items",
                    "No extra shipping or handling fees",
                    "Clean handoff into payment and order confirmation",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
