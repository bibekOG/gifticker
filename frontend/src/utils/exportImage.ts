import GIF from "gif.js";

export interface ExportOptions {
  imageSource: CanvasImageSource;
  cropRect?: { x: number; y: number; width: number; height: number };
  text: string;
  outputWidth: number;
  outputHeight: number;
  fps: number;
  duration: number;
  quality: number;
}

const CHROMA_KEY = "#ff00ff";

function drawContent(
  ctx: CanvasRenderingContext2D,
  imageSource: CanvasImageSource,
  cropRect: { x: number; y: number; width: number; height: number } | undefined,
  text: string,
  outputWidth: number,
  outputHeight: number,
  scale: number,
  rotate: number
): void {
  ctx.save();
  ctx.translate(outputWidth / 2, outputHeight / 2);
  ctx.scale(scale, scale);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.translate(-outputWidth / 2, -outputHeight / 2);

  if (cropRect) {
    ctx.drawImage(
      imageSource,
      cropRect.x, cropRect.y,
      cropRect.width, cropRect.height,
      0, 0,
      outputWidth, outputHeight
    );
  } else {
    ctx.drawImage(imageSource, 0, 0, outputWidth, outputHeight);
  }

  ctx.restore();

  if (text) {
    const fontSize = Math.max(24, Math.floor(outputWidth / 7));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.strokeStyle = "#181715";
    ctx.lineWidth = Math.max(2, Math.floor(fontSize / 16));
    ctx.lineJoin = "round";
    ctx.strokeText(text, outputWidth / 2, outputHeight / 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, outputWidth / 2, outputHeight / 2);
  }
}

function renderFrameWithAlpha(
  ctx: CanvasRenderingContext2D,
  imageSource: CanvasImageSource,
  cropRect: { x: number; y: number; width: number; height: number } | undefined,
  text: string,
  outputWidth: number,
  outputHeight: number,
  scale: number,
  rotate: number
): void {
  ctx.clearRect(0, 0, outputWidth, outputHeight);
  drawContent(ctx, imageSource, cropRect, text, outputWidth, outputHeight, scale, rotate);
}

function renderFrameWithKey(
  ctx: CanvasRenderingContext2D,
  imageSource: CanvasImageSource,
  cropRect: { x: number; y: number; width: number; height: number } | undefined,
  text: string,
  outputWidth: number,
  outputHeight: number,
  scale: number,
  rotate: number
): ImageData {
  ctx.fillStyle = CHROMA_KEY;
  ctx.fillRect(0, 0, outputWidth, outputHeight);
  drawContent(ctx, imageSource, cropRect, text, outputWidth, outputHeight, scale, rotate);
  return ctx.getImageData(0, 0, outputWidth, outputHeight);
}

export async function exportAsGif(options: ExportOptions): Promise<Blob> {
  const {
    imageSource, cropRect, text,
    outputWidth, outputHeight,
    fps, duration, quality,
  } = options;

  const frameCount = Math.max(1, Math.round(fps * duration));
  const delay = Math.round(1000 / fps);

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d")!;

  const gif = new GIF({
    width: outputWidth,
    height: outputHeight,
    quality: Math.max(1, Math.min(20, Math.round(20 - quality * 0.18))),
    repeat: 0,
    background: CHROMA_KEY,
    transparent: CHROMA_KEY,
  });

  return new Promise<Blob>((resolve, reject) => {
    gif.on("finished", (blob: Blob) => {
      canvas.remove();
      resolve(blob);
    });

    // @ts-expect-error - gif.js 0.2.0 emits "error" but types exclude it
    gif.on("error", reject);

    for (let i = 0; i < frameCount; i++) {
      const t = i / Math.max(1, frameCount - 1);
      const scale = 1 + 0.02 * Math.sin(t * Math.PI * 2);
      const rotate = 0.5 * Math.sin(t * Math.PI * 2);

      const frameData = renderFrameWithKey(ctx, imageSource, cropRect, text, outputWidth, outputHeight, scale, rotate);
      gif.addFrame(frameData, { delay, copy: true });
    }

    gif.render();
  });
}

export async function exportAsWebp(options: ExportOptions): Promise<Blob> {
  const {
    imageSource, cropRect, text,
    outputWidth, outputHeight,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d")!;

  renderFrameWithAlpha(ctx, imageSource, cropRect, text, outputWidth, outputHeight, 1, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      canvas.remove();
      if (blob) resolve(blob);
      else reject(new Error("WebP encoding failed"));
    }, "image/webp", 0.95);
  });
}

export async function exportAsSticker(options: ExportOptions): Promise<Blob> {
  return exportAsWebp(options);
}

export async function copyBlobToClipboard(blob: Blob): Promise<void> {
  if (!navigator.clipboard) return;

  try {
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  } catch {
    // Clipboard write is best-effort; user can always download
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
