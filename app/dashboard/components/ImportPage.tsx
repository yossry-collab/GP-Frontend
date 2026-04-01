import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, BarChart3 } from "lucide-react";
import { productsAPI } from "@/lib/api";
import { Msg } from "./DashboardUI";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setMsg(null);
      const res = await productsAPI.importCSV(file);
      setResult(res.data);
      setMsg({ type: "success", text: `Imported ${res.data.imported || 0} products.` });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setMsg({ type: "error", text: "Import failed" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">CSV Import</h1>
        <p className="text-sm text-gray-500 mt-1">Bulk import products</p>
      </div>

      <Msg msg={msg} onClose={() => setMsg(null)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-900 dark:text-white">
        <div className="bg-white dark:bg-[#16161f] rounded-2xl border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-primary-500" /> Import File</h3>
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary-300">
             <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
             <p>{file ? file.name : "Click to select CSV"}</p>
             <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <button onClick={handleUpload} disabled={!file || uploading} className="mt-4 w-full py-2.5 bg-primary-600 text-white rounded-xl font-bold">
            {uploading ? "..." : "Import"}
          </button>
        </div>

        <div className="bg-white dark:bg-[#16161f] rounded-2xl border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary-500" /> CSV Format Guide</h3>
          <ul className="space-y-4">
             <li className="flex flex-col gap-1">
                <p className="text-xs font-bold text-gray-400">REQUIRED COLUMNS</p>
                <p>name, price, category</p>
             </li>
             <li className="flex flex-col gap-1">
                <p className="text-xs font-bold text-gray-400">OPTIONAL COLUMNS</p>
                <p>description, image, stock</p>
             </li>
          </ul>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white dark:bg-[#16161f] rounded-2xl border p-6">
           <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary-500" /> Import Results</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-gray-50 dark:bg-white/[0.04] p-4 rounded-xl text-center"><p className="text-2xl font-bold text-green-600">{result.imported}</p><p className="text-xs text-gray-400">Imported</p></div>
             <div className="bg-gray-50 dark:bg-white/[0.04] p-4 rounded-xl text-center"><p className="text-2xl font-bold text-red-600">{result.errors?.length || 0}</p><p className="text-xs text-gray-400">Errors</p></div>
           </div>
        </motion.div>
      )}
    </motion.div>
  );
}
