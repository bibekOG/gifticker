export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type HandlePosition =
  | "nw" | "n" | "ne"
  | "w"  | "e"
  | "sw" | "s" | "se";

export function clampRect(rect: CropRect, bounds: { width: number; height: number }): CropRect {
  const clamped = { ...rect };
  clamped.x = Math.max(0, Math.min(clamped.x, bounds.width - clamped.width));
  clamped.y = Math.max(0, Math.min(clamped.y, bounds.height - clamped.height));
  clamped.width = Math.max(20, Math.min(clamped.width, bounds.width - clamped.x));
  clamped.height = Math.max(20, Math.min(clamped.height, bounds.height - clamped.y));
  if (clamped.x + clamped.width > bounds.width) {
    clamped.width = bounds.width - clamped.x;
  }
  if (clamped.y + clamped.height > bounds.height) {
    clamped.height = bounds.height - clamped.y;
  }
  return clamped;
}

export function getHandleCursor(position: HandlePosition): string {
  const cursors: Record<HandlePosition, string> = {
    nw: "nwse-resize", n: "ns-resize", ne: "nesw-resize",
    w: "ew-resize", e: "ew-resize",
    sw: "nesw-resize", s: "ns-resize", se: "nwse-resize",
  };
  return cursors[position];
}

export function initialCropRect(bounds: { width: number; height: number }): CropRect {
  const size = Math.min(bounds.width, bounds.height) * 0.8;
  return {
    x: (bounds.width - size) / 2,
    y: (bounds.height - size) / 2,
    width: size,
    height: size,
  };
}

export function idealCropRect(imageW: number, imageH: number, targetSize = 512): CropRect {
  const w = Math.min(targetSize, imageW);
  const h = Math.min(targetSize, imageH);
  return {
    x: (imageW - w) / 2,
    y: (imageH - h) / 2,
    width: w,
    height: h,
  };
}
