'use client'

import { motion } from 'framer-motion'
import { Gamepad2, Search, ShoppingCart, Zap, Shield, Key, Gift, Monitor, ChevronRight, Star, ArrowRight, Download, CreditCard, Headphones, Mail, Twitter, Instagram, Github, Sparkles, Globe, Clock, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useEffect, useState } from 'react'
import { productsAPI } from '@/lib/api'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsAPI.getAll()
        const data = Array.isArray(res.data) ? res.data : res.data.products || []
        setProducts(data.slice(0, 8))
      } catch { }
    }
    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neon-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const categories = [
    { icon: Gamepad2, label: 'Games', desc: 'PC & Console', count: '2,400+', gradient: 'from-neon-purple to-neon-violet' },
    { icon: Monitor, label: 'Software', desc: 'Keys & Licenses', count: '850+', gradient: 'from-neon-blue to-neon-cyan' },
    { icon: Gift, label: 'Gift Cards', desc: 'All Platforms', count: '300+', gradient: 'from-neon-pink to-neon-rose' },
    { icon: Key, label: 'Digital Keys', desc: 'Instant Delivery', count: '1,200+', gradient: 'from-neon-cyan to-neon-blue' },
  ]

  const steps = [
    { icon: Search, title: 'Choose Product', desc: 'Browse our collection of games, software, and gift cards' },
    { icon: CreditCard, title: 'Pay Securely', desc: '256-bit SSL encryption with multiple payment options' },
    { icon: Zap, title: 'Receive Instantly', desc: 'Get your digital key or code delivered in seconds' },
    { icon: CheckCircle, title: 'Activate & Enjoy', desc: 'Redeem your code and start using immediately' },
  ]

  const platforms = ['Steam', 'PlayStation', 'Xbox', 'Windows', 'Nintendo', 'Epic Games']

  return (
    <div className="min-h-screen bg-neon-dark text-white">

      {/* ═══ FLOATING ORBS (Background) ═══ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-[120px] animate-orb" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-neon-pink/8 rounded-full blur-[150px] animate-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-neon-cyan/8 rounded-full blur-[130px] animate-orb" style={{ animationDelay: '4s' }} />
      </div>

      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        className="sticky top-0 z-50 glass-strong"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">GAME<span className="text-neon-gradient">VERSE</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <span className="hover:text-white transition-colors cursor-pointer">Games</span>
            <span className="hover:text-white transition-colors cursor-pointer">Software</span>
            <span className="hover:text-white transition-colors cursor-pointer">Gift Cards</span>
            <span className="hover:text-white transition-colors cursor-pointer">Deals</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/login')} className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => router.push('/register')} className="btn-neon px-5 py-2 rounded-lg text-sm font-semibold text-white">
              Create Account
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <motion.div
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-neon-purple" />
              <span className="text-sm font-medium text-neon-purple">Trusted by 10M+ gamers worldwide</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
              Discover, collect<br />
              & sell <span className="text-neon-gradient">Fungible</span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
              Your premier digital marketplace for games, software keys, and gift cards. Instant delivery, secure checkout, and the best prices online.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.button
                onClick={() => router.push('/register')}
                className="btn-neon px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Browse Store <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => router.push('/login')}
                className="btn-neon-outline px-8 py-3.5 rounded-xl font-bold text-sm text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Deals
              </motion.button>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-neon-cyan" /> Instant Delivery</div>
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-neon-purple" /> Secure Checkout</div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-neon-pink" /> 150+ Countries</div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="relative w-80 h-80 md:w-[420px] md:h-[420px] flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-neon-pink/10 to-neon-cyan/20 rounded-full blur-[80px]" />
            <div className="relative w-full h-full rounded-3xl bg-neon-card/50 border border-white/5 flex items-center justify-center overflow-hidden">
              <div className="text-[120px] animate-float">🎮</div>
              {/* Floating icons */}
              <motion.div className="absolute top-8 right-8 w-12 h-12 bg-neon-purple/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-neon-purple/20" animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3 }}>
                <Key className="w-6 h-6 text-neon-purple" />
              </motion.div>
              <motion.div className="absolute bottom-12 left-8 w-12 h-12 bg-neon-pink/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-neon-pink/20" animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 4 }}>
                <Gift className="w-6 h-6 text-neon-pink" />
              </motion.div>
              <motion.div className="absolute top-1/2 left-4 w-10 h-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-neon-cyan/20" animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 3.5 }}>
                <Download className="w-5 h-5 text-neon-cyan" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TOP CATEGORIES ═══ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="flex items-center justify-between mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div>
              <h2 className="text-3xl font-bold mb-1">Top <span className="text-neon-gradient">Categories</span></h2>
              <p className="text-gray-500 text-sm">Browse our most popular product categories</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.label}
                className="group bg-neon-card border border-white/5 rounded-2xl p-6 cursor-pointer card-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => router.push('/register')}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 group-hover:shadow-glow-purple transition-shadow`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-0.5">{cat.label}</h3>
                <p className="text-xs text-gray-500 mb-2">{cat.desc}</p>
                <p className="text-sm font-semibold text-neon-purple">{cat.count} products</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR PRODUCTS (from API) ═══ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="flex items-center justify-between mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div>
              <h2 className="text-3xl font-bold mb-1">The Digital <span className="text-neon-gradient">Marketplace</span></h2>
              <p className="text-gray-500 text-sm">Discover our latest and most popular products</p>
            </div>
            <button onClick={() => router.push('/register')} className="text-sm text-neon-purple hover:text-neon-pink font-medium flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                className="group bg-neon-card border border-white/5 rounded-2xl overflow-hidden cursor-pointer card-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                onClick={() => router.push('/register')}
              >
                <div className="h-44 bg-neon-surface overflow-hidden relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🎮</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-card via-transparent to-transparent opacity-60" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${product.category === 'game' ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' :
                      product.category === 'software' ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' :
                        'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                      }`}>
                      {product.category === 'gift-card' ? 'Gift Card' : product.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded text-[10px] font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Instant
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-neon-purple transition-colors">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-black text-neon-gradient">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">{product.stock} in stock</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-neon-card rounded-2xl h-72 animate-pulse border border-white/5" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-2">Create & sell your <span className="text-neon-gradient">Digital Products</span></h2>
            <p className="text-gray-500">Get started in 4 easy steps</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                className="relative bg-neon-card border border-white/5 rounded-2xl p-6 text-center card-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center mb-4 mt-2">
                  <step.icon className="w-8 h-8 text-neon-purple" />
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PLATFORMS ═══ */}
      <section className="py-14 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Trusted platforms we support</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {platforms.map((platform, idx) => (
              <motion.div
                key={platform}
                className="px-8 py-4 bg-neon-card border border-white/5 rounded-xl text-gray-400 font-semibold text-sm hover:text-white hover:border-neon-purple/30 transition-all cursor-pointer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                {platform}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="relative bg-gradient-to-r from-neon-purple/80 via-neon-pink/80 to-neon-violet/80 rounded-3xl p-10 md:p-14 overflow-hidden text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-3">Subscribe <span className="text-white/90">News</span></h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">Get exclusive deals, instant game drops, and early access to promotions</p>
              <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 outline-none focus:border-white/50 transition-all text-sm backdrop-blur-sm"
                />
                <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-neon-purple rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-neon-darker border-t border-white/5 pt-14 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">GAME<span className="text-neon-gradient">VERSE</span></span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Your trusted digital marketplace for games, software, and gift cards.</p>
              <div className="flex gap-3">
                {[Twitter, Instagram, Github, Globe].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 bg-neon-card border border-white/5 rounded-lg flex items-center justify-center text-gray-500 hover:text-neon-purple hover:border-neon-purple/30 hover:shadow-glow-purple transition-all cursor-pointer">
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: 'Marketplace', links: ['All Products', 'Games', 'Software', 'Gift Cards'] },
              { title: 'Account', links: ['Profile', 'My Orders', 'Wishlist', 'Settings'] },
              { title: 'Resources', links: ['Help Center', 'Blog', 'Partners', 'API'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Privacy Policy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold mb-4 text-gray-300">{col.title}</h4>
                <div className="space-y-2.5">
                  {col.links.map(link => (
                    <div key={link} className="text-xs text-gray-500 hover:text-neon-purple cursor-pointer transition-colors">{link}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-600">© 2026 GAMEVERSE. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-600">Accepted:</span>
              <div className="flex gap-2">
                {['Visa', 'MC', 'PayPal', 'Crypto'].map(p => (
                  <span key={p} className="px-2.5 py-1 bg-neon-card rounded text-[10px] text-gray-400 font-medium border border-white/5">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
