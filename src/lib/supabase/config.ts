/* Supabase connection settings (see .env.example). When they're missing the
   public forms fall back to WhatsApp/email and /admin explains what to set. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/* PostgREST codes for "that table/function doesn't exist" — the migration
   hasn't been run on this project yet. */
export function isMissingSchema(error: { code?: string } | null | undefined) {
  return error?.code === "PGRST202" || error?.code === "PGRST205" || error?.code === "42P01" || error?.code === "42883";
}
