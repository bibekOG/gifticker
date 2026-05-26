import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { subscribeNewsletter } from "../services/newsletter";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: "Where is my data processed?",
    a: "All extraction processes occur in localized, ephemeral instances within our primary processing cluster. We utilize zero-knowledge architecture, meaning your source files are never written to permanent storage; they reside solely in secure volatile memory for the duration of the conversion.",
  },
  {
    q: "How does the extraction engine work?",
    a: "Our proprietary engine utilizes a \"Frame-Analysis-Synthesis\" loop. It identifies key-frame transition points to ensure fluid animation while applying a dithering algorithm that mimics the aesthetic of high-end editorial print. The result is a digital asset that retains the weight and intention of its source material.",
  },
  {
    q: "What are the export limits?",
    a: "Standard accounts are permitted 12 high-fidelity exports per 24-hour cycle. This limit ensures that our computational resources remain dedicated to maintaining our stringent quality standards for all users. Enterprise tiering allows for unthrottled batch processing via our dedicated API.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterEmail("");
    } catch {
      // Newsletter subscription is best-effort; no user-facing error needed
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary-fixed">
      <Navbar />
      <main className="flex-grow pt-32 pb-section px-margin-sm md:px-page">
        <div className="max-w-[760px] mx-auto">
          {/* Header Section */}
          <header className="mb-16">
            <span className="font-sans text-label-caps text-primary uppercase mb-4 block tracking-widest">Protocol &amp; Standards</span>
            <h1 className="font-serif text-[42px] md:text-display-lg text-on-surface mb-8 leading-tight">Technical Transparency &amp; Privacy</h1>
            <div className="w-24 h-[1px] bg-primary"></div>
          </header>

          {/* Accordion List */}
          <div className="flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div key={i} className="border-b border-hairline group">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex justify-between items-center py-8 text-left focus:outline-none transition-colors group-hover:text-primary"
                  >
                    <span className={`font-serif text-[20px] md:text-headline-lg transition-colors duration-200 ${isOpen ? "text-primary font-medium" : "text-on-surface"}`}>
                      {faq.q}
                    </span>
                    <span className="relative w-6 h-6 flex items-center justify-center shrink-0 ml-4">
                      {isOpen ? (
                        <Minus size={20} className="text-primary" />
                      ) : (
                        <Plus size={20} className="text-secondary group-hover:text-primary transition-colors" />
                      )}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 24 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 font-sans text-body-lg text-secondary leading-relaxed max-w-2xl">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Sponsored/Ad placement card */}
          <section className="mt-20">
            <div className="bg-[#181715] p-8 md:p-12 relative overflow-hidden rounded-2xl group border border-white/5 shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-gutter">
                <div className="w-full md:w-1/3 aspect-video rounded-xl border border-white/10 overflow-hidden bg-surface-container-highest">
                  <img 
                    alt="Sleek Mechanical Keyboard" 
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfBoOTX0AbWgbTkm7dE9NhVPK694wlbjSs59p-ZFtbazjlZRYC4hStRUQu_Q8kN8lzvtzt5-Zy7vURrVTxwdTLjpqFMgQK9i7KITXfY6wUtL72SLq7ps5fVcHXeWTCI98OcgBKQWoIarxEfahoY_3ZfHyphgWUZBBPcasSFKoHxjktbp7atXEPvHkUD7hdEF-chmM37HzRlZrBakB665tlJw8jTnf3GxHcOgeJvFXbPupAUD72-Mqz0NUryhw-yaxI-Nyhy-CyDTY" 
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <span className="font-mono text-mono text-tertiary-fixed mb-4 block uppercase tracking-widest text-[#77d7ca]">Sponsored Placement</span>
                  <h3 className="font-serif text-headline-lg text-white mb-2 leading-tight">Refine Your Workflow</h3>
                  <p className="font-sans text-body-md text-secondary-fixed-dim text-white/70 mb-6">
                    Explore the new collection of tactile tools designed for creative precision and mechanical endurance.
                  </p>
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="inline-block border border-outline-variant text-white px-8 py-3 rounded-lg font-sans text-body-md hover:bg-white hover:text-black transition-colors" 
                    href="#"
                  >
                    Explore Collection
                  </motion.a>
                </div>
              </div>
              {/* Grid Background overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
            </div>
          </section>

          {/* Newsletter Subscribe */}
          <section className="mt-20 border border-hairline p-8 md:p-12 rounded-2xl bg-surface-container-low grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
              <h2 className="font-serif text-headline-lg text-on-surface">Join our newsletter</h2>
              <p className="font-sans text-body-md text-on-surface-variant mt-2">
                For insights on extraction technology and motion design.
              </p>
            </div>
            <form className="flex border-b border-on-surface/20 py-2" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 bg-transparent font-sans italic text-body-md text-on-surface outline-none py-1 placeholder:text-on-surface-variant/40"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <motion.button 
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-primary hover:text-primary-hover p-1"
                type="submit"
              >
                <ArrowRight size={20} />
              </motion.button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
