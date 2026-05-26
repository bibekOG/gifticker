import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.js";
import { config } from "../config/index.js";

const upload = multer({
  dest: config.uploadDir,
  limits: { fileSize: config.maxFileSize },
});

const router = Router();

router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
