# Exentax — Complete Platform Documentation

## Overview

**Exentax** is a full-stack SaaS platform designed to simplify US LLC formation for international entrepreneurs, particularly Spanish-speaking clients. It provides end-to-end services including business formation in New Mexico, Wyoming, and Delaware, annual maintenance, banking assistance, compliance tracking, and multilingual professional support.

The platform is built with:
- **Frontend:** React 18 with Vite, Tailwind CSS, shadcn/ui components, Wouter routing, TanStack React Query, and i18n support (7 languages: ES, EN, CA, FR, DE, IT, PT)
- **Backend:** Express.js with TypeScript, custom session-based + JWT token authentication, Google OAuth integration
- **Database:** PostgreSQL with Drizzle ORM
- **File Storage:** Replit Object Storage for documents
- **Email:** Gmail API integration via Replit google-mail connector
- **Calendar:** Google Calendar API integration via Replit google-calendar connector
- **Deployment:** Autoscale on Replit

The platform is production-ready, featuring a comprehensive admin panel, secure document handling, automated compliance calendar, and advanced self-healing error recovery.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with Vite bundler for optimal performance
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** TanStack React Query v5 for server state with auto-retry logic, TanStack React Query with QueryClient for data fetching with 3x query retries and 2x mutation retries (exponential backoff)
- **UI Components:** shadcn/ui with Radix UI primitives, custom styled with Tailwind CSS
- **Styling:** Tailwind CSS with utility-first approach, supports Light/Dark/Forest theme modes
- **Internationalization:** react-i18next with 7 language support (Spanish primary, English secondary, Catalan, French, German, Italian, Portuguese)
- **Validation:** Zod schemas with react-hook-form integration
- **Component Organization:**
  - `ui/` - Base shadcn UI components
  - `layout/` - Navigation, hero sections, footers
  - `forms/` - Form input wrappers (form-input, form-select, etc.)
  - `auth/` - Authentication components (social login)
  - `dashboard/` - Dashboard panels and shared components
  - `legal/` - Legal page layouts
- **Custom Hooks:**
  - `use-auth` - Authentication state and login/logout
  - `use-form-draft` - Persistent form draft saving
  - `use-mobile` - Mobile responsiveness detection
  - `use-page-title` - Dynamic page title management with i18n
  - `use-push-notifications` - Web push subscription handling
  - `use-theme` - Theme switching (light/dark/forest) with localStorage persistence
  - `use-toast` - Toast notification system

### Backend Architecture
- **Framework:** Express.js with TypeScript
- **Request Validation:** Zod schemas from Drizzle with comprehensive error handling (400 for validation, 503 for DB errors)
- **Authentication:** 
  - Session-based auth with `express-session` and PostgreSQL backend (connect-pg-simple)
  - JWT token auth for API integrations with custom code exchange flow
  - Google OAuth 2.0 via Passport.js
  - OTP verification for email/password reset
  - Account lockout after 5 failed login attempts
- **Security:**
  - CSRF protection with token validation (Express middleware)
  - Rate limiting on sensitive endpoints (OTP, registration, password reset, general API)
  - PostgreSQL-backed rate limiting with automatic cleanup
  - AES-256-GCM encryption for sensitive data (encryption.ts utilities)
  - Input sanitization and DOMPurify for message content
  - Security headers via Helmet middleware
  - Audit logging for all admin actions and sensitive operations
- **Core Services:**
  - `auth-service.ts` - Session/JWT management, password hashing (bcrypt 12 rounds)
  - `email.ts` - Email queue system with Gmail API backend, template rendering with i18n
  - `gmail-client.ts` - Gmail API integration via Replit connector
  - `google-calendar-client.ts` - Google Calendar + Meet integration
  - `pdf-generator.ts` - Server-side PDF generation for invoices and operating agreements
  - `encryption.ts` - Document encryption/decryption utilities
  - `push-service.ts` - Web push notification management
  - `backup-service.ts` - Automated Object Storage backups
  - `abandoned-service.ts` - Abandoned application reminders (30min after submission)
  - `logger.ts` - Structured logging with debug/info/error levels
  - `rate-limiter.ts` - Token bucket rate limiting
  - `task-watchdog.ts` - Monitoring for scheduled background tasks
- **Scheduled Tasks:**
  - OTP cleanup every 10 minutes (removes expired tokens)
  - Compliance reminder checks every 1 hour
  - Abandoned application reminders every 1 hour
  - Rate limit entry cleanup hourly
  - Consultation reminders 10 minutes before scheduled meetings
- **API Routes (Modular):**
  - `auth.ts` - Login, logout, registration (via custom-auth.ts middleware)
  - `auth-ext.ts` - Registration OTP, password reset, email verification
  - `orders.ts` - Order CRUD, discount code validation
  - `llc.ts` - LLC application form, state selection, EIN assignment
  - `maintenance.ts` - Maintenance package applications
  - `messages.ts` - User-admin messaging with encryption
  - `contact.ts` - Public contact form, newsletter subscription
  - `consultations.ts` - Consultation booking, availability check, guest tracking
  - `user-profile.ts` - Profile updates, notifications, export data
  - `user-documents.ts` - Document upload, download, encryption
  - `user-security.ts` - Password change, identity verification, 2FA setup
  - `push.ts` - Web push subscription management
  - `admin-users.ts` - User management, account status, role assignment
  - `admin-orders.ts` - Order management, invoice generation, payment links
  - `admin-billing.ts` - Billing overview, transaction tracking
  - `admin-comms.ts` - Admin messaging, newsletter management
  - `admin-documents.ts` - Document request lifecycle, approval workflow
  - `admin-roles.ts` - Staff role RBAC configuration
  - `admin-consent.ts` - User consent tracking and reporting
  - `accounting.ts` - Transaction logging and accounting reports
  - `object-storage/` - File upload/download with Replit integration
- **Health Checks:**
  - `GET /_health` - Database and pool connectivity status
  - Returns 200 when healthy, 503 when unhealthy
  - Includes retry suggestions via `Retry-After` header

### Database Schema (33 Tables)

**Core Users & Auth:**
- `users` - User accounts with email, password, profile info, OAuth integration, staff roles
- `sessions` - Express session store (PostgreSQL backend)
- `passwordResetTokens` - Password reset token tracking
- `emailVerificationTokens` - Email verification links
- `userNotifications` - In-app notification history

**Orders & Products:**
- `products` - LLC formation packages (New Mexico, Wyoming, Delaware)
- `orders` - Order records with status tracking (pending → paid → completed)
- `orderEvents` - Order event history for audit trail
- `discountCodes` - Discount/promo codes with usage limits

**LLC Applications:**
- `llcApplications` - Main LLC formation application with state selection, owner info, EIN, filing dates
- `applicationDocuments` - Uploaded documents with encryption support, file hashing
- `documentRequests` - Admin document request tracking (sent → pending_upload → uploaded → approved)
- `documentAccessLogs` - Audit trail for all document access

**Maintenance:**
- `maintenanceApplications` - Annual maintenance package applications

**Consultations:**
- `consultationTypes` - Consultation service types (free, paid) with duration/price, multilingual names
- `consultationAvailability` - Weekly availability slots (day of week, start/end time)
- `consultationBlockedDates` - Blocked dates (holidays, vacations)
- `consultationBookings` - Actual bookings with Google Meet links, guest info, questionnaire responses
- `consultationSettings` - Global consultation configuration

**Communications:**
- `messages` - User-admin message threads (contact, support, system types)
- `messageReplies` - Individual replies with admin/user distinction
- `newsletters` - Newsletter subscriber tracking
- `contactOtps` - OTP verification for contact form

**Compliance & Accounting:**
- `auditLogs` - Comprehensive audit trail (action, user, IP, timestamp, details)
- `accountingTransactions` - Financial transaction recording
- `guestVisitors` - Unauthenticated visitor tracking
- `paymentAccounts` - Payment method storage
- `standaloneInvoices` - Admin-generated invoices

**Data Security & Compliance:**
- `encryptedFields` - Encrypted sensitive data storage
- `userConsentRecords` - User consent tracking (T&Cs, Privacy, Cookies)
- `rateLimitEntries` - Rate limiting token bucket entries
- `pushSubscriptions` - Web push notification subscriptions

**Admin Management:**
- `staffRoles` - Custom staff role definitions with granular permissions
- `calculatorConsultations` - Price calculator consultation requests

### Shared Schema Layer

**Data Consistency:**
- `shared/schema.ts` - Single source of truth for database schema using Drizzle ORM
- All tables defined with proper indexes for performance
- Zod insert schemas generated via `createInsertSchema` with `.omit()` for auto-generated fields
- TypeScript types exported for strict typing across frontend and backend
- Relations defined for foreign key associations

**Validation Schemas:**
- Insert schemas omit auto-generated fields (id, timestamps)
- Select types inferred from table definitions
- Insert types exported for form validation

### Multi-Language Support

- **7 Languages:** Spanish (ES), English (EN), Catalan (CA), French (FR), German (DE), Italian (IT), Portuguese (PT)
- **Translation Files:** `client/src/locales/` with JSON files for each language
- **100% Key Parity:** Verified 3,215 keys across all languages
- **Email Templates:** Localized in `server/lib/email-translations.ts` with proper date/number formatting
- **PDF Generation:** Server-side PDFs generated in user's preferred language
- **Dynamic Page Titles:** Using `use-page-title` hook with i18n support
- **Currency & Formatting:** Locale-aware number, date, and currency formatting

### Theming System

- **Modes:** Light, Dark, Forest (custom green-tinted dark mode)
- **Implementation:** CSS custom properties in `index.css` with HSL color values
- **Persistence:** Theme preference saved to localStorage (`exentax-theme`)
- **Mobile Integration:** Dynamic `theme-color` meta tag for mobile browser chrome
- **Components:** All shadcn/ui components support dark mode out of the box

### Security Features

1. **Authentication & Authorization:**
   - bcrypt password hashing with 12 salt rounds
   - Session-based auth with httpOnly secure cookies
   - JWT token auth with custom code exchange (optional for integrations)
   - Google OAuth 2.0 integration
   - Account lockout: 5 failed attempts → locked for 15 minutes
   - OTP verification for sensitive actions (email verification, password reset)
   - Role-based access control (RBAC): admin, support, staff roles with granular permissions

2. **Data Protection:**
   - AES-256-GCM encryption for sensitive fields (messages, ID documents)
   - Document file hashing for integrity verification
   - TLS/HTTPS enforcement in production
   - Password reset tokens with 1-hour expiration
   - Email verification tokens with expiration tracking

3. **Request Security:**
   - CSRF token validation (Express middleware with auto-refresh on 403)
   - Rate limiting on:
     - OTP endpoints (5 per minute per email)
     - Registration (3 per hour per IP)
     - Password reset (3 per hour per email)
     - General API (50 per minute per IP)
   - Input sanitization (DOMPurify for user-generated content)
   - Zod schema validation for all request bodies

4. **Audit & Logging:**
   - Comprehensive audit logs for all admin actions:
     - Document uploads/approvals/rejections
     - Order creation/deletion/status changes
     - Invoice generation
     - User role changes
   - Document access logging (view, download, upload, delete actions)
   - IP address tracking for security monitoring
   - Log retention with automatic cleanup for older entries

5. **Compliance:**
   - GDPR-compliant data export and account deactivation
   - User consent tracking (Terms, Privacy, Cookies)
   - Admin-only full data deletion
   - No hardcoded secrets or API keys (all environment variables)

### Error Handling & Recovery

**Self-Healing System:**
1. **Query-Level Retries:**
   - Queries: 3 retries with exponential backoff
   - Mutations: 2 retries with exponential backoff
   - Skip retry on 401/403/404 errors (permanent failures)

2. **CSRF Auto-Refresh:**
   - On 403 CSRF error, automatically refresh token and retry

3. **Panel-Level Error Boundary:**
   - `PanelErrorBoundary` wrapper on dashboard panels
   - Auto-retry: 3 attempts with 5-second delay
   - 30-second cooldown reset between retry cycles
   - Deterministic error detection (network errors excluded)

4. **Global Error Handler:**
   - Zod validation errors → 400 with field details
   - Database errors → 503 with Retry-After header
   - No stack traces leaked to client
   - Toast notification for network errors

5. **Health Check Integration:**
   - `GET /_health` endpoint checks DB pool status
   - Returns current connection count and capacity
   - Used by Replit autoscale for intelligent scaling decisions

### SEO Optimization

- **Dynamic Sitemap:** Generated at `server/sitemap.ts` with all public routes
- **Structured Data:** JSON-LD schema for organization, breadcrumbs, FAQ
- **Meta Tags:** Title, description, Open Graph tags on all pages
- **hreflang Attributes:** Language-specific URLs for multilingual pages
- **Mobile Optimization:** Responsive design with viewport configuration
- **Page Titles:** Dynamic with i18n support via `use-page-title` hook

### Deployment & Scaling

- **Platform:** Replit Autoscale
- **Build Process:** TypeScript compilation via esbuild (script/build.ts)
- **Start Command:** `npm run dev` for development (Vite + Express on port 5000)
- **Production:** Node.js with prebuilt assets
- **Database:** PostgreSQL (Neon-backed) with connection pooling
- **Environment Variables:**
  - `ADMIN_EMAIL` - Centralized admin email (server/lib/config.ts)
  - `ORG_EMAILS` - Organization email addresses for Meet invites
  - `NODE_ENV` - Development/production mode
  - Database, email, OAuth, and storage credentials via environment

## User Preferences

- **Primary Language:** Spanish with full English support
- **Language Defaults:** Detected from browser, stored in user profile
- **UI/UX:**
  - Dark mode as default option
  - Mobile-first responsive design
  - Bilingual email templates with localized branding
  - Clear, non-technical communication
- **Development Workflow:**
  - Iterative feedback at each stage
  - Approval required for significant changes
  - Exhaustive testing before deployment
  - Consistent branded templates for all communications

## Configuration & Customization

### Central Configuration Files

- **Admin Email:** `server/lib/config.ts` - `ADMIN_EMAIL` env var
- **Organization Emails:** `server/lib/config.ts` - `ORG_EMAILS` for Meet integration
- **Contact Phone:** `client/src/lib/constants.ts` - `CONTACT_PHONE` / `CONTACT_PHONE_DISPLAY`
- **Pricing Config:** `shared/config/pricing.ts` - Product prices and features
- **Email Templates:** `server/lib/email-translations.ts` - Multilingual email content

### External Dependencies & Integrations

- **Database:** PostgreSQL (Neon-backed with connection pooling)
- **Email Service:** Gmail API (via Replit google-mail connector v2.0.0)
- **Authentication:** Google OAuth 2.0 (Replit handled)
- **Storage:** Replit Object Storage (with ACL management)
- **Calendar:** Google Calendar + Meet (via Replit google-calendar connector v1.0.0)
- **Error Monitoring:** Sentry (optional)
- **Review Platform:** Trustpilot (optional)
- **PDF Generation:**
  - Server-side: pdfkit (invoices, operating agreements)
  - Client-side: jspdf (user-generated tools)
- **Push Notifications:** web-push npm package
- **Replit Auth:** Login with Replit (optional)

### Self-Healing & Resilience

1. **QueryClient Configuration:**
   - Default query retry: 3 times with exponential backoff
   - Default mutation retry: 2 times with exponential backoff
   - Skip retry on: 401 Unauthorized, 403 Forbidden, 404 Not Found
   - Stale time: Varies by query (usually 1-5 minutes)

2. **CSRF Protection:**
   - Auto-refresh on 403 CSRF error before retrying request
   - Token validated server-side for all mutations
   - Exempt paths: Webhooks, public forms, token exchange

3. **PanelErrorBoundary:**
   - Wraps dashboard panels for isolated error handling
   - Auto-retry: 3 attempts with 5-second delay between attempts
   - Cooldown reset: 30 seconds between retry cycles
   - Error detection: Network errors excluded from auto-retry logic

4. **Backend Resilience:**
   - Returns 503 + `Retry-After` for temporary DB errors
   - Health check includes DB pool status and connectivity
   - Rate limiting prevents cascading failures
   - Abandoned task watchdog monitors background services

5. **Data Persistence:**
   - Form drafts saved to localStorage (use-form-draft hook)
   - User preferences and theme stored locally
   - Critical state (auth token) stored in sessionStorage

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server (Vite + Express on port 5000)
npm run dev

# Push database schema changes
npm run db:push

# Run tests
npm run test

# Watch mode for tests
npm run test:watch

# Type checking
npm check
```

### Database Management

**Schema Management:**
- Drizzle ORM for type-safe schema definition
- `shared/schema.ts` is single source of truth
- Use `npm run db:push` to sync schema with database
- Never modify `drizzle.config.ts`

**Testing Database Connection:**
- Health check: `GET /api/healthz`
- Returns DB pool status and connectivity info
- Used for monitoring and scaling decisions

### Building for Production

```bash
npm run build
```

This creates:
- Compiled backend code in `dist/`
- Bundled frontend assets in `dist/client/`
- Production-optimized JavaScript and CSS

### Testing

```bash
# Run all tests once
npm run test

# Watch mode for development
npm run test:watch
```

Test files located in:
- `server/test/` - Backend tests
- `test/` - Shared tests (i18n, validation)
- `e2e/tests/` - End-to-end tests (Playwright)

## Recent Changes (2026-02-14)

### System Improvements
- **Email Migration:** IONOS SMTP → Gmail API via Replit connector. Created `server/lib/gmail-client.ts`, removed SMTP env vars.
- **Calendar Integration:** Google Calendar + Meet for consultation bookings. Created `server/lib/google-calendar-client.ts`.
- **Error Handling:** Added missing `log.error()` in 20+ catch blocks. Wrapped 4 `schema.parse()` calls with try/catch.
- **Consultation System Overhaul:**
  - Duration: 20 → 30 minutes
  - Hours: 9:00-20:00 daily (including weekends)
  - Calendar shows next 4 days
  - Seeded 147 availability slots
  - Free consultation blocked for LLC owners
- **Email i18n Audit:** Fixed 6 incomplete language maps (time units now cover all 7 languages). Fixed locale mapping in order event templates.
- **Document Bug Fixes:**
  - Order deletion now cleans up maintenanceApplications
  - Document approval scopes notification cleanup (was over-deleting)
  - Message status now updates on admin/client replies
- **Consultation Email Detection:** Enhanced check-email endpoint to return `hasLlc` status. Public booking redirects registered users to login.

### Previous Changes (2026-02-13)
- **Dashboard Refactor:** 2,830 → 1,807 lines (-36%). Extracted `useUserProfileState` (304 lines), `useAdminState` (649 lines), `DashboardSidebar` (141 lines).
- **Self-Healing System:** PanelErrorBoundary with 3x auto-retry, 5s delay, 30s cooldown reset.
- **Centralized Configuration:** Admin email in `server/lib/config.ts`, phone in `client/src/lib/constants.ts`.
- **Audit Logging:** Added for document uploads, invoice operations, order deletion, document review.
- **Security Hardening:** CSRF protection improved, rate limiting on OTP/registration/password-reset, input sanitization.
- **Comprehensive Database Audit:** 33 tables, 107 indexes, 28 FK constraints, all synced.
- **Translation Verification:** 3,215 keys across 7 languages, 100% parity.

## Code Organization

### Frontend Structure
```
client/src/
├── pages/              # Route components
│   ├── auth/          # Login, register, password reset
│   ├── dashboard/     # Dashboard with hooks and panels
│   ├── legal/         # Legal document pages
│   └── [other pages]
├── components/        # Reusable components
│   ├── ui/           # shadcn UI components
│   ├── forms/        # Form input wrappers
│   ├── dashboard/    # Dashboard panels
│   ├── layout/       # Navigation, hero, footer
│   └── [others]
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── locales/          # i18n translation files
├── assets/           # Images and icons
├── index.css         # Global styles with theme variables
└── App.tsx           # Main router component
```

### Backend Structure
```
server/
├── routes/           # API endpoint handlers (modular)
├── lib/              # Core services
│   ├── auth-service.ts
│   ├── email.ts
│   ├── gmail-client.ts
│   ├── google-calendar-client.ts
│   ├── pdf-generator.ts
│   ├── encryption.ts
│   └── [other services]
├── test/             # Backend unit tests
├── db.ts             # Database connection
├── storage.ts        # Storage interface (CRUD)
├── index.ts          # Server entry point
└── routes.ts         # Route registration
```

### Shared Code
```
shared/
├── schema.ts         # Database schema (single source of truth)
├── models/auth.ts    # User and session schemas
├── config/pricing.ts # Pricing configuration
└── routes.ts         # API route definitions
```

## Important Notes

- **Do NOT modify:** `package.json`, `drizzle.config.ts`, `server/vite.ts`, `vite.config.ts` (already optimized)
- **Environment Variables:** Managed per environment (development/production/shared) via Replit
- **Database Migrations:** Use `npm run db:push` (never raw SQL)
- **Git Workflow:** Automated commits after task completion
- **Logging:** Use `createLogger()` from `server/lib/logger.ts` for consistent structured logs
