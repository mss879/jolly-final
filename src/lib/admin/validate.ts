import type { PostgrestError } from "@supabase/supabase-js";

/* Small checks shared by the admin actions and pages. (Not a "use server"
   module — those may only export async functions.) */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

export function isDay(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/* Where to land after signing in: only admin pages, never another site. */
export function safeAdminPath(value: unknown) {
  if (typeof value !== "string" || !/^\/admin(\/|\?|$)/.test(value) || value.startsWith("/admin/login")) return "/admin";
  return value;
}

/* Errors raised with a PT code are written for people in the migration;
   anything else is logged and replaced with something friendlier. */
export function actionError(error: PostgrestError | null | undefined, fallback = "That didn't save — please try again.") {
  if (error?.code?.startsWith("PT")) return error.message;
  if (error) console.error(`[admin] ${error.code}: ${error.message}`);
  return fallback;
}
