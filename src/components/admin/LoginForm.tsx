"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/lib/admin/actions/auth";
import { btnPrimary, inputCls, labelCls } from "./ui";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <form action={action} className="flex flex-col gap-4 border border-gold-200/70 bg-cream-50 p-6 shadow-card">
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label htmlFor="email" className={labelCls}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelCls}>
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-rose-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btnPrimary} mt-1 py-3`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
