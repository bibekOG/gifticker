import { v4 as uuid } from "uuid";
import type { Subscriber } from "../models/newsletter.js";
import { supabase } from "../db/supabase.js";
import { newsletterRepository } from "../db/repositories/newsletterRepository.js";

const fallbackSubscribers: Subscriber[] = [];

export async function subscribe(email: string): Promise<Subscriber> {
  if (supabase) {
    const existing = await newsletterRepository.findByEmail(email);
    if (existing) return existing;
    return newsletterRepository.create(email);
  }

  const existing = fallbackSubscribers.find((s) => s.email === email);
  if (existing) return existing;

  const subscriber: Subscriber = {
    id: uuid(),
    email,
    createdAt: new Date().toISOString(),
  };
  fallbackSubscribers.push(subscriber);
  return subscriber;
}
