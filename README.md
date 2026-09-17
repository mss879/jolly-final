# Jolly's Creamery

The Jolly's Creamery website (Next.js 16, React 19, Tailwind 4) and its admin area at `/admin`, backed by Supabase.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the two Supabase values
npm run dev
```

The site is at http://localhost:3000 and the admin at http://localhost:3000/admin.

## Supabase setup (once per project)

1. **Environment variables.** Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from Supabase → Project Settings → API Keys into `.env.local`, and add the same two to the hosting provider (e.g. Vercel). No secret or service-role key is needed.
2. **Run the migration.** Open `supabase/migrations/20260917120000_admin_backend.sql`, paste it into the Supabase SQL editor and run it (or `supabase db push` with a linked CLI). Running it twice is harmless.
3. **Create an admin login.** Supabase → Authentication → Users → Add user → Create new user (tick *Auto confirm*). Then allow that account into the admin in the SQL editor:

   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```

4. **Turn off public sign-ups.** Authentication → Sign In / Providers → switch off *Allow new users to sign up*. Only accounts in `admin_users` can see any data either way, but nobody else needs an account.

## The admin area

| Page | What it does |
| --- | --- |
| Dashboard | What needs attention (unread inquiries, bookings awaiting confirmation, unfinished bookings), 30-day numbers with the previous 30 days for comparison, enquiries per day, upcoming events, the pipeline and the booking-form funnel. |
| Inquiries | Contact-form messages. Opening one marks it read; archive, delete or **Move to CRM** (it lands in New Leads). |
| CRM | Kanban pipeline. Drag cards between stages (touch: press and hold; keyboard: Space, arrows, Space). **New Leads** is fixed; every other stage can be renamed, moved, added or deleted — a deleted stage's cards move to New Leads. |
| Bookings | Requests from the reserve form: *Awaiting confirmation*, *Confirmed*, *Incomplete* (left part-way, with contact details), *Declined & cancelled*. Each booking can be confirmed (with a date and time), declined, cancelled, reopened, noted or added to the CRM. The **Analytics** tab shows where visitors drop out of the form. |
| Calendar | Confirmed bookings only, by month. Requests appear once they are confirmed. |

## How the booking form is saved and measured

- Each visit to `/reserve` gets a session id (kept for the browser tab). Field values are saved within about a second while the visitor types, and again when they leave a field; anything still queued is sent when the page is closed.
- A booking row appears on the first interaction as *Incomplete*. Sending it makes it *Awaiting confirmation*; after that the visitor can no longer change it.
- Interaction events (form opened, field entered, field left filled or emptied, field that blocked a send) feed the analytics. A visit counts as **abandoned** after 30 minutes without activity; the **dropout rate** is abandoned ÷ started, and **left here** is the last field an abandoned visitor touched.
- The form tells visitors their details save as they type. Mention it in the privacy policy too.

## Security model

- The public site never reads or writes tables directly. The anonymous key can only call `submit_inquiry`, `track_booking` and `submit_booking`, which validate and cap every value in the database.
- All admin data sits behind Row Level Security and the `admin_users` allowlist. Admin pages and server actions check the signed-in user again on every request.

## Changing the booking form

The field list lives in three places that must stay in step: `src/components/ReserveForm.tsx`, `src/lib/booking-fields.ts` (order drives the analytics funnel) and the database — add a new migration that updates the `bookings` columns, `private.booking_form_fields()`, `track_booking` and `submit_booking`. Update `src/lib/supabase/database.types.ts` to match (or regenerate it with `supabase gen types typescript`).
