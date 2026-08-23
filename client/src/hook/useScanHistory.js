import { useState, useEffect, useCallback } from "react";

export function useScanHistory(refreshTrigger) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/history");
      const data = await res.json();
      if (data.status === "success") {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("MongoDB history fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = async () => {
    try {
      await fetch("http://localhost:8000/api/history", { method: "DELETE" });
      setHistory([]);
    } catch (err) {
      console.error("MongoDB history clear failed:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshTrigger]);

  return { history, loading, clearHistory };
}