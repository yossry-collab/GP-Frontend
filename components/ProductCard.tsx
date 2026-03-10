"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Zap,
  Tag,
  Monitor,
  Eye,
  Heart,
  Check,
} from "lucide-react";
import { Product, useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/SafeImage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "game":
        return "bg-primary-500/80 text-white";
      case "software":
        return "bg-blue-500/80 text-white";
      case "gift-card":
        return "bg-pink-500/80 text-white";
      default:
        return "bg-gray-500/80 text-white";
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock > 0 && !justAdded) {
      addItem(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const discount = product.discountPercentage || 0;
  const originalPrice =
    discount > 0 ? product.price / (1 - discount / 100) : product.price;

  return (
    <motion.div
      className="card group cursor-pointer overflow-hidden border border-gray-200 dark:border-white/[0.06] hover:border-primary-500/25 dark:hover:border-primary-500/20 transition-all duration-500"
      onClick={() => router.push(`/store/${product._id}`)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-white/[0.03] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 dark:from-[#16161f]/80 via-transparent to-transparent opacity-70" />

        {/* Badge top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${getCategoryStyle(product.category)}`}
          >
            {product.category === "gift-card" ? "Gift Card" : product.category}
          </span>
          {product.platform && (
            <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[9px] font-medium flex items-center gap-1 w-fit">
              <Monitor className="w-2.5 h-2.5" /> {product.platform}
            </span>
          )}
        </div>

        {/* Discount or Instant badge top-right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {discount > 0 && (
            <motion.span
              className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Tag className="w-3 h-3" /> -{discount}%
            </motion.span>
          )}
          {product.isDigital !== false && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/80 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
              <Zap className="w-3 h-3" /> Instant
            </span>
          )}
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-glow transition-colors ${
              justAdded
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-primary-600 to-accent-500 text-white"
            }`}
            whileTap={{ scale: 0.93 }}
            initial={{ y: 8 }}
            animate={{ y: 0 }}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {product.stock > 0 ? "Add to Cart" : "Sold Out"}
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>
        {product.genre && (
          <p className="text-[10px] text-primary-500 dark:text-primary-400 font-medium mt-1">
            {product.genre}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 mt-1 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-gradient">
              ${product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`}
            />
            <span
              className={`text-[11px] font-medium ${product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}
            >
              {product.stock > 0 ? "In Stock" : "Sold Out"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
