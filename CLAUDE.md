# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Pre-scaffold — design spec exists at `docs/superpowers/specs/2026-07-24-poker-tracker-design.md`. No code has been written yet.

## Stack

- **Next.js 14** (App Router) — framework
- **Tailwind CSS** — styling
- **Recharts** — charts in the Stat Tracker
- **Supabase (Postgres)** — database for the Buy-In Ledger only; Stat Tracker uses localStorage
- **Vercel** — hosting

## Development Commands (once scaffolded)

```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # ESLint
```

## Architecture

Two fully independent features share a single Next.js app:

### Feature 1: Stat Tracker (`/tracker`)
- **Entirely browser-side** — no backend, no auth. All data lives in `localStorage`.
- Data model: `Session` type with `id`, `date`, `location`, `stakes`, `hours`, `buyIn`, `cashOut`, `selfRating`, `notes`; derived fields `net` and `hourlyRate` are computed on write.
- Routes: `/tracker` (dashboard + charts), `/tracker/add` (session form).

### Feature 2: Buy-In Ledger (`/ledger`)
- **Supabase-backed** with three tables: `sessions`, `players`, `transactions`.
- Two modes selected on the landing page: **Solo** (one player, track rebuys) and **Table** (banker mode, multiple players).
- Every table session gets a UUID-based shareable URL at `/ledger/[id]` — read-only for anyone with the link.
- Settle-up uses a greedy minimum-transfer algorithm: separate players into creditors/debtors by net position, match largest debtor to largest creditor, repeat.

### Routes

| Route | Purpose |
|---|---|
| `/` | Landing — links to Tracker and Ledger |
| `/tracker` | Dashboard: stats row + Recharts graphs (cumulative profit, by location, by stakes) |
| `/tracker/add` | Add session form |
| `/ledger` | Mode picker (Solo / Table) |
| `/ledger/[id]` | Active or completed session view + settle-up screen |

## Supabase Schema

```sql
sessions   (id uuid pk, mode text, created_at timestamptz, ended_at timestamptz)
players    (id uuid pk, session_id uuid → sessions, name text)
transactions (id uuid pk, player_id uuid → players, session_id uuid → sessions,
              amount numeric, type text, created_at timestamptz)
-- type values: 'buyin' | 'rebuy' | 'cashout'
```
