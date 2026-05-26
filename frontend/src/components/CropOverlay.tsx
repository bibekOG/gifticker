import { useState, useCallback, useRef, useEffect } from "react";
import type { CropRect, HandlePosition } from "../utils/cropUtils";
import { clampRect, getHandleCursor } from "../utils/cropUtils";

interface CropOverlayProps {
  bounds: { width: number; height: number };
  rect: CropRect;
  onChange: (rect: CropRect) => void;
  onCommit: (rect: CropRect) => void;
}

const HANDLE_SIZE = 12;

const HANDLES: HandlePosition[] = ["nw", "n", "ne", "w", "e", "sw", "s", "se"];

export default function CropOverlay({ bounds, rect, onChange, onCommit }: CropOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 1000 });

  // Track the actual physical client width/height of the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setContainerSize({
        width: el.clientWidth || 1000,
        height: el.clientHeight || 1000,
      });
    };

    updateSize();

    // Use ResizeObserver for responsive resizing
    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scaleX = containerSize.width / bounds.width;
  const scaleY = containerSize.height / bounds.height;

  const dragRef = useRef<{
    type: "move" | "resize";
    handle?: HandlePosition;
    startX: number;
    startY: number;
    startRect: CropRect;
  } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, type: "move" | "resize", handle?: HandlePosition) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        type,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startRect: { ...rect },
      };
    },
    [rect]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;

      // Scale screen pixel movement back to logic model coordinates
      const modelDx = dx / scaleX;
      const modelDy = dy / scaleY;

      let newRect = { ...drag.startRect };

      if (drag.type === "move") {
        newRect.x = drag.startRect.x + modelDx;
        newRect.y = drag.startRect.y + modelDy;
      } else if (drag.type === "resize" && drag.handle) {
        const h = drag.handle;
        if (h.includes("e")) newRect.width = Math.max(20, drag.startRect.width + modelDx);
        if (h.includes("w")) {
          newRect.width = Math.max(20, drag.startRect.width - modelDx);
          newRect.x = drag.startRect.x + modelDx;
        }
        if (h.includes("s")) newRect.height = Math.max(20, drag.startRect.height + modelDy);
        if (h.includes("n")) {
          newRect.height = Math.max(20, drag.startRect.height - modelDy);
          newRect.y = drag.startRect.y + modelDy;
        }
      }

      onChange(clampRect(newRect, bounds));
    };

    const handleUp = () => {
      if (dragRef.current) {
        onCommit(rect);
        dragRef.current = null;
      }
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerup", handleUp);
    el.addEventListener("pointercancel", handleUp);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerup", handleUp);
      el.removeEventListener("pointercancel", handleUp);
    };
  }, [bounds, onChange, onCommit, rect, scaleX, scaleY]);

  // Scale internal 1080x1080 rect coordinates to container physical dimensions
  const visualLeft = rect.x * scaleX;
  const visualTop = rect.y * scaleY;
  const visualWidth = rect.width * scaleX;
  const visualHeight = rect.height * scaleY;

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 select-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div
        className="absolute border-2 border-white cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
        style={{
          left: visualLeft,
          top: visualTop,
          width: visualWidth,
          height: visualHeight,
        }}
        onPointerDown={(e) => handlePointerDown(e, "move")}
      >
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />

        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none select-none">
          {Math.round(rect.width)} × {Math.round(rect.height)}
        </div>

        {HANDLES.map((h) => (
          <div
            key={h}
            className="absolute bg-white border-2 border-primary shadow-lg rounded-full"
            style={{
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              cursor: getHandleCursor(h),
              ...(h.includes("n") ? { top: -HANDLE_SIZE / 2 } : { bottom: -HANDLE_SIZE / 2 }),
              ...(h.includes("w") ? { left: -HANDLE_SIZE / 2 } : { right: -HANDLE_SIZE / 2 }),
              ...(h === "n" || h === "s" ? { left: "50%", marginLeft: -HANDLE_SIZE / 2 } : {}),
              ...(h === "w" || h === "e" ? { top: "50%", marginTop: -HANDLE_SIZE / 2 } : {}),
            }}
            onPointerDown={(e) => handlePointerDown(e, "resize", h)}
          />
        ))}
      </div>
    </div>
  );
}
