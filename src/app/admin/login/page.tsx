import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { btnSecondary } from "@/components/admin/ui";
import { signOut } from "@/lib/admin/actions/auth";
import { getAuthState } from "@/lib/admin/auth";
import { safeAdminPath } from "@/lib/admin/validate";

export const metadata: Metadata = { title: "Sign in" };

const MIGRATION = "supabase/migrations/20260917120000_admin_backend.sql";

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gold-300 bg-cream-50 p-5 text-sm leading-relaxed text-ink-700">
      <p className="font-semibold text-plum-900">{title}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const [state, params] = await Promise.all([getAuthState(), searchParams]);
  const next = typeof params.next === "string" ? params.next : undefined;
  if (state.kind === "admin") redirect(safeAdminPath(next));

  const signOutButton = (
    <form action={signOut}>
      <button type="submit" className={btnSecondary}>
        Sign out
      </button>
    </form>
  );

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image
            src="/images/brand/logo.png"
            alt="Jolly's Creamery"
            width={112}
            height={160}
            className="mx-auto h-20 w-auto object-contain"
          />
          <h1 className="mt-4 font-display text-3xl font-semibold text-plum-900">Admin</h1>
          <p className="mt-1 text-sm text-ink-500">Inquiries, bookings and the pipeline.</p>
        </div>

        {state.kind === "unconfigured" && (
          <Notice title="Supabase isn't connected">
            <p>
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
              <code>.env.local</code> (see <code>.env.example</code>), then restart the server.
            </p>
          </Notice>
        )}

        {state.kind === "needs-migration" && (
          <Notice title="One step left: create the tables">
            <p>
              You&apos;re signed in as {state.user.email}, but the database is empty. Run <code>{MIGRATION}</code>{" "}
              in the Supabase SQL editor, add yourself as an admin, then reload.
            </p>
            {signOutButton}
          </Notice>
        )}

        {state.kind === "not-admin" && (
          <Notice title="This account isn't an admin">
            <p>
              {state.user.email} can sign in, but isn&apos;t on the admin list. In the Supabase SQL editor, run:
            </p>
            <pre className="overflow-x-auto bg-cream-200/70 p-3 text-[0.7rem] leading-relaxed whitespace-pre-wrap">
              {`insert into public.admin_users (user_id, email)\nselect id, email from auth.users\nwhere email = '${state.user.email}';`}
            </pre>
            {signOutButton}
          </Notice>
        )}

        {state.kind === "signed-out" && <LoginForm next={next} />}
      </div>
    </main>
  );
}
