import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  QrCode,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router";
import LiveScan from "../components/LiveScans";
import LiveDemo from "../components/LiveDemo";
import { I18N } from "../data/i18n";
import { speakVerdict } from "../utils/speech";
import { verdictMeta } from "../utils/verdict";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env?.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/history`;

function Dashboard() {
  const navigate = useNavigate();

  // MongoDB Scans State & Loading Management
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentLang, setCurrentLang] = useState("en");
  const [voiceLang, setVoiceLang] = useState("en");
  const [voiceOn, setVoiceOn] = useState(true);
  const [urlInput, setUrlInput] = useState(
    "https://secure-verify-hdfcbank.paylnk.co/refund"
  );
  const [fileName, setFileName] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uiState, setUiState] = useState("idle");
  const [lastResult, setLastResult] = useState(null);
  const [historyTrigger, setHistoryTrigger] = useState(0);

  const fileInputRef = useRef(null);

  // Safe dictionary fallback
  const d = I18N?.[currentLang] || I18N?.en || {};
  const t = useCallback((key) => d?.[key] || key, [d]);

  // Fallback verdictMeta
  const safeVerdictMeta =
    verdictMeta ||
    ((verdict) => ({
      label: verdict?.toUpperCase() || "UNKNOWN",
      color:
        verdict === "safe"
          ? "#2FD67C"
          : verdict === "suspicious"
          ? "#FFB13D"
          : "#FF4D5E",
      soft: "rgba(76,124,243,0.1)",
      Icon: () => null,
    }));

  // Helper function to extract risk score across different field naming conventions
  const getRiskScore = useCallback((scan) => {
    if (typeof scan.riskScore === "number") return scan.riskScore;
    if (typeof scan.risk_score === "number") return scan.risk_score;
    return 0;
  }, []);

  // Helper to determine threat status consistently
  const isThreatScan = useCallback(
    (scan) => {
      const score = getRiskScore(scan);
      const isStatusMalicious =
        scan.status === "Malicious" ||
        scan.status === "High Risk" ||
        scan.is_threat === true;
      return score > 50 || isStatusMalicious;
    },
    [getRiskScore]
  );

  // Safe Date Formatter Helper
  const formatDate = (dateVal, fallbackText = "Just now") => {
    if (!dateVal) return fallbackText;
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return dateVal; // Returns original string if not ISO standard
    return parsed.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Fetch function with optional AbortSignal
  const fetchMongoDBScans = useCallback(async (signal) => {
    try {
      const response = await fetch(API_URL, { signal });
      if (response.ok) {
        const data = await response.json();
        const scanList = Array.isArray(data)
          ? data
          : data.history || data.scans || data.data || [];
        setScans(scanList);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch MongoDB scan history:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Direct Async API Analysis Runner (Connected to Python FastAPI + MongoDB)
  const runAnalysis = useCallback(async () => {
    setUiState("loading");

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const scanType = fileName ? "image" : "url";

      const response = await fetch(`${API_BASE_URL}/api/analyze-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: urlInput,
          scan_type: scanType,
          file_name: fileName || null,
          lang: voiceLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Scan API Failed with status: ${response.status}`);
      }

      const data = await response.json();

      const formattedResult = {
        score: data.risk_score,
        verdict: data.is_threat ? "dangerous" : "safe",
        url: data.payload,
        reasonItems: data.reasons || [],
        audioBase64: data.audio_base64,
        aiExplanation: data.ai_explanation,
      };

      setLastResult(formattedResult);
      setUiState("done");

      // Refetch DB logs to ensure authoritative status display
      setTimeout(() => {
        fetchMongoDBScans();
      }, 800);

      setHistoryTrigger((prev) => prev + 1);

      // Audio Playback Logic
      if (voiceOn) {
        if (data.audio_base64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
          audio.play().catch((err) => console.log("Audio playback error:", err));
        } else if (typeof speakVerdict === "function") {
          speakVerdict(formattedResult, voiceLang, I18N);
        }
      }
    } catch (error) {
      console.error("Scan Error:", error);
      setUiState("idle");
    }
  }, [urlInput, fileName, voiceOn, voiceLang, fetchMongoDBScans]);

  const handleUploadedFile = useCallback((file) => {
    if (!file) return;
    setFileName(file.name);
  }, []);

  const onLanguageChange = (lang) => {
    if (!I18N?.[lang]) return;

    setCurrentLang(lang);
    setVoiceLang(lang);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const onVoiceLangChange = (lang) => {
    setVoiceLang(lang);
    if (voiceOn && lastResult && typeof speakVerdict === "function") {
      speakVerdict(lastResult, lang, I18N);
    }
  };

  const replay = () => {
    if (lastResult?.audioBase64) {
      const audio = new Audio(`data:audio/mp3;base64,${lastResult.audioBase64}`);
      audio.play().catch((err) => console.log("Audio playback error:", err));
    } else if (lastResult && typeof speakVerdict === "function") {
      speakVerdict(lastResult, voiceLang, I18N);
    }
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);

    if (!next && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Poll & Clean-up handling
  useEffect(() => {
    const controller = new AbortController();
    fetchMongoDBScans(controller.signal);

    const interval = setInterval(() => {
      fetchMongoDBScans(controller.signal);
    }, 5000);

    return () => {
      controller.abort();
      clearInterval(interval);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [fetchMongoDBScans, historyTrigger]);

  // Derived calculations memoized for performance
  const { totalScansCount, maliciousScans, cleanCount, detectionRate } = useMemo(() => {
    const total = scans.length;
    const malicious = scans.filter(isThreatScan);
    const clean = total - malicious.length;
    const rate = total > 0 ? ((clean / total) * 100).toFixed(1) : "100.0";

    return {
      totalScansCount: total,
      maliciousScans: malicious,
      cleanCount: clean,
      detectionRate: rate,
    };
  }, [scans, isThreatScan]);

  const stats = [
    {
      title: "Total DB Scans",
      value: totalScansCount.toLocaleString(),
      change: "+Live",
      isPositive: true,
      icon: QrCode,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Malicious URLs",
      value: maliciousScans.length.toLocaleString(),
      change: "MongoDB",
      isPositive: false,
      icon: ShieldAlert,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      title: "Clean Scans",
      value: cleanCount.toLocaleString(),
      change: "MongoDB",
      isPositive: true,
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Safety Rate",
      value: `${detectionRate}%`,
      change: "Calculated",
      isPositive: true,
      icon: Activity,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E15] text-[#EAEEF6] p-4 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1B2331] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-mono tracking-wide text-white">
            Security Overview
          </h1>
          <p className="text-sm text-[#8A94AA] mt-1">
            Real-time scanner metrics synced directly from MongoDB
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchMongoDBScans()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            MongoDB Connected
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#141A26] border border-[#242D40] hover:border-[#323E56] transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#8A94AA] uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-semibold flex items-center gap-0.5 ${
                    stat.isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Scan & DB Info Row */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="w-full lg:w-[70%] flex flex-col">
          <LiveScan t={t} />
        </div>
        <div className="p-6 rounded-2xl bg-[#141A26] border border-[#242D40] space-y-4 w-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={20} />
              Recent Threats
            </h2>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
            {maliciousScans.length === 0 ? (
              <p className="text-xs text-[#8A94AA] py-4">
                No high-risk threats detected in your MongoDB logs yet.
              </p>
            ) : (
              maliciousScans.slice(0, 5).map((threat) => {
                const score = getRiskScore(threat);
                const dateVal = threat.created_at || threat.createdAt || threat.timestamp;

                return (
                  <div
                    key={threat._id || threat.id}
                    className="p-4 rounded-xl bg-[#0A0E15] border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          {threat.type || threat.scan_type || threat.category || "URL"}
                        </span>
                        <span className="text-xs text-[#8A94AA]">
                          {formatDate(dateVal, threat.timestamp || "Recently")}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-white truncate">
                        {threat.target || threat.payload || threat.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xs text-[#8A94AA] block">
                          Risk Score
                        </span>
                        <span className="text-sm font-bold font-mono text-red-400">
                          {score} / 100
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Live Demo & Database Details Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[70%] space-y-2">
          <span className="font-mono text-xs text-[#4C7CF3] tracking-wider block">
            {t("demo_eyebrow")}
          </span>
          <LiveDemo
            t={t}
            d={d}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            setDragOver={setDragOver}
            dragOver={dragOver}
            handleUploadedFile={handleUploadedFile}
            fileInputRef={fileInputRef}
            fileName={fileName}
            runAnalysis={runAnalysis}
            uiState={uiState}
            lastResult={lastResult}
            verdictMeta={safeVerdictMeta}
            currentLang={currentLang}
            voiceLang={voiceLang}
            onVoiceLangChange={onVoiceLangChange}
            replay={replay}
            toggleVoice={toggleVoice}
            voiceOn={voiceOn}
          />
        </div>

        <div className="p-6 rounded-2xl bg-[#141A26] border border-[#242D40] space-y-4 flex flex-col justify-between w-full lg:w-[30%]">
          <div>
            <h2 className="text-lg font-bold font-mono text-white">
              Database Sync Details
            </h2>
            <p className="text-xs text-[#8A94AA] mt-1">MongoDB Collections</p>
          </div>

          <div className="space-y-3 text-xs text-[#8A94AA]">
            <div className="p-3 bg-[#0A0E15] rounded-xl border border-[#242D40] flex items-center justify-between">
              <span>Collection Name</span>
              <span className="text-white font-mono">scan_history</span>
            </div>
            <div className="p-3 bg-[#0A0E15] rounded-xl border border-[#242D40] flex items-center justify-between">
              <span>Total Documents</span>
              <span className="text-emerald-400 font-mono font-bold">
                {totalScansCount}
              </span>
            </div>
            <div className="p-3 bg-[#0A0E15] rounded-xl border border-[#242D40] flex items-center justify-between">
              <span>Sync Interval</span>
              <span className="text-purple-400 font-semibold">
                5 Sec Auto-Refresh
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0A0E15] border border-[#242D40] text-xs text-[#8A94AA]">
            💡 Live scans recorded across all modules automatically show up here directly from MongoDB.
          </div>
        </div>
      </div>

      {/* Main Activity Table (MongoDB Data Render) */}
      <div className="p-6 rounded-2xl bg-[#141A26] border border-[#242D40] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-mono text-white">
            MongoDB Scan Logs
          </h2>
          <button
            onClick={() => navigate("/scanhistory")}
            className="text-xs text-[#4C7CF3] cursor-pointer hover:underline"
          >
            View Full History
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-xs text-[#8A94AA] flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={16} /> Loading data from MongoDB...
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#242D40] text-xs text-[#8A94AA] uppercase tracking-wider">
                  <th className="py-3 px-4">Target / Payload</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4 text-right">Date / Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242D40]/50">
                {scans.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-6 text-center text-xs text-[#8A94AA]"
                    >
                      No scan records found in MongoDB. Perform a scan to view data here!
                    </td>
                  </tr>
                ) : (
                  scans.slice(0, 10).map((scan) => {
                    const score = getRiskScore(scan);
                    const isSafe = !isThreatScan(scan);
                    const dateVal = scan.created_at || scan.createdAt || scan.timestamp;

                    return (
                      <tr
                        key={scan._id || scan.id}
                        className="hover:bg-[#1A2232]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono text-xs text-white max-w-[250px] truncate">
                          {scan.target || scan.payload || scan.url}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#8A94AA]">
                          {scan.type || scan.scan_type || scan.category || "Direct URL"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                              isSafe
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {isSafe ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <XCircle size={13} />
                            )}
                            {scan.status || (isSafe ? "Safe" : "Malicious")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs font-bold">
                          <span
                            className={
                              !isSafe ? "text-red-400" : "text-emerald-400"
                            }
                          >
                            {`${score}/100`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#8A94AA] text-right">
                          {formatDate(dateVal, scan.timestamp || "Just now")}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer t={t} />
    </div>
  );
}

export default Dashboard;