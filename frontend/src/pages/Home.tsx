import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Sparkles, Repeat, Layers, ArrowRight, type LucideIcon } from "lucide-react";
import { subscribeNewsletter } from "../services/newsletter";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Template {
  name: string;
  img: string;
}

interface Capability {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface BlogPreview {
  tag: string;
  date: string;
  title: string;
  desc: string;
}

const templates: Template[] = [
  {
    name: "Cat Loop",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa3vMJYD4SC2aTRkpwAJLwdCLJ2_H-FUpNKa68ECUUjKoKUHT2XeSgWu6Xo0evNDHL1YI4c64ux_cPhutAdb85hDBFqZasBVGFWH1uqwzQ0FYpJIY2jI9wGCnDf2VLeWqFq7s9ElOxdQJQhyZAqqbw9JBpbrGex6N5O1KuZTTs57DqJiEjShIM5oIPmrkTj2yN7pUQfmymK4ER5tHGRXnqv9uvJhcA-5GPzvLtFjyoi0QuxEuNnE3nvQoj8CKUoxR_rEYNRjaVa6U"
  },
  {
    name: "Shiba Loop",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCexVQr-jzaUfYHQFi7WcfwzhreyDULnPVcW3TT5pvpv2Vb3uF3NRpUHzJRSnKeZYynz1GMsOZRn9i2dLnxHOaqgroUxZHH4biCQgm8LyRqwV9r_22QUobK19U_Q-Tnq2sk2zdC1NaRNS17k18wRTNRmvBg0oG_aPJ6dgK9493teEicZ34Tw-PiQ0gnVVRv58vTj1BM6DaH-Xf1YoZJl5a730xyhFqDO0EQ6c7QtKxpjd8kjPMQYb-a4FjOdcTVTXIf-K3xxD91cRk"
  },
  {
    name: "Pug Loop",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp68SQ-0EmvVPo39Kki7d58Vrrm3d7yIiaJX3mxYO5EdbfsG_fsYxWMeuhpOvjtBSADwJyZAyajWe9XdFScnf9BracItOyFS_Dg-lfsOqALEmrLWU0eJSaKFvfH0nFRE2rLVyjsvJdvJFN5Y4uO-wZJ589hTFFNnFKQCgGx5QbSI_0IVOtIupz3GTgpHOuatyTqFEnqBefFKzxr-m0iru9vyxrFh3a1-5h_RobnsEi1riEqiJGDFOAuwOzLhI0sXBdngRLkn9ozxI"
  }
];

const capabilities: Capability[] = [
  { icon: Sparkles, title: "Automatic Background Removal", desc: "Surgical precision isolation of subjects from complex backgrounds for clean sticker extraction." },
  { icon: Repeat, title: "Infinite Loop Stitching", desc: "Frame-blending and motion vector analysis for seamless, artifact-free loops." },
  { icon: Layers, title: "Export up to 4K Transparency", desc: "High-fidelity alpha channel preservation across WebP, GIF, and Lottie formats." },
];

const blogPreviews: BlogPreview[] = [
  { tag: "STICKER GUIDES", date: "AUG 14, 2026", title: "The Physics of the Perfect Loop: Avoiding the Jump-cut", desc: "Exploring the technical nuances of frame-blending and motion vector analysis for seamless loops..." },
  { tag: "STICKER GUIDES", date: "JUL 22, 2026", title: "Neural Engines and Edge Isolation in Browser Environments", desc: "How we brought server-grade subject detection to client-side WASM modules for privacy and speed..." },
  { tag: "CREATIVE IDEAS", date: "JUN 05, 2026", title: "Editorial Visuals: Why Stickers are the New Graphic Language", desc: "The rise of isolated imagery in high-end editorial design and modern digital communication systems..." },
];

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
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

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video");
      const fileSize = `${(file.size / 1024).toFixed(1)} KB`;
      navigate("/canvas", { 
        state: { 
          imageSrc: imageUrl, 
          mediaType: isVideo ? "video" : "image",
          mediaName: file.name,
          mediaSize: fileSize
        } 
      });
    }
  };

  const handleSelectTemplate = (t: Template) => {
    setSelectedTemplate(t);
    navigate("/canvas", { 
      state: { 
        imageSrc: t.img, 
        mediaType: "image",
        mediaName: `${t.name.toLowerCase().replace(" ", "_")}.png`,
        mediaSize: "142.4 KB"
      } 
    });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary-fixed">
      <Navbar />
      <main className="flex-grow pt-20">
        
        {/* HERO SECTION */}
        <section className="max-w-max-width mx-auto px-margin-sm md:px-page py-16 md:py-section flex flex-col md:flex-row items-center gap-gutter">
          {/* Left Hero */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="relative w-full aspect-video mb-12 hidden md:block overflow-hidden rounded-2xl border border-outline-variant bg-[#efe9de] p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [0, 1.5, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", type: "spring" }}
                  className="w-48 h-48 border border-outline-variant bg-[#faf9f5] rounded-xl flex items-center justify-center overflow-hidden shadow-lg"
                >
                  <img 
                    alt="Sticker preview" 
                    className="object-cover w-full h-full grayscale opacity-40 transition-transform duration-700 hover:scale-105" 
                    src={selectedTemplate ? selectedTemplate.img : "https://lh3.googleusercontent.com/aida-public/AB6AXuDTO1wfckMBDNiEr0zxTO4DN1yhxi7YVrX9YDw7UwG27Ih3jDLNZgh6EXdtmgkn41EFXzILt62q5HGx3E70fpl0rXd8O9syx9shH0vriujpUg71XvBMdvt0uxehIMDnyOkycP3i5kNxJptNoQaliV3a0fAIw1RVjWYVRxpH0VB85LFh46GXWxE08R0zzes7frv2lwAD8RDTs2hGl61wXByAdFuce05GxdGjMbFSL9Yc8aPOgSGgvBq0Bn5q1c4wNKvD5TEUXg7vlJ4"}
                  />
                </motion.div>
              </div>
              <div className="absolute top-4 left-4 border border-primary px-3 py-1 bg-surface rounded">
                <span className="font-sans text-label-caps text-primary tracking-wider uppercase font-semibold">ISOLATION ACTIVE</span>
              </div>
            </div>
            
            <h1 className="font-serif text-[42px] md:text-headline-xl text-on-surface leading-tight max-w-lg">
              Convert video clips & images into loops.
            </h1>
            <p className="font-sans text-body-lg text-on-surface-variant mt-6 max-w-md">
              Turn your gallery into a custom sticker pack in seconds. Surgical subject detection, high-fidelity transparency, and infinite micro-looping built directly for your browser.
            </p>
          </div>

          {/* Right Hero / Upload Card */}
          <div className="w-full md:w-1/2">
            <div className="bg-white p-8 md:p-12 border border-outline-variant rounded-xl shadow-sm">
              <div className="flex flex-col items-center text-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*,video/*" 
                />
                
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  onClick={handleUploadClick}
                  className="w-full border-2 border-dashed border-outline-variant py-16 px-4 mb-8 hover:border-primary transition-colors cursor-pointer group rounded-xl bg-surface-container-low"
                >
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
                    className="bg-primary text-white px-8 py-4 rounded-lg font-bold mb-4 flex items-center gap-2 mx-auto shadow-sm"
                  >
                    <Upload size={18} />
                    Upload Media
                  </motion.button>
                  <p className="text-on-surface-variant font-sans text-body-md">or drop a file, max 30s clip</p>
                </motion.div>

                <div className="w-full text-left">
                  <p className="font-sans text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">No image? Try one of these:</p>
                  <div className="flex gap-4">
                    {templates.map((t, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        onClick={() => handleSelectTemplate(t)}
                        className={`w-12 h-12 rounded-full overflow-hidden border cursor-pointer transition-all ${
                          selectedTemplate?.name === t.name ? "border-primary ring-2 ring-primary/20" : "border-outline-variant hover:border-primary"
                        }`}
                      >
                        <img alt={t.name} src={t.img} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-on-surface-variant font-sans text-body-md text-center">By uploading an image you agree to our <a className="underline hover:text-primary transition-colors" href="#">Terms of Service</a>.</p>
          </div>
        </section>

        {/* CAPABILITY SHOWCASE */}
        <section className="max-w-max-width mx-auto px-margin-sm md:px-page py-16 md:py-section border-t border-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter md:gap-24 items-center">
            {/* Left Info */}
            <div>
              <span className="font-sans text-label-caps text-primary mb-4 block uppercase tracking-widest">Engine Capabilities</span>
              <h2 className="font-serif text-[36px] md:text-headline-xl mb-8 leading-tight">Instant high-fidelity stickers from any photo</h2>
              <p className="text-body-lg font-sans text-on-surface-variant mb-8 max-w-md">
                Turn your gallery into a custom sticker pack in seconds. Our engine uses surgical precision to isolate subjects from complex backgrounds, adding a professional white border and perfect transparency for use across any digital platform.
              </p>
              
              <div className="space-y-4">
                {capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-4 py-4 border-b border-outline-variant">
                    <div className="p-2 rounded-lg bg-primary-fixed text-primary shrink-0">
                      <cap.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-body-md text-on-surface">{cap.title}</h4>
                      <p className="font-sans text-body-md text-on-surface-variant mt-1">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Comparative Graphic mockup */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-[#efe9de] p-8 border border-outline-variant rounded-2xl shadow-inner relative group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#87736d_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 rounded-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-center">
                {/* Left Bird Image (Original) */}
                <div className="w-1/2 flex flex-col items-center">
                  <div className="w-full aspect-square rounded-xl overflow-hidden border border-outline-variant bg-[#faf9f5]">
                    <img 
                      alt="Original Bird" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTO1wfckMBDNiEr0zxTO4DN1yhxi7YVrX9YDw7UwG27Ih3jDLNZgh6EXdtmgkn41EFXzILt62q5HGx3E70fpl0rXd8O9syx9shH0vriujpUg71XvBMdvt0uxehIMDnyOkycP3i5kNxJptNoQaliV3a0fAIw1RVjWYVRxpH0VB85LFh46GXWxE08R0zzes7frv2lwAD8RDTs2hGl61wXByAdFuce05GxdGjMbFSL9Yc8aPOgSGgvBq0Bn5q1c4wNKvD5TEUXg7vlJ4" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="font-mono text-label-caps text-on-surface-variant mt-3 uppercase">Original Source</span>
                </div>
                
                {/* Right Bird Image (Cutout) */}
                <div className="w-1/2 flex flex-col items-center">
                  <div className="w-full aspect-square rounded-xl overflow-hidden border border-outline-variant relative bg-white checkerboard">
                    <div className="absolute inset-0 checkerboard-bg opacity-30"></div>
                    <motion.div 
                      animate={{ scale: [1, 1.03, 1] }} 
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="w-full h-full p-2 flex items-center justify-center relative z-10"
                    >
                      <img 
                        alt="Isolated Sticker" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTO1wfckMBDNiEr0zxTO4DN1yhxi7YVrX9YDw7UwG27Ih3jDLNZgh6EXdtmgkn41EFXzILt62q5HGx3E70fpl0rXd8O9syx9shH0vriujpUg71XvBMdvt0uxehIMDnyOkycP3i5kNxJptNoQaliV3a0fAIw1RVjWYVRxpH0VB85LFh46GXWxE08R0zzes7frv2lwAD8RDTs2hGl61wXByAdFuce05GxdGjMbFSL9Yc8aPOgSGgvBq0Bn5q1c4wNKvD5TEUXg7vlJ4" 
                        className="w-[90%] h-[90%] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] bg-white p-1 rounded-lg border-2 border-white"
                      />
                    </motion.div>
                  </div>
                  <span className="font-mono text-label-caps text-primary mt-3 uppercase font-semibold">100% Isolated Sticker</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BLOG GRID */}
        <section className="max-w-max-width mx-auto px-margin-sm md:px-page py-16 md:py-section border-t border-outline-variant">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-sans text-label-caps text-on-surface-variant mb-2 block uppercase tracking-widest">Insights</span>
              <h2 className="font-serif text-[32px] md:text-headline-lg font-medium">Blog</h2>
            </div>
            <a className="font-sans text-body-md text-primary flex items-center gap-2 hover:underline group font-medium" href="/blog">
              See more articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {blogPreviews.map((art, idx) => (
              <motion.article 
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="p-8 bg-[#efe9de] border border-outline-variant hover:border-primary transition-colors flex flex-col justify-between group h-full rounded-xl"
              >
                <div>
                  <time className="font-mono text-mono text-on-surface-variant block mb-6">{art.date}</time>
                  <h3 className="font-serif text-headline-lg mb-4 leading-tight group-hover:text-primary transition-colors">{art.title}</h3>
                </div>
                <p className="text-on-surface-variant font-sans text-body-md line-clamp-3 mt-4">{art.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-surface-container-low border-t border-outline-variant py-10 md:py-12 px-margin-sm md:px-page">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-16">
            <div className="max-w-md text-center md:text-left">
              <h2 className="font-serif text-[28px] md:text-headline-lg mb-2 leading-tight">Get Updates</h2>
              <p className="text-body-md font-sans text-on-surface-variant">Sign up for our newsletter to receive technical updates, design inspiration, and early access to new engine features.</p>
            </div>
            <div className="w-full max-w-sm shrink-0">
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
                <input 
                  className="flex-grow bg-white border border-outline-variant focus:ring-primary focus:border-primary p-3 font-sans text-body-sm rounded-lg outline-none" 
                  placeholder="email@example.com" 
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="bg-primary text-white px-6 py-3 font-bold rounded-lg shadow-sm whitespace-nowrap text-body-sm" 
                  type="submit"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
