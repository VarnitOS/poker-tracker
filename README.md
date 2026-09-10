# PERSONAL Poker Tracker

Two tools in one Next.js app:

- **Stat Tracker** — log personal cash game sessions, track lifetime profit, hourly rate, and win rate with charts. Runs entirely in the browser (localStorage, no backend).
- **Buy-In Ledger** — track buy-ins at the table with settle-up at the end. Supabase-backed with shareable session links.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts
- Supabase (Postgres) — ledger only
- Vercel

## Dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/tracker` | Session dashboard + charts |
| `/tracker/add` | Add a session |
| `/ledger` | Mode picker (Solo / Table) |
| `/ledger/[id]` | Active or completed session + settle-up |

## Environment Variables

Create a `.env.local` for local development (required for the ledger):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
