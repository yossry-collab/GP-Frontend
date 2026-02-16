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
} from "lucide-react";
import { productsAPI } from "@/lib/api";
import { Product } from "@/lib/cart-context";
import ProductCard from "@/components/ProductCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

// ═══════════════════════════════════════════════════════
// ─── HERO SLIDES ─────────────────────────────────────
// ═══════════════════════════════════════════════════════
const heroSlides = [
  {
    image: "/images/hero/cod-blackops.jpg",
    title: "Call of Duty: Black Ops",
    subtitle: "The ultimate tactical shooter",
    tag: "Best Seller",
  },
  {
    image: "/images/hero/Jason_and_Lucia_01_With_Logos_landscape.jpg",
    title: "Grand Theft Auto VI",
    subtitle: "The most anticipated game of the decade",
    tag: "Pre-Order",
  },
  {
    image: "/images/hero/rdr2.jpg",
    title: "Red Dead Redemption 2",
    subtitle: "Epic tale of life in America's heartland",
    tag: "Top Rated",
  },
  {
    image: "/images/hero/ragnarok.jpg",
    title: "God of War Ragnarök",
    subtitle: "Embark on an epic Norse mythology adventure",
    tag: "Award Winner",
  },
  {
    image: "/images/hero/eldenRing.jpg",
    title: "Elden Ring",
    subtitle: "A vast world full of excitement and discovery",
    tag: "Game of the Year",
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
    let result = [...products];
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
      .filter((p) => (p.discountPercentage || 0) > 0)
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
        <section className="relative h-[55vh] min-h-[380px] max-h-[520px] overflow-hidden">
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
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0b0b11] via-transparent to-transparent" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
            <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
              <motion.div
                className="flex-1 max-w-xl"
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
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-medium text-white/90">
                    {products.length}+ products available
                  </span>
                </motion.div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-4 text-white">
                  Digital <span className="text-gradient">Marketplace</span>
                </h1>

                <p className="text-base text-gray-300 mb-6 max-w-lg leading-relaxed">
                  Discover the best deals on games, software keys, and gift
                  cards. Instant delivery, always.
                </p>

                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-300/80">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-400" /> Instant
                    Delivery
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-400" /> Secure
                    Checkout
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary-400" /> 150+
                    Countries
                  </div>
                </div>
              </motion.div>

              {/* Current slide card */}
              <motion.div
                className="hidden lg:block flex-shrink-0"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative w-[300px] h-[180px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
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
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded-md bg-primary-500/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase">
                          {heroSlides[currentSlide].tag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-sm">
                          {heroSlides[currentSlide].title}
                        </p>
                        <p className="text-white/60 text-xs mt-0.5">
                          {heroSlides[currentSlide].subtitle}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] font-bold text-white/70">
                    {currentSlide + 1} / {heroSlides.length}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSlideDirection(idx > currentSlide ? 1 : -1);
                  setCurrentSlide(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? "w-8 h-2.5 bg-gradient-to-r from-primary-500 to-accent-500 shadow-glow-sm"
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── RECOMMENDED GAMES CAROUSEL ────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        {recommended.length > 0 && (
          <section className="py-10 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow-sm">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Recommended <span className="text-gradient">Games</span>
                    </h2>
                    <p className="text-gray-500 text-xs">Handpicked for you</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollCarousel("left")}
                    className="p-2 rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollCarousel("right")}
                    className="p-2 rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.06] text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/20 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

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
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── TOP DEALS BANNER ──────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        {topDeals.length > 0 && (
          <section className="pb-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                className="relative bg-gradient-to-r from-primary-600/10 via-accent-500/10 to-primary-600/10 dark:from-primary-600/5 dark:via-accent-500/5 dark:to-primary-600/5 border border-primary-200/50 dark:border-primary-500/10 rounded-2xl p-6 overflow-hidden"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Hot <span className="text-gradient">Deals</span>
                    </h3>
                  </div>
                  <div className="h-5 w-px bg-gray-300 dark:bg-white/10" />
                  <span className="text-xs text-gray-500">
                    Up to{" "}
                    {Math.max(
                      ...topDeals.map((d) => d.discountPercentage || 0),
                    )}
                    % off
                  </span>
                </div>
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {topDeals.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      className="card-hover group cursor-pointer p-3 text-center"
                      onClick={() =>
                        (window.location.href = `/store/${product._id}`)
                      }
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gray-100 dark:bg-white/[0.04] overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg opacity-20">
                            🎮
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/15 text-[10px] font-bold text-red-600 dark:text-red-400">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ─── ALL PRODUCTS SECTION ──────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="pb-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Section header */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Browse <span className="text-gradient">All Products</span>
                </h2>
                <p className="text-gray-500 text-xs">
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
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-white/[0.04]" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-white/[0.04] rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-white/[0.04] rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                    setActiveSubcategory("all");
                    setActivePlatform("all");
                  }}
                  className="btn-primary px-5 py-2.5 text-sm"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
