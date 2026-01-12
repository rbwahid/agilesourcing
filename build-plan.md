# AgileSourcing Build Plan

## Overview

This document outlines the implementation plan for the AgileSourcing MVP. Each phase contains specific tasks with descriptions. Check off tasks as they are completed.

**Reference Document:** [MVP Requirements](./mvp-requirements.md)

---

## Project File Structure

### Backend: Laravel 12 (`backend/`)

```
backend/
├── app/
│   ├── Console/
│   │   └── Commands/                 # Custom Artisan commands
│   ├── Events/                       # Event classes
│   ├── Exceptions/                   # Exception handlers
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/                  # API controllers (Auth, Design, Supplier, etc.)
│   │   │   └── Admin/                # Admin controllers (Dashboard, Users, Suppliers, etc.)
│   │   ├── Middleware/               # Custom middleware (Auth, Role, AdminAccess)
│   │   ├── Requests/                 # Form request validation classes
│   │   └── Resources/                # API Resources (JSON transformers)
│   ├── Jobs/                         # Queue jobs (AI analysis, metrics, notifications)
│   ├── Listeners/                    # Event listeners
│   ├── Mail/                         # Mailable classes
│   ├── Models/                       # Eloquent models
│   ├── Notifications/                # Notification classes
│   ├── Policies/                     # Authorization policies
│   ├── Providers/                    # Service providers
│   └── Services/                     # Business logic services
│       ├── AI/                       # OpenAI integration services
│       ├── Admin/                    # Admin services (analytics, audit logs, reports)
│       ├── Instagram/                # Instagram API services
│       ├── Matching/                 # Supplier matching engine
│       └── Payment/                  # Stripe integration
├── bootstrap/                        # Application bootstrap
├── config/                           # Configuration files
├── database/
│   ├── factories/                    # Model factories for testing
│   ├── migrations/                   # Database migrations
│   └── seeders/                      # Database seeders
├── public/                           # Public assets, entry point
├── resources/
│   └── views/
│       └── emails/                   # Email templates
├── routes/                           # API and console routes
├── storage/
│   ├── app/
│   │   ├── public/                   # Public uploads (designs, variations, profiles)
│   │   └── private/                  # Private files
│   ├── framework/                    # Framework cache
│   └── logs/                         # Application logs
└── tests/
    ├── Feature/                      # Feature tests
    └── Unit/                         # Unit tests
```

### Frontend: Next.js 14 (`frontend/`)

```
frontend/
├── src/
│   ├── app/                          # App Router
│   │   ├── (auth)/                   # Auth pages (login, register, forgot-password)
│   │   ├── (dashboard)/              # Protected designer routes
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── designs/              # Design management & validation
│   │   │   ├── suppliers/            # Supplier directory & profiles
│   │   │   ├── messages/             # Messaging & conversations
│   │   │   └── settings/             # Profile, integrations, billing
│   │   ├── (supplier)/               # Supplier-specific routes
│   │   │   ├── supplier-dashboard/   # Supplier dashboard
│   │   │   └── inquiries/            # Inquiry management
│   │   ├── (admin)/                  # Admin panel routes
│   │   │   ├── admin-dashboard/      # Admin overview & metrics
│   │   │   ├── users/                # User management
│   │   │   ├── verifications/        # Supplier verification queue
│   │   │   ├── subscriptions/        # Billing & subscription management
│   │   │   ├── support/              # Customer support tools
│   │   │   └── settings/             # Platform settings & system
│   │   └── api/                      # Next.js API routes (minimal)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── forms/                    # Form components
│   │   ├── design/                   # Design-related components
│   │   ├── supplier/                 # Supplier-related components
│   │   ├── admin/                    # Admin panel components
│   │   ├── layout/                   # Layout components (Header, Sidebar, Footer)
│   │   └── shared/                   # Shared/common components
│   ├── lib/
│   │   ├── api/                      # API client and service calls
│   │   ├── hooks/                    # Custom React hooks
│   │   └── utils/                    # Utility functions
│   ├── stores/                       # State management (Zustand)
│   └── types/                        # TypeScript type definitions
└── public/                           # Static assets (images, icons, fonts)
```

---

## Phase 1: Foundation (Weeks 1-4)

### 1.1 Project Setup

#### Laravel Backend Components

| Category | Package/Component | Purpose |
|----------|------------------|---------|
| **Framework** | Laravel 12 | Core PHP framework |
| **Language** | PHP 8.3+ | Backend language |
| **Database** | MySQL 8.0+ | Primary database |
| **ORM** | Eloquent | Database ORM |
| **Authentication** | Laravel Sanctum | API token authentication |
| **Queue** | Laravel Horizon | Queue management dashboard |
| **Cache** | Redis | Caching and queue driver |
| **File Storage** | Laravel Filesystem | Local file storage |
| **Email** | Laravel Mail | Email sending |
| **Validation** | Laravel Validation | Request validation |
| **Testing** | PHPUnit, Pest | Testing framework |
| **API Resources** | Laravel Resources | JSON response transformation |
| **Scheduling** | Laravel Scheduler | Cron job management |
| **Notifications** | Laravel Notifications | Multi-channel notifications |

**Additional Packages:**

| Package | Purpose |
|---------|---------|
| `laravel/socialite` | Instagram OAuth integration |
| `stripe/stripe-php` | Stripe payment processing |
| `laravel/cashier` | Subscription billing |
| `openai-php/client` | OpenAI API integration |
| `spatie/laravel-permission` | Role and permission management |
| `spatie/laravel-activitylog` | Audit logging |
| `intervention/image` | Image processing |
| `maatwebsite/excel` | Excel export for reports |

#### Next.js Frontend Components

| Category | Package/Component | Purpose |
|----------|------------------|---------|
| **Framework** | Next.js 14+ | React framework with App Router |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **UI Components** | shadcn/ui | Accessible component library |
| **State Management** | Zustand | Lightweight state management |
| **HTTP Client** | Axios | API requests |
| **Forms** | React Hook Form | Form handling |
| **Validation** | Zod | Schema validation |
| **Icons** | Lucide React | Icon library |
| **Charts** | Recharts | Data visualization |
| **Date Handling** | date-fns | Date utilities |
| **Toast/Notifications** | Sonner | Toast notifications |

**Additional Packages:**

| Package | Purpose |
|---------|---------|
| `@tanstack/react-query` | Server state management and caching |
| `next-auth` | Authentication (optional, for session management) |
| `react-dropzone` | File upload drag and drop |
| `sharp` | Image optimization |
| `clsx` / `tailwind-merge` | Conditional class names |
| `embla-carousel-react` | Carousel/slider component |

#### Development Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **Composer** | PHP dependency management |
| **npm/pnpm** | Node.js package management |
| **Laravel Pint** | PHP code formatting |
| **ESLint** | JavaScript/TypeScript linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |

---

#### Setup Tasks

- [x] **Initialize Laravel backend project**
  - Create new Laravel 12 project
  - Install required packages (Sanctum, Horizon, Socialite, Cashier, etc.)
  - Configure environment files
  - Set up project structure per file structure above

- [x] **Initialize Next.js frontend project**
  - Create new Next.js 14 project with TypeScript
  - Install and configure Tailwind CSS
  - Set up shadcn/ui components
  - Install additional packages (Zustand, React Query, React Hook Form, etc.)
  - Configure project structure per file structure above

- [x] **Set up version control**
  - Initialize Git repository at project root
  - Set up comprehensive .gitignore files
  - Configure branching strategy (main, develop, feature branches) - to be done
  - Configure Husky for pre-commit hooks - to be done

- [x] **Configure development environment**
  - Set up local MySQL database
  - Configure Redis for caching and queues
  - Set up local file storage directories
  - Create storage symlink for public files

### 1.2 Authentication System

- [x] **Implement user registration**
  - Created RegisterController with RegisterRequest validation
  - Implemented email verification flow (fires Registered event)
  - Handles validation errors with custom messages

- [x] **Implement user login**
  - Created LoginController with Laravel Sanctum session auth
  - Session-based authentication for SPA (no API tokens needed)
  - Handles invalid credentials with ValidationException

- [x] **Implement password reset**
  - Created PasswordResetController with forgotPassword/resetPassword methods
  - Sends password reset emails via Laravel's Password broker
  - Handles token validation and expiration

- [x] **Set up role-based access control**
  - Roles defined: Designer, Supplier, Admin, Super Admin (via Spatie Permission)
  - Created EnsureUserHasRole middleware for role verification
  - Role assignment during registration via assignRole()

- [x] **Build frontend authentication pages**
  - Created login page with form validation (React Hook Form)
  - Created registration page with role selection (Designer/Supplier cards)
  - Created forgot password and reset password pages
  - Auth state managed via React Query (useLogin, useRegister, useUser hooks)

- [x] **Implement protected routes**
  - Created Next.js middleware for route protection
  - Route guards for /dashboard, /supplier-dashboard, /admin-dashboard
  - Auth pages redirect to dashboard if already authenticated

### 1.3 Core Database Setup

- [x] **Create initial migrations**
  - Users table migration (added role, last_login_at, is_active)
  - Profiles, Plans, Designs, Suppliers, InstagramConnections
  - DesignVariations, Validations, SupplierCertifications
  - ProductCatalogItems, Conversations, Messages, SavedSuppliers, Inquiries

- [x] **Set up Eloquent models**
  - Created 12 models with full relationships
  - Added HasRoles trait to User model
  - Created 12 model factories for testing
  - Created RolesAndPermissionsSeeder (4 roles, 24 permissions)
  - Created PlansSeeder (4 subscription plans)

### 1.4 API Client Setup

- [x] **Configure API client in frontend**
  - Set up Axios instance with base URL and CSRF token handling
  - Configure request interceptors (XSRF token injection)
  - Configure response interceptors (comprehensive error handling)

- [x] **Implement error handling**
  - Created ApiError and ValidationError classes
  - Global error handler with toast notifications
  - React Query hooks for auth operations (useLogin, useUser, etc.)

### 1.5 Base UI Framework

- [x] **Create layout components**
  - Created DashboardShell with role-based navigation (designer/supplier/admin)
  - Created Sidebar with collapse/expand, tooltips, and localStorage persistence
  - Created MobileSidebar using Sheet component for mobile navigation
  - Created Header with user menu and mobile toggle
  - Created UserMenu with avatar, role badge, and dropdown actions
  - Created SidebarItem with active states and badge support

- [x] **Set up shared components**
  - Installed 12 shadcn/ui components (skeleton, avatar, sheet, separator, scroll-area, tooltip, select, textarea, switch, badge, tabs, progress)
  - Created LoadingSpinner and FullPageLoader components
  - Created PageSkeleton with 4 variants (dashboard, list, detail, form)
  - Created EmptyState, NoResultsState, NoDataState, NotFoundState components
  - Created ErrorBoundary and ErrorFallback components

- [x] **Implement design system**
  - Brand colors configured in globals.css (agile-teal, mint-accent, charcoal, light-grey)
  - Navigation configuration in src/config/navigation.ts with role-based nav arrays
  - Created useSidebar hook for consistent sidebar state management
  - Route layouts created for (dashboard), (supplier), (admin) route groups

### 1.6 Security Foundation

#### Backend Security

- [x] **Configure HTTPS and SSL**
  - Configured secure cookie settings (SESSION_SECURE_COOKIE for production)
  - Session encryption enabled for production (SESSION_ENCRYPT)
  - HSTS header added via SecurityHeaders middleware (production only)

- [x] **Implement input validation**
  - Laravel form request validation already implemented (LoginRequest, RegisterRequest, etc.)
  - Validation rules enforce email format, password minimums, unique constraints

- [x] **Configure CORS properly**
  - Restricted allowed_methods to specific HTTP verbs (GET, POST, PUT, PATCH, DELETE, OPTIONS)
  - Restricted allowed_headers to required headers only
  - Exposed rate limit headers for frontend handling
  - Preflight caching set to 1 hour (max_age: 3600)

- [x] **Set up rate limiting**
  - Login: 5 attempts per minute (per email+IP combo)
  - Register: 3 attempts per hour (per IP)
  - Password reset: 3 attempts per hour (per IP)
  - General API: 60 requests per minute

- [x] **Secure authentication tokens**
  - Token expiration set to 8 hours (SANCTUM_TOKEN_EXPIRATION=480)
  - Using httpOnly session cookies via Sanctum SPA authentication

- [x] **Protect against common attacks**
  - CSRF protection via Sanctum middleware (already configured)
  - SQL injection prevention via Eloquent ORM
  - Security headers middleware: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy

- [x] **Secure environment configuration**
  - Updated .env.example with security configuration section
  - Production security settings documented as comments
  - Environment-based defaults for session encryption and secure cookies

- [x] **Implement secure password policy**
  - Password minimum 8 characters (RegisterRequest, ResetPasswordRequest)
  - Using bcrypt with 12 rounds (BCRYPT_ROUNDS=12)

#### Frontend Security

- [x] **Secure token storage**
  - Removed localStorage persistence from auth-store.ts
  - Auth state managed via React Query + server-side httpOnly cookies
  - Zustand store now in-memory only

- [x] **Implement XSS prevention**
  - Using React's built-in XSS protection
  - Security headers added: X-XSS-Protection, X-Content-Type-Options

- [x] **Configure Content Security Policy**
  - Security headers configured in next.config.ts
  - X-Frame-Options: DENY (clickjacking protection)
  - Permissions-Policy restricts sensitive browser features

- [x] **Secure API communication**
  - CSRF tokens included via Sanctum integration
  - API client timeout set to 30 seconds
  - Proper error handling for 401, 403, 429 responses

- [x] **Implement secure forms**
  - React Hook Form with Zod validation
  - Client-side validation before API submission

- [x] **Protect sensitive routes**
  - Next.js middleware protects dashboard routes
  - Role verification in DashboardShell component
  - Redirect to login for unauthenticated access

---

## Phase 2: Designer Onboarding & Design Upload (Weeks 5-8)

### 2.1 Designer Onboarding

- [x] **Build profile creation wizard**
  - Created multi-step onboarding wizard (5 steps) with WizardContainer, WizardProgress, WizardNavigation components
  - Collects business name, location, bio, website, style focus, target demographics
  - Full-canvas standalone route at `/onboarding` (no dashboard shell)
  - Profile API endpoints: GET/PUT /api/v1/profile, POST /api/v1/profile/complete-onboarding
  - React Hook Form with Zod validation, React Query hooks for mutations

- [x] **Implement target demographic selection**
  - Created step-target-audience.tsx with multi-select pills
  - Three categories: Age Groups, Gender, Price Points
  - Constants defined in types/profile.ts (TARGET_AGE_GROUPS, TARGET_GENDERS, TARGET_PRICE_POINTS)
  - Optional step (can be skipped)

- [x] **Create onboarding flow integration**
  - Dashboard shell redirects designers to /onboarding if not completed
  - Login/register hooks redirect new designers to onboarding
  - Completion screen with confetti animation and next steps
  - Profile has `has_completed_onboarding` flag checked on auth

### 2.2 Design Upload System

- [x] **Build design upload interface**
  - Created DesignDropzone component with react-dropzone (animated drag-and-drop)
  - Support JPG, PNG, PDF formats (ACCEPTED_FILE_TYPES constant)
  - Upload progress via DesignUploadForm with loading states

- [x] **Implement file storage**
  - DesignController@store handles file uploads
  - Files stored in `storage/app/public/designs/{user_id}/`
  - URLs generated via Storage::url() accessor

- [x] **Create design metadata form**
  - DesignUploadForm with React Hook Form + Zod validation
  - Category selection (8 categories), Season selection (5 options)
  - Target demographic field, Save as Draft / Publish buttons

- [x] **Build design gallery view**
  - DesignGrid with responsive 4/3/2/1 column layout
  - DesignCard with hover effects, status badges, actions menu
  - DesignFilters (status, category, search), pagination support

- [x] **Create design detail page**
  - `/designs/[id]` page with image zoom, metadata display
  - DesignAIPlaceholder shows pending/processing/completed states
  - Variations placeholder card for Phase 3

### 2.3 Design Management

- [x] **Implement design listing**
  - DesignController@index with status, category, search filters
  - useDesigns hook with React Query, DesignFilters component
  - Sorted by created_at DESC, paginated (12 per page)

- [x] **Build design status tracking**
  - DesignStatus type: draft | active | archived
  - DesignStatusBadge component with color-coded badges
  - useUpdateDesignStatus hook for status changes

- [x] **Create design deletion**
  - AlertDialog confirmation in gallery and detail pages
  - useDeleteDesign hook with cache invalidation
  - DesignController@destroy removes files and variations

---

## Phase 3: AI Integration & Design Analysis (Weeks 9-12)

### 3.1 OpenAI Integration

- [x] **Set up OpenAI service**
  - Configured API credentials in .env.example (OPENAI_API_KEY, OPENAI_MODEL)
  - Created DesignAnalysisService with GPT-4o Vision integration
  - Implemented rate limit handling with exponential backoff in jobs

- [x] **Implement design analysis**
  - Send design images to OpenAI GPT-4o Vision as base64
  - Process structured JSON response (keywords, colors, materials, trend score, market fit)
  - Store analysis results in `ai_analysis_result` JSON field

- [x] **Create variation generation**
  - Created VariationGeneratorService with Google Gemini integration
  - Generate text-based variation suggestions with rationale
  - Store variation data in DesignVariation model with ai_suggestions

### 3.2 Queue System for AI Processing

- [x] **Configure Laravel queues**
  - Redis queue driver already configured (QUEUE_CONNECTION=redis)
  - Laravel Horizon installed for queue management
  - Implemented retry logic with exponential backoff (30s, 60s, 120s)

- [x] **Create AI analysis job**
  - Created AnalyzeDesignJob dispatched on design upload
  - Updates status: pending → processing → completed/failed
  - Graceful failure handling with error logging

- [x] **Create variation generation job**
  - Created GenerateVariationsJob triggered manually or after analysis
  - Processes multiple variations (default 3)
  - Creates DesignVariation records with AI suggestions

### 3.3 Trend Analysis

- [x] **Implement trend scoring**
  - Trend score (0-100) calculated by GPT-4o Vision
  - Stored in design.trend_score field
  - Color-coded display (red < 40, yellow 40-70, green > 70)

- [x] **Build analysis results display**
  - DesignAIAnalysis component with status states (pending/processing/completed/failed)
  - DesignTrendScore with animated circular progress indicator
  - DesignAnalysisDetails with expandable sections (colors, materials, market fit, seasonality)

### 3.4 Variation Display

- [x] **Create variation comparison view**
  - DesignVariationsGrid displays original + generated variations side-by-side
  - DesignVariationCard shows AI rationale and suggestions
  - Expandable details for color/material/style changes

- [x] **Implement variation management**
  - Generate/regenerate variations via API endpoints
  - POST /api/v1/designs/{id}/variations - generate new
  - POST /api/v1/designs/{id}/variations/regenerate - delete existing and regenerate
  - Frontend polling for real-time status updates

---

## Phase 4: Instagram Integration & Validation (Weeks 13-16)

### 4.1 Instagram OAuth

- [x] **Set up Instagram API credentials**
  - Created config/services.php Instagram configuration
  - Added environment variables to .env.example (INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET, INSTAGRAM_REDIRECT_URI)
  - Token encryption in InstagramConnection model

- [x] **Implement OAuth flow**
  - Created InstagramService with getAuthUrl(), exchangeCodeForToken(), refreshToken() methods
  - Created InstagramAuthController with redirect, callback, status, disconnect, refresh endpoints
  - Added OAuth routes: GET /instagram/auth, GET /instagram/callback, GET /instagram/status, DELETE /instagram/disconnect, POST /instagram/refresh

- [x] **Build account connection UI**
  - Created InstagramConnectCard component with Instagram gradient branding
  - Shows connected status with animated indicator, username, profile picture, follower count
  - Token expiry warning with refresh button
  - Disconnect confirmation dialog
  - Updated settings page with Instagram integration section

### 4.2 Design Posting (Mockup Generation)

- [x] **Create virtual model mockup**
  - Created Mockup model and migration with model_type, pose, background fields
  - Created MockupGeneratorService using DALL-E 3 for AI mockup generation
  - Model types: male, female, unisex | Poses: front, side, back, action | Backgrounds: studio, outdoor, urban, beach
  - Created GenerateMockupJob for async processing with retry logic

- [x] **Implement Instagram posting**
  - Created PostToInstagramJob to publish mockups to Instagram via Graph API
  - InstagramService::publishMedia() handles image upload and caption
  - Stores instagram_media_id and instagram_post_url on validation record
  - Sets validation_ends_at based on duration

- [x] **Build post preview**
  - Created ValidationCreateWizard with 5-step process (Design → Mockup → Caption → Duration → Review)
  - Preview step shows mockup image with caption before posting
  - Caption editor with 2,200 character limit and counter
  - Duration options: 24h, 48h (recommended), 72h, 7 days

### 4.3 Engagement Tracking

- [x] **Set up metrics collection job**
  - Created FetchInstagramInsightsJob that polls every hour while validation is active
  - Created FinalizeValidationJob to calculate final score when validation ends
  - Created RefreshInstagramTokenJob (daily scheduled) to refresh tokens expiring within 7 days
  - Added scheduler entry in routes/console.php

- [x] **Build engagement dashboard**
  - Created validation detail page (/validations/[id]) with real-time metrics
  - Shows likes, comments, shares, saves with color-coded icons
  - Engagement rate display, total engagement count
  - Live polling indicator while validation is active
  - Timeline section showing start time, time remaining, completion time

- [x] **Implement validation scoring**
  - Weighted scoring algorithm: likes (20%), comments (30%), saves (35%), shares (15%)
  - Score normalized against industry benchmarks per follower count
  - Created ValidationScoreDisplay component with animated circular progress
  - Score interpretation: Excellent (≥80), Good (≥60), Average (≥40), Below Average (<40)

### 4.4 Validation Results

- [x] **Create results display**
  - Created ValidationCard for grid display with status badges, metrics, engagement rate
  - Created ValidationStatusBadge with icons (pending, active, completed, failed, cancelled)
  - Winner badge display for top-performing validations
  - Created ValidationEmptyState with animated icons and feature highlights

- [ ] **Build comparison view** (Optional Enhancement)
  - ValidationComparisonView component not implemented
  - Side-by-side comparison of multiple validations (planned for future)

- [ ] **Build recommendation engine** (Optional Enhancement)
  - Analysis of validation results not implemented
  - Production recommendations based on scores (planned for future)

- [ ] **Implement results export** (Optional Enhancement)
  - PDF validation report generation not implemented
  - Export and sharing functionality (planned for future)

### 4.5 Frontend Pages & Navigation

- [x] **Create validation pages**
  - Created /validations list page with status filtering dropdown
  - Created /validations/new page with ValidationCreateWizard
  - Created /validations/[id] detail page with metrics and score display
  - Added Validations link to designer navigation in config/navigation.ts

- [x] **Frontend API & Hooks**
  - Created lib/api/instagram.ts, lib/api/mockups.ts, lib/api/validations.ts
  - Created hooks: useInstagramStatus, useConnectInstagram, useDisconnectInstagram
  - Created hooks: useMockups, useCreateMockup, useMockupsPolling
  - Created hooks: useValidations, useValidation, useValidationPolling, useCreateValidation, useCancelValidation
  - Created types: InstagramConnection, Mockup, MockupOptions, Validation, ValidationMetrics

---

## Phase 5: Supplier Module (Weeks 17-20)

### 5.1 Supplier Onboarding

- [ ] **Build supplier registration flow**
  - Create supplier-specific registration
  - Collect company information
  - Handle role assignment

- [ ] **Create company profile form**
  - Build detailed profile form
  - Collect production capabilities
  - Store MOQ and lead times

- [ ] **Implement certification upload**
  - Create file upload for certificates
  - Support multiple certifications
  - Store certification documents

- [ ] **Build verification submission**
  - Create verification request flow
  - Track verification status
  - Send confirmation emails

### 5.2 Supplier Directory

- [ ] **Create supplier listing page**
  - Display supplier cards in grid
  - Show key information
  - Implement pagination

- [ ] **Build search functionality**
  - Implement text search
  - Search by company name, location
  - Display search results

- [ ] **Implement filtering system**
  - Filter by certification type
  - Filter by location/region
  - Filter by product type
  - Filter by MOQ range

- [ ] **Add sorting options**
  - Sort by relevance
  - Sort by rating
  - Sort by response time

### 5.3 Supplier Profiles

- [ ] **Build supplier profile page**
  - Display company overview
  - Show certification badges
  - Present product catalog

- [ ] **Create capability display**
  - Show MOQ and lead times
  - Display production capacity
  - List product types

- [ ] **Implement contact section**
  - Show contact button for paid users
  - Hide contact for free users
  - Display response metrics

### 5.4 Supplier Matching

- [ ] **Build matching algorithm**
  - Match based on design requirements
  - Consider fabric type needs
  - Factor in volume requirements

- [ ] **Create recommendations display**
  - Show top 5 matched suppliers
  - Display match score
  - Explain matching rationale

- [ ] **Implement favorites system**
  - Allow saving favorite suppliers
  - Create favorites list
  - Quick access from dashboard

---

## Phase 6: Messaging System (Weeks 21-22)

### 6.1 Conversation Management

- [ ] **Create conversation model**
  - Set up conversation structure
  - Link designers and suppliers
  - Track conversation status

- [ ] **Build inbox interface**
  - Display conversation list
  - Show unread indicators
  - Sort by recent activity

- [ ] **Implement conversation view**
  - Display message thread
  - Show participant info
  - Enable scrolling history

### 6.2 Messaging Features

- [ ] **Build message composer**
  - Create text input with formatting
  - Add file attachment support
  - Implement send functionality

- [ ] **Implement real-time updates**
  - Set up message polling or websockets
  - Update conversation in real-time
  - Show typing indicators (optional)

- [ ] **Create notification system**
  - Send email on new message
  - Create in-app notifications
  - Allow notification preferences

### 6.3 Inquiry Management (Supplier)

- [ ] **Build inquiry dashboard**
  - Display all inquiries
  - Show inquiry status
  - Filter by status

- [ ] **Implement status tracking**
  - Create status workflow
  - Allow status updates
  - Track status history

- [ ] **Add quick actions**
  - Quick reply templates (P1)
  - Mark as read/unread
  - Archive conversations

---

## Phase 7: Subscription & Billing (Weeks 23-26)

### 7.1 Stripe Integration

- [ ] **Set up Stripe account**
  - Configure Stripe API keys
  - Set up webhook endpoints
  - Configure Laravel Cashier

- [ ] **Create subscription plans in Stripe**
  - Set up Designer Basic plan
  - Set up Designer Premium plan
  - Set up Supplier plans

- [ ] **Implement webhook handlers**
  - Handle payment success
  - Handle payment failure
  - Handle subscription updates

### 7.2 Subscription Management

- [ ] **Build pricing page**
  - Display plan comparison
  - Show feature lists
  - Highlight recommended plan

- [ ] **Implement checkout flow**
  - Create payment form
  - Handle card input securely
  - Process subscription creation

- [ ] **Create subscription management UI**
  - Show current plan details
  - Display billing history
  - Allow plan changes

### 7.3 Free Trial

- [ ] **Implement trial system**
  - Start 14-day trial on signup
  - Track trial expiration
  - Send trial ending reminders

- [ ] **Create trial limitations**
  - Limit design uploads
  - Limit validations
  - Restrict supplier access

- [ ] **Build upgrade prompts**
  - Show upgrade CTA when limited
  - Display trial remaining time
  - Create compelling upgrade flow

### 7.4 Billing Features

- [ ] **Generate invoices**
  - Create invoice on payment
  - Store invoice records
  - Allow invoice download

- [ ] **Handle failed payments**
  - Retry failed charges
  - Send payment failure emails
  - Implement grace period

- [ ] **Implement cancellation**
  - Create cancellation flow
  - Collect cancellation reason
  - Handle end-of-period access

---

## Phase 8: Designer & Supplier Dashboards (Weeks 27-28)

### 8.1 Designer Dashboard

- [ ] **Build dashboard overview**
  - Show active designs count
  - Display validation summary
  - Present recent activity

- [ ] **Create design status widgets**
  - Show designs by status
  - Display pending validations
  - Highlight completed validations

- [ ] **Implement quick actions**
  - Upload new design button
  - View recent designs
  - Access supplier search

- [ ] **Add recommended actions**
  - Suggest next steps
  - Highlight incomplete tasks
  - Show optimization tips

### 8.2 Supplier Dashboard

- [ ] **Build inquiry overview**
  - Show new inquiries count
  - Display inquiry pipeline
  - Present response metrics

- [ ] **Create profile views widget**
  - Track profile views
  - Show view trends
  - Display viewer demographics

- [ ] **Implement performance metrics**
  - Calculate response rate
  - Track response time
  - Show conversion metrics

- [ ] **Add profile optimization tips**
  - Suggest profile improvements
  - Show completeness score
  - Recommend actions

---

## Phase 9: Admin Panel - Core (Weeks 29-32)

### 9.1 Admin Authentication

- [ ] **Create admin login page**
  - Build separate admin login
  - Implement admin auth check
  - Set up admin session management

- [ ] **Implement admin middleware**
  - Create admin role verification
  - Handle unauthorized access
  - Log admin access attempts

### 9.2 Admin Dashboard

- [ ] **Build metrics overview**
  - Display MRR and revenue
  - Show active user counts
  - Present signup trends

- [ ] **Create AI usage widgets**
  - Show API call counts
  - Display cost tracking
  - Monitor error rates

- [ ] **Implement quick stats**
  - New signups today/week
  - Pending verifications
  - Failed payments count

### 9.3 User Management

- [ ] **Build user directory**
  - List all users with pagination
  - Implement search by email/name
  - Add filter by role/status

- [ ] **Create user detail view**
  - Display user information
  - Show subscription status
  - Present activity history

- [ ] **Implement user actions**
  - Suspend/reactivate accounts
  - Edit user details
  - Delete user accounts

- [ ] **Build role management**
  - View user roles
  - Assign/remove roles
  - Track role changes

### 9.4 Supplier Verification

- [ ] **Create verification queue**
  - List pending verifications
  - Sort by submission date
  - Show verification details

- [ ] **Build document review**
  - Display uploaded certifications
  - Allow document viewing
  - Add verification notes

- [ ] **Implement approval workflow**
  - Approve with verification badge
  - Reject with feedback
  - Send notification emails

### 9.5 Audit Logging

- [ ] **Implement audit log system**
  - Log all admin actions
  - Store action details
  - Track acting admin

- [ ] **Build audit log viewer**
  - Display action history
  - Filter by admin/action type
  - Search audit logs

---

## Phase 10: Admin Panel - Billing & Support (Weeks 33-36)

### 10.1 Subscription Management

- [ ] **Build subscription overview**
  - List all subscriptions
  - Filter by plan/status
  - Search by user

- [ ] **Create subscription detail view**
  - Show subscription info
  - Display payment history
  - Present usage data

- [ ] **Implement payment management**
  - View failed payments
  - Retry failed charges
  - Issue refunds

### 10.2 Plan Configuration (P1)

- [ ] **Build plan management**
  - View existing plans
  - Edit plan features
  - Adjust pricing

- [ ] **Create discount codes**
  - Generate discount codes
  - Set discount parameters
  - Track code usage

### 10.3 Customer Support Tools

- [ ] **Build user lookup**
  - Quick search by email/ID
  - Display user summary
  - Quick action buttons

- [ ] **Create communication log**
  - Show emails sent to user
  - Display notification history
  - Track support interactions

### 10.4 Platform Announcements (P1)

- [ ] **Build announcement creator**
  - Create announcement content
  - Select target audience
  - Schedule announcements

- [ ] **Implement announcement display**
  - Show in user dashboard
  - Send email notifications
  - Track announcement views

---

## Phase 11: Admin Panel - Settings & Monitoring (Weeks 37-38)

### 11.1 Platform Settings (P1)

- [ ] **Build general settings**
  - Platform name and branding
  - Contact information
  - Default preferences

- [ ] **Create integration settings**
  - Instagram API configuration
  - OpenAI API settings
  - Stripe configuration

- [ ] **Implement email templates**
  - List email templates
  - Edit template content
  - Preview templates

### 11.2 System Monitoring (P1)

- [ ] **Build API health dashboard**
  - Monitor Instagram API status
  - Check Stripe connectivity
  - Track OpenAI availability

- [ ] **Create error log viewer**
  - Display application errors
  - Filter by severity
  - Search error messages

- [ ] **Implement queue monitoring**
  - Show queue status
  - Display job counts
  - Track failed jobs

### 11.3 Admin User Management

- [ ] **Build admin directory**
  - List admin users
  - Show admin roles
  - Display last activity

- [ ] **Create admin invitation**
  - Invite new admins
  - Assign admin role
  - Send invitation email

- [ ] **Implement permission management**
  - Define admin permissions
  - Assign permissions to roles
  - Restrict feature access

---

## Phase 12: Security Hardening (Weeks 39-42)

### 12.1 Backend Security Audit

- [ ] **Review authentication security**
  - Audit login and registration flows
  - Verify password reset security
  - Check token generation and validation

- [ ] **Audit authorization controls**
  - Review role-based access control
  - Verify resource ownership checks
  - Test privilege escalation prevention

- [ ] **Review API security**
  - Audit all API endpoints for auth
  - Verify rate limiting effectiveness
  - Check input validation coverage

- [ ] **Audit data protection**
  - Review sensitive data handling
  - Verify encryption at rest
  - Check data sanitization

- [ ] **Review file upload security**
  - Validate file type restrictions
  - Check file size limits
  - Verify malware scanning (if implemented)

- [ ] **Audit third-party integrations**
  - Review Instagram API security
  - Check Stripe webhook security
  - Verify OpenAI API key protection

### 12.2 Frontend Security Audit

- [ ] **Review client-side security**
  - Audit token handling
  - Check for exposed secrets
  - Review console logging

- [ ] **Audit form security**
  - Review all forms for validation
  - Check for injection vulnerabilities
  - Verify CSRF implementation

- [ ] **Review data exposure**
  - Check API responses for over-fetching
  - Audit local storage usage
  - Review error message exposure

- [ ] **Test authentication flows**
  - Verify session timeout handling
  - Test logout cleanup
  - Check remember me security

### 12.3 Infrastructure Security

- [ ] **Secure server configuration**
  - Harden web server settings
  - Configure firewall rules
  - Disable unnecessary services

- [ ] **Database security**
  - Review database user permissions
  - Verify connection encryption
  - Check backup encryption

- [ ] **Configure security headers**
  - Implement Strict-Transport-Security
  - Set X-Content-Type-Options
  - Configure X-Frame-Options
  - Set Referrer-Policy

- [ ] **Set up monitoring and alerts**
  - Configure failed login alerts
  - Set up suspicious activity detection
  - Implement rate limit breach alerts

### 12.4 Compliance & Privacy

- [ ] **GDPR compliance review**
  - Implement data export functionality
  - Create data deletion process
  - Review consent mechanisms

- [ ] **PIPEDA compliance review**
  - Verify privacy policy coverage
  - Check data collection disclosures
  - Review data retention policies

- [ ] **Implement audit logging**
  - Log security-relevant events
  - Store logs securely
  - Set up log retention policy

- [ ] **Create security documentation**
  - Document security measures
  - Create incident response plan
  - Write security guidelines for team

### 12.5 Penetration Testing

- [ ] **Conduct vulnerability scanning**
  - Run automated security scans
  - Review scan results
  - Prioritize findings

- [ ] **Test OWASP Top 10**
  - Test for injection attacks
  - Check broken authentication
  - Test for XSS vulnerabilities
  - Verify access control
  - Check security misconfigurations

- [ ] **Fix identified vulnerabilities**
  - Address critical findings
  - Fix high-priority issues
  - Document accepted risks

---

## Phase 13: Testing & Launch Preparation (Weeks 43-46)

### 13.1 Testing

- [ ] **Conduct unit testing**
  - Test critical backend functions
  - Test frontend components
  - Achieve target coverage

- [ ] **Perform integration testing**
  - Test API endpoints
  - Test third-party integrations
  - Verify data flow

- [ ] **Execute end-to-end testing**
  - Test complete user journeys
  - Verify all features work together
  - Test edge cases

- [ ] **Conduct security testing**
  - Test authentication flows
  - Check authorization rules
  - Scan for vulnerabilities

### 13.2 Beta Testing

- [ ] **Recruit beta testers**
  - Identify 20 designer testers
  - Identify 10 supplier testers
  - Onboard internal admin testers

- [ ] **Conduct beta program**
  - Provide beta access
  - Collect feedback
  - Track issues reported

- [ ] **Analyze beta feedback**
  - Categorize feedback
  - Prioritize fixes
  - Plan improvements

### 13.3 Bug Fixes & Optimization

- [ ] **Fix critical bugs**
  - Address blocking issues
  - Fix data integrity issues
  - Resolve security concerns

- [ ] **Fix high-priority bugs**
  - Address UX issues
  - Fix integration problems
  - Resolve performance issues

- [ ] **Optimize performance**
  - Optimize database queries
  - Implement caching
  - Reduce page load times

### 13.4 Launch Preparation

- [ ] **Prepare production environment**
  - Set up production server
  - Configure production database
  - Set up SSL certificates

- [ ] **Create launch checklist**
  - Verify all features working
  - Check all integrations
  - Test payment processing

- [ ] **Prepare support resources**
  - Create FAQ content
  - Write help documentation
  - Set up support channels

- [ ] **Plan launch communications**
  - Prepare launch announcement
  - Create onboarding emails
  - Set up analytics tracking

---

## Progress Tracking

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Foundation (incl. Security Foundation) | Complete | 100% |
| Phase 2: Designer Onboarding & Design Upload | Complete | 100% (2.1, 2.2, 2.3 all complete) |
| Phase 3: AI Integration & Design Analysis | Complete | 100% (3.1, 3.2, 3.3, 3.4 all complete) |
| Phase 4: Instagram Integration & Validation | **Complete** | **90%** (Core features done, optional enhancements pending) |
| Phase 5: Supplier Module | Not Started | 0% |
| Phase 6: Messaging System | Not Started | 0% |
| Phase 7: Subscription & Billing | Not Started | 0% |
| Phase 8: Designer & Supplier Dashboards | Not Started | 0% |
| Phase 9: Admin Panel - Core | Not Started | 0% |
| Phase 10: Admin Panel - Billing & Support | Not Started | 0% |
| Phase 11: Admin Panel - Settings & Monitoring | Not Started | 0% |
| Phase 12: Security Hardening | Not Started | 0% |
| Phase 13: Testing & Launch Preparation | Not Started | 0% |

---

## Phase 4 Summary

**Completed:**
- Instagram OAuth flow (backend service, controller, routes)
- Instagram connection UI (connect card, settings page integration)
- Mockup generation system (DALL-E 3, model/pose/background options)
- Validation creation wizard (5-step process)
- Engagement tracking jobs (hourly polling, score calculation)
- Validation pages (list, new, detail)
- Frontend API, hooks, and types

**Optional Enhancements (Not Implemented):**
- ValidationComparisonView - Compare multiple validations side-by-side
- ValidationMetricsChart - Line chart showing engagement over time
- Recommendation engine - Production recommendations based on scores
- PDF export - Validation report generation

**Files Created in Phase 4:**

Backend:
- `database/migrations/2026_01_12_140000_create_mockups_table.php`
- `database/migrations/2026_01_12_140001_add_mockup_and_campaign_fields_to_validations_table.php`
- `app/Models/Mockup.php`
- `app/Services/Instagram/InstagramService.php`
- `app/Services/AI/MockupGeneratorService.php`
- `app/Http/Controllers/Api/V1/InstagramAuthController.php`
- `app/Http/Controllers/Api/V1/MockupController.php`
- `app/Http/Controllers/Api/V1/ValidationController.php`
- `app/Http/Requests/MockupRequest.php`
- `app/Http/Requests/ValidationRequest.php`
- `app/Jobs/GenerateMockupJob.php`
- `app/Jobs/PostToInstagramJob.php`
- `app/Jobs/FetchInstagramInsightsJob.php`
- `app/Jobs/FinalizeValidationJob.php`
- `app/Jobs/RefreshInstagramTokenJob.php`

Frontend:
- `src/types/instagram.ts`
- `src/types/validation.ts`
- `src/lib/api/instagram.ts`
- `src/lib/api/mockups.ts`
- `src/lib/api/validations.ts`
- `src/lib/hooks/use-instagram.ts`
- `src/lib/hooks/use-mockups.ts`
- `src/lib/hooks/use-validations.ts`
- `src/components/instagram/instagram-connect-card.tsx`
- `src/components/validation/validation-status-badge.tsx`
- `src/components/validation/validation-score-display.tsx`
- `src/components/validation/validation-card.tsx`
- `src/components/validation/validation-empty-state.tsx`
- `src/components/validation/validation-create-wizard.tsx`
- `src/app/(dashboard)/settings/page.tsx`
- `src/app/(dashboard)/validations/page.tsx`
- `src/app/(dashboard)/validations/new/page.tsx`
- `src/app/(dashboard)/validations/[id]/page.tsx`

---

**Total Estimated Duration:** 46 weeks

**Last Updated:** January 12, 2026
