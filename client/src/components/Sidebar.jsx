import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ScanLine,
  LayoutDashboard,
  History,
  Radio,
  ExternalLink,
  Info,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  X,
} from "lucide-react";

function Sidebar({ currentLang = "en", onLanguageChange = () => {} }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashborad", path: "/dashborad", icon: LayoutDashboard },
    { label: "Live Scanner", path: "/live", icon: Radio },
    { label: "Live Demo URLs", path: "/urls", icon: ExternalLink },
    { label: "Scan History", path: "/scanhistory", icon: History },
  ];

  const handleLangChange = (e) => {
    if (typeof onLanguageChange === "function") {
      onLanguageChange(e.target.value);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Trigger Bar */}
      <div className="lg:hidden fixed top-25 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 rounded-xl bg-[#141A26] border border-[#242D40] text-[#EAEEF6] hover:bg-[#1E2738] transition-colors shadow-lg"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-1 z-40 h-[calc(100vh-4rem)] bg-[#0A0E15] border-r border-[#1B2331] text-[#EAEEF6] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${
          isMobileOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#1B2331]">
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-xs font-semibold text-[#8A94AA] uppercase tracking-wider">
                Navigation
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg bg-[#141A26] border border-[#242D40] text-[#8A94AA] hover:text-white transition-colors ml-auto"
              aria-label="Toggle Sidebar Collapse"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    active
                      ? "bg-[#4C7CF3]/15 text-[#4C7CF3] border border-[#4C7CF3]/30"
                      : "text-[#8A94AA] hover:bg-[#141A26] hover:text-[#EAEEF6]"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <Icon
                    size={19}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-[#4C7CF3]" : "text-[#8A94AA] group-hover:text-[#EAEEF6]"
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Language & Status */}
        <div className="p-3 border-t border-[#1B2331] space-y-3">
          {(!isCollapsed || isMobileOpen) ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#8A94AA] px-1 uppercase tracking-wider">
                Language
              </label>
              <select
                value={currentLang}
                onChange={handleLangChange}
                aria-label="Select Language"
                className="w-full bg-[#141A26] border border-[#242D40] text-sm px-3 py-2 rounded-xl text-[#EAEEF6] outline-none focus:border-[#4C7CF3] cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          ) : (
            <div className="flex justify-center py-1" title="Language Selector">
              <span className="text-xs font-mono uppercase text-[#4C7CF3] font-bold bg-[#141A26] px-2 py-1 rounded border border-[#242D40]">
                {currentLang}
              </span>
            </div>
          )}

          {(!isCollapsed || isMobileOpen) && (
            <div className="p-3 rounded-xl bg-[#141A26]/60 border border-[#242D40] flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Shield size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#EAEEF6]">Protection Active</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Realtime Engines
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;