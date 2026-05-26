import type { Request, Response, NextFunction } from "express";
import * as storageService from "../services/storageService.js";

export async function uploadFile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        error: { code: "no_file", message: "No file provided" },
      });
      return;
    }

    const file = await storageService.saveFile(req.file);
    res.status(201).json({ data: file });
  } catch (err) {
    next(err);
  }
}
