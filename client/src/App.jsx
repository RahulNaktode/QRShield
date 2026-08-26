import { BrowserRouter, Routes, Route } from "react-router"; // Fixed import
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import About from "./pages/About.jsx";
import LiveScanner from "./pages/LiveScan.jsx";
import ScanHistory from "./pages/ScanHistory.jsx";
import LiveDemo from "./pages/UrlAbdImg.jsx";
import { I18N } from "./data/i18n.js";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const [currentLang, setCurrentLang] = useState("en");
  const d = I18N?.[currentLang] || I18N?.en || {};
  const t = (key) => d?.[key] || key;

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0A0E15] flex flex-col">
        {/* 1. Header: Highest z-index, Screen ke absolute top par */}
        <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-[#0A0E15] border-b border-[#1B2331]">
          <Header
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            t={t}
          />
        </header>

        {/* 2. Main Container: Header ki height (pt-16) chhodge */}
        <div className="flex flex-1 pt-16 relative">
          <Sidebar
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            t={t}
          />

          <main className="flex-1 lg:ml-64 transition-all duration-300 min-w-0 p-4">
            <Routes>
              <Route path="/" element={<About t={t} currentLang={currentLang} />} />
              <Route path="/live" element={<LiveScanner t={t} currentLang={currentLang} />} />
              <Route path="/scanhistory" element={<ScanHistory t={t} currentLang={currentLang} />} />
              <Route path="/urls" element={<LiveDemo t={t} currentLang={currentLang} />} />
              <Route path="/dashborad" element={<Dashboard t={t} currentLang={currentLang} />} />
              <Route
                path="*"
                element={
                  <div className="text-white text-center mt-20">
                    <h1 className="text-2xl font-semibold mb-2">404</h1>
                    <p className="text-gray-400">{t("pageNotFound") || "Page not found"}</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;