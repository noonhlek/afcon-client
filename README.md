# African Nations League — Client (Auth-First MVP)

A lightweight React + TypeScript Vite app for managing an 8-team knockout tournament (quarter → semi → final) with role-based access (visitor, federation, admin) and OTP-first authentication.

----

## Table of Contents
-[Overview](#overview)
-[Quick Start — Run the App (Windows)](#Quick Start — Run the App (Windows))
-[Rationale — Why This Design](#Rationale — Why This Design)
-[System Components](#System Components)
-[Authentication & Token Handling](#Authentication & Token Handling)
-[Expected Backend Endpoints](#Expected Backend Endpoints)
-[Troubleshooting](#Troubleshooting)
-[System Architecture Diagram](#System Architecture Diagram)
-[Useful Commands Recap](#Useful Commands Recap)
-[License](#license)

---
## Overview

This client is an "auth-first" React + TypeScript Vite app that relies on a backend API for authentication and tournament state. It uses `mern-access-client` for OTP-based auth flows and supports role-based UI/route protection for three roles: visitor, federation representative, and admin.

---
## Quick start — Run the app (Windows)

Prerequisites
- Node.js 18+ and npm
- Backend API running and reachable from this client

1. Open the project in VS Code:
   c:\Users\27726\Downloads\My projects\UCT\client
   
3. Install dependencies (PowerShell / CMD):
```powershell
npm install
```
3. Set backend base URL
- Edit `.env` at project root (or create it) with:
```
VITE_AUTHAPI_URL=http://localhost:4001
```
- The client reads this value at build/runtime (import.meta.env.VITE_AUTHAPI_URL).
- 
4. Start dev server:
```powershell
npm run dev
```
Open http://localhost:5173 (Vite default).

5. Build / preview:
```powershell
npm run build
npm run preview
```

Useful scripts (see package.json)
- npm run dev — start development server  
- npm run build — production build  
- npm run preview — preview production build  
- npm run lint — lint codebase  
- npm run typecheck — TypeScript checks

---

## Rationale — why this design

- Auth-first UX: forcing authentication (OTP) early simplifies permission checks and keeps sensitive admin/federation workflows protected.
- OTP instead of passwords: faster onboarding for MVP, fewer server-side credential concerns.
- Role-based UI: single codebase surfaces different tools depending on user role — reduces duplicate apps.
- Hook + provider pattern: useAdmin, useFederation, ThemeProvider encapsulate side effects and API calls, improving testability.
- Vite + Tailwind: fast iteration, small bundles, and predictable styling.

---

## System components (what to edit / where to look)

Core
- src/main.tsx — app entry; composes providers (MernAccessProvider, ThemeProvider).
- src/App.tsx — routing, public and protected routes.

Authentication
- src/mern-access.config.ts — mern-access-client config, token/localStorage key.
- src/components/auth/LoginForm.tsx — start login/signup (requests OTP).
- src/components/auth/SignupForm.tsx — signup flow.
- src/components/auth/VerifyForm.tsx — OTP input, resend timer, final verification (stores token). (See VerifyForm.tsx in repo.)
- src/components/auth/ProtectedRoute.tsx — route-level protection.
- src/components/auth/RoleRestricted.tsx — UI-level role gating.

Domain hooks & pages
- src/hooks/useAdmin.tsx — admin APIs: start/reset tournament, simulate matches.
- src/hooks/useFederation.tsx — federation APIs: register/manage squads.
- src/pages/BracketPage.tsx — bracket rendering & progression.
- src/pages/TopScorersPage.tsx — leaderboard.
- src/pages/admin/* and src/pages/federation/* — role-specific dashboards & tools.

Utilities & config
- src/utils/* — helpers (time formatting, etc.)
- src/types/* — TypeScript models
- tailwind.config.js, postcss.config.js, vite.config.ts — build & styling configs
- .env — VITE_AUTHAPI_URL

---

## Authentication & token handling (summary)

1. User requests OTP via Login/Signup; backend returns a temporary identifier (stored in localStorage as `userId`).
2. User enters 6-digit OTP in VerifyForm; client calls verify(userId, otp) using mern-access-client.
3. Backend returns auth token + user metadata (roles). Client stores token per mern-access.config.ts (localStorage key).
4. Protected hooks attach Authorization: Bearer <token> to API calls.
- Check src/mern-access.config.ts for the exact storage key and token handling.

---

## Expected backend endpoints (base = VITE_AUTHAPI_URL)

Auth
- POST /auth/signup
- POST /auth/login
- POST /auth/verify

Federation
- GET /fed/dashboard
- POST /fed/register-team

Admin
- GET /admin/dashboard
- POST /admin/tournament/start
- POST /admin/tournament/reset

Domain
- GET /bracket
- GET /players/top-scorers
- POST /match/simulate

All protected endpoints should accept Authorization: Bearer <token>.

---

## Troubleshooting (common issues)

- CORS: enable origin http://localhost:5173 on backend or use Vite proxy (vite.config.ts).
- OTP not delivered in dev: check backend dev otp-sim endpoints (VerifyForm may target `${VITE_AUTHAPI_URL}/otpsim`).
- Token missing: inspect DevTools → Application → Local Storage for configured token key.
- Tailwind not applied: ensure src/index.css is imported in main.tsx and PostCSS/Tailwind configs exist.
- Type errors: run npm run typecheck.

---

## System architecture diagram

Mermaid (render if supported):
```mermaid
graph LR
  Browser["Browser (React + Vite)"]
  subgraph Client
    A[main.tsx - Providers]
    B[Auth UI: Login/Signup/Verify]
    C[Routing: App.tsx + ProtectedRoute]
    D[Pages: Bracket / Admin / Federation]
    H[Hooks: useAdmin / useFederation / useTheme]
  end

  subgraph Backend
    API["API (VITE_AUTHAPI_URL)\n/auth /admin /fed /match"]
    DB[(Database: users, teams, matches)]
    Provider["SMS / Email Provider (optional)"]
  end

  Browser --> A
  A --> B
  A --> C
  C --> D
  D --> H
  H -->|HTTP (Bearer token)| API
  B -->|OTP requests / verify| API
  API --> DB
  API --> Provider
```

ASCII fallback:
- Browser (React + Vite)
  - Providers → Auth UI → Protected routing → Pages
  - Hooks call Backend (VITE_AUTHAPI_URL) with Bearer token
- Backend
  - Auth / Admin / Federation APIs
  - Database for users/teams/matches
  - Optional SMS/Email provider for OTP

---
  ## Useful commands (recap)

- Install: npm install
- Dev server: npm run dev
- Build: npm run build
- Preview build: npm run preview
- Lint: npm run lint
- Type-check: npm run typecheck

---

## License

MIT
