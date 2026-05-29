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
  Undo2,
  Redo2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import CropOverlay from "../components/CropOverlay";
import { initialCropRect, idealCropRect } from "../utils/cropUtils";
import type { CropRect } from "../utils/cropUtils";
import { PLATFORMS, estimateSize } from "../utils/platformLimits";
import { exportAsGif, exportAsSticker, copyBlobToClipboard, downloadBlob } from "../utils/exportImage";

interface CanvasState {
  imageSrc: string;
  mediaType: "video" | "image";
  mediaName: string;
  mediaSize: string;
  cropRect: CropRect | null;
  isCropMode: boolean;
  text: string;
  textPos: { x: number; y: number };
}

interface MediaTrack {
  id: string;
  imageSrc: string;
  mediaType: "video" | "image";
  mediaName: string;
  mediaSize: string;
  naturalWidth: number;
  naturalHeight: number;
  cropRect: CropRect | null;
  isCropMode: boolean;
  text: string;
  textPos: { x: number; y: number };
}

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
  const [viewMode, setViewMode] = useState<"fit" | "actual">("fit");

  // Custom Editable Text State variables
  const [text, setText] = useState<string>("");
  const [isTextOpen, setIsTextOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [textPos, setTextPos] = useState({ x: 50, y: 50 }); // % from top-left
  const textRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startY: 0, initX: 50, initY: 50 });

  // Dynamic Aspect Ratio state
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const _aspectRatio = naturalWidth && naturalHeight ? naturalWidth / naturalHeight : 1;
  const shouldAutoCrop = useRef(false);

  // Multi-track asset management
  const [tracks, setTracks] = useState<MediaTrack[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>("");

  // Initialize tracks with default pug image once dimensions load
  const hasInitializedTracks = useRef(false);
  useEffect(() => {
    if (naturalWidth > 0 && !hasInitializedTracks.current) {
      hasInitializedTracks.current = true;
      const initialId = "default-pug";
      const defaultTrack: MediaTrack = {
        id: initialId,
        imageSrc,
        mediaType,
        mediaName,
        mediaSize,
        naturalWidth,
        naturalHeight,
        cropRect,
        isCropMode,
        text,
        textPos,
      };
      setTracks([defaultTrack]);
      setActiveTrackId(initialId);
    }
  }, [naturalWidth]);

  // Synchronize active states to active track in tracks list
  useEffect(() => {
    if (!activeTrackId) return;
    setTracks((prevTracks) => {
      const currentTrack = prevTracks.find((t) => t.id === activeTrackId);
      if (currentTrack && currentTrack.imageSrc !== imageSrc && currentTrack.imageSrc !== "") {
        return prevTracks;
      }
      return prevTracks.map((t) =>
        t.id === activeTrackId
          ? {
              ...t,
              imageSrc,
              mediaType,
              mediaName,
              mediaSize,
              naturalWidth,
              naturalHeight,
              cropRect,
              isCropMode,
              text,
              textPos,
            }
          : t
      );
    });
  }, [imageSrc, mediaType, mediaName, mediaSize, naturalWidth, naturalHeight, cropRect, isCropMode, text, textPos, activeTrackId]);

  const handleSelectTrack = (track: MediaTrack) => {
    setActiveTrackId(track.id);
    
    setImageSrc(track.imageSrc);
    setMediaType(track.mediaType);
    setMediaName(track.mediaName);
    setMediaSize(track.mediaSize);
    setCropRect(track.cropRect);
    setIsCropMode(track.isCropMode);
    setText(track.text);
    setTextPos(track.textPos);
    setNaturalWidth(track.naturalWidth);
    setNaturalHeight(track.naturalHeight);
    
    pushToHistory({
      imageSrc: track.imageSrc,
      mediaType: track.mediaType,
      mediaName: track.mediaName,
      mediaSize: track.mediaSize,
      cropRect: track.cropRect,
      isCropMode: track.isCropMode,
      text: track.text,
      textPos: track.textPos,
    });
  };

  const handleDeleteTrack = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (tracks.length <= 1) return;
    
    const indexToDelete = tracks.findIndex((t) => t.id === trackId);
    const newTracks = tracks.filter((t) => t.id !== trackId);
    setTracks(newTracks);
    
    if (activeTrackId === trackId) {
      const nextActiveIndex = indexToDelete > 0 ? indexToDelete - 1 : 0;
      const nextActiveTrack = newTracks[nextActiveIndex];
      if (nextActiveTrack) {
        handleSelectTrack(nextActiveTrack);
      }
    }
  };

  // State History tracking (Undo/Redo)
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const hasInitializedHistory = useRef(false);

  const pushToHistory = (nextState: Partial<CanvasState>) => {
    setHistory((prevHistory) => {
      const currentIndex = historyIndex;
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      
      const currentState = newHistory[currentIndex] || {
        imageSrc,
        mediaType,
        mediaName,
        mediaSize,
        cropRect,
        isCropMode,
        text,
        textPos,
      };

      const pushedState: CanvasState = {
        imageSrc: nextState.imageSrc !== undefined ? nextState.imageSrc : currentState.imageSrc,
        mediaType: nextState.mediaType !== undefined ? nextState.mediaType : currentState.mediaType,
        mediaName: nextState.mediaName !== undefined ? nextState.mediaName : currentState.mediaName,
        mediaSize: nextState.mediaSize !== undefined ? nextState.mediaSize : currentState.mediaSize,
        cropRect: nextState.cropRect !== undefined ? nextState.cropRect : currentState.cropRect,
        isCropMode: nextState.isCropMode !== undefined ? nextState.isCropMode : currentState.isCropMode,
        text: nextState.text !== undefined ? nextState.text : currentState.text,
        textPos: nextState.textPos !== undefined ? nextState.textPos : currentState.textPos,
      };

      setHistoryIndex(newHistory.length);
      return [...newHistory, pushedState];
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const state = history[prevIndex];
      setHistoryIndex(prevIndex);

      setImageSrc(state.imageSrc);
      setMediaType(state.mediaType);
      setMediaName(state.mediaName);
      setMediaSize(state.mediaSize);
      setCropRect(state.cropRect);
      setIsCropMode(state.isCropMode);
      setText(state.text);
      setTextPos(state.textPos);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const state = history[nextIndex];
      setHistoryIndex(nextIndex);

      setImageSrc(state.imageSrc);
      setMediaType(state.mediaType);
      setMediaName(state.mediaName);
      setMediaSize(state.mediaSize);
      setCropRect(state.cropRect);
      setIsCropMode(state.isCropMode);
      setText(state.text);
      setTextPos(state.textPos);
    }
  };

  useEffect(() => {
    if (naturalWidth > 0 && !hasInitializedHistory.current) {
      hasInitializedHistory.current = true;
      const initialState: CanvasState = {
        imageSrc,
        mediaType,
        mediaName,
        mediaSize,
        cropRect,
        isCropMode,
        text,
        textPos,
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, [naturalWidth]);

  useEffect(() => {
    if (imageSrc) {
      if (mediaType === "image") {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          setNaturalWidth(w);
          setNaturalHeight(h);
          if (shouldAutoCrop.current) {
            shouldAutoCrop.current = false;
            setCropRect(idealCropRect(w, h));
            setIsCropMode(true);
          }
        };
      } else if (mediaType === "video") {
        // Create an ephemeral video element to get dimensions
        const tempVideo = document.createElement("video");
        tempVideo.src = imageSrc;
        tempVideo.onloadedmetadata = () => {
          const w = tempVideo.videoWidth;
          const h = tempVideo.videoHeight;
          setNaturalWidth(w);
          setNaturalHeight(h);
          if (shouldAutoCrop.current) {
            shouldAutoCrop.current = false;
            setCropRect(idealCropRect(w, h));
            setIsCropMode(true);
          }
          tempVideo.remove();
        };
      }
    }
  }, [imageSrc, mediaType]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.active) return;
      const container = canvasRef.current;
      if (!container) return;
      const dx = ((e.clientX - dragState.current.startX) / container.offsetWidth) * 100;
      const dy = ((e.clientY - dragState.current.startY) / container.offsetHeight) * 100;
      const newX = Math.max(5, Math.min(95, dragState.current.initX + dx));
      const newY = Math.max(5, Math.min(95, dragState.current.initY + dy));
      if (textRef.current) {
        textRef.current.style.left = `${newX}%`;
        textRef.current.style.top = `${newY}%`;
      }
    };
    const handleMouseUp = () => {
      if (dragState.current.active && textRef.current) {
        const l = parseFloat(textRef.current.style.left);
        const t = parseFloat(textRef.current.style.top);
        if (!isNaN(l) && !isNaN(t)) {
          setTextPos({ x: l, y: t });
          pushToHistory({ textPos: { x: l, y: t } });
        }
        dragState.current.active = false;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

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
      
      shouldAutoCrop.current = false;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newSrc = event.target.result as string;
          const newId = `track-${Date.now()}`;
          
          const newTrack: MediaTrack = {
            id: newId,
            imageSrc: newSrc,
            mediaType: type,
            mediaName: file.name,
            mediaSize: sizeString,
            naturalWidth: 0,
            naturalHeight: 0,
            cropRect: null,
            isCropMode: false,
            text: "",
            textPos: { x: 50, y: 50 },
          };
          
          setTracks((prev) => [...prev, newTrack]);
          setActiveTrackId(newId);

          setImageSrc(newSrc);
          setMediaType(type);
          setMediaName(file.name);
          setMediaSize(sizeString);
          setIsPlaying(false); // Reset playback
          setViewMode("fit"); // Reset view mode to fit by default
          setCropRect(null);
          setIsCropMode(false);
          setText("");
          setTextPos({ x: 50, y: 50 });
          setNaturalWidth(0);
          setNaturalHeight(0);

          pushToHistory({
            imageSrc: newSrc,
            mediaType: type,
            mediaName: file.name,
            mediaSize: sizeString,
            cropRect: null,
            isCropMode: false,
            text: "",
            textPos: { x: 50, y: 50 },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropToggle = () => {
    if (isCropMode) {
      setIsCropMode(false);
      setCropRect(null);
      pushToHistory({ cropRect: null });
    } else {
      setCropRect(idealCropRect(naturalWidth, naturalHeight));
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
              <span>Crop</span>
            </motion.button>

            {isCropMode && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                onClick={() => {
                  setIsCropMode(false);
                  pushToHistory({ cropRect });
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider shadow-md transition-colors"
              >
                <span>Done</span>
              </motion.button>
            )}

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
                <span>Text</span>
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
                        onBlur={() => pushToHistory({ text })}
                        placeholder="Type meme text here..."
                        className="w-full bg-surface-container border border-outline-variant rounded-xl px-3 py-2 text-xs font-sans text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        onClick={() => {
                          setText("");
                          pushToHistory({ text: "" });
                        }}
                        className="flex-1 text-center py-1.5 text-[10px] font-sans text-error hover:bg-error-container/10 rounded-lg transition-colors uppercase tracking-wider font-semibold border border-outline-variant"
                      >
                        Clear Text
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        onClick={() => {
                          setTextPos({ x: 50, y: 50 });
                          pushToHistory({ textPos: { x: 50, y: 50 } });
                        }}
                        className="flex-1 text-center py-1.5 text-[10px] font-sans text-primary hover:bg-primary-container/10 rounded-lg transition-colors uppercase tracking-wider font-semibold border border-outline-variant"
                      >
                        Reset Pos
                      </motion.button>
                    </div>
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
                <span>Optimize</span>
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
        <div className="w-full max-w-[720px] max-h-[70vh] px-margin-sm md:px-page-padding flex items-center justify-center">
          <div className={`w-full bg-[#efeeea] rounded-3xl p-6 md:p-8 border border-outline-variant shadow-inner flex items-center justify-center relative group ${
            viewMode === "actual" ? "overflow-auto max-h-[60vh]" : ""
          }`}>
            {/* Hairline grid lines (Decorative) */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-40 w-[1px] bg-outline-variant opacity-30"></div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-40 w-[1px] bg-outline-variant opacity-30"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-outline-variant opacity-30"></div>
            
            <div 
              ref={canvasRef} 
              className={`relative rounded-2xl border border-outline-variant/60 overflow-hidden bg-white shadow-2xl flex items-center justify-center ${
                viewMode === "fit" 
                  ? "max-w-full max-h-[50vh]" 
                  : "shrink-0"
              }`}
              style={{
                aspectRatio: (isCropMode ? _aspectRatio : (cropRect ? (cropRect.width / cropRect.height) : _aspectRatio)) || 1,
                width: viewMode === "actual" ? (isCropMode ? naturalWidth : (cropRect ? cropRect.width : naturalWidth)) : undefined,
                height: viewMode === "actual" ? (isCropMode ? naturalHeight : (cropRect ? cropRect.height : naturalHeight)) : undefined,
              }}
            >
              {/* Checkerboard Pattern */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none checkerboard-bg"></div>

              {isCropMode && cropRect && (
                <CropOverlay
                  bounds={{ width: naturalWidth, height: naturalHeight }}
                  rect={cropRect}
                  onChange={setCropRect}
                  onCommit={(r) => {
                    setCropRect(r);
                    pushToHistory({ cropRect: r });
                  }}
                />
              )}

              {/* Floating Ideal Size Badge with Done Button */}
              {isCropMode && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-outline-variant shadow-2xl rounded-full px-3 py-1.5 flex items-center gap-2.5 z-40 animate-bounce">
                  <span className="bg-primary/10 text-primary text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Crop to: 512 × 512 px
                  </span>
                  <button
                    onClick={() => {
                      setIsCropMode(false);
                      pushToHistory({ cropRect });
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm transition-colors font-semibold"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Pug MEME container */}
              <div className="relative w-full h-full z-10 flex items-center justify-center overflow-hidden">
                <div
                  className="relative w-full h-full"
                  style={
                    !isCropMode && cropRect
                      ? {
                          width: "100%",
                          height: "100%",
                        }
                      : undefined
                  }
                >
                  {mediaType === "video" ? (
                    <video 
                      ref={videoRef}
                      src={imageSrc}
                      loop
                      muted
                      playsInline
                      className="block select-none cursor-pointer"
                      style={
                        !isCropMode && cropRect
                          ? {
                              width: `${(naturalWidth / cropRect.width) * 100}%`,
                              height: `${(naturalHeight / cropRect.height) * 100}%`,
                              marginLeft: `${(-cropRect.x / cropRect.width) * 100}%`,
                              marginTop: `${(-cropRect.y / cropRect.height) * 100}%`,
                              maxWidth: "none",
                              maxHeight: "none",
                            }
                          : {
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }
                      }
                    />
                  ) : (
                    <motion.img 
                      ref={imageRef}
                      animate={{ 
                        scale: isPlaying ? [1, 1.02, 1] : 1,
                        rotate: isPlaying ? [0, 0.5, -0.5, 0] : 0
                      }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      alt="Meme Pug sticker"
                      className="block select-none cursor-pointer"
                      style={
                        !isCropMode && cropRect
                          ? {
                              width: `${(naturalWidth / cropRect.width) * 100}%`,
                              height: `${(naturalHeight / cropRect.height) * 100}%`,
                              marginLeft: `${(-cropRect.x / cropRect.width) * 100}%`,
                              marginTop: `${(-cropRect.y / cropRect.height) * 100}%`,
                              maxWidth: "none",
                              maxHeight: "none",
                            }
                          : {
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }
                      }
                      src={imageSrc}
                    />
                  )}
                </div>
                
                {/* Outlined Impact Text Overlay */}
                {text && (
                  <div
                    ref={textRef}
                    className="absolute z-20 cursor-grab active:cursor-grabbing select-none"
                    style={{
                      left: `${textPos.x}%`,
                      top: `${textPos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => {
                      dragState.current = { 
                        active: true, 
                        startX: e.clientX, 
                        startY: e.clientY, 
                        initX: textPos.x, 
                        initY: textPos.y 
                      };
                      e.preventDefault();
                    }}
                  >
                      <h2 
                        className="text-white text-[32px] sm:text-[42px] md:text-[48px] leading-tight text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.55)] select-none uppercase font-extrabold tracking-wider transition-all duration-300"
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
          <div className="bg-white border border-outline-variant py-2 px-4 rounded-full shadow-xl flex items-center gap-3 max-w-full overflow-hidden">
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
              className="w-14 h-14 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <Plus size={20} />
            </motion.button>

            {/* Thumbnail Track List */}
            <div className="flex items-center gap-2 overflow-x-auto px-1 py-1 scrollbar-thin">
              {tracks.map((track, idx) => {
                const isActive = track.id === activeTrackId;
                return (
                  <div 
                    key={track.id} 
                    className="relative shrink-0 cursor-pointer group" 
                    onClick={() => handleSelectTrack(track)}
                  >
                    <motion.div 
                      className={`w-14 h-14 rounded-full overflow-hidden bg-surface-container ${
                        isActive ? "ring-2 ring-primary ring-offset-2" : "opacity-60 hover:opacity-100 transition-opacity"
                      }`}
                    >
                      {track.mediaType === "video" ? (
                        <video className="w-full h-full object-cover pointer-events-none" src={track.imageSrc} />
                      ) : (
                        <img className="w-full h-full object-cover pointer-events-none" src={track.imageSrc} alt={`Preview track ${idx}`} />
                      )}
                    </motion.div>
                    {/* Close / Deletion Cross Button on Top Right */}
                    {tracks.length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={(e) => handleDeleteTrack(e, track.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors z-20 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Delete track"
                      >
                        <X size={10} strokeWidth={3} />
                      </motion.button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="h-10 w-[1px] bg-outline-variant mx-2"></div>

            {/* Media Contextual Controls */}
            {mediaType === "video" ? (
              <div className="flex items-center gap-4 px-4 pr-6">
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-mono text-secondary uppercase tracking-widest font-bold">Current Clip</span>
                  <span className="text-sm font-mono text-on-surface font-extrabold leading-none mt-1">00:02.45s</span>
                  {naturalWidth > 0 && (
                    <span className="text-[9px] font-mono text-on-surface-variant mt-0.5">{naturalWidth} × {naturalHeight} px</span>
                  )}
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
                  <span className="text-[10px] font-mono text-on-surface-variant font-semibold tracking-wide">
                    {mediaSize} {naturalWidth > 0 && `• ${naturalWidth} × ${naturalHeight} px`}
                  </span>
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
                  
                  {/* Display Scale Mode Toggle */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-secondary uppercase tracking-widest font-bold">Display Scale Mode</span>
                    <div className="grid grid-cols-2 gap-2 bg-surface-container rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("fit")}
                        className={`py-1.5 text-xs font-sans rounded-lg font-bold transition-all ${
                          viewMode === "fit" 
                            ? "bg-white text-primary shadow-sm" 
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Fit Viewport
                      </button>
                      <button
                        onClick={() => setViewMode("actual")}
                        className={`py-1.5 text-xs font-sans rounded-lg font-bold transition-all ${
                          viewMode === "actual" 
                            ? "bg-white text-primary shadow-sm" 
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Actual Size (1:1)
                      </button>
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
          {/* Undo / Redo Buttons */}
          <div className="flex flex-col gap-2 pb-2 border-b border-outline-variant/60">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                historyIndex > 0 ? "text-on-surface hover:bg-surface-container" : "text-on-surface/30 cursor-not-allowed"
              }`}
              title="Undo"
            >
              <Undo2 size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                historyIndex < history.length - 1 ? "text-on-surface hover:bg-surface-container" : "text-on-surface/30 cursor-not-allowed"
              }`}
              title="Redo"
            >
              <Redo2 size={18} />
            </motion.button>
          </div>

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
