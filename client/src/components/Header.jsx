import { useState } from "react";
import { Link } from "react-router"; // Fixed: Standard React Router DOM import
import { ScanLine, Menu, X } from "lucide-react";

function Header({ currentLang = "en", onLanguageChange = () => {}, t = (k) => k }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Safe Language Handler
  const handleSelectChange = (e) => {
    const selectedLang = e.target.value;
    if (typeof onLanguageChange === "function") {
      onLanguageChange(selectedLang);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[#1B2331] bg-[#0A0E15]/85 backdrop-blur-md">
      {/* Main Header Container */}
      <div className="flex items-center justify-between px-5 md:px-10 py-5 gap-4">
        
        {/* Left: Logo Section */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-[30px] h-[30px] rounded-[7px] bg-[#1E2A4A] border border-[#4C7CF3]/35 flex items-center justify-center text-[#4C7CF3] flex-shrink-0">
            <ScanLine size={16} strokeWidth={2.2} />
          </div>
          <span className="font-mono font-bold text-[15px] select-none text-[#EAEEF6]">
            QRShield
          </span>
        </Link>

        {/* Center: Desktop Router Links */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#8A94AA]">
          <Link to="/" className="hover:text-white transition-colors">Live</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/urls" className="hover:text-white transition-colors">LiveDemo</Link>
          <Link to="/scanhistory" className="hover:text-white transition-colors">Scan-History</Link>
        </div>

        {/* Right: Actions Section */}
        <div className="flex items-center gap-3">
          {/* Working Language Selector */}
          <select
            value={currentLang}
            onChange={handleSelectChange}
            aria-label="Select Language"
            className="bg-[#141A26] border border-[#242D40] text-sm px-2 py-2 md:px-2.5 md:py-2.5 rounded-lg cursor-pointer text-[#EAEEF6] outline-none focus:border-[#4C7CF3]"
          >
            <option value="en" className="bg-[#141A26] text-[#EAEEF6]">English</option>
            <option value="hi" className="bg-[#141A26] text-[#EAEEF6]">हिंदी</option>
            <option value="mr" className="bg-[#141A26] text-[#EAEEF6]">मराठी</option>
            <option value="te" className="bg-[#141A26] text-[#EAEEF6]">తెలుగు</option>
            <option value="ta" className="bg-[#141A26] text-[#EAEEF6]">தமிழ்</option>
          </select>

          {/* Analyse Button */}
          <button
            onClick={() =>
              document.getElementById("demo")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="bg-[#4C7CF3] hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 md:px-5 md:py-3 rounded-lg transition-all active:scale-95 text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
          >
            {t("header_cta")}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden text-[#8A94AA] hover:text-white transition-colors p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1B2331] bg-[#0A0E15] animate-fadeIn">
          <nav className="flex flex-col items-center gap-5 py-6 text-sm text-[#8A94AA] font-medium">
            <Link to="/about" onClick={closeMenu} className="hover:text-white transition-colors">About</Link>
            <Link to="/scanhistory" onClick={closeMenu} className="hover:text-white transition-colors">Scan-History</Link>
            <Link to="/live" onClick={closeMenu} className="hover:text-white transition-colors">Live</Link>
            <Link to="/urls" onClick={closeMenu} className="hover:text-white transition-colors">LiveDemo</Link>
            
            <hr className="w-11/12 border-[#1B2331] my-1" />

            <a href="#how" className="hover:text-white transition-colors" onClick={closeMenu}>
              {t("nav_how")}
            </a>
            <a href="#demo" className="hover:text-white transition-colors" onClick={closeMenu}>
              {t("nav_demo")}
            </a>
            <a href="#features" className="hover:text-white transition-colors" onClick={closeMenu}>
              {t("nav_features")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;