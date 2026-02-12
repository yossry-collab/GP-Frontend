'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, Gamepad2, ArrowRight } from 'lucide-react'
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 -right-32 w-[500px] h-[500px] bg-accent-200/30 dark:bg-accent-500/[0.07] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-primary-200/20 dark:bg-primary-600/[0.05] rounded-full blur-[100px]" />

            <motion.div
                className="w-full max-w-md relative z-10 py-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 cursor-pointer mb-6" onClick={() => router.push('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">GAME<span className="text-gradient">VERSE</span></span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h1>
                    <p className="text-sm text-gray-500">Join the ultimate digital marketplace</p>
                </div>

                {/* Card */}
                <div className="card p-8">
                    {error && (
                        <motion.div
                            className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-600 dark:text-red-400"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.key}>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{field.label}</label>
                                <div className="relative">
                                    <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={field.type}
                                        value={formData[field.key as keyof typeof formData]}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        className="input pl-11"
                                        placeholder={field.placeholder}
                                        required
                                    />
                                    {field.key === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                            className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
                    <button onClick={() => router.push('/login')} className="text-primary-600 dark:text-primary-400 hover:text-accent-500 font-semibold transition-colors">
                        Sign in
                    </button>
                </p>
            </motion.div>
        </div>
    )
}
