import { createClient } from "@supabase/supabase-js";
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL) {
    const message = `Missing Supabase URL environment variable. Please set SUPABASE_URL in your .env file.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    const message = `Missing Supabase Service Role Key environment variable. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  try {
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        storage: void 0,
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (error) {
    console.error("[Supabase] Failed to create admin client:", error);
    throw new Error(`Failed to initialize Supabase admin client: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    try {
      if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
      return Reflect.get(_supabaseAdmin, prop, receiver);
    } catch (error) {
      console.error("[Supabase Proxy] Error:", error);
      throw error;
    }
  }
});
export {
  supabaseAdmin
};
