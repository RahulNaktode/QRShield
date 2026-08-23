import {
  Camera,
  Eye,
  Wifi,
  Sparkles,
  Radar,
  Fingerprint,
} from "lucide-react";

const FEATURES = [
  { icon: Camera, titleKey: "f1t", bodyKey: "f1b" },
  { icon: Eye, titleKey: "f2t", bodyKey: "f2b" },
  { icon: Wifi, titleKey: "f3t", bodyKey: "f3b" },
  { icon: Sparkles, titleKey: "f4t", bodyKey: "f4b" },
  { icon: Radar, titleKey: "f5t", bodyKey: "f5b" },
  { icon: Fingerprint, titleKey: "f6t", bodyKey: "f6b" },
];

function Features({ t }) {
  return (
    <section id="features" className="max-w-[1180px] mx-auto px-6 py-16">
      {/* Header Section */}
      <div className="mb-10 text-left">
        <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
          {t("features_eyebrow")}
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-3 tracking-tight">
          {t("features_h2")}
        </h2>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, titleKey, bodyKey }) => (
          <div
            key={titleKey}
            className="group relative bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(6,182,212,0.12)] cursor-default overflow-hidden"
          >
            {/* Top-Right Ambient Light Accent on Hover */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-300" />

            {/* Animated Icon Box */}
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300 group-hover:scale-110">
              <Icon size={20} className="transition-transform duration-300 group-hover:rotate-6" />
            </div>

            {/* Feature Title */}
            <h3 className="text-sm font-semibold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors duration-200">
              {t(titleKey)}
            </h3>

            {/* Feature Description */}
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {t(bodyKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;