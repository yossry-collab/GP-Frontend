import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Check, AlertCircle, X, Package } from "lucide-react";
import SafeImage from "@/components/SafeImage";

export function ActionBtn({
  onClick,
  icon: Icon,
  variant,
  loading: isLoading,
}: {
  onClick: (e: any) => void;
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

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${role === "admin" ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-400"}`}
    >
      {role}
    </span>
  );
}

export function Msg({
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

export function Spinner() {
  return (
    <div className="p-10 text-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-gray-500 text-sm">{text}</div>;
}

export function ProductForm({
  form,
  setForm,
}: {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
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
