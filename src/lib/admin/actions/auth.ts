"use server";

import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { safeAdminPath } from "../validate";

export type SignInState = { error?: string; email?: string };

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!supabaseConfigured) return { email, error: "Supabase isn't connected yet." };
  if (!email || !password) return { email, error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const message =
      error.code === "email_not_confirmed"
        ? "Confirm your email address first — check your inbox."
        : error.status === 429
          ? "Too many sign-in attempts — wait a minute and try again."
          : !error.status || error.status >= 500
            ? "Sign-in isn't available right now — try again shortly."
            : "That email and password don't match.";
    return { email, error: message };
  }

  redirect(safeAdminPath(formData.get("next")));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
