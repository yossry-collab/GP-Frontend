"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, Tag, Monitor } from "lucide-react";
import { Product, useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/SafeImage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "game":
        return "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400";
      case "software":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
      case "gift-card":
        return "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock > 0) addItem(product, 1);
  };

  const discount = product.discountPercentage || 0;
  const originalPrice =
    discount > 0 ? product.price / (1 - discount / 100) : product.price;

  return (
    <motion.div
      className="card-hover group cursor-pointer overflow-hidden"
      onClick={() => router.push(`/store/${product._id}`)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-white/[0.03] overflow-hidden">
        {product.image ? (
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            🎮
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#16161f]/80 via-transparent to-transparent opacity-60" />

        {/* Badge top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(product.category)}`}
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
            <span className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold flex items-center gap-1">
              <Tag className="w-3 h-3" /> -{discount}%
            </span>
          )}
          {product.isDigital !== false && (
            <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Instant
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 dark:group-hover:bg-primary-500/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <motion.button
            onClick={handleAddToCart}
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock > 0 ? "Add to Cart" : "Sold Out"}
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
            <span className="text-lg font-bold text-gradient">
              ${product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-medium ${product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
