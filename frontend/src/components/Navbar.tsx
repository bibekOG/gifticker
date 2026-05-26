import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import logoSvg from "../assets/logo.svg";

const links = [
  { to: "/", label: "Home" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 border-b border-hairline">
      <div className="flex justify-between items-center px-margin-sm md:px-page h-16 max-w-max-width mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSvg} alt="gifticker" className="w-7 h-7" />
          <span className="font-serif text-headline-lg text-ink tracking-tight">gifticker</span>
        </Link>
        <nav className="hidden md:flex items-center gap-gutter">
          {links.map((l) => {
            const isActive = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative font-sans text-label-caps uppercase tracking-widest pb-1 transition-colors ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-md">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <button
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="md:hidden border-t border-hairline bg-surface"
          >
            <div className="flex flex-col px-margin-sm py-element gap-sm">
              {links.map((l) => {
                const isActive = pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`font-sans text-label-caps uppercase tracking-widest py-sm ${
                      isActive ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
