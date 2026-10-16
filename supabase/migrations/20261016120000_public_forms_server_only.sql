-- Public form functions: callable only by the website's server, not directly
-- from a browser with the publishable key.
--
-- Until now anyone could call submit_inquiry / track_booking / submit_booking
-- straight through Supabase's REST API with the publishable key (it ships to
-- every browser), skipping the site's honeypot and per-visitor limits. After
-- this, only the secret key (the service_role role) may call them, and the
-- site's /api routes use that key.
--
-- ORDER MATTERS. Apply this only after:
--   1. a secret key exists (Project Settings → API Keys → Secret keys), and
--   2. it is set as SUPABASE_SECRET_KEY on the host (and in .env.local), and
--   3. that deployment is live.
-- Applied any earlier, the contact and reserve forms stop saving.
-- To undo: grant execute on the three functions back to anon, authenticated.

revoke execute on function public.submit_inquiry(text, text, text, text, text, text) from anon, authenticated;
revoke execute on function public.track_booking(uuid, jsonb, jsonb, jsonb) from anon, authenticated;
revoke execute on function public.submit_booking(uuid, jsonb, jsonb) from anon, authenticated;

grant execute on function public.submit_inquiry(text, text, text, text, text, text) to service_role;
grant execute on function public.track_booking(uuid, jsonb, jsonb, jsonb) to service_role;
grant execute on function public.submit_booking(uuid, jsonb, jsonb) to service_role;
