import { apiFetch } from "./api";

export async function subscribeNewsletter(email: string): Promise<void> {
  await apiFetch("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
