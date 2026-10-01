# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Entre Nosotros" (formerly "Britney - Game Score Tracker") is a Spanish-language React web app with score trackers ("anotadores") for card and board games: **Britney**, **Truco argentino**, and an in-progress online multiplayer **Mafia** game backed by Supabase. All UI text, routes (`/truco/reglas`, `/mafia/crear-sala`), commit messages, and code comments are in Spanish; keep new user-facing text in Spanish.

## Commands

Create React App (`react-scripts` 5). Run everything from this directory. `node_modules` may not be installed, so run `npm install` first.

- `npm start`: dev server at http://localhost:3000
- `npm run build`: production build into `build/`
- `npm test`: Jest in watch mode. For a single run of one file: `CI=true npm test -- src/path/to/file.test.js`. Filter by name with `-t "name"`.
- Linting is CRA's built-in ESLint (`react-app` config), which reports during `start`/`build`. There is no separate lint script.
- Deployment: `vercel.json` rewrites every path to `index.html` for SPA routing. A `gh-pages` deploy script also exists (`npm run deploy`).

`src/App.test.js` is still the default CRA test, which looks for "learn react", so it fails. There is no real test suite.

## TypeScript setup quirks

- The code mixes `.js`/`.jsx` and `.ts`/`.tsx`, but there is **no `tsconfig.json`**, and `typescript` is not a dependency. Babel strips the TS during the build, so nothing type-checks it. Type errors will not fail the build.
- Imports use explicit extensions (`import X from "./foo.tsx"`, `"../lib/supabaseClient.ts"`). Follow that convention, though a few files (for example `src/utils/loadRoomData.ts`) omit them.

## Architecture

**Routing** is defined in `src/App.js`. Every route renders inside `components/Layout/Layout.tsx`, which holds the navbar, drawer, footer, and toaster. Each game has its own folder under `src/components/<Game>/`, with `pages/` holding the landing page, the rules page (`Rules*Page`), and the score tracker (`Anotattor*Page`, a misspelling of "annotator" that is used consistently), plus supporting components.

**State lives in Zustand stores** (`src/stores/`), not in React context:
- `useGameBritneyStore` and `useGameTrucoStore` hold all game logic (players, rounds, dealer rotation, disqualification, scoring) and persist to `localStorage` through Zustand `persist`, under the keys `game-session-storage` and `truco-config`. Components are mostly thin views over these stores.
- Stores trigger toasts outside React through `useUiNotificationStore.getState().addNotification(msg, type)` (see the `notify` helper in `useGameBritneyStore`). `components/Toaster.tsx` renders the toasts.
- Zod schemas for player names and scores live in `src/validation/validation.ts`, and stores call them before mutating state.
- `useUserStore` (Supabase auth user), `usePlayerStore` (the matching `players` row), and `useRoomStore` (current Mafia room, room players, actions) back the online features.

**Supabase** (`src/lib/supabaseClient.ts`) reads `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` from `.env`. It is used for:
- Auth. `AuthButton.tsx` handles Google OAuth login and stores the return path in `localStorage.redirectAfterLogin`, and `pages/handleLoginPage.tsx` is the redirect target that consumes it.
- Tables: `players`, `rooms`, `room_players`, `actions`, `games`, and the storage bucket `avatars`. Data access lives in `src/services/*Services.ts`. `ensurePlayerCreated()` in `userServices.ts` lazily creates the `players` row for the logged-in user and is called before any room operation.
- Realtime. `src/realtime/*Channel.ts` subscribe to `postgres_changes` filtered by room and push updates straight into `useRoomStore` via `getState()`. `actionsChannel.ts` de-duplicates subscriptions in a module-level map, so pair each subscribe with its unsubscribe helper.

**Unfinished Mafia code.** Mafia is still in progress, and some code is dead or broken. `hooks/useMafiaSync.ts` imports a nonexistent `stores/useGameMafiaStore.ts`. `UserProvider` and `PlayerProvider` are imported in `App.js` but never mounted. Check whether code is actually wired up before relying on it.

**Styling** uses Tailwind CSS with DaisyUI components. `ThemeSelector.tsx` switches DaisyUI themes (default `lofi`, saved in `localStorage.theme`), and the available themes are listed in `tailwind.config.js`. Use DaisyUI classes and theme colors (`btn`, `bg-base-200`, `text-primary`) rather than hard-coded colors. Animations use `framer-motion`, with shared variants in `src/lib/Animations.ts`. The suggestions form sends email through `emailjs-com`.
