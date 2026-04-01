import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, RefreshCw, Download, Edit3, Trash2, Save, X } from "lucide-react";
import { usersAPI, adminAPI } from "@/lib/api";
import { UserType } from "../types";
import { Msg, Spinner, Empty, RoleBadge, ActionBtn } from "./DashboardUI";

export default function UsersPage() {
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
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
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
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to update" });
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
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to delete" });
    }
  };

  const handleBan = async (id: string) => {
    try {
      setBanningId(id);
      await usersAPI.ban(id);
      setMsg({ type: "success", text: "User banned successfully" });
      fetchUsers();
    } catch (err: any) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to ban" });
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
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to unban" });
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
        ])
      );
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mailing-list.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMsg({ type: "error", text: "Failed to export mailing list" });
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all registered users</p>
      </div>

      <Msg msg={msg} onClose={() => setMsg(null)} />

      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/[0.04] flex flex-col sm:flex-row sm:items-center gap-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-1">
            <Users className="w-4 h-4 text-primary-500" /> Users ({filtered.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary-300 transition-all text-gray-700 dark:text-gray-300"
            />
          </div>
          <button onClick={fetchUsers} className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 hover:border-primary-300 transition-all">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleExportEmails} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-all">
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
              <thead className="bg-gray-50 dark:bg-white/[0.02]">
                <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wider">
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
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      {editingId === u._id ? (
                        <input
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          className="w-40 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 rounded-lg text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{u.username}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editingId === u._id ? (
                        <input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-48 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 rounded-lg text-sm"
                        />
                      ) : (
                        <span className="text-gray-500">{u.email}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {editingId === u._id ? (
                        <input
                          value={editForm.phonenumber}
                          onChange={(e) => setEditForm({ ...editForm, phonenumber: e.target.value })}
                          className="w-36 px-3 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 rounded-lg text-sm"
                        />
                      ) : (
                        <span className="text-gray-500">{u.phonenumber || "-"}</span>
                      )}
                    </td>
                    <td className="px-5 py-4"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-4">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400">Banned</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">Active</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === u._id ? (
                          <>
                            <ActionBtn onClick={() => handleSave(u._id)} icon={saving ? undefined : Save} loading={saving} variant="success" />
                            <ActionBtn onClick={() => setEditingId(null)} icon={X} />
                          </>
                        ) : (
                          <>
                            <ActionBtn onClick={() => handleEdit(u)} icon={Edit3} />
                            {u.role !== "admin" && (
                              u.isBanned ? (
                                <button onClick={() => handleUnban(u._id)} className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 text-[10px] font-bold">Unban</button>
                              ) : (
                                <button onClick={() => handleBan(u._id)} className="px-2 py-1 rounded-lg bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 text-[10px] font-bold">Ban</button>
                              )
                            )}
                            {deleteConfirm === u._id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(u._id)} className="px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-bold">Confirm</button>
                                <ActionBtn onClick={() => setDeleteConfirm(null)} icon={X} />
                              </div>
                            ) : (
                              <ActionBtn onClick={() => setDeleteConfirm(u._id)} icon={Trash2} variant="danger" />
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
