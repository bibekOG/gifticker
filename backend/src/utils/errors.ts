export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function notFound(resource: string, id?: string): AppError {
  const msg = id
    ? `${resource} with id '${id}' not found`
    : `${resource} not found`;
  return new AppError(404, "not_found", msg);
}

export function validationError(message: string, details?: unknown): AppError {
  return new AppError(422, "validation_error", message, details);
}

export function rateLimitExceeded(): AppError {
  return new AppError(429, "rate_limit_exceeded", "Too many requests. Try again later.");
}
