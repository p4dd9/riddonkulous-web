# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Riddonkulous is a riddle platform built with **Next.js 16** (React 19, TypeScript 5). The frontend talks to an external backend API called **Reddicore** (`REDDICORE_API_BASE_URL`). There is no local database.

## Commands

- **Dev server**: `npm run dev` (runs on port 1233 with experimental HTTPS)
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint` (ESLint with next/core-web-vitals)
- **Format**: `npm run format` (Prettier)

## Architecture

### Route Groups
- `app/(public)/` — Public pages with shared Header/Footer layout
- `app/(private)/admin/` — Protected admin pages
- `app/api/` — Next.js API routes (auth, riddles, tags, moderation, user)

### Key Routes
- `/` — Home (daily riddle, adventure, trending, featured)
- `/riddle/[postId]` — Individual riddle
- `/riddle/daily/[number]` — Daily riddle solver
- `/riddle/adventure/[number]` — Adventure mode
- `/riddles/[category]` — Category browsing

### Data Flow
- **Services** (`app/services/`) are server actions (`'use server'`) that call the Reddicore API
- All services use `getApiBaseUrl()` and `getApiKey()` from `app/util/apiConfig.ts`
- Use `fetcher<T>()` from `app/services/fetcher.ts` for type-safe requests with Zod validation
- **Auth**: Google OAuth → Next.js API proxy → backend session cookies
- **Auth context**: `app/contexts/AuthContext.tsx` provides `user`, `signIn`, `signOut`, `refreshUser`

### Schemas
Zod schemas live in `app/schemas/` for response validation.

### Native app bridge (Capacitor WebView)

This site is also loaded inside a Capacitor shell (`riddonkulous-mobile`) as a remote WebView. The native layer talks to the site **one-directionally** via `window` CustomEvents — there is no `Capacitor.Plugins.*` exposed to the page, and you should not add a postMessage RPC. Two events exist:

- **`riddonkulous:backButton`** — dispatched (cancelable) when the user presses the Android hardware/gesture back button, *before* native navigates WebView history or exits. Any open dismissible layer should close itself and call `preventDefault()` so native does nothing; if nothing calls `preventDefault()`, native falls back to WebView history (`goBack()`, i.e. client-side route back) and then to minimise/exit. This is wired centrally: `app/lib/useBackDismiss.ts` keeps a LIFO stack of dismiss handlers and is consumed by the two overlay primitives — **`BottomSheetModal`** and **`Drawer`**. Every modal renders inside `BottomSheetModal`, so adding back-to-dismiss to a new modal is automatic; only a brand-new overlay primitive (its own portal/full-screen layer) needs to call `useBackDismiss(onClose, isOpen)` itself. The event never fires in a plain browser, so the hook is inert on web.
- **`riddonkulous:networkChange`** — dispatched on connectivity changes with `detail: { connected: boolean, type: string }`. Currently **not consumed** by the site; listen for it if you want an offline banner.

The native app is **guest-only**: it appends a `RiddonkulousApp` token to its User-Agent, and `app/lib/nativeApp.ts` detects it server-side. The `(public)` layout then skips the session lookup and hides all login/create UI (`AuthProvider`'s `isNativeApp` flag, read via `useAuth()`), and `proxy.ts` redirects auth-gated routes (`/user/me`, `/subscribe`, `/unsubscribe`) to `/`. Login and create exist only on the regular web. Don't rename the UA token without coordinating with `riddonkulous-mobile`'s `capacitor.config.ts` (`appendUserAgent`).

## Styling Rules

- **Tailwind CSS v4** with custom theme defined in `app/globals.css`
- Always use the custom theme variables (`--color-primary`, `--color-bg`, etc.) — avoid default Tailwind color classes
- **Never use `font-semibold`, `font-bold`**, or any bold weight — the project font (Jersey25) does not support them
- **Never use `<strong>` tags**
- Reference existing component patterns in `app/components/` for styling conventions

## Coding Conventions

- Prefer arrow functions
- Path alias: `@/*` maps to project root
- Prettier: tabs (width 4), single quotes, 120 char line width, trailing commas (es5)
- `'use server'` directive on all service files; `'use client'` only for interactive components

## Environment Variables

See `.env.example` for required variables. Key ones: `REDDICORE_API_BASE_URL`, `REDDICORE_API_KEY`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, admin auth secrets.

## Deployment

Dockerized (Node 24.11.0), deployed behind Traefik reverse proxy on port 1233.
