-- =====================================================================
-- Jolly's Creamery — recent events (Reviews page)
--
--   Recent events   a write-up and photos of events the carts have served,
--                   managed in /admin/events and shown on /reviews once
--                   published
--   event-photos    Storage bucket for their photos
--
-- Run once in the Supabase SQL editor, after 20260917120000_admin_backend.sql
-- (it uses public.is_admin() and private.set_updated_at()). Every statement
-- is idempotent, so running it twice is harmless.
--
-- Security model — same as the rest of the backend
--   * The website never reads the table directly. The anon role can only
--     execute public.published_events(), which returns published rows and
--     nothing else.
--   * Adding, editing and deleting events, and uploading or removing their
--     photos, requires a signed-in user listed in admin_users.
--   * The bucket is public, so a photo is readable by anyone who has its
--     URL. Only upload what is meant to be on the website.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------

create table if not exists public.recent_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  event_type text check (char_length(event_type) <= 60),
  event_date date,
  location text check (char_length(location) <= 120),
  summary text check (char_length(summary) <= 1200),
  -- Object paths inside the event-photos bucket, in display order. The
  -- first one is the cover.
  photos text[] not null default '{}' check (cardinality(photos) <= 24),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recent_events_published_date_idx
  on public.recent_events (published, event_date desc nulls last, created_at desc);

drop trigger if exists recent_events_set_updated_at on public.recent_events;
create trigger recent_events_set_updated_at
  before update on public.recent_events
  for each row execute function private.set_updated_at();


-- ---------------------------------------------------------------------
-- Row Level Security — admins only
-- ---------------------------------------------------------------------

alter table public.recent_events enable row level security;

revoke all on table public.recent_events from anon, authenticated;
grant select, insert, update, delete on table public.recent_events to authenticated;

drop policy if exists "Admins can read recent events" on public.recent_events;
create policy "Admins can read recent events" on public.recent_events
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins can add recent events" on public.recent_events;
create policy "Admins can add recent events" on public.recent_events
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "Admins can update recent events" on public.recent_events;
create policy "Admins can update recent events" on public.recent_events
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins can delete recent events" on public.recent_events;
create policy "Admins can delete recent events" on public.recent_events
  for delete to authenticated using ((select public.is_admin()));


-- ---------------------------------------------------------------------
-- What the website reads
-- ---------------------------------------------------------------------

/* Published events, newest first. SECURITY DEFINER so the anon role can
   read them without any access to the table itself. */
create or replace function public.published_events(p_limit integer default 24)
returns table (
  id uuid,
  title text,
  event_type text,
  event_date date,
  location text,
  summary text,
  photos text[]
)
language sql
stable
security definer
set search_path = ''
as $$
  select e.id, e.title, e.event_type, e.event_date, e.location, e.summary, e.photos
    from public.recent_events e
   where e.published
   order by e.event_date desc nulls last, e.created_at desc
   limit least(greatest(coalesce(p_limit, 24), 1), 60);
$$;

revoke execute on function public.published_events(integer) from public;
grant execute on function public.published_events(integer) to anon, authenticated;


-- ---------------------------------------------------------------------
-- Photos — Storage bucket
-- ---------------------------------------------------------------------

/* Public bucket: the website shows photos by URL. 10 MB per file, photos
   only. The admin resizes before uploading, so files are far smaller. */
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-photos', 'event-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read event photos" on storage.objects;
create policy "Admins can read event photos" on storage.objects
  for select to authenticated using (bucket_id = 'event-photos' and (select public.is_admin()));
drop policy if exists "Admins can upload event photos" on storage.objects;
create policy "Admins can upload event photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'event-photos' and (select public.is_admin()));
drop policy if exists "Admins can replace event photos" on storage.objects;
create policy "Admins can replace event photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'event-photos' and (select public.is_admin()))
  with check (bucket_id = 'event-photos' and (select public.is_admin()));
drop policy if exists "Admins can delete event photos" on storage.objects;
create policy "Admins can delete event photos" on storage.objects
  for delete to authenticated using (bucket_id = 'event-photos' and (select public.is_admin()));
