# African Nations League - Setup Guide

## Quick Start

### 1. Seed the Database
Visit `/seed` in your browser and click "SEED DATABASE" to populate demo data.

### 2. Demo Credentials

**Admin Account:**
- Email: `admin@league.com`
- Password: `admin123`

**Federation Representatives:**
- Email: `nigeria@fed.com` (or egypt, senegal, morocco, ghana, cameroon, algeria)
- Password: `fed123`

## Features by Role

### Visitor (No Login Required)
- View tournament bracket
- Check match results
- See top goal scorers

### Federation Representative
- Register national team (23 players)
- View team dashboard
- Manage squad
- Track team performance

### Administrator
- Start tournament when 8 teams registered
- Simulate matches (quick or with commentary)
- Reset tournament to quarter-finals
- View all teams and system analytics

## Tournament Flow

1. **Registration Phase**: Federation reps register teams
2. **Start Tournament**: Admin starts when 8 teams ready (creates quarter-finals bracket)
3. **Play Matches**: Admin simulates matches round by round
4. **Automatic Advancement**: System creates semi-finals and final automatically
5. **Champion Crowned**: Tournament marked complete after final

## Design Philosophy

This app uses **brutalist design** principles:
- Zero border radius (sharp corners everywhere)
- Monochromatic black/white color scheme
- High contrast dark/light mode
- Type-heavy interface with Courier New
- No gradients, shadows, or decorative elements
- Functional, raw aesthetic

## Tech Stack

- React + TypeScript
- Vite
- Supabase (Auth + PostgreSQL)
- Tailwind CSS
- React Router
- Lucide React Icons

## Key URLs

- `/` - Home page
- `/login` - Login/Signup
- `/bracket` - Tournament bracket
- `/scorers` - Top scorers
- `/federation/dashboard` - Federation dashboard
- `/federation/register` - Team registration
- `/admin/dashboard` - Admin control panel
- `/admin/matches` - Match management
- `/seed` - Database seeding utility
