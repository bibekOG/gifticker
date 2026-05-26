import type { Request, Response, NextFunction } from "express";
import { rateLimitExceeded } from "../utils/errors.js";

const requests = new Map<string, number[]>();

export function rateLimit(maxRequests = 60, windowMs = 60_000) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const timestamps = requests.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < windowMs);

    if (recent.length >= maxRequests) {
      next(rateLimitExceeded());
      return;
    }

    recent.push(now);
    requests.set(ip, recent);
    next();
  };
}
