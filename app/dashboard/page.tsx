"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Menu,
  ChevronLeft,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";

// Refactored Sub-components
import OverviewPage from "./components/OverviewPage";
import UsersPage from "./components/UsersPage";
import ProductsPage from "./components/ProductsPage";
import OrdersPage from "./components/OrdersPage";
import ImportPage from "./components/ImportPage";
import LoyaltyAdminPage from "./components/LoyaltyAdminPage";

// Types & Data
import { Page } from "./types";
import { SIDEBAR_ITEMS } from "./data";

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
          <div className="text-center p-6 bg-white dark:bg-[#16161f] rounded-3xl border border-gray-200 dark:border-white/[0.06] shadow-xl">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-6">Admin privileges required.</p>
            <button onClick={() => router.push("/store")} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold">Go to Store</button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case "overview": return <OverviewPage username={user?.username || "Admin"} />;
      case "users": return <UsersPage />;
      case "products": return <ProductsPage />;
      case "orders": return <OrdersPage />;
      case "import": return <ImportPage />;
      case "loyalty": return <LoyaltyAdminPage />;
      default: return <OverviewPage username={user?.username || "Admin"} />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0b0b11] flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-64" : "w-20"} hidden lg:flex flex-col bg-white dark:bg-[#16161f] border-r border-gray-200 dark:border-white/[0.06] transition-all duration-300 relative z-20`}>
          <div className="p-6 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && "hidden"}`}>
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">GP</div>
              <span className="font-bold text-lg dark:text-white">Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] text-gray-400">
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5 mx-auto" />}
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activePage === item.key ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 shadow-sm" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${activePage === item.key ? "text-primary-600" : "text-gray-400"}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-[#16161f]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/[0.06] sticky top-0 z-10 lg:static lg:bg-transparent lg:border-none lg:backdrop-blur-none">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500"><Menu className="w-6 h-6" /></button>
             <div className="flex-1" />
          </header>

          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
               <motion.div key={activePage} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                 {renderContent()}
               </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
