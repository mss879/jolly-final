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

const NO_SESSION = { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false };

/* Anonymous client on the publishable key, for public reads such as the
   published_events function. Row Level Security applies as for any visitor. */
export function createPublicClient() {
  if (!supabaseConfigured) return null;
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_KEY, { auth: NO_SESSION });
}

/* For the public endpoints only: the three form functions (submit_inquiry,
   track_booking, submit_booking), which migration 20261016120000 closed to
   the publishable key, and the chat_* functions behind /api/chat. Uses the
   server-only SUPABASE_SECRET_KEY, which bypasses Row Level Security: call
   those functions with it and never use it for anything else. */
let warnedNoSecret = false;
export function createFormsClient() {
  if (!supabaseConfigured) return null;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret && !warnedNoSecret && process.env.NODE_ENV === "production") {
    warnedNoSecret = true;
    console.error("[forms] SUPABASE_SECRET_KEY is not set: the contact form, reserve form and chat can't save.");
  }
  return createSupabaseClient<Database>(SUPABASE_URL, secret || SUPABASE_KEY, { auth: NO_SESSION });
}
