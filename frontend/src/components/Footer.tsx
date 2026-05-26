import { Link } from "react-router-dom";
import { ArrowRight, Share2, Globe } from "lucide-react";
import logoSvg from "../assets/logo.svg";

export default function Footer() {
  return (
    <footer className="bg-obsidian text-obsidian-on-surface w-full border-t border-white/5">
      <div className="max-w-5xl mx-auto px-margin-sm md:px-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">
          <div className="flex flex-col gap-element col-span-1 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src={logoSvg} alt="gifticker" className="w-6 h-6 brightness-0 invert" />
              <span className="font-serif text-[20px] tracking-tight text-white font-medium">gifticker</span>
            </div>
            <p className="font-sans text-body-sm text-obsidian-on-surface/60 max-w-xs leading-relaxed">
              Elevating the digital loop through intentional design, surgical transparency, and technical excellence.
            </p>
            <div className="flex gap-4 mt-2">
              <Share2 size={16} className="text-obsidian-on-surface/40 hover:text-primary transition-colors cursor-pointer" />
              <Globe size={16} className="text-obsidian-on-surface/40 hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-obsidian-on-surface/40">Directory</span>
            <div className="flex flex-col gap-2 font-mono text-[13px]">
              <Link to="/canvas" className="text-obsidian-on-surface/60 hover:text-primary transition-colors">Studio</Link>
              <Link to="/blog" className="text-obsidian-on-surface/60 hover:text-primary transition-colors">Blog Hub</Link>
              <Link to="/faq" className="text-obsidian-on-surface/60 hover:text-primary transition-colors">FAQ</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-obsidian-on-surface/40">Resources</span>
            <div className="flex flex-col gap-2 font-mono text-[13px]">
              <span className="text-obsidian-on-surface/60 hover:text-primary transition-colors cursor-pointer">API Docs</span>
              <span className="text-obsidian-on-surface/60 hover:text-primary transition-colors cursor-pointer">Security Spec</span>
              <span className="text-obsidian-on-surface/60 hover:text-primary transition-colors cursor-pointer">Privacy Protocol</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-obsidian-on-surface/40">Company</span>
            <div className="flex flex-col gap-2 font-mono text-[13px]">
              <span className="text-obsidian-on-surface/60 hover:text-primary transition-colors cursor-pointer">support@gifticker.com</span>
              <span className="text-obsidian-on-surface/60 hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
              <span className="text-obsidian-on-surface/60 hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-mono text-[12px]">
          <p className="text-obsidian-on-surface/40">
            &copy; 2026 gifticker. All rights reserved.
          </p>
          <div className="flex items-center gap-md">
            <span className="font-sans text-label-caps uppercase tracking-widest text-obsidian-on-surface/40 font-semibold">Subscribe</span>
            <div className="flex border-b border-white/10 pb-1">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-transparent font-sans text-body-sm text-white placeholder:text-obsidian-on-surface/20 outline-none w-40"
              />
              <button className="text-primary hover:text-primary-hover transition-colors">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
