import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isMissingSchema, supabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

type AuthState =
  | { kind: "unconfigured" }
  | { kind: "signed-out" }
  | { kind: "needs-migration"; user: AdminUser }
  | { kind: "not-admin"; user: AdminUser }
  | { kind: "admin"; user: AdminUser; supabase: Awaited<ReturnType<typeof createClient>> };

/* Who is asking, resolved once per request. The JWT is verified with the
   project's signing keys, then the user is checked against admin_users. */
export const getAuthState = cache(async (): Promise<AuthState> => {
  if (!supabaseConfigured) return { kind: "unconfigured" };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return { kind: "signed-out" };

  const user = { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (isMissingSchema(error)) return { kind: "needs-migration", user };
  if (error || !isAdmin) return { kind: "not-admin", user };

  return { kind: "admin", user, supabase };
});

/* Every admin page, query and action starts here. */
export async function requireAdmin() {
  const state = await getAuthState();
  if (state.kind !== "admin") redirect("/admin/login");
  return state;
}
