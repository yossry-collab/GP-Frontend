"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Gamepad2,
  Monitor,
  Gift,
  LayoutGrid,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Zap,
  Shield,
  Globe,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Flame,
  Crown,
  ArrowRight,
  ShoppingCart,
  Heart,
  Eye,
  Trophy,
  Twitter,
  Github,
  Youtube,
} from "lucide-react";
import { productsAPI } from "@/lib/api";
import { Product } from "@/lib/cart-context";
import ProductCard from "@/components/ProductCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

/* ─── Floating orb ─── */
function FloatingOrb({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, -10, 10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Hero Slides (STATIC VALUE) ─── */
const heroSlides = [
  {
    image: "/images/hero/Jason_and_Lucia_01_With_Logos_landscape.jpg",
    title: "Grand Theft Auto VI",
    subtitle: "The most anticipated game of the decade",
    tag: "Pre-Order",
    heroPosition: "center 18%",
    cardPosition: "center 20%",
    accent: "#06b6d4",
  },
  {
    image: "/images/hero/rdr2.jpg",
    title: "Red Dead Redemption 2",
    subtitle: "Epic tale of life in America's heartland",
    tag: "Top Rated",
    heroPosition: "center 16%",
    cardPosition: "center 18%",
    accent: "#ef4444",
  },
  {
    image: "/images/hero/god-of-war-valhalla-3840x2160-13667.jpg",
    title: "God of War Ragnarök",
    subtitle: "Embark on an epic Norse mythology adventure",
    tag: "Award Winner",
    heroPosition: "center 12%",
    cardPosition: "center 14%",
    accent: "#3b82f6",
  },
  {
    image: "/images/hero/apex-legends-breach-3840x2160-25673.jpg",
    title: "Apex Legends",
    subtitle: "Squad up for high-speed battle royale action",
    tag: "Free to Play",
    heroPosition: "center 14%",
    cardPosition: "center 16%",
    accent: "#ec4899",
  },
  {
    image: "/images/hero/nba-2k26-shai-3840x2160-23252.jpg",
    title: "NBA 2K26",
    subtitle: "Rise to the occasion",
    tag: "New Release",
    heroPosition: "center 20%",
    cardPosition: "center 22%",
    accent: "#f59e0b",
  },
  {
    image:
      "/images/hero/hitman-3-agent-47-xbox-one-x-playstation-5-2020-games-3840x2160-1277.png",
    title: "Hitman: World of Assassination",
    subtitle: "The world is your weapon",
    tag: "Stealth",
    heroPosition: "center 15%",
    cardPosition: "center 17%",
    accent: "#dc2626",
  },
  {
    image: "/images/hero/fortnite-festival-3840x2160-25375.jpg",
    title: "Fortnite Festival",
    subtitle: "Headline the next big crossover event",
    tag: "Live Event",
    heroPosition: "center 28%",
    cardPosition: "center 48%",
    accent: "#f472b6",
  },
  {
    image: "/images/hero/call-of-duty-modern-3840x2160-13480.jpg",
    title: "Call of Duty: Modern Warfare III",
    subtitle: "Fast, brutal, and built for elite squads",
    tag: "Action",
    heroPosition: "center 24%",
    cardPosition: "center 42%",
    accent: "#ef4444",
  },
  {
    image: "/images/hero/assassins-creed-3840x2160-16757.jpeg",
    title: "Assassin's Creed Shadows",
    subtitle: "A red-lit war between shadow and honor",
    tag: "Stealth",
    heroPosition: "center 38%",
    cardPosition: "center 46%",
    accent: "#dc2626",
  },
  {
    image:
      "/images/hero/battlefield-2042-e3-2021-pc-games-playstation-4-playstation-3840x2160-5613.jpg",
    title: "Battlefield 2042",
    subtitle: "All-out war with scale, storms, and pressure",
    tag: "Battlefield",
    heroPosition: "center 32%",
    cardPosition: "center 44%",
    accent: "#06b6d4",
  },
];

type SortOption = "featured" | "price-asc" | "price-desc" | "name" | "discount";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [activePlatform, setActivePlatform] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Auto-advance hero slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollCarousel = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const categories = [
    { key: "all", label: "All Products", icon: LayoutGrid },
    { key: "game", label: "Games", icon: Gamepad2 },
    { key: "software", label: "Software", icon: Monitor },
    { key: "gift-card", label: "Gift Cards", icon: Gift },
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: "featured", label: "Featured First" },
    { key: "price-asc", label: "Price: Low → High" },
    { key: "price-desc", label: "Price: High → Low" },
    { key: "name", label: "Name A-Z" },
    { key: "discount", label: "Biggest Discount" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSubcategory, activePlatform, search, sortBy]);

  // Reset sub-filters when category changes
  useEffect(() => {
    setActiveSubcategory("all");
    setActivePlatform("all");
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.products || [];
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Derive subcategories and platforms from current category
  const subcategories = useMemo(() => {
    const pool =
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory);
    const subs = [
      ...new Set(pool.map((p) => p.subcategory).filter(Boolean)),
    ] as string[];
    return subs.sort();
  }, [products, activeCategory]);

  const platforms = useMemo(() => {
    const pool =
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory);
    const plats = [
      ...new Set(pool.map((p) => p.platform).filter(Boolean)),
    ] as string[];
    return plats.sort();
  }, [products, activeCategory]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = products.filter((p) => p.image && p.image.trim() !== "");
    if (activeCategory !== "all")
      result = result.filter((p) => p.category === activeCategory);
    if (activeSubcategory !== "all")
      result = result.filter((p) => p.subcategory === activeSubcategory);
    if (activePlatform !== "all")
      result = result.filter((p) => p.platform === activePlatform);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.genre?.toLowerCase().includes(q) ||
          p.publisher?.toLowerCase().includes(q) ||
          p.platform?.toLowerCase().includes(q),
      );
    }
    switch (sortBy) {
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "discount":
        result.sort(
          (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
        );
        break;
    }
    return result;
  }, [
    products,
    activeCategory,
    activeSubcategory,
    activePlatform,
    search,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const activeFiltersCount = [
    activeSubcategory !== "all",
    activePlatform !== "all",
  ].filter(Boolean).length;

  // Recommended / featured products (games with images, top 8)
  const recommended = useMemo(() => {
    return products
      .filter((p) => p.category === "game" && p.image)
      .sort((a, b) => {
        if (b.featured && !a.featured) return 1;
        if (a.featured && !b.featured) return -1;
        return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      })
      .slice(0, 10);
  }, [products]);

  // Top deals
  const topDeals = useMemo(() => {
    return products
      .filter((p) => (p.discountPercentage || 0) > 0 && p.image)
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
      .slice(0, 6);
  }, [products]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
        <Navbar />

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── HERO BANNER WITH SLIDESHOW ────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="relative h-[72svh] min-h-[500px] sm:h-[62vh] sm:min-h-[430px] md:h-[70vh] md:min-h-[520px] md:max-h-[720px] overflow-hidden">
          {/* Floating Orbs */}
          <FloatingOrb
            className="w-72 h-72 bg-primary-500/15 -top-20 -left-20"
            delay={0}
          />
          <FloatingOrb
            className="w-64 h-64 bg-accent-500/10 -bottom-20 right-10"
            delay={4}
          />

          {/* Background slideshow */}
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
                exit={{
                  x: slideDirection > 0 ? "-100%" : "100%",
                  opacity: 0.5,
                }}
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0b0b11] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(139,92,246,0.06)_0%,transparent_60%)]" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center pt-16 pb-12 sm:pt-14 md:pt-20 lg:pt-24">
            <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
              <motion.div
                className="flex-1 max-w-xl w-full text-center lg:text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-5"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white/90">
                    {products.length}+ products available
                  </span>
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Digital{" "}
                  <span className="relative inline-block">
                    <span className="text-gradient">Marketplace</span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  className="text-sm sm:text-base text-gray-300 mb-6 max-w-lg leading-relaxed mx-auto lg:mx-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  Discover the best deals on games, software keys, and gift
                  cards. Instant delivery, always.
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-sm text-gray-300/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                    {[
                      { icon: Zap, label: "Instant Delivery" },
                      { icon: Shield, label: "Secure Checkout" },
                      { icon: Globe, label: "150+ Countries" }, // STATIC VALUE
                    ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <Icon className="w-3 h-3 text-primary-400" />
                      </div>
                      {label}
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  className="lg:hidden mt-6 w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.45 }}
                >
                  <div className="relative h-40">
                    <img
                      src={heroSlides[currentSlide].image}
                      alt={heroSlides[currentSlide].title}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: heroSlides[currentSlide].cardPosition,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-md bg-primary-500/80 backdrop-blur-sm text-[9px] font-bold text-white uppercase">
                        {heroSlides[currentSlide].tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <p className="text-white font-bold text-sm leading-tight">
                        {heroSlides[currentSlide].title}
                      </p>
                      <p className="text-white/60 text-[11px] mt-1 line-clamp-2">
                        {heroSlides[currentSlide].subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-black/20">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                      <p className="text-sm font-bold text-white leading-none">
                        {products.length}+
                      </p>
                      <p className="text-[9px] text-white/45 uppercase tracking-wider mt-1">
                        Products
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                      <p className="text-sm font-bold text-gradient leading-none">
                        {topDeals.length > 0
                          ? `${Math.max(...topDeals.map((d) => d.discountPercentage || 0))}%`
                          : "Hot"}
                      </p>
                      <p className="text-[9px] text-white/45 uppercase tracking-wider mt-1">
                        Max Discount
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Current slide card */}
              <motion.div
                className="hidden lg:flex flex-col items-end gap-3 flex-shrink-0 lg:ml-auto lg:self-end lg:translate-x-16 lg:translate-y-12 xl:translate-x-24 xl:translate-y-16"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative w-[292px] h-[178px] xl:w-[304px] xl:h-[186px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl group">
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
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded-md bg-primary-500/80 backdrop-blur-sm text-[9px] font-bold text-white uppercase">
                          {heroSlides[currentSlide].tag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-[13px] xl:text-sm leading-tight">
                          {heroSlides[currentSlide].title}
                        </p>
                        <p className="text-white/50 text-[11px] mt-0.5 line-clamp-2">
                          {heroSlides[currentSlide].subtitle}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[9px] font-bold text-white/70 border border-white/10">
                    {currentSlide + 1} / {heroSlides.length}
                  </div>
                  {/* Accent bar */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: heroSlides[currentSlide].accent }}
                    layoutId="storeSlideAccent"
                  />
                </div>

                {/* Mini stat cards */}
                <div className="flex gap-3 mr-1 xl:mr-2 mt-2">
                  <motion.div
                    className="px-3.5 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center min-w-[88px]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <p className="text-sm font-bold text-white leading-none">
                      {products.length}+
                    </p>
                    <p className="text-[9px] text-white/40 uppercase tracking-wider">
                      Products
                    </p>
                  </motion.div>
                  <motion.div
                    className="px-3.5 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center min-w-[104px]"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                  >
                    <p className="text-sm font-bold text-gradient leading-none">
                      {topDeals.length > 0
                        ? `${Math.max(...topDeals.map((d) => d.discountPercentage || 0))}%`
                        : "Hot"}
                    </p>
                    <p className="text-[9px] text-white/40 uppercase tracking-wider">
                      Max Discount
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Slide indicators — pill container */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
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
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── RECOMMENDED GAMES CAROUSEL ────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        {recommended.length > 0 && (
          <section className="py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow-sm">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Recommended <span className="text-gradient">Games</span>
                    </h2>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Handpicked for you, updated daily
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => scrollCarousel("left")}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => scrollCarousel("right")}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>

              <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 dark:from-[#0b0b11] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-[#0b0b11] to-transparent z-10 pointer-events-none" />

                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1 snap-x"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {recommended.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      className="flex-shrink-0 w-[280px] snap-start"
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── TOP DEALS BANNER ──────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        {topDeals.length > 0 && (
          <section className="pb-10 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/[0.07] via-accent-500/[0.05] to-primary-600/[0.07] dark:from-primary-600/[0.04] dark:via-accent-500/[0.03] dark:to-primary-600/[0.04]" />
                <div className="absolute inset-0 border border-primary-200/50 dark:border-primary-500/10 rounded-2xl" />
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                {/* Glow accent */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Flame className="w-5 h-5 text-orange-500" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Hot <span className="text-gradient">Deals</span>
                      </h3>
                    </div>
                    <div className="h-5 w-px bg-gray-300 dark:bg-white/10" />
                    <span className="text-xs text-gray-500">
                      Up to{" "}
                      <span className="text-red-500 font-bold">
                        {Math.max(
                          ...topDeals.map((d) => d.discountPercentage || 0),
                        )}
                        % off
                      </span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {topDeals.map((product, idx) => (
                      <motion.div
                        key={product._id}
                        className="group cursor-pointer p-3 text-center rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] hover:border-primary-300 dark:hover:border-primary-500/20 transition-all duration-300"
                        onClick={() =>
                          (window.location.href = `/store/${product._id}`)
                        }
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{
                          y: -4,
                          boxShadow: "0 0 20px rgba(139,92,246,0.1)",
                        }}
                      >
                        <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-gray-100 dark:bg-white/[0.04] overflow-hidden ring-2 ring-transparent group-hover:ring-primary-500/30 transition-all">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg opacity-20">
                              🎮
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-1.5">
                          <span className="text-xs font-bold text-gradient">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-[10px] font-bold text-red-500">
                            -{product.discountPercentage}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── ALL PRODUCTS SECTION ──────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="pb-20 relative z-10">
          {/* Ambient glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            {/* Section header */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Browse <span className="text-gradient">All Products</span>
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">
                  {filtered.length} products available
                </p>
              </div>
            </motion.div>

            {/* Search + Sort row */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 mb-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, publishers, genres..."
                  className="input pl-10 pr-10 w-full"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="input pr-8 text-sm appearance-none cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    showFilters || activeFiltersCount > 0
                      ? "bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30 text-primary-700 dark:text-primary-400"
                      : "bg-white dark:bg-[#16161f] border-gray-200 dark:border-white/[0.06] text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Category tabs */}
            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === cat.key
                      ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-glow-sm"
                      : "bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-primary-300 dark:hover:border-primary-500/20"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                  <span className="text-xs opacity-60">
                    (
                    {cat.key === "all"
                      ? products.length
                      : products.filter((p) => p.category === cat.key).length}
                    )
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Expandable filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="card p-4 mb-6 space-y-4">
                    {subcategories.length > 0 && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          Subcategory
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => setActiveSubcategory("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeSubcategory === "all" ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                          >
                            All
                          </button>
                          {subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setActiveSubcategory(sub)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeSubcategory === sub ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {platforms.length > 0 && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          Platform
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => setActivePlatform("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePlatform === "all" ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                          >
                            All
                          </button>
                          {platforms.map((plat) => (
                            <button
                              key={plat}
                              onClick={() => setActivePlatform(plat)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePlatform === plat ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                            >
                              {plat}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => {
                          setActiveSubcategory("all");
                          setActivePlatform("all");
                        }}
                        className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Clear all filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-white/[0.04] animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-white/[0.06] rounded-lg w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-white/[0.06] rounded-lg w-full animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-white/[0.06] rounded-lg w-1/2 animate-pulse" />
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-5 bg-gray-200 dark:bg-white/[0.06] rounded-lg w-16 animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-white/[0.06] rounded-lg w-12 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for
                </p>
                <motion.button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                    setActiveSubcategory("all");
                    setActivePlatform("all");
                  }}
                  className="btn-primary px-6 py-2.5 text-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-10">
                <motion.div
                  key={currentPage + activeCategory + search}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.04,
                      }
                    }
                  }}
                >
                  {paginatedProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      variants={{
                        hidden: { opacity: 0, y: 15, scale: 0.98 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Only show current page, first, last, and neighbors if many pages
                        if (totalPages > 7) {
                           if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                             if (Math.abs(page - currentPage) === 2) return <span key={page} className="text-gray-400 px-1">...</span>;
                             return null;
                           }
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === page ? "bg-primary-600 text-white shadow-glow-sm" : "bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── PLATFORMS MARQUEE ───────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="py-14 relative z-10 border-y border-gray-200 dark:border-white/[0.04] bg-white/50 dark:bg-[#0e0e18]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                Trusted platforms we support
              </p>
            </div>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#0e0e18] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#0e0e18] to-transparent z-10 pointer-events-none" />
              <motion.div
                className="flex gap-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                {[
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
                ].map((platform, idx) => (
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

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── LOYALTY REWARDS CTA ────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="py-16 relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600" />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent-500/20 blur-3xl"
                animate={{ scale: [1, 0.9, 1] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-5">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span className="text-sm font-medium text-white/90">
                      Loyalty Rewards
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
                    Earn Points on Every Purchase
                  </h2>
                  <p className="text-white/60 mb-6 max-w-md text-sm">
                    Collect loyalty points, unlock exclusive packs, climb tier
                    ranks, and get rewarded for being a GamePlug member.
                  </p>
                  <motion.button
                    onClick={() => (window.location.href = "/rewards")}
                    className="px-8 py-3.5 bg-white text-primary-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-xl inline-flex items-center gap-2"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Rewards <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex gap-4">
                  {[
                    {
                      label: "Silver",
                      color: "from-gray-300 to-gray-400",
                      emoji: "🥈",
                    },
                    {
                      label: "Gold",
                      color: "from-amber-400 to-amber-600",
                      emoji: "🥇",
                    },
                    {
                      label: "Platinum",
                      color: "from-cyan-400 to-indigo-500",
                      emoji: "💎",
                    },
                  ].map((tier, i) => (
                    <motion.div
                      key={tier.label}
                      className="w-24 h-28 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-2"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.6,
                      }}
                    >
                      <span className="text-2xl">{tier.emoji}</span>
                      <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">
                        {tier.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── FOOTER ─────────────────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
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
                &copy; 2026 GAME PLUG. All rights reserved.
              </div>
              <div className="flex items-center gap-3">
                {["Visa", "MasterCard", "PayPal", "Crypto", "Flouci"].map(
                  (p) => (
                    <span
                      key={p}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-white/[0.04] rounded-lg text-[10px] text-gray-500 font-semibold border border-gray-200 dark:border-white/[0.06]"
                    >
                      {p}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
