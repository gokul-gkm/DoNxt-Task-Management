import { type FC, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MenuIcon, CloseIcon } from "./icons";
import { navLinks } from "../../data/landingData";

const LandingNavbar: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
    );
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/70 py-3 shadow-sm"
          : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9L7.5 13.5L15 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-black text-gray-900 tracking-tight">DoNxt</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="/auth/sign-in" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-4 py-2">
            Sign in
          </a>
          <a
            href="/auth/sign-up"
            className="text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-md shadow-blue-200"
          >
            Start free →
          </a>
        </div>

        <button
          type="button"
          className="md:hidden text-gray-500 hover:text-gray-800 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
            <a href="/auth/sign-in" className="text-sm font-medium text-gray-600 text-center py-2.5 border border-gray-200 rounded-xl hover:border-blue-400 transition-colors">
              Sign in
            </a>
            <a href="/auth/sign-up" className="text-sm font-bold text-white text-center bg-blue-500 py-3 rounded-xl shadow-md shadow-blue-200">
              Start free →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
