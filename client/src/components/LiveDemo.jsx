import React, { useEffect, useRef } from "react";
import axios from "axios";
import {
  UploadCloud,
  ScanLine,
  Volume2,
  VolumeX,
  CircleCheck,
  CircleAlert,
  Sparkles,
} from "lucide-react";
import Gauge from "./Gauge";

const ANALYZE_ENDPOINT = "http://localhost:5000/api/analyze-qr";

function LiveDemo({
  t,
  d,
  urlInput,
  setUrlInput,
  setDragOver,
  dragOver,
  handleUploadedFile,
  fileInputRef,
  fileName,
  runAnalysis,
  uiState,
  lastResult,
  verdictMeta,
  currentLang,
  voiceLang,
  onVoiceLangChange,
  toggleVoice,
  voiceOn,
}) {
  const currentAudioRef = useRef(null);

  // Stop active playing backend audio
  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  // Play Backend Base64 Audio Only
  const playBackendAudio = (audioBase64) => {
    if (!voiceOn || !audioBase64) return;
    stopAudio();

    try {
      const audioSrc = audioBase64.startsWith("data:audio")
        ? audioBase64
        : `data:audio/mp3;base64,${audioBase64}`;

      const audio = new Audio(audioSrc);
      currentAudioRef.current = audio;

      audio.play().catch((err) => {
        console.warn("Backend audio autoplay blocked or failed:", err);
      });
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  // Auto trigger backend voice when scan completes
  useEffect(() => {
    if (uiState === "done" && lastResult && voiceOn && lastResult.audio_base64) {
      playBackendAudio(lastResult.audio_base64);
    }

    return () => {
      stopAudio();
    };
  }, [lastResult, uiState]);

  // Scan execution
  const handleScannedData = async (payload) => {
    let backendResult = null;

    try {
      const response = await axios.post(ANALYZE_ENDPOINT, {
        payload,
        lang: voiceLang,
      });

      if (response.data) {
        backendResult = response.data;
      }
    } catch (err) {
      console.warn("Backend error or unreachable endpoint.", err);
    } finally {
      runAnalysis(backendResult);
    }
  };

  // Replay Backend Voice Only
  const handleReplayVoice = async () => {
    if (!lastResult) return;

    try {
      const response = await axios.post(ANALYZE_ENDPOINT, {
        payload: lastResult.url || urlInput,
        lang: voiceLang,
      });

      if (response.data && response.data.audio_base64) {
        playBackendAudio(response.data.audio_base64);
      }
    } catch (err) {
      console.error("Failed to fetch audio for replay:", err);
    }
  };

  return (
    <section id="demo" className="max-w-[1180px] mx-auto px-6 py-16 relative">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Input panel */}
        <div className="bg-[#141A26] border border-[#242D40] rounded-2xl p-7 relative">
          <label className="text-xs text-[#5B6479] font-semibold tracking-wider block">
            {t("label_url")}
          </label>
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/pay"
            className="w-full mt-2 bg-[#0D121B] border border-[#242D40] rounded-lg p-3 text-[#EAEEF6] font-mono text-xs outline-none focus:border-[#4C7CF3]"
          />

          <label className="text-xs text-[#5B6479] font-semibold tracking-wider block mt-5">
            {t("label_image")}
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleUploadedFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-[#4C7CF3] bg-[#1E2A4A]"
                : "border-[#242D40] hover:bg-[#1B2333]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUploadedFile(e.dataTransfer.files?.[0])}
            />
            <UploadCloud size={20} className="text-[#5B6479] mx-auto mb-1.5" />
            <div className="text-xs text-[#8A94AA]">
              {fileName ? fileName : t("dropzone_text")}
            </div>
          </div>

          <button
            onClick={() => handleScannedData(urlInput)}
            disabled={uiState === "loading"}
            className="w-full mt-6 bg-[#4C7CF3] hover:bg-blue-600 disabled:bg-[#1B2333] disabled:opacity-70 text-white font-semibold text-sm py-3 rounded-lg transition-all active:scale-95 shadow-sm"
          >
            {uiState === "loading" ? t("btn_analyzing") : t("btn_run")}
          </button>
        </div>

        {/* Result panel */}
        <div
          className={`bg-[#141A26] border border-[#242D40] rounded-2xl p-7 min-h-[320px] flex flex-col ${
            uiState === "idle"
              ? "justify-center items-center"
              : "justify-between items-stretch"
          }`}
        >
          {uiState === "idle" && (
            <div className="text-center text-[#5B6479]">
              <ScanLine size={26} className="mx-auto mb-2" />
              <div className="text-sm">{t("idle_text")}</div>
            </div>
          )}

          {uiState === "loading" && (
            <div className="flex flex-col items-center justify-center flex-1 gap-3.5 my-auto">
              <div className="w-12 h-12 border-2 border-[#242D40] border-t-[#4C7CF3] rounded-full animate-spin" />
              <div className="text-xs font-mono text-[#8A94AA] text-center">
                {t("loading_text")}
              </div>
            </div>
          )}

          {uiState === "done" &&
            lastResult &&
            (() => {
              const meta = verdictMeta(lastResult.verdict, currentLang);
              const VIcon = meta.Icon;
              const tamperBgColor =
                lastResult.tamper > 40
                  ? "bg-[#FF4D5E]"
                  : lastResult.tamper > 15
                  ? "bg-[#FFB13D]"
                  : "bg-[#2FD67C]";

              return (
                <div className="animate-fadeIn">
                  <div className="flex justify-end gap-2 mb-4 flex-wrap items-center">
                    <select
                      value={voiceLang}
                      onChange={(e) => {
                        stopAudio();
                        onVoiceLangChange(e.target.value);
                      }}
                      title={t("voice_lang_label")}
                      className="bg-[#0D121B] border border-[#242D40] text-xs text-[#EAEEF6] px-2.5 py-1 rounded-md cursor-pointer outline-none focus:border-[#4C7CF3]"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी</option>
                      <option value="mr">मराठी</option>
                    </select>

                    <button
                      onClick={handleReplayVoice}
                      className="inline-flex items-center gap-1.5 bg-[#0D121B] border border-[#242D40] hover:bg-[#1B2333] text-[#8A94AA] text-xs px-2.5 py-1 rounded-md transition-colors"
                    >
                      <Volume2 size={13} /> {t("result_replay")}
                    </button>

                    <button
                      onClick={() => {
                        stopAudio();
                        toggleVoice();
                      }}
                      className={`inline-flex items-center gap-1.5 border text-xs px-2.5 py-1 rounded-md transition-colors ${
                        voiceOn
                          ? "bg-[#1E2A4A] border-[#4C7CF3]/35 text-[#4C7CF3]"
                          : "bg-[#0D121B] border-[#242D40] text-[#8A94AA]"
                      }`}
                    >
                      {voiceOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
                      {voiceOn ? t("result_voice_on") : t("result_voice_off")}
                    </button>
                  </div>

                  <div className="flex gap-6 items-center flex-wrap">
                    <div className="relative w-44 h-44 shrink-0">
                      <Gauge score={lastResult.score} color={meta.color} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-3xl font-bold text-[#EAEEF6] leading-none">
                          {lastResult.score}
                        </span>
                        <span className="text-[11px] text-[#5B6479] tracking-wider mt-1">
                          {t("result_risk_label")}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: meta.soft,
                          color: meta.color,
                          borderColor: `${meta.color}44`,
                        }}
                      >
                        <VIcon size={14} /> {meta.label}
                      </div>

                      <div className="mt-2.5 font-mono text-xs text-[#8A94AA] break-all max-w-[240px]">
                        {lastResult.url}
                      </div>

                      <div className="mt-3">
                        <div className="text-[11px] text-[#5B6479] mb-1">
                          {t("result_tamper_label")}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-25 h-1.5 bg-[#1B2331] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${tamperBgColor}`}
                              style={{ width: `${lastResult.tamper}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-[#8A94AA]">
                            {lastResult.tamper}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation Insight Box */}
                  {lastResult.ai_explanation && (
                    <div className="mt-4 p-3 bg-[#0D121B] rounded-xl border border-[#4C7CF3]/30">
                      <div className="flex items-center gap-1.5 text-[#4C7CF3] font-semibold text-xs tracking-wider mb-1">
                        <Sparkles size={14} /> AI SECURITY INSIGHT
                      </div>
                      <p className="text-xs text-[#EAEEF6] italic leading-relaxed">
                        "{lastResult.ai_explanation}"
                      </p>
                    </div>
                  )}

                  <div className="mt-5.5 border-t border-[#1B2331] pt-4.5">
                    <div className="text-xs text-[#5B6479] font-semibold tracking-wider mb-2.5">
                      {t("result_why")}
                    </div>
                    <div className="flex flex-col gap-2.25">
                      {lastResult.reasonItems &&
                        lastResult.reasonItems.map((r, i) => {
                          const text =
                            r.key === "keyword"
                              ? d.reasons?.keyword?.(r.param)
                              : d.reasons?.[r.key];
                          return (
                            <div key={i} className="flex gap-2 items-start">
                              {r.ok ? (
                                <CircleCheck
                                  size={15}
                                  className="text-[#2FD67C] mt-0.5 shrink-0"
                                />
                              ) : (
                                <CircleAlert
                                  size={15}
                                  className="text-[#FF4D5E] mt-0.5 shrink-0"
                                />
                              )}
                              <span className="text-xs text-[#8A94AA] leading-relaxed">
                                {text || r.param || "Detail analyzed."}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      </div>
    </section>
  );
}

export default LiveDemo;