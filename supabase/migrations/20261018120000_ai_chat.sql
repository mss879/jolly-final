-- =====================================================================
-- Jolly's Creamery — AI chat concierge
--
--   chat_sessions   one row per website visitor's conversation
--   chat_messages   every message in it: the visitor's, the AI's, the team's
--   crm_leads       gains the source 'chat' and a link back to its conversation
--
-- Run once in the Supabase SQL editor, after
--   20260917120000_admin_backend.sql and
--   20261016120000_public_forms_server_only.sql
-- (it uses their helpers, and the chat books through submit_booking, which
-- that second file opened to the secret key). Every statement is idempotent,
-- so running it twice is harmless.
--
-- Security model — same as the rest of the backend
--   * Browsers never talk to Supabase. The website's server calls the chat_*
--     entry points below with the secret key (service_role); the publishable
--     key can't call them at all.
--   * A conversation's id is a random UUID made in the visitor's browser. It
--     is their key to that conversation and nothing else.
--   * Reading conversations, taking over, replying, handing back and deleting
--     need a signed-in user listed in admin_users (Row Level Security and the
--     admin functions themselves).
-- =====================================================================


-- ---------------------------------------------------------------------
-- Conversations
-- ---------------------------------------------------------------------

/* mode       'ai': the concierge answers. 'human': a team member has taken
              over, and the AI stays quiet until they hand it back.
   attention  the team should look: the visitor asked for a person, or wrote
              while a person is in charge and hasn't been answered yet.
   booking_draft  the reserve details the AI has gathered so far, shown to the
              visitor as a summary card before anything is sent. The booking
              itself lives in public.bookings under the same session id. */
create table if not exists public.chat_sessions (
  id uuid primary key,
  mode text not null default 'ai' check (mode in ('ai', 'human')),
  attention boolean not null default false,
  handover_reason text check (char_length(handover_reason) <= 300),

  visitor_name text check (char_length(visitor_name) <= 120),
  visitor_email text check (char_length(visitor_email) <= 254),
  visitor_phone text check (char_length(visitor_phone) <= 40),
  booking_draft jsonb not null default '{}'::jsonb
    check (jsonb_typeof(booking_draft) = 'object' and pg_column_size(booking_draft) <= 8000),

  first_page text check (char_length(first_page) <= 300),
  last_page text check (char_length(last_page) <= 300),
  device text check (device in ('mobile', 'tablet', 'desktop')),
  user_agent text check (char_length(user_agent) <= 500),

  message_count integer not null default 0,
  visitor_message_count integer not null default 0,
  last_preview text check (char_length(last_preview) <= 160), -- for the admin's list
  last_role text check (last_role in ('user', 'assistant', 'agent')),
  last_message_at timestamptz not null default now(),
  last_visitor_message_at timestamptz,
  visitor_seen_at timestamptz not null default now(), -- the open widget checks in; "online now"

  taken_over_at timestamptz,
  taken_over_by uuid references auth.users (id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_sessions_last_message_idx on public.chat_sessions (last_message_at desc);
create index if not exists chat_sessions_attention_idx on public.chat_sessions (last_message_at desc) where attention;
create index if not exists chat_sessions_created_at_idx on public.chat_sessions (created_at);

drop trigger if exists chat_sessions_set_updated_at on public.chat_sessions;
create trigger chat_sessions_set_updated_at
  before update on public.chat_sessions
  for each row execute function private.set_updated_at();


-- ---------------------------------------------------------------------
-- Messages
-- ---------------------------------------------------------------------

/* user       the visitor
   assistant  the AI concierge
   agent      a team member, replying from /admin/chats
   system     a notice both sides see ("A member of the team has joined")
   blocks     what the chat draws under the text: flavour and cart cards,
              the booking summary, quick replies. Written by the site's own
              code, never by the model directly. */
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.chat_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'agent', 'system')),
  content text not null default '' check (char_length(content) <= 4000),
  blocks jsonb not null default '[]'::jsonb
    check (jsonb_typeof(blocks) = 'array' and pg_column_size(blocks) <= 16000),
  author_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_idx on public.chat_messages (session_id, id);
create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at);

/* Keeps each conversation's counters and flags in step with its messages,
   whoever wrote them. */
create or replace function private.chat_messages_after_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.chat_sessions s
     set message_count = s.message_count + 1,
         last_message_at = new.created_at,
         visitor_message_count = s.visitor_message_count + case when new.role = 'user' then 1 else 0 end,
         last_preview = case when new.role <> 'system' and new.content <> '' then left(new.content, 160) else s.last_preview end,
         last_role = case when new.role <> 'system' and new.content <> '' then new.role else s.last_role end,
         last_visitor_message_at = case when new.role = 'user' then new.created_at else s.last_visitor_message_at end,
         attention = case
                       when new.role = 'user' and s.mode = 'human' then true
                       when new.role = 'agent' then false
                       else s.attention
                     end
   where s.id = new.session_id;
  return new;
end;
$$;

drop trigger if exists chat_messages_after_insert on public.chat_messages;
create trigger chat_messages_after_insert
  after insert on public.chat_messages
  for each row execute function private.chat_messages_after_insert();


-- ---------------------------------------------------------------------
-- CRM — leads the concierge captures
-- ---------------------------------------------------------------------

alter table public.crm_leads
  add column if not exists chat_session_id uuid unique references public.chat_sessions (id) on delete set null;

alter table public.crm_leads drop constraint if exists crm_leads_source_check;
alter table public.crm_leads
  add constraint crm_leads_source_check check (source in ('inquiry', 'booking', 'manual', 'chat'));


-- ---------------------------------------------------------------------
-- Row Level Security — admins only
-- ---------------------------------------------------------------------

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

revoke all on table public.chat_sessions, public.chat_messages from anon, authenticated;

grant select, update, delete on table public.chat_sessions to authenticated;
grant select, insert on table public.chat_messages to authenticated;

drop policy if exists "Admins can read chats" on public.chat_sessions;
create policy "Admins can read chats" on public.chat_sessions
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins can update chats" on public.chat_sessions;
create policy "Admins can update chats" on public.chat_sessions
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins can delete chats" on public.chat_sessions;
create policy "Admins can delete chats" on public.chat_sessions
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can read chat messages" on public.chat_messages;
create policy "Admins can read chat messages" on public.chat_messages
  for select to authenticated using ((select public.is_admin()));
-- Admins write only as themselves, and only team replies and notices.
drop policy if exists "Admins can write in chats" on public.chat_messages;
create policy "Admins can write in chats" on public.chat_messages
  for insert to authenticated
  with check (
    (select public.is_admin())
    and role in ('agent', 'system')
    and author_id = (select auth.uid())
  );


-- ---------------------------------------------------------------------
-- Entry points for the website's server (secret key only)
-- ---------------------------------------------------------------------

/* Adds a message to a conversation and returns it with the conversation's
   mode. A visitor's first message opens the conversation.

   Flood guards, all far above real use: 150 new conversations and 2,000
   visitor messages across the site per ten minutes; 10 messages a minute
   and 80 in all per conversation.

   An AI reply that arrives after a team member has taken over is dropped:
   the result then has a null message. */
create or replace function public.chat_append(
  p_session_id uuid,
  p_role text,
  p_content text,
  p_blocks jsonb default '[]'::jsonb,
  p_context jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_content text := left(btrim(coalesce(p_content, '')), 4000);
  v_page text;
  v_device text;
  v_mode text;
  v_count integer;
  v_row public.chat_messages%rowtype;
begin
  if p_session_id is null or p_role is null or p_role not in ('user', 'assistant', 'system') then
    raise exception using errcode = 'PT400', message = 'Invalid message';
  end if;
  if jsonb_typeof(p_blocks) is distinct from 'array' then
    p_blocks := '[]'::jsonb;
  end if;
  if jsonb_typeof(p_context) is distinct from 'object' then
    p_context := '{}'::jsonb;
  end if;
  if v_content = '' and jsonb_array_length(p_blocks) = 0 then
    raise exception using errcode = 'PT400', message = 'Write a message first';
  end if;

  v_page := private.clean_text(p_context ->> 'page', 300);
  v_device := case when p_context ->> 'device' in ('mobile', 'tablet', 'desktop') then p_context ->> 'device' end;

  select mode, visitor_message_count into v_mode, v_count
    from public.chat_sessions
   where id = p_session_id
     for update;

  if p_role = 'user' then
    if v_mode is null then
      if (select count(*) from public.chat_sessions where created_at > now() - interval '10 minutes') >= 150 then
        raise exception using errcode = 'PT429',
          message = 'Our chat is very busy right now. Please try again in a few minutes, or message us on WhatsApp.';
      end if;
      insert into public.chat_sessions (id, first_page, last_page, device, user_agent)
      values (p_session_id, v_page, v_page, v_device, private.clean_text(p_context ->> 'user_agent', 500))
      on conflict (id) do nothing;
      select mode, visitor_message_count into v_mode, v_count
        from public.chat_sessions
       where id = p_session_id
         for update;
    end if;

    if v_count >= 80 then
      raise exception using errcode = 'PT429',
        message = 'This chat has reached its limit. Please message us on WhatsApp and we''ll pick it up from there.';
    end if;
    if (select count(*) from public.chat_messages
         where session_id = p_session_id and role = 'user'
           and created_at > now() - interval '1 minute') >= 10 then
      raise exception using errcode = 'PT429', message = 'That''s a lot of messages at once. Give it a moment and try again.';
    end if;
    if (select count(*) from public.chat_messages
         where role = 'user' and created_at > now() - interval '10 minutes') >= 2000 then
      raise exception using errcode = 'PT429',
        message = 'Our chat is very busy right now. Please try again in a few minutes, or message us on WhatsApp.';
    end if;

    if v_page is not null then
      update public.chat_sessions set last_page = v_page where id = p_session_id;
    end if;
  else
    if v_mode is null then
      raise exception using errcode = 'PT404', message = 'Conversation not found';
    end if;
    if p_role = 'assistant' and v_mode = 'human' then
      return jsonb_build_object('mode', v_mode, 'message', null);
    end if;
  end if;

  insert into public.chat_messages (session_id, role, content, blocks)
  values (p_session_id, p_role, v_content, p_blocks)
  returning * into v_row;

  return jsonb_build_object(
    'mode', v_mode,
    'message', jsonb_build_object(
      'id', v_row.id, 'role', v_row.role, 'content', v_row.content,
      'blocks', v_row.blocks, 'created_at', v_row.created_at
    )
  );
end;
$$;

/* A conversation's state and its messages after p_after (0 = the latest
   p_limit). Called by the open widget every few seconds, so it also notes
   that the visitor is still there, at most every 20 seconds. */
create or replace function public.chat_feed(
  p_session_id uuid,
  p_after bigint default 0,
  p_limit integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.chat_sessions%rowtype;
  v_after bigint := greatest(coalesce(p_after, 0), 0);
  v_limit integer := least(greatest(coalesce(p_limit, 50), 1), 100);
begin
  select * into v_session from public.chat_sessions where id = p_session_id;
  if not found then
    return jsonb_build_object('exists', false, 'mode', 'ai', 'messages', '[]'::jsonb);
  end if;

  if v_session.visitor_seen_at < now() - interval '20 seconds' then
    update public.chat_sessions set visitor_seen_at = now() where id = p_session_id;
  end if;

  return jsonb_build_object(
    'exists', true,
    'mode', v_session.mode,
    'booking_draft', v_session.booking_draft,
    'booking_sent', exists (
      select 1 from public.bookings b where b.session_id = p_session_id and b.status <> 'in_progress'
    ),
    'lead_saved', exists (select 1 from public.crm_leads l where l.chat_session_id = p_session_id),
    'messages', coalesce((
      select jsonb_agg(
               jsonb_build_object(
                 'id', m.id, 'role', m.role, 'content', m.content,
                 'blocks', m.blocks, 'created_at', m.created_at
               ) order by m.id
             )
        from (
          select id, role, content, blocks, created_at
            from public.chat_messages
           where session_id = p_session_id and id > v_after
           order by case when v_after = 0 then -id else id end
           limit v_limit
        ) m
    ), '[]'::jsonb)
  );
end;
$$;

/* Saves what the concierge has learned: the visitor's contact details, the
   booking draft, and a request for a person. Keys that are absent are left
   alone. */
create or replace function public.chat_update(p_session_id uuid, p_fields jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
begin
  if p_session_id is null or jsonb_typeof(p_fields) is distinct from 'object' then
    raise exception using errcode = 'PT400', message = 'Invalid update';
  end if;

  v_email := private.clean_text(p_fields ->> 'visitor_email', 254);
  if v_email is not null and not private.is_email(v_email) then
    v_email := null;
  end if;

  update public.chat_sessions s set
    visitor_name = coalesce(private.clean_text(p_fields ->> 'visitor_name', 120), s.visitor_name),
    visitor_email = coalesce(v_email, s.visitor_email),
    visitor_phone = coalesce(private.clean_text(p_fields ->> 'visitor_phone', 40), s.visitor_phone),
    booking_draft = case
                      when jsonb_typeof(p_fields -> 'booking_draft') = 'object'
                       and pg_column_size(p_fields -> 'booking_draft') <= 8000
                      then p_fields -> 'booking_draft'
                      else s.booking_draft
                    end,
    attention = case when p_fields ? 'handover' then true else s.attention end,
    handover_reason = case
                        when p_fields ? 'handover'
                        then coalesce(private.clean_text(p_fields ->> 'handover', 300), 'Asked for a person')
                        else s.handover_reason
                      end
  where s.id = p_session_id;
end;
$$;

/* Puts an interested visitor into the CRM's New Leads, linked to their
   conversation. Called again for the same conversation, it updates that
   lead rather than adding another. */
create or replace function public.chat_capture_lead(p_session_id uuid, p_fields jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
  v_email text;
  v_phone text;
  v_notes text;
  v_lead uuid;
begin
  if p_session_id is null or jsonb_typeof(p_fields) is distinct from 'object' then
    raise exception using errcode = 'PT400', message = 'Missing details';
  end if;
  if not exists (select 1 from public.chat_sessions where id = p_session_id) then
    raise exception using errcode = 'PT404', message = 'Conversation not found';
  end if;

  v_name := private.clean_text(p_fields ->> 'name', 120);
  v_email := private.clean_text(p_fields ->> 'email', 254);
  v_phone := private.clean_text(p_fields ->> 'phone', 40);
  v_notes := private.clean_text(p_fields ->> 'notes', 4000);

  if v_name is null or (v_email is null and v_phone is null) then
    raise exception using errcode = 'PT400', message = 'A name and a phone number or email address are needed';
  end if;
  if v_email is not null and not private.is_email(v_email) then
    raise exception using errcode = 'PT400', message = 'That email address doesn''t look right';
  end if;

  select id into v_lead from public.crm_leads where chat_session_id = p_session_id for update;

  if v_lead is null then
    if (select count(*) from public.crm_leads
         where source = 'chat' and created_at > now() - interval '10 minutes') >= 30 then
      raise exception using errcode = 'PT429', message = 'Too many requests. Please try again shortly';
    end if;
    insert into public.crm_leads (
      stage_id, name, email, phone, event_type, event_date, guests, notes, source, chat_session_id, created_by
    )
    values (
      (select id from public.crm_stages where is_system),
      v_name, v_email, v_phone,
      private.clean_text(p_fields ->> 'event_type', 60),
      private.to_event_date(p_fields ->> 'event_date'),
      private.to_int(p_fields ->> 'guests', 1, 100000),
      v_notes, 'chat', p_session_id, null
    )
    returning id into v_lead;
  else
    update public.crm_leads set
      name = v_name,
      email = coalesce(v_email, email),
      phone = coalesce(v_phone, phone),
      event_type = coalesce(private.clean_text(p_fields ->> 'event_type', 60), event_type),
      event_date = coalesce(private.to_event_date(p_fields ->> 'event_date'), event_date),
      guests = coalesce(private.to_int(p_fields ->> 'guests', 1, 100000), guests),
      notes = case
                when v_notes is null or position(v_notes in coalesce(notes, '')) > 0 then notes
                else left(concat_ws(E'\n\n', notes, v_notes), 10000)
              end
    where id = v_lead;
  end if;

  update public.chat_sessions set
    visitor_name = coalesce(visitor_name, v_name),
    visitor_email = coalesce(visitor_email, v_email),
    visitor_phone = coalesce(visitor_phone, v_phone)
  where id = p_session_id;

  return v_lead;
end;
$$;


-- ---------------------------------------------------------------------
-- Admin functions
-- ---------------------------------------------------------------------

/* A team member's reply. Replying also takes the conversation over, so the
   AI stops answering, and tells the visitor a person has joined. */
create or replace function public.chat_admin_reply(p_session_id uuid, p_content text)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_content text := nullif(left(btrim(coalesce(p_content, '')), 4000), '');
  v_mode text;
  v_id bigint;
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;
  if v_content is null then
    raise exception using errcode = 'PT400', message = 'Write a reply first';
  end if;

  select mode into v_mode from public.chat_sessions where id = p_session_id for update;
  if not found then
    raise exception using errcode = 'PT404', message = 'That chat no longer exists';
  end if;

  if v_mode <> 'human' then
    update public.chat_sessions
       set mode = 'human', taken_over_at = now(), taken_over_by = auth.uid()
     where id = p_session_id;
    insert into public.chat_messages (session_id, role, content, author_id)
    values (p_session_id, 'system', 'A member of the Jolly''s team has joined the chat.', auth.uid());
  end if;

  insert into public.chat_messages (session_id, role, content, author_id)
  values (p_session_id, 'agent', v_content, auth.uid())
  returning id into v_id;

  return v_id;
end;
$$;

/* 'human' pauses the AI so a team member can step in; 'ai' hands the
   conversation back. Either way the visitor sees a short notice, and the
   conversation no longer needs attention. */
create or replace function public.chat_admin_set_mode(p_session_id uuid, p_mode text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_mode text;
begin
  if not public.is_admin() then
    raise exception using errcode = 'PT403', message = 'Admins only';
  end if;
  if p_mode is null or p_mode not in ('ai', 'human') then
    raise exception using errcode = 'PT400', message = 'Unknown mode';
  end if;

  select mode into v_mode from public.chat_sessions where id = p_session_id for update;
  if not found then
    raise exception using errcode = 'PT404', message = 'That chat no longer exists';
  end if;

  if v_mode = p_mode then
    update public.chat_sessions set attention = false where id = p_session_id and attention;
    return;
  end if;

  update public.chat_sessions set
    mode = p_mode,
    attention = false,
    taken_over_at = case when p_mode = 'human' then now() else taken_over_at end,
    taken_over_by = case when p_mode = 'human' then auth.uid() else taken_over_by end
  where id = p_session_id;

  insert into public.chat_messages (session_id, role, content, author_id)
  values (
    p_session_id,
    'system',
    case when p_mode = 'human'
         then 'A member of the Jolly''s team has joined the chat.'
         else 'You''re back with Jolly''s concierge. The team can still see this chat.'
    end,
    auth.uid()
  );
end;
$$;


-- ---------------------------------------------------------------------
-- Function privileges
-- ---------------------------------------------------------------------

revoke execute on function private.chat_messages_after_insert() from public, anon, authenticated;

-- Supabase grants EXECUTE on new functions to anon and authenticated by
-- default, so revoke first and grant back only what each role needs.
revoke execute on function public.chat_append(uuid, text, text, jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.chat_feed(uuid, bigint, integer) from public, anon, authenticated;
revoke execute on function public.chat_update(uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.chat_capture_lead(uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.chat_admin_reply(uuid, text) from public, anon;
revoke execute on function public.chat_admin_set_mode(uuid, text) from public, anon;

grant execute on function public.chat_append(uuid, text, text, jsonb, jsonb) to service_role;
grant execute on function public.chat_feed(uuid, bigint, integer) to service_role;
grant execute on function public.chat_update(uuid, jsonb) to service_role;
grant execute on function public.chat_capture_lead(uuid, jsonb) to service_role;
grant execute on function public.chat_admin_reply(uuid, text) to authenticated;
grant execute on function public.chat_admin_set_mode(uuid, text) to authenticated;
