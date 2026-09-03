import { useState, useRef, useCallback } from "react";
import Footer from "../components/Footer";
import LiveDemo from "../components/LiveDemo.jsx";

import { I18N } from "../data/i18n";
import { speakVerdict } from "../utils/speech";
import { verdictMeta } from "../utils/verdict";

function QRShieldPage() {
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
  const t = (key) => d?.[key] || key;

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

  // Direct Async API Analysis Runner (Connected to Python FastAPI + MongoDB)
  const runAnalysis = useCallback(async () => {
    setUiState("loading");

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const scanType = fileName ? "image" : "url";

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: urlInput,
          scan_type: scanType,
          file_name: fileName || null,
          lang: voiceLang, // Selected voice/language passed to Gemini backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const formattedResult = {
          score: data.risk_score,
          verdict: data.is_threat ? "dangerous" : "safe",
          url: data.payload,
          reasonItems: data.reasons || [],
          audioBase64: data.audio_base64,
          aiExplanation: data.ai_explanation, // AI Explanation field mapped from API
        };

        setLastResult(formattedResult);
        setUiState("done");

        // Trigger MongoDB history sync update
        setHistoryTrigger((prev) => prev + 1);

        // Play Backend TTS Voice or Fallback Speech
        if (voiceOn) {
          if (data.audio_base64) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
            audio.play().catch((err) => console.log("Audio playback error:", err));
          } else if (typeof speakVerdict === "function") {
            speakVerdict(formattedResult, voiceLang, I18N);
          }
        }
      } else {
        throw new Error("Scan API Failed");
      }
    } catch (error) {
      console.error("Scan Error:", error);
      setUiState("idle");
    }
  }, [urlInput, fileName, voiceOn, voiceLang]);

  // Image File drop handler
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
      audio.play();
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

  return (
    <div className="bg-[#0A0E15] text-[#EAEEF6] min-h-screen w-full font-sans p-4 sm:p-8">
      
       <div className="mb-8">
        <span className="font-mono text-xs text-[#4C7CF3] tracking-wider">
          {t("demo_eyebrow")}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#EAEEF6] mt-2">
          {t("demo_h2")}
        </h2>
        <p className="text-[#8A94AA] text-sm mt-2 max-w-xl">
          {t("demo_sub_pre")}{" "}
          <code className="bg-[#1B2333] px-1.5 py-0.5 rounded font-mono text-xs">
            /api/analyze-qr
          </code>{" "}
          {t("demo_sub_post")}
        </p>
      </div>
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
      <Footer t={t} />
    </div>
  );
}

export default QRShieldPage;