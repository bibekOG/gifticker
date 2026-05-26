import path from "node:path";
import fs from "node:fs/promises";
import { v4 as uuid } from "uuid";
import { config } from "../config/index.js";

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
  const ext = path.extname(file.originalname);
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
