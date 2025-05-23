import { createClient } from "@supabase/supabase-js";

// Use the same env variable names as the rest of the app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a singleton instance for the client-side
let supabaseInstance = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};
