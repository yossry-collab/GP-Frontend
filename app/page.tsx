"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, AnimatePresence } from "framer-motion";
import {
  GameController as Gamepad2,
  MagnifyingGlass as Search,
  ShoppingCart,
  Lightning as Zap,
  Shield,
  Key,
  Gift,
  Monitor,
  CaretRight as ChevronRight,
  Star,
  ArrowRight,
  CreditCard,
  Globe,
  CheckCircle,
  Trophy,
  Users,
  Heart,
  Flame,
  Lock,
  Headset as Headphones,
  Quotes as Quote,
  TwitterLogo as Twitter,
  GithubLogo as Github,
  YoutubeLogo as Youtube,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { productsAPI } from "@/lib/api";
import FloatingOrb from "@/components/FloatingOrb";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import SafeImage from "@/components/SafeImage";

/* ─── hero slides ─── */
const heroSlides = [
  {
    image: "/images/hero/Jason_and_Lucia_01_With_Logos_landscape.jpg",
    title: "Grand Theft Auto VI",
    subtitle: "Welcome to Vice City",
    heroPosition: "center 18%",
    cardPosition: "center 20%",
    accent: "#06b6d4",
  },
  {
    image: "/images/hero/rdr2.jpg",
    title: "Red Dead Redemption 2",
    subtitle: "Ride into the legend",
    heroPosition: "center 16%",
    cardPosition: "center 18%",
    accent: "#ef4444",
  },
  {
    image: "/images/hero/god-of-war-valhalla-3840x2160-13667.jpg",
    title: "God of War Ragnarök",
    subtitle: "Fate demands it",
    heroPosition: "center 12%",
    cardPosition: "center 14%",
    accent: "#3b82f6",
  },
  {
    image: "/images/hero/apex-legends-breach-3840x2160-25673.jpg",
    title: "Apex Legends",
    subtitle: "Become a champion",
    heroPosition: "center 14%",
    cardPosition: "center 16%",
    accent: "#ec4899",
  },
  {
    image: "/images/hero/nba-2k26-shai-3840x2160-23252.jpg",
    title: "NBA 2K26",
    subtitle: "Rise to greatness",
    heroPosition: "center 20%",
    cardPosition: "center 22%",
    accent: "#f59e0b",
  },
  {
    image:
      "/images/hero/hitman-3-agent-47-xbox-one-x-playstation-5-2020-games-3840x2160-1277.png",
    title: "Hitman: World of Assassination",
    subtitle: "The world is your weapon",
    heroPosition: "center 15%",
    cardPosition: "center 17%",
    accent: "#dc2626",
  },
  {
    image: "/images/hero/fortnite-festival-3840x2160-25375.jpg",
    title: "Fortnite Festival",
    subtitle: "Take the stage and own the spotlight",
    heroPosition: "center 28%",
    cardPosition: "center 48%",
    accent: "#f472b6",
  },
  {
    image: "/images/hero/call-of-duty-modern-3840x2160-13480.jpg",
    title: "Call of Duty: Modern Warfare III",
    subtitle: "Lock in for a full-throttle combat drop",
    heroPosition: "center 24%",
    cardPosition: "center 42%",
    accent: "#ef4444",
  },
  {
    image: "/images/hero/assassins-creed-3840x2160-16757.jpeg",
    title: "Assassin's Creed Shadows",
    subtitle: "Step into a darker era of stealth and steel",
    heroPosition: "center 38%",
    cardPosition: "center 46%",
    accent: "#dc2626",
  },
  {
    image:
      "/images/hero/battlefield-2042-e3-2021-pc-games-playstation-4-playstation-3840x2160-5613.jpg",
    title: "Battlefield 2042",
    subtitle: "Massive warfare at the edge of chaos",
    heroPosition: "center 32%",
    cardPosition: "center 44%",
    accent: "#06b6d4",
  },
];

/* ─── animated counter hook ─── */
function useCounter(target: number, duration = 2000, active = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(id);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration, active]);
  return count;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [statsVisible, setStatsVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  //const userBodyLanguage = useCounter(10000000, 2200, statsVisible);
  //const userBody = useCounter(10000000, 2200, statsVisible);
  const userCount = useCounter(10000000, 2200, statsVisible);
  const productCount = useCounter(4750, 2000, statsVisible);
  const countryCount = useCounter(152, 1800, statsVisible);
  const satisfactionCount = useCounter(99, 2400, statsVisible);

  // Auto-advance hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsAPI.getAll();
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];
        setProducts(data.slice(0, 8));
      } catch {}
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const categories = [
    {
      icon: Gamepad2,
      label: "Games",
      desc: "PC & Console titles",
      count: "2,400+",
      gradient: "from-primary-500 to-primary-700",
      glow: "rgba(139,92,246,0.25)",
    },
    {
      icon: Monitor,
      label: "Software",
      desc: "Keys & Licenses",
      count: "850+",
      gradient: "from-blue-500 to-blue-700",
      glow: "rgba(59,130,246,0.25)",
    },
    {
      icon: Gift,
      label: "Gift Cards",
      desc: "All Platforms",
      count: "300+",
      gradient: "from-pink-500 to-pink-700",
      glow: "rgba(236,72,153,0.25)",
    },
    {
      icon: Key,
      label: "Digital Keys",
      desc: "Instant Delivery",
      count: "1,200+",
      gradient: "from-amber-500 to-amber-700",
      glow: "rgba(245,158,11,0.25)",
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "Browse",
      desc: "Explore our massive collection of games, software, and gift cards",
    },
    {
      icon: CreditCard,
      title: "Pay Securely",
      desc: "256-bit SSL encryption with multiple payment methods",
    },
    {
      icon: Zap,
      title: "Receive Instantly",
      desc: "Your digital key delivered to your inbox in seconds",
    },
    {
      icon: CheckCircle,
      title: "Enjoy",
      desc: "Redeem your code and start playing immediately",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Delivery",
      desc: "Codes delivered within 30 seconds of purchase. No waiting, no delays.",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "100% Secure",
      desc: "Enterprise-grade encryption protects every transaction you make.",
      gradient: "from-emerald-400 to-green-600",
    },
    {
      icon: Trophy,
      title: "Loyalty Rewards",
      desc: "Earn points on every purchase. Unlock exclusive packs and tiers.",
      gradient: "from-primary-400 to-primary-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Our team is always available to help with any issues or questions.",
      gradient: "from-cyan-400 to-blue-600",
    },
    {
      icon: Globe,
      title: "Global Access",
      desc: "Available in 150+ countries with localized payment options.",
      gradient: "from-pink-400 to-accent-600",
    },
    {
      icon: Lock,
      title: "Buyer Protection",
      desc: "Full refund guarantee if a key doesn't work. No questions asked.",
      gradient: "from-red-400 to-rose-600",
    },
  ];

  const testimonials = [
    {
      name: "Alex M.",
      role: "PC Gamer",
      text: "Best prices I've found anywhere. Got GTA VI for 40% off and the key was delivered before I finished checkout!",
      rating: 5,
      avatar: "A",
    },
    {
      name: "Sarah K.",
      role: "Streamer",
      text: "I buy all my game keys here. The loyalty rewards are insane — already unlocked platinum tier.",
      rating: 5,
      avatar: "S",
    },
    {
      name: "Marcus T.",
      role: "Software Dev",
      text: "Needed a Windows license fast. Got it in 15 seconds. The interface is beautiful too.",
      rating: 5,
      avatar: "M",
    },
  ];

  const platforms = [
    "Steam",
    "PlayStation",
    "Xbox",
    "Windows",
    "Nintendo",
    "Epic Games",
    "Battle.net",
    "Ubisoft",
    "EA Play",
    "GOG",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] overflow-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[100svh] sm:min-h-[92vh] md:min-h-[94vh] lg:min-h-[98vh] overflow-hidden flex items-center">
        {/* Floating Orbs */}
        <FloatingOrb
          className="w-72 h-72 bg-primary-500/20 -top-20 -left-20"
          delay={0}
        />
        <FloatingOrb
          className="w-96 h-96 bg-accent-500/15 -bottom-32 right-10"
          delay={3}
        />
        <FloatingOrb
          className="w-48 h-48 bg-cyan-500/10 top-1/3 right-1/4"
          delay={6}
        />

        {/* Background Image Slideshow */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false} custom={slideDirection}>
            <motion.div
              key={currentSlide}
              custom={slideDirection}
              initial={{
                x: slideDirection > 0 ? "100%" : "-100%",
                opacity: 0.5,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDirection > 0 ? "-100%" : "100%", opacity: 0.5 }}
              transition={{ duration: 0.8, ease: [0.42, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <motion.img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: heroSlides[currentSlide].heroPosition,
                }}
                animate={{ scale: [1, 1.05] }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Layered overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0b0b11] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(139,92,246,0.08)_0%,transparent_60%)]" />
        </div>

        {/* Slide indicators — bottom-center pill style */}
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSlideDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`transition-all duration-500 rounded-full ${
                idx === currentSlide
                  ? "w-8 h-2.5 bg-gradient-to-r from-primary-500 to-accent-500 shadow-glow-sm"
                  : "w-2.5 h-2.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28 lg:pt-40">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
            <motion.div
              className="flex-1 max-w-2xl text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-white/90">
                  10M+ gamers trust us worldwide
                </span>
              </motion.div>

              <motion.h1
                className="text-[2.5rem] sm:text-5xl lg:text-7xl font-extrabold leading-[1.02] sm:leading-[1.05] mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                Your Ultimate{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">Game Plug</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                The premier marketplace for games, software keys, and gift
                cards. Instant delivery. Best prices. Always.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={() => router.push("/register")}
                  className="btn-primary w-full sm:w-auto px-8 py-4 text-sm flex items-center justify-center gap-2 shadow-glow"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => router.push("/login")}
                  className="w-full sm:w-auto px-8 py-4 text-sm font-semibold bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign In
                </motion.button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-sm text-gray-300/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { icon: Zap, label: "Instant Delivery" },
                  { icon: Shield, label: "Secure Checkout" },
                  { icon: Globe, label: "150+ Countries" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <Icon className="w-3 h-3 text-primary-400" />
                    </div>
                    {label}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right Column: Slide preview + floating stat cards ── */}
            <motion.div
              className="hidden lg:flex flex-col items-end gap-5 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Main slide card */}
              <div className="relative w-[360px] h-[215px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl group">
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{
                        objectPosition: heroSlides[currentSlide].cardPosition,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-sm">
                        {heroSlides[currentSlide].title}
                      </p>
                      <p className="text-white/50 text-xs mt-0.5">
                        {heroSlides[currentSlide].subtitle}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] font-bold text-white/70 border border-white/10">
                  {currentSlide + 1} / {heroSlides.length}
                </div>
                {/* Accent glow */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: heroSlides[currentSlide].accent }}
                  layoutId="slideAccent"
                />
              </div>

              {/* Floating stat mini-cards */}
              <div className="flex gap-3">
                <motion.div
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <p className="text-lg font-bold text-white">4,750+</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    Products
                  </p>
                </motion.div>
                <motion.div
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <p className="text-lg font-bold text-gradient">99%</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    Satisfaction
                  </p>
                </motion.div>
                <motion.div
                  className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                  }}
                >
                  <p className="text-lg font-bold text-white">24/7</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    Support
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <motion.section
        className="relative z-10 -mt-6"
        onViewportEnter={() => setStatsVisible(true)}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {[
              {
                value:
                  userCount >= 1000000
                    ? `${(userCount / 1000000).toFixed(0)}M+`
                    : `${(userCount / 1000).toFixed(0)}K`,
                label: "Active Gamers",
                icon: Users,
              },
              {
                value: `${productCount.toLocaleString()}+`,
                label: "Digital Products",
                icon: ShoppingCart,
              },
              { value: `${countryCount}+`, label: "Countries", icon: Globe },
              {
                value: `${satisfactionCount}%`,
                label: "Satisfaction",
                icon: Heart,
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="card p-5 text-center group hover:border-primary-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary-500 group-hover:scale-110 transition-transform" />
                <p className="text-2xl sm:text-3xl font-extrabold text-gradient">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold text-primary-500 uppercase tracking-[0.22em] mb-2">
              Explore
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Top <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Browse our most popular product categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.label}
                className="relative group p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#16161f] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2"
                style={{ boxShadow: `0 0 0px ${cat.glow}` }}
                whileHover={{ boxShadow: `0 0 30px ${cat.glow}` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => router.push("/register")}
              >
                {/* Background gradient glow */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
                />

                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-0.5">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-400 mb-3">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gradient">{cat.count}</p>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section className="py-20 relative z-10">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="text-xs font-bold text-primary-500 uppercase tracking-[0.22em] mb-2">
                Store
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Featured <span className="text-gradient">Products</span>
              </h2>
              <p className="text-gray-500 text-sm">
                Handpicked deals updated daily
              </p>
            </div>
            <motion.button
              onClick={() => router.push("/register")}
              className="hidden sm:flex items-center gap-2 btn-outline px-5 py-2.5 text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View All <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                className="card group overflow-hidden cursor-pointer hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                onClick={() => router.push("/register")}
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="h-48 bg-gray-100 dark:bg-white/[0.03] overflow-hidden relative">
                  {product.image ? (
                    <SafeImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                      🎮
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 dark:from-[#16161f]/80 via-transparent to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                        product.category === "game"
                          ? "bg-primary-500/80 text-white"
                          : product.category === "software"
                            ? "bg-blue-500/80 text-white"
                            : "bg-pink-500/80 text-white"
                      }`}
                    >
                      {product.category === "gift-card"
                        ? "Gift Card"
                        : product.category}
                    </span>
                  </div>

                  {/* Hover action button */}
                  <AnimatePresence>
                    {hoveredProduct === product._id && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-xl text-white text-xs font-bold shadow-glow flex items-center gap-2">
                          <ShoppingCart className="w-3.5 h-3.5" /> Quick View
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                    <span className="text-lg font-extrabold text-gradient">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-gray-400 font-medium">
                        {product.stock > 0 ? "In Stock" : "Sold Out"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="h-48 bg-gray-100 dark:bg-white/[0.03] animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-100 dark:bg-white/[0.06] rounded-lg animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-white/[0.06] rounded-lg animate-pulse w-1/2" />
                    <div className="h-5 bg-gray-100 dark:bg-white/[0.06] rounded-lg animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile "View All" */}
          <motion.button
            onClick={() => router.push("/register")}
            className="sm:hidden mt-8 w-full btn-outline px-5 py-3 text-sm flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Products <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* ═══ WHY GAMEPLUG ═══ */}
      <section className="py-20 relative z-10 bg-gray-100/50 dark:bg-[#0e0e18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold text-primary-500 uppercase tracking-[0.22em] mb-2">
              Why Us
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Why Gamers Choose <span className="text-gradient">GamePlug</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Everything you need in one place — speed, security, and savings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => (
              <motion.div
                key={feat.title}
                className="card group p-6 hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                {/* Hover background glow */}
                <div
                  className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-[0.06] blur-2xl transition-opacity duration-700`}
                />

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold text-primary-500 uppercase tracking-[0.22em] mb-2">
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Get Started in <span className="text-gradient">4 Steps</span>
            </h2>
            <p className="text-gray-500 text-sm">
              From browse to play in under a minute
            </p>
          </motion.div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-500/20 via-primary-500/40 to-primary-500/20" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.title}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  viewport={{ once: true }}
                >
                  {/* Step number circle */}
                  <div className="relative mx-auto mb-6">
                    <motion.div
                      className="w-24 h-24 mx-auto rounded-2xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] flex items-center justify-center shadow-soft-lg relative z-10"
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <step.icon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </motion.div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-xs font-bold text-white shadow-glow-sm z-20 ring-4 ring-gray-50 dark:ring-[#0b0b11]">
                      {idx + 1}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[200px] mx-auto">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLATFORMS MARQUEE ═══ */}
      <section className="py-16 relative z-10 border-y border-gray-200 dark:border-white/[0.04] bg-white/50 dark:bg-[#0e0e18]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">
              Trusted platforms we support
            </p>
          </div>
          {/* Marquee */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#0e0e18] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#0e0e18] to-transparent z-10 pointer-events-none" />
            <motion.div
              className="flex gap-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {[...platforms, ...platforms].map((platform, idx) => (
                <div
                  key={`${platform}-${idx}`}
                  className="flex-shrink-0 px-8 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] text-gray-600 dark:text-gray-400 font-semibold text-sm hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/20 transition-all cursor-pointer"
                >
                  {platform}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 relative z-10">
        <FloatingOrb
          className="w-64 h-64 bg-accent-500/10 -top-20 right-10"
          delay={2}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold text-primary-500 uppercase tracking-[0.22em] mb-2">
              Testimonials
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Loved by <span className="text-gradient">Gamers</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Don&apos;t just take our word for it
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                className="card p-6 relative group hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                {/* Quote decoration */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-500/10" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600" />

            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Floating decoration orbs */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent-500/20 blur-3xl"
              animate={{ scale: [1, 0.9, 1], rotate: [0, -60, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 p-10 md:p-16 text-center">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium text-white/90">
                  Join 10M+ gamers today
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Ready to Level Up?
              </h2>
              <p className="text-white/60 mb-10 max-w-lg mx-auto text-base sm:text-lg">
                Create your free account and get exclusive deals, instant
                delivery, and loyalty rewards from day one.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  onClick={() => router.push("/register")}
                  className="px-10 py-4 bg-white text-primary-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-xl"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Create Free Account
                </motion.button>
                <motion.button
                  onClick={() => router.push("/login")}
                  className="px-10 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign In
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-white dark:bg-[#0a0a10] border-t border-gray-200 dark:border-white/[0.06] pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-14">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center shadow-glow-sm">
                  <Gamepad2 className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-extrabold text-gray-900 dark:text-white text-lg">
                  GAME<span className="text-gradient"> PLUG</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-5">
                Your trusted digital marketplace for games, software, and gift
                cards. Serving 10M+ gamers worldwide.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-2">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Youtube, label: "YouTube" },
                  { icon: Github, label: "GitHub" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500/30 transition-all"
                    aria-label={label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
            {[
              {
                title: "Marketplace",
                links: ["All Products", "Games", "Software", "Gift Cards"],
              },
              {
                title: "Account",
                links: ["Profile", "My Orders", "Wishlist", "Rewards"],
              },
              {
                title: "Resources",
                links: ["Help Center", "Blog", "Partners", "API"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Privacy", "Terms"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold mb-4 text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                  {col.title}
                </h4>
                <div className="space-y-2.5">
                  {col.links.map((link) => (
                    <div
                      key={link}
                      className="text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                    >
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              © 2026 GAME PLUG. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              {["Visa", "MasterCard", "PayPal", "Crypto", "Flouci"].map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-white/[0.04] rounded-lg text-[10px] text-gray-500 font-semibold border border-gray-200 dark:border-white/[0.06]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
