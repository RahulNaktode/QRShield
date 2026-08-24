import {
  Camera,
  ShieldAlert,
  IndianRupee,
  Sparkles,
  WifiOff,
  ScanLine,
  Cpu,
  Volume2,
  Lock,
} from "lucide-react";

const FEATURES = [
  { icon: Camera, titleKey: "f1t", bodyKey: "f1b" },
  { icon: ShieldAlert, titleKey: "f2t", bodyKey: "f2b" },
  { icon: IndianRupee, titleKey: "f3t", bodyKey: "f3b" },
  { icon: Sparkles, titleKey: "f4t", bodyKey: "f4b" },
  { icon: WifiOff, titleKey: "f5t", bodyKey: "f5b" },
  { icon: ScanLine, titleKey: "f6t", bodyKey: "f6b" },
  { icon: Cpu, titleKey: "f7t", bodyKey: "f7b" },
  { icon: Volume2, titleKey: "f8t", bodyKey: "f8b" },
  { icon: Lock, titleKey: "f9t", bodyKey: "f9b" },
];

function Features({ t }) {
  return (
    <section id="features" className="max-w-[1240px] mx-auto px-4 sm:px-6 py-20 relative">
      {/* Background Decorative Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Section */}
      <div className="mb-14 text-center max-w-2xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-full shadow-sm shadow-cyan-500/10">
          <Sparkles size={13} className="animate-pulse" />
          {t("features_eyebrow") || "Capabilities"}
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight leading-tight">
          {t("features_h2") || "Built for How QR Scams Actually Work"}
        </h2>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {FEATURES.map(({ icon: Icon, titleKey, bodyKey }) => (
          <div
            key={titleKey}
            className="group relative bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-10px_rgba(6,182,212,0.15)] cursor-default overflow-hidden backdrop-blur-xl flex flex-col justify-between"
          >
            {/* Top Border Gradient Highlight on Hover */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/0 group-hover:via-cyan-500/50 to-transparent transition-all duration-500" />
            
            {/* Top-Right Ambient Accent */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-300" />

            <div>
              {/* Icon Container */}
              <div className="w-11 h-11 rounded-xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-400 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-cyan-500/20">
                <Icon size={22} className="transition-transform duration-300 group-hover:rotate-6" />
              </div>

              {/* Feature Title */}
              <h3 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors duration-200 tracking-tight">
                {t(titleKey)}
              </h3>

              {/* Feature Description */}
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                {t(bodyKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;