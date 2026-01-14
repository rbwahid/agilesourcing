# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgileSourcing is a fashion design validation platform connecting designers with suppliers. It consists of a Laravel 12 API backend and a Next.js 14 frontend in a monorepo structure.

## Must Todo

- Always use your frontend-design skill for working in the frontend design.
- Always read the current progress about the development from `build-plan.md`.
- Always read the detail about the project from `mvp-requirements.md` and verify the development against this.
- Whenever you start a task, please plan for that first and get the approval for that plan. Do not proceed without any plan.
- If you think you are not sure about any feature requirement, do not proceed to develop that, make sure to verify that with me.

## Commands

### Backend (Laravel)

```bash
cd backend

# Development (runs server + queue + logs + vite concurrently)
composer run dev

# Individual commands
php artisan serve              # API server on http://localhost:8000
php artisan queue:listen       # Process background jobs

# Testing
composer run test              # Full test suite with config cache clear
php artisan test               # Direct PHPUnit
php artisan test --filter=TestName  # Single test

# Code formatting
./vendor/bin/pint              # Laravel Pint formatter
./vendor/bin/pint --test       # Check without fixing

# Database
php artisan migrate            # Run migrations
php artisan migrate:fresh --seed  # Reset database with seeders
php artisan db:seed            # Run seeders only
php artisan tinker             # Interactive REPL
```

### Frontend (Next.js)

```bash
cd frontend

npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm start        # Production server
```

## Architecture

### Backend Structure

- **API-First Design**: All endpoints under `/api/` with Sanctum session authentication
- **Controllers**: Organized as `Api/Auth/`, `Api/Admin/`, `Api/V1/` namespaces
- **Service Layer**: Business logic in `app/Services/` organized by domain:
  - `AI/` - OpenAI (GPT-4o Vision) and Gemini integration for design analysis
  - `Admin/` - Platform statistics and admin operations
  - `Instagram/` - Instagram Graph API integration
  - `Supplier/` - Matching algorithm and supplier statistics
- **Policies**: Authorization via `app/Policies/` (DesignPolicy, ConversationPolicy, MessagePolicy)
- **Queue Jobs**: Background processing in `app/Jobs/` for AI analysis, Instagram posting, metrics collection

Key models: User, Profile, Design, DesignVariation, Validation, Mockup, Supplier, SupplierCertification, Conversation, Message, Plan

### Frontend Structure

- **App Router**: Next.js 14 with route groups:
  - `(auth)` - Login, register, password reset (public)
  - `(dashboard)` - Designer routes (protected)
  - `(supplier)` - Supplier routes (protected)
  - `(admin)` - Admin panel (protected, admin role required)
- **State Management**: Zustand stores + React Query for server state
- **API Client**: Axios with Sanctum CSRF handling in `lib/api/client.ts`
- **Auth Hooks**: `useAuth()`, `useLogin()`, `useUser()` in `lib/hooks/use-auth.ts`
- **UI Components**: shadcn/ui (Radix) in `components/ui/`

### File Storage

All uploaded files are stored on the **private disk** (not publicly accessible):
- Files served via `FileController` with authorization checks
- Storage paths: `messages/`, `designs/`, `profiles/`, `certifications/`, `catalog/`, `mockups/`
- Route: `GET /api/v1/files/{type}/{id}/{filename}`

### Security Features

- **Account Lockout**: 5 failed login attempts triggers 15-minute lockout
- **Password Complexity**: Requires mixed case, numbers, and special characters
- **Security Logging**: Events logged to `storage/logs/security.log` (90-day retention)
- **Rate Limiting**: Login (5/min), register (3/hour), API (60/min)

### Database

- MySQL 8.0+ for development/production
- SQLite in-memory for tests
- Redis for cache/sessions/queues (optional, defaults to database driver)

### Authentication Flow

1. Frontend calls `getCsrfToken()` to fetch Sanctum CSRF cookie
2. Login/register via `/api/login`, `/api/register`
3. Session maintained via cookies (`withCredentials: true`)
4. `useUser()` hook queries `/api/user` for current user

## Environment

Backend `.env` requires:
- `FRONTEND_URL=http://localhost:3000` (for CORS)
- `SANCTUM_STATEFUL_DOMAINS=localhost:3000`
- MySQL connection settings

Frontend `.env.local`:
- `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

## Key Packages

**Backend**: laravel/sanctum, laravel/cashier, laravel/socialite, spatie/laravel-permission, spatie/laravel-activitylog, openai-php/laravel, intervention/image

**Frontend**: @tanstack/react-query, zustand, axios, react-hook-form, zod, recharts, sonner (toasts), @stripe/react-stripe-js

## Roles

Four user roles managed by Spatie Permission:
- `designer` - Fashion designers uploading and validating designs
- `supplier` - Manufacturing suppliers with profiles and catalogs
- `admin` - Platform administrators
- `super_admin` - Full system access
