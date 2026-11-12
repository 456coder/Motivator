# Motivator — Project Spec

## What this is
An iPhone app that keeps you hitting your marks. You set **goals** (with milestones and deadlines) and **daily habits**. Every day the app works out where you *should* be by now, compares it with where you *are*, and pushes you hard when you slip. It reads your calendar to find free time and decides how much time each goal needs. Everything runs on the phone; no AI and no account in version 1.

App name: **Motivator** (bundle ID `com.simranuppal.motivator`).

## How to work with me
- I'm new to coding. Explain any terminal commands in plain English before running them.
- Build ONE phase at a time (see Build order). At the end of each phase, stop, tell me how to test it on my iPhone with Expo Go, and wait for my confirmation before moving on.
- Commit to Git after each working phase with a clear message.
- Keep code simple and readable. Prefer well-maintained Expo packages over custom native code. Must run in **Expo Go** throughout.
- If something in this spec is unclear or conflicts, ask me rather than guessing.
- Keep this file updated when we make new decisions.

## Tech stack
- Expo SDK 58, TypeScript, Expo Router (React Native 0.88). See `AGENTS.md`: add packages with `npx expo install`; run `npm run typecheck` and `npm run lint` before finishing a task.
- State: Zustand, saved on the phone with AsyncStorage.
- expo-notifications (reminders), expo-calendar (read events, add time blocks), expo-haptics, react-native-reanimated (animations), react-native-svg (icons, charts), a chart library that works in Expo Go (e.g. react-native-gifted-charts) or plain Views.
- Font: **Plus Jakarta Sans** (@expo-google-fonts/plus-jakarta-sans).

## Design: soft header + card shelves
Clean and calm with muted, dusty colours (12 Nov 2026: the loud "bubble pop" look was dropped as tacky; the layout follows a format the user liked from a wellbeing app, without copying its look).
- **Layout of each main screen:** a coloured header block across the top (behind the status bar, rounded bottom corners, centred white title + subtitle, see-through round buttons) — `HeaderBlock`. Below it, **shelves**: a section title with a coral "See all" link, then a sideways-scrolling row of tall coloured cards with white text — `Shelf` + `Tile`. Plain white `Card`s for details.
- Warm off-white background (`colors.bg`), white cards with soft blurred shadows (`softShadow`), no thick outlines.
- Muted area colours (`areas` in the theme, each with a soft tint and a darker text shade): Today = periwinkle header (`colors.brand`), Goals = dusty rose, Habits = sage teal, Calendar = soft sky, Review = periwinkle. Coral (`colors.link`) for "See all" links.
- Font: **Plus Jakarta Sans** everywhere (ExtraBold titles and big numbers, Bold buttons and card titles, SemiBold labels, Medium body).
- Buttons are rounded (radius 16) and shrink slightly when pressed, with a haptic.
- **Status colours are always the same:** Ahead = green, On track = blue, Behind = orange, Off track = red. On the Goals tab, goal tiles take their status colour.
- Progress bars are slim; a dark tick marks where you should be by today. On tiles, progress is a thin white bar.
- Icons are thin outlined SVGs in `Icon.tsx`. No emoji in the UI (notification text may use them).
- All colours, fonts, radii and shadows live in `src/theme.ts`. Never hard-code a new colour.
- Light mode only.

## How it keeps you on track ("aggressive")
- **On-track status** for each goal, worked out daily: Ahead / On track / Behind / Off track, plus the pace you now need ("4 pages a day now, was 3") and the days left.
- **Catch-up plan:** when you're behind, the shortfall is spread over the remaining days and booked into free calendar time.
- **Reminders: 2 a day by default — morning (today's plan) and evening (what's still not done).** Wording gets firmer the further behind you are. More can be turned on in Settings later.
- **No quiet backing out:** moving a deadline or lowering a target needs a written reason, kept in the goal's change history.
- **Daily score:** % of today's habits and goal tasks done. The streak only counts days at 100% (threshold adjustable in Settings).
- **Check-ins:** weekly, monthly and yearly (see Check-ins). The weekly one opens by itself on Sunday evening before anything else.

## Calendar and time planning (rules, no AI)
- Read the iPhone calendar (expo-calendar). Free time each day = waking hours (set in Settings) − events − a short buffer around each event.
- Each goal's time need = remaining amount ÷ days (or weeks) left, converted into minutes using the goal's "minutes per unit" (or a weekly hours target).
- Split the time between goals by urgency (how far behind × how close the deadline). Busy days get less work, quiet days more.
- Suggest blocks in free gaps ("Spanish · 45 min, 6:30pm"); the user can add them to their calendar.
- Missed blocks move to the next free days; getting ahead shrinks the load.
- Learn when you usually complete things (e.g. evenings) and book those times first.
- **AI later (not now):** understanding what events mean, turning vague goals into plans, and smarter weekly reviews. It would be built into those three places, not a separate "coach" screen.

## The goal ladder (decided 12 Nov 2026)
Big goals are broken down into levels. Each goal can "support" one goal on a higher level, and any level can be skipped.
| Level | Example | Tracked by |
|---|---|---|
| 5-year vision | Own my own flat | progress of the goals under it |
| 3-year goal | Save a £30k deposit | a number target, or the goals under it |
| 1-year goal | Save £10,000 this year | a number target: expected vs. actual, Ahead/Behind |
| 90-day milestone | £2,500 by end of March | a number target or done/not done, with a deadline |
| This week's focus | Cancel 2 subscriptions | ticked off (shows on Today) |
| Daily habits | Log spending | Phase 2 habits; a habit can support a goal |
- Goal kinds: **number** (start → target in a unit, e.g. £ or km; progress logged with notes), **done / not done**, or **by the goals under it** (progress = average of its child goals).
- Status from time elapsed vs. progress made: within ±5% = On track, ahead by more = Ahead, up to 20% behind = Behind, worse (or past the deadline) = Off track.
- Pace: "You need £29 a week now (planned £25)": remaining ÷ time left, per day (≤ 31 days left), per week (≤ 6 months) or per month.
- "Build your plan": a guided flow from the 5-year vision down to this week's focus and a first habit, each step skippable, each new goal linked to the one before.
- **Plan view** (`/plan`): the whole tree on one screen.

## Check-ins (decided 12 Nov 2026)
| Check-in | Default | Purpose |
|---|---|---|
| Daily | morning + evening reminders | plan the day; evening nudge |
| Weekly | Sunday evening, ~5 min | hit / missed, choose next week's focus |
| Monthly | 1st of the month, ~10 min | each 1-year goal vs. where it should be, adjust; every 3rd month also sets the next 90-day milestones (no separate quarterly) |
| Yearly | 1 January (changeable), ~20–30 min | score the year, update 3- and 5-year goals, set new 1-year goals |

## Reminders: the user chooses
Each can be switched on/off with its own time in Settings: morning plan and evening nudge (on by default), a time per habit, weekly / monthly / yearly check-ins, deadline warnings (milestone due in 7 days and tomorrow), "falling behind" alerts.

## Other features (v1)
- **Charts:** actual vs. expected line for each goal, habit heatmaps, weekly scores.
- **Calendar:** today's agenda with events and suggested blocks; a month view of hit/missed days.

## Screens
- Tabs: **Today**, **Goals**, **Habits**, **Calendar** (custom white tab bar; the active tab's icon sits in a soft pill of its area colour). Today: greeting header with score / streak / habits-done stats, then shelves for today's habits, goals to push and your time today.
- Other screens: Goal detail (`/goal/[id]`), New / edit goal (`/goal/new`), Plan tree (`/plan`), New / edit habit (`/habit/new`), Habit (`/habit/[id]`), Check-ins (`/review`), Settings (`/settings`, opened from the gear on Today), Components gallery (`/components`).

## Folders
Screens in `src/app/`, components in `src/components/` (PascalCase), rules in `src/logic/` (pure functions), saved data + actions in `src/store/`, helpers in `src/utils/`, numbers and switches in `src/config.ts`.

## Data (on the phone)
- **Habit:** id, name, colour, days, targetAmount, unit, reminderTime, archived, createdAt
- **HabitLog:** habitId, date, amount
- **Goal:** id, title, colour, unit, startValue, targetValue, startDate, deadline, minutesPerUnit or weeklyHours, milestones [{id, title, date, target, doneAt}], archived
- **GoalLog:** id, goalId, date, value, note
- **ChangeLog:** goalId, field, from, to, reason, at
- **Review:** weekStart, answers, score
- **Settings:** remindersPerDay (2), morningTime, eveningTime, wakeTime, sleepTime, streakThreshold (100%), calendarIds to read/write

## Build order (one phase at a time, iPhone test after each)
1. Project setup, theme, fonts, shared components, navigation + tab bar, placeholder screens ✅
2. Habits: create, tick off, streaks, Today screen ✅
3. The goal ladder: 5-year / 3-year / 1-year goals, 90-day milestones, this week's focus, linking goals and habits, logging progress, status + pace, Plan view, "Build your plan"
4. Change history ("no quiet backing out") + goal detail polish
5. Charts + history
6. Reminders with on/off choices + daily score
7. Calendar: read events, free time, time allocation, add blocks
8. Weekly, monthly and yearly check-ins
9. Polish, then App Store prep

## Decisions log
- **12 Nov 2026:** Name Motivator. First tried a loud "bubble pop" look with bubble writing; the user found it tacky, then a clean version; then the user asked for a layout like a wellbeing app they liked (coloured header + shelves of coloured cards with "See all"), built in our own muted colours. Reminders twice a day (morning + evening) by default. No AI in version 1; the calendar planning is rule-based. AI may be added later inside goal creation, calendar reading and the weekly review.
- **Phase 2, habits (built 12 Nov 2026):** Habits have a name, colour, days of the week, "Tick once" or "Count up to" a target with a unit (e.g. 8 glasses), and a time of day (Morning / Afternoon / Evening / Anytime). Rules in `src/logic/habits.ts`, saved data in `src/store/useStore.ts` (Zustand + AsyncStorage, key `motivator-data`, version 1). Logs are `logs[day][habitId] = amount`.
  - **Today:** header stats (today's score, day streak, habits done), a firm nudge banner (before 6 pm "N habits to go today"; from 6 pm "Finish them or lose your N day streak"), then "To do" and "Done" shelves. Tap a card to tick it off (tap again to undo; counted habits add 1 per tap and are undone on the habit's page); hold to open it. "Full day!" banner + success buzz when everything's done.
  - **Score:** share of today's due habits done; counted habits give part marks. **Day streak:** full days in a row (score ≥ `settings.streakThreshold`, default 100%); days with nothing due are skipped; an unfinished today doesn't break it yet.
  - **Habit page** (`/habit/[id]`): today (tick or − / +), streak / best / last-30-days %, a 5-week grid (done / missed / not due, today outlined), Edit (`/habit/new?id=…`), Archive (stops counting, keeps history) and Delete (asks first; removes history).
  - **Habits tab:** shelves by time of day, plus Archived. Reminder times come in phase 6.
  - Rule checks: `npx tsx scripts/test-habits.ts`.
- **Goal ladder + check-ins (12 Nov 2026):** user asked for 5-year / 3-year / 1-year goals broken down to daily habits, with reminders they can choose, and weekly / monthly / yearly check-ins. Added a 90-day milestone level (a year is too far away to feel urgent) and "this week's focus". Quarterly is folded into every third monthly check-in. Defaults: weekly check-in Sunday evening, yearly on 1 January (both changeable later).
- **Phase 3, the goal ladder (built 12 Nov 2026):** rules in `src/logic/goals.ts` (levels, progress, status, pace, roll-up), saved as `goals` + `goalLogs` (store version 2; version 1 saves are upgraded with empty goals).
  - A goal has a level, an optional parent ("Supports"), a kind (A number / Done or not / By its steps), unit, start, target, current value, start date and deadline. Deadlines default by level (5 y, 3 y, 1 y, 90 days, this Sunday). Number goals are done automatically when the target is reached (works for goals that go down, e.g. weight).
  - **Goals tab:** one shelf per level, cards coloured by status (Ahead / On track / Behind / Off track / Done / No steps yet in `goalLooks`), "See the whole plan", Archived.
  - **Build your plan** (`/goal/new?level=five&flow=1`): steps 1–5 are the goal levels, each linked to the one before; step 6 adds a daily habit linked to the goal above this week's focus (the focus only lasts a week); every step can be skipped; ends on the Plan view.
  - **Goal page:** status, current value vs. where it should be by today (black tick on the bar), pace box ("You need £907 a month now (planned £834)"), Log progress (Add to it / New total + note), Mark as done, the goal it supports, steps under it (+ add one), habits for it (+ new habit for it), history (entries can be removed), Archive, Delete (children and habits move up to its parent).
  - **Plan view** (`/plan`): the tree from the 5-year vision down to habits, plus habits not linked to a goal.
  - **Today:** "This week's focus" shelf (tap to tick off) or a prompt to set one, and "Goals that need a push" (Behind / Off track, not week-level).
  - Habits can support a goal (picker on the habit form; shown on the habit page). Tile ticks moved to the bottom-right corner so long titles never push them off the card.
  - Rule checks: `npx tsx scripts/test-goals.ts`. Dates use `@react-native-community/datetimepicker` (compact picker on iPhone).
