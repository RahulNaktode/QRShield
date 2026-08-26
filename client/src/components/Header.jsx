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
    <header className="sticky top-0 z-20 border-b border-[#1B2331] bg-[#0A0E15]/85 backdrop-blur-md mx-15">
      {/* Main Header Container */}
      <div className="flex items-center justify-between px-5 md:px-10 py-2 gap-4">
        
        {/* Left: Logo Section */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-[30px] h-[30px] mx-2 rounded-[7px] bg-[#1E2A4A] border border-[#4C7CF3]/35 flex items-center justify-center text-[#4C7CF3] flex-shrink-0">
            <ScanLine size={28} strokeWidth={2.2} />
          </div>
          <span className="font-mono font-bold text-3xl select-none text-[#EAEEF6]">
            QRShield
          </span>
        </Link>

        

        {/* Right: Actions Section */}
        <div className="flex items-center gap-7">
          <Link to='/' className="text-white">About Us</Link>
          <select
            value={currentLang}
            onChange={handleSelectChange}
            aria-label="Select Language"
            className="bg-[#141A26] border border-[#242D40] text-lg px-2 py-2 md:px-4 md:py-3 rounded-lg cursor-pointer text-[#EAEEF6] outline-none focus:border-[#4C7CF3]"
          >
            <option value="en" className="bg-[#141A26] text-[#EAEEF6]">English</option>
            <option value="hi" className="bg-[#141A26] text-[#EAEEF6]">हिंदी</option>
            <option value="mr" className="bg-[#141A26] text-[#EAEEF6]">मराठी</option>
            <option value="te" className="bg-[#141A26] text-[#EAEEF6]">తెలుగు</option>
            <option value="ta" className="bg-[#141A26] text-[#EAEEF6]">தமிழ்</option>
          </select>

          {/* Analyse Button */}
          <Link
            to={'/live'}
            className="bg-[#4C7CF3] hover:bg-blue-600 text-white font-semibold text-lg px-4 py-2.5 md:px-5 md:py-3 rounded-lg transition-all active:scale-95 text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
          >
            {t("header_cta")}
          </Link>

         
        </div>
      </div>

      
    </header>
  );
}

export default Header;