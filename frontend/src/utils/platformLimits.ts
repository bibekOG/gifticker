export interface PlatformLimit {
  name: string;
  type: "sticker" | "gif" | "file";
  maxSizeKB: number;
  idealWidth: number;
  idealHeight: number;
}

export const PLATFORMS: PlatformLimit[] = [
  { name: "Telegram", type: "sticker", maxSizeKB: 512, idealWidth: 512, idealHeight: 512 },
  { name: "WhatsApp", type: "sticker", maxSizeKB: 500, idealWidth: 512, idealHeight: 512 },
  { name: "X/Twitter", type: "gif", maxSizeKB: 15360, idealWidth: 1280, idealHeight: 1080 },
  { name: "Discord", type: "file", maxSizeKB: 25600, idealWidth: 800, idealHeight: 450 },
];

export interface OptimizationResult {
  fps: number;
  width: number;
  height: number;
  colors: number;
  estimatedSizeKB: number;
}

export function estimateSize(
  width: number,
  height: number,
  _fps: number,
  frameCount: number,
  colors: number
): number {
  return (width * height * frameCount * Math.log2(colors)) / 8000;
}
