import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import axios from 'axios';
import { ShieldAlert, ShieldCheck, Camera, RefreshCw, Loader2, Sparkles, Globe } from 'lucide-react';
import Header from '../components/Header';
import { I18N } from "../data/i18n";
import Footer from '../components/Footer';


export default function App({ initialLang = "en" }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [lastPayload, setLastPayload] = useState('');
  
  // Translation helper setup
  const d = I18N?.[currentLang] || I18N?.en || {};
  const t = (key) => d?.[key] || key;

  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!scanning || result) return;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);

    const codeReader = new BrowserMultiFormatReader(hints, 300);
    codeReaderRef.current = codeReader;

    codeReader.decodeFromVideoDevice(null, videoRef.current, (res, err) => {
      if (res) {
        codeReader.reset();
        setScanning(false);
        setLastPayload(res.getText());
        handleScannedData(res.getText(), currentLang);
      }
    }).catch((err) => {
      console.error("Camera access error:", err);
    });

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [scanning, result, currentLang]);

  const handleScannedData = async (payload, lang) => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze-qr', { 
        payload,
        lang: lang
      });
      
      setResult(response.data);

      if (response.data.audio_base64 && audioRef.current) {
        audioRef.current.src = `data:audio/mp3;base64,${response.data.audio_base64}`;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
    } catch (err) {
      alert("Error sending QR data to backend!");
      restartScanner();
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Language Switch Handler (Syncs Header and Voice language)
  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);

    // If result is already present, re-fetch analysis audio in new language
    if (result && lastPayload) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      handleScannedData(lastPayload, newLang);
    }
  };

  const restartScanner = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setResult(null);
    setLastPayload('');
    setScanning(true);
  };

  return (
    <div className="bg-[#0A0E15] text-[#EAEEF6] min-h-screen w-full font-sans selection:bg-[#4C7CF3] selection:text-white flex flex-col">
      
      
      <div className="flex-1 bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans">
        <audio ref={audioRef} />

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center transition-all duration-300">
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white text-center">
              QRShield <span className="text-cyan-400">Live</span>
            </h1>
          </div>
          <p className="text-slate-400 text-xs text-center mb-4">
            AI-Powered QR Threat Detection
          </p>

          {/* Language Selection Header Bar */}
          <div className="w-full flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-4">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" /> Select Voice Language:
            </span>
            <select
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-900 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer focus:border-cyan-400 transition"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Camera / Scanner Container */}
          <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-700 flex items-center justify-center mb-5 shadow-inner">
            
            <video 
              ref={videoRef} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${scanning ? 'opacity-100' : 'opacity-0'}`} 
            />
            
            {scanning && !loading && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
                <div className="w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#00f2fe] animate-scanline"></div>
                <div className="flex justify-between items-center text-xs text-cyan-400 bg-slate-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full mx-auto font-mono tracking-wide border border-cyan-500/30">
                  <Camera className="w-4 h-4 mr-2 animate-pulse" /> ALIGN QR CODE...
                </div>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 gap-3">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                <p className="text-cyan-400 text-sm font-medium animate-pulse">Analyzing Payload...</p>
              </div>
            )}

            {result && !loading && (
              <div className={`absolute inset-0 z-30 p-5 flex flex-col transition-opacity duration-300 overflow-y-auto ${result.is_threat ? 'bg-red-950/95' : 'bg-emerald-950/95'} backdrop-blur-sm`}>
                
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10 shrink-0">
                  {result.is_threat ? 
                    <ShieldAlert className="w-12 h-12 text-red-400 flex-shrink-0" /> : 
                    <ShieldCheck className="w-12 h-12 text-emerald-400 flex-shrink-0" />
                  }
                  <div className="flex-grow">
                    <h3 className="font-extrabold text-lg leading-tight text-white">
                      {result.is_threat ? "DANGER DETECTED" : "SCAN SAFE"}
                    </h3>
                    <p className={`text-[10px] font-medium px-2 py-0.5 inline-block rounded ${result.is_threat ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {result.is_threat ? "High Risk" : "Low Risk"}
                    </p>
                  </div>
                </div>

                <div className="mb-3 shrink-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-300">Integrity Score</span>
                    <span className={`text-base font-bold ${result.is_threat ? 'text-red-400' : 'text-emerald-400'}`}>
                      {100 - result.risk_score}<span className="text-xs text-slate-400">/100</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 border border-slate-600">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${result.is_threat ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${100 - result.risk_score}%` }}
                    ></div>
                  </div>
                </div>

                {result.ai_explanation && (
                  <div className="p-2.5 bg-black/50 rounded-lg border border-cyan-500/40 mb-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px] tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI SECURITY INSIGHT
                    </div>
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "{result.ai_explanation}"
                    </p>
                  </div>
                )}

                <div className="text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/10 mb-3 break-all font-mono text-slate-300 shrink-0">
                  <strong className="text-white">Payload:</strong> {result.payload?.length > 80 ? result.payload.substring(0, 80) + '...' : result.payload}
                </div>

                {result.reasons && result.reasons.length > 0 && (
                  <div className="overflow-y-auto flex-grow pr-1">
                    <ul className="text-xs list-disc pl-4 text-slate-200 space-y-1">
                      {result.reasons.map((r, idx) => <li key={idx} className="leading-relaxed">{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {!scanning && !loading && (
            <button 
              onClick={restartScanner}
              className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl flex items-center justify-center gap-2.5 transition duration-150 active:scale-95 cursor-pointer shadow-lg text-sm"
            >
              <RefreshCw className="w-4 h-4" /> TAP TO RE-SCAN
            </button>
          )}
          
          {scanning && (
            <div className="w-full text-center text-xs text-slate-500 pt-1 font-mono">
              Waiting for QR...
            </div>
          )}

        </div>
      </div>
      <Footer t={t} />
    </div>
  );
}