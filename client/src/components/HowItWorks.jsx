import {
  UploadCloud,
  QrCode,
  Link2,
  Fingerprint,
  Cpu,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Sparkles
} from "lucide-react";

import FlowBox from "./FlowBox";

function HowItWorks({ t }) {
  return (
    <section id="how" className="max-w-[1180px] mx-auto px-6 py-16">
      {/* Header Section */}
      <div className="mb-12 text-center max-w-2xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-full shadow-sm shadow-cyan-500/10">
          <Sparkles size={13} className="animate-pulse" />
          {t("how_eyebrow") || "Detection Pipeline"}
        </span>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight leading-tight">
          {t("how_h2") || "How Our AI Engine Protects You"}
        </h2>
        
        {t("how_sub") && (
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            {t("how_sub")}
          </p>
        )}
      </div>

      {/* Process Flow Card Container */}
      <div className="relative bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 sm:p-10 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-sm">
        
        {/* Ambient Light Accent */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Pipeline Steps Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-3 relative z-10">
          
          {/* Step 1: Upload */}
          <FlowBox
            Icon={UploadCloud}
            title={t("flow_upload_title")}
            sub={t("flow_upload_sub")}
            accent
          />

          {/* Connection Arrow 1 */}
          <div className="flex items-center justify-center text-slate-500 my-1 lg:my-0">
            <ChevronRight
              size={22}
              className="rotate-90 lg:rotate-0 text-cyan-400/80 animate-pulse"
            />
          </div>

          {/* Step 2: Decode */}
          <FlowBox
            Icon={QrCode}
            title={t("flow_decode_title")}
            sub={t("flow_decode_sub")}
          />

          {/* Connection Arrow 2 */}
          <div className="flex items-center justify-center text-slate-500 my-1 lg:my-0">
            <ChevronRight
              size={22}
              className="rotate-90 lg:rotate-0 text-cyan-400/80 animate-pulse"
            />
          </div>

          {/* Step 3: Dual Analysis Module */}
          <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl transition-colors duration-200 hover:border-slate-700">
            <FlowBox
              Icon={Link2}
              title={t("flow_url_title")}
              sub={t("flow_url_sub")}
            />

            <span className="font-mono text-sm font-bold text-cyan-400 px-1 select-none">+</span>

            <FlowBox
              Icon={Fingerprint}
              title={t("flow_image_title")}
              sub={t("flow_image_sub")}
            />
          </div>

          {/* Connection Arrow 3 */}
          <div className="flex items-center justify-center text-slate-500 my-1 lg:my-0">
            <ChevronRight
              size={22}
              className="rotate-90 lg:rotate-0 text-cyan-400/80 animate-pulse"
            />
          </div>

          {/* Step 4: AI Decision Engine */}
          <FlowBox
            Icon={Cpu}
            title={t("flow_engine_title")}
            sub={t("flow_engine_sub")}
            accent
          />
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-slate-800/80 my-8" />

        {/* Threat Level Interactive Status Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-mono font-medium px-4 py-1.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 transition-all duration-200 hover:scale-105 hover:bg-emerald-500/20 cursor-default">
            <ShieldCheck size={15} />
            {t("pill_safe")}
          </span>

          <span className="flex items-center gap-1.5 text-xs font-mono font-medium px-4 py-1.5 rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/30 transition-all duration-200 hover:scale-105 hover:bg-amber-500/20 cursor-default">
            <AlertTriangle size={15} />
            {t("pill_suspicious")}
          </span>

          <span className="flex items-center gap-1.5 text-xs font-mono font-medium px-4 py-1.5 rounded-full text-rose-400 bg-rose-500/10 border border-rose-500/30 transition-all duration-200 hover:scale-105 hover:bg-rose-500/20 cursor-default">
            <XCircle size={15} />
            {t("pill_dangerous")}
          </span>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;