import type { Subscriber } from "../../models/newsletter.js";
import { supabase } from "../supabase.js";

interface SubscriberRow {
  id: string;
  email: string;
  created_at: string;
}

function rowToSubscriber(row: SubscriberRow): Subscriber {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  };
}

export const newsletterRepository = {
  async findByEmail(email: string): Promise<Subscriber | null> {
    if (!supabase) return null;

    const { data } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email)
      .single();

    return data ? rowToSubscriber(data) : null;
  },

  async create(email: string): Promise<Subscriber> {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("subscribers")
      .insert({ email })
      .select()
      .single();

    if (error) throw error;
    return rowToSubscriber(data);
  },
};
