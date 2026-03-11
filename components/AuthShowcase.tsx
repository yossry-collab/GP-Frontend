"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Shield, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const authSlides = [
  {
    image: "/images/hero/cod-blackops.jpg",
    title: "Call of Duty: Black Ops",
    subtitle: "Fast delivery for your next drop.",
    position: "center 22%",
  },
  {
    image: "/images/hero/Jason_and_Lucia_01_With_Logos_landscape.jpg",
    title: "Grand Theft Auto VI",
    subtitle: "Reserve the biggest launches early.",
    position: "center 18%",
  },
  {
    image: "/images/hero/god-of-war-valhalla-3840x2160-13667.jpg",
    title: "God of War Ragnarök",
    subtitle: "Premium deals for premium adventures.",
    position: "center 12%",
  },
  {
    image: "/images/hero/apex-legends-breach-3840x2160-25673.jpg",
    title: "Apex Legends",
    subtitle: "Secure, instant, always online.",
    position: "center 14%",
  },
];

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0, 18, 0],
        x: [0, 14, -10, 8, 0],
        scale: [1, 1.08, 0.96, 1.04, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

type AuthShowcaseProps = {
  badge: string;
  title: string;
  description: string;
  panelTitle: string;
  panelDescription: string;
  footer: React.ReactNode;
  children: React.ReactNode;
};

export default function AuthShowcase({
  badge,
  title,
  description,
  panelTitle,
  panelDescription,
  footer,
  children,
}: AuthShowcaseProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % authSlides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen lg:h-screen bg-gray-50 dark:bg-[#0b0b11] relative overflow-hidden">
      <FloatingOrb className="w-80 h-80 bg-primary-500/15 -top-24 -left-24" />
      <FloatingOrb
        className="w-72 h-72 bg-accent-500/10 -bottom-24 -right-16"
        delay={2}
      />
      <FloatingOrb
        className="w-56 h-56 bg-cyan-500/10 top-1/3 right-1/4"
        delay={4}
      />

      <div className="relative z-10 min-h-screen lg:h-screen grid lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[300px] lg:min-h-screen overflow-hidden border-b border-white/[0.08] lg:border-b-0 lg:border-r lg:border-white/[0.08]">
          {authSlides.map((slide, index) => (
            <motion.div
              key={slide.title}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.035,
                filter: index === currentSlide ? "blur(0px)" : "blur(8px)",
              }}
              transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: slide.position }}
                animate={{ scale: index === currentSlide ? [1, 1.045] : 1.03 }}
                transition={{ duration: 9, ease: "linear" }}
              />
            </motion.div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-br from-[#090910]/85 via-[#090910]/55 to-primary-900/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.22),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),transparent_32%)]" />

          <div className="relative h-full flex flex-col justify-between p-5 sm:p-7 lg:p-10 xl:p-12">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-3"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-glow-sm">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-0.5 text-white text-xl sm:text-2xl font-extrabold tracking-[0.18em]">
                    {"GAMEPLUG".split("").map((letter, index) => (
                      <motion.span
                        key={`${letter}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: [0, -3, 0] }}
                        transition={{
                          opacity: { delay: index * 0.05, duration: 0.3 },
                          y: {
                            delay: 0.35 + index * 0.04,
                            duration: 2.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                        className={
                          index >= 4
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300"
                            : ""
                        }
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45 mt-1">
                    Digital Marketplace
                  </p>
                </div>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/85">
                <Sparkles className="w-3.5 h-3.5 text-primary-300" />
                {badge}
              </div>
            </div>

            <div className="max-w-xl pt-6 lg:pt-0">
              <motion.div
                className="inline-flex sm:hidden items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/85 mb-5"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-primary-300" />
                {badge}
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-white leading-[1.03]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                {panelTitle}
              </motion.h1>
              <motion.p
                className="text-white/70 text-base sm:text-lg leading-relaxed mt-4 max-w-lg"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.55 }}
              >
                {panelDescription}
              </motion.p>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 lg:mt-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.55 }}
              >
                {[
                  {
                    icon: Zap,
                    label: "Instant Keys",
                    meta: "Delivered in seconds",
                  },
                  {
                    icon: Shield,
                    label: "Protected",
                    meta: "Encrypted checkout",
                  },
                  {
                    icon: Sparkles,
                    label: "Rewards",
                    meta: "Points every order",
                  },
                ].map(({ icon: Icon, label, meta }) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 p-3.5 lg:p-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/12 flex items-center justify-center mb-2.5">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-[11px] text-white/55 mt-1 leading-relaxed">
                      {meta}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 p-4 sm:p-5 max-w-md"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-bold">
                    {authSlides[currentSlide].title}
                  </p>
                  <p className="text-white/55 text-xs mt-1">
                    {authSlides[currentSlide].subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {authSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "w-7 h-2 bg-gradient-to-r from-primary-400 to-accent-400"
                          : "w-2 h-2 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-6 overflow-y-auto lg:overflow-hidden">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center lg:text-left mb-4 lg:mb-5">
              <p className="text-[11px] uppercase tracking-[0.24em] font-bold text-primary-500 mb-2">
                {badge}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2.5">
                {description}
              </p>
            </div>

            <div className="card p-5 sm:p-6 lg:p-6 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_18px_36px_-6px_rgba(145,158,171,0.18)] dark:shadow-none">
              {children}
            </div>

            <div className="mt-4 lg:mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              {footer}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
