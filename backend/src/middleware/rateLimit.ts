import type { Request, Response, NextFunction } from "express";
import { rateLimitExceeded } from "../utils/errors.js";

const requests = new Map<string, number[]>();

const CLEANUP_INTERVAL_MS = 60_000;
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requests) {
    const recent = timestamps.filter((t) => now - t < 60_000);
    if (recent.length === 0) {
      requests.delete(ip);
    } else {
      requests.set(ip, recent);
    }
  }
}, CLEANUP_INTERVAL_MS);

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
