import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Plus, Edit3, Save, Trash2, X } from "lucide-react";
import { productsAPI } from "@/lib/api";
import { ProductType } from "../types";
import { EMPTY_PRODUCT } from "../data";
import { getProductCategoryStyle } from "../utils";
import { Msg, Spinner, Empty, ProductForm, ActionBtn } from "./DashboardUI";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_PRODUCT);

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
      await productsAPI.create({ ...form, price: Number(form.price), stock: Number(form.stock) });
      setMsg({ type: "success", text: "Product created" });
      setShowAdd(false);
      setForm(EMPTY_PRODUCT);
      fetchProducts();
    } catch (err: any) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to create" });
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
      await productsAPI.update(id, { ...form, price: Number(form.price), stock: Number(form.stock) });
      setMsg({ type: "success", text: "Product updated" });
      setEditingId(null);
      setForm(EMPTY_PRODUCT);
      fetchProducts();
    } catch (err: any) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to update" });
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
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to delete" });
    }
  };

  const filtered = products.filter((p) => {
    const s = p.name.toLowerCase().includes(search.toLowerCase());
    const c = !categoryFilter || p.category === categoryFilter;
    return s && c;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit and manage store products</p>
        </div>
        <motion.button onClick={() => { setShowAdd(true); setEditingId(null); setForm(EMPTY_PRODUCT); }} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="w-4 h-4" /> Add Product
        </motion.button>
      </div>

      <Msg msg={msg} onClose={() => setMsg(null)} />

      <AnimatePresence>
        {(showAdd || editingId) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <div className={`bg-white dark:bg-[#16161f] rounded-2xl border p-6 ${editingId ? "border-primary-300" : "border-gray-200"}`}>
               <ProductForm form={form} setForm={setForm} />
               <div className="flex items-center gap-3 mt-5">
                 <button onClick={editingId ? () => handleUpdate(editingId) : handleCreate} disabled={saving} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold">
                    {saving ? "..." : (editingId ? "Update" : "Create")} Product
                 </button>
                 <button onClick={() => { setShowAdd(false); setEditingId(null); setForm(EMPTY_PRODUCT); }} className="text-sm text-gray-500">Cancel</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center gap-4">
           <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
           </div>
           <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
             <option value="">All Categories</option>
             <option value="game">Games</option>
             <option value="software">Software</option>
             <option value="gift-card">Gift Cards</option>
           </select>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No products found" /> : (
           <div className="overflow-x-auto">
             <table className="w-full text-sm">
               <thead className="bg-gray-50 dark:bg-white/[0.02] text-left text-[11px] text-gray-400 uppercase">
                 <tr>
                   <th className="px-5 py-3">Product</th>
                   <th className="px-5 py-3">Category</th>
                   <th className="px-5 py-3">Price</th>
                   <th className="px-5 py-3">Stock</th>
                   <th className="px-5 py-3 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                 {filtered.map((p) => (
                   <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                     <td className="px-5 py-4 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                         {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                       </div>
                       <span className="font-semibold">{p.name}</span>
                     </td>
                     <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${getProductCategoryStyle(p.category)}`}>{p.category}</span></td>
                     <td className="px-5 py-4 font-bold">${p.price.toFixed(2)}</td>
                     <td className="px-5 py-4">{p.stock}</td>
                     <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <ActionBtn onClick={() => handleEdit(p)} icon={Edit3} />
                           {deleteConfirm === p._id ? (
                             <div className="flex items-center gap-1">
                               <button onClick={() => handleDelete(p._id)} className="px-2 py-1 bg-red-500 text-white text-[10px] rounded font-bold">Confirm</button>
                               <ActionBtn onClick={() => setDeleteConfirm(null)} icon={X} />
                             </div>
                           ) : (
                             <ActionBtn onClick={() => setDeleteConfirm(p._id)} icon={Trash2} variant="danger" />
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
