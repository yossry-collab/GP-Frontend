"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Gift,
  Lightning as Zap,
  Trophy,
  Crown,
  Clock,
  CaretRight as ChevronRight,
  Sparkle as Sparkles,
  Package,
  Target,
  Flame,
  Lock,
  Check,
  CopySimple,
  ClockCounterClockwise as History,
  Medal as Award,
  Coins,
  ShoppingBag,
  Ticket,
  CaretDown as ChevronDown,
  CaretUp as ChevronUp,
  WarningCircle as AlertCircle,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth-context";
import { loyaltyAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

// ─── Types ──────────────────────────────────────────
interface Balance {
  points: number;
  lifetimePoints: number;
  tier: string;
  streakDays: number;
}
interface Transaction {
  _id: string;
  type: string;
  amount: number;
  balance: number;
  source: string;
  description: string;
  createdAt: string;
}
interface RewardItem {
  _id: string;
  name: string;
  description: string;
  type: string;
  pointsCost: number;
  discountPercent: number;
  discountAmount: number;
  image: string;
  stock: number;
  tierRequired: string;
}
interface QuestItem {
  _id: string;
  questKey?: string | null;
  title: string;
  description: string;
  type: string;
  rewardPoints: number;
  icon: string;
  sortOrder?: number;
  featureFlag: boolean;
  category?: "onboarding" | "daily" | "weekly" | "career" | "seasonal";
  metadata: any;
  userProgress: {
    completed: boolean;
    progress: number;
    completedAt?: string;
    completionCount?: number;
    completionLimit?: number;
    lastCompletedAt?: string | null;
    current?: number;
    target?: number;
    remaining?: number;
    claimable?: boolean;
    cooldownActive?: boolean;
    nextEligibleAt?: string | null;
    blockedReason?: string | null;
    status?: "in_progress" | "claimable" | "cooldown" | "locked" | "completed";
  };
}
interface PackItem {
  _id: string;
  name: string;
  description: string;
  image: string;
  pointsCost: number;
  tierRequired: string;
  packClass: "silver" | "gold" | "platinum";
  guaranteedRarity: "common" | "rare" | "epic" | "legendary";
  animationTheme: "silver" | "gold" | "platinum" | "prismatic";
  pityEpicThreshold: number;
  pityLegendaryThreshold: number;
  bonusMultiplier: number;
  featured?: boolean;
  headline?: string;
  userState: {
    canOpen: boolean;
    lockReason: string | null;
    pity: {
      opens: number;
      withoutEpic: number;
      withoutLegendary: number;
      remainingToEpic: number;
      remainingToLegendary: number;
    };
  };
}
interface MembershipTier {
  _id: string;
  tier: string;
  name: string;
  price: number;
  yearlyPrice: number;
  pointsMultiplier: number;
  perks: string[];
  packLuckMultiplier?: number;
  monthlyBonusPoints?: number;
}
interface PackResult {
  type: string;
  rarity: string;
  label: string;
  value: any;
}
interface PackReveal {
  packClass: "silver" | "gold" | "platinum";
  animationTheme: "silver" | "gold" | "platinum" | "prismatic";
  guaranteedRarity: "common" | "rare" | "epic" | "legendary";
  pityTriggeredEpic: boolean;
  pityTriggeredLegendary: boolean;
  accent: string;
  halo: string;
  beam: string;
  title: string;
  subtitle: string;
  headline: string;
}

// ─── Rarity colors ──────────────────────────────────
const rarityColors: Record<
  string,
  { bg: string; text: string; glow: string; border: string }
> = {
  common: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    glow: "",
    border: "border-gray-300 dark:border-gray-600",
  },
  rare: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    glow: "shadow-blue-500/20",
    border: "border-blue-400 dark:border-blue-500",
  },
  epic: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    glow: "shadow-purple-500/30",
    border: "border-purple-400 dark:border-purple-500",
  },
  legendary: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    glow: "shadow-amber-500/40",
    border: "border-amber-400 dark:border-amber-500",
  },
};

const tierConfig: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  free: {
    color: "text-gray-500",
    bg: "bg-gray-100 dark:bg-gray-800",
    icon: <Star className="w-4 h-4" />,
  },
  silver: {
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
    icon: <Award className="w-4 h-4" />,
  },
  gold: {
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/20",
    icon: <Crown className="w-4 h-4" />,
  },
  platinum: {
    color: "text-cyan-500",
    bg: "bg-cyan-100 dark:bg-cyan-900/20",
    icon: <Sparkles className="w-4 h-4" />,
  },
};

const packThemeConfig: Record<
  string,
  {
    shell: string;
    ring: string;
    text: string;
    glow: string;
    panel: string;
    accent: string;
    icon: string;
  }
> = {
  silver: {
    shell:
      "from-slate-200 via-slate-100 to-slate-400 dark:from-slate-500 dark:via-slate-300 dark:to-slate-700",
    ring: "from-white/80 via-slate-200/50 to-transparent",
    text: "text-slate-700 dark:text-slate-100",
    glow: "shadow-[0_0_50px_rgba(203,213,225,0.35)]",
    panel: "border-slate-200 dark:border-slate-500/40",
    accent: "bg-slate-500",
    icon: "🥈",
  },
  gold: {
    shell:
      "from-amber-300 via-yellow-200 to-orange-500 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-600",
    ring: "from-yellow-100/90 via-amber-300/45 to-transparent",
    text: "text-amber-900 dark:text-amber-50",
    glow: "shadow-[0_0_70px_rgba(245,158,11,0.35)]",
    panel: "border-amber-300 dark:border-amber-500/45",
    accent: "bg-amber-500",
    icon: "🥇",
  },
  platinum: {
    shell:
      "from-cyan-300 via-sky-200 to-indigo-500 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-600",
    ring: "from-white/90 via-cyan-200/55 to-transparent",
    text: "text-cyan-950 dark:text-cyan-50",
    glow: "shadow-[0_0_80px_rgba(96,165,250,0.38)]",
    panel: "border-cyan-300 dark:border-cyan-400/45",
    accent: "bg-cyan-500",
    icon: "💎",
  },
};

const tierOrder: Record<string, number> = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
};

// ─── Card wrapper ───────────────────────────────────
const Card = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={`bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// ─── MAIN PAGE ──────────────────────────────────────
// ═══════════════════════════════════════════════════════
export default function RewardsPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a12]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <RewardsContent />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function RewardsContent() {
  const { user } = useAuth();
  const [tab, setTab] = useState<
    "overview" | "rewards" | "quests" | "packs" | "membership" | "history"
  >("overview");
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await loyaltyAPI.getBalance();
      setBalance(res.data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchBalance();
      setLoading(false);
    };
    init();
  }, [fetchBalance]);

  // Auto-dismiss messages
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [msg]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: "overview", label: "Overview", icon: <Zap className="w-4 h-4" /> },
    { key: "rewards", label: "Rewards", icon: <Gift className="w-4 h-4" /> },
    { key: "packs", label: "Packs", icon: <Package className="w-4 h-4" /> },
    { key: "quests", label: "Quests", icon: <Target className="w-4 h-4" /> },
    {
      key: "membership",
      label: "GamePlus",
      icon: <Crown className="w-4 h-4" />,
    },
    { key: "history", label: "History", icon: <History className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" /> Reward Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Earn points, unlock rewards, and level up!
            </p>
          </div>
          {/* Points Badge */}
          {balance && (
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${tierConfig[balance.tier]?.bg} ${tierConfig[balance.tier]?.color}`}
              >
                {tierConfig[balance.tier]?.icon}
                <span className="capitalize">
                  {balance.tier === "free"
                    ? "Free"
                    : `GamePlus ${balance.tier}`}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-500/20">
                <Coins className="w-5 h-5" />
                {balance.points.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.04]"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Message toast */}
      <AnimatePresence>
        {msg && (
          <motion.div
            className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
              msg.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {msg.type === "success" ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}{" "}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "overview" && (
          <OverviewTab
            key="overview"
            balance={balance}
            fetchBalance={fetchBalance}
            setMsg={setMsg}
          />
        )}
        {tab === "rewards" && (
          <RewardsTab
            key="rewards"
            balance={balance}
            fetchBalance={fetchBalance}
            setMsg={setMsg}
          />
        )}
        {tab === "packs" && (
          <PacksTab
            key="packs"
            balance={balance}
            fetchBalance={fetchBalance}
            setMsg={setMsg}
          />
        )}
        {tab === "quests" && (
          <QuestsTab
            key="quests"
            user={user}
            fetchBalance={fetchBalance}
            setMsg={setMsg}
          />
        )}
        {tab === "membership" && (
          <MembershipTab
            key="membership"
            balance={balance}
            fetchBalance={fetchBalance}
            setMsg={setMsg}
          />
        )}
        {tab === "history" && <HistoryTab key="history" />}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// ─── OVERVIEW TAB ───────────────────────────────────
// ═══════════════════════════════════════════════════════
function OverviewTab({
  balance,
  fetchBalance,
  setMsg,
}: {
  balance: Balance | null;
  fetchBalance: () => Promise<void>;
  setMsg: (m: any) => void;
}) {
  const [claiming, setClaiming] = useState(false);

  const claimDaily = async () => {
    try {
      setClaiming(true);
      const res = await loyaltyAPI.dailyLogin();
      setMsg({ type: "success", text: res.data.message });
      await fetchBalance();
    } catch (err: any) {
      const m = err.response?.data?.message || "Failed to claim";
      setMsg({
        type: err.response?.data?.alreadyClaimed ? "success" : "error",
        text: m,
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Current Points",
            value: balance?.points.toLocaleString() || "0",
            icon: <Coins className="w-5 h-5" />,
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "Lifetime Earned",
            value: balance?.lifetimePoints.toLocaleString() || "0",
            icon: <Trophy className="w-5 h-5" />,
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Login Streak",
            value: `${balance?.streakDays || 0} days`,
            icon: <Flame className="w-5 h-5" />,
            color: "from-red-500 to-orange-500",
          },
          {
            label: "Tier",
            value: balance?.tier === "free" ? "Free" : `${balance?.tier}`,
            icon: <Crown className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-500",
          },
        ].map((stat, i) => (
          <Card key={stat.label} delay={i * 0.08} className="p-5">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white capitalize">
              {stat.value}
            </p>
            <p className="text-xs font-medium text-gray-500 mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Daily Login */}
      <Card className="p-6 mb-8" delay={0.35}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Daily Login Bonus
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Claim your daily points! Streak bonus: +5 per day (max +50)
            </p>
          </div>
          <button
            onClick={claimDaily}
            disabled={claiming}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
          >
            {claiming ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" /> Claim
              </span>
            )}
          </button>
        </div>
        {/* Streak visualization */}
        {balance && balance.streakDays > 0 && (
          <div className="mt-4 flex items-center gap-1">
            {Array.from({ length: Math.min(balance.streakDays, 7) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {i + 1}
                </div>
              ),
            )}
            {balance.streakDays > 7 && (
              <span className="text-xs font-bold text-orange-500 ml-2">
                +{balance.streakDays - 7} more
              </span>
            )}
          </div>
        )}
      </Card>

      {/* How to earn */}
      <Card className="p-6" delay={0.4}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: <ShoppingBag className="w-4 h-4" />,
              label: "Make purchases",
              desc: "10 pts per €1 spent",
              color: "bg-green-100 dark:bg-green-900/20 text-green-600",
            },
            {
              icon: <Clock className="w-4 h-4" />,
              label: "Daily login",
              desc: "10-60 pts per day",
              color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
            },
            {
              icon: <Target className="w-4 h-4" />,
              label: "Complete quests",
              desc: "30-200 pts per quest",
              color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
            },
            {
              icon: <Star className="w-4 h-4" />,
              label: "Sign up bonus",
              desc: "100 pts one-time",
              color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]"
            >
              <div
                className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ─── REWARDS TAB ────────────────────────────────────
// ═══════════════════════════════════════════════════════
function RewardsTab({
  balance,
  fetchBalance,
  setMsg,
}: {
  balance: Balance | null;
  fetchBalance: () => Promise<void>;
  setMsg: (m: any) => void;
}) {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await loyaltyAPI.getRewards();
        setRewards(res.data);
      } catch {
        setMsg({ type: "error", text: "Failed to load rewards" });
      } finally {
        setLoading(false);
      }
    })();
  }, [setMsg]);

  const redeem = async (id: string) => {
    try {
      setRedeeming(id);
      const res = await loyaltyAPI.redeemReward(id);
      setMsg({
        type: "success",
        text:
          res.data.message +
          (res.data.couponCode ? ` Code: ${res.data.couponCode}` : ""),
      });
      await fetchBalance();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to redeem",
      });
    } finally {
      setRedeeming(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rewards.map((r, i) => {
          const canAfford = (balance?.points || 0) >= r.pointsCost;
          return (
            <Card key={r._id} delay={i * 0.06} className="p-5 flex flex-col">
              <div className="text-3xl mb-3">{r.image || "🎁"}</div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {r.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 flex-1">
                {r.description}
              </p>
              {r.tierRequired !== "none" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase mt-2 text-amber-600">
                  <Lock className="w-3 h-3" /> {r.tierRequired}+ only
                </span>
              )}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.04]">
                <span className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                  <Coins className="w-4 h-4" /> {r.pointsCost.toLocaleString()}
                </span>
                <button
                  onClick={() => redeem(r._id)}
                  disabled={!canAfford || redeeming === r._id}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    canAfford
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg"
                      : "bg-gray-100 dark:bg-white/[0.04] text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {redeeming === r._id
                    ? "..."
                    : canAfford
                      ? "Redeem"
                      : "Not enough"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      {rewards.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No rewards available yet. Check back soon!</p>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ─── PACKS TAB (FIFA-inspired) ──────────────────────
// ═══════════════════════════════════════════════════════
function PacksTab({
  balance,
  fetchBalance,
  setMsg,
}: {
  balance: Balance | null;
  fetchBalance: () => Promise<void>;
  setMsg: (m: any) => void;
}) {
  const [packs, setPacks] = useState<PackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<string | null>(null);
  const [result, setResult] = useState<PackResult | null>(null);
  const [reveal, setReveal] = useState<PackReveal | null>(null);
  const [openedPack, setOpenedPack] = useState<PackItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [revealStage, setRevealStage] = useState<
    "charging" | "burst" | "result"
  >("charging");

  const loadPacks = useCallback(async () => {
    try {
      const res = await loyaltyAPI.getPacks();
      setPacks(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPacks();
  }, [loadPacks]);

  const wait = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const closeReveal = () => {
    if (opening) return;
    setShowResult(false);
    setResult(null);
    setReveal(null);
    setOpenedPack(null);
    setRevealStage("charging");
  };

  const openPack = async (pack: PackItem) => {
    try {
      setOpening(pack._id);
      setResult(null);
      setReveal(null);
      setOpenedPack(pack);
      setShowResult(false);
      setRevealStage("charging");
      const res = await loyaltyAPI.openPack(pack._id);
      setResult(res.data.result);
      setReveal(res.data.reveal);
      setShowResult(true);
      await fetchBalance();
      await loadPacks();
      await wait(950);
      setRevealStage("burst");
      await wait(550);
      setRevealStage("result");
      setOpening(null);
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to open pack",
      });
      setShowResult(false);
      setReveal(null);
      setOpenedPack(null);
      setOpening(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const rc = result ? rarityColors[result.rarity] || rarityColors.common : null;
  const theme = reveal ? packThemeConfig[reveal.packClass] : null;

  const getDropVisual = (type: string) => {
    switch (type) {
      case "points":
        return "💰";
      case "coupon":
        return "🎟️";
      case "gift_card":
        return "🪙";
      case "product":
        return "🎮";
      default:
        return "📦";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Pack opening result overlay */}
      <AnimatePresence>
        {showResult && result && rc && reveal && theme && openedPack && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReveal}
          >
            <motion.div
              className={`relative overflow-hidden rounded-[2rem] border ${theme.panel} bg-[#05070f] shadow-2xl ${theme.glow} max-w-2xl w-full mx-4`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${theme.shell} opacity-20`}
                animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-x-[-20%] top-1/2 h-32 -translate-y-1/2 blur-3xl"
                style={{ backgroundImage: reveal.beam }}
                animate={{
                  opacity:
                    revealStage === "charging"
                      ? [0.3, 0.85, 0.3]
                      : [0.7, 1, 0.6],
                  x: ["-8%", "8%", "-8%"],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {(result.rarity === "legendary" ||
                revealStage !== "charging") && (
                <motion.div
                  className="absolute inset-0 opacity-35"
                  style={{
                    background: `radial-gradient(circle at center, ${reveal.halo} 0%, transparent 68%)`,
                  }}
                  animate={{ opacity: [0.2, 0.45, 0.2] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              )}
              <div className="relative z-10 grid gap-0 md:grid-cols-[1.05fr,0.95fr]">
                <div className="relative px-6 py-8 md:px-8 md:py-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
                  <div className="relative flex h-full flex-col items-center justify-center text-center">
                    <motion.div
                      className={`mb-4 flex h-52 w-44 items-center justify-center rounded-[2rem] border border-white/20 bg-gradient-to-br ${theme.shell} text-7xl shadow-2xl`}
                      animate={
                        revealStage === "charging"
                          ? {
                              scale: [1, 1.04, 0.98, 1],
                              rotate: [0, -2, 2, 0],
                              y: [0, -8, 0],
                            }
                          : revealStage === "burst"
                            ? {
                                scale: [1, 1.16, 0.94, 1.05],
                                rotate: [0, 6, -6, 0],
                              }
                            : { scale: [1, 1.03, 1], y: [0, -6, 0] }
                      }
                      transition={{
                        duration: revealStage === "burst" ? 0.55 : 1.1,
                        repeat: revealStage === "result" ? Infinity : 0,
                      }}
                    >
                      <span>{openedPack.image || theme.icon}</span>
                    </motion.div>
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/65">
                      {revealStage === "charging"
                        ? "Charging Tunnel"
                        : revealStage === "burst"
                          ? "Walkout Reveal"
                          : "Drop Confirmed"}
                    </div>
                    <div className="mt-3 max-w-xs text-sm text-white/75">
                      {revealStage === "charging"
                        ? reveal.subtitle
                        : revealStage === "burst"
                          ? "Lights out. Flare up. The pack is breaking open."
                          : reveal.headline}
                    </div>
                  </div>
                </div>

                <div className="relative border-t border-white/10 px-6 py-8 md:border-l md:border-t-0 md:px-8 md:py-10">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                          {openedPack.name}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase ${rc.text} ${rc.bg}`}
                        >
                          {result.rarity}
                        </span>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{
                          opacity: revealStage === "result" ? 1 : 0.65,
                          y: 0,
                        }}
                        transition={{
                          delay: revealStage === "result" ? 0.15 : 0,
                        }}
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                            {getDropVisual(result.type)}
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                              {reveal.title}
                            </div>
                            <h2 className="text-2xl font-black text-white">
                              {result.label}
                            </h2>
                          </div>
                        </div>

                        <p className="text-sm leading-6 text-white/72">
                          {reveal.subtitle}
                        </p>
                      </motion.div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                            Guarantee
                          </div>
                          <div className="mt-2 text-sm font-semibold text-white capitalize">
                            {reveal.guaranteedRarity} or better
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                            Reveal Theme
                          </div>
                          <div className="mt-2 text-sm font-semibold text-white capitalize">
                            {reveal.animationTheme}
                          </div>
                        </div>
                      </div>

                      {(reveal.pityTriggeredEpic ||
                        reveal.pityTriggeredLegendary) && (
                        <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                          {reveal.pityTriggeredLegendary
                            ? "Legendary pity activated. This pull hit the guaranteed top-tier threshold."
                            : "Epic pity activated. The pack forced an elite-tier reward."}
                        </div>
                      )}

                      {result.value?.code && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                            Redemption Code
                          </div>
                          <div className="mt-2 rounded-xl bg-white/10 px-3 py-2 font-mono text-sm text-white">
                            {result.value.code}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={closeReveal}
                      disabled={!!opening}
                      className="mt-8 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-gray-900 transition hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
                    >
                      {opening ? "Reveal in progress..." : "Continue"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map((pack, i) => {
          const canAfford = (balance?.points || 0) >= pack.pointsCost;
          const isOpening = opening === pack._id;
          const themeCard =
            packThemeConfig[pack.packClass] || packThemeConfig.silver;
          const isLocked = !pack.userState?.canOpen || !canAfford;
          return (
            <Card key={pack._id} delay={i * 0.08} className="overflow-hidden">
              <div
                className={`relative h-48 overflow-hidden bg-gradient-to-br ${themeCard.shell}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_50%)]" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
                  <span>{pack.packClass} pack</span>
                  {pack.featured ? (
                    <span>Featured</span>
                  ) : (
                    <span>{pack.animationTheme}</span>
                  )}
                </div>
                {pack.tierRequired !== "none" && (
                  <div className="absolute top-12 right-4 inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-[10px] font-bold uppercase text-white backdrop-blur">
                    <Crown className="w-3 h-3" /> {pack.tierRequired}+
                  </div>
                )}
                {isOpening ? (
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.18, 1],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 1.35,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 flex items-center justify-center text-6xl"
                  >
                    ✨
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="flex h-28 w-24 items-center justify-center rounded-[1.75rem] border border-white/20 bg-black/10 text-6xl backdrop-blur-sm"
                      whileHover={{ scale: 1.04, rotate: -2 }}
                    >
                      {pack.image || themeCard.icon}
                    </motion.div>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {pack.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
                      {pack.headline || `${pack.packClass} walkout system`}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase ${rarityColors[pack.guaranteedRarity]?.text} ${rarityColors[pack.guaranteedRarity]?.bg}`}
                  >
                    {pack.guaranteedRarity}+
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-3 leading-6">
                  {pack.description}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                      Epic Pity
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {pack.userState?.pity?.remainingToEpic > 0
                        ? `${pack.userState.pity.remainingToEpic} opens left`
                        : "Primed now"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                      Legendary Pity
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {pack.userState?.pity?.remainingToLegendary > 0
                        ? `${pack.userState.pity.remainingToLegendary} opens left`
                        : "Primed now"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Coins className="w-4 h-4" />
                    {pack.pointsCost.toLocaleString()}
                  </span>
                  <button
                    onClick={() => openPack(pack)}
                    disabled={isLocked || !!opening}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      !isLocked && !opening
                        ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/25"
                        : "bg-gray-100 dark:bg-white/[0.04] text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isOpening ? "Opening..." : `Open ${pack.packClass}`}
                  </button>
                </div>

                {isLocked && (
                  <div className="mt-3 flex items-start gap-2 rounded-2xl border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
                    <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      {pack.userState?.lockReason ||
                        "You need more points to open this pack."}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      {packs.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No packs available yet. Check back soon!</p>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ─── QUESTS TAB ─────────────────────────────────────
// ═══════════════════════════════════════════════════════
function QuestsTab({
  user,
  fetchBalance,
  setMsg,
}: {
  user: { _id?: string; username?: string } | null;
  fetchBalance: () => Promise<void>;
  setMsg: (m: any) => void;
}) {
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [claimingAll, setClaimingAll] = useState(false);

  const formatProgressValue = (item: QuestItem, value: number) => {
    if (item.type === "monthly_spend") {
      return `${Math.floor(value)} EUR`;
    }
    return Math.floor(value).toString();
  };

  const loadQuests = useCallback(async () => {
    try {
      const res = await loyaltyAPI.getQuests();
      setQuests(res.data || []);
    } catch {
      setMsg({ type: "error", text: "Failed to load quests" });
    } finally {
      setLoading(false);
    }
  }, [setMsg]);

  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  const complete = async (id: string) => {
    try {
      setCompleting(id);
      const res = await loyaltyAPI.completeQuest(id);
      setMsg({ type: "success", text: res.data.message });
      await Promise.all([fetchBalance(), loadQuests()]);
    } catch (err: any) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed" });
    } finally {
      setCompleting(null);
    }
  };

  const claimAllVisible = async () => {
    const claimableNow = quests.filter(
      (q) => q.userProgress.claimable && !q.userProgress.completed,
    );

    if (claimableNow.length === 0) {
      setMsg({
        type: "error",
        text: "No claimable objectives in this section yet",
      });
      return;
    }

    try {
      setClaimingAll(true);
      let claimed = 0;
      let earned = 0;

      for (const quest of claimableNow) {
        try {
          const res = await loyaltyAPI.completeQuest(quest._id);
          claimed += 1;
          earned += Number(res.data?.earned || 0);
        } catch {
          // Keep claiming remaining quests even if one fails.
        }
      }

      await Promise.all([fetchBalance(), loadQuests()]);
      if (claimed > 0) {
        setMsg({
          type: "success",
          text: `Claimed ${claimed} objective(s) for +${earned} points`,
        });
      } else {
        setMsg({
          type: "error",
          text: "No objectives were claimed. Try again.",
        });
      }
    } finally {
      setClaimingAll(false);
    }
  };

  const copyReferralLink = async () => {
    if (!user?._id) {
      setMsg({ type: "error", text: "Sign in to use referral link" });
      return;
    }

    const base = typeof window !== "undefined" ? window.location.origin : "";
    const referralLink = `${base}/register?ref=${encodeURIComponent(user._id)}`;

    try {
      await navigator.clipboard.writeText(referralLink);
      setMsg({ type: "success", text: "Referral link copied" });
    } catch {
      setMsg({ type: "error", text: "Unable to copy referral link" });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const orderedQuests = [...quests].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  const claimableCount = orderedQuests.filter(
    (q) => q.userProgress.claimable && !q.userProgress.completed,
  ).length;
  const achievedCount = orderedQuests.filter(
    (q) =>
      q.userProgress.completed || (q.userProgress.completionCount || 0) > 0,
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card
        className="p-5 mb-5 bg-[#11131c] dark:bg-[#0f1118] border border-white/[0.08]"
        delay={0.05}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[#e6ef57] tracking-tight">
              Quests
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Achieved: {achievedCount}/{orderedQuests.length || 0}
            </p>
          </div>
          <button
            onClick={claimAllVisible}
            disabled={claimingAll || claimableCount === 0}
            className="px-4 py-2 rounded-lg bg-[#252a3a] text-gray-200 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {claimingAll ? "Receiving..." : "Receive All"}
          </button>
        </div>
      </Card>

      {orderedQuests.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No objectives available yet. Check back soon.</p>
        </div>
      )}

      <div className="space-y-3">
        {orderedQuests.map((q, i) => {
          const progress = Math.max(
            0,
            Math.min(100, q.userProgress.progress || 0),
          );
          const current = Math.max(0, Number(q.userProgress.current || 0));
          const target = Math.max(1, Number(q.userProgress.target || 1));
          const buttonBusy = completing === q._id;
          const isCompleted = !!q.userProgress.completed;
          const isClaimable = !!q.userProgress.claimable && !isCompleted;
          const nextEligibleAt = q.userProgress.nextEligibleAt
            ? new Date(q.userProgress.nextEligibleAt).toLocaleString()
            : null;
          const referralLink =
            q.type === "referral_invite" && user?._id
              ? `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${encodeURIComponent(user._id)}`
              : null;

          return (
            <Card
              key={q._id}
              delay={i * 0.04}
              className="p-4 bg-[#1b1d27] dark:bg-[#1b1d27] border border-[#2d3244]"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-fuchsia-500 flex items-center justify-center text-2xl flex-shrink-0">
                  {q.icon || "🎯"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-white text-[1.05rem] leading-tight truncate">
                    {q.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 truncate">
                    {q.rewardPoints} Points
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-[#353a4f] overflow-hidden">
                    <div
                      className="h-full bg-[#08a4ff] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Achieved: {formatProgressValue(q, current)}/
                    {formatProgressValue(q, target)}
                  </p>

                  {referralLink && (
                    <button
                      onClick={copyReferralLink}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200"
                    >
                      <CopySimple className="w-3.5 h-3.5" /> Copy invite link
                    </button>
                  )}

                  {(q.userProgress.blockedReason || nextEligibleAt) &&
                    !isCompleted && (
                      <p className="text-[11px] text-gray-400 mt-1 truncate">
                        {q.userProgress.blockedReason ||
                          (nextEligibleAt
                            ? `Next claim: ${nextEligibleAt}`
                            : "")}
                      </p>
                    )}
                </div>

                <button
                  onClick={() => complete(q._id)}
                  disabled={!isClaimable || buttonBusy}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isClaimable
                      ? "bg-[#2a3550] text-[#14a0ff]"
                      : "bg-[#2a2f40] text-gray-500"
                  }`}
                  title={
                    isCompleted ? "Claimed" : isClaimable ? "Claim" : "Locked"
                  }
                >
                  {buttonBusy ? "..." : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 uppercase tracking-[0.16em]">
                  {q.userProgress.completionCount || 0}/
                  {q.userProgress.completionLimit || 1} claimed
                </span>
                <span
                  className={`font-semibold ${
                    isCompleted
                      ? "text-green-400"
                      : isClaimable
                        ? "text-cyan-300"
                        : "text-gray-400"
                  }`}
                >
                  {isCompleted
                    ? "Claimed"
                    : isClaimable
                      ? "Ready"
                      : "In Progress"}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ─── MEMBERSHIP TAB ─────────────────────────────────
// ═══════════════════════════════════════════════════════
function MembershipTab({
  balance,
  fetchBalance,
  setMsg,
}: {
  balance: Balance | null;
  fetchBalance: () => Promise<void>;
  setMsg: (m: any) => void;
}) {
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await loyaltyAPI.getMembership();
        setTiers(res.data.tiers);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upgrade = async (tier: string) => {
    try {
      setUpgrading(true);
      const res = await loyaltyAPI.upgradeTier(tier);
      setMsg({ type: "success", text: res.data.message });
      await fetchBalance();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to upgrade",
      });
    } finally {
      setUpgrading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const allTiers: MembershipTier[] = [
    {
      _id: "free-tier",
      tier: "free",
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      pointsMultiplier: 1,
      perks: [
        "1x points on purchases",
        "Access to Starter Packs",
        "Daily login bonus",
      ],
      packLuckMultiplier: 1,
      monthlyBonusPoints: 0,
    },
    ...tiers,
  ].sort((a, b) => (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" /> GamePlus Membership
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upgrade your tier for exclusive benefits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {allTiers.map((t, i) => {
          const isCurrent = balance?.tier === t.tier;
          const currentRank = tierOrder[balance?.tier || "free"] || 0;
          const targetRank = tierOrder[t.tier] || 0;
          const canUpgrade = t.tier !== "free" && targetRank > currentRank;
          const enoughPoints = (balance?.points || 0) >= t.price;
          const colors =
            t.tier === "platinum"
              ? "border-cyan-300 dark:border-cyan-400/50 bg-gradient-to-b from-cyan-50 via-sky-50 to-white dark:from-cyan-950/20 dark:via-slate-950 dark:to-[#16161f]"
              : t.tier === "gold"
                ? "border-amber-400 dark:border-amber-500 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/10 dark:to-[#16161f]"
                : t.tier === "silver"
                  ? "border-slate-300 dark:border-slate-500 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/10 dark:to-[#16161f]"
                  : "border-gray-200 dark:border-white/[0.08]";

          return (
            <Card
              key={t.tier}
              delay={i * 0.1}
              className={`p-6 border-2 ${colors} relative overflow-hidden`}
            >
              {t.tier === "platinum" && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500" />
              )}
              {isCurrent && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-[10px] font-bold uppercase">
                  Current
                </div>
              )}
              <div className="text-center mb-5">
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                    t.tier === "platinum"
                      ? "bg-gradient-to-br from-cyan-400 to-indigo-500"
                      : t.tier === "gold"
                        ? "bg-gradient-to-br from-amber-400 to-orange-500"
                        : t.tier === "silver"
                          ? "bg-gradient-to-br from-slate-400 to-slate-600"
                          : "bg-gradient-to-br from-gray-400 to-gray-600"
                  } text-white`}
                >
                  {t.tier === "platinum" ? (
                    <Sparkles className="w-7 h-7" />
                  ) : t.tier === "gold" ? (
                    <Crown className="w-7 h-7" />
                  ) : t.tier === "silver" ? (
                    <Award className="w-7 h-7" />
                  ) : (
                    <Star className="w-7 h-7" />
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                  {t.name}
                </h3>
                {t.price > 0 && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />{" "}
                    {t.price.toLocaleString()} pts/month
                  </p>
                )}
                <div className="mt-2 text-xs font-bold text-primary-600">
                  {t.pointsMultiplier}x points multiplier
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3 text-left">
                <div className="rounded-xl bg-white/70 px-3 py-2 dark:bg-white/[0.05]">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                    Pack Luck
                  </div>
                  <div className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    x{(t.packLuckMultiplier || 1).toFixed(2)}
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 px-3 py-2 dark:bg-white/[0.05]">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                    Monthly Bonus
                  </div>
                  <div className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                    +{(t.monthlyBonusPoints || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                {t.perks.map((perk, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              {canUpgrade && !isCurrent && (
                <button
                  onClick={() => upgrade(t.tier)}
                  disabled={upgrading || !enoughPoints}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                    t.tier === "platinum"
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                      : t.tier === "gold"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg disabled:opacity-50"
                  }`}
                >
                  {enoughPoints ? "Upgrade" : "Need more points"}
                </button>
              )}

              {!isCurrent && !canUpgrade && (
                <div className="rounded-xl border border-dashed border-gray-200 px-4 py-2 text-center text-xs font-medium text-gray-500 dark:border-white/[0.08] dark:text-gray-400">
                  {t.tier === "free"
                    ? "Base access"
                    : "Unlock after your current tier expires or choose a higher pass"}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ─── HISTORY TAB ────────────────────────────────────
// ═══════════════════════════════════════════════════════
function HistoryTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await loyaltyAPI.getHistory(page, 15);
        setTransactions(res.data.transactions);
        setTotalPages(res.data.pages);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const sourceIcons: Record<string, string> = {
    purchase: "🛒",
    signup: "🎉",
    daily_login: "☀️",
    quest: "🎯",
    pack_open: "📦",
    redeem_reward: "🎁",
    admin_grant: "👑",
    tier_bonus: "⭐",
    expiration: "⏰",
    refund: "↩️",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02]">
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold text-right">Points</th>
                <th className="px-5 py-3 font-semibold text-right">Balance</th>
                <th className="px-5 py-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className="text-lg mr-1">
                      {sourceIcons[tx.source] || "•"}
                    </span>
                    <span className="text-xs font-medium capitalize text-gray-600 dark:text-gray-400">
                      {tx.source.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300 text-xs max-w-[200px] truncate">
                    {tx.description}
                  </td>
                  <td
                    className={`px-5 py-3 text-right font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-500 text-xs">
                    {tx.balance.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-400 text-xs">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No transactions yet</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100 dark:border-white/[0.04]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/[0.04] disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/[0.04] disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
