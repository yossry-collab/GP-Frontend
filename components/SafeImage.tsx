"use client";

import React, { ImgHTMLAttributes, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: React.ReactNode;
  fallbackClassName?: string;
  blurDataURL?: string; // Similar to Next.js or Expo blur placeholder
};

export default function SafeImage({
  src,
  alt,
  className,
  fallback,
  fallbackClassName,
  blurDataURL,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={
          fallbackClassName || "w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/[0.04] rounded-xl"
        }
      >
        {fallback || (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            className="text-3xl"
          >
            🎮
          </motion.span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 
          Blur Placeholder: 
          If blurDataURL is provided, we show it blurred. 
          If not, we show a blurred themed block to mimic the 'Expo Image' feel.
      */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10"
          >
             {blurDataURL ? (
               <img 
                 src={blurDataURL} 
                 alt="" 
                 className="w-full h-full object-cover blur-xl scale-110" 
               />
             ) : (
               <div className="w-full h-full bg-gray-200 dark:bg-white/[0.08] animate-pulse blur-2xl scale-110" />
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        {...(props as any)}
        src={src}
        alt={alt || "Image"}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        initial={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
        animate={loaded ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
        transition={{ 
          opacity: { duration: 0.5 },
          filter: { duration: 0.7, ease: "easeOut" },
          scale: { duration: 0.7, ease: "easeOut" }
        }}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}
