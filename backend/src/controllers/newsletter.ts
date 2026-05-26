import type { Request, Response, NextFunction } from "express";
import * as newsletterService from "../services/newsletterService.js";

export async function subscribe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subscriber = await newsletterService.subscribe(req.body.email);
    res.status(201).json({ data: subscriber });
  } catch (err) {
    next(err);
  }
}
