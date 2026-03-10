'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Gift, Zap, Trophy, Crown, Clock, ChevronRight, Sparkles,
  Package, Target, Flame, Lock, Check, ArrowRight, History, Award,
  Coins, ShoppingBag, Ticket, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { loyaltyAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'

// ─── Types ──────────────────────────────────────────
interface Balance { points: number; lifetimePoints: number; tier: string; streakDays: number }
interface Transaction { _id: string; type: string; amount: number; balance: number; source: string; description: string; createdAt: string }
interface RewardItem { _id: string; name: string; description: string; type: string; pointsCost: number; discountPercent: number; discountAmount: number; image: string; stock: number; tierRequired: string }
interface QuestItem { _id: string; title: string; description: string; type: string; rewardPoints: number; icon: string; featureFlag: boolean; metadata: any; userProgress: { completed: boolean; progress: number; completedAt?: string } }
interface PackItem { _id: string; name: string; description: string; image: string; pointsCost: number; tierRequired: string }
interface MembershipTier { _id: string; tier: string; name: string; price: number; yearlyPrice: number; pointsMultiplier: number; perks: string[] }
interface PackResult { type: string; rarity: string; label: string; value: any }

// ─── Rarity colors ──────────────────────────────────
const rarityColors: Record<string, { bg: string; text: string; glow: string; border: string }> = {
  common: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', glow: '', border: 'border-gray-300 dark:border-gray-600' },
  rare: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', glow: 'shadow-blue-500/20', border: 'border-blue-400 dark:border-blue-500' },
  epic: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', glow: 'shadow-purple-500/30', border: 'border-purple-400 dark:border-purple-500' },
  legendary: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', glow: 'shadow-amber-500/40', border: 'border-amber-400 dark:border-amber-500' },
}

const tierConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  free: { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', icon: <Star className="w-4 h-4" /> },
  silver: { color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', icon: <Award className="w-4 h-4" /> },
  gold: { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20', icon: <Crown className="w-4 h-4" /> },
}

// ─── Card wrapper ───────────────────────────────────
const Card = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    className={`bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    {children}
  </motion.div>
)

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
  )
}

function RewardsContent() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'overview' | 'rewards' | 'quests' | 'packs' | 'membership' | 'history'>('overview')
  const [balance, setBalance] = useState<Balance | null>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchBalance = useCallback(async () => {
    try {
      const res = await loyaltyAPI.getBalance()
      setBalance(res.data)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchBalance()
      // Auto-claim signup bonus on first visit
      try { await loyaltyAPI.signupBonus(); await fetchBalance() } catch { /* already claimed */ }
      setLoading(false)
    }
    init()
  }, [fetchBalance])

  // Auto-dismiss messages
  useEffect(() => { if (msg) { const t = setTimeout(() => setMsg(null), 4000); return () => clearTimeout(t) } }, [msg])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <Zap className="w-4 h-4" /> },
    { key: 'rewards', label: 'Rewards', icon: <Gift className="w-4 h-4" /> },
    { key: 'packs', label: 'Packs', icon: <Package className="w-4 h-4" /> },
    { key: 'quests', label: 'Quests', icon: <Target className="w-4 h-4" /> },
    { key: 'membership', label: 'GamePlus', icon: <Crown className="w-4 h-4" /> },
    { key: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
  ]

  return (
    <>
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" /> Reward Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">Earn points, unlock rewards, and level up!</p>
          </div>
          {/* Points Badge */}
          {balance && (
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${tierConfig[balance.tier]?.bg} ${tierConfig[balance.tier]?.color}`}>
                {tierConfig[balance.tier]?.icon}
                <span className="capitalize">{balance.tier === 'free' ? 'Free' : `GamePlus ${balance.tier}`}</span>
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
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
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
              msg.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            {msg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'overview' && <OverviewTab key="overview" balance={balance} fetchBalance={fetchBalance} setMsg={setMsg} />}
        {tab === 'rewards' && <RewardsTab key="rewards" balance={balance} fetchBalance={fetchBalance} setMsg={setMsg} />}
        {tab === 'packs' && <PacksTab key="packs" balance={balance} fetchBalance={fetchBalance} setMsg={setMsg} />}
        {tab === 'quests' && <QuestsTab key="quests" balance={balance} fetchBalance={fetchBalance} setMsg={setMsg} />}
        {tab === 'membership' && <MembershipTab key="membership" balance={balance} fetchBalance={fetchBalance} setMsg={setMsg} />}
        {tab === 'history' && <HistoryTab key="history" />}
      </AnimatePresence>
    </>
  )
}

// ═══════════════════════════════════════════════════════
// ─── OVERVIEW TAB ───────────────────────────────────
// ═══════════════════════════════════════════════════════
function OverviewTab({ balance, fetchBalance, setMsg }: { balance: Balance | null; fetchBalance: () => Promise<void>; setMsg: (m: any) => void }) {
  const [claiming, setClaiming] = useState(false)

  const claimDaily = async () => {
    try {
      setClaiming(true)
      const res = await loyaltyAPI.dailyLogin()
      setMsg({ type: 'success', text: res.data.message })
      await fetchBalance()
    } catch (err: any) {
      const m = err.response?.data?.message || 'Failed to claim'
      setMsg({ type: err.response?.data?.alreadyClaimed ? 'success' : 'error', text: m })
    } finally {
      setClaiming(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Current Points', value: balance?.points.toLocaleString() || '0', icon: <Coins className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
          { label: 'Lifetime Earned', value: balance?.lifetimePoints.toLocaleString() || '0', icon: <Trophy className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
          { label: 'Login Streak', value: `${balance?.streakDays || 0} days`, icon: <Flame className="w-5 h-5" />, color: 'from-red-500 to-orange-500' },
          { label: 'Tier', value: balance?.tier === 'free' ? 'Free' : `${balance?.tier}`, icon: <Crown className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
        ].map((stat, i) => (
          <Card key={stat.label} delay={i * 0.08} className="p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white capitalize">{stat.value}</p>
            <p className="text-xs font-medium text-gray-500 mt-1">{stat.label}</p>
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
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Claim</span>
            )}
          </button>
        </div>
        {/* Streak visualization */}
        {balance && balance.streakDays > 0 && (
          <div className="mt-4 flex items-center gap-1">
            {Array.from({ length: Math.min(balance.streakDays, 7) }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                {i + 1}
              </div>
            ))}
            {balance.streakDays > 7 && (
              <span className="text-xs font-bold text-orange-500 ml-2">+{balance.streakDays - 7} more</span>
            )}
          </div>
        )}
      </Card>

      {/* How to earn */}
      <Card className="p-6" delay={0.4}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">How to Earn Points</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <ShoppingBag className="w-4 h-4" />, label: 'Make purchases', desc: '10 pts per €1 spent', color: 'bg-green-100 dark:bg-green-900/20 text-green-600' },
            { icon: <Clock className="w-4 h-4" />, label: 'Daily login', desc: '10-60 pts per day', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' },
            { icon: <Target className="w-4 h-4" />, label: 'Complete quests', desc: '30-200 pts per quest', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' },
            { icon: <Star className="w-4 h-4" />, label: 'Sign up bonus', desc: '100 pts one-time', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.02]">
              <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center`}>{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── REWARDS TAB ────────────────────────────────────
// ═══════════════════════════════════════════════════════
function RewardsTab({ balance, fetchBalance, setMsg }: { balance: Balance | null; fetchBalance: () => Promise<void>; setMsg: (m: any) => void }) {
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { const res = await loyaltyAPI.getRewards(); setRewards(res.data) }
      catch { setMsg({ type: 'error', text: 'Failed to load rewards' }) }
      finally { setLoading(false) }
    })()
  }, [setMsg])

  const redeem = async (id: string) => {
    try {
      setRedeeming(id)
      const res = await loyaltyAPI.redeemReward(id)
      setMsg({ type: 'success', text: res.data.message + (res.data.couponCode ? ` Code: ${res.data.couponCode}` : '') })
      await fetchBalance()
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to redeem' })
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rewards.map((r, i) => {
          const canAfford = (balance?.points || 0) >= r.pointsCost
          return (
            <Card key={r._id} delay={i * 0.06} className="p-5 flex flex-col">
              <div className="text-3xl mb-3">{r.image || '🎁'}</div>
              <h3 className="font-bold text-gray-900 dark:text-white">{r.name}</h3>
              <p className="text-xs text-gray-500 mt-1 flex-1">{r.description}</p>
              {r.tierRequired !== 'none' && (
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
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg'
                      : 'bg-gray-100 dark:bg-white/[0.04] text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {redeeming === r._id ? '...' : canAfford ? 'Redeem' : 'Not enough'}
                </button>
              </div>
            </Card>
          )
        })}
      </div>
      {rewards.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No rewards available yet. Check back soon!</p>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── PACKS TAB (FIFA-inspired) ──────────────────────
// ═══════════════════════════════════════════════════════
function PacksTab({ balance, fetchBalance, setMsg }: { balance: Balance | null; fetchBalance: () => Promise<void>; setMsg: (m: any) => void }) {
  const [packs, setPacks] = useState<PackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState<string | null>(null)
  const [result, setResult] = useState<PackResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    (async () => {
      try { const res = await loyaltyAPI.getPacks(); setPacks(res.data) }
      catch { /* ignore */ }
      finally { setLoading(false) }
    })()
  }, [])

  const openPack = async (id: string) => {
    try {
      setOpening(id)
      setResult(null)
      setShowResult(false)
      const res = await loyaltyAPI.openPack(id)
      // Delay reveal for animation
      setTimeout(() => {
        setResult(res.data.result)
        setShowResult(true)
        setOpening(null)
      }, 1500)
      await fetchBalance()
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to open pack' })
      setOpening(null)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  const rc = result ? rarityColors[result.rarity] || rarityColors.common : null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Pack opening result overlay */}
      <AnimatePresence>
        {showResult && result && rc && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResult(false)}
          >
            <motion.div
              className={`relative p-8 rounded-3xl border-2 ${rc.border} ${rc.bg} shadow-2xl ${rc.glow} max-w-sm w-full mx-4 text-center`}
              initial={{ scale: 0.3, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              {result.rarity === 'legendary' && (
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
              <div className="relative z-10">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {result.type === 'points' ? '💰' : result.type === 'coupon' ? '🎫' : result.type === 'product' ? '🎮' : '📦'}
                </motion.div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 ${rc.text} ${rc.bg}`}>
                  {result.rarity}
                </span>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">{result.label}</h2>
                {result.value?.code && (
                  <p className="text-sm font-mono bg-gray-100 dark:bg-white/10 rounded-lg px-3 py-2 mt-2">{result.value.code}</p>
                )}
                <button
                  onClick={() => setShowResult(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map((pack, i) => {
          const canAfford = (balance?.points || 0) >= pack.pointsCost
          const isOpening = opening === pack._id
          return (
            <Card key={pack._id} delay={i * 0.08} className="overflow-hidden">
              {/* Pack visual */}
              <div className={`relative h-40 flex items-center justify-center ${
                pack.tierRequired === 'gold' ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                  : pack.tierRequired === 'silver' ? 'bg-gradient-to-br from-slate-400 to-slate-600'
                  : 'bg-gradient-to-br from-primary-500 to-accent-500'
              }`}>
                {isOpening ? (
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-6xl"
                  >
                    ✨
                  </motion.div>
                ) : (
                  <span className="text-6xl">{pack.image || '📦'}</span>
                )}
                {pack.tierRequired !== 'none' && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur text-white text-[10px] font-bold uppercase flex items-center gap-1">
                    <Crown className="w-3 h-3" /> {pack.tierRequired}+
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{pack.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{pack.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Coins className="w-4 h-4" /> {pack.pointsCost.toLocaleString()}
                  </span>
                  <button
                    onClick={() => openPack(pack._id)}
                    disabled={!canAfford || !!opening}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      canAfford && !opening
                        ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/25'
                        : 'bg-gray-100 dark:bg-white/[0.04] text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isOpening ? 'Opening...' : 'Open Pack'}
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      {packs.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No packs available yet. Check back soon!</p>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── QUESTS TAB ─────────────────────────────────────
// ═══════════════════════════════════════════════════════
function QuestsTab({ balance, fetchBalance, setMsg }: { balance: Balance | null; fetchBalance: () => Promise<void>; setMsg: (m: any) => void }) {
  const [quests, setQuests] = useState<QuestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { const res = await loyaltyAPI.getQuests(); setQuests(res.data) }
      catch { /* ignore */ }
      finally { setLoading(false) }
    })()
  }, [])

  const complete = async (id: string) => {
    try {
      setCompleting(id)
      const res = await loyaltyAPI.completeQuest(id)
      setMsg({ type: 'success', text: res.data.message })
      await fetchBalance()
      // Refresh quests
      const qRes = await loyaltyAPI.getQuests()
      setQuests(qRes.data)
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' })
    } finally {
      setCompleting(null)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  const active = quests.filter(q => !q.userProgress.completed)
  const completed = quests.filter(q => q.userProgress.completed)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {active.length > 0 && (
        <>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Active Quests</h3>
          <div className="space-y-3 mb-8">
            {active.map((q, i) => (
              <Card key={q._id} delay={i * 0.06} className="p-4 flex items-center gap-4">
                <div className="text-2xl flex-shrink-0">{q.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{q.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{q.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                    <Coins className="w-3.5 h-3.5" /> +{q.rewardPoints}
                  </span>
                  <button
                    onClick={() => complete(q._id)}
                    disabled={completing === q._id}
                    className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {completing === q._id ? '...' : 'Complete'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Completed</h3>
          <div className="space-y-3">
            {completed.map((q, i) => (
              <Card key={q._id} delay={i * 0.04} className="p-4 flex items-center gap-4 opacity-60">
                <div className="text-2xl flex-shrink-0">{q.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-through">{q.title}</h4>
                  <p className="text-xs text-gray-500">{q.description}</p>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-bold">Done</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {quests.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No quests available yet. Check back soon!</p>
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── MEMBERSHIP TAB ─────────────────────────────────
// ═══════════════════════════════════════════════════════
function MembershipTab({ balance, fetchBalance, setMsg }: { balance: Balance | null; fetchBalance: () => Promise<void>; setMsg: (m: any) => void }) {
  const [tiers, setTiers] = useState<MembershipTier[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    (async () => {
      try { const res = await loyaltyAPI.getMembership(); setTiers(res.data.tiers) }
      catch { /* ignore */ }
      finally { setLoading(false) }
    })()
  }, [])

  const upgrade = async (tier: string) => {
    try {
      setUpgrading(true)
      const res = await loyaltyAPI.upgradeTier(tier)
      setMsg({ type: 'success', text: res.data.message })
      await fetchBalance()
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upgrade' })
    } finally {
      setUpgrading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  const allTiers = [
    {
      tier: 'free',
      name: 'Free',
      price: 0,
      pointsMultiplier: 1,
      perks: ['1x points on purchases', 'Access to Starter Packs', 'Daily login bonus'],
    },
    ...tiers,
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" /> GamePlus Membership
        </h2>
        <p className="text-sm text-gray-500 mt-1">Upgrade your tier for exclusive benefits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allTiers.map((t, i) => {
          const isCurrent = balance?.tier === t.tier
          const isHigher = (t.tier === 'silver' && balance?.tier === 'free') || (t.tier === 'gold' && balance?.tier !== 'gold')
          const colors = t.tier === 'gold'
            ? 'border-amber-400 dark:border-amber-500 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/10 dark:to-[#16161f]'
            : t.tier === 'silver'
            ? 'border-slate-300 dark:border-slate-500 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/10 dark:to-[#16161f]'
            : 'border-gray-200 dark:border-white/[0.08]'

          return (
            <Card key={t.tier} delay={i * 0.1} className={`p-6 border-2 ${colors} relative overflow-hidden`}>
              {isCurrent && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-[10px] font-bold uppercase">
                  Current
                </div>
              )}
              <div className="text-center mb-5">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                  t.tier === 'gold' ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : t.tier === 'silver' ? 'bg-gradient-to-br from-slate-400 to-slate-600'
                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                } text-white`}>
                  {t.tier === 'gold' ? <Crown className="w-7 h-7" /> : t.tier === 'silver' ? <Award className="w-7 h-7" /> : <Star className="w-7 h-7" />}
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{t.name}</h3>
                {t.price > 0 && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-500" /> {t.price.toLocaleString()} pts/month
                  </p>
                )}
                <div className="mt-2 text-xs font-bold text-primary-600">{t.pointsMultiplier}x points multiplier</div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {t.perks.map((perk, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
              {isHigher && !isCurrent && (
                <button
                  onClick={() => upgrade(t.tier)}
                  disabled={upgrading}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                    t.tier === 'gold'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg'
                  }`}
                >
                  Upgrade
                </button>
              )}
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════
// ─── HISTORY TAB ────────────────────────────────────
// ═══════════════════════════════════════════════════════
function HistoryTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await loyaltyAPI.getHistory(page, 15)
        setTransactions(res.data.transactions)
        setTotalPages(res.data.pages)
      } catch { /* ignore */ }
      finally { setLoading(false) }
    })()
  }, [page])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  const sourceIcons: Record<string, string> = {
    purchase: '🛒', signup: '🎉', daily_login: '☀️', quest: '🎯',
    pack_open: '📦', redeem_reward: '🎁', admin_grant: '👑',
    tier_bonus: '⭐', expiration: '⏰', refund: '↩️',
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
              {transactions.map(tx => (
                <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-lg mr-1">{sourceIcons[tx.source] || '•'}</span>
                    <span className="text-xs font-medium capitalize text-gray-600 dark:text-gray-400">{tx.source.replace('_', ' ')}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300 text-xs max-w-[200px] truncate">{tx.description}</td>
                  <td className={`px-5 py-3 text-right font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-500 text-xs">{tx.balance.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-gray-400 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</td>
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
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/[0.04] disabled:opacity-30">Prev</button>
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-white/[0.04] disabled:opacity-30">Next</button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
