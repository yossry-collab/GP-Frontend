import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Coins,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
import { adminAPI } from "@/lib/api";
import { StatsData } from "../types";
import { TOOLTIP_STYLE, renderCustomPieLabel } from "../utils";
import Sparkline from "./Sparkline";

import Skeleton from "@/components/Skeleton";
import { useDashboardStats } from "../hooks/useDashboardStats";

interface OverviewPageProps {
  username: string;
}

export default function OverviewPage({ username }: OverviewPageProps) {
  const { stats, advancedStats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <Skeleton width="240px" height="32px" className="mb-2" />
          <Skeleton width="180px" height="16px" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="130px" radius="24px" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Skeleton className="lg:col-span-2" height="400px" radius="24px" />
          <Skeleton height="400px" radius="24px" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const salesSparkline = stats.monthlyOrders.map((m: any) => m.revenue || 0);
  const usersSparkline = stats.monthlyUsers.map((m: any) => m.users || 0);
  const ordersSparkline = stats.monthlyOrders.map((m: any) => m.orders || 0);
  const productsSparkline = stats.monthlyOrders.map(() => 0); /* STATIC VALUE - Replace with real category/product historical data */

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      sparkline: salesSparkline,
      color: "#00A76F",
      bg: "bg-[#C8FAD6]/60 dark:bg-[#00A76F]/10",
      textColor: "text-[#004B50] dark:text-[#5BE49B]",
    },
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      sparkline: usersSparkline,
      color: "#006C9C",
      bg: "bg-[#CAFDF5]/60 dark:bg-[#006C9C]/10",
      textColor: "text-[#003768] dark:text-[#61F3F3]",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      sparkline: ordersSparkline,
      color: "#B76E00",
      bg: "bg-[#FFF5CC]/60 dark:bg-[#B76E00]/10",
      textColor: "text-[#7A4100] dark:text-[#FFD666]",
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      sparkline: productsSparkline,
      color: "#B71D18",
      bg: "bg-[#FFE9D5]/60 dark:bg-[#B71D18]/10",
      textColor: "text-[#7A0916] dark:text-[#FFAC82]",
    },
  ];

  const websiteVisitsData = stats.monthlyOrders.map((mo: any) => ({
    name: mo.month.substring(0, 3),
    completed: mo.completed || 0,
    pending: mo.pending || 0,
    failed: mo.failed || 0,
    total: mo.orders || 0,
  }));

  const currentVisitsData = Object.entries(stats.categories).map(
    ([name, value]) => ({
      name:
        name === "gift-card"
          ? "Gift Cards"
          : name.charAt(0).toUpperCase() + name.slice(1),
      value,
    })
  );
  const currentVisitsColors = ["#3366FF", "#00B8D9", "#FFAB00", "#FF5630"];

  const conversionData = [
    { name: "Completed", value: stats.completedOrders, color: "#00A76F" },
    { name: "Pending", value: stats.pendingOrders, color: "#FFAB00" },
    { name: "Failed", value: stats.failedOrders, color: "#FF5630" },
  ];
  const totalOrdersForRate = stats.totalOrders || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold text-gray-900 dark:text-white capitalize">
          Welcome Back, {username}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {username}&apos;s dashboard overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className={`${card.bg} rounded-2xl p-6 relative overflow-hidden`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <div
              className="absolute -right-4 -top-4 w-28 h-28 rounded-full opacity-[0.08]"
              style={{ backgroundColor: card.color }}
            />
            <div className="absolute top-4 right-4 w-24 h-14">
              <Sparkline data={card.sparkline} color={card.color} height={56} />
            </div>
            <div className="relative z-10">
              <h3
                className={`text-3xl font-extrabold tracking-tight ${card.textColor}`}
              >
                {card.value}
              </h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-2">
                {card.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced KPIs */}
      {advancedStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Avg Order Value",
              value: `$${(advancedStats.avgOrderValue || 0).toFixed(2)}`,
              icon: DollarSign,
              color: "#7C3AED",
              bg: "bg-violet-50 dark:bg-violet-500/10",
            },
            {
              label: "Conversion Rate",
              value: `${(advancedStats.conversionRate || 0).toFixed(1)}%`,
              icon: TrendingUp,
              color: "#0891B2",
              bg: "bg-cyan-50 dark:bg-cyan-500/10",
            },
            {
              label: "Revenue This Month",
              value: `$${(advancedStats.revenueThisMonth || 0).toLocaleString()}`,
              icon: Coins,
              color: "#059669",
              bg: "bg-emerald-50 dark:bg-emerald-500/10",
            },
            {
              label: "Top Category",
              value:
                advancedStats.topCategory?.name ||
                (typeof advancedStats.topCategory === "string"
                  ? advancedStats.topCategory
                  : "N/A"),
              icon: BarChart3,
              color: "#D97706",
              bg: "bg-amber-50 dark:bg-amber-500/10",
            },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className={`${kpi.bg} rounded-2xl p-5 flex items-center gap-4`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${kpi.color}15` }}
              >
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {kpi.value}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {kpi.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Website Visits + Current Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] p-6 dark:border dark:border-white/[0.06]"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Website Visits
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">—</p>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={websiteVisitsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F6F8" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#919EAB" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#919EAB" }} dx={-8} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(145,158,171,0.08)" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} />
              <Bar dataKey="completed" name="Completed" fill="#3366FF" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="pending" name="Pending" fill="#00B8D9" radius={[4, 4, 0, 0]} barSize={16} />
              <Line type="natural" dataKey="total" name="Total Orders" stroke="#FFAB00" strokeWidth={3} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] p-6 flex flex-col dark:border dark:border-white/[0.06]"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Current Visits
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">Product distribution</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                <Pie
                  data={currentVisitsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  label={(props) => {
                    const {x, y, text, textAnchor} = renderCustomPieLabel(props);
                    return (
                        <text x={x} y={y} fill="#919EAB" textAnchor={textAnchor as any} dominantBaseline="central" fontSize={11} fontWeight={600}>
                            {text}
                        </text>
                    );
                  }}
                >
                  {currentVisitsData.map((_, i) => (
                    <Cell key={i} fill={currentVisitsColors[i % currentVisitsColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Conversion Rates + User Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="bg-white dark:bg-[#16161f] rounded-2xl p-6 dark:border dark:border-white/[0.06]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Conversion Rates</h3>
          </div>
          <div className="space-y-5">
            {conversionData.map((item) => {
              const pct = (item.value / totalOrdersForRate) * 100;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm font-bold">{item.value} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-2 bg-white dark:bg-[#16161f] rounded-2xl p-6 dark:border dark:border-white/[0.06]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Registrations</h3>
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart data={stats.monthlyUsers}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F6F8" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#919EAB" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#919EAB" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="natural" dataKey="users" stroke="#00B8D9" strokeWidth={3} fillOpacity={0.1} fill="#00B8D9" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Users Table */}
      <motion.div
        className="mt-8 bg-white dark:bg-[#16161f] rounded-2xl overflow-hidden dark:border dark:border-white/[0.06]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <div className="p-6 pb-4"><h3 className="text-lg font-bold">Recent Users</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/[0.02]">
              <tr className="text-left text-[11px] text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {stats.recentUsers.map((u: any) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                        {u.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold">{u.username}</span>
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
