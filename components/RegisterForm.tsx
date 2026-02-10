'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Loader, Lock, User, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
    const { register } = useAuth()
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phonenumber, setPhonenumber] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [focused, setFocused] = useState<'username' | 'email' | 'password' | 'phone' | null>(null)

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // Register and auto-login via AuthContext
            await register(username, email, password, phonenumber)

            // Show success state
            setSuccess(true)

            // Redirect to dashboard after brief delay
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <motion.div
                className="w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.12] to-white/[0.06] rounded-2xl border border-gaming-accent/50 shadow-[0_8px_32px_0_rgba(255,51,51,0.3)] p-8 text-center">
                    <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gaming-accent via-gaming-pink to-gaming-orange rounded-full flex items-center justify-center">
                            <ArrowRight className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gaming-accent via-gaming-pink to-gaming-orange bg-clip-text text-transparent mb-2">
                        Welcome to GameVerse!
                    </h2>
                    <p className="text-gray-400 mb-4">Account created successfully. Redirecting to login...</p>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="w-full"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Glass Card - Enhanced */}
            <motion.div
                className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.12] to-white/[0.06] rounded-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(255,51,51,0.2)] p-8 hover:border-gaming-accent/50 transition-all duration-500 relative overflow-hidden"
                whileHover={{ boxShadow: '0 0 60px rgba(255, 51, 51, 0.3), 0 0 100px rgba(255, 51, 51, 0.1)' }}
            >
                {/* Header */}
                <div className="mb-6 space-y-2">
                    <motion.h2
                        className="text-3xl font-bold bg-gradient-to-r from-gaming-accent via-gaming-pink to-gaming-orange bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Create Account
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Join GameVerse and start your gaming journey
                    </motion.p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-1 h-1 rounded-full bg-red-400" />
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group"
                    >
                        <label className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gaming-accent" />
                                Username
                            </div>
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocused('username')}
                            onBlur={() => setFocused(null)}
                            placeholder="your_username"
                            required
                            className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gaming-accent focus:bg-white/10 focus:ring-2 focus:ring-gaming-accent/30 transition-all duration-300"
                        />
                    </motion.div>

                    {/* Email Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="group"
                    >
                        <label className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gaming-accent" />
                                Email Address
                            </div>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused('email')}
                            onBlur={() => setFocused(null)}
                            placeholder="player@gameplug.com"
                            required
                            className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gaming-accent focus:bg-white/10 focus:ring-2 focus:ring-gaming-accent/30 transition-all duration-300"
                        />
                    </motion.div>

                    {/* Phone Number Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="group"
                    >
                        <label className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gaming-accent" />
                                Phone Number
                            </div>
                        </label>
                        <input
                            type="tel"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                            onFocus={() => setFocused('phone')}
                            onBlur={() => setFocused(null)}
                            placeholder="+1234567890"
                            required
                            className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gaming-accent focus:bg-white/10 focus:ring-2 focus:ring-gaming-accent/30 transition-all duration-300"
                        />
                    </motion.div>

                    {/* Password Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="group"
                    >
                        <label className="block text-xs font-semibold text-gray-300 mb-2.5 uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gaming-accent" />
                                Password
                            </div>
                        </label>
                        <div className="relative">
                            <motion.input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocused('password')}
                                onBlur={() => setFocused(null)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gaming-accent focus:bg-white/10 focus:ring-2 focus:ring-gaming-accent/30 transition-all duration-300 pr-12"
                            />
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gaming-accent transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Register Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-gaming-accent via-gaming-pink to-gaming-orange rounded-lg font-bold text-white shadow-[0_4px_20px_rgba(255,51,51,0.3)] hover:shadow-[0_6px_30px_rgba(255,51,51,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6 relative overflow-hidden group"
                        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 51, 51, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Join GameVerse</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
                <motion.p
                    className="mt-6 text-center text-gray-400 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Already have an account?{' '}
                    <motion.a
                        href="/"
                        className="text-gaming-accent hover:text-gaming-orange font-bold transition-colors"
                        whileHover={{ scale: 1.05 }}
                    >
                        Sign In
                    </motion.a>
                </motion.p>

                {/* Security Badge */}
                <motion.div
                    className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    <span>Secure connection • SSL encrypted</span>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
