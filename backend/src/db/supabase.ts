import { createClient } from "@supabase/supabase-js";
import { config } from "../config/index.js";

export const supabase = config.supabaseUrl && config.supabaseAnonKey
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn(
    "Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env.\n" +
    "Falling back to in-memory data store."
  );
}
