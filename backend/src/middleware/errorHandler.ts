import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      error: {
        code: "validation_error",
        message: "Request validation failed",
        details: err.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
          code: i.code,
        })),
      },
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: {
      code: "internal_error",
      message: "Internal server error",
    },
  });
}
