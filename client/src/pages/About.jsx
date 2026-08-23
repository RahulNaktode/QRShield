import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Volume2, 
  Lock, 
  Code2, 
  CheckCircle2, 
  UserCheck
} from 'lucide-react';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { I18N } from "../data/i18n";
import Footer from '../components/Footer';

export default function About({ initialLang = 'en' }) {
  const [currentLang, setCurrentLang] = useState(initialLang);

  // Uses imported I18N dictionary fallback seamlessly
  const d = I18N?.[currentLang] || I18N?.en || {};
  const t = (key) => d?.[key] || key;

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: "AI Threat Detection",
      description: "Deep payload analysis using heuristic scanning to identify phishing URLs, dangerous downloads, and suspicious redirects instantly."
    },
    {
      icon: <Volume2 className="w-6 h-6 text-cyan-400" />,
      title: "Voice-Assisted Alerts",
      description: "Accessibility-first design providing instant real-time spoken feedback in English, Hindi, and Marathi."
    },
    {
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      title: "Privacy First Architecture",
      description: "Camera feed is processed client-side. No video frames or personal camera data are ever stored on external servers."
    }
  ];

  const techStack = [
    { category: "Frontend Framework", name: "React.js" },
    { category: "Styling & UI", name: "Tailwind CSS & Lucide Icons" },
    { category: "Scanner Engine", name: "@zxing/library" },
    { category: "HTTP Client", name: "Axios" },
    { category: "Backend Architecture", name: "Node.js / FastAPI & AI API Integrations" },
    { category: "Voice System", name: "Dynamic Base64 TTS Engine" }
  ];

  return (
    <div className="bg-[#0A0E15] text-[#EAEEF6] min-h-screen w-full font-sans selection:bg-[#4C7CF3] selection:text-white">
      {/* Passed missing language handler props to Header */}
      <Header 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang} 
        t={t} 
      />

      <div id="about" className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans flex flex-col items-center">
        
        <div className="max-w-6xl w-full space-y-12 py-6">
          
          <Hero t={t} />

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col items-start gap-4 hover:border-cyan-500/50 transition duration-300"
              >
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Reusable HowItWorks Component */}
          <HowItWorks t={t} />

          {/* Tech Stack Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-cyan-400" /> Technology Architecture
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techStack.map((tech, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{tech.category}</div>
                    <div className="text-xs font-semibold text-slate-200">{tech.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Component */}
          <Features t={t} />

          <Footer t={t} />

        </div>
      </div>
    </div>
  );
}