"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
        <Navbar />
        <div
          className="flex items-center justify-center"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
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
              Payment Failed
            </h2>
            <p className="text-gray-500 text-sm mb-2">
              Your payment was not completed. You have not been charged.
            </p>
            {orderId && (
              <p className="text-xs text-gray-400 mb-6">
                Order ID:{" "}
                <span className="font-mono text-gray-600 dark:text-gray-300">
                  {orderId}
                </span>
              </p>
            )}

            <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-4 mb-6 text-sm text-left text-gray-500">
              <p className="mb-2">This can happen if:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>The payment session timed out</li>
                <li>You cancelled the payment</li>
                <li>There was a network issue</li>
              </ul>
              <p className="mt-3 text-xs">
                Your cart items are still saved. You can try again anytime.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={() => router.push("/cart")}
                className="btn-primary px-6 py-3 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 inline" /> Try Again
              </motion.button>
              <motion.button
                onClick={() => router.push("/store")}
                className="px-6 py-3 text-sm font-medium rounded-xl bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingBag className="w-4 h-4 mr-1.5 inline" /> Browse Store
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
