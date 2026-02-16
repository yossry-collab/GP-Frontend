"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ArrowLeft,
  Loader2,
  Shield,
  Zap,
  Lock,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { ordersAPI, paymentAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
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
  const { items, itemCount, totalPrice, clearCart } = useCart();
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

  // Pre-fill from user profile
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

  // Redirect if cart is empty
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
    // Clear field error on change
    if (errors[name as keyof BillingForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
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
      // 1. Create the order
      const cartItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
        category: item.product.category || "",
      }));
      const orderRes = await ordersAPI.checkout(cartItems);
      const order = orderRes.data.order;

      // 2. Initiate payment
      const paymentRes = await paymentAPI.initiate(order._id);
      const { paymentLink } = paymentRes.data;

      // 3. Redirect to Flouci (or test mode success page)
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

  if (items.length === 0) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Back */}
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            <span className="text-gradient">Checkout</span>
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Complete your billing details to proceed with payment
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ──── LEFT: Billing Form ──── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Billing Information */}
                <motion.div
                  className="bg-white dark:bg-[#141821] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <User className="w-5 h-5 text-primary-500" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Billing Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-[#0b0b11] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all ${errors.fullName ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/[0.08]"}`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
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
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-[#0b0b11] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all ${errors.email ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/[0.08]"}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+216 XX XXX XXX"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-[#0b0b11] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all ${errors.phone ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/[0.08]"}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="Tunis"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-[#0b0b11] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all ${errors.city ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/[0.08]"}`}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="123 Rue de la Liberté"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-[#0b0b11] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all ${errors.address ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/[0.08]"}`}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
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
                          rows={3}
                          placeholder="Any special instructions..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm bg-gray-50 dark:bg-[#0b0b11] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  className="bg-white dark:bg-[#141821] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard className="w-5 h-5 text-primary-500" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Payment Method
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary-500/30 bg-primary-50/50 dark:bg-primary-500/5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      F
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        Flouci
                      </p>
                      <p className="text-xs text-gray-500">
                        Secure payment via Flouci wallet or card
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Encrypted
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Secure
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Instant
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* ──── RIGHT: Order Summary ──── */}
              <div className="lg:col-span-1">
                <motion.div
                  className="bg-white dark:bg-[#141821] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-6 sticky top-24"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                    {items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-white/[0.03] rounded-lg flex-shrink-0 overflow-hidden">
                          {item.product.image ? (
                            <SafeImage
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg opacity-20">
                              🎮
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {(item.product.price * item.quantity).toFixed(2)} TND
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-white/[0.06] pt-4 space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {subtotal.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Tax (10%)</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {tax.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-white/[0.06] pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-2xl font-extrabold text-gradient">
                          {total.toFixed(2)} TND
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <motion.button
                    type="submit"
                    className="w-full btn-primary py-3.5 mt-6 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.99 }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Pay {total.toFixed(2)} TND
                      </>
                    )}
                  </motion.button>

                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs text-center mt-3"
                    >
                      {submitError}
                    </motion.p>
                  )}

                  <p className="text-[10px] text-gray-400 text-center mt-4">
                    By proceeding, you agree to our Terms of Service. Your
                    payment is processed securely via Flouci.
                  </p>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
