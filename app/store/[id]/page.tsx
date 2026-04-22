"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Lightning as Zap,
  Shield,
  Package,
  Tag,
  Calendar,
  Buildings as Building2,
  GameController as Gamepad2,
  Monitor,
  Star,
  ArrowRight,
  CheckCircle as CheckCircle2,
  Sparkle as Sparkles,
  Globe,
  Heart,
} from "@phosphor-icons/react";
import { Product, useCart } from "@/lib/cart-context";
import { productsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SafeImage from "@/components/SafeImage";
import ProductCard from "@/components/ProductCard";
import FloatingOrb from "@/components/FloatingOrb";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [productResponse, productsResponse] = await Promise.all([
          productsAPI.getById(params.id),
          productsAPI.getAll(),
        ]);
        setProduct(productResponse.data.product);
        const data = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : productsResponse.data.products || [];
        setAllProducts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(
        (candidate) =>
          candidate._id !== product._id &&
          (candidate.category === product.category ||
            candidate.platform === product.platform ||
            candidate.genre === product.genre),
      )
      .slice(0, 4);
  }, [allProducts, product]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "game":
        return "from-primary-500 to-primary-700 text-white";
      case "software":
        return "from-blue-500 to-blue-700 text-white";
      case "gift-card":
        return "from-pink-500 to-pink-700 text-white";
      default:
        return "from-gray-500 to-gray-700 text-white";
    }
  };

  const getCategorySurface = (category: string) => {
    switch (category) {
      case "game":
        return "bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-500/15 dark:text-primary-400 dark:border-primary-500/30";
      case "software":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30";
      case "gift-card":
        return "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-500/15 dark:text-pink-400 dark:border-pink-500/30";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:border-white/[0.08]";
    }
  };

  const discount = product?.discountPercentage || 0;
  const originalPrice =
    product && discount > 0
      ? product.price / (1 - discount / 100)
      : product?.price || 0;

  if (loading) {
    return (
      <ProtectedRoute>
        <LoadingScreen />
      </ProtectedRoute>
    );
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-500 mb-6">
              {error || "This product does not exist"}
            </p>
            <button
              onClick={() => router.push("/store")}
              className="btn-primary px-6 py-3 text-sm"
            >
              Back to Store
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] relative overflow-hidden">
        <Navbar />

        <FloatingOrb
          className="w-80 h-80 bg-primary-500/10 -top-20 -left-24"
          duration={11}
          driftY={[0, -24, 0, 18, 0]}
          driftX={[0, 14, -10, 8, 0]}
          scale={[1, 1.06, 0.97, 1.03, 1]}
        />
        <FloatingOrb
          className="w-72 h-72 bg-accent-500/10 top-1/3 right-0"
          delay={2}
          duration={11}
          driftY={[0, -24, 0, 18, 0]}
          driftX={[0, 14, -10, 8, 0]}
          scale={[1, 1.06, 0.97, 1.03, 1]}
        />

        <section className="relative overflow-hidden border-b border-gray-200 dark:border-white/[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.08),transparent_30%)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 md:pt-10 md:pb-14 relative z-10">
            <button
              onClick={() => router.push("/store")}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-start">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#141420] shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_18px_36px_-8px_rgba(145,158,171,0.18)] dark:shadow-none">
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[calc(100%-2rem)]">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] bg-gradient-to-r ${getCategoryStyle(product.category)}`}
                    >
                      {product.category.replace("-", " ")}
                    </span>
                    {product.subcategory && (
                      <span className="inline-flex px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-black/35 backdrop-blur-md text-white/90 border border-white/10">
                        {product.subcategory}
                      </span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold shadow-lg">
                      -{discount}% OFF
                    </div>
                  )}

                  <div className="relative aspect-[4/3] bg-gray-100 dark:bg-white/[0.03] overflow-hidden">
                    {product.image ? (
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[120px] opacity-20">
                        🎮
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-wrap gap-3 items-end justify-between">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-[0.24em] font-bold mb-2">
                          GamePlug Pick
                        </p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight max-w-2xl">
                          {product.name}
                        </h1>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-black/35 backdrop-blur-md border border-white/10 text-white/80 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-primary-300" />
                        Premium digital delivery
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
                  {[
                    {
                      icon: product.platform ? Monitor : Gamepad2,
                      label: "Platform",
                      value: product.platform || product.category,
                    },
                    {
                      icon: Building2,
                      label: "Publisher",
                      value: product.publisher || "GamePlug Certified",
                    },
                    {
                      icon: Calendar,
                      label: "Release",
                      value: product.releaseDate || "Available now",
                    },
                    {
                      icon: Star,
                      label: "Rating",
                      value: product.rating || "Top rated",
                    },
                  ].map(({ icon: Icon, label, value }, index) => (
                    <motion.div
                      key={label}
                      className="card p-4"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index, duration: 0.35 }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mb-3 shadow-glow-sm">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="lg:sticky lg:top-24 space-y-4"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card p-6 sm:p-7">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold border ${getCategorySurface(product.category)}`}
                    >
                      {product.category.replace("-", " ")}
                    </span>
                    {product.genre && (
                      <span className="inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-gray-400">
                        {product.genre}
                      </span>
                    )}
                  </div>

                  <div className="flex items-end gap-3 mb-5">
                    <div className="text-4xl sm:text-5xl font-extrabold text-gradient">
                      ${product.price.toFixed(2)}
                    </div>
                    {discount > 0 && (
                      <div className="pb-1">
                        <p className="text-sm text-gray-400 line-through">
                          ${originalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs font-bold text-red-500">
                          Save ${(originalPrice - product.price).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                    {product.description ||
                      "No description available for this product."}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      {
                        icon: Zap,
                        label: "Instant Delivery",
                        meta: "Direct to your account",
                      },
                      {
                        icon: Shield,
                        label: "Secure Purchase",
                        meta: "Protected checkout",
                      },
                      {
                        icon: Package,
                        label:
                          product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock",
                        meta:
                          product.stock > 0
                            ? "Ready to ship digitally"
                            : "Currently unavailable",
                      },
                      {
                        icon: Globe,
                        label: "Global Access",
                        meta: "Redeem from 150+ regions",
                      },
                    ].map(({ icon: Icon, label, meta }) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] p-4"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white">
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {label}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {meta}
                        </p>
                      </div>
                    ))}
                  </div>

                  {product.stock > 0 ? (
                    <>
                      <div className="mb-5">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-3">
                          Quantity
                        </label>
                        <div className="flex items-center gap-3">
                          <motion.button
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            className="w-11 h-11 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-xl flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                            whileTap={{ scale: 0.92 }}
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <div className="w-16 h-11 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] flex items-center justify-center text-lg font-bold text-gray-900 dark:text-white">
                            {quantity}
                          </div>
                          <motion.button
                            onClick={() =>
                              setQuantity(Math.min(product.stock, quantity + 1))
                            }
                            className="w-11 h-11 bg-gray-100 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.08] rounded-xl flex items-center justify-center text-gray-700 dark:text-white hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                            whileTap={{ scale: 0.92 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <motion.button
                          onClick={handleAddToCart}
                          className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-sm sm:text-base"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart - ${(product.price * quantity).toFixed(2)}
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            handleAddToCart();
                            router.push("/cart");
                          }}
                          className="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white font-semibold text-sm hover:border-primary-300 dark:hover:border-primary-500/30 transition-all flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          Buy Now <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {added && (
                          <motion.div
                            className="mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <CheckCircle2 className="w-4 h-4" /> Added to cart
                            successfully
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="rounded-2xl bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-4 py-4 text-sm font-medium">
                      This item is currently out of stock.
                    </div>
                  )}
                </div>

                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Why buy from GamePlug?
                    </p>
                  </div>
                  <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                    {[
                      "Instant digital fulfillment after purchase",
                      "Carefully selected deals across games, software, and cards",
                      "Rewards points on eligible purchases",
                      "Support-ready if a code needs attention",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-10">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
            >
              <div className="card p-6">
                <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-3">
                  Overview
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Built for fast digital delivery
                </h2>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="card p-6">
                  <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-4">
                    Included
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        className="rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] px-4 py-3 flex items-center gap-3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                      >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              className="card p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-4">
                Specs
              </p>
              <div className="space-y-3">
                {[
                  ["Category", product.category.replace("-", " ")],
                  ["Subcategory", product.subcategory || "Not specified"],
                  ["Platform", product.platform || "Multi-platform"],
                  ["Genre", product.genre || "Not specified"],
                  ["Publisher", product.publisher || "GamePlug"],
                  ["Release Date", product.releaseDate || "Available now"],
                  [
                    "Stock",
                    product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock",
                  ],
                  [
                    "Delivery",
                    product.isDigital !== false
                      ? "Instant digital delivery"
                      : "Physical / manual",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]"
                  >
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-right text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="pb-20 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <motion.div
                className="flex items-end justify-between mb-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.45 }}
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-2">
                    Recommended
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Related <span className="text-gradient">Products</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    More picks from the same world, platform, or category
                  </p>
                </div>
                <button
                  onClick={() => router.push("/store")}
                  className="hidden sm:flex items-center gap-2 btn-outline px-5 py-2.5 text-sm"
                >
                  Explore Store <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.35 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={item} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </ProtectedRoute>
  );
}
