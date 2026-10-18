"use client";

import { useEffect } from "react";
import { btnPrimary } from "@/components/admin/ui";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const missingSchema = /PGRST20[25]|42P01|42883/.test(error.message);

  return (
    <div className="border border-gold-200/70 bg-cream-50 px-6 py-12 text-center">
      <p className="font-display text-2xl text-plum-900">
        {missingSchema ? "The database isn't set up yet" : "This page didn't load"}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
        {missingSchema
          ? "Run the files in supabase/migrations in the Supabase SQL editor, oldest first (the AI chat needs 20261018120000_ai_chat.sql), then reload."
          : "Something went wrong while fetching the data. Try again in a moment."}
      </p>
      <button type="button" onClick={reset} className={`${btnPrimary} mt-6`}>
        Try again
      </button>
    </div>
  );
}
