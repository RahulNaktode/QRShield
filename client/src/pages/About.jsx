import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Code2, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { I18N } from "../data/i18n";
import Footer from '../components/Footer';

export default function About({ initialLang = 'en' }) {
  const [currentLang, setCurrentLang] = useState(initialLang);

  // Translation helper with I18N dictionary fallback
  const d = I18N?.[currentLang] || I18N?.en || {};
  const t = (key) => d?.[key] || key;

  const techStack = [
    { category: "Frontend Framework", name: "React.js" },
    { category: "Styling & UI", name: "Tailwind CSS & Lucide Icons" },
    { category: "Scanner Engine", name: "@zxing/library" },
    { category: "HTTP Client", name: "Axios" },
    { category: "Backend Architecture", name: "Node.js / FastAPI & AI API Integrations" },
    { category: "Voice System", name: "Dynamic Base64 TTS Engine" }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen w-full font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Navigation Header */}
      <Header 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang} 
        t={t} 
      />

      <main className="w-full flex-grow">
        {/* Main Hero Section */}
        <Hero t={t} />

        {/* Features Showcase */}
        <Features t={t} />

        {/* Workflow Component */}
        <HowItWorks t={t} />

        {/* Technology Architecture Section */}
        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Section Header */}
          <div className="mb-10 text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-full mb-3 shadow-sm shadow-cyan-500/10">
              <Cpu size={13} />
              {t("tech_stack_eyebrow") || "Engineered for Speed & Security"}
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center justify-center gap-2">
              <Code2 className="w-7 h-7 text-cyan-400" />
              <span>{t("tech_stack_h2") || "Technology Architecture"}</span>
            </h2>
          </div>

          {/* Grid Container */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techStack.map((tech, idx) => (
                <div 
                  key={idx} 
                  className="group flex items-center gap-3.5 bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-medium">
                      {tech.category}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                      {tech.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer t={t} />
    </div>
  );
}