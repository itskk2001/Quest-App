# Quest — Gamified Task Planner (MVP Scaffold)

This is a starter scaffold implementing the MVP game loop: manual tasks,
rule-based difficulty scoring, XP, leveling, streaks, and a dashboard.
Document/YouTube AI analysis (Phase 2 of the product) is not included yet —
see `src/lib/difficultyScorer.js` for where AI scoring would plug in later.

## Setup

1. **Create a Supabase project** at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` to create all tables, RLS
   policies, and the auto-create-user-on-signup trigger.
3. In Supabase Auth settings, enable the Google OAuth provider and add your
   Google OAuth credentials.
4. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL
   and anon key (found in Project Settings → API).
5. Install dependencies:
   ```
   npm install
   ```
6. Run the dev server:
   ```
   npm run dev
   ```
7. Visit `http://localhost:3000/dashboard`.

## What's implemented

- `src/lib/xpEngine.js` — XP, leveling, streak, and reward-point math (pure functions, unit-testable)
- `src/lib/difficultyScorer.js` — rule-based difficulty scoring for manual tasks
- `src/app/api/tasks/route.js` — create/list tasks
- `src/app/api/tasks/[id]/complete/route.js` — the core game loop: completing a task awards XP, checks for level-up, updates streak, unlocks achievements
- `src/app/dashboard/page.jsx` — XP bar, quest list, level-up modal, achievement popup
- `supabase/schema.sql` — full MVP database schema with row-level security

## Not yet built (next steps)

- Sign-in page / auth flow UI (Supabase Auth UI or custom Google button)
- Add-task page/modal (form that POSTs to `/api/tasks`)
- Rewards page (claim reward_points against reward templates)
- Document upload + AI analysis (`aiAnalysis.js`, `docParser.js` from the plan)
- YouTube link analysis (`youtubeParser.js`)
- Focus/study timer
- Analytics/charts page

## Design notes

- Difficulty scoring is deliberately rule-based for MVP — no AI cost, no
  latency, and it's good enough to validate the game loop. Swap in Claude
  API scoring once the core loop is proven fun.
- XP and reward_points are separate currencies on purpose — XP drives
  leveling, reward_points are spent on real-world rewards. This stops users
  from grinding trivial tasks purely to level up faster.
