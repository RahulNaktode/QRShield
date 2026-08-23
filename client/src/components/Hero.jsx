import { Radar, QrCode } from "lucide-react";

function Hero({ t }) {
  return (
    <section className="max-w-[1180px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
      {/* Left Column: Text & CTA */}
      <div>
        <div className="inline-flex items-center gap-2 bg-[#3A1626]/80 border border-[#FF3B6B]/40 text-[#FF3B6B] text-xs font-semibold px-3 py-1 rounded-full font-mono mb-6 backdrop-blur-sm shadow-[0_0_12px_rgba(255,59,107,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B6B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3B6B]"></span>
          </span>
          {t("badge_tag")}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#EAEEF6] tracking-tight leading-[1.15]">
          {t("h1_line1")}
          <br />
          <span className="bg-gradient-to-r from-[#EAEEF6] via-[#EAEEF6] to-[#8A94AA] bg-clip-text text-transparent">
            {t("h1_line2")}
          </span>
        </h1>

        <p className="text-[#8A94AA] text-base mt-5 leading-relaxed max-w-lg">
          {t("hero_sub")}
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={() =>
              document
                .getElementById("demo")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#4C7CF3] hover:bg-[#3B6BE2] text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(76,124,243,0.3)] hover:shadow-[0_0_25px_rgba(76,124,243,0.5)]"
          >
            {t("btn_analyze")}
          </button>

          <button
            onClick={() =>
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#0D121B]/60 border border-[#242D40] hover:bg-[#141A26] hover:border-[#37435D] text-[#EAEEF6] font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 active:scale-95"
          >
            {t("btn_seehow")}
          </button>
        </div>
      </div>

      {/* Right Column: Interactive Graphic / Scanner */}
      <div className="relative aspect-square bg-[#0D121B] border border-[#1B2331] rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(#1B2331_1px,transparent_1px),linear-gradient(90deg,#1B2331_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Ambient Glow Center */}
        <div className="absolute w-48 h-48 bg-[#4C7CF3]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Viewfinder Target Area */}
        <div className="relative w-[72%] h-[72%] flex items-center justify-center">
          {/* Target Corners */}
          <span className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-[#4C7CF3] rounded-tl-sm" />
          <span className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-[#4C7CF3] rounded-tr-sm" />
          <span className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-[#4C7CF3] rounded-bl-sm" />
          <span className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-[#4C7CF3] rounded-br-sm" />

          {/* Vertical Scanning Laser Line */}
          <div className="absolute left-1 right-1 h-[2px] bg-gradient-to-r from-transparent via-[#FF3B6B] to-transparent shadow-[0_0_15px_3px_rgba(255,59,107,0.7)] animate-bounce" />

          {/* Center Target Icon */}
          <QrCode size={80} strokeWidth={1.1} className="text-[#5B6479]/80" />
        </div>

        {/* Status Label */}
        <div className="absolute bottom-4 font-mono text-[11px] text-[#5B6479] tracking-widest uppercase text-center px-3 bg-[#0D121B]/80 py-1 rounded border border-[#1B2331]/50 backdrop-blur-sm">
          {t("viewfinder_label")}
        </div>
      </div>
    </section>
  );
}

export default Hero;