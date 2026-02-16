"use client";

import {
  Gamepad2,
  Store,
  ShoppingCart,
  User,
  LogOut,
  Home,
  Menu,
  X,
  Gift,
  Coins,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Package,
  CreditCard,
  Star,
  Award,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loyaltyAPI, notificationsAPI } from "@/lib/api";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [points, setPoints] = useState<number | null>(null);
  const isAdmin = user?.role === "admin";

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [countRes, listRes] = await Promise.all([
        notificationsAPI.getUnreadCount(),
        notificationsAPI.getAll(1, 20),
      ]);
      setUnreadCount(countRes.data.count);
      setNotifications(listRes.data.notifications);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loyaltyAPI
        .getBalance()
        .then((res) => setPoints(res.data.points))
        .catch(() => {});
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // poll every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationsAPI.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleMarkRead = async (id: string) => {
    await notificationsAPI.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleDeleteNotif = async (id: string) => {
    await notificationsAPI.delete(id);
    const wasUnread = notifications.find((n) => n._id === id && !n.read);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleClearAll = async () => {
    await notificationsAPI.clearAll();
    setNotifications([]);
    setUnreadCount(0);
  };

  const notifIcon = (type: string) => {
    switch (type) {
      case "order_status":
        return <Package className="w-4 h-4 text-blue-400" />;
      case "payment_success":
        return <CreditCard className="w-4 h-4 text-green-400" />;
      case "loyalty_points":
        return <Star className="w-4 h-4 text-amber-400" />;
      case "loyalty_reward":
        return <Award className="w-4 h-4 text-purple-400" />;
      case "loyalty_tier":
        return <Award className="w-4 h-4 text-pink-400" />;
      case "welcome":
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = isAuthenticated
    ? [
        ...(isAdmin
          ? [{ href: "/dashboard", label: "Dashboard", icon: Home }]
          : []),
        { href: "/store", label: "Store", icon: Store },
        { href: "/rewards", label: "Rewards", icon: Gift },
        { href: "/cart", label: "Cart", icon: ShoppingCart },
        { href: "/profile", label: "Profile", icon: User },
      ]
    : [{ href: "/store", label: "Store", icon: Store }];

  const isActive = (href: string) => pathname === href;
  const isLanding = pathname === "/";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isLanding ? "bg-black/20 backdrop-blur-md border-b border-white/[0.06]" : "glass"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() =>
            router.push(
              isAuthenticated ? (isAdmin ? "/dashboard" : "/store") : "/",
            )
          }
        >
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-glow-sm">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-lg font-extrabold tracking-tight ${isLanding ? "text-white" : "text-gray-900 dark:text-white"}`}
          >
            GAME<span className="text-gradient">PLUG</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10"
                  : isLanding
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
              {link.href === "/cart" && itemCount > 0 && (
                <span className="ml-0.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Points badge */}
          {isAuthenticated && points !== null && (
            <button
              onClick={() => router.push("/rewards")}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-500/20 hover:border-amber-400 transition-all"
              title="Your points"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {points.toLocaleString()}
              </span>
            </button>
          )}

          {isAuthenticated ? (
            <>
              {/* Notification bell */}
              <div ref={notifRef} className="relative hidden md:block">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    notifOpen
                      ? "bg-primary-50 dark:bg-primary-500/10 border-primary-300 dark:border-primary-500/30 text-primary-600 dark:text-primary-400"
                      : "bg-gray-100 dark:bg-white/[0.06] border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-96 max-h-[480px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <div className="flex items-center gap-1">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
                              title="Mark all as read"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={handleClearAll}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                              title="Clear all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Notification list */}
                      <div className="overflow-y-auto max-h-[400px] divide-y divide-gray-50 dark:divide-white/[0.04]">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Bell className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`group flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                                n.read
                                  ? "bg-transparent hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                  : "bg-primary-50/50 dark:bg-primary-500/5 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                              }`}
                              onClick={() => !n.read && handleMarkRead(n._id)}
                            >
                              <div className="mt-0.5 w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
                                {notifIcon(n.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p
                                    className={`text-xs font-semibold truncate ${n.read ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}
                                  >
                                    {n.title}
                                  </p>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotif(n._id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 hover:text-red-400 transition-all"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                                <p
                                  className={`text-xs mt-0.5 leading-relaxed ${n.read ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"}`}
                                >
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                  {timeAgo(n.createdAt)}
                                </p>
                              </div>
                              {!n.read && (
                                <div className="mt-2 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User avatar */}
              <button
                onClick={() => router.push("/profile")}
                className="hidden md:flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/30 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                  {user?.username}
                </span>
              </button>

              {/* Logout desktop */}
              <button
                onClick={handleLogout}
                className="hidden md:flex w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500/30 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => router.push("/login")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${isLanding ? "text-white/80 hover:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/register")}
                className="btn-primary px-5 py-2 text-sm"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile notification bell */}
          {isAuthenticated && (
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="md:hidden relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-gray-200 dark:border-white/[0.06]"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    router.push(link.href);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {link.href === "/cart" && itemCount > 0 && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full text-[11px] font-bold text-white flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              ))}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      router.push("/login");
                      setMobileOpen(false);
                    }}
                    className="w-full py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/register");
                      setMobileOpen(false);
                    }}
                    className="w-full btn-primary py-2.5 text-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
