"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import AuthShowcase from "@/components/AuthShowcase";

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.phonenumber,
      );
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "username",
      label: "Username",
      type: "text",
      icon: User,
      placeholder: "johndoe",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      icon: Mail,
      placeholder: "you@example.com",
    },
    {
      key: "phonenumber",
      label: "Phone Number",
      type: "tel",
      icon: Phone,
      placeholder: "+1 (555) 000-0000",
    },
    {
      key: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      icon: Lock,
      placeholder: "••••••••",
    },
    {
      key: "confirmPassword",
      label: "Confirm Password",
      type: showPassword ? "text" : "password",
      icon: Lock,
      placeholder: "••••••••",
    },
  ];

  return (
    <AuthShowcase
      badge="Create Account"
      title="Create your account"
      description="Join GamePlug to save your cart, track orders, and unlock loyalty packs from day one."
      panelTitle="Step into the marketplace with style."
      panelDescription="Set up your account once, then move through launches, drops, rewards, and checkout with a smoother experience."
      footer={
        <>
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-primary-600 dark:text-primary-400 hover:text-accent-500 font-semibold transition-colors"
          >
            Sign in
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
        {success && (
          <motion.div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field, index) => (
            <motion.div
              key={field.key}
              className={field.key === "confirmPassword" ? "sm:col-span-2" : ""}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
            >
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {field.label}
              </label>
              <div className="relative">
                <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={field.type}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={`input pl-11 ${field.key.includes("password") ? "pr-12" : ""}`}
                  placeholder={field.placeholder}
                  required
                />
                {field.key === "password" && (
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
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {[
            ["Fast Setup", "Under a minute"],
            ["Rewards", "Points after signup"],
            ["Access", "Store + profile ready"],
          ].map(([label, meta], index) => (
            <motion.div
              key={label}
              className="rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] p-2.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + 0.08 * index, duration: 0.35 }}
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
          className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Join GamePlug <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>
    </AuthShowcase>
  );
}
