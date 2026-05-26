import { API_BASE_URL } from "../utils/constants";

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json();

  if (!res.ok) {
    const err = body as ApiError;
    throw new Error(err.error?.message || `API error: ${res.status}`);
  }

  return (body as ApiResponse<T>).data;
}
