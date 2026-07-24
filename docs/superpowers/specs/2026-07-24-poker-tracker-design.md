# Poker Tracker — Design Spec
**Date:** 2026-07-24

## Overview

A hosted web app with two independent features:
1. **Stat Tracker** — personal lifetime cash game stats with graphs (localStorage, browser-only)
2. **Buy-In Ledger** — global shared tool for tracking player buy-ins at a table, with settle-up (Supabase + shareable links)

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Database:** Supabase (Postgres) — ledger only
- **Hosting:** Vercel

---

## Feature 1: Stat Tracker

### Data Model (localStorage)

```ts
type Session = {
  id: string           // uuid
  date: string         // ISO date
  location: string
  stakes: string       // e.g. "1/2 NL"
  hours: number
  buyIn: number        // total spent
  cashOut: number      // total cashed out
  selfRating: 1|2|3|4|5
  notes: string
  // derived:
  net: number          // cashOut - buyIn
  hourlyRate: number   // net / hours
}
```

### Views

**Dashboard**
- Stats row: All-time profit · Total hours · Hourly rate · Win rate (% sessions profitable)
- Cumulative profit line chart (time series)
- Profit by location bar chart
- Profit by stakes bar chart

**Session Log**
- Scrollable table: date, location, stakes, hours, buy-in, cash-out, net, rating
- Sortable columns, filter by location/stakes

**Add Session form**
- Fields: date, stakes, location, hours, buy-in, cash-out, self-rating (star picker), notes
- Auto-calculates net and hourly rate on submit

---

## Feature 2: Buy-In Ledger

### Modes

On the `/ledger` landing page, user picks:
- **Solo Session** — single player, tracks own buy-ins/rebuys
- **Table Session** — banker mode, tracks all players

### Data Model (Supabase)

```sql
sessions (
  id          uuid primary key,
  mode        text,           -- 'solo' | 'table'
  created_at  timestamptz,
  ended_at    timestamptz
)

players (
  id          uuid primary key,
  session_id  uuid references sessions,
  name        text
)

transactions (
  id          uuid primary key,
  player_id   uuid references players,
  session_id  uuid references sessions,
  amount      numeric,
  type        text,           -- 'buyin' | 'rebuy' | 'cashout'
  created_at  timestamptz
)
```

### Solo Mode

- One player (you), running total of buy-ins
- "Rebuy" button adds another buy-in increment
- "End Session" prompts for cash-out amount, shows net P&L

### Table Mode (Banker)

- Add players by name
- Each player row shows: name · total bought in · running total
- "Buy In / Rebuy" button per player — enter amount, tap confirm
- "End Session" → prompt for each player's cash-out amount

### Settle-Up Screen

After all cash-outs entered:
- Computes net position per player (cashOut − totalBuyIn)
- Runs minimum-transfer algorithm to determine who pays who with fewest transactions
- Displays list of transfers: "Alice pays Bob $45"
- Shareable link for the session summary (`/ledger/[id]`)

### Shareable Session Link

- Each table session gets a UUID-based URL: `/ledger/[id]`
- Anyone with the link can view the session summary (read-only)
- Session is active until "End Session" is tapped

---

## Settle-Up Algorithm

```
1. Compute net[player] = cashOut - totalBuyIn for each player
2. Separate into creditors (net > 0) and debtors (net < 0)
3. Greedily match largest debtor to largest creditor
4. Record transfer, reduce both balances, repeat until settled
```

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing — links to Tracker and Ledger |
| `/tracker` | Stat tracker dashboard |
| `/tracker/add` | Add session form |
| `/ledger` | Mode picker (Solo / Table) |
| `/ledger/[id]` | Active or completed session view |

---

## Commit Plan (4–5 commits)

1. **Init:** Next.js + Tailwind scaffold, routes, landing page
2. **Stat Tracker:** session form, localStorage store, session log table
3. **Stat Tracker charts:** dashboard stats + Recharts graphs
4. **Ledger core:** Supabase schema, solo + table session flow, buy-in/rebuy UI
5. **Ledger settle-up:** cash-out entry, minimum-transfer algorithm, shareable summary page
