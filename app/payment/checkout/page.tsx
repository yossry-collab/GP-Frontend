"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle as CheckCircle2,
  CreditCard,
  FileText,
  Spinner as Loader2,
  Lock,
  Envelope as Mail,
  MapPin,
  Phone,
  Shield,
  Sparkle as Sparkles,
  User,
  Wallet,
  Lightning as Zap,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { ordersAPI, paymentAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import FloatingOrb from "@/components/FloatingOrb";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import SafeImage from "@/components/SafeImage";

interface BillingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, itemCount, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<BillingForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<BillingForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: (user as any).username || "",
        email: (user as any).email || "",
        phone: (user as any).phonenumber || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof BillingForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Partial<BillingForm> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (form.phone.trim().length < 8)
      newErrors.phone = "Phone number too short";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const cartItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
        category: item.product.category || "",
      }));

      const orderRes = await ordersAPI.checkout(cartItems);
      const order = orderRes.data.order;

      const paymentRes = await paymentAPI.initiate(order._id);
      const { paymentLink } = paymentRes.data;

      window.location.href = paymentLink;
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message || "Payment failed. Please try again.",
      );
      setSubmitting(false);
    }
  };

  const subtotal = totalPrice;
  const tax = totalPrice * 0.1;
  const total = subtotal + tax;
  const instantItems = useMemo(
    () => items.filter((item) => item.product.isDigital !== false).length,
    [items],
  );

  if (items.length === 0) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] relative overflow-hidden">
        <Navbar />

        <FloatingOrb className="w-96 h-96 bg-primary-500/12 -top-32 -left-28" />
        <FloatingOrb
          className="w-80 h-80 bg-accent-500/10 top-80 -right-16"
          delay={2}
        />
        <FloatingOrb
          className="w-72 h-72 bg-cyan-500/10 bottom-12 left-1/3"
          delay={4}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          <button
            onClick={() => router.push("/cart")}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
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
                    Secure Checkout
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                    Finish your order without friction
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-500 dark:text-white/70 leading-relaxed">
                    Confirm your billing details, review your cart, and move
                    into Flouci with the same fast GamePlug purchase flow used
                    across the store.
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
                      {instantItems}
                    </p>
                  </div>
                  <div className="col-span-2 min-[420px]:col-span-1 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/90 dark:bg-white/[0.03] px-4 py-3 min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-1">
                      Total
                    </p>
                    <p className="text-2xl font-black text-gradient">
                      {total.toFixed(2)} TND
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Shield,
                    title: "Protected payment",
                    text: "Your transaction is routed through a secured checkout session.",
                  },
                  {
                    icon: Zap,
                    title: "Fast fulfillment",
                    text: "Digital items are set up for quick delivery after payment success.",
                  },
                  {
                    icon: Wallet,
                    title: "Flouci powered",
                    text: "Pay with the same trusted payment provider used in your flow.",
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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
              <div className="space-y-6">
                <AnimatePresence>
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400"
                    >
                      {submitError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  className="card p-6 sm:p-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-glow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                        Billing
                      </p>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Billing information
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`input pl-10 ${errors.fullName ? "border-red-400 dark:border-red-500" : ""}`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`input pl-10 ${errors.email ? "border-red-400 dark:border-red-500" : ""}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+216 XX XXX XXX"
                          className={`input pl-10 ${errors.phone ? "border-red-400 dark:border-red-500" : ""}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="Tunis"
                          className={`input pl-10 ${errors.city ? "border-red-400 dark:border-red-500" : ""}`}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="123 Rue de la Liberté"
                          className={`input pl-10 ${errors.address ? "border-red-400 dark:border-red-500" : ""}`}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Order Notes{" "}
                        <span className="text-gray-400 font-normal normal-case">
                          (optional)
                        </span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Any special instructions..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="card p-6 sm:p-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-glow-sm">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                        Payment
                      </p>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Payment method
                      </h2>
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-primary-500/25 bg-primary-50/50 dark:bg-primary-500/5 p-4 sm:p-5">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        F
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          Flouci
                        </p>
                        <p className="text-sm text-gray-500 dark:text-white/65">
                          Secure payment via Flouci wallet or bank card.
                        </p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center self-start sm:self-auto">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm text-gray-500 dark:text-white/65">
                    {[
                      { icon: Lock, label: "Encrypted session" },
                      { icon: Shield, label: "Protected payment" },
                      { icon: Zap, label: "Fast confirmation" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] px-3 py-3 flex items-center gap-2"
                      >
                        <item.icon className="w-4 h-4 text-primary-500" />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.aside
                className="space-y-4 xl:sticky xl:top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="card p-6 sm:p-7">
                  <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-2">
                    Order Summary
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Review before payment
                  </h2>

                  <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex gap-3 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] p-3"
                      >
                        <div className="w-14 h-14 bg-white dark:bg-[#101018] rounded-xl flex-shrink-0 overflow-hidden border border-gray-200 dark:border-white/[0.04]">
                          {item.product.image ? (
                            <SafeImage
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl opacity-20">
                              🎮
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {(item.product.price * item.quantity).toFixed(2)} TND
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-white/[0.06] pt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-white/65">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {subtotal.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-white/65">
                      <span>Delivery</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-white/65">
                      <span>Tax (10%)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {tax.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-white/[0.06] flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-3xl font-black text-gradient">
                        {total.toFixed(2)} TND
                      </span>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full btn-primary py-3.5 mt-6 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.99 }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Pay {total.toFixed(2)} TND
                      </>
                    )}
                  </motion.button>

                  <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
                    By proceeding, you agree to our Terms of Service. Your
                    payment is processed securely via Flouci.
                  </p>
                </div>

                <div className="card p-6">
                  <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-2">
                    Included Benefits
                  </p>
                  <div className="space-y-3 text-sm text-gray-500 dark:text-white/65">
                    {[
                      "Fast handoff from order creation to payment session",
                      "Digital items ready for post-payment fulfillment",
                      "Secure billing capture with inline validation",
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
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
