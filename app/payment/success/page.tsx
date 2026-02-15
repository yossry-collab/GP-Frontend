"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, XCircle, Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentAPI, loyaltyAPI } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

type VerifyState = "loading" | "success" | "failed";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const [state, setState] = useState<VerifyState>("loading");
  const [order, setOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Flouci appends payment_id to the success URL
        const paymentId = searchParams.get("payment_id");
        if (!paymentId) {
          setErrorMsg("No payment ID found in URL");
          setState("failed");
          return;
        }

        const res = await paymentAPI.verify(paymentId);
        const { status, order: verifiedOrder } = res.data;

        if (status === "SUCCESS") {
          setState("success");
          setOrder(verifiedOrder);
          // Clear local cart after successful payment
          clearCart();

          // Award loyalty points (best effort)
          try {
            await loyaltyAPI.earnFromPurchase(
              verifiedOrder._id,
              verifiedOrder.totalPrice,
            );
          } catch {
            /* non-blocking */
          }
        } else {
          setState("failed");
          setErrorMsg("Payment was not completed.");
        }
      } catch (err: any) {
        setState("failed");
        setErrorMsg(err.response?.data?.message || "Failed to verify payment.");
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
        <Navbar />
        <div
          className="flex items-center justify-center"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          {/* Loading */}
          {state === "loading" && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Verifying your payment...
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Please wait, this may take a moment.
              </p>
            </motion.div>
          )}

          {/* Success */}
          {state === "success" && order && (
            <motion.div
              className="text-center max-w-md px-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              >
                <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                Your order has been confirmed and paid.
              </p>
              <p className="text-xs text-gray-400 mb-1">
                Order ID:{" "}
                <span className="font-mono text-gray-600 dark:text-gray-300">
                  {order._id}
                </span>
              </p>
              <p className="text-xs text-gray-400 mb-6">
                {order.totalItems} items &middot;{" "}
                <span className="font-semibold text-gradient">
                  {(order.totalPrice * 1.1).toFixed(2)} TND
                </span>
              </p>

              <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Items
                </p>
                <div className="space-y-2">
                  {order.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                        {it.name}{" "}
                        <span className="text-gray-400">
                          &times;{it.quantity}
                        </span>
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-4">
                        {(it.price * it.quantity).toFixed(2)} TND
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => router.push("/store")}
                  className="btn-primary px-6 py-3 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5 inline" /> Continue
                  Shopping
                </motion.button>
                <motion.button
                  onClick={() => router.push("/profile")}
                  className="px-6 py-3 text-sm font-medium rounded-xl bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  My Orders
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Failed */}
          {state === "failed" && (
            <motion.div
              className="text-center max-w-md px-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-20 h-20 bg-red-100 dark:bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              >
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Verification Failed
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {errorMsg ||
                  "We could not confirm your payment. If you were charged, please contact support."}
              </p>

              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={() => router.push("/cart")}
                  className="btn-primary px-6 py-3 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5 inline" /> Back to Cart
                </motion.button>
                <motion.button
                  onClick={() => router.push("/profile")}
                  className="px-6 py-3 text-sm font-medium rounded-xl bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  My Orders
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
