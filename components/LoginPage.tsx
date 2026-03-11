"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import AuthShowcase from "@/components/AuthShowcase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const storedRedirectUrl = sessionStorage.getItem("redirectAfterLogin");
      const redirectUrl =
        storedRedirectUrl === "/dashboard"
          ? "/profile"
          : storedRedirectUrl || "/profile";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShowcase
      badge="Member Access"
      title="Welcome back"
      description="Sign in to continue shopping, unlock your rewards, and jump straight into the store."
      panelTitle="Where every login opens the next level."
      panelDescription="Access your orders, your rewards progress, and the latest GamePlug drops in one polished dashboard."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-primary-600 dark:text-primary-400 hover:text-accent-500 font-semibold transition-colors"
          >
            Create one
          </button>
        </>
      }
    >
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-11"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-accent-500 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-11 pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-0.5">
          {[
            ["Fast", "Checkout saved"],
            ["Secure", "Protected account"],
            ["Rewards", "Points enabled"],
          ].map(([label, meta], index) => (
            <motion.div
              key={label}
              className="rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] p-2.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.35 }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-500">
                {label}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {meta}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Enter GamePlug <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>
    </AuthShowcase>
  );
}
