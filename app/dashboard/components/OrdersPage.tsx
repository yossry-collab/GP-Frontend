import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Clock, Check, X, Coins, Search, RefreshCw, ChevronDown, Edit3, Save, Package } from "lucide-react";
import { ordersAPI } from "@/lib/api";
import { Msg, Spinner, Empty } from "./DashboardUI";
import SafeImage from "@/components/SafeImage";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "failed">("all");
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

  const cardClass = "bg-white dark:bg-[#1a1f2e] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

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

  async function handleStatusChange(orderId: string, status: string, paymentStatus?: string) {
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
      items: order.items.map((it: any) => ({ name: it.name, quantity: it.quantity, price: it.price })),
      totalPrice: order.totalPrice,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  }

  function updateEditItem(idx: number, field: string, value: string | number) {
    const newItems = [...editOrderForm.items];
    newItems[idx] = { ...newItems[idx], [field]: field === "name" ? value : Number(value) };
    const newTotal = newItems.reduce((s, it) => s + it.price * it.quantity, 0);
    setEditOrderForm({ ...editOrderForm, items: newItems, totalPrice: Math.round(newTotal * 100) / 100 });
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
      if (!username.includes(q) && !email.includes(q) && !id.includes(q)) return false;
    }
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    completed: orders.filter((o) => o.status === "completed").length,
    failed: orders.filter((o) => o.status === "failed").length,
    revenue: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + (o.totalPrice || 0), 0),
  };

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  };

  if (loading) return <Spinner />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Msg msg={msg} onClose={() => setMsg(null)} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Orders", value: stats.total, icon: ShoppingBag, color: "text-primary-600" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600" },
          { label: "Completed", value: stats.completed, icon: Check, color: "text-emerald-600" },
          { label: "Failed", value: stats.failed, icon: X, color: "text-red-500" },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: Coins, color: "text-primary-600" },
        ].map((s, i) => (
          <div key={i} className={`${cardClass} p-4 flex items-center gap-3`}>
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/[0.06]"><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${cardClass} p-4 flex flex-wrap items-center gap-3`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm outline-none" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "pending", "completed", "failed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize ${filter === f ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-white/[0.06]"}`}>
              {f === "all" ? `All (${stats.total})` : `${f} (${stats[f]})`}
            </button>
          ))}
        </div>
        <button onClick={loadOrders} className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.06]"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
      </div>

      {filtered.length === 0 ? <Empty text="No orders found" /> : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <div key={order._id} className={`${cardClass} overflow-hidden transition-all`}>
                <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">#{order._id.slice(-8)}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${statusColor[order.status]}`}>{order.status}</span>
                    </div>
                    <p className="text-sm font-medium">{order.userId?.username || "Unknown"} <span className="text-gray-400 font-normal text-xs">{order.userId?.email}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">${order.totalPrice?.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">{order.totalItems} items</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100 dark:border-white/[0.06] p-4">
                      {editingOrderId === order._id ? (
                        <div className="space-y-4">
                          {editOrderForm.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input value={item.name} onChange={(e) => updateEditItem(idx, "name", e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" />
                              <input type="number" value={item.quantity} onChange={(e) => updateEditItem(idx, "quantity", e.target.value)} className="w-16 px-2 py-1 border rounded text-sm text-center" />
                              <input type="number" step="0.01" value={item.price} onChange={(e) => updateEditItem(idx, "price", e.target.value)} className="w-24 px-2 py-1 border rounded text-sm text-center" />
                            </div>
                          ))}
                          <div className="flex gap-2">
                             <button onClick={handleOverride} className="px-4 py-1.5 bg-primary-600 text-white rounded text-xs">Save Override</button>
                             <button onClick={() => setEditingOrderId(null)} className="px-4 py-1.5 bg-gray-100 rounded text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                               <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                 {item.productId?.image ? <img src={item.productId.image} className="w-full h-full object-cover rounded" /> : <Package className="w-4 h-4" />}
                               </div>
                               <div className="flex-1 text-sm font-medium">{item.name}</div>
                               <div className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                          ))}
                          <div className="flex gap-2 pt-2">
                            <button onClick={() => startEditOrder(order)} className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-xs">Edit</button>
                            {order.status === 'pending' && <button onClick={() => handleStatusChange(order._id, 'completed', 'paid')} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Complete</button>}
                          </div>
                        </div>
                      )}
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
