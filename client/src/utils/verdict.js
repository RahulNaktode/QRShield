import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

/**
 * Returns metadata (label, colors, icon) based on the scan verdict and selected language.
 *
 * @param {string} verdict - 'safe' | 'suspicious' | 'dangerous'
 * @param {string} [lang='en'] - Language code (e.g., 'en', 'hi', 'mr', 'te', 'ta')
 * @returns {Object} Verdict metadata object containing label, colors, and Lucide Icon component
 */
export function verdictMeta(verdict, lang = "en") {
  // Multilingual labels for verdicts
  const labels = {
    safe: {
      en: "SAFE",
      hi: "सुरक्षित",
      mr: "सुरक्षित",
      te: "సురక్షితం",
      ta: "பாதுகாப்பானது",
    },
    suspicious: {
      en: "SUSPICIOUS",
      hi: "संदेहास्पद",
      mr: "संशयास्पद",
      te: "అనుమానాస్పదం",
      ta: "சந்தேகத்திற்குரியது",
    },
    dangerous: {
      en: "DANGEROUS",
      hi: "खतरनाक",
      mr: "धोकादायक",
      te: "ప్రమాదకరం",
      ta: "அபாயகரமானது",
    },
  };

  switch (verdict) {
    case "safe":
      return {
        label: labels.safe[lang] || labels.safe.en,
        color: "#2FD67C", // Green
        soft: "rgba(47, 214, 124, 0.12)", // Soft green background
        Icon: ShieldCheck,
      };

    case "suspicious":
      return {
        label: labels.suspicious[lang] || labels.suspicious.en,
        color: "#FFB13D", // Yellow / Warning Orange
        soft: "rgba(255, 177, 61, 0.12)", // Soft orange background
        Icon: AlertTriangle,
      };

    case "dangerous":
    default:
      return {
        label: labels.dangerous[lang] || labels.dangerous.en,
        color: "#FF4D5E", // Red / Danger
        soft: "rgba(255, 77, 94, 0.12)", // Soft red background
        Icon: ShieldAlert,
      };
  }
}