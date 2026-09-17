import { createPublicClient } from "@/lib/supabase/server";
import { formError, readJson, text, unavailable } from "@/lib/public-forms";

/* POST /api/contact — the contact form. Lands in /admin/inquiries. */
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });

  // A field people never see: if it's filled in, a bot sent this.
  if (text(body.website)) return Response.json({ ok: true });

  const supabase = createPublicClient();
  if (!supabase) return unavailable();

  const { error } = await supabase.rpc("submit_inquiry", {
    p_name: text(body.name) ?? "",
    p_email: text(body.email) ?? "",
    p_phone: text(body.phone),
    p_message: text(body.message),
    p_page_path: "/contact",
    p_user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
  });
  if (error) return formError(error);

  return Response.json({ ok: true });
}
