"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Gamepad2,
  Lock,
  Mail,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { authAPI } from "@/lib/api";
import FloatingOrb from "@/components/FloatingOrb";

const authSlides = [
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
  {
    image: "/images/hero/fortnite-festival-3840x2160-25375.jpg",
    title: "Fortnite Festival",
    subtitle: "Big drops, live moments, instant access.",
    position: "center 28%",
  },
  {
    image: "/images/hero/call-of-duty-modern-3840x2160-13480.jpg",
    title: "Call of Duty: Modern Warfare III",
    subtitle: "Load in fast and stay mission ready.",
    position: "center 24%",
  },
  {
    image: "/images/hero/assassins-creed-3840x2160-16757.jpeg",
    title: "Assassin's Creed Shadows",
    subtitle: "Premium worlds with cinematic atmosphere.",
    position: "center 38%",
  },
  {
    image:
      "/images/hero/battlefield-2042-e3-2021-pc-games-playstation-4-playstation-3840x2160-5613.jpg",
    title: "Battlefield 2042",
    subtitle: "Massive action, secured and delivered instantly.",
    position: "center 32%",
  },
];

type AuthMode = "login" | "register";
type SwapStage = "idle" | "out" | "enter-prep" | "in";
type ResetStep = "request" | "code" | "password";

type AuthSplitPageProps = {
  initialMode?: AuthMode;
};

const SLIDE_DURATION_MS = 520;
const TOTAL_SWAP_MS = 1040;
const SWAP_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

const featureBadges = [
  ["Fast", "Checkout saved"],
  ["Secure", "Protected account"],
  ["Rewards", "Points enabled"],
] as const;

const getPanelSide = (panel: "visual" | "form", isRegisterMode: boolean) => {
  if (panel === "visual") {
    return isRegisterMode ? "right" : "left";
  }

  return isRegisterMode ? "left" : "right";
};

const getOppositeSide = (side: "left" | "right") =>
  side === "left" ? "right" : "left";

export default function AuthSplitPage({
  initialMode = "login",
}: AuthSplitPageProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRegisterMode, setIsRegisterMode] = useState(
    initialMode === "register",
  );
  const [swapStage, setSwapStage] = useState<SwapStage>("idle");
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>("request");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetForm, setResetForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetCodeDigits, setResetCodeDigits] = useState<string[]>(
    Array(6).fill(""),
  );
  const resetCodeInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % authSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateLayoutMode = () => {
      setIsMobileLayout(window.innerWidth < 1024);
    };

    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);

    return () => window.removeEventListener("resize", updateLayoutMode);
  }, []);

  useEffect(() => {
    const timeouts = timeoutRefs.current;

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const isSwapping = swapStage !== "idle";

  const activeModeContent = useMemo(
    () =>
      isRegisterMode
        ? {
            badge: "Member Access",
            title: "Join GamePlug",
            description:
              "Create your account to start shopping, track rewards, and unlock exclusive drops.",
            panelTitle: "Step into the marketplace with style.",
            panelDescription:
              "Set up your account once, then move through launches, drops, rewards, and checkout with a smoother experience.",
          }
        : {
            badge: "Member Access",
            title: "Welcome back",
            description:
              "Sign in to continue shopping, unlock your rewards, and jump straight into the store.",
            panelTitle: "Where every login opens the next level.",
            panelDescription:
              "Access your orders, your rewards progress, and the latest GamePlug drops in one polished dashboard.",
          },
    [isRegisterMode],
  );

  const scheduleTimeout = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutRefs.current.push(timeoutId);
  };

  const handleModeSwap = () => {
    if (isSwapping) return;

    setError("");
    setSuccess("");
    setSwapStage("out");

    scheduleTimeout(() => {
      setIsRegisterMode((prev) => !prev);
      setSwapStage("enter-prep");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSwapStage("in");
        });
      });
    }, SLIDE_DURATION_MS);

    scheduleTimeout(() => {
      setSwapStage("idle");
    }, TOTAL_SWAP_MS);
  };

  const getVisualPanelTransform = () => {
    const currentSide = getPanelSide("visual", isRegisterMode);

    if (isMobileLayout) {
      if (swapStage === "out") {
        return currentSide === "left"
          ? "translateY(-100%)"
          : "translateY(100%)";
      }

      if (swapStage === "enter-prep") {
        const nextSide = getOppositeSide(currentSide);
        return nextSide === "left" ? "translateY(100%)" : "translateY(-100%)";
      }

      return "translateX(0) translateY(0)";
    }

    if (swapStage === "out") {
      return currentSide === "left"
        ? "translateX(100%) translateY(-10px) scale(1.015)"
        : "translateX(-100%) translateY(-10px) scale(1.015)";
    }

    return "translateX(0) translateY(0)";
  };

  const getVisualContentTransform = () => {
    if (isMobileLayout || swapStage === "idle") {
      return "translateX(0) translateY(0) scale(1)";
    }

    const currentSide = getPanelSide("visual", isRegisterMode);

    if (swapStage === "out") {
      return currentSide === "left"
        ? "translateX(-26px) translateY(6px) scale(1.01)"
        : "translateX(26px) translateY(6px) scale(1.01)";
    }

    return "translateX(0) translateY(0) scale(1)";
  };

  const getVisualPanelEffects = () => {
    if (swapStage === "idle") {
      return {
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        filter: "saturate(1) brightness(1)",
      };
    }

    if (swapStage === "out") {
      return {
        boxShadow:
          "0 34px 84px -42px rgba(7, 10, 24, 0.62), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 42px rgba(168, 85, 247, 0.18), 0 0 68px rgba(244, 114, 182, 0.12)",
        filter: "saturate(1.04) brightness(1.03)",
      };
    }

    return {
      boxShadow:
        "0 22px 52px -36px rgba(7, 10, 24, 0.48), 0 0 28px rgba(168, 85, 247, 0.12)",
      filter: "saturate(1.02) brightness(1.015)",
    };
  };

  const getFormPanelTransform = () => {
    if (isMobileLayout) {
      const currentSide = getPanelSide("form", isRegisterMode);

      if (swapStage === "out") {
        return currentSide === "left"
          ? "translateY(-100%)"
          : "translateY(100%)";
      }

      if (swapStage === "enter-prep") {
        const nextSide = getOppositeSide(currentSide);
        return nextSide === "left" ? "translateY(100%)" : "translateY(-100%)";
      }
    }

    return "translateX(0) translateY(0)";
  };

  const getPanelTransition = () => {
    if (swapStage === "enter-prep") {
      return "none";
    }

    if (swapStage === "idle") {
      return `transform ${SLIDE_DURATION_MS}ms ${SWAP_EASING}`;
    }

    return `transform ${SLIDE_DURATION_MS}ms ${SWAP_EASING}`;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await login(loginForm.email, loginForm.password);
      const storedRedirectUrl = sessionStorage.getItem("redirectAfterLogin");
      const redirectUrl =
        storedRedirectUrl === "/dashboard"
          ? "/profile"
          : storedRedirectUrl || "/profile";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
    setResetStep("request");
    setResetLoading(false);
    setResetError("");
    setResetSuccess("");
    setResetForm({
      email: loginForm.email || "",
      newPassword: "",
      confirmPassword: "",
    });
    setResetCodeDigits(Array(6).fill(""));
  };

  const closeForgotPasswordModal = () => {
    if (resetLoading) return;
    setShowForgotPasswordModal(false);
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetForm.email.trim()) {
      setResetError("Please enter your email.");
      return;
    }

    setResetLoading(true);
    try {
      const response = await authAPI.forgotPassword({
        email: resetForm.email.trim().toLowerCase(),
      });
      setResetSuccess(
        response.data?.message || "Verification code sent to your email.",
      );
      setResetStep("code");
      setResetCodeDigits(Array(6).fill(""));
      window.setTimeout(() => {
        resetCodeInputRefs.current[0]?.focus();
      }, 0);
    } catch (err: any) {
      if (err?.code === "ECONNABORTED") {
        setResetError("Request timed out. Please try again in a few seconds.");
        return;
      }

      const message = err?.response?.data?.message;
      const details = err?.response?.data?.error;
      setResetError(
        details
          ? `${message || "Failed to send verification code."} (${details})`
          : message || "Failed to send verification code.",
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setResetCodeDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < 5) {
      resetCodeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleResetCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (resetCodeDigits[index]) {
        setResetCodeDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }

      if (index > 0) {
        resetCodeInputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      resetCodeInputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      resetCodeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleResetCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const next = Array(6)
      .fill("")
      .map((_, idx) => pasted[idx] || "");
    setResetCodeDigits(next);

    const focusIndex = Math.min(pasted.length, 6) - 1;
    if (focusIndex >= 0) {
      resetCodeInputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    const email = resetForm.email.trim().toLowerCase();
    const code = resetCodeDigits.join("");

    if (!email) {
      setResetError("Email is required.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setResetError("Please enter the full 6-digit code.");
      return;
    }

    setResetLoading(true);
    try {
      const response = await authAPI.verifyResetCode({ email, code });
      setResetSuccess(response.data?.message || "Code verified successfully.");
      setResetStep("password");
    } catch (err: any) {
      if (err?.code === "ECONNABORTED") {
        setResetError("Request timed out. Please try again in a few seconds.");
        return;
      }

      setResetError(err?.response?.data?.message || "Failed to verify code.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    const email = resetForm.email.trim().toLowerCase();
    const code = resetCodeDigits.join("");
    const newPassword = resetForm.newPassword;
    const confirmPassword = resetForm.confirmPassword;

    if (!email || !newPassword || !confirmPassword) {
      setResetError("All fields are required.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setResetError("Code must be exactly 6 digits.");
      return;
    }

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email,
        code,
        newPassword,
      });

      setResetSuccess(response.data?.message || "Password reset successfully.");
      setLoginForm((prev) => ({ ...prev, email, password: "" }));

      window.setTimeout(() => {
        setShowForgotPasswordModal(false);
      }, 1000);
    } catch (err: any) {
      setResetError(
        err?.response?.data?.message || "Failed to reset password.",
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(
        registerForm.fullName,
        registerForm.email,
        registerForm.password,
      );
      setSuccess("Registration successful! Redirecting...");
      window.setTimeout(() => {
        router.push("/profile");
      }, 900);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFlashMessage = () => (
    <AnimatePresence>
      {error && (
        <motion.div
          className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          className="mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderFeatureBadges = () => (
    <div className="grid grid-cols-3 gap-2.5 pt-0.5">
      {featureBadges.map(([label, meta], index) => (
        <div
          key={label}
          className="rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] p-2.5"
          style={{ transitionDelay: `${index * 35}ms` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-500">
            {label}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {meta}
          </p>
        </div>
      ))}
    </div>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className="input pl-11"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Password
          </label>
          <button
            type="button"
            onClick={openForgotPasswordModal}
            className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-accent-500 transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showLoginPassword ? "text" : "password"}
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((prev) => ({ ...prev, password: e.target.value }))
            }
            className="input pl-11 pr-12"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowLoginPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showLoginPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {renderFeatureBadges()}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Enter GamePlug <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={registerForm.fullName}
            onChange={(e) =>
              setRegisterForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="input pl-11"
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className="input pl-11"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showRegisterPassword ? "text" : "password"}
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
            }
            className="input pl-11 pr-12"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowRegisterPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showRegisterPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showRegisterConfirmPassword ? "text" : "password"}
            value={registerForm.confirmPassword}
            onChange={(e) =>
              setRegisterForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className="input pl-11 pr-12"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showRegisterConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {renderFeatureBadges()}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Create Account <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen lg:h-screen bg-gray-50 dark:bg-[#0b0b11] relative overflow-hidden">
      <FloatingOrb className="w-80 h-80 bg-primary-500/15 -top-24 -left-24" />
      <FloatingOrb
        className="w-72 h-72 bg-accent-500/10 -bottom-24 -right-16"
        delay={2}
        driftY={[0, -30, 0, 18, 0]}
        driftX={[0, 14, -10, 8, 0]}
        scale={[1, 1.08, 0.96, 1.04, 1]}
      />
      <FloatingOrb
        className="w-56 h-56 bg-cyan-500/10 top-1/3 right-1/4"
        delay={4}
        driftY={[0, -30, 0, 18, 0]}
        driftX={[0, 14, -10, 8, 0]}
        scale={[1, 1.08, 0.96, 1.04, 1]}
      />

      <div
        className={`auth-swap-shell relative z-10 ${isSwapping ? "is-swapping" : ""} ${isRegisterMode ? "is-register-mode" : ""} ${swapStage === "out" ? "is-swap-out" : ""} ${swapStage === "in" ? "is-swap-in" : ""}`}
      >
        <div
          className="auth-panel auth-visual-panel relative min-h-[300px] lg:min-h-screen overflow-hidden border-b border-white/[0.08] lg:border-b-0 lg:border-r lg:border-white/[0.08]"
          style={{
            order: isRegisterMode ? 2 : 1,
            transform: getVisualPanelTransform(),
            transition: getPanelTransition(),
            zIndex: isSwapping ? 3 : 1,
            ...getVisualPanelEffects(),
          }}
        >
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

          <div
            className="relative h-full flex flex-col justify-between p-5 sm:p-7 lg:p-10 xl:p-12 auth-visual-content"
            style={{ transform: getVisualContentTransform() }}
          >
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
                  <div className="flex items-center gap-0.5 text-white text-lg sm:text-2xl font-extrabold tracking-[0.14em] sm:tracking-[0.18em]">
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
                {activeModeContent.badge}
              </div>
            </div>

            <div className="max-w-xl pt-6 lg:pt-0">
              <div className="inline-flex sm:hidden items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/85 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-primary-300" />
                {activeModeContent.badge}
              </div>

              <div className="relative inline-block">
                <div className="absolute -inset-x-8 -inset-y-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(191,219,254,0.24),transparent_30%),radial-gradient(circle_at_50%_78%,rgba(244,114,182,0.2),transparent_32%),radial-gradient(circle_at_30%_65%,rgba(196,181,253,0.22),transparent_34%)] blur-3xl opacity-100" />
                <div
                  className="absolute inset-0 text-[2.2rem] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.03] pointer-events-none select-none translate-y-2 scale-[1.02] blur-md opacity-80"
                  style={{
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(125,211,252,0.28) 28%, rgba(196,181,253,0.3) 58%, rgba(244,114,182,0.26) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {activeModeContent.panelTitle}
                </div>
                <motion.h1
                  className="relative text-[2.2rem] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.03] text-transparent bg-clip-text [text-shadow:0_0_30px_rgba(255,255,255,0.16)]"
                  style={{
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(140deg, rgba(255,255,255,0.82) 0%, rgba(224,242,254,0.88) 18%, rgba(147,197,253,0.94) 34%, rgba(196,181,253,0.96) 56%, rgba(244,114,182,0.96) 78%, rgba(255,255,255,0.86) 100%)",
                    backgroundSize: "240% 240%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: "1px rgba(255,255,255,0.14)",
                    filter:
                      "drop-shadow(0 0 14px rgba(255,255,255,0.12)) drop-shadow(0 0 26px rgba(168,85,247,0.22))",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {activeModeContent.panelTitle}
                </motion.h1>
              </div>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed mt-4 max-w-lg">
                {activeModeContent.panelDescription}
              </p>
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

        <div
          className="auth-panel auth-form-panel flex items-center justify-center px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-6 overflow-y-auto lg:overflow-hidden"
          style={{
            order: isRegisterMode ? 1 : 2,
            transform: getFormPanelTransform(),
            transition: getPanelTransition(),
            zIndex: 1,
          }}
        >
          <div className="form-shell w-full max-w-md">
            <div className="form-content text-center lg:text-left mb-4 lg:mb-5">
              <p className="text-[11px] uppercase tracking-[0.24em] font-bold text-primary-500 mb-2">
                {activeModeContent.badge}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                {activeModeContent.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2.5">
                {activeModeContent.description}
              </p>
            </div>

            <div className="form-content card p-5 sm:p-6 lg:p-6 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_18px_36px_-6px_rgba(145,158,171,0.18)] dark:shadow-none">
              {renderFlashMessage()}
              {isRegisterMode ? renderRegisterForm() : renderLoginForm()}
            </div>

            <div className="form-content mt-4 lg:mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              {isRegisterMode ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={handleModeSwap}
                    className="text-primary-600 dark:text-primary-400 hover:text-accent-500 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={handleModeSwap}
                    className="text-primary-600 dark:text-primary-400 hover:text-accent-500 font-semibold transition-colors"
                  >
                    Create one
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForgotPasswordModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-white/15 bg-white dark:bg-[#111320] shadow-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary-500">
                    Account Recovery
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    Reset your password
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                    {resetStep === "request"
                      ? "We will send a 6-digit verification code to your email."
                      : resetStep === "code"
                        ? "Enter the verification code sent to your inbox."
                        : "Code verified. Set your new password."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="rounded-lg p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Close password reset dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence>
                {resetError && (
                  <motion.div
                    className="mb-4 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {resetError}
                  </motion.div>
                )}
                {resetSuccess && (
                  <motion.div
                    className="mb-4 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {resetSuccess}
                  </motion.div>
                )}
              </AnimatePresence>

              {resetStep === "request" ? (
                <form onSubmit={handleRequestResetCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={resetForm.email}
                        onChange={(e) =>
                          setResetForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="input pl-11"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send 6-digit code <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : resetStep === "code" ? (
                <form onSubmit={handleVerifyResetCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={resetForm.email}
                        className="input pl-11"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Verification Code
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {resetCodeDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            resetCodeInputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleResetCodeChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleResetCodeKeyDown(index, e)}
                          onPaste={handleResetCodePaste}
                          className="h-12 rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.03] text-center text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      disabled={resetLoading}
                      onClick={() => {
                        setResetStep("request");
                        setResetError("");
                        setResetSuccess("");
                      }}
                      className="w-full py-3 rounded-xl border border-gray-300 dark:border-white/15 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      Resend code
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resetLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Verify code <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={resetForm.email}
                        className="input pl-11"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={resetForm.newPassword}
                        onChange={(e) =>
                          setResetForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="input pl-11"
                        placeholder="At least 6 characters"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={resetForm.confirmPassword}
                        onChange={(e) =>
                          setResetForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="input pl-11"
                        placeholder="Repeat your new password"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      disabled={resetLoading}
                      onClick={() => {
                        setResetStep("code");
                        setResetError("");
                        setResetSuccess("");
                      }}
                      className="w-full py-3 rounded-xl border border-gray-300 dark:border-white/15 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      Back to code
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resetLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Update password <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .auth-swap-shell {
          display: flex;
          min-height: 100vh;
          overflow: hidden;
        }

        .auth-panel {
          position: relative;
          width: 50%;
          min-width: 0;
          will-change: transform;
        }

        .auth-visual-content {
          transition: transform ${SLIDE_DURATION_MS}ms ${SWAP_EASING};
          will-change: transform;
        }

        .auth-visual-panel {
          transition:
            transform ${SLIDE_DURATION_MS}ms ${SWAP_EASING},
            box-shadow ${SLIDE_DURATION_MS}ms ${SWAP_EASING},
            filter ${SLIDE_DURATION_MS}ms ${SWAP_EASING};
          will-change: transform, box-shadow, filter;
        }

        .form-content {
          transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .auth-swap-shell.is-swapping .form-content {
          opacity: 0;
        }

        .auth-swap-shell.is-swap-in .form-content {
          opacity: 1;
          transition-delay: 35ms;
        }

        @media (max-width: 1023px) {
          .auth-swap-shell {
            flex-direction: column;
          }

          .auth-panel {
            width: 100%;
          }

          .auth-visual-panel {
            min-height: 42vh;
          }
        }
      `}</style>
    </div>
  );
}
