import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crop, 
  Type, 
  Zap, 
  ChevronDown, 
  Plus, 
  Play, 
  Layers, 
  Sparkles, 
  Sliders, 
  Settings, 
  Download,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import CropOverlay from "../components/CropOverlay";
import { initialCropRect } from "../utils/cropUtils";
import type { CropRect } from "../utils/cropUtils";
import { PLATFORMS, estimateSize } from "../utils/platformLimits";
import { exportAsGif, exportAsSticker, copyBlobToClipboard, downloadBlob } from "../utils/exportImage";

interface LocationState {
  imageSrc?: string;
  mediaType?: "video" | "image";
  mediaName?: string;
  mediaSize?: string;
}

interface ConsoleTab {
  id: string;
  icon: typeof Layers;
  label: string;
}

export default function Canvas() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [imageSrc, setImageSrc] = useState<string>(
    state?.imageSrc || "https://lh3.googleusercontent.com/aida-public/AB6AXuDAXBpKX_c9xdMy5DAP6jiuUloPmpM1e7-sZzkm0wyHm-F0w6a02ShZppTVqZXt_EfrGcRTgKJUtqG16JJHbRYq3zr1KcGaw3UvLUCfaCDJxLNUvnew7mRC8cZhS1hbEh8GTz_kStpdV4ArW8pPmg2hM2CO_20Y_F6OQ_qNpgX02oVqPTonTi3QMHbQOEIkUUkii0vAnLBmKYpibEVLpK8ubx5ZAhQFuHMNcJA3U5YWRO0Io6M_Cx-tF-dGeysqrRtVxAzuwEroMcE"
  );
  const [mediaType, setMediaType] = useState<"video" | "image">(
    state?.mediaType || "image"
  );
  const [mediaName, setMediaName] = useState<string>(
    state?.mediaName || "template_pug.png"
  );
  const [mediaSize, setMediaSize] = useState<string>(
    state?.mediaSize || "108.5 KB"
  );

  const [activeTab, setActiveTab] = useState("layers");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCropMode, setIsCropMode] = useState(false);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeResults, setOptimizeResults] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Custom Sizing & Fit State variables
  const [zoom, setZoom] = useState<number>(1);
  const [objectFit, setObjectFit] = useState<"contain" | "cover">("cover");

  // Custom Editable Text State variables
  const [text, setText] = useState<string>("");
  const [isTextOpen, setIsTextOpen] = useState(false);

  // Dynamic Aspect Ratio state
  const [_aspectRatio, setAspectRatio] = useState<number>(1);

  useEffect(() => {
    if (imageSrc) {
      if (mediaType === "image") {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          setAspectRatio(img.naturalWidth / img.naturalHeight || 1);
        };
      } else if (mediaType === "video") {
        // Create an ephemeral video element to get dimensions
        const tempVideo = document.createElement("video");
        tempVideo.src = imageSrc;
        tempVideo.onloadedmetadata = () => {
          setAspectRatio(tempVideo.videoWidth / tempVideo.videoHeight || 1);
          tempVideo.remove();
        };
      }
    }
  }, [imageSrc, mediaType]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (mediaType === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, mediaType, imageSrc]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith("video/") ? "video" : "image";
      const sizeInKb = (file.size / 1024).toFixed(1);
      const sizeString = `${sizeInKb} KB`;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setMediaType(type);
          setMediaName(file.name);
          setMediaSize(sizeString);
          setIsPlaying(false); // Reset playback
          setZoom(1); // Reset zoom scale
          setObjectFit("cover"); // Reset fit mode to cover by default
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const thumbImages = imageSrc ? [imageSrc] : [];

  const handleCropToggle = () => {
    if (isCropMode) {
      setIsCropMode(false);
      setCropRect(null);
    } else {
      setCropRect(initialCropRect({ width: 1080, height: 1080 }));
      setIsCropMode(true);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizeResults(null);
    await new Promise((r) => setTimeout(r, 600));
    const sizeKB = Math.round(estimateSize(512, 512, 8, 16, 128));
    const lines = PLATFORMS.map((p) => {
      const ok = sizeKB <= p.maxSizeKB;
      return `${ok ? "✅" : "⚠️"} ${p.name}: ${sizeKB} KB / ${p.maxSizeKB} KB`;
    });
    setOptimizeResults(lines.join("\n"));
    setIsOptimizing(false);
  };

  const handleExport = async (type: "gif" | "sticker") => {
    if (!imageRef.current || !imageRef.current.complete) return;
    setIsExporting(true);
    try {
      const outputSize = type === "gif" ? 512 : 512;
      const fn = type === "gif" ? exportAsGif : exportAsSticker;
      const blob = await fn({
        imageSource: imageRef.current,
        cropRect: cropRect ?? undefined,
        text: text,
        outputWidth: outputSize,
        outputHeight: outputSize,
        fps: 8,
        duration: 2,
        quality: 10,
      });
      const ext = type === "gif" ? "gif" : "webp";
      const filename = `gifticker_${Date.now()}.${ext}`;
      downloadBlob(blob, filename);
      await copyBlobToClipboard(blob);
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setIsExporting(false);
      setIsExportOpen(false);
    }
  };

  const consoleTabs: ConsoleTab[] = [
    { id: "layers", icon: Layers, label: "Layers panel" },
    { id: "effects", icon: Sparkles, label: "Crop settings" },
    { id: "sliders", icon: Sliders, label: "Size & Scale settings" },
    { id: "settings", icon: Settings, label: "Core system specs" }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface selection:bg-primary-fixed">
      <Navbar />
      
      <main className="flex-grow pt-20 relative flex flex-col items-center justify-center overflow-hidden">
        
        {/* Floating Toolbar Pill */}
        <div className="absolute z-40 top-28">
          <div className="bg-white border border-outline-variant shadow-lg px-3 py-2 rounded-full flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={handleCropToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-on-surface-variant font-sans text-label-caps uppercase tracking-wider ${
                isCropMode ? "bg-primary/10 text-primary ring-1 ring-primary" : "hover:bg-surface-container-low"
              }`}
            >
              <Crop size={16} className="text-primary" />
              <span>✂️ Crop</span>
            </motion.button>

            {/* Add/Edit Text Popover */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={() => setIsTextOpen(!isTextOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-on-surface-variant font-sans text-label-caps uppercase tracking-wider ${
                  isTextOpen ? "bg-primary/10 text-primary ring-1 ring-primary" : "hover:bg-surface-container-low"
                }`}
              >
                <Type size={16} className="text-secondary" />
                <span>📝 Text</span>
              </motion.button>

              <AnimatePresence>
                {isTextOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-outline-variant rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                      <span className="text-[11px] font-bold font-sans text-on-surface uppercase tracking-wider">Meme Text Overlay</span>
                      <button onClick={() => setIsTextOpen(false)} className="text-[10px] text-primary uppercase font-bold">Done</button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <input 
                        type="text" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type meme text here..."
                        className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-xs font-sans text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <button
                      onClick={() => setText("")}
                      className="w-full text-center py-1.5 text-[10px] font-sans text-error hover:bg-error-container/10 rounded-lg transition-colors uppercase tracking-wider font-semibold"
                    >
                      Clear Text Overlay
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Optimize Button */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container-low transition-all text-on-surface-variant font-sans text-label-caps uppercase tracking-wider disabled:opacity-50"
              >
                {isOptimizing ? (
                  <LoaderCircle size={16} className="text-secondary animate-spin" />
                ) : (
                  <Zap size={16} className="text-secondary" />
                )}
                <span>⚡ Optimize</span>
              </motion.button>

              <AnimatePresence>
                {optimizeResults && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white border border-outline-variant rounded-2xl p-3 shadow-2xl z-50"
                  >
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span className="text-[11px] font-bold font-sans text-on-surface uppercase tracking-wider">Optimized Results</span>
                    </div>
                    {optimizeResults.split("\n").map((line, i) => (
                      <p key={i} className="text-[11px] font-mono text-on-surface-variant py-0.5">{line}</p>
                    ))}
                    <button
                      onClick={() => setOptimizeResults(null)}
                      className="mt-2 pt-2 border-t border-outline-variant w-full text-[10px] font-sans text-primary text-center uppercase tracking-wider hover:opacity-80"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-[1px] h-6 bg-outline-variant mx-1"></div>

            {/* Export Dropdown */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full hover:bg-primary-hover shadow-sm"
              >
                <span className="font-sans text-label-caps uppercase tracking-wider font-semibold">Export</span>
                <ChevronDown size={14} />
              </motion.button>

              <AnimatePresence>
                {isExportOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-full right-0 mt-3 w-64 bg-white border border-outline-variant rounded-2xl p-2 shadow-2xl z-50"
                  >
                    <button
                      onClick={() => handleExport("gif")}
                      disabled={isExporting}
                      className="w-full flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-xl text-left transition-colors group disabled:opacity-50"
                    >
                      {isExporting ? (
                        <LoaderCircle size={16} className="text-primary animate-spin shrink-0" />
                      ) : (
                        <Download size={16} className="text-primary group-hover:text-primary-hover transition-colors shrink-0" />
                      )}
                      <div>
                        <p className="text-[13px] font-bold font-sans text-on-surface">Export & Copy as GIF</p>
                        <p className="text-[11px] text-on-surface-variant">Legacy loop format</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport("sticker")}
                      disabled={isExporting}
                      className="w-full flex items-center gap-3 p-3 hover:bg-surface-container-low rounded-xl text-left transition-colors group disabled:opacity-50"
                    >
                      {isExporting ? (
                        <LoaderCircle size={16} className="text-primary animate-spin shrink-0" />
                      ) : (
                        <Sparkles size={16} className="text-primary group-hover:text-primary-hover transition-colors shrink-0" />
                      )}
                      <div>
                        <p className="text-[13px] font-bold font-sans text-on-surface">Export & Copy as Sticker</p>
                        <p className="text-[11px] text-on-surface-variant">WebP with transparency</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Center Viewport Canvas */}
        <div className="w-full max-w-[720px] aspect-[16/9.5] max-h-[48vh] px-margin-sm md:px-page-padding flex items-center justify-center">
          <div className="w-full h-full bg-[#efeeea] rounded-3xl p-6 md:p-8 border border-outline-variant shadow-inner flex items-center justify-center relative group">
            {/* Hairline grid lines (Decorative) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-40 w-[1px] bg-outline-variant opacity-30"></div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-40 w-[1px] bg-outline-variant opacity-30"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-outline-variant opacity-30"></div>
            
            <div className="relative h-full aspect-square rounded-2xl border border-outline-variant/60 overflow-hidden flex items-center justify-center bg-white shadow-2xl">
              {/* Checkerboard Pattern */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none checkerboard-bg"></div>

              {isCropMode && cropRect && (
                <CropOverlay
                  bounds={{ width: 1080, height: 1080 }}
                  rect={cropRect}
                  onChange={setCropRect}
                  onCommit={(r) => setCropRect(r)}
                />
              )}

              {/* Pug MEME container */}
              <div className="relative w-full h-full z-10 flex items-center justify-center">
                {mediaType === "video" ? (
                  <video 
                    ref={videoRef}
                    src={imageSrc}
                    loop
                    muted
                    playsInline
                    className="w-full h-full select-none cursor-pointer"
                    style={{ objectFit, transform: `scale(${zoom})` }}
                  />
                ) : (
                  <motion.img 
                    ref={imageRef}
                    animate={{ 
                      scale: isPlaying ? [zoom, zoom * 1.02, zoom] : zoom,
                      rotate: isPlaying ? [0, 0.5, -0.5, 0] : 0
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    alt="Meme Pug sticker"
                    className="w-full h-full select-none cursor-pointer"
                    style={{ objectFit }}
                    src={imageSrc}
                  />
                )}
                
                {/* Outlined Impact Text Overlay */}
                {text && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h2 
                      className="text-white text-[32px] sm:text-[42px] md:text-[48px] leading-tight text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] select-none uppercase font-extrabold tracking-wider"
                      style={{
                        fontFamily: "Impact, Arial Black, sans-serif",
                        WebkitTextStroke: "2px #181715"
                      }}
                    >
                      {text}
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Track Bar */}
        <div className="absolute w-full px-page-padding flex justify-center bottom-8">
          <div className="bg-white border border-outline-variant p-2 rounded-2xl shadow-xl flex items-center gap-2 max-w-full overflow-hidden">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,video/*" 
            />
            <motion.button 
              onClick={handleUploadClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="w-14 h-14 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <Plus size={20} />
            </motion.button>

            {/* Thumbnail Track List */}
            <div className="flex items-center gap-2 overflow-x-auto px-1 py-1 scrollbar-thin">
              {thumbImages.map((img, idx) => (
                <div key={idx} className="relative shrink-0 cursor-pointer">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-14 h-14 rounded-xl overflow-hidden bg-surface-container ${idx === 0 ? "ring-2 ring-primary ring-offset-2" : "opacity-60 hover:opacity-100 transition-opacity"}`}
                  >
                    <img className="w-full h-full object-cover" src={img} alt={`Preview track ${idx}`} />
                  </motion.div>
                  {idx === 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[8px] flex items-center justify-center text-white rounded-full font-bold">1</span>}
                </div>
              ))}
            </div>

            <div className="h-10 w-[1px] bg-outline-variant mx-2"></div>

            {/* Media Contextual Controls */}
            {mediaType === "video" ? (
              <div className="flex items-center gap-4 px-4 pr-6">
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-mono text-secondary uppercase tracking-widest font-bold">Current Clip</span>
                  <span className="text-sm font-mono text-on-surface font-extrabold leading-none mt-1">00:02.45s</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-on-surface hover:text-primary transition-colors p-1"
                >
                  <Play size={18} fill={isPlaying ? "currentColor" : "none"} className={isPlaying ? "text-primary" : ""} />
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col justify-center px-4 pr-6">
                <span className="text-[9px] font-mono text-secondary uppercase tracking-widest font-bold">Current File</span>
                <span className="text-sm font-sans text-on-surface font-bold truncate max-w-[180px] leading-snug mt-0.5" title={mediaName}>
                  {mediaName}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-mono text-on-surface-variant font-semibold tracking-wide">{mediaSize}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Floating Toolbar Console (Right Side Panel) */}
      <aside className="fixed right-8 top-1/2 -translate-y-1/2 flex items-center gap-4 z-40">
        <AnimatePresence>
          {activeTab && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-72 bg-white border border-outline-variant rounded-3xl p-5 shadow-2xl flex flex-col gap-4"
            >
              {activeTab === "sliders" ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                      <Sliders size={16} className="text-primary" />
                      <span className="text-[12px] font-bold font-sans text-on-surface uppercase tracking-wider">Size & Scale Settings</span>
                    </div>
                    <button onClick={() => setActiveTab("")} className="text-[10px] text-primary uppercase font-bold">Close</button>
                  </div>
                  
                  {/* Fit Mode Selector */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest font-bold">Fit Mode</span>
                    <div className="grid grid-cols-2 gap-2 bg-surface-container rounded-xl p-1">
                      <button
                        onClick={() => setObjectFit("contain")}
                        className={`py-1.5 text-xs font-sans rounded-lg font-bold transition-all ${
                          objectFit === "contain" 
                            ? "bg-white text-primary shadow-sm" 
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Fit (Contain)
                      </button>
                      <button
                        onClick={() => setObjectFit("cover")}
                        className={`py-1.5 text-xs font-sans rounded-lg font-bold transition-all ${
                          objectFit === "cover" 
                            ? "bg-white text-primary shadow-sm" 
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Fill (Cover)
                      </button>
                    </div>
                  </div>

                  {/* Zoom / Scale Slider */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-secondary uppercase tracking-widest font-bold">Zoom Scale</span>
                      <span className="text-[10px] font-mono text-on-surface font-bold">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="3" 
                      step="0.05" 
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-on-surface-variant font-mono">
                      <span>0.5x</span>
                      <button onClick={() => setZoom(1)} className="hover:text-primary">Reset (1.0x)</button>
                      <span>3.0x</span>
                    </div>
                  </div>
                </>
              ) : activeTab === "layers" ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-primary" />
                      <span className="text-[12px] font-bold font-sans text-on-surface uppercase tracking-wider">Layers Panel</span>
                    </div>
                    <button onClick={() => setActiveTab("")} className="text-[10px] text-primary uppercase font-bold">Close</button>
                  </div>
                  <div className="text-xs text-on-surface-variant font-sans flex flex-col gap-2">
                    <p className="font-semibold text-on-surface">Canvas Layers</p>
                    <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/60 flex items-center justify-between">
                      <span className="font-mono truncate max-w-[150px]">{mediaName}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase shrink-0">Active</span>
                    </div>
                  </div>
                </>
              ) : activeTab === "effects" ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <span className="text-[12px] font-bold font-sans text-on-surface uppercase tracking-wider">Crop Overlay</span>
                    </div>
                    <button onClick={() => setActiveTab("")} className="text-[10px] text-primary uppercase font-bold">Close</button>
                  </div>
                  <div className="text-xs text-on-surface-variant font-sans flex flex-col gap-3">
                    <p>Toggle the cropping grid overlay to manually crop details of the canvas sticker.</p>
                    <button 
                      onClick={handleCropToggle}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isCropMode ? "bg-primary text-white" : "bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/60"
                      }`}
                    >
                      {isCropMode ? "Turn Off Crop" : "Turn On Crop Grid"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                      <Settings size={16} className="text-primary" />
                      <span className="text-[12px] font-bold font-sans text-on-surface uppercase tracking-wider">System Specs</span>
                    </div>
                    <button onClick={() => setActiveTab("")} className="text-[10px] text-primary uppercase font-bold">Close</button>
                  </div>
                  <div className="flex flex-col gap-2 text-xs font-sans text-on-surface-variant">
                    <div className="flex justify-between border-b border-outline-variant/30 py-1.5">
                      <span>Platform</span>
                      <span className="font-mono font-bold text-on-surface">Web Browser</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/30 py-1.5">
                      <span>Output Dimensions</span>
                      <span className="font-mono font-bold text-on-surface">1080 x 1080 px</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Default Format</span>
                      <span className="font-mono font-bold text-on-surface">GIF / WebP</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-2 rounded-2xl flex flex-col gap-2 shadow-2xl border border-outline-variant bg-white">
          {consoleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                onClick={() => setActiveTab(activeTab === tab.id ? "" : tab.id)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
                title={tab.label}
              >
                <tab.icon size={18} />
              </motion.button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
