"use client";

import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { productsAPI } from "@/lib/api";
import { Product } from "@/lib/cart-context";
import ProductCard from "@/components/ProductCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11]">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
              Digital <span className="text-gradient">Marketplace</span>
            </h1>
            <p className="text-gray-500 text-sm">
              {filtered.length} products available
            </p>
          </motion.div>

          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
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
          </div>

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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
