"use client";

import { motion } from "framer-motion";

type FloatingOrbProps = {
  className: string;
  delay?: number;
  duration?: number;
  driftY?: number[];
  driftX?: number[];
  scale?: number[];
};

export default function FloatingOrb({
  className,
  delay = 0,
  duration = 12,
  driftY = [0, -30, 0, 20, 0],
  driftX = [0, 15, -10, 10, 0],
  scale = [1, 1.1, 0.95, 1.05, 1],
}: FloatingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{
        y: driftY,
        x: driftX,
        scale,
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}
