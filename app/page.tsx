'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Search, ShoppingCart, Zap, Shield, Key, Gift, Monitor, ChevronRight, Star, ArrowRight, Download, CreditCard, Globe, CheckCircle, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useEffect, useState, useCallback } from 'react'
import { productsAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'

const heroSlides = [
  {
    image: '/images/hero/cod-blackops.jpg',
    title: 'Call of Duty: Black Ops',
  },
  {
    image: '/images/hero/Jason_and_Lucia_01_With_Logos_landscape.jpg',
    title: 'Grand Theft Auto VI',
  },
  {
    image: '/images/hero/rdr2.jpg',
    title: 'Red Dead Redemption 2',
  },
  {
    image: '/images/hero/ragnarok.jpg',
    title: 'God of War Ragnarök',
  },
  {
    image: '/images/hero/eldenRing.jpg',
    title: 'Elden Ring',
  },
]

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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDirection, setSlideDirection] = useState(1) // 1 = right, -1 = left

  // Auto-advance hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideDirection(1)
      setCurrentSlide(prev => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const categories = [
    { icon: Gamepad2, label: 'Games', desc: 'PC & Console', count: '2,400+', color: 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400' },
    { icon: Monitor, label: 'Software', desc: 'Keys & Licenses', count: '850+', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' },
    { icon: Gift, label: 'Gift Cards', desc: 'All Platforms', count: '300+', color: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400' },
    { icon: Key, label: 'Digital Keys', desc: 'Instant Delivery', count: '1,200+', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' },
  ]

  const steps = [
    { icon: Search, title: 'Browse', desc: 'Explore our collection of games, software, and gift cards' },
    { icon: CreditCard, title: 'Pay Securely', desc: '256-bit SSL encryption with multiple payment options' },
    { icon: Zap, title: 'Receive Instantly', desc: 'Get your digital key delivered in seconds' },
    { icon: CheckCircle, title: 'Enjoy', desc: 'Redeem your code and start using immediately' },
  ]

  const platforms = ['Steam', 'PlayStation', 'Xbox', 'Windows', 'Nintendo', 'Epic Games']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] overflow-hidden flex items-center">
        {/* Background Image Slideshow */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false} custom={slideDirection}>
            <motion.div
              key={currentSlide}
              custom={slideDirection}
              initial={{ x: slideDirection > 0 ? '100%' : '-100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDirection > 0 ? '-100%' : '100%', opacity: 0.5 }}
              transition={{ duration: 0.8, ease: [0.42, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0b0b11] via-transparent to-transparent" />
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setSlideDirection(idx > currentSlide ? 1 : -1); setCurrentSlide(idx) }}
              className={`transition-all duration-300 rounded-full ${idx === currentSlide
                ? 'w-8 h-2.5 bg-gradient-to-r from-primary-500 to-accent-500 shadow-glow-sm'
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full py-20 md:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-white/90">Trusted by 10M+ gamers worldwide</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-white">
                Your Digital
                <br />
                <span className="text-gradient">Game Plug</span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                The premier marketplace for games, software keys, and gift cards. Instant delivery, secure checkout, and the best prices.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <motion.button
                  onClick={() => router.push('/register')}
                  className="btn-primary px-7 py-3.5 text-sm flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Browse Store <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => router.push('/login')}
                  className="px-7 py-3.5 text-sm font-semibold bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300/80">
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary-400" /> Instant Delivery</div>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary-400" /> Secure Checkout</div>
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary-400" /> 150+ Countries</div>
              </div>
            </motion.div>

            {/* Current slide title card */}
            <motion.div
              className="hidden lg:block flex-shrink-0"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-[340px] h-[200px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={heroSlides[currentSlide].image}
                      alt={heroSlides[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-sm">{heroSlides[currentSlide].title}</p>
                      <p className="text-white/60 text-xs mt-0.5">Now Available</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Slide counter */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] font-bold text-white/70">
                  {currentSlide + 1} / {heroSlides.length}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Top <span className="text-gradient">Categories</span></h2>
            <p className="text-gray-500 text-sm">Browse our most popular product categories</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.label}
                className="card-hover group p-6 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => router.push('/register')}
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-0.5">{cat.label}</h3>
                <p className="text-xs text-gray-400 mb-2">{cat.desc}</p>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{cat.count} products</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="flex items-center justify-between mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Featured <span className="text-gradient">Products</span></h2>
              <p className="text-gray-500 text-sm">Discover the latest and most popular</p>
            </div>
            <button onClick={() => router.push('/register')} className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                className="card-hover group overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                onClick={() => router.push('/register')}
              >
                <div className="h-44 bg-gray-100 dark:bg-white/[0.03] overflow-hidden relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🎮</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-[#16161f]/60 via-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${product.category === 'game' ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400' :
                      product.category === 'software' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' :
                        'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400'
                      }`}>
                      {product.category === 'gift-card' ? 'Gift Card' : product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gradient">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">{product.stock} in stock</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-72 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">How It <span className="text-gradient">Works</span></h2>
            <p className="text-gray-500">Get started in 4 easy steps</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                className="relative card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-xs font-bold text-white shadow-glow-sm">
                  {idx + 1}
                </div>
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-4 mt-2">
                  <step.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLATFORMS ═══ */}
      <section className="py-14 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Trusted platforms we support</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((platform, idx) => (
              <motion.div
                key={platform}
                className="px-6 py-3 card text-gray-500 dark:text-gray-400 font-medium text-sm hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/20 transition-all cursor-pointer"
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

      {/* ═══ CTA ═══ */}
      <section className="py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            className="relative bg-gradient-to-r from-primary-600 via-accent-500 to-primary-700 rounded-3xl p-10 md:p-14 overflow-hidden text-center shadow-glow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Ready to start?</h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">Join millions of gamers and get exclusive deals, instant delivery, and the best prices.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => router.push('/register')} className="px-8 py-3.5 bg-white text-primary-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
                  Create Free Account
                </button>
                <button onClick={() => router.push('/login')} className="px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-white dark:bg-[#0a0a10] border-t border-gray-200 dark:border-white/[0.06] pt-14 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">GAME<span className="text-gradient"> PLUG</span></span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Your trusted digital marketplace for games, software, and gift cards.</p>
            </div>
            {[
              { title: 'Marketplace', links: ['All Products', 'Games', 'Software', 'Gift Cards'] },
              { title: 'Account', links: ['Profile', 'My Orders', 'Wishlist', 'Settings'] },
              { title: 'Resources', links: ['Help Center', 'Blog', 'Partners', 'API'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-300">{col.title}</h4>
                <div className="space-y-2.5">
                  {col.links.map(link => (
                    <div key={link} className="text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">{link}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">© 2026 GAME PLUG. All rights reserved.</div>
            <div className="flex items-center gap-3">
              {['Visa', 'MC', 'PayPal', 'Crypto'].map(p => (
                <span key={p} className="px-2.5 py-1 bg-gray-100 dark:bg-white/[0.04] rounded text-[10px] text-gray-500 font-medium border border-gray-200 dark:border-white/[0.06]">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
