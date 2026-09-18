import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isMissingSchema, supabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

type Verdict = "admin" | "not-admin" | "needs-migration";

type Session = {
  user: AdminUser;
  supabase: Awaited<ReturnType<typeof createClient>>;
  verdict: Promise<Verdict>;
};

/* Who is asking, resolved once per request. The JWT is verified against the
   project's signing keys, which are asymmetric — that happens in this process,
   with no network call.

   The allowlist check is a network call, so it is started here but
   deliberately not awaited: callers hand it to Promise.all next to their own
   query so the two share one round trip instead of taking one each. */
const getSession = cache(async (): Promise<Session | null> => {
  if (!supabaseConfigured) return null;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const verdict = (async (): Promise<Verdict> => {
    try {
      const { data: isAdmin, error } = await supabase.rpc("is_admin");
      if (isMissingSchema(error)) return "needs-migration";
      return error || !isAdmin ? "not-admin" : "admin";
    } catch {
      return "not-admin";
    }
  })();

  return {
    user: { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null },
    supabase,
    verdict,
  };
});

export type AuthState =
  | { kind: "unconfigured" }
  | { kind: "signed-out" }
  | { kind: Verdict; user: AdminUser };

/* Blocking form, for the sign-in page — it has nothing else to get on with. */
export async function getAuthState(): Promise<AuthState> {
  if (!supabaseConfigured) return { kind: "unconfigured" };
  const session = await getSession();
  if (!session) return { kind: "signed-out" };
  return { kind: await session.verdict, user: session.user };
}

/* Every admin page and query starts here. `verify()` is the allowlist check
   still in flight: await it inside the same Promise.all as the query it
   guards. Issuing the query before the check has landed is safe — Row Level
   Security is what actually withholds the rows, and it is evaluated in the
   database on every single request. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return {
    user: session.user,
    supabase: session.supabase,
    verify: async () => {
      if ((await session.verdict) !== "admin") redirect("/admin/login");
    },
  };
}

/* For writes: nothing happens until the allowlist check has come back. */
export async function requireVerifiedAdmin() {
  const admin = await requireAdmin();
  await admin.verify();
  return admin;
}

/* Just the address for the sidebar — it comes straight off the verified JWT,
   so it costs no round trip at all. */
export async function adminEmail() {
  const { user } = await requireAdmin();
  return user.email;
}
