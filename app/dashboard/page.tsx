"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  Package,
  Upload,
  Search,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Shield,
  ShieldOff,
  AlertCircle,
  Check,
  FileText,
  RefreshCw,
  Download,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Home,
  ChevronLeft,
  Menu,
  Gift,
  Coins,
  ShoppingBag,
  Clock,
  Eye,
  ChevronDown,
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
import { useAuth } from "@/lib/auth-context";
import {
  usersAPI,
  productsAPI,
  adminAPI,
  loyaltyAPI,
  ordersAPI,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import SafeImage from "@/components/SafeImage";

// ─── Types ──────────────────────────────────────────────
interface UserType {
  _id: string;
  username: string;
  email: string;
  phonenumber?: string;
  role: string;
  createdAt?: string;
  isBanned?: boolean;
  banReason?: string;
}
interface ProductType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  createdAt?: string;
}
interface StatsData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  failedOrders: number;
  monthlyOrders: {
    month: string;
    year: number;
    orders: number;
    revenue: number;
    completed: number;
    pending: number;
    failed: number;
  }[];
  monthlyUsers: { month: string; year: number; users: number }[];
  categories: Record<string, number>;
  recentUsers: UserType[];
}

type Page = "overview" | "users" | "products" | "import" | "loyalty" | "orders";

const PIE_COLORS = ["#3366FF", "#00B8D9", "#FFAB00", "#FF5630"];

// ─── Main Dashboard ─────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";
  const [activePage, setActivePage] = useState<Page>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user && !isAdmin) router.push("/store");
  }, [user, isAdmin, router]);

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-500 mb-6">
              You need admin privileges to access this page.
            </p>
            <button
              onClick={() => router.push("/store")}
              className="btn-primary px-6 py-3 text-sm"
            >
              Go to Store
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const sidebarItems: { key: Page; label: string; icon: React.ElementType }[] =
    [
      { key: "overview", label: "Dashboard", icon: Home },
      { key: "users", label: "User", icon: Users },
      { key: "products", label: "Product", icon: Package },
      { key: "orders", label: "Orders", icon: ShoppingBag },
      { key: "import", label: "CSV Import", icon: Upload },
      { key: "loyalty", label: "Loyalty", icon: Gift },
    ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0b0b11] flex">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed left-0 top-0 h-full z-40 bg-white dark:bg-[#16161f] border-r border-gray-200 dark:border-white/[0.06] transition-all duration-300 flex flex-col ${sidebarOpen ? "w-[260px]" : "w-[80px]"}`}
        >
          {/* Logo */}
          <div className="h-[72px] flex items-center px-5 border-b border-gray-100 dark:border-white/[0.04]">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => router.push("/store")}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-glow-sm flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                  GAME<span className="text-gradient">PLUG</span>
                </span>
              )}
            </div>
          </div>

          {/* User Card */}
          {sidebarOpen && (
            <div className="mx-4 mt-5 mb-2 p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const active = activePage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary-600 dark:text-primary-400" : ""}`}
                  />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <div className="px-3 py-4 border-t border-gray-100 dark:border-white/[0.04]">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all"
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
              />
              {sidebarOpen && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-[260px]" : "ml-[80px]"}`}
        >
          {/* Top Bar */}
          <header className="sticky top-0 z-30 h-[72px] bg-white/80 dark:bg-[#16161f]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06] flex items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06]"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/[0.04] border border-transparent focus:border-gray-200 dark:focus:border-white/[0.08] rounded-xl text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/store")}
                className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-white/[0.04] rounded-lg hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all"
              >
                Visit Store
              </button>
              <div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {activePage === "overview" && (
                <OverviewPage
                  key="overview"
                  username={user?.username || "Admin"}
                />
              )}
              {activePage === "users" && <UsersPage key="users" />}
              {activePage === "products" && <ProductsPage key="products" />}
              {activePage === "orders" && <OrdersPage key="orders" />}
              {activePage === "import" && <ImportPage key="import" />}
              {activePage === "loyalty" && <LoyaltyAdminPage key="loyalty" />}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── SPARKLINE COMPONENT (Minimal UI style) ───────────────
// ═══════════════════════════════════════════════════════════
function Sparkline({
  data,
  color,
  height = 60,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
      >
        <defs>
          <linearGradient
            id={`spark-${color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <Area
          type="natural"
          dataKey="v"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={true}
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Custom label renderer for pie chart (Minimal UI style with lines)
const renderCustomPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#637381"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {name} {((percent || 0) * 100).toFixed(1)}%
    </text>
  );
};

// ═══════════════════════════════════════════════════════════
// ─── OVERVIEW PAGE (Minimal UI style) ─────────────────────
// ═══════════════════════════════════════════════════════════
function OverviewPage({ username }: { username: string }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [advancedStats, setAdvancedStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [res, advRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getAdvancedStats(),
        ]);
        setStats(res.data);
        setAdvancedStats(advRes.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </motion.div>
    );
  }

  if (!stats) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Failed to load dashboard data</p>
      </motion.div>
    );
  }

  // Generate sparkline data from monthly stats (smooth curves)
  const salesSparkline = stats.monthlyOrders.map((m) => m.revenue || 0);
  const usersSparkline = stats.monthlyUsers.map((m) => m.users || 0);
  const ordersSparkline = stats.monthlyOrders.map((m) => m.orders || 0);
  const productsSparkline = stats.monthlyOrders.map((_, i) =>
    Math.max(1, stats.totalProducts - Math.floor(Math.random() * 5) + i),
  );

  const statCards = [
    {
      label: "Weekly Sales",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      sparkline: salesSparkline,
      color: "#00A76F",
      bg: "bg-[#C8FAD6]/60 dark:bg-[#00A76F]/10",
      textColor: "text-[#004B50] dark:text-[#5BE49B]",
    },
    {
      label: "New Users",
      value: stats.totalUsers.toLocaleString(),
      sparkline: usersSparkline,
      color: "#006C9C",
      bg: "bg-[#CAFDF5]/60 dark:bg-[#006C9C]/10",
      textColor: "text-[#003768] dark:text-[#61F3F3]",
    },
    {
      label: "Item Orders",
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

  // Website Visits chart data (bar + line combo like Minimal UI)
  const websiteVisitsData = stats.monthlyOrders.map((mo, i) => ({
    name: mo.month.substring(0, 3),
    completed: mo.completed || 0,
    pending: mo.pending || 0,
    failed: mo.failed || 0,
    total: mo.orders || 0,
  }));

  // Current Visits pie data (categories)
  const currentVisitsData = Object.entries(stats.categories).map(
    ([name, value]) => ({
      name:
        name === "gift-card"
          ? "Gift Cards"
          : name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }),
  );
  const currentVisitsColors = ["#3366FF", "#00B8D9", "#FFAB00", "#FF5630"];

  // Conversion rates (order status) for bottom bar chart
  const conversionData = [
    { name: "Completed", value: stats.completedOrders, color: "#00A76F" },
    { name: "Pending", value: stats.pendingOrders, color: "#FFAB00" },
    { name: "Failed", value: stats.failedOrders, color: "#FF5630" },
  ];
  const totalOrdersForRate = stats.totalOrders || 1;

  const tooltipStyle = {
    backgroundColor: "rgba(255,255,255,0.96)",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "12px",
    boxShadow:
      "0 0 2px rgba(145,158,171,0.24), -20px 20px 40px -4px rgba(145,158,171,0.24)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold text-gray-900 dark:text-white">
          Welcome Back, BOSS
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {username}&apos;s dashboard overview
        </p>
      </div>

      {/* ── Stat Cards (Minimal UI style with sparkline) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className={`${card.bg} rounded-2xl p-6 relative overflow-hidden`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-4 -top-4 w-28 h-28 rounded-full opacity-[0.08]"
              style={{ backgroundColor: card.color }}
            />

            {/* Sparkline on top right */}
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

      {/* ── Advanced KPIs ── */}
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
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

      {/* ── Charts Row: Website Visits + Current Visits ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Website Visits (Bar + Line combo) - 2/3 width */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Website Visits
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              (+43%) than last year
            </p>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart
              data={websiteVisitsData}
              margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="barCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3366FF" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#3366FF" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="barPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B8D9" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#00B8D9" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F4F6F8"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#919EAB" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#919EAB" }}
                dx={-8}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(145,158,171,0.08)" }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "13px",
                  paddingTop: "16px",
                  color: "#637381",
                }}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill="url(#barCompleted)"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="url(#barPending)"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
              <Line
                type="natural"
                dataKey="total"
                name="Total Orders"
                stroke="#FFAB00"
                strokeWidth={3}
                dot={false}
                strokeDasharray=""
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Current Visits (Donut Pie) - 1/3 width */}
        <motion.div
          className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6 flex flex-col"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Current Visits
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Product distribution by category
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currentVisitsData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  label={renderCustomPieLabel}
                  labelLine={{ stroke: "#DFE3E8", strokeWidth: 1 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {currentVisitsData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={currentVisitsColors[i % currentVisitsColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
            {currentVisitsData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      currentVisitsColors[i % currentVisitsColors.length],
                  }}
                />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row: Conversion Rates + User Registrations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Rates (horizontal bar chart) */}
        <motion.div
          className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Conversion Rates
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Order status breakdown
            </p>
          </div>
          <div className="space-y-5">
            {conversionData.map((item) => {
              const pct =
                totalOrdersForRate > 0
                  ? (item.value / totalOrdersForRate) * 100
                  : 0;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.value} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">
              Total Orders
            </span>
            <span className="text-xl font-extrabold text-gray-900 dark:text-white">
              {stats.totalOrders}
            </span>
          </div>
        </motion.div>

        {/* User Registrations (smooth area chart) */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              User Registrations
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              New users over last 12 months
            </p>
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart
              data={stats.monthlyUsers}
              margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="areaUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B8D9" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="#00B8D9" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F4F6F8"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#919EAB" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#919EAB" }}
                dx={-8}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="natural"
                dataKey="users"
                name="New Users"
                stroke="#00B8D9"
                strokeWidth={3}
                fill="url(#areaUsers)"
                dot={{ fill: "#00B8D9", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Recent Users Table ── */}
      <motion.div
        className="mt-8 bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <div className="p-6 pb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Users
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02]">
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {stats.recentUsers.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {u.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${u.role === "admin" ? "bg-[#C8FAD6] text-[#118D57] dark:bg-[#00A76F]/15 dark:text-[#5BE49B]" : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Advanced: Top Products + Revenue Trend ── */}
      {advancedStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Top Products */}
          <motion.div
            className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="p-6 pb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Top Products
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                Best sellers by order count
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-white/[0.02]">
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Orders</th>
                    <th className="px-6 py-3 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                  {(advancedStats.topProducts || []).map(
                    (p: any, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                          {i + 1}
                        </td>
                        <td className="px-6 py-3 font-semibold text-gray-900 dark:text-white">
                          {p.name}
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400 text-xs font-bold">
                            {p.count}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">
                          ${(p.revenue || 0).toLocaleString()}
                        </td>
                      </tr>
                    ),
                  )}
                  {(!advancedStats.topProducts ||
                    advancedStats.topProducts.length === 0) && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-400 text-sm"
                      >
                        No product data yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Revenue Trend (12 months) */}
          <motion.div
            className="bg-white dark:bg-[#16161f] rounded-2xl shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none dark:border dark:border-white/[0.06] p-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Revenue Trend
              </h3>
              <p className="text-sm text-gray-400 mt-0.5">
                Monthly revenue over the last 12 months
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={advancedStats.revenueByMonth || []}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="areaRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop
                      offset="100%"
                      stopColor="#7C3AED"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F4F6F8"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#919EAB" }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#919EAB" }}
                  dx={-8}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.96)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    fontSize: "12px",
                    boxShadow:
                      "0 0 2px rgba(145,158,171,0.24), -20px 20px 40px -4px rgba(145,158,171,0.24)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  fill="url(#areaRevenue)"
                  dot={{ fill: "#7C3AED", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── USERS PAGE ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phonenumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [banningId, setBanningId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getAll();
      setUsers(res.data.users || []);
    } catch {
      setMsg({ type: "error", text: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u: UserType) => {
    setEditingId(u._id);
    setEditForm({
      username: u.username,
      email: u.email,
      phonenumber: u.phonenumber || "",
    });
    setMsg(null);
  };

  const handleSave = async (id: string) => {
    try {
      setSaving(true);
      await usersAPI.update(id, editForm);
      setMsg({ type: "success", text: "User updated" });
      setEditingId(null);
      fetchUsers();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersAPI.delete(id);
      setMsg({ type: "success", text: "User deleted" });
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to delete",
      });
    }
  };

  const handleBan = async (id: string) => {
    try {
      setBanningId(id);
      await usersAPI.ban(id);
      setMsg({ type: "success", text: "User banned successfully" });
      fetchUsers();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to ban user",
      });
    } finally {
      setBanningId(null);
    }
  };

  const handleUnban = async (id: string) => {
    try {
      setBanningId(id);
      await usersAPI.unban(id);
      setMsg({ type: "success", text: "User unbanned successfully" });
      fetchUsers();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to unban user",
      });
    } finally {
      setBanningId(null);
    }
  };

  const handleExportEmails = async () => {
    try {
      const res = await adminAPI.getMailingList();
      const data = res.data;
      const rows = [["Username", "Email", "Role", "Banned", "Joined"]];
      (data.users || []).forEach((u: any) =>
        rows.push([
          u.username,
          u.email,
          u.role,
          u.isBanned ? "Yes" : "No",
          u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : "",
        ]),
      );
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mailing-list.csv";
      a.click();
      URL.revokeObjectURL(url);
      setMsg({
        type: "success",
        text: `Exported ${(data.users || []).length} users`,
      });
    } catch {
      setMsg({ type: "error", text: "Failed to export mailing list" });
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all registered users
        </p>
      </div>

      <Msg msg={msg} onClose={() => setMsg(null)} />

      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center gap-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-1">
            <Users className="w-4 h-4 text-primary-500" /> Users (
            {filtered.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary-300 dark:focus:border-primary-500/30 transition-all text-gray-700 dark:text-gray-300"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
            title="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleExportEmails}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-all"
            title="Export Mailing List"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <Empty text="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.04]">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {filtered.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      {editingId === u._id ? (
                        <input
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                          className="w-40 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {u.username}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editingId === u._id ? (
                        <input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="w-48 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                        />
                      ) : (
                        <span className="text-gray-500">{u.email}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editingId === u._id ? (
                        <input
                          value={editForm.phonenumber}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phonenumber: e.target.value,
                            })
                          }
                          className="w-36 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                        />
                      ) : (
                        <span className="text-gray-500">
                          {u.phonenumber || "-"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-4">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === u._id ? (
                          <>
                            <ActionBtn
                              onClick={() => handleSave(u._id)}
                              icon={saving ? undefined : Save}
                              loading={saving}
                              variant="success"
                            />
                            <ActionBtn
                              onClick={() => setEditingId(null)}
                              icon={X}
                            />
                          </>
                        ) : (
                          <>
                            <ActionBtn
                              onClick={() => handleEdit(u)}
                              icon={Edit3}
                            />
                            {u.role !== "admin" &&
                              (u.isBanned ? (
                                <button
                                  onClick={() => handleUnban(u._id)}
                                  disabled={banningId === u._id}
                                  className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                                  title="Unban user"
                                >
                                  {banningId === u._id ? "..." : "Unban"}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBan(u._id)}
                                  disabled={banningId === u._id}
                                  className="px-2 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 text-[10px] font-bold hover:bg-red-200 dark:hover:bg-red-500/25 transition-all disabled:opacity-50"
                                  title="Ban user"
                                >
                                  {banningId === u._id ? "..." : "Ban"}
                                </button>
                              ))}
                            {deleteConfirm === u._id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(u._id)}
                                  className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all"
                                >
                                  Confirm
                                </button>
                                <ActionBtn
                                  onClick={() => setDeleteConfirm(null)}
                                  icon={X}
                                />
                              </div>
                            ) : (
                              <ActionBtn
                                onClick={() => setDeleteConfirm(u._id)}
                                icon={Trash2}
                                variant="danger"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── PRODUCTS PAGE ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const emptyProduct = {
    name: "",
    description: "",
    price: 0,
    category: "game",
    image: "",
    stock: 0,
  };
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getAll();
      setProducts(res.data.products || []);
    } catch {
      setMsg({ type: "error", text: "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.price || !form.category) {
      setMsg({ type: "error", text: "Name, price, and category are required" });
      return;
    }
    try {
      setSaving(true);
      await productsAPI.create({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setMsg({ type: "success", text: "Product created" });
      setShowAdd(false);
      setForm(emptyProduct);
      fetchProducts();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to create",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: ProductType) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      category: p.category,
      image: p.image || "",
      stock: p.stock,
    });
    setMsg(null);
    setShowAdd(false);
  };

  const handleUpdate = async (id: string) => {
    try {
      setSaving(true);
      await productsAPI.update(id, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setMsg({ type: "success", text: "Product updated" });
      setEditingId(null);
      setForm(emptyProduct);
      fetchProducts();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setMsg({ type: "success", text: "Product deleted" });
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to delete",
      });
    }
  };

  const getCatStyle = (cat: string) => {
    switch (cat) {
      case "game":
        return "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400";
      case "software":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
      case "gift-card":
        return "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filtered = products.filter((p) => {
    const s = p.name.toLowerCase().includes(search.toLowerCase());
    const c = !categoryFilter || p.category === categoryFilter;
    return s && c;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Product Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create, edit and manage store products
        </p>
      </div>

      <Msg msg={msg} onClose={() => setMsg(null)} />

      {/* Add / Edit Form */}
      <AnimatePresence>
        {(showAdd || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div
              className={`bg-white dark:bg-[#16161f] rounded-2xl border ${editingId ? "border-primary-300 dark:border-primary-500/30" : "border-gray-200 dark:border-white/[0.06]"} p-6`}
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit3 className="w-4 h-4 text-primary-500" /> Edit Product
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-primary-500" /> Add New
                    Product
                  </>
                )}
              </h3>
              <ProductForm form={form} setForm={setForm} />
              <div className="flex items-center gap-3 mt-5">
                <motion.button
                  onClick={
                    editingId ? () => handleUpdate(editingId) : handleCreate
                  }
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingId ? "Update" : "Create"} Product
                </motion.button>
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setEditingId(null);
                    setForm(emptyProduct);
                  }}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center gap-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-1">
            <Package className="w-4 h-4 text-primary-500" /> Products (
            {filtered.length})
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary-300 dark:focus:border-primary-500/30 transition-all text-gray-700 dark:text-gray-300"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none text-gray-700 dark:text-gray-300 w-36"
            >
              <option value="">All Categories</option>
              <option value="game">Games</option>
              <option value="software">Software</option>
              <option value="gift-card">Gift Cards</option>
            </select>
            <button
              onClick={fetchProducts}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] hover:border-primary-300 transition-all"
            >
              <RefreshCw
                className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            {!showAdd && !editingId && (
              <motion.button
                onClick={() => {
                  setShowAdd(true);
                  setForm(emptyProduct);
                  setMsg(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all"
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="w-4 h-4" /> Add
              </motion.button>
            )}
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <Empty text="No products found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.04]">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {filtered.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <SafeImage
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            fallbackClassName="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0">
                            🎮
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[250px]">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[250px]">
                            {p.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getCatStyle(p.category)}`}
                      >
                        {p.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                        ${p.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-medium ${p.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <ActionBtn onClick={() => handleEdit(p)} icon={Edit3} />
                        {deleteConfirm === p._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all"
                            >
                              Confirm
                            </button>
                            <ActionBtn
                              onClick={() => setDeleteConfirm(null)}
                              icon={X}
                            />
                          </div>
                        ) : (
                          <ActionBtn
                            onClick={() => setDeleteConfirm(p._id)}
                            icon={Trash2}
                            variant="danger"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── IMPORT PAGE ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setMsg(null);
      setResult(null);
      const res = await productsAPI.importCSV(file);
      setResult(res.data);
      setMsg({
        type: "success",
        text: `Import completed! ${res.data.imported || res.data.count || 0} products imported.`,
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Import failed",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          CSV Import
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Bulk import products from CSV files
        </p>
      </div>

      <Msg msg={msg} onClose={() => setMsg(null)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Card */}
        <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary-500" /> Import CSV File
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            Upload a CSV file with columns: name, description, price, category,
            image, stock.
          </p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 dark:border-white/[0.08] rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-500/30 transition-all group"
          >
            <Upload className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3 group-hover:text-primary-400 transition-colors" />
            {file ? (
              <>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Click to select a CSV file
                </p>
                <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex items-center gap-3 mt-5">
            <motion.button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Importing..." : "Import"}
            </motion.button>
            <a
              href={productsAPI.downloadSampleCSV()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-primary-300 transition-all"
            >
              <FileText className="w-4 h-4" /> Sample CSV
            </a>
          </div>
        </div>

        {/* Format Guide */}
        <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-500" /> CSV Format Guide
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Required Columns
              </p>
              <div className="flex flex-wrap gap-2">
                {["name", "price", "category"].map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400 rounded-lg text-xs font-bold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Optional Columns
              </p>
              <div className="flex flex-wrap gap-2">
                {["description", "image", "stock"].map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400 rounded-lg text-xs font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Valid Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {["game", "software", "gift-card"].map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400 rounded-lg text-xs font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-[#0b0b11] rounded-xl p-4 border border-gray-200 dark:border-white/[0.06]">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Example
              </p>
              <code className="text-xs text-gray-600 dark:text-gray-400 font-mono leading-relaxed block">
                name,description,price,category,image,stock
                <br />
                Elden Ring,Fantasy RPG,39.99,game,,175
                <br />
                NordVPN,2-Year Plan,89.99,software,,200
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Import Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-6"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-500" /> Import Results
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Imported",
                value: result.imported || result.count || 0,
                color: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Skipped",
                value: result.skipped || 0,
                color: "text-amber-600 dark:text-amber-400",
              },
              {
                label: "Errors",
                value: result.errors?.length || 0,
                color: "text-red-600 dark:text-red-400",
              },
              {
                label: "Total Rows",
                value:
                  (result.imported || 0) +
                  (result.skipped || 0) +
                  (result.errors?.length || 0),
                color: "text-gray-600 dark:text-gray-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 dark:bg-[#0b0b11] border border-gray-200 dark:border-white/[0.06] rounded-xl p-4 text-center"
              >
                <p className={`text-2xl font-extrabold ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          {result.errors?.length > 0 && (
            <div className="mt-4 bg-red-50 dark:bg-red-500/10 rounded-xl p-4 border border-red-200 dark:border-red-500/20">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
                Errors:
              </p>
              <ul className="text-xs text-red-500 space-y-1 max-h-32 overflow-y-auto">
                {result.errors.map((err: any, i: number) => (
                  <li key={i}>
                    Row {err.row || i + 1}: {err.message || JSON.stringify(err)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// ─── Shared Components ────────────────────────────────────
// ═══════════════════════════════════════════════════════════

function ProductForm({
  form,
  setForm,
}: {
  form: {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      price: number;
      category: string;
      image: string;
      stock: number;
    }>
  >;
}) {
  const inputClass =
    "w-full px-3 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary-300 dark:focus:border-primary-500/30 transition-all text-gray-700 dark:text-gray-300";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="Product name"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Category *
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={inputClass}
        >
          <option value="game">Game</option>
          <option value="software">Software</option>
          <option value="gift-card">Gift Card</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Price *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseFloat(e.target.value) || 0 })
          }
          className={inputClass}
          placeholder="0.00"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Stock
        </label>
        <input
          type="number"
          min="0"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: parseInt(e.target.value) || 0 })
          }
          className={inputClass}
          placeholder="0"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Image URL
        </label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className={inputClass}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} min-h-[80px] resize-y`}
          placeholder="Product description..."
          rows={3}
        />
      </div>
    </div>
  );
}

function Msg({
  msg,
  onClose,
}: {
  msg: { type: "success" | "error"; text: string } | null;
  onClose: () => void;
}) {
  if (!msg) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${msg.type === "success" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border border-red-200 dark:border-red-500/30"}`}
    >
      {msg.type === "success" ? (
        <Check className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}{" "}
      {msg.text}
      <button onClick={onClose} className="ml-auto">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function Spinner() {
  return (
    <div className="p-10 text-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-gray-500 text-sm">{text}</div>;
}
function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${role === "admin" ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400"}`}
    >
      {role}
    </span>
  );
}

function ActionBtn({
  onClick,
  icon: Icon,
  variant,
  loading: isLoading,
}: {
  onClick: () => void;
  icon?: React.ElementType;
  variant?: "success" | "danger";
  loading?: boolean;
}) {
  const base = "p-1.5 rounded-lg transition-all ";
  const v =
    variant === "success"
      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 hover:bg-emerald-200"
      : variant === "danger"
        ? "bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400"
        : "bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.08]";
  return (
    <button onClick={onClick} className={base + v}>
      {isLoading ? (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5" />
      ) : null}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   LOYALTY ADMIN PAGE
   ════════════════════════════════════════════════════════════ */

function LoyaltyAdminPage() {
  const [tab, setTab] = useState<
    "overview" | "rewards" | "quests" | "packs" | "config"
  >("overview");
  const [stats, setStats] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [quests, setQuests] = useState<any[]>([]);
  const [packs, setPacks] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [grantForm, setGrantForm] = useState({
    userId: "",
    amount: 0,
    reason: "",
  });
  const [granting, setGranting] = useState(false);

  // Reward form
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [rewardForm, setRewardForm] = useState({
    name: "",
    description: "",
    type: "coupon",
    pointsCost: 100,
    discountPercent: 0,
    discountAmount: 0,
    stock: -1,
    tierRequired: "free",
    isActive: true,
  });

  // Quest form
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<any>(null);
  const [questForm, setQuestForm] = useState({
    title: "",
    description: "",
    type: "custom",
    rewardPoints: 50,
    featureFlag: "",
    isActive: true,
  });

  const cardClass =
    "bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]";
  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all";
  const btnPrimary =
    "px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-all";
  const btnSecondary =
    "px-4 py-2 bg-gray-100 dark:bg-white/[0.06] text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all";

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [statsRes, rewardsRes, questsRes, packsRes, configsRes] =
        await Promise.all([
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
    } catch {
      /* ignore */
    }
    setLoading(false);
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await loyaltyAPI.adminSeed();
      setMsg({ type: "success", text: "Default data seeded successfully!" });
      loadAll();
    } catch {
      setMsg({ type: "error", text: "Failed to seed defaults." });
    }
    setSeeding(false);
  }

  async function handleGrant() {
    if (!grantForm.userId || grantForm.amount <= 0)
      return setMsg({ type: "error", text: "User ID and amount required." });
    setGranting(true);
    try {
      await loyaltyAPI.adminGrantPoints(
        grantForm.userId,
        grantForm.amount,
        grantForm.reason,
      );
      setMsg({ type: "success", text: `Granted ${grantForm.amount} points!` });
      setGrantForm({ userId: "", amount: 0, reason: "" });
      loadAll();
    } catch {
      setMsg({ type: "error", text: "Failed to grant points." });
    }
    setGranting(false);
  }

  // Reward CRUD
  async function saveReward() {
    try {
      if (editingReward) {
        await loyaltyAPI.adminUpdateReward(editingReward._id, rewardForm);
        setMsg({ type: "success", text: "Reward updated!" });
      } else {
        await loyaltyAPI.adminCreateReward(rewardForm);
        setMsg({ type: "success", text: "Reward created!" });
      }
      setShowRewardForm(false);
      setEditingReward(null);
      setRewardForm({
        name: "",
        description: "",
        type: "coupon",
        pointsCost: 100,
        discountPercent: 0,
        discountAmount: 0,
        stock: -1,
        tierRequired: "free",
        isActive: true,
      });
      loadAll();
    } catch {
      setMsg({ type: "error", text: "Failed to save reward." });
    }
  }

  async function deleteReward(id: string) {
    if (!confirm("Delete this reward?")) return;
    try {
      await loyaltyAPI.adminDeleteReward(id);
      setMsg({ type: "success", text: "Reward deleted." });
      loadAll();
    } catch {
      setMsg({ type: "error", text: "Failed to delete." });
    }
  }

  function startEditReward(r: any) {
    setEditingReward(r);
    setRewardForm({
      name: r.name,
      description: r.description || "",
      type: r.type,
      pointsCost: r.pointsCost,
      discountPercent: r.discountPercent || 0,
      discountAmount: r.discountAmount || 0,
      stock: r.stock,
      tierRequired: r.tierRequired || "free",
      isActive: r.isActive,
    });
    setShowRewardForm(true);
  }

  // Quest CRUD
  async function saveQuest() {
    try {
      if (editingQuest) {
        await loyaltyAPI.adminUpdateQuest(editingQuest._id, questForm);
        setMsg({ type: "success", text: "Quest updated!" });
      } else {
        await loyaltyAPI.adminCreateQuest(questForm);
        setMsg({ type: "success", text: "Quest created!" });
      }
      setShowQuestForm(false);
      setEditingQuest(null);
      setQuestForm({
        title: "",
        description: "",
        type: "custom",
        rewardPoints: 50,
        featureFlag: "",
        isActive: true,
      });
      loadAll();
    } catch {
      setMsg({ type: "error", text: "Failed to save quest." });
    }
  }

  async function deleteQuest(id: string) {
    if (!confirm("Deactivate this quest?")) return;
    try {
      await loyaltyAPI.adminUpdateQuest(id, { isActive: false });
      setMsg({ type: "success", text: "Quest deactivated." });
      loadAll();
    } catch {
      setMsg({ type: "error", text: "Failed to delete." });
    }
  }

  function startEditQuest(q: any) {
    setEditingQuest(q);
    setQuestForm({
      title: q.title,
      description: q.description || "",
      type: q.type,
      rewardPoints: q.rewardPoints,
      featureFlag: q.featureFlag || "",
      isActive: q.isActive,
    });
    setShowQuestForm(true);
  }

  // Config update
  async function updateConfig(key: string, value: string) {
    try {
      await loyaltyAPI.adminSetConfig(key, value);
      setMsg({ type: "success", text: `Config "${key}" updated.` });
      loadAll();
    } catch {
      setMsg({ type: "error", text: "Failed to update config." });
    }
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

      {/* Tab bar */}
      <div className={`${cardClass} p-1.5 flex gap-1 overflow-x-auto`}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab === t.key ? "bg-primary-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06]"}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Seed + Grant row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`${cardClass} p-5`}>
              <h3 className="text-sm font-semibold mb-3">Seed Default Data</h3>
              <p className="text-xs text-gray-500 mb-3">
                Creates default rewards, quests, packs, memberships, and config
                if they don&apos;t exist.
              </p>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className={btnPrimary}
              >
                {seeding ? "Seeding..." : "Seed Defaults"}
              </button>
            </div>
            <div className={`${cardClass} p-5`}>
              <h3 className="text-sm font-semibold mb-3">Grant Points</h3>
              <div className="flex gap-2 flex-wrap">
                <input
                  placeholder="User ID"
                  value={grantForm.userId}
                  onChange={(e) =>
                    setGrantForm({ ...grantForm, userId: e.target.value })
                  }
                  className={`${inputClass} flex-1 min-w-[120px]`}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  min={1}
                  value={grantForm.amount || ""}
                  onChange={(e) =>
                    setGrantForm({
                      ...grantForm,
                      amount: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`${inputClass} w-24`}
                />
                <input
                  placeholder="Reason"
                  value={grantForm.reason}
                  onChange={(e) =>
                    setGrantForm({ ...grantForm, reason: e.target.value })
                  }
                  className={`${inputClass} flex-1 min-w-[100px]`}
                />
                <button
                  onClick={handleGrant}
                  disabled={granting}
                  className={btnPrimary}
                >
                  {granting ? "..." : "Grant"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Users",
                  value: stats.totalUsers || 0,
                  color: "text-primary-600",
                },
                {
                  label: "Points in Circulation",
                  value: (stats.totalPointsInCirculation || 0).toLocaleString(),
                  color: "text-amber-600",
                },
                {
                  label: "Total Transactions",
                  value: stats.totalTransactions || 0,
                  color: "text-emerald-600",
                },
                {
                  label: "Total Redemptions",
                  value: stats.totalRedemptions || 0,
                  color: "text-purple-600",
                },
              ].map((s, i) => (
                <div key={i} className={`${cardClass} p-5`}>
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quick counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Rewards", value: rewards.length, icon: Gift },
              { label: "Quests", value: quests.length, icon: FileText },
              { label: "Packs", value: packs.length, icon: Package },
              { label: "Configs", value: configs.length, icon: Shield },
            ].map((s, i) => (
              <div
                key={i}
                className={`${cardClass} p-4 flex items-center gap-3`}
              >
                <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/[0.06]">
                  <s.icon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── REWARDS TAB ─── */}
      {tab === "rewards" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Rewards</h3>
            <button
              onClick={() => {
                setEditingReward(null);
                setRewardForm({
                  name: "",
                  description: "",
                  type: "coupon",
                  pointsCost: 100,
                  discountPercent: 0,
                  discountAmount: 0,
                  stock: -1,
                  tierRequired: "free",
                  isActive: true,
                });
                setShowRewardForm(true);
              }}
              className={btnPrimary}
            >
              <span className="flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Reward
              </span>
            </button>
          </div>

          {showRewardForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardClass} p-5 space-y-3`}
            >
              <h4 className="font-semibold text-sm">
                {editingReward ? "Edit Reward" : "New Reward"}
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  placeholder="Name"
                  value={rewardForm.name}
                  onChange={(e) =>
                    setRewardForm({ ...rewardForm, name: e.target.value })
                  }
                  className={inputClass}
                />
                <select
                  value={rewardForm.type}
                  onChange={(e) =>
                    setRewardForm({ ...rewardForm, type: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="coupon">Coupon</option>
                  <option value="gift_card">Gift Card</option>
                  <option value="product">Product</option>
                  <option value="points_boost">Points Boost</option>
                </select>
                <input
                  type="number"
                  placeholder="Points Cost"
                  value={rewardForm.pointsCost}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      pointsCost: parseInt(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={rewardForm.discountPercent}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      discountPercent: parseInt(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Discount Amount"
                  value={rewardForm.discountAmount}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      discountAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Stock (-1 = unlimited)"
                  value={rewardForm.stock}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className={inputClass}
                />
                <select
                  value={rewardForm.tierRequired}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      tierRequired: e.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option value="free">Free tier</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={rewardForm.description}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      description: e.target.value,
                    })
                  }
                  className={`${inputClass} min-h-[60px]`}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rewardForm.isActive}
                  onChange={(e) =>
                    setRewardForm({ ...rewardForm, isActive: e.target.checked })
                  }
                />{" "}
                Active
              </label>
              <div className="flex gap-2">
                <button onClick={saveReward} className={btnPrimary}>
                  {editingReward ? "Update" : "Create"}
                </button>
                <button
                  onClick={() => {
                    setShowRewardForm(false);
                    setEditingReward(null);
                  }}
                  className={btnSecondary}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          <div className={`${cardClass} overflow-hidden`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06] text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rewards.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <Empty text="No rewards yet. Seed defaults or create one." />
                    </td>
                  </tr>
                ) : (
                  rewards.map((r: any) => (
                    <tr
                      key={r._id}
                      className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-medium">{r.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-gray-100 dark:bg-white/[0.06]">
                          {r.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-amber-600 font-bold">
                        {r.pointsCost}
                      </td>
                      <td className="px-4 py-3">
                        {r.stock === -1 ? "∞" : r.stock}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {r.tierRequired || "free"}
                      </td>
                      <td className="px-4 py-3">
                        {r.isActive ? (
                          <span className="text-emerald-500">●</span>
                        ) : (
                          <span className="text-gray-300">●</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right flex gap-1 justify-end">
                        <ActionBtn
                          onClick={() => startEditReward(r)}
                          icon={Edit3}
                        />
                        <ActionBtn
                          onClick={() => deleteReward(r._id)}
                          icon={Trash2}
                          variant="danger"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── QUESTS TAB ─── */}
      {tab === "quests" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Quests</h3>
            <button
              onClick={() => {
                setEditingQuest(null);
                setQuestForm({
                  title: "",
                  description: "",
                  type: "custom",
                  rewardPoints: 50,
                  featureFlag: "",
                  isActive: true,
                });
                setShowQuestForm(true);
              }}
              className={btnPrimary}
            >
              <span className="flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Quest
              </span>
            </button>
          </div>

          {showQuestForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${cardClass} p-5 space-y-3`}
            >
              <h4 className="font-semibold text-sm">
                {editingQuest ? "Edit Quest" : "New Quest"}
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  placeholder="Title"
                  value={questForm.title}
                  onChange={(e) =>
                    setQuestForm({ ...questForm, title: e.target.value })
                  }
                  className={inputClass}
                />
                <select
                  value={questForm.type}
                  onChange={(e) =>
                    setQuestForm({ ...questForm, type: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="social_follow">Social Follow</option>
                  <option value="share_product">Share Product</option>
                  <option value="write_review">Write Review</option>
                  <option value="complete_profile">Complete Profile</option>
                  <option value="first_purchase">First Purchase</option>
                  <option value="streak_login">Streak Login</option>
                  <option value="custom">Custom</option>
                </select>
                <input
                  type="number"
                  placeholder="Reward Points"
                  value={questForm.rewardPoints}
                  onChange={(e) =>
                    setQuestForm({
                      ...questForm,
                      rewardPoints: parseInt(e.target.value) || 0,
                    })
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Feature Flag (optional)"
                  value={questForm.featureFlag}
                  onChange={(e) =>
                    setQuestForm({ ...questForm, featureFlag: e.target.value })
                  }
                  className={inputClass}
                />
                <textarea
                  placeholder="Description"
                  value={questForm.description}
                  onChange={(e) =>
                    setQuestForm({ ...questForm, description: e.target.value })
                  }
                  className={`${inputClass} md:col-span-2 min-h-[60px]`}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={questForm.isActive}
                  onChange={(e) =>
                    setQuestForm({ ...questForm, isActive: e.target.checked })
                  }
                />{" "}
                Active
              </label>
              <div className="flex gap-2">
                <button onClick={saveQuest} className={btnPrimary}>
                  {editingQuest ? "Update" : "Create"}
                </button>
                <button
                  onClick={() => {
                    setShowQuestForm(false);
                    setEditingQuest(null);
                  }}
                  className={btnSecondary}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          <div className={`${cardClass} overflow-hidden`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06] text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Points</th>
                  <th className="px-4 py-3">Flag</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quests.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <Empty text="No quests yet." />
                    </td>
                  </tr>
                ) : (
                  quests.map((q: any) => (
                    <tr
                      key={q._id}
                      className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-medium">{q.title}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-gray-100 dark:bg-white/[0.06]">
                          {q.type?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-amber-600 font-bold">
                        {q.rewardPoints}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {q.featureFlag || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {q.isActive ? (
                          <span className="text-emerald-500">●</span>
                        ) : (
                          <span className="text-gray-300">●</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right flex gap-1 justify-end">
                        <ActionBtn
                          onClick={() => startEditQuest(q)}
                          icon={Edit3}
                        />
                        <ActionBtn
                          onClick={() => deleteQuest(q._id)}
                          icon={Trash2}
                          variant="danger"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── PACKS TAB ─── */}
      {tab === "packs" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Packs</h3>
          <div className={`${cardClass} overflow-hidden`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06] text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Drops</th>
                  <th className="px-4 py-3">Active</th>
                </tr>
              </thead>
              <tbody>
                {packs.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <Empty text="No packs. Seed defaults to create starter packs." />
                    </td>
                  </tr>
                ) : (
                  packs.map((p: any) => (
                    <tr
                      key={p._id}
                      className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-amber-600 font-bold">
                        {p.pointsCost}
                      </td>
                      <td className="px-4 py-3">
                        {p.drops?.length || 0} items
                      </td>
                      <td className="px-4 py-3">
                        {p.isActive ? (
                          <span className="text-emerald-500">●</span>
                        ) : (
                          <span className="text-gray-300">●</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400">
            Pack management (create/edit drops) coming soon. Use &quot;Seed
            Defaults&quot; in Overview to create starter packs.
          </p>
        </div>
      )}

      {/* ─── CONFIG TAB ─── */}
      {tab === "config" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Loyalty Configuration</h3>
          {configs.length === 0 ? (
            <div className={`${cardClass} p-5 text-center`}>
              <p className="text-sm text-gray-500 mb-3">
                No config found. Seed defaults first.
              </p>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className={btnPrimary}
              >
                {seeding ? "Seeding..." : "Seed Defaults"}
              </button>
            </div>
          ) : (
            <div
              className={`${cardClass} divide-y divide-gray-100 dark:divide-white/[0.06]`}
            >
              {configs.map((c: any) => (
                <ConfigRow
                  key={c._id}
                  config={c}
                  onSave={updateConfig}
                  inputClass={inputClass}
                  btnPrimary={btnPrimary}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ORDERS ADMIN PAGE
   ════════════════════════════════════════════════════════════ */

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderForm, setEditOrderForm] = useState<{
    items: { name: string; quantity: number; price: number }[];
    totalPrice: number;
    status: string;
    paymentStatus: string;
  }>({ items: [], totalPrice: 0, status: "", paymentStatus: "" });

  const cardClass =
    "bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await ordersAPI.getAllOrders();
      setOrders(res.data.orders || []);
    } catch {
      setMsg({ type: "error", text: "Failed to load orders" });
    }
    setLoading(false);
  }

  async function handleStatusChange(
    orderId: string,
    status: string,
    paymentStatus?: string,
  ) {
    setUpdatingId(orderId);
    try {
      await ordersAPI.updateStatus(orderId, status, paymentStatus);
      setMsg({ type: "success", text: `Order updated to ${status}` });
      loadOrders();
    } catch {
      setMsg({ type: "error", text: "Failed to update order" });
    }
    setUpdatingId(null);
  }

  function startEditOrder(order: any) {
    setEditingOrderId(order._id);
    setExpandedOrder(order._id);
    setEditOrderForm({
      items: order.items.map((it: any) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price,
      })),
      totalPrice: order.totalPrice,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  }

  function updateEditItem(idx: number, field: string, value: string | number) {
    const newItems = [...editOrderForm.items];
    newItems[idx] = {
      ...newItems[idx],
      [field]: field === "name" ? value : Number(value),
    };
    const newTotal = newItems.reduce((s, it) => s + it.price * it.quantity, 0);
    setEditOrderForm({
      ...editOrderForm,
      items: newItems,
      totalPrice: Math.round(newTotal * 100) / 100,
    });
  }

  async function handleOverride() {
    if (!editingOrderId) return;
    setUpdatingId(editingOrderId);
    try {
      await ordersAPI.overrideOrder(editingOrderId, editOrderForm);
      setMsg({ type: "success", text: "Order overridden successfully" });
      setEditingOrderId(null);
      loadOrders();
    } catch {
      setMsg({ type: "error", text: "Failed to override order" });
    }
    setUpdatingId(null);
  }

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const username = o.userId?.username?.toLowerCase() || "";
      const email = o.userId?.email?.toLowerCase() || "";
      const id = o._id?.toLowerCase() || "";
      if (!username.includes(q) && !email.includes(q) && !id.includes(q))
        return false;
    }
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    failed: orders.filter((o) => o.status === "failed").length,
    revenue: orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
  };

  const statusColor: Record<string, string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    completed:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  };

  if (loading) return <Spinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <Msg msg={msg} onClose={() => setMsg(null)} />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.total,
            icon: ShoppingBag,
            color: "text-primary-600",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-600",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: Check,
            color: "text-emerald-600",
          },
          {
            label: "Failed",
            value: stats.failed,
            icon: X,
            color: "text-red-500",
          },
          {
            label: "Revenue",
            value: `$${stats.revenue.toFixed(2)}`,
            icon: Coins,
            color: "text-primary-600",
          },
        ].map((s, i) => (
          <div key={i} className={`${cardClass} p-4 flex items-center gap-3`}>
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/[0.06]">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`${cardClass} p-4 flex flex-wrap items-center gap-3`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, email, or order ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "pending", "completed", "failed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]"
              }`}
            >
              {f === "all" ? `All (${stats.total})` : `${f} (${stats[f]})`}
            </button>
          ))}
        </div>
        <button
          onClick={loadOrders}
          className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <Empty text="No orders found" />
      ) : (
        <div className="space-y-3">
          {filtered.map((order: any) => {
            const isExpanded = expandedOrder === order._id;
            const isUpdating = updatingId === order._id;
            return (
              <div
                key={order._id}
                className={`${cardClass} overflow-hidden transition-all`}
              >
                {/* Order header row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-all"
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order._id)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400 truncate">
                        #{order._id.slice(-8)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${statusColor[order.status] || ""}`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${statusColor[order.paymentStatus] || "bg-gray-100 dark:bg-white/[0.06] text-gray-500"}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.userId?.username || "Unknown user"}{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        {order.userId?.email}
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gradient">
                      ${order.totalPrice?.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {order.totalItems} items &middot;{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 dark:border-white/[0.06] p-4 space-y-4">
                        {editingOrderId === order._id ? (
                          /* ── EDIT MODE ── */
                          <>
                            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <Edit3 className="w-3 h-3" /> Editing Order
                            </p>
                            <div className="space-y-2">
                              {editOrderForm.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-white/[0.02]"
                                >
                                  <input
                                    value={item.name}
                                    onChange={(e) =>
                                      updateEditItem(
                                        idx,
                                        "name",
                                        e.target.value,
                                      )
                                    }
                                    className="flex-1 px-2 py-1 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                                    placeholder="Name"
                                  />
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateEditItem(
                                        idx,
                                        "quantity",
                                        e.target.value,
                                      )
                                    }
                                    className="w-16 px-2 py-1 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm text-center focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                                    placeholder="Qty"
                                    min={1}
                                  />
                                  <span className="text-gray-400 text-xs">
                                    ×
                                  </span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(e) =>
                                      updateEditItem(
                                        idx,
                                        "price",
                                        e.target.value,
                                      )
                                    }
                                    className="w-24 px-2 py-1 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm text-center focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                                    placeholder="Price"
                                    min={0}
                                  />
                                  <span className="text-sm font-semibold text-gray-500 w-20 text-right">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div>
                                <label className="text-[10px] text-gray-500 uppercase block mb-1">
                                  Status
                                </label>
                                <select
                                  value={editOrderForm.status}
                                  onChange={(e) =>
                                    setEditOrderForm({
                                      ...editOrderForm,
                                      status: e.target.value,
                                    })
                                  }
                                  className="px-3 py-1.5 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                  <option value="failed">Failed</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-500 uppercase block mb-1">
                                  Payment
                                </label>
                                <select
                                  value={editOrderForm.paymentStatus}
                                  onChange={(e) =>
                                    setEditOrderForm({
                                      ...editOrderForm,
                                      paymentStatus: e.target.value,
                                    })
                                  }
                                  className="px-3 py-1.5 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm focus:outline-none focus:border-primary-300 text-gray-700 dark:text-gray-300"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="paid">Paid</option>
                                  <option value="failed">Failed</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-500 uppercase block mb-1">
                                  Total
                                </label>
                                <p className="text-lg font-bold text-gradient">
                                  ${editOrderForm.totalPrice.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOverride();
                                }}
                                disabled={isUpdating}
                                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center gap-1"
                              >
                                {isUpdating ? (
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Save className="w-3 h-3" />
                                )}{" "}
                                Save Override
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingOrderId(null);
                                }}
                                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400 hover:bg-gray-200 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          /* ── VIEW MODE ── */
                          <>
                            {/* Items table */}
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Items
                              </p>
                              <div className="space-y-2">
                                {order.items.map((item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-white/[0.02]"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/[0.04] overflow-hidden flex-shrink-0 flex items-center justify-center">
                                      {item.productId?.image ? (
                                        <SafeImage
                                          src={item.productId.image}
                                          alt=""
                                          className="w-full h-full object-cover"
                                          fallbackClassName="w-full h-full flex items-center justify-center"
                                          fallback={
                                            <Package className="w-4 h-4 text-gray-300" />
                                          }
                                        />
                                      ) : (
                                        <Package className="w-4 h-4 text-gray-300" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.name}
                                      </p>
                                      <p className="text-[10px] text-gray-400">
                                        {item.category || "N/A"} &middot; Qty:{" "}
                                        {item.quantity}
                                      </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/[0.06]">
                              <p className="text-xs text-gray-500 mr-auto">
                                Created{" "}
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditOrder(order);
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-500/25 transition-all flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              {order.status === "pending" && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(
                                        order._id,
                                        "completed",
                                        "paid",
                                      );
                                    }}
                                    disabled={isUpdating}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                                  >
                                    {isUpdating
                                      ? "..."
                                      : "✓ Complete & Mark Paid"}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(
                                        order._id,
                                        "failed",
                                        "failed",
                                      );
                                    }}
                                    disabled={isUpdating}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/25 transition-all disabled:opacity-50"
                                  >
                                    {isUpdating ? "..." : "✗ Reject"}
                                  </button>
                                </>
                              )}
                              {order.status === "completed" && (
                                <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Order Fulfilled
                                </span>
                              )}
                              {order.status === "failed" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(
                                      order._id,
                                      "pending",
                                      "pending",
                                    );
                                  }}
                                  disabled={isUpdating}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400 hover:bg-gray-200 transition-all disabled:opacity-50"
                                >
                                  Reopen as Pending
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function ConfigRow({
  config,
  onSave,
  inputClass,
  btnPrimary,
}: {
  config: any;
  onSave: (key: string, value: string) => void;
  inputClass: string;
  btnPrimary: string;
}) {
  const [value, setValue] = useState(config.value?.toString() || "");
  const [dirty, setDirty] = useState(false);
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex-1">
        <p className="text-sm font-semibold">{config.key}</p>
        <p className="text-xs text-gray-400">
          {config.description || "No description"}
        </p>
      </div>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setDirty(true);
        }}
        className={`${inputClass} w-32 text-center`}
      />
      {dirty && (
        <button
          onClick={() => {
            onSave(config.key, value);
            setDirty(false);
          }}
          className={btnPrimary}
        >
          Save
        </button>
      )}
    </div>
  );
}
