"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  SealCheck as BadgeCheck,
  ChartBar as BarChart3,
  Check,
  CaretRight as ChevronRight,
  Clock,
  CreditCard,
  PencilSimple as Edit3,
  Eye,
  EyeSlash as EyeOff,
  GameController as Gamepad2,
  Lock,
  Envelope as Mail,
  Package,
  Phone,
  Receipt,
  Save,
  Gear as Settings,
  Shield,
  ShoppingCart,
  Sparkle as Sparkles,
  Upload,
  User,
  Users,
  X,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { ordersAPI, resolveMediaUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import FloatingOrb from "@/components/FloatingOrb";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import SafeImage from "@/components/SafeImage";

interface OrderItem {
  productId:
    | { _id: string; name: string; price: number; imageUrl?: string }
    | string;
  quantity: number;
  price: number;
  name: string;
  category?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, updateProfile, uploadProfileImage, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "settings"
  >("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const isAdmin = user?.role === "admin";
  const avatarSrc = avatarPreview || resolveMediaUrl(user?.profileImage);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getUserOrders();
        const data = res.data;
        setOrders(data.orders ? data.orders : Array.isArray(data) ? data : []);
      } catch {
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === "completed").length,
    [orders],
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders],
  );

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
    [orders],
  );

  const totalItemsPurchased = useMemo(
    () =>
      orders.reduce(
        (sum, order) => sum + (order.totalItems || order.items?.length || 0),
        0,
      ),
    [orders],
  );

  const lastOrderDate = useMemo(() => {
    if (orders.length === 0) return "No orders yet";
    const latest = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    return new Date(latest.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [orders]);

  const accountCompletion = useMemo(() => {
    const fields = [user?.username, user?.email, user?.phonenumber];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
    }
  };

  const handleSaveProfile = async () => {
    const hasProfileChanges =
      formData.username !== (user?.username || "") ||
      formData.email !== (user?.email || "") ||
      formData.phonenumber !== (user?.phonenumber || "");

    if (!hasProfileChanges && !avatarFile) {
      setProfileMsg({ type: "error", text: "No changes to save" });
      return;
    }

    try {
      setSaving(true);
      setProfileMsg(null);
      if (hasProfileChanges) {
        await updateProfile({
          username: formData.username,
          email: formData.email,
          phonenumber: formData.phonenumber,
        });
      }
      if (avatarFile) {
        setUploadingAvatar(true);
        await uploadProfileImage(avatarFile);
        setAvatarFile(null);
        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview("");
      }
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err: any) {
      setProfileMsg({
        type: "error",
        text: err.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
      setUploadingAvatar(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMsg({
        type: "error",
        text: "Please choose a valid image file",
      });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setProfileMsg({
        type: "error",
        text: "Profile image must be 3MB or smaller",
      });
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setProfileMsg(null);
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setProfileMsg({ type: "error", text: "New passwords do not match" });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setProfileMsg({
          type: "error",
          text: "New password must be at least 6 characters",
        });
        return;
      }

      setSaving(true);
      setProfileMsg(null);
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setProfileMsg({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangingPassword(false);
    } catch (err: any) {
      setProfileMsg({
        type: "error",
        text: err.message || "Failed to change password",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileMsg(null);
    setAvatarFile(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview("");
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phonenumber: user?.phonenumber || "",
    });
  };

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: User },
    { key: "orders" as const, label: "Orders", icon: Package },
    { key: "settings" as const, label: "Settings", icon: Settings },
  ];

  const statCards = [
    {
      label: "Total Orders",
      value: orders.length.toString(),
      meta: "Orders placed through GamePlug",
      icon: ShoppingCart,
      surface: "from-primary-600 to-accent-500",
    },
    {
      label: "Completed",
      value: completedOrders.toString(),
      meta: "Successfully delivered orders",
      icon: BadgeCheck,
      surface: "from-emerald-500 to-teal-500",
    },
    {
      label: "Items Bought",
      value: totalItemsPurchased.toString(),
      meta: "Games, keys, and digital goods",
      icon: Gamepad2,
      surface: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      meta: "Lifetime spend on this account",
      icon: CreditCard,
      surface: "from-amber-500 to-orange-500",
    },
  ];

  const adminActions = [
    {
      icon: Users,
      label: "Manage Users",
      desc: "Review account activity and access controls.",
      path: "/dashboard",
      color: "from-primary-600 to-accent-500",
    },
    {
      icon: Package,
      label: "Manage Products",
      desc: "Update inventory, pricing, and featured titles.",
      path: "/dashboard",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Upload,
      label: "Import Catalog",
      desc: "Bulk upload new products with CSV import tools.",
      path: "/dashboard",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingScreen />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b11] relative overflow-hidden">
        <Navbar />

        <FloatingOrb className="w-96 h-96 bg-primary-500/12 -top-28 -left-24" />
        <FloatingOrb
          className="w-80 h-80 bg-accent-500/10 top-64 -right-16"
          delay={2}
        />
        <FloatingOrb
          className="w-72 h-72 bg-cyan-500/10 bottom-10 left-1/3"
          delay={4}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#11111a] shadow-[0_0_2px_0_rgba(145,158,171,0.22),0_24px_48px_-12px_rgba(145,158,171,0.16)] dark:shadow-none p-6 sm:p-8 lg:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.12),transparent_28%)]" />

            <div className="relative flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
                <div className="flex flex-col items-start gap-3 flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.75rem] overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 flex items-center justify-center text-4xl font-black text-white shadow-[0_20px_45px_-18px_rgba(139,92,246,0.55)]">
                    {avatarSrc ? (
                      <SafeImage
                        src={avatarSrc}
                        alt={user?.username || "Profile picture"}
                        className="w-full h-full object-cover"
                        fallback={
                          <span>
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        }
                      />
                    ) : (
                      user?.username?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <label className="relative inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/85 px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-primary-300 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-gray-200 dark:hover:border-primary-500/30 cursor-pointer">
                    {uploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-primary-500" />
                    )}
                    <span>{avatarFile ? "Image ready" : "Change photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/12 dark:text-primary-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Account Hub
                    </span>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                        <Shield className="w-3.5 h-3.5" />
                        Admin Access
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                    {user?.username || "Player"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-500 dark:text-white/70 leading-relaxed">
                    Manage your GamePlug identity, track your purchase history,
                    and keep your account settings ready for the next launch.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-white/65">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-white/[0.04] dark:border dark:border-white/[0.06]">
                      <Mail className="w-3.5 h-3.5 text-primary-500" />
                      {user?.email || "No email"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-white/[0.04] dark:border dark:border-white/[0.06]">
                      <Phone className="w-3.5 h-3.5 text-primary-500" />
                      {user?.phonenumber || "Phone not added"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-white/[0.04] dark:border dark:border-white/[0.06] capitalize">
                      <Shield className="w-3.5 h-3.5 text-primary-500" />
                      {user?.role || "user"}
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-[260px] rounded-2xl border border-gray-200 bg-gray-50/90 p-5 dark:border-white/[0.06] dark:bg-white/[0.03] backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-gray-400">
                      Profile readiness
                    </p>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {accountCompletion}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-600 to-accent-500"
                      style={{ width: `${accountCompletion}%` }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-1 min-[420px]:grid-cols-3 lg:grid-cols-1 gap-3 text-sm text-gray-500 dark:text-white/70">
                    <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-3 dark:border-white/[0.06] dark:bg-[#101018]">
                      <div className="flex items-center justify-between gap-4">
                        <span>Last order</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-right">
                          {lastOrderDate}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-3 dark:border-white/[0.06] dark:bg-[#101018]">
                      <div className="flex items-center justify-between gap-4">
                        <span>Pending orders</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {pendingOrders}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-3 dark:border-white/[0.06] dark:bg-[#101018]">
                      <div className="flex items-center justify-between gap-4">
                        <span>Total spent</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${totalSpent.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border border-gray-200 bg-white/85 p-4 sm:p-5 dark:border-white/[0.06] dark:bg-white/[0.03] backdrop-blur-xl"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.4 }}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.surface} text-white flex items-center justify-center shadow-glow-sm mb-4`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-gray-400 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-white/65 leading-relaxed">
                      {stat.meta}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {isAdmin && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                    Control Center
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Admin shortcuts
                  </h2>
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-gray-900"
                >
                  Open dashboard
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {adminActions.map((item, idx) => (
                  <motion.button
                    key={item.label}
                    onClick={() => router.push(item.path)}
                    className="group rounded-2xl border border-gray-200 bg-white/90 p-5 text-left dark:border-white/[0.06] dark:bg-[#16161f] shadow-[0_0_2px_0_rgba(145,158,171,0.18),0_16px_30px_-12px_rgba(145,158,171,0.18)] dark:shadow-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-4 shadow-glow-sm`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        {item.label}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-white/65 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex gap-1 rounded-2xl border border-gray-200 bg-white/90 p-1.5 dark:border-white/[0.06] dark:bg-[#16161f] shadow-[0_0_2px_0_rgba(145,158,171,0.18),0_12px_24px_-12px_rgba(145,158,171,0.18)] dark:shadow-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold flex-1 justify-center transition-all ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-glow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6"
              >
                <div className="card p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                        Overview
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Account snapshot
                      </h3>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-glow-sm">
                      <User className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Username",
                        value: user?.username || "-",
                        icon: User,
                      },
                      {
                        label: "Email address",
                        value: user?.email || "-",
                        icon: Mail,
                      },
                      {
                        label: "Phone number",
                        value: user?.phonenumber || "Not provided",
                        icon: Phone,
                      },
                      {
                        label: "Access role",
                        value: user?.role || "user",
                        icon: Shield,
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.35 }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#101018] border border-gray-200 dark:border-white/[0.06] flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-primary-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-1">
                            {item.label}
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-all sm:break-normal">
                            {item.value}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="card p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                          Activity
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Purchase momentum
                        </h3>
                      </div>
                      <BarChart3 className="w-5 h-5 text-primary-500" />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 p-5 text-white">
                        <p className="text-[11px] uppercase tracking-[0.24em] font-bold text-white/65 mb-2">
                          Most recent activity
                        </p>
                        <p className="text-2xl font-black mb-1">
                          {lastOrderDate}
                        </p>
                        <p className="text-sm text-white/80">
                          {orders.length > 0
                            ? "Your account has recent store activity."
                            : "Start browsing to build your order history."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03]">
                          <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-2">
                            Pending orders
                          </p>
                          <p className="text-2xl font-black text-gray-900 dark:text-white">
                            {pendingOrders}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-white/65 mt-1">
                            Orders still waiting on completion.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03]">
                          <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-2">
                            Payment status
                          </p>
                          <p className="text-2xl font-black text-gray-900 dark:text-white">
                            {
                              orders.filter(
                                (order) => order.paymentStatus === "paid",
                              ).length
                            }
                          </p>
                          <p className="text-sm text-gray-500 dark:text-white/65 mt-1">
                            Orders paid successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                          Quick actions
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Continue your flow
                        </h3>
                      </div>
                      <Receipt className="w-5 h-5 text-primary-500" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          label: "Browse store",
                          desc: "Find your next game or digital key.",
                          action: () => router.push("/store"),
                          icon: ShoppingCart,
                        },
                        {
                          label: "Edit profile",
                          desc: "Update your account details and preferences.",
                          action: () => setActiveTab("settings"),
                          icon: Settings,
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="group text-left rounded-2xl border border-gray-200 p-4 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                        >
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-white/65 mt-1">
                            {item.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card overflow-hidden"
              >
                <div className="p-6 sm:p-7 border-b border-gray-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                      Orders
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Order history
                    </h3>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-white/65">
                    {orders.length} total order{orders.length === 1 ? "" : "s"}
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 px-6 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-gray-500 dark:text-white/65 mb-5">
                      No orders yet. Start with the store and build your
                      library.
                    </p>
                    <button
                      onClick={() => router.push("/store")}
                      className="btn-primary px-5 py-2.5 text-sm"
                    >
                      Browse Store
                    </button>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 space-y-4">
                    {orders.map((order, idx) => (
                      <motion.div
                        key={order._id}
                        className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 dark:border-white/[0.06] dark:bg-white/[0.03]"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs font-mono text-gray-400">
                                #{order._id.slice(-6).toUpperCase()}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}
                              >
                                {order.status}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-white/[0.04] dark:text-gray-400"}`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-white/65">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>

                          <div className="text-left lg:text-right">
                            <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-gray-400 mb-1">
                              Order total
                            </p>
                            <p className="text-2xl font-black text-gradient">
                              ${order.totalPrice?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div
                              key={`${order._id}-${index}`}
                              className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 dark:bg-[#101018] border border-gray-200 dark:border-white/[0.04]"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {item.name ||
                                    (typeof item.productId === "object"
                                      ? item.productId.name
                                      : "Product")}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-white/55 mt-1">
                                  Qty {item.quantity}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-white/60">
                          <span>
                            {order.totalItems || order.items?.length || 0}{" "}
                            item(s)
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Updated from your GamePlug account
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AnimatePresence>
                  {profileMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-2 ${
                        profileMsg.type === "success"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                          : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border border-red-200 dark:border-red-500/30"
                      }`}
                    >
                      {profileMsg.type === "success" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      {profileMsg.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="card p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                          Settings
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Profile information
                        </h3>
                      </div>
                      {!isEditing ? (
                        <motion.button
                          onClick={() => {
                            setIsEditing(true);
                            setProfileMsg(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </motion.button>
                          <motion.button
                            onClick={handleSaveProfile}
                            disabled={saving || uploadingAvatar}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm transition-all disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {saving || uploadingAvatar ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            Save
                          </motion.button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Username
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                username: e.target.value,
                              })
                            }
                            className="input pl-10"
                            disabled={!isEditing}
                            placeholder="Username"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="input pl-10"
                            disabled={!isEditing}
                            placeholder="Email"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phonenumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phonenumber: e.target.value,
                              })
                            }
                            className="input pl-10"
                            disabled={!isEditing}
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary-500 mb-1">
                          Security
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Change password
                        </h3>
                      </div>
                      {!changingPassword && (
                        <motion.button
                          onClick={() => {
                            setChangingPassword(true);
                            setProfileMsg(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Lock className="w-3.5 h-3.5" /> Change
                        </motion.button>
                      )}
                    </div>

                    {changingPassword ? (
                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                              className="input pl-10 pr-10"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  current: !showPasswords.current,
                                })
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showPasswords.current ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className="input pl-10 pr-10"
                              placeholder="Enter new password (min 6 chars)"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  new: !showPasswords.new,
                                })
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showPasswords.new ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="input pl-10 pr-10"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords({
                                  ...showPasswords,
                                  confirm: !showPasswords.confirm,
                                })
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showPasswords.confirm ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <motion.button
                            onClick={() => {
                              setChangingPassword(false);
                              setPasswordData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                              setProfileMsg(null);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </motion.button>
                          <motion.button
                            onClick={handleChangePassword}
                            disabled={
                              saving ||
                              !passwordData.currentPassword ||
                              !passwordData.newPassword ||
                              !passwordData.confirmPassword
                            }
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-sm font-bold shadow-glow-sm transition-all disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {saving ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            Update Password
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 dark:border-white/[0.06] dark:bg-white/[0.03]">
                        <p className="text-sm text-gray-500 dark:text-white/70 leading-relaxed">
                          Keep your GamePlug account secure. Click{" "}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Change
                          </span>{" "}
                          to update your password using your current
                          credentials.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
}
