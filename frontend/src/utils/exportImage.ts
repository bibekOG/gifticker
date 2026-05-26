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

function renderFrame(
  ctx: CanvasRenderingContext2D,
  imageSource: CanvasImageSource,
  cropRect: { x: number; y: number; width: number; height: number } | undefined,
  text: string,
  outputWidth: number,
  outputHeight: number,
  scale: number,
  rotate: number
): ImageData {
  ctx.clearRect(0, 0, outputWidth, outputHeight);

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
    background: "#00000000",
    transparent: null,
  });

  return new Promise<Blob>((resolve, reject) => {
    gif.on("finished", (blob: Blob) => {
      canvas.remove();
      resolve(blob);
    });

    gif.on("error", reject);

    for (let i = 0; i < frameCount; i++) {
      const t = i / Math.max(1, frameCount - 1);
      const scale = 1 + 0.02 * Math.sin(t * Math.PI * 2);
      const rotate = 0.5 * Math.sin(t * Math.PI * 2);

      const frameData = renderFrame(ctx, imageSource, cropRect, text, outputWidth, outputHeight, scale, rotate);
      gif.addFrame(frameData, { delay, copy: true });
    }

    gif.render();
  });
}

export async function exportAsSticker(options: ExportOptions): Promise<Blob> {
  return exportAsGif(options);
}

export async function copyBlobToClipboard(blob: Blob): Promise<void> {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
  } catch {
    const item = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([item]);
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
