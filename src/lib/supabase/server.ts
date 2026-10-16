import "server-only";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigured } from "./config";
import type { Database } from "./database.types";

/* Signed-in client for /admin — the session lives in cookies, so Row Level
   Security sees the admin. Create one per request. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components can't write cookies; the proxy refreshes the
          // session on every /admin request, so nothing is lost.
        }
      },
    },
  });
}

/* Client for the public form endpoints, which only call the submit_inquiry /
   track_booking / submit_booking functions. With SUPABASE_SECRET_KEY set (a
   server-only secret, never NEXT_PUBLIC_) it uses that, so the functions can
   be closed to direct browser calls (migration 20261016120000); without it,
   the publishable key. */
export function createPublicClient() {
  if (!supabaseConfigured) return null;
  return createSupabaseClient<Database>(SUPABASE_URL, process.env.SUPABASE_SECRET_KEY || SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
