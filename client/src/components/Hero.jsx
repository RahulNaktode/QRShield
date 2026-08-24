import { QrCode, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

function Hero({ t }) {
  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Column: Text & CTA */}
      <div className="lg:col-span-7 flex flex-col items-start z-10">
        
        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold px-3.5 py-1.5 rounded-full font-mono mb-6 backdrop-blur-md shadow-sm shadow-cyan-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          {t("badge_tag") || "QUISHING DEFENSE SYSTEM"}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.12]">
          {t("h1_line1") || "Scan the code."}
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {t("h1_line2") || "Not the trap."}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm sm:text-base mt-6 leading-relaxed max-w-xl">
          {t("hero_sub")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-8 w-full sm:w-auto">
          <button
            onClick={() =>
              document
                .getElementById("demo")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-7 py-3.5 rounded-xl transition-all duration-200 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          >
            <span>{t("btn_analyze") || "Analyze a QR code"}</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() =>
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 active:scale-95 backdrop-blur-sm"
          >
            {t("btn_seehow") || "See how it works"}
          </button>
        </div>

        {/* Trust Indicator */}
        <div className="mt-10 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <ShieldCheck size={15} className="text-cyan-400" />
          <span>{t("strip_label") || "Cross-checked against live threat-intelligence feeds"}</span>
        </div>
      </div>

      {/* Right Column: Interactive Graphic / Viewfinder */}
      <div className="lg:col-span-5 z-10 w-full max-w-md mx-auto lg:max-w-none">
        <div className="relative aspect-square bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-xl group hover:border-slate-700/80 transition-all duration-300">
          
          {/* Background Grid Accent */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
          
          {/* Center Glow */}
          <div className="absolute w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Viewfinder Frame */}
          <div className="relative w-[68%] h-[68%] flex items-center justify-center p-4">
            
            {/* Corner Markers */}
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br" />

            {/* Scanning Laser Line */}
            <div className="absolute inset-x-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_2px_rgba(34,211,238,0.8)] animate-pulse" />

            {/* Target QR Icon */}
            <QrCode size={96} strokeWidth={1} className="text-slate-600 transition-colors duration-300 group-hover:text-slate-500" />
          </div>

          {/* Viewfinder Status Label */}
          <div className="absolute bottom-5 font-mono text-[10px] sm:text-[11px] text-cyan-400/90 tracking-widest uppercase text-center px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-inner">
            {t("viewfinder_label") || "AWAITING INPUT — DROP A QR IMAGE BELOW"}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;