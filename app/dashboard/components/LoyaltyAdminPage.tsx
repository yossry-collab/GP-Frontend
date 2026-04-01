import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Gift, FileText, Package, Shield, Plus, Edit3, Trash2, Coins } from "lucide-react";
import { loyaltyAPI } from "@/lib/api";
import { Msg, Spinner, Empty, ActionBtn } from "./DashboardUI";

export default function LoyaltyAdminPage() {
  const [tab, setTab] = useState<"overview" | "rewards" | "quests" | "packs" | "config">("overview");
  const [stats, setStats] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [quests, setQuests] = useState<any[]>([]);
  const [packs, setPacks] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [grantForm, setGrantForm] = useState({ userId: "", amount: 0, reason: "" });
  const [granting, setGranting] = useState(false);

  // Reward form
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [rewardForm, setRewardForm] = useState({
    name: "", description: "", type: "coupon", pointsCost: 100,
    discountPercent: 0, discountAmount: 0, stock: -1, tierRequired: "free", isActive: true,
  });

  // Quest form
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<any>(null);
  const [questForm, setQuestForm] = useState({
    title: "", description: "", type: "custom", rewardPoints: 50, featureFlag: "", isActive: true
  });

  const cardClass = "bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]";
  const inputClass = "w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm outline-none transition-all";
  const btnPrimary = "px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all";
  const btnSecondary = "px-4 py-2 bg-gray-100 dark:bg-white/[0.06] text-sm font-medium rounded-xl hover:bg-gray-200 transition-all";

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [statsRes, rewardsRes, questsRes, packsRes, configsRes] = await Promise.all([
        loyaltyAPI.adminStats().catch(() => null),
        loyaltyAPI.adminGetRewards().catch(() => ({ data: { rewards: [] } })),
        loyaltyAPI.adminGetQuests().catch(() => ({ data: { quests: [] } })),
        loyaltyAPI.adminGetPacks().catch(() => ({ data: { packs: [] } })),
        loyaltyAPI.adminGetConfig().catch(() => ({ data: { configs: [] } })),
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      setRewards(rewardsRes?.data?.rewards || []);
      setQuests(questsRes?.data?.quests || []);
      setPacks(packsRes?.data?.packs || []);
      setConfigs(configsRes?.data?.configs || []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await loyaltyAPI.adminSeed();
      setMsg({ type: "success", text: "Data seeded!" });
      loadAll();
    } catch { setMsg({ type: "error", text: "Seed failed." }); }
    setSeeding(false);
  }

  async function handleGrant() {
    if (!grantForm.userId || grantForm.amount <= 0) return setMsg({ type: "error", text: "Invalid input." });
    setGranting(true);
    try {
      await loyaltyAPI.adminGrantPoints(grantForm.userId, grantForm.amount, grantForm.reason);
      setMsg({ type: "success", text: "Points granted!" });
      setGrantForm({ userId: "", amount: 0, reason: "" });
      loadAll();
    } catch { setMsg({ type: "error", text: "Grant failed." }); }
    setGranting(false);
  }

  async function saveReward() {
    try {
      if (editingReward) await loyaltyAPI.adminUpdateReward(editingReward._id, rewardForm);
      else await loyaltyAPI.adminCreateReward(rewardForm);
      setMsg({ type: "success", text: "Reward saved!" });
      setShowRewardForm(false);
      setEditingReward(null);
      loadAll();
    } catch { setMsg({ type: "error", text: "Save failed." }); }
  }

  async function saveQuest() {
    try {
      if (editingQuest) await loyaltyAPI.adminUpdateQuest(editingQuest._id, questForm);
      else await loyaltyAPI.adminCreateQuest(questForm);
      setMsg({ type: "success", text: "Quest saved!" });
      setShowQuestForm(false);
      setEditingQuest(null);
      loadAll();
    } catch { setMsg({ type: "error", text: "Save failed." }); }
  }

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: BarChart3 },
    { key: "rewards" as const, label: "Rewards", icon: Gift },
    { key: "quests" as const, label: "Quests", icon: FileText },
    { key: "packs" as const, label: "Packs", icon: Package },
    { key: "config" as const, label: "Config", icon: Shield },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <Msg msg={msg} onClose={() => setMsg(null)} />

      <div className={`${cardClass} p-1.5 flex gap-1 overflow-x-auto`}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.key ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
           <div className="grid md:grid-cols-2 gap-4">
              <div className={`${cardClass} p-5`}>
                 <h3 className="text-sm font-semibold mb-2">Seed Default Data</h3>
                 <button onClick={handleSeed} disabled={seeding} className={btnPrimary}>{seeding ? "..." : "Seed Defaults"}</button>
              </div>
              <div className={`${cardClass} p-5`}>
                 <h3 className="text-sm font-semibold mb-2">Grant Points</h3>
                 <div className="flex gap-2">
                    <input placeholder="User ID" value={grantForm.userId} onChange={(e) => setGrantForm({...grantForm, userId: e.target.value})} className={inputClass} />
                    <input type="number" placeholder="Amt" value={grantForm.amount || ""} onChange={(e) => setGrantForm({...grantForm, amount: parseInt(e.target.value)||0})} className={`${inputClass} w-20`} />
                    <button onClick={handleGrant} disabled={granting} className={btnPrimary}>Grant</button>
                 </div>
              </div>
           </div>
           {stats && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`${cardClass} p-4`}><p className="text-xs text-gray-400">Total Users</p><p className="text-xl font-bold">{stats.totalUsers}</p></div>
                <div className={`${cardClass} p-4`}><p className="text-xs text-gray-400">Points</p><p className="text-xl font-bold">{stats.totalPointsInCirculation?.toLocaleString()}</p></div>
                <div className={`${cardClass} p-4`}><p className="text-xs text-gray-400">Redemptions</p><p className="text-xl font-bold">{stats.totalRedemptions}</p></div>
             </div>
           )}
        </div>
      )}

      {tab === "rewards" && (
        <div className="space-y-4">
           <div className="flex justify-between items-center"><h3 className="font-bold">Rewards</h3><button onClick={() => setShowRewardForm(true)} className={btnPrimary}>+ Add</button></div>
           {showRewardForm && (
             <div className={`${cardClass} p-5 space-y-3`}>
               <input placeholder="Reward Name" value={rewardForm.name} onChange={(e) => setRewardForm({...rewardForm, name: e.target.value})} className={inputClass} />
               <div className="flex gap-2 text-sm text-gray-900 dark:text-white">
                 <button onClick={saveReward} className={btnPrimary}>Save</button>
                 <button onClick={() => setShowRewardForm(false)} className={btnSecondary}>Cancel</button>
               </div>
             </div>
           )}
           <div className={`${cardClass} overflow-hidden`}>
              <table className="w-full text-sm">
                 <thead className="bg-gray-50 border-b text-left text-xs uppercase text-gray-400"><tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Cost</th><th className="px-4 py-2 text-right">Actions</th></tr></thead>
                 <tbody>
                    {rewards.map(r => (
                      <tr key={r._id} className="border-b">
                        <td className="px-4 py-3">{r.name}</td>
                        <td className="px-4 py-3 font-bold text-amber-600">{r.pointsCost}</td>
                        <td className="px-4 py-3 text-right"><ActionBtn onClick={() => { setEditingReward(r); setRewardForm(r); setShowRewardForm(true); }} icon={Edit3} /></td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}
