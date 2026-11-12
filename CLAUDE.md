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
- Fonts: **Baloo 2** (bubble writing: titles, numbers, buttons, labels) and **Nunito** (body text).

## Design: "bubble pop"
Really colourful and inviting.
- Bright purple background (`colors.bg`), cream cards, a different candy colour for each area: Today = yellow, Goals = pink, Habits = mint, Calendar = sky blue.
- **Bubble writing:** big titles use `BubbleText` (Baloo 2 ExtraBold, coloured fill with a thick dark outline and a drop shadow).
- Everything has a thick dark outline (3px `colors.ink`) and a hard offset shadow with no blur (`popShadow()`), so it looks like stickers or bubbles.
- Chunky rounded buttons that squish down when pressed, with a haptic.
- **Status colours are always the same:** Ahead = mint, On track = sky, Behind = orange, Off track = pink-red.
- Icons are simple outlined SVGs in `Icon.tsx`. No emoji in the UI (notification text may use them).
- All colours, fonts, radii and shadows live in `src/theme.ts`. Never hard-code a new colour.
- Light mode only.

## How it keeps you on track ("aggressive")
- **On-track status** for each goal, worked out daily: Ahead / On track / Behind / Off track, plus the pace you now need ("4 pages a day now, was 3") and the days left.
- **Catch-up plan:** when you're behind, the shortfall is spread over the remaining days and booked into free calendar time.
- **Reminders: 2 a day by default — morning (today's plan) and evening (what's still not done).** Wording gets firmer the further behind you are. More can be turned on in Settings later.
- **No quiet backing out:** moving a deadline or lowering a target needs a written reason, kept in the goal's change history.
- **Daily score:** % of today's habits and goal tasks done. The streak only counts days at 100% (threshold adjustable in Settings).
- **Weekly review:** Sunday evening the app opens on a review of the week (what you hit, what you missed, what changes) before anything else.

## Calendar and time planning (rules, no AI)
- Read the iPhone calendar (expo-calendar). Free time each day = waking hours (set in Settings) − events − a short buffer around each event.
- Each goal's time need = remaining amount ÷ days (or weeks) left, converted into minutes using the goal's "minutes per unit" (or a weekly hours target).
- Split the time between goals by urgency (how far behind × how close the deadline). Busy days get less work, quiet days more.
- Suggest blocks in free gaps ("Spanish · 45 min, 6:30pm"); the user can add them to their calendar.
- Missed blocks move to the next free days; getting ahead shrinks the load.
- Learn when you usually complete things (e.g. evenings) and book those times first.
- **AI later (not now):** understanding what events mean, turning vague goals into plans, and smarter weekly reviews. It would be built into those three places, not a separate "coach" screen.

## Features (v1)
1. **Habits:** name, colour, which days, target (yes/no, or an amount such as 8 glasses), reminder time, streak.
2. **Goals + milestones:** a target (a number such as £5,000 saved, or done/not done), start date, deadline, milestones (title, date, target). Log progress entries (date, amount, note).
3. **On-track tracker:** expected value today against your actual value, with the status, the pace you need and the days left.
4. **Charts:** actual against expected line for each goal, habit heatmaps, weekly scores.
5. **Calendar:** today's agenda with events and suggested blocks; a month view of hit/missed days.

## Screens
- Tabs: **Today**, **Goals**, **Habits**, **Calendar** (custom bubble tab bar; the active tab is filled with its colour).
- Other screens: Goal detail (`/goal/[id]`), New goal (`/goal/new`), New habit (`/habit/new`), Weekly review (`/review`), Settings (`/settings`, opened from the gear on Today), Components gallery (`/components`, for testing the shared components).

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
1. Project setup, theme, fonts, shared components, navigation + tab bar, placeholder screens
2. Habits: create, tick off, streaks, Today screen
3. Goals + milestones + progress logging
4. On-track maths + status + catch-up pace
5. Charts + history
6. Reminders (morning + evening) + daily score
7. Calendar: read events, free time, time allocation, add blocks
8. Weekly review + change history
9. Polish, then App Store prep

## Decisions log
- **12 Nov 2026:** Name Motivator. Really colourful "bubble pop" look with bubble writing. Reminders twice a day (morning + evening) by default. No AI in version 1; the calendar planning is rule-based. AI may be added later inside goal creation, calendar reading and the weekly review.
