import path from "node:path";
import fs from "node:fs/promises";
import { v4 as uuid } from "uuid";
import { config } from "../config/index.js";

const ALLOWED_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".mp4", ".mov", ".webm", ".avi",
]);

function safeExtension(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext) ? ext : ".bin";
}

export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
}

export async function saveFile(
  file: Express.Multer.File
): Promise<UploadedFile> {
  const id = uuid();
  const ext = safeExtension(file.originalname);
  const fileName = `${id}${ext}`;
  const destDir = config.uploadDir;

  await fs.mkdir(destDir, { recursive: true });

  const destPath = path.join(destDir, fileName);
  await fs.rename(file.path, destPath);

  return {
    id,
    originalName: file.originalname,
    fileName,
    mimeType: file.mimetype,
    size: file.size,
    path: destPath,
  };
}
