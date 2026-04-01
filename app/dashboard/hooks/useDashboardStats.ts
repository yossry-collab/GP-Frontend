import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { StatsData } from "../types";

export function useDashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [advancedStats, setAdvancedStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, advancedStats, loading, refetch: fetchStats };
}
