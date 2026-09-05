import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const LIVE_SUPABASE_URL = "https://mghsppxhfqzhnpqqglsh.supabase.co";
const LIVE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naHNwcHhoZnF6aG5wcXFnbHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MDg0ODYsImV4cCI6MjEwNDE4NDQ4Nn0.oA5IF9rhfzO0WW7GMD1cY97ifNuQNhYechVjb8_Xoag";

function createSupabaseClient() {
  const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL ||
    (typeof process !== 'undefined' ? process.env.SUPABASE_URL : '') ||
    LIVE_SUPABASE_URL;

  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof process !== 'undefined' ? process.env.SUPABASE_PUBLISHABLE_KEY : '') ||
    LIVE_SUPABASE_ANON_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
