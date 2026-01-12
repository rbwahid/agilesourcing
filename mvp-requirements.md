# AgileSourcing MVP Requirements

## Document Overview

| Item | Details |
|------|---------|
| **Product** | AgileSourcing |
| **Version** | MVP 1.0 |
| **Target Launch** | Q1 2025 |
| **Primary Persona** | Independent Fashion Designer |
| **Secondary Persona** | Sustainable Supplier |

---

## Executive Summary

### MVP Vision

Build a minimum viable product that validates the core hypothesis: **Fashion designers will use AI-powered design generation and social media validation to reduce risk before committing to production.**

### MVP Scope

The MVP focuses on:
1. AI-powered design analysis and variation generation
2. Social media integration for design validation
3. Basic supplier marketplace for discovery
4. Core user flows for designers and suppliers

### Out of Scope for MVP

- Enterprise features (API integrations, team collaboration)
- Advanced analytics and reporting
- Payment processing between designers and suppliers
- Mobile application
- Multi-language support
- Pinterest and other social media platforms (planned for post-MVP expansion)

---

## Target Users for MVP

### Primary: Independent Fashion Designer (Sarah Chen)

| Attribute | MVP Focus |
|-----------|-----------|
| **Market Size** | 483 designers in Canada (initial), 26,541 in US (expansion) |
| **Key Pain Point** | "I spend months designing without knowing if it will sell" |
| **First Moment of Truth** | First AI-generated design variation |
| **Success Metric** | Designs validated before production |
| **Pricing Tier** | Basic: $40/month |

### Secondary: Sustainable Fabric Supplier (Rajesh Sharma)

| Attribute | MVP Focus |
|-----------|-----------|
| **Market Size** | ~200 Canadian sustainable suppliers (initial) |
| **Key Pain Point** | "Western brands don't know we exist" |
| **First Moment of Truth** | First qualified lead received |
| **Success Metric** | Leads generated through platform |
| **Pricing Tier** | Supplier Basic: $150/month |

---

## Core Value Propositions for MVP

| # | Value Proposition | Persona | Priority |
|---|-------------------|---------|----------|
| 1 | AI-generated design variations based on trend data | Designer | P0 |
| 2 | Social media validation before production | Designer | P0 |
| 3 | Access to verified sustainable suppliers | Designer | P1 |
| 4 | Visibility to North American fashion brands | Supplier | P1 |
| 5 | Lead generation through intelligent matching | Supplier | P2 |

---

## Functional Requirements

### Module 1: User Authentication & Onboarding

#### 1.1 Registration & Authentication

| ID | Requirement | Priority | Persona |
|----|-------------|----------|---------|
| AUTH-01 | User registration with email/password | P0 | All |
| AUTH-02 | Social login (Google, LinkedIn) | P1 | All |
| AUTH-03 | Email verification | P0 | All |
| AUTH-04 | Password reset functionality | P0 | All |
| AUTH-05 | Role-based access (Designer, Boutique, Supplier) | P0 | All |

#### 1.2 Designer Onboarding Flow

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ONB-D01 | Profile creation wizard (business name, location, style focus) | P0 | As a designer, I want to set up my profile so the system understands my brand |
| ONB-D02 | Connect Instagram account | P0 | As a designer, I want to connect my Instagram for validation |
| ONB-D03 | Define target customer demographics | P1 | As a designer, I want to specify my target market for better recommendations |
| ONB-D04 | Tutorial walkthrough for first design upload | P0 | As a designer, I want guidance on how to use the platform |
| ONB-D05 | Sample design analysis demo | P1 | As a designer, I want to see the AI in action before uploading my own work |

**Acceptance Criteria:**
- Onboarding completion rate > 80%
- Time to complete onboarding < 10 minutes
- User can skip non-essential steps

#### 1.3 Supplier Onboarding Flow

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ONB-S01 | Company profile creation (name, location, capacity) | P0 | As a supplier, I want to create a professional profile |
| ONB-S02 | Certification upload (GOTS, OEKO-TEX, Fair Trade) | P0 | As a supplier, I want to showcase my certifications |
| ONB-S03 | Product catalog setup | P1 | As a supplier, I want to display my fabric/manufacturing capabilities |
| ONB-S04 | Production capability definition (MOQ, lead times) | P0 | As a supplier, I want brands to know my production terms |
| ONB-S05 | Verification submission and status tracking | P0 | As a supplier, I want to get verified to build trust |

**Acceptance Criteria:**
- Profile completion rate > 90%
- Verification process < 5 business days
- All required certifications uploaded

---

### Module 2: AI Design Generation & Analysis

#### 2.1 Design Upload

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| DES-01 | Upload design sketch/image (JPG, PNG, PDF) | P0 | As a designer, I want to upload my initial design concept |
| DES-02 | Support for multiple file formats | P1 | As a designer, I want flexibility in file types |
| DES-03 | Design metadata input (category, season, target demographic) | P0 | As a designer, I want to provide context for better analysis |
| DES-04 | Design history and version management | P1 | As a designer, I want to track my design iterations |
| DES-05 | Bulk upload capability (up to 10 designs) | P2 | As a designer, I want to analyze multiple designs at once |

**Acceptance Criteria:**
- File upload < 30 seconds for files up to 10MB
- Supported formats: JPG, PNG, PDF, AI, PSD
- Maximum file size: 25MB

#### 2.2 AI Analysis Engine

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| AI-01 | Analyze uploaded design against current trend data | P0 | As a designer, I want to know how my design aligns with trends |
| AI-02 | Generate 3 design variations based on analysis | P0 | As a designer, I want AI-suggested improvements |
| AI-03 | Trend scoring (1-100) for each design | P0 | As a designer, I want a quantified trend alignment score |
| AI-04 | Style element breakdown (colors, patterns, silhouettes) | P1 | As a designer, I want to understand what elements are trending |
| AI-05 | Seasonal relevance indicator | P1 | As a designer, I want to know if my design fits the upcoming season |

**Acceptance Criteria:**
- Analysis completion < 60 seconds
- 3 distinct variations generated per upload
- Trend score based on real-time social media data

#### 2.3 Social Media Data Integration

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| SM-01 | Instagram trend data aggregation | P0 | As a designer, I want insights from Instagram fashion trends |
| SM-02 | Pinterest trend data aggregation | P2 (Post-MVP) | As a designer, I want insights from Pinterest boards |
| SM-03 | Hashtag analysis for fashion categories | P1 | As a designer, I want to see trending hashtags in my category |
| SM-04 | Engagement metrics collection (likes, shares, saves) | P1 | As a designer, I want to understand what drives engagement |
| SM-05 | Influencer style tracking | P2 | As a designer, I want to know what influencers are wearing |

**Acceptance Criteria:**
- Data refresh frequency: Daily
- Minimum 30-day trend history
- Geographic filtering (North America focus for MVP)

---

### Module 3: Design Validation

#### 3.1 Social Media Posting

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| VAL-01 | Generate social media post from design mock-up | P0 | As a designer, I want to create posts to test my designs |
| VAL-02 | Apply design to 2D virtual model | P0 | As a designer, I want to see my design on a model |
| VAL-03 | Post directly to connected Instagram account | P0 | As a designer, I want to share directly to my followers |
| VAL-04 | Post directly to connected Pinterest account | P2 (Post-MVP) | As a designer, I want to share to Pinterest for feedback |
| VAL-05 | Schedule posts for optimal engagement times | P2 | As a designer, I want to post at the best times |

**Acceptance Criteria:**
- Virtual model rendering < 30 seconds
- One-click posting to connected accounts
- Preview before posting

#### 3.2 Engagement Tracking

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ENG-01 | Track likes on validation posts | P0 | As a designer, I want to see how many likes my design gets |
| ENG-02 | Track comments on validation posts | P0 | As a designer, I want to read feedback from my audience |
| ENG-03 | Track shares/saves on validation posts | P0 | As a designer, I want to see purchase intent signals |
| ENG-04 | Calculate engagement rate vs. account average | P1 | As a designer, I want to compare performance to my baseline |
| ENG-05 | Sentiment analysis on comments | P2 | As a designer, I want to understand the tone of feedback |

**Acceptance Criteria:**
- Real-time engagement updates (< 5 min delay)
- Historical comparison available
- Engagement dashboard per design

#### 3.3 Validation Results

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| RES-01 | Validation score based on engagement metrics | P0 | As a designer, I want a clear score for each design |
| RES-02 | Comparison between design variations | P0 | As a designer, I want to see which variation performed best |
| RES-03 | Recommendation on which design to produce | P1 | As a designer, I want AI guidance on the best choice |
| RES-04 | Export validation report (PDF) | P2 | As a designer, I want to share results with stakeholders |
| RES-05 | Historical validation performance tracking | P2 | As a designer, I want to track my validation accuracy over time |

**Acceptance Criteria:**
- Validation period: 48-72 hours
- Clear winning design indication
- Actionable next steps provided

---

### Module 4: Supplier Marketplace

#### 4.1 Supplier Directory

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| SUP-01 | Searchable supplier directory | P0 | As a designer, I want to find suppliers that match my needs |
| SUP-02 | Filter by certification type | P0 | As a designer, I want to find certified sustainable suppliers |
| SUP-03 | Filter by location/region | P0 | As a designer, I want to find suppliers in specific regions |
| SUP-04 | Filter by product type (fabric, CMT, full production) | P0 | As a designer, I want suppliers that offer what I need |
| SUP-05 | Filter by MOQ range | P1 | As a designer, I want suppliers that accept my order sizes |
| SUP-06 | Sort by relevance, rating, response time | P1 | As a designer, I want to prioritize quality suppliers |

**Acceptance Criteria:**
- Search results < 2 seconds
- Minimum 50 verified suppliers at launch
- All filters combinable

#### 4.2 Supplier Profiles

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| PRO-01 | Company overview and description | P0 | As a supplier, I want to tell my story |
| PRO-02 | Certification badges display | P0 | As a supplier, I want to showcase my credentials |
| PRO-03 | Product/service catalog with images | P0 | As a supplier, I want to display my offerings |
| PRO-04 | Production capabilities (MOQ, lead time, capacity) | P0 | As a supplier, I want to set expectations |
| PRO-05 | Customer reviews and ratings | P2 | As a supplier, I want to build trust through reviews |
| PRO-06 | Response rate and time metrics | P2 | As a designer, I want to know how responsive suppliers are |

**Acceptance Criteria:**
- Profile completeness indicator
- Verification badge for verified suppliers
- Contact information visible to paid users only

#### 4.3 Supplier Matching

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| MAT-01 | AI-recommended suppliers based on validated design | P1 | As a designer, I want supplier suggestions for my design |
| MAT-02 | Match based on fabric type requirements | P1 | As a designer, I want suppliers with the right materials |
| MAT-03 | Match based on production volume needs | P1 | As a designer, I want suppliers who can handle my volume |
| MAT-04 | Match based on sustainability requirements | P1 | As a designer, I want suppliers who meet my ethics standards |
| MAT-05 | Save favorite suppliers | P0 | As a designer, I want to bookmark suppliers I like |

**Acceptance Criteria:**
- Top 5 recommended suppliers per design
- Match score explanation provided
- One-click to view supplier profile

---

### Module 5: Communication

#### 5.1 Messaging System

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| MSG-01 | Direct messaging between designers and suppliers | P0 | As a designer, I want to contact suppliers directly |
| MSG-02 | Attach files to messages (designs, specs) | P0 | As a designer, I want to share my requirements |
| MSG-03 | Message notifications (in-app and email) | P0 | As a supplier, I want to know when I receive inquiries |
| MSG-04 | Conversation history | P0 | As a user, I want to reference past conversations |
| MSG-05 | Read receipts | P2 | As a designer, I want to know if my message was read |

**Acceptance Criteria:**
- Real-time message delivery
- File attachments up to 10MB
- Email notification within 5 minutes

#### 5.2 Inquiry Management (Supplier)

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| INQ-01 | Inquiry dashboard for suppliers | P0 | As a supplier, I want to see all my inquiries in one place |
| INQ-02 | Inquiry status tracking (new, in progress, quoted, closed) | P1 | As a supplier, I want to manage my sales pipeline |
| INQ-03 | Quick response templates | P2 | As a supplier, I want to respond efficiently |
| INQ-04 | Lead quality scoring | P2 | As a supplier, I want to prioritize high-quality leads |

**Acceptance Criteria:**
- All inquiries visible in dashboard
- Status updates in real-time
- Filter by status and date

---

### Module 6: Dashboard & Analytics

#### 6.1 Designer Dashboard

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| DAS-D01 | Overview of active designs and their status | P0 | As a designer, I want to see all my projects at a glance |
| DAS-D02 | Validation results summary | P0 | As a designer, I want to see how my designs performed |
| DAS-D03 | Recommended actions (next steps) | P1 | As a designer, I want guidance on what to do next |
| DAS-D04 | Supplier shortlist | P1 | As a designer, I want quick access to my saved suppliers |
| DAS-D05 | Trend alerts for my categories | P2 | As a designer, I want to stay informed of trend changes |

**Acceptance Criteria:**
- Dashboard load time < 3 seconds
- Real-time data updates
- Mobile-responsive design

#### 6.2 Supplier Dashboard

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| DAS-S01 | Overview of profile views and inquiries | P0 | As a supplier, I want to see my visibility metrics |
| DAS-S02 | Inquiry pipeline summary | P0 | As a supplier, I want to track my leads |
| DAS-S03 | Profile completion status | P0 | As a supplier, I want to know how to improve my profile |
| DAS-S04 | Response time metrics | P1 | As a supplier, I want to track my responsiveness |
| DAS-S05 | Competitor benchmarking (anonymous) | P2 | As a supplier, I want to know how I compare |

**Acceptance Criteria:**
- Key metrics visible above fold
- Weekly email summary option
- Actionable insights highlighted

---

### Module 7: Subscription & Billing

#### 7.1 Subscription Management

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| SUB-01 | Free trial (14 days) for designers | P0 | As a designer, I want to try before I buy |
| SUB-02 | Monthly subscription plans | P0 | As a user, I want flexible payment options |
| SUB-03 | Annual subscription with discount | P1 | As a user, I want savings for commitment |
| SUB-04 | Plan upgrade/downgrade | P1 | As a user, I want to change my plan as needed |
| SUB-05 | Subscription cancellation | P0 | As a user, I want to cancel if needed |

#### 7.2 Pricing Tiers (MVP)

**Designer Plans:**

| Plan | Price | Features |
|------|-------|----------|
| **Free Trial** | $0 (14 days) | 3 design uploads, 1 validation, limited supplier access |
| **Basic** | $40/month | 10 design uploads, 5 validations, full supplier directory |
| **Premium** | $100/month | Unlimited uploads, unlimited validations, priority supplier matching |

**Supplier Plans:**

| Plan | Price | Features |
|------|-------|----------|
| **Basic** | $150/month | Company profile, certification display, inquiry management |
| **Premium** | $225/month | Featured listing, priority in search, analytics dashboard |

#### 7.3 Payment Processing

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| PAY-01 | Credit card payment via Stripe | P0 | As a user, I want to pay securely with my card |
| PAY-02 | Invoice generation | P0 | As a user, I want receipts for my records |
| PAY-03 | Payment history | P1 | As a user, I want to see my payment history |
| PAY-04 | Failed payment handling and retry | P0 | As a user, I want to fix payment issues easily |

**Acceptance Criteria:**
- PCI-compliant payment processing
- Automatic subscription renewal
- 7-day grace period for failed payments

---

### Module 8: Admin Panel

#### 8.1 Admin Dashboard

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ADM-01 | Overview dashboard with key metrics (MRR, active users, signups, churn) | P0 | As an admin, I want to see platform health at a glance |
| ADM-02 | User growth and conversion charts | P1 | As an admin, I want to track growth trends |
| ADM-03 | Revenue analytics (MRR, ARR, revenue by plan) | P1 | As an admin, I want to monitor business performance |
| ADM-04 | Platform activity metrics (designs, validations, messages) | P1 | As an admin, I want to understand platform usage |
| ADM-05 | AI usage statistics (API calls, costs, error rates) | P0 | As an admin, I want to monitor AI costs and performance |

**Acceptance Criteria:**
- Dashboard loads within 3 seconds
- Real-time or near real-time data (< 5 min delay)
- Exportable reports (CSV/PDF)

#### 8.2 User Management

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ADM-06 | User directory with search, filter, sort | P0 | As an admin, I want to find any user quickly |
| ADM-07 | View and edit user profiles | P0 | As an admin, I want to help users with account issues |
| ADM-08 | Account actions (suspend, reactivate, delete) | P0 | As an admin, I want to manage problematic accounts |
| ADM-09 | User activity logs and login history | P1 | As an admin, I want to investigate user issues |
| ADM-10 | Role assignment (Designer, Supplier, Admin) | P0 | As an admin, I want to manage user permissions |

**Acceptance Criteria:**
- Search returns results within 2 seconds
- All actions logged in audit trail
- Confirmation required for destructive actions

#### 8.3 Supplier Verification

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ADM-11 | Supplier verification queue | P0 | As an admin, I want to review pending supplier applications |
| ADM-12 | Certification document review | P0 | As an admin, I want to verify supplier certifications |
| ADM-13 | Approve/reject suppliers with feedback | P0 | As an admin, I want to control platform quality |
| ADM-14 | Mark suppliers as featured/premium | P1 | As an admin, I want to highlight quality suppliers |
| ADM-15 | Supplier performance tracking | P1 | As an admin, I want to monitor supplier engagement |

**Acceptance Criteria:**
- Queue shows pending items with submission date
- Document viewer for certifications
- Email notification sent on approval/rejection

#### 8.4 Subscription & Billing Management

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ADM-16 | View all active subscriptions | P0 | As an admin, I want to see subscription status |
| ADM-17 | Plan and pricing configuration | P1 | As an admin, I want to adjust pricing and plans |
| ADM-18 | Payment history and transactions | P0 | As an admin, I want to investigate billing issues |
| ADM-19 | Failed payments dashboard | P0 | As an admin, I want to monitor payment failures |
| ADM-20 | Create and manage discount codes | P1 | As an admin, I want to run promotions |
| ADM-21 | Issue refunds | P1 | As an admin, I want to handle refund requests |

**Acceptance Criteria:**
- Synced with Stripe dashboard
- Refunds require confirmation and reason
- Revenue reports exportable

#### 8.5 Customer Support Tools

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ADM-22 | Quick user lookup by email/name/ID | P0 | As support, I want to find users instantly |
| ADM-23 | View communication history (emails sent) | P1 | As support, I want to see what emails a user received |
| ADM-24 | Send platform announcements | P1 | As an admin, I want to notify users of updates |
| ADM-25 | Manage FAQ/help articles | P1 | As an admin, I want to update self-service content |

**Acceptance Criteria:**
- Lookup returns results in < 1 second
- Announcements can target all users or specific segments
- Help articles editable with rich text

#### 8.6 Platform Settings

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ADM-26 | General settings (platform name, contact info) | P1 | As an admin, I want to configure basic platform info |
| ADM-27 | Instagram API credentials management | P1 | As an admin, I want to manage social integrations |
| ADM-28 | Email template customization | P1 | As an admin, I want to customize transactional emails |
| ADM-29 | AI rate limits per plan tier | P1 | As an admin, I want to control AI usage by plan |

**Acceptance Criteria:**
- Settings changes take effect immediately
- Email templates support variables
- API credential changes require confirmation

#### 8.7 System & Security

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| ADM-30 | Admin user management and permissions | P0 | As a super admin, I want to manage admin access |
| ADM-31 | Audit logs for all admin actions | P0 | As an admin, I want accountability for changes |
| ADM-32 | External API health monitoring (Instagram, Stripe, OpenAI) | P1 | As an admin, I want to know if integrations are down |
| ADM-33 | Application error logs viewer | P1 | As an admin, I want to investigate technical issues |
| ADM-34 | Queue and scheduled jobs monitor | P1 | As an admin, I want to ensure background jobs are running |

**Acceptance Criteria:**
- Audit logs retained for 1 year minimum
- API health checks run every 5 minutes
- Error logs searchable and filterable

#### 8.8 Admin Roles

| Role | Access Level |
|------|--------------|
| **Super Admin** | Full access to all features including admin management |
| **Admin** | Full access except admin user management and system settings |
| **Support** | User lookup, account actions, communication history (no billing) |
| **Finance** | Billing, subscriptions, revenue reports only |

---

## Non-Functional Requirements

### Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PERF-01 | Page load time | < 3 seconds |
| PERF-02 | AI analysis completion | < 60 seconds |
| PERF-03 | Search results | < 2 seconds |
| PERF-04 | File upload (10MB) | < 30 seconds |
| PERF-05 | Concurrent users supported | 500 |

### Security

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-01 | HTTPS encryption for all traffic | P0 |
| SEC-02 | Secure password hashing (bcrypt) | P0 |
| SEC-03 | OAuth 2.0 via Laravel Socialite for Instagram integration | P0 |
| SEC-04 | GDPR compliance for user data | P0 |
| SEC-05 | PIPEDA compliance (Canada) | P0 |
| SEC-06 | Regular security audits | P1 |
| SEC-07 | Two-factor authentication | P2 |

### Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| SCAL-01 | Horizontal scaling capability | Add servers as needed (post-MVP) |
| SCAL-02 | Database performance | Support 10K users (MVP), migrate to read replicas if needed |
| SCAL-03 | File storage | Local filesystem (MVP); migrate to S3 when needed |
| SCAL-04 | API rate limiting | Laravel throttle middleware, 1000 requests/min per user |

### Availability

| ID | Requirement | Target |
|----|-------------|--------|
| AVAIL-01 | Uptime SLA | 99.5% |
| AVAIL-02 | Scheduled maintenance window | Sunday 2-4 AM EST |
| AVAIL-03 | Disaster recovery | RPO: 1 hour, RTO: 4 hours |
| AVAIL-04 | Backup frequency | Daily automated backups |

### Usability

| ID | Requirement | Target |
|----|-------------|--------|
| UX-01 | Onboarding completion rate | > 80% |
| UX-02 | Time to first value | < 7 days |
| UX-03 | Mobile responsiveness | All core features |
| UX-04 | Accessibility | WCAG 2.1 Level AA |
| UX-05 | Browser support | Chrome, Safari, Firefox, Edge (latest 2 versions) |

---

## Technical Architecture (MVP)

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Backend Framework** | Laravel 12 | Mature ecosystem, queues, jobs, excellent for AI workloads |
| **Backend Language** | PHP 8.3+ | Modern PHP with strong typing, attributes, performance |
| **Frontend Framework** | Next.js 14+ (App Router) | SSR/SSG, React Server Components, optimal UX |
| **Frontend Language** | TypeScript | Type safety, better developer experience |
| **UI Framework** | Tailwind CSS + shadcn/ui | Rapid development, accessible components, responsive |
| **Database** | MySQL 8.0+ | Reliable, well-supported, familiar tooling |
| **ORM** | Eloquent (Laravel) | Expressive syntax, relationships, migrations |
| **Authentication** | Laravel Sanctum | API token authentication, SPA support |
| **Cache & Queues** | Redis | Session management, job queues, caching |
| **File Storage** | Local Filesystem | Simple for MVP; can migrate to S3 later |
| **AI/ML** | OpenAI API | Design analysis, variation generation |
| **Search** | MySQL Full-Text Search | Simpler for MVP; can migrate to Elasticsearch if needed |
| **Payments** | Stripe | Industry standard, Laravel Cashier integration |
| **Backend Hosting** | Traditional Server (Apache/Nginx) | Full control, no serverless limitations |
| **Frontend Hosting** | Traditional Server (Node.js) | Self-hosted Next.js with PM2 or similar |
| **Monitoring** | Laravel Telescope + Sentry | Error tracking, request debugging |

#### Why Laravel + Next.js for MVP

- **Independent Scaling**: Backend and frontend can scale separately based on load
- **Long-Running Processes**: Laravel queues handle AI tasks without timeout issues
- **Mature Backend Ecosystem**: Built-in queues, jobs, scheduling, caching, notifications
- **AI-Ready Architecture**: Background jobs can run OpenAI calls for extended periods
- **Team Flexibility**: Can hire PHP developers for backend, React developers for frontend
- **Battle-Tested Patterns**: Laravel has 10+ years of enterprise-grade patterns
- **Future-Proof**: Easy to add microservices, scale horizontally when needed

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                   Next.js 14+ (App Router)                       │
│                    Self-hosted with PM2                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      APP ROUTER                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │ │
│  │  │  Designer   │  │  Supplier   │  │   Admin     │         │ │
│  │  │   Pages     │  │   Pages     │  │   Pages     │         │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   API CLIENT LAYER                           │ │
│  │        Axios/Fetch → Laravel API (api.domain.com)           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST API (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                  Laravel 12 (PHP 8.3+)                          │
│                 Apache/Nginx + PHP-FPM                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    API ROUTES                                │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │
│  │  │   Auth   │ │  Design  │ │ Supplier │ │ Billing  │       │ │
│  │  │Controller│ │Controller│ │Controller│ │Controller│       │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   SERVICE LAYER                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │   AI/ML      │  │   Matching   │  │   Messaging  │      │ │
│  │  │   Service    │  │   Engine     │  │   Service    │      │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   QUEUE WORKERS                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │ │
│  │  │  AI Design   │  │    Image     │  │    Email     │      │ │
│  │  │  Analysis    │  │  Processing  │  │Notifications │      │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     MySQL       │  │     Redis       │  │  Local Storage  │
│     8.0+        │  │  (Cache/Queue)  │  │  (storage/app)  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Instagram   │  │   Stripe     │  │   OpenAI     │          │
│  │   Graph API  │  │     API      │  │     API      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │    SMTP      │  │  Pinterest   │                             │
│  │   (Email)    │  │ (Post-MVP)   │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Architecture Decisions

- **Separated Concerns**: Frontend and backend are independent applications
- **Queue-Based AI Processing**: Long-running AI tasks handled by Laravel queue workers
- **Local File Storage**: Designs stored in `storage/app/public` with symlink to `public/storage`
- **Redis for Queues**: Laravel Horizon manages queue workers for reliable job processing
- **API-First Backend**: RESTful JSON API with Laravel Sanctum for authentication
- **Self-Hosted**: Full control over infrastructure, no vendor lock-in

### Project File Structure

#### Backend: Laravel 12 (`backend/`)

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

#### Frontend: Next.js 14 (`frontend/`)

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

### Database Schema (Core Entities)

The database schema will evolve during development. Below are the core entities to be implemented via Laravel migrations as features are built:

| Entity | Purpose | Key Relationships |
|--------|---------|-------------------|
| **Users** | Authentication, account management | Has one Profile |
| **Profiles** | Designer or Supplier profile details | Belongs to User |
| **Designs** | Uploaded design images and metadata | Belongs to User, Has many Variations |
| **Design Variations** | AI-generated design alternatives | Belongs to Design |
| **Validations** | Social media validation results | Belongs to Design |
| **Suppliers** | Supplier-specific data (MOQ, certifications) | Belongs to Profile |
| **Messages** | Direct messaging between users | Belongs to Conversation |
| **Conversations** | Message threads | Has many Messages |
| **Subscriptions** | Billing and plan management | Belongs to User |

> **Note:** Exact columns and additional tables will be defined in migrations as each feature is implemented. This allows the schema to evolve based on actual requirements discovered during development.

---

## MVP Success Metrics

### Primary KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Designer Signups** | 100 in first 3 months | Registration count |
| **Trial to Paid Conversion** | 25% | Paid / Trial users |
| **Monthly Active Users** | 80% of paid users | Login in last 30 days |
| **Designs Validated** | 500 in first 3 months | Validation completions |
| **Supplier Signups** | 50 verified suppliers | Completed profiles |
| **Designer-Supplier Connections** | 100 inquiries | Messages initiated |

### Secondary KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to First Value** | < 7 days | First validation completed |
| **Onboarding Completion** | > 80% | Profile completion rate |
| **NPS Score** | > 40 | Quarterly survey |
| **Churn Rate** | < 10% monthly | Cancellation rate |
| **Average Revenue Per User** | $60/month | MRR / Active users |

### Validation Metrics (Hypothesis Testing)

| Hypothesis | Metric | Success Criteria |
|------------|--------|------------------|
| AI variations are useful | Variation selection rate | > 50% select AI variation over original |
| Social validation works | Validation accuracy | > 70% of top-validated designs succeed in market |
| Supplier matching adds value | Match-to-inquiry rate | > 30% of matched suppliers receive inquiry |

---

## MVP Development Phases

### Phase 1: Foundation (Weeks 1-4)

| Deliverable | Description |
|-------------|-------------|
| Laravel API setup | Project scaffolding, MySQL database, Redis, Sanctum auth |
| Next.js frontend setup | Project scaffolding, Tailwind CSS, shadcn/ui, API client |
| Authentication system | User registration, login, roles, Laravel Sanctum tokens |
| Database schema | Core entity migrations (users, profiles, designs, suppliers) |
| Basic UI framework | Design system, layouts, reusable components |

### Phase 2: Core Features (Weeks 5-10)

| Deliverable | Description |
|-------------|-------------|
| Design upload & storage | File handling, local storage with Laravel filesystem |
| AI analysis engine | OpenAI integration, Laravel queues for async processing |
| Social media integration | Instagram OAuth via Laravel Socialite, posting |
| Engagement tracking | Metrics collection via scheduled jobs, dashboard |

### Phase 3: Marketplace (Weeks 11-14)

| Deliverable | Description |
|-------------|-------------|
| Supplier profiles | Profile creation, verification |
| Supplier directory | Search, filters, matching |
| Messaging system | Direct communication |
| Inquiry management | Supplier dashboard |

### Phase 4: Monetization & Admin (Weeks 15-20)

| Deliverable | Description |
|-------------|-------------|
| Subscription system | Stripe integration, plans, Laravel Cashier |
| Designer dashboard | Analytics, recommendations |
| Supplier dashboard | Lead tracking, metrics |
| Onboarding flows | Tutorials, guided setup |
| Admin panel (P0) | Dashboard, user management, supplier verification |
| Admin panel (P0) | Subscription overview, AI usage monitoring, audit logs |

### Phase 5: Admin Enhancement & Polish (Weeks 21-24)

| Deliverable | Description |
|-------------|-------------|
| Admin panel (P1) | Analytics, plan configuration, discount codes |
| Admin panel (P1) | Support tools, announcements, email templates |
| Admin panel (P1) | API health monitoring, error logs |
| Platform polish | UI refinements, performance optimization |

### Phase 6: Testing & Launch (Weeks 25-26)

| Deliverable | Description |
|-------------|-------------|
| Beta testing | 20 designers, 10 suppliers, internal admin testing |
| Bug fixes | Critical and high priority |
| Performance optimization | Load testing, optimization |
| Launch preparation | Marketing, support setup |

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI generation quality inconsistent | Medium | High | Use established APIs, human review fallback |
| Social media API changes | Medium | High | Abstract integrations, monitor API updates |
| Scalability issues | Low | High | Traditional server scaling, load testing, migrate to cloud when needed |
| Data security breach | Low | Critical | Security audit, encryption, compliance |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low designer adoption | Medium | High | Focus on clear value prop, free trial |
| Insufficient supplier inventory | Medium | High | Pre-launch supplier recruitment |
| Competition from established players | Medium | Medium | Differentiate on AI + sustainability |
| Regulatory compliance issues | Low | High | Legal review, PIPEDA/GDPR compliance |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supplier verification bottleneck | High | Medium | Streamlined process, clear requirements |
| Customer support overwhelm | Medium | Medium | Self-service resources, FAQ |
| Third-party service outages | Low | Medium | Redundancy, graceful degradation |

---

## Appendix

### A. User Stories by Priority

#### P0 - Must Have (MVP Launch Blockers)

**Designer & Supplier**
1. As a designer, I can create an account and complete onboarding
2. As a designer, I can upload a design and receive AI variations
3. As a designer, I can post designs to social media for validation
4. As a designer, I can view engagement results and validation scores
5. As a designer, I can search and view supplier profiles
6. As a designer, I can message suppliers directly
7. As a supplier, I can create and verify my company profile
8. As a supplier, I can receive and respond to inquiries
9. As a user, I can subscribe and pay for the service
10. As a user, I can manage my account settings

**Admin**
11. As an admin, I can view platform metrics and KPIs on a dashboard
12. As an admin, I can search, view, and manage user accounts
13. As an admin, I can review and approve/reject supplier verifications
14. As an admin, I can view subscriptions and payment history
15. As an admin, I can monitor AI usage and costs
16. As a super admin, I can manage admin users and permissions
17. As an admin, I can view audit logs of admin actions

#### P1 - Should Have (MVP Enhancement)

**Designer & Supplier**
18. As a designer, I can connect my Instagram account
19. As a designer, I can filter suppliers by certification and location
20. As a designer, I can see AI-recommended suppliers for my design
21. As a supplier, I can track my profile views and inquiry metrics
22. As a user, I can receive email notifications
23. As a designer, I can export validation reports

**Admin**
24. As an admin, I can view user growth and revenue analytics
25. As an admin, I can configure subscription plans and pricing
26. As an admin, I can create and manage discount codes
27. As an admin, I can issue refunds for subscriptions
28. As an admin, I can send platform announcements to users
29. As an admin, I can customize email templates
30. As an admin, I can monitor external API health status
31. As an admin, I can view application error logs

#### P2 - Nice to Have (Post-MVP)

32. As a designer, I can schedule social media posts
33. As a designer, I can see sentiment analysis on comments
34. As a supplier, I can use quick response templates
35. As a user, I can enable two-factor authentication
36. As an admin, I can impersonate users for support
37. As an admin, I can manage feature flags for rollouts

### B. Glossary

| Term | Definition |
|------|------------|
| **CMT** | Cut-Make-Trim - Manufacturing service that cuts fabric, makes garments, and adds trim |
| **GOTS** | Global Organic Textile Standard - Certification for organic fibers |
| **MOQ** | Minimum Order Quantity - Smallest order a supplier will accept |
| **OEKO-TEX** | Certification for textiles tested for harmful substances |
| **PLM** | Product Lifecycle Management - Software for managing product development |
| **RFQ** | Request for Quote - Formal request for supplier pricing |
| **Validation** | Process of testing design appeal through social media engagement |

### C. Related Documents

- [User Personas](./user-persona.md)
- [User Journey Maps](./user-journey.md)
- [Business Plan](./business-plan.pdf)

---

*Document Version: 1.0*
*Last Updated: January 2024*
*Author: AgileSourcing Product Team*
