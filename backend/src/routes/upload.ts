import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.js";
import { config } from "../config/index.js";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
];

const upload = multer({
  dest: config.uploadDir,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const router = Router();

router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
