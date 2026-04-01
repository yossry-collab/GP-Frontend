"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

export default function Skeleton({ className, width, height, radius = "12px" }: SkeletonProps) {
  return (
    <motion.div
      className={`bg-gray-200 dark:bg-white/[0.06] overflow-hidden relative ${className}`}
      style={{ width, height, borderRadius: radius }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </motion.div>
  );
}
