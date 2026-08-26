import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, Trash2, Clock, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { useScanHistory } from "../hook/useScanHistory.js";
import Header from "../components/Header.jsx";
import { I18N } from "../data/i18n";

export default function ScanHistory({ refreshTrigger, initialLang = "en" }) {
  const [currentLang, setCurrentLang] = useState(initialLang);

  // Translation helper setup
  const d = I18N?.[currentLang] || I18N?.en || {};
  const t = (key) => d?.[key] || key;

  const { history, loading, clearHistory } = useScanHistory(refreshTrigger);

  return (
    <div className="bg-[#0A0E15] text-[#EAEEF6] min-h-screen w-full font-sans selection:bg-[#4C7CF3] selection:text-white">
      
<div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans flex flex-col items-center">
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-[#4C7CF3]" size={22} />
            MongoDB Scan History & Logs
          </h2>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Trash2 size={14} /> Clear Database
            </button>
          )}
        </div>

        {loading && history.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">Fetching logs from MongoDB...</div>
        ) : history.length === 0 ? (
          <div className="bg-[#111723] border border-gray-800 rounded-xl p-8 text-center text-gray-500 text-sm">
            No records found in database. Scan an image or URL to log history.
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {history.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border backdrop-blur-sm flex items-center justify-between gap-4 transition ${
                  item.is_threat
                    ? "bg-rose-950/20 border-rose-500/30"
                    : "bg-[#111723] border-emerald-500/20"
                }`}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  {item.is_threat ? (
                    <ShieldAlert className="text-rose-500 shrink-0" size={24} />
                  ) : (
                    <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
                  )}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gray-200 truncate max-w-md sm:max-w-xl">
                        {item.payload}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] bg-slate-800 border border-slate-700 text-gray-300 px-2 py-0.5 rounded shrink-0">
                        {item.scan_type === "image" ? (
                          <>
                            <ImageIcon size={10} className="text-blue-400" /> Image ({item.file_name || "Uploaded"})
                          </>
                        ) : (
                          <>
                            <LinkIcon size={10} className="text-purple-400" /> Direct URL
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className={item.is_threat ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                        Risk Score: {item.risk_score}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.is_threat
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    }`}
                  >
                    {item.is_threat ? "Threat" : "Safe"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    </div>
  );
}