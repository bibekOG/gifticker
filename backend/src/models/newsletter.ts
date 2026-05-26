import { z } from "zod";

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export const subscribeSchema = z.object({
  email: z.string().email("Must be a valid email address"),
});
