# African Nations League — Client (Auth-First MVP)

A lightweight React + TypeScript Vite app for managing an 8-team knockout tournament (quarter → semi → final) with role-based access (visitor, federation, admin) and OTP-first authentication.

---

## Table of Contents

- [Overview](#overview)
- [Quick Links](#quick-links)
- [Features](#features)
- [Getting Started (Local Dev)](#getting-started-local-dev)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Architecture & Patterns](#architecture--patterns)
- [API Expectations (Client-Side)](#api-expectations-client-side)
- [UX & Styling](#ux--styling)
- [Troubleshooting & Tips](#troubleshooting--tips)
- [Seeding & Demo Accounts](#seeding--demo-accounts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This client is an "auth-first" React + TypeScript Vite app that relies on a backend API for authentication and tournament state. It uses `mern-access-client` for OTP-based auth flows and supports role-based UI/route protection for three roles: visitor, federation representative, and admin.

---

## Quick Links (open these files in your editor)

- Entry: `src/main.tsx`  
- Router & layout: `src/App.tsx`  
- Auth config: `src/mern-access.config.ts`  
- Theme provider: `src/hooks/useTheme.tsx`  
- Admin hook/provider: `src/hooks/useAdmin.tsx`  
- Federation hook/provider: `src/hooks/useFederation.tsx`  
- Protected route: `src/components/auth/ProtectedRoute.tsx`  
- Role gating: `src/components/auth/RoleRestricted.tsx`  
- Header: `src/components/layout/Header.tsx`  
- Auth forms: `src/components/auth/LoginForm.tsx`, `src/components/auth/SignupForm.tsx`, `src/components/auth/VerifyForm.tsx`  
- Pages:
  - `src/pages/HomePage.tsx`
  - `src/pages/BracketPage.tsx`
  - `src/pages/TopScorersPage.tsx`
  - `src/pages/LoginPage.tsx`
  - Federation: `src/pages/federation/FederationDashboard.tsx`, `src/pages/federation/TeamRegistration.tsx`
  - Admin: `src/pages/admin/AdminDashboard.tsx`, `src/pages/admin/MatchManagement.tsx`  
- Types: `src/types/auth.ts`, `src/types/database.ts`  
- Utils: `src/utils/timeFormat.ts`  
- Dev config: `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `.env`, `package.json`  
- Setup / seed guide: `SETUP.md`

---

## Features

- OTP-based authentication and verification
- Role-based UI and route protection (visitor, federation, admin)
- Federation flows: register/manage 23-player squads
- Admin controls: start/reset tournament, simulate matches
- Bracket visualization and top scorers leaderboard
- Brutalist UI with Tailwind CSS and custom tokens

---

## Getting Started (Local Dev)

1. Install dependencies
```sh
npm install

2. Configure backend URL
Edit .env:
VITE_AUTHAPI_URL=http://localhost:4001
Client expects backend endpoints under ${VITE_AUTHAPI_URL}.

3. Run dev server
npm run dev

Scripts
npm run dev — start Vite dev server
npm run build — build production bundle
npm run preview — preview production build
npm run lint — lint codebase
npm run typecheck — run TypeScript checks
(Check package.json for exact script definitions)

Environment Variables
VITE_AUTHAPI_URL — base URL for API (example: http://localhost:4001)
Do not commit secrets to version control for production.

Architecture & Patterns
Providers: MernAccessProvider (auth) wraps the app. App-level providers include ThemeProvider, AdminProvider, FederationProvider.
Routing: src/App.tsx defines public and protected routes using ProtectedRoute.
Role gating: RoleRestricted for UI-level role checks.
API encapsulation: useAdmin, useFederation, and page-specific hooks call backend endpoints. Token stored in localStorage per src/mern-access.config.ts.

API Expectations (Client-Side)
The client expects JSON endpoints under the configured base URL:

Auth: ${VITE_AUTHAPI_URL}/auth/*
Admin:
GET ${VITE_AUTHAPI_URL}/admin/dashboard
POST ${VITE_AUTHAPI_URL}/admin/tournament/start
POST ${VITE_AUTHAPI_URL}/admin/tournament/reset
Federation:
GET ${VITE_AUTHAPI_URL}/fed/dashboard
POST ${VITE_AUTHAPI_URL}/fed/register-team
Bracket: GET ${VITE_AUTHAPI_URL}/bracket
Players / top scorers: GET ${VITE_AUTHAPI_URL}/players/top-scorers
Match simulation: POST ${VITE_AUTHAPI_URL}/match/simulate
Authenticated endpoints should accept a Bearer token. The client attaches the token from localStorage (see src/mern-access.config.ts).

Example cURL (login):
curl -X POST "${VITE_AUTHAPI_URL}/auth/login" -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"secret"}'

UX & Styling
Tailwind CSS + custom brutalist token set (tailwind.config.js, index.css)
Visual rules: no border-radius, high-contrast palettes, Courier New for typographic emphasis
Theme toggles handled by useTheme.tsx

Troubleshooting & Tips
CORS errors: ensure backend allows dev origin (Vite default: http://localhost:5173)
Token missing: complete OTP verification; token stored under configured key in mern-access.config.ts
Tailwind utilities not applying: verify postcss.config.js and tailwind.config.js are loaded by Vite
Type errors: run npm run typecheck
Seeding & Demo Accounts
See SETUP.md for seed scripts and demo credentials (admin + federation reps). If missing, create backend seed endpoints to populate demo data for local testing.

Testing & Simulation Helpers
OTP simulation referenced in VerifyForm.tsx can speed up local testing when no SMS/email provider exists.
Admin match simulation utilities in MatchManagement.tsx allow fast tournament progression in dev.

Contributing
Keep code in TypeScript + React + Tailwind
Add unit tests for business logic and run npm run typecheck
Follow lint rules in eslint.config.js
Create PRs with clear descriptions
License
MIT