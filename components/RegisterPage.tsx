'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, Gamepad2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phonenumber: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            await authAPI.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phonenumber: formData.phonenumber,
            })
            router.push('/login')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { key: 'username', label: 'Username', type: 'text', icon: User, placeholder: 'johndoe' },
        { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
        { key: 'phonenumber', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+1 (555) 000-0000' },
        { key: 'password', label: 'Password', type: showPassword ? 'text' : 'password', icon: Lock, placeholder: '••••••••' },
        { key: 'confirmPassword', label: 'Confirm Password', type: showPassword ? 'text' : 'password', icon: Lock, placeholder: '••••••••' },
    ]

    return (
        <div className="min-h-screen bg-neon-dark flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-10 -right-32 w-96 h-96 bg-neon-pink/15 rounded-full blur-[120px] animate-orb" />
            <div className="absolute bottom-10 -left-32 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-orb" style={{ animationDelay: '3s' }} />

            <motion.div
                className="w-full max-w-md relative z-10 py-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 cursor-pointer mb-6" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold">GAME<span className="text-neon-gradient">VERSE</span></span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
                    <p className="text-sm text-gray-500">Join the ultimate digital marketplace</p>
                </div>

                {/* Card */}
                <div className="glass-strong rounded-2xl p-8">
                    {error && (
                        <motion.div
                            className="mb-6 p-3 bg-neon-rose/10 border border-neon-rose/30 rounded-lg text-sm text-neon-rose"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.key}>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
                                <div className="relative">
                                    <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type={field.type}
                                        value={formData[field.key as keyof typeof formData]}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-neon-dark border border-white/10 rounded-xl text-white text-sm outline-none focus:border-neon-purple/50 focus:shadow-glow-purple transition-all placeholder-gray-600"
                                        placeholder={field.placeholder}
                                        required
                                    />
                                    {field.key === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 btn-neon rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            whileHover={{ scale: loading ? 1 : 1.01 }}
                            whileTap={{ scale: loading ? 1 : 0.99 }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </motion.button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <button onClick={() => router.push('/login')} className="text-neon-purple hover:text-neon-pink font-semibold transition-colors">
                        Sign in
                    </button>
                </p>
            </motion.div>
        </div>
    )
}
