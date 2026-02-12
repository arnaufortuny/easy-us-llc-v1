# Exentax — Platform Documentation

## Overview
Exentax (formerly Easy US LLC) is a full-stack SaaS platform designed to simplify US LLC formation for international entrepreneurs, particularly Spanish-speaking clients. It provides end-to-end services including business formation in New Mexico, Wyoming, and Delaware, annual maintenance, banking assistance, compliance tracking, and multilingual professional support. The platform is production-ready, featuring a comprehensive admin panel, secure document handling, and an automated compliance calendar, aiming to facilitate US business entry for a global audience.

**Domain:** https://exentax.com
**Brand:** Exentax
**Primary Audience:** International entrepreneurs (Spanish-speaking focus)
**Supported States:** New Mexico, Wyoming, Delaware

---

## User Preferences
- Clear, concise communication without technical jargon
- Iterative development with feedback at each stage
- Approval required before significant codebase or design changes
- Spanish as primary language, with full multilingual support (7 languages)
- Exhaustive testing and validation before deployment
- All emails must follow consistent branded Exentax templates with full multilingual support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, TypeScript |
| Routing (client) | Wouter |
| State/Data | TanStack Query v5 |
| UI Components | shadcn/ui + Radix primitives |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Backend | Express.js (Node.js), TypeScript |
| Database | PostgreSQL (Neon-backed) |
| ORM | Drizzle ORM |
| Validation | Zod (drizzle-zod) |
| Authentication | Custom session-based (bcrypt, Google OAuth, OTP, identity verification) |
| Email | Nodemailer via IONOS SMTP |
| PDF Generation | jspdf (client-side), pdfkit (server-side) |
| Storage | Replit Object Storage + local filesystem (identity documents) |
| Internationalization | react-i18next (ES, EN, CA, FR, DE, IT, PT) |
| Push Notifications | VAPID-based Web Push with service worker |
| Error Monitoring | Sentry (optional) |
| Reviews | Trustpilot integration (optional) |

---

## Project Structure

```
/
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets
│   │   ├── sitemap.xml              # SEO sitemap
│   │   ├── sitemap-images.xml       # Image sitemap
│   │   └── sw-push.js              # Push notification service worker
│   └── src/
│       ├── assets/                  # Images, logos, branding
│       ├── components/
│       │   ├── ui/                  # shadcn/ui base components (Button, Card, Badge, Dialog, etc.)
│       │   ├── layout/             # Navbar, Footer, HeroSection, NewsletterSection
│       │   ├── forms/              # FormInput, FormSelect, FormTextarea, FormCheckbox, FormRadioGroup
│       │   ├── auth/               # SocialLogin (Google OAuth)
│       │   ├── dashboard/          # Dashboard tab components (ServicesTab, ProfileTab, MessagesTab, etc.)
│       │   ├── legal/              # LegalPageLayout
│       │   ├── account-status-guard.tsx  # Route protection by account status
│       │   ├── dashboard-tour.tsx       # Interactive onboarding tour
│       │   ├── icons.tsx                # Custom SVG icons
│       │   ├── loading-screen.tsx       # Branded loading animation
│       │   ├── llc-progress-widget.tsx  # LLC formation progress tracker
│       │   ├── state-comparison.tsx     # State comparison tool component
│       │   └── tax-comparator.tsx       # Tax calculator (lazy-loaded, 731 lines)
│       ├── hooks/
│       │   ├── use-auth.ts             # Authentication state hook
│       │   ├── use-form-draft.ts       # Form draft persistence
│       │   ├── use-mobile.tsx          # Mobile detection
│       │   ├── use-page-title.ts       # Dynamic page titles
│       │   ├── use-prefetch.tsx        # Route prefetching
│       │   ├── use-push-notifications.ts # Web push subscription management
│       │   ├── use-theme.tsx           # Theme toggle (light/dark/forest)
│       │   └── use-toast.ts            # Toast notification hook
│       ├── lib/
│       │   ├── animations.ts           # Framer Motion animation presets
│       │   ├── i18n.ts                 # i18next configuration
│       │   ├── queryClient.ts          # TanStack Query + apiRequest helper
│       │   ├── register-sw.ts          # Service worker registration
│       │   ├── sanitize.ts             # DOMPurify client-side sanitization
│       │   ├── sentry.ts               # Sentry error reporting
│       │   ├── utils.ts                # General utilities (cn class merger)
│       │   ├── validation.ts           # Client-side validation helpers
│       │   └── whatsapp.ts             # WhatsApp integration link generator
│       ├── locales/
│       │   ├── es.json                 # Spanish (primary, 3209+ keys)
│       │   ├── en.json                 # English
│       │   ├── ca.json                 # Catalan
│       │   ├── fr.json                 # French
│       │   ├── de.json                 # German
│       │   ├── it.json                 # Italian
│       │   └── pt.json                 # Portuguese
│       ├── pages/                      # All route pages (see Pages section)
│       │   ├── dashboard/
│       │   │   ├── DashboardContext.tsx # Shared dashboard state
│       │   │   └── panels/
│       │   │       ├── admin/          # 9 admin panel components
│       │   │       └── user/           # 6 user panel components
│       │   ├── auth/                   # Login, Register, ForgotPassword
│       │   ├── legal/                  # Terms, Privacy, Refunds, Cookies
│       │   └── ...                     # Other pages
│       ├── App.tsx                     # Main app with routes
│       └── index.css                   # Global styles, theme variables, utilities
│
├── server/                          # Backend (Express.js)
│   ├── routes/                      # API route modules
│   │   ├── accounting.ts            # Accounting transactions
│   │   ├── admin-billing.ts         # Admin billing/invoices
│   │   ├── admin-comms.ts           # Admin communications/messages
│   │   ├── admin-documents.ts       # Admin document management
│   │   ├── admin-orders.ts          # Admin order management
│   │   ├── admin-roles.ts           # Staff roles & permissions
│   │   ├── admin-users.ts           # Admin user management
│   │   ├── auth-ext.ts              # Extended auth (Google OAuth, OTP)
│   │   ├── consultations.ts         # Consultation booking
│   │   ├── contact.ts               # Contact form
│   │   ├── llc.ts                   # LLC formation application
│   │   ├── maintenance.ts           # Maintenance service application
│   │   ├── messages.ts              # Client messaging system
│   │   ├── orders.ts                # Order management
│   │   ├── push.ts                  # Push notification endpoints
│   │   ├── shared.ts                # Shared/utility endpoints
│   │   ├── user-documents.ts        # User document upload/download
│   │   ├── user-profile.ts          # User profile management
│   │   └── user-security.ts         # Password/security changes
│   ├── lib/
│   │   ├── abandoned-service.ts     # Abandoned application recovery
│   │   ├── api-metrics.ts           # API response time tracking
│   │   ├── auth-service.ts          # Authentication business logic
│   │   ├── backup-service.ts        # Object Storage backup service
│   │   ├── backup.ts                # Scheduled backup orchestrator
│   │   ├── csrf.ts                  # CSRF token middleware
│   │   ├── custom-auth.ts           # Session auth, middleware, Google OAuth
│   │   ├── db-utils.ts              # Database helper functions
│   │   ├── email-translations.ts    # Email content translations (7 languages)
│   │   ├── email.ts                 # 40+ email templates + queue system
│   │   ├── id-generator.ts          # Client ID generation (8-digit)
│   │   ├── logger.ts                # Structured logging (debug/info/warn/error)
│   │   ├── pdf-generator.ts         # Server-side PDF generation (invoices, agreements)
│   │   ├── push-service.ts          # VAPID push notification service
│   │   ├── rate-limiter.ts          # DB-backed + in-memory rate limiting
│   │   ├── security.ts              # Sanitization, validation, audit logging
│   │   ├── sentry.ts                # Sentry error tracking config
│   │   └── task-watchdog.ts         # Scheduled task health monitoring
│   ├── utils/
│   │   └── encryption.ts            # AES-256-GCM/CBC encryption, SHA-256 hashing
│   ├── db.ts                        # Database connection (Neon/PostgreSQL)
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # Route registration + middleware
│   ├── sitemap.ts                   # Dynamic sitemap generation
│   ├── storage.ts                   # IStorage interface (CRUD operations)
│   └── vite.ts                      # Vite dev server integration
│
├── shared/                          # Shared between frontend and backend
│   ├── schema.ts                    # Drizzle ORM schema (27 tables) + Zod schemas
│   ├── routes.ts                    # Shared route definitions
│   ├── config/
│   │   └── pricing.ts               # Product pricing configuration (EUR)
│   └── models/
│       └── session.ts               # Session model (users table + sessions table)
│
├── drizzle.config.ts                # Drizzle ORM configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

---

## Database Schema (27 Tables)

| Table | Purpose |
|---|---|
| `users` | User accounts (clientId, email, password, profile, status, roles, preferences) |
| `sessions` | Express session storage (sid, sess, expire) |
| `products` | Service products catalog (LLC formation, maintenance packages) |
| `orders` | Service orders (status, pricing, payment tracking, user association) |
| `llc_applications` | LLC formation applications (multi-step form data, company details, members) |
| `maintenance_applications` | Annual maintenance service applications |
| `application_documents` | Documents attached to applications |
| `messages` | Client-to-admin messaging (subject, body, encrypted content, ticket system) |
| `message_replies` | Threaded replies to messages (fromName support) |
| `contact_otps` | One-time passwords for form verification |
| `order_events` | Order status change history/timeline |
| `newsletter_subscribers` | Newsletter subscription management |
| `calculator_consultations` | Tax calculator consultation requests |
| `discount_codes` | Promotional discount codes (percentage/fixed, usage limits, expiry) |
| `rate_limit_entries` | Persistent rate limiting records |
| `audit_logs` | Security audit trail (actions, IPs, timestamps) |
| `document_access_logs` | Document download/access tracking |
| `encrypted_fields` | AES-256 encrypted sensitive data storage |
| `consultation_types` | Consultation service types and pricing |
| `consultation_availability` | Weekly availability slots for consultations |
| `consultation_blocked_dates` | Blocked dates for consultation scheduling |
| `consultation_bookings` | Booked consultation appointments |
| `consultation_settings` | Global consultation system settings |
| `accounting_transactions` | Financial transactions and accounting records |
| `guest_visitors` | Anonymous visitor tracking |
| `payment_accounts` | Payment account details (bank, Wise, PayPal, crypto) |
| `standalone_invoices` | Custom invoices generated by admin |
| `staff_roles` | Staff role definitions with granular permissions |
| `push_subscriptions` | Web push notification subscriptions (VAPID) |

---

## Pages & Routes

### Public Pages (No Authentication Required)

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero, benefits, how-we-work, pricing, FAQ, CTA sections |
| `/servicios` | Services | Detailed service descriptions (formation, maintenance, consulting) |
| `/faq` | FAQ | Searchable FAQ organized by categories (About Exentax, Formation, Banking, Taxes, etc.) |
| `/start` | Start (Sales Funnel) | Tax comparison calculator + free consultation CTA. Lazy-loads TaxComparator component |
| `/links` | Links | Linktree-style social/contact links page |
| `/agendar-consultoria` | Book Consultation | Public consultation booking with date/time picker |
| `/auth/login` | Login | Email/password login + Google OAuth, with client area feature preview |
| `/auth/register` | Register | Multi-step registration with OTP email verification |
| `/auth/forgot-password` | Forgot Password | Password reset via OTP |
| `/legal/terminos` | Terms | Terms of service |
| `/legal/privacidad` | Privacy | Privacy policy (GDPR compliant) |
| `/legal/reembolsos` | Refunds | Refund policy |
| `/legal/cookies` | Cookies | Cookie policy |

### Protected Pages (Authentication Required)

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Main client/admin area with tabbed navigation (see Dashboard section) |
| `/llc/formation` | LLC Formation | Multi-step LLC formation wizard (company details, members, address, review) |
| `/llc/maintenance` | Maintenance | Annual maintenance service application form |
| `/contacto` | Contact | Contact form with OTP verification |
| `/tools/invoice` | Invoice Generator | Client-side invoice PDF generator |
| `/tools/price-calculator` | Price Calculator | Service price calculator with state comparison |
| `/tools/operating-agreement` | Operating Agreement | Operating agreement PDF generator |
| `/tools/csv-generator` | CSV Generator | Transaction CSV export tool |

### Route Protection System

- **`GuardedRoute`** wrapper in App.tsx: Redirects unauthenticated users to `/auth/login`
- **`AccountStatusGuard`**: Limits access for pending/deactivated accounts
- **`allowPending`**: Dashboard accessible with pending status (limited tabs)
- **Server middleware**: `isAuthenticated`, `isAdmin`, `isAdminOrSupport`, `isNotUnderReview`, `hasPermission()`

---

## Dashboard — Client Area

The dashboard (`/dashboard`) uses URL query params for navigation: `?tab=services&subtab=orders`

### Client Tabs

| Tab ID | Label (ES) | Description |
|---|---|---|
| `services` | Mis Trámites | Active orders, LLC/maintenance applications, order status tracking, claim orders |
| `consultations` | Mis Consultas | Booked consultations, upcoming/past sessions |
| `notifications` | Notificaciones | In-app notification center |
| `messages` | Mensajes | Encrypted messaging with admin (ticket system, replies, attachments) |
| `documents` | Documentos | Uploaded/received documents, secure download |
| `payments` | Pagos | Payment history, invoices, payment accounts |
| `calendar` | Calendario | Compliance calendar (IRS deadlines, annual reports, renewals) |
| `tools` | Herramientas | Invoice generator, operating agreement, CSV generator, price calculator |
| `profile` | Mi Perfil | Personal info, password change, identity verification, language preference, newsletter toggle, data export (GDPR), account deactivation |

### Admin Tabs

| Tab ID (subtab) | Label (ES) | Description |
|---|---|---|
| `dashboard` | Métricas | Analytics dashboard (CRM metrics, user stats, order stats, revenue, API metrics) |
| `orders` | Pedidos | All orders management (status updates, notes, document requests, payment requests) |
| `communications` | Comunicaciones | All client messages, reply with custom fromName, newsletter broadcast |
| `incomplete` | Incompletos | Incomplete/abandoned applications recovery |
| `users` | Clientes | User management (search, status changes, VIP, identity verification, role assignment) |
| `documents` | Documentos | All user documents management, approve/reject identity docs |
| `billing` | Facturación | Standalone invoices, payment accounts, accounting transactions |
| `discounts` | Descuentos | Discount code management (create, edit, deactivate) |
| `calendar` | Calendario | Admin compliance calendar view |
| `consultations` | Consultas | Consultation management (availability, types, bookings, blocked dates) |
| `roles` | Roles | Staff role & permission management |
| `accounting` | Contabilidad | Financial transaction records |
| `activity` | Actividad | Audit log viewer |
| `system` | Sistema | System stats, task watchdog health, API metrics |

### Dashboard Panel Files

```
client/src/pages/dashboard/panels/
├── admin/
│   ├── AdminBillingPanel.tsx        # Invoices, payment accounts
│   ├── AdminCalendarPanel.tsx       # Compliance calendar management
│   ├── AdminCommsPanel.tsx          # Message management + newsletter
│   ├── AdminDashboardPanel.tsx      # Analytics/metrics dashboard
│   ├── AdminDiscountsPanel.tsx      # Discount code management
│   ├── AdminDocsPanel.tsx           # Document management
│   ├── AdminIncompletePanel.tsx     # Abandoned applications
│   ├── AdminOrdersPanel.tsx         # Order management
│   └── AdminUsersPanel.tsx          # User management
└── user/
    ├── CalendarPanel.tsx            # Client compliance calendar
    ├── DocumentsPanel.tsx           # Client documents
    ├── PaymentsPanel.tsx            # Payment history
    ├── PendingReviewCard.tsx        # Account pending review notice
    ├── RightSidebarContent.tsx      # Desktop sidebar (quick stats)
    └── ToolsPanel.tsx               # Client tools access
```

### Dashboard Tab Components

```
client/src/components/dashboard/
├── activity-log-panel.tsx           # Admin audit log viewer
├── admin-accounting-panel.tsx       # Accounting transactions
├── admin-consultations-panel.tsx    # Consultation management
├── admin-roles-panel.tsx            # Staff roles management
├── consultations-tab.tsx            # Client consultations view
├── crm-metrics-section.tsx          # CRM analytics widgets
├── error-panel.tsx                  # Error boundary panel
├── messages-tab.tsx                 # Client messaging interface
├── newsletter-toggle.tsx            # Newsletter subscription toggle
├── notifications-tab.tsx            # Notifications center
├── pagination-controls.tsx          # Reusable pagination component
├── profile-tab.tsx                  # User profile management
└── services-tab.tsx                 # Services/orders tab
```

### Mobile Navigation
- Horizontal scrollable tab bar with pill-shaped buttons
- Sticky positioning (stays visible on scroll)
- Bigger touch targets on mobile (`min-h-12`, `text-sm`, `px-6`)
- Left padding to prevent buttons touching screen edge
- Hidden scrollbar with smooth horizontal scroll

---

## API Endpoints

### Authentication (`/api/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new account (email, password, name) |
| POST | `/api/auth/login` | Public | Email/password login |
| POST | `/api/auth/logout` | Auth | Destroy session |
| GET | `/api/auth/me` | Auth | Get current user |
| POST | `/api/auth/google` | Public | Google OAuth login/register |
| POST | `/api/auth/verify-otp` | Public | Verify email OTP code |
| POST | `/api/auth/resend-otp` | Public | Resend OTP code |
| POST | `/api/auth/forgot-password` | Public | Request password reset OTP |
| POST | `/api/auth/reset-password` | Public | Reset password with OTP |
| GET | `/api/csrf-token` | Public | Get CSRF token |

### User Profile (`/api/user/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PATCH | `/api/user/profile` | Auth | Update profile fields |
| POST | `/api/user/change-password` | Auth | Change password (requires OTP) |
| DELETE | `/api/user/account` | Auth | Deactivate account (data preserved) |
| GET | `/api/user/data-export` | Auth | GDPR data export (JSON download) |

### User Security (`/api/user/security/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/user/security/request-otp` | Auth | Request OTP for sensitive actions |
| POST | `/api/user/security/verify-otp` | Auth | Verify OTP for sensitive actions |

### User Documents (`/api/user/documents/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/documents` | Auth | List user's documents |
| POST | `/api/user/documents/upload` | Auth | Upload document (identity, etc.) |
| GET | `/api/user/documents/:id/download` | Auth | Secure document download |

### Orders (`/api/orders/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/orders` | Auth | List user's orders |
| GET | `/api/orders/:id` | Auth | Get order details |
| POST | `/api/orders/claim-llc` | Auth | Claim unclaimed LLC order |
| POST | `/api/orders/claim-maintenance` | Auth | Claim unclaimed maintenance order |

### LLC Formation (`/api/llc/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/llc/apply` | Auth | Submit LLC formation application |
| GET | `/api/llc/applications` | Auth | List user's LLC applications |
| GET | `/api/llc/application/:id` | Auth | Get application details |
| PATCH | `/api/llc/application/:id/draft` | Auth | Save application draft |

### Maintenance (`/api/maintenance/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/maintenance/apply` | Auth | Submit maintenance application |
| GET | `/api/maintenance/applications` | Auth | List maintenance applications |

### Messages (`/api/messages/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/messages` | Auth | List user's messages |
| POST | `/api/messages` | Auth | Send new message (encrypted) |
| GET | `/api/messages/:id` | Auth | Get message with replies |
| POST | `/api/messages/:id/reply` | Auth | Reply to message |

### Consultations (`/api/consultations/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/consultations/types` | Public | List consultation types |
| GET | `/api/consultations/availability` | Public | Get available time slots |
| POST | `/api/consultations/book` | Public | Book consultation |
| GET | `/api/consultations/my-bookings` | Auth | List user's bookings |

### Contact (`/api/contact/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact/send` | Public | Submit contact form (with OTP) |
| POST | `/api/contact/request-otp` | Public | Request contact form OTP |

### Push Notifications (`/api/push/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/push/subscribe` | Auth | Register push subscription |
| DELETE | `/api/push/unsubscribe` | Auth | Remove push subscription |
| GET | `/api/push/vapid-public-key` | Auth | Get VAPID public key |
| GET | `/api/push/status` | Auth | Check subscription status |

### Admin — Users (`/api/admin/users/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | List all users (paginated, searchable) |
| GET | `/api/admin/users/:id` | Admin | Get user details |
| PATCH | `/api/admin/users/:id` | Admin | Update user (status, VIP, roles) |
| DELETE | `/api/admin/users/:id` | Admin | Cascade delete user and all data |
| POST | `/api/admin/users/:id/verify-identity` | Admin | Approve/reject identity verification |

### Admin — Orders (`/api/admin/orders/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/orders` | Admin | List all orders (paginated, searchable) |
| PATCH | `/api/admin/orders/:id` | Admin | Update order status |
| POST | `/api/admin/orders/:id/note` | Admin | Add note to order |
| POST | `/api/admin/orders/:id/event` | Admin | Add order event |
| POST | `/api/admin/orders/:id/request-document` | Admin | Request document from client |
| POST | `/api/admin/orders/:id/request-payment` | Admin | Send payment request |

### Admin — Communications (`/api/admin/comms/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/messages` | Admin | List all messages (paginated) |
| POST | `/api/admin/messages/:id/reply` | Admin | Reply with custom fromName |
| POST | `/api/admin/newsletter/broadcast` | Admin | Send newsletter to all subscribers |

### Admin — Documents (`/api/admin/documents/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/documents` | Admin | List all documents |
| POST | `/api/admin/documents/:id/approve` | Admin | Approve identity document |
| POST | `/api/admin/documents/:id/reject` | Admin | Reject identity document |
| GET | `/api/admin/documents/:id/download` | Admin | Download user document |

### Admin — Billing (`/api/admin/billing/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/invoices` | Admin | List standalone invoices |
| POST | `/api/admin/invoices` | Admin | Create standalone invoice |
| GET | `/api/admin/payment-accounts` | Admin | Get payment accounts |
| PATCH | `/api/admin/payment-accounts/:id` | Admin | Update payment account |

### Admin — Discounts (`/api/admin/discounts/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/discounts` | Admin | List discount codes |
| POST | `/api/admin/discounts` | Admin | Create discount code |
| PATCH | `/api/admin/discounts/:id` | Admin | Update/deactivate discount |

### Admin — Roles (`/api/admin/roles/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/roles` | Admin | List staff roles |
| POST | `/api/admin/roles` | Admin | Create role with permissions |
| PATCH | `/api/admin/roles/:id` | Admin | Update role |
| DELETE | `/api/admin/roles/:id` | Admin | Delete role |

### Admin — System (`/api/admin/`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/system-stats` | Admin | System health, task watchdog, DB health |
| GET | `/api/admin/api-metrics` | Admin | API response time metrics |
| GET | `/api/admin/audit-logs` | Admin | Audit log history |

### Other Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/healthz` | Public | Health check |
| POST | `/api/activity/track` | Auth | Track user activity |
| GET | `/sitemap.xml` | Public | Dynamic sitemap |
| GET | `/robots.txt` | Public | Search engine directives |

---

## Email System

### Infrastructure
- **Provider:** IONOS SMTP via Nodemailer
- **Queue:** In-memory email queue with retry logic
- **Wrapper:** Branded `getEmailWrapper()` template with Exentax logo, green gradient header, footer with links
- **Languages:** All 40+ templates support 7 languages (ES, EN, CA, FR, DE, IT, PT)
- **Translations:** `server/lib/email-translations.ts` (201K lines of translated content)

### Email Templates (40+ Templates)

#### Authentication & Account
| Template Function | Trigger | Description |
|---|---|---|
| `getOtpEmailTemplate` | Login/verify | One-time password email (includes IP for security) |
| `getRegistrationOtpTemplate` | Registration | Registration verification OTP with client ID |
| `getWelcomeEmailTemplate` | After registration | Welcome message with dashboard link |
| `getPasswordChangeOtpTemplate` | Password change | OTP for password change verification |
| `getProfileChangeOtpTemplate` | Profile edit | OTP for sensitive profile changes |
| `getAdminPasswordResetTemplate` | Admin reset | Admin-initiated password reset notification |
| `getAdminOtpRequestTemplate` | Admin action | Admin OTP for privileged operations |

#### Account Status
| Template Function | Trigger | Description |
|---|---|---|
| `getAccountPendingVerificationTemplate` | Account pending | Account under review notification |
| `getAccountUnderReviewTemplate` | Admin review | Account flagged for review |
| `getAccountVipTemplate` | VIP granted | VIP status upgrade notification |
| `getAccountReactivatedTemplate` | Account reactivated | Account reactivation confirmation |
| `getAccountDeactivatedTemplate` | Admin deactivation | Admin-initiated deactivation |
| `getAccountDeactivatedByUserTemplate` | Self deactivation | User-initiated deactivation |
| `getAccountLockedTemplate` | Failed logins | Account locked after suspicious activity |

#### Orders & Services
| Template Function | Trigger | Description |
|---|---|---|
| `getConfirmationEmailTemplate` | Order created | Order confirmation with request code |
| `getOrderUpdateTemplate` | Status change | Order status update notification |
| `getOrderCompletedTemplate` | Order completed | Order completion with next steps |
| `getOrderEventTemplate` | Event added | Order timeline event notification |
| `getNoteReceivedTemplate` | Admin note | Note added to order by admin |

#### Documents
| Template Function | Trigger | Description |
|---|---|---|
| `getDocumentRequestTemplate` | Admin request | Request document from client |
| `getDocumentUploadedTemplate` | Client upload | Document upload confirmation |
| `getDocumentApprovedTemplate` | Admin approval | Identity document approved |
| `getDocumentRejectedTemplate` | Admin rejection | Identity document rejected with reason |

#### Identity Verification
| Template Function | Trigger | Description |
|---|---|---|
| `getIdentityVerificationRequestTemplate` | Admin request | Request identity verification from user |
| `getIdentityVerificationApprovedTemplate` | Approved | Identity verification approved |
| `getIdentityVerificationRejectedTemplate` | Rejected | Identity verification rejected with reason |

#### Communication
| Template Function | Trigger | Description |
|---|---|---|
| `getAutoReplyTemplate` | Message sent | Auto-reply confirmation with ticket ID |
| `getAdminNoteTemplate` | Admin message | Admin sends note to client |
| `getMessageReplyTemplate` | Reply | Message reply notification |
| `getPaymentRequestTemplate` | Admin request | Payment request with amount and link |

#### Admin Internal Notifications
| Template Function | Trigger | Description |
|---|---|---|
| `getAdminNewRegistrationTemplate` | New user | New user registration alert (to admin) |
| `getAdminLLCOrderTemplate` | LLC order | New LLC order notification (to admin) |
| `getAdminMaintenanceOrderTemplate` | Maintenance order | New maintenance order (to admin) |
| `getAdminProfileChangesTemplate` | Profile change | Client profile changes alert (to admin) |

#### Tools & Marketing
| Template Function | Trigger | Description |
|---|---|---|
| `getCalculatorResultsTemplate` | Calculator submit | Tax calculator results email |
| `getOperatingAgreementReadyTemplate` | Agreement generated | Operating agreement ready for download |
| `getNewsletterWelcomeTemplate` | Newsletter subscribe | Newsletter subscription welcome |
| `getNewsletterBroadcastTemplate` | Admin broadcast | Newsletter broadcast to all subscribers |
| `getRenewalReminderTemplate` | Scheduled | Annual renewal reminder |
| `getAbandonedApplicationReminderTemplate` | Scheduled | Abandoned application follow-up |

#### Consultations
| Template Function | Trigger | Description |
|---|---|---|
| `getConsultationConfirmationTemplate` | Booking created | Consultation booking confirmation |
| `getConsultationReminderTemplate` | Scheduled | Upcoming consultation reminder |

#### Reviews
| Template Function | Trigger | Description |
|---|---|---|
| `sendTrustpilotEmail` | Order completed | Trustpilot review invitation |

---

## Authentication System

### Authentication Methods
1. **Email/Password**: bcrypt hashing (12 rounds), session-based
2. **Google OAuth**: Via `auth-ext.ts`, creates account or links existing
3. **OTP Verification**: 6-digit codes via email for registration, password changes, profile edits

### Session Management
- Express sessions stored in PostgreSQL (`sessions` table)
- Session regeneration on login (prevents fixation)
- 2-hour inactivity auto-expire (lastActivity middleware tracking)
- CSRF protection on all state-changing requests

### Account Status Flow
```
Registration → Pending (email verification) → Active
                                              ↕
                                    Deactivated (by user or admin)
                                              ↕
                                    VIP (admin upgrade)
```

### Account Statuses
| Status | Access Level |
|---|---|
| `active` | Full access to all features |
| `pending` | Limited access (services, notifications, profile only) |
| `deactivated` | No access (redirected to login) |
| `vip` | Full access + VIP badge/features |

### Login Security
- Failed login attempt tracking (`loginAttempts` field)
- Account lockout after excessive failures (`lockUntil` timestamp)
- Suspicious activity detection with audit logging
- IP-based rate limiting on login endpoint

### Identity Verification Flow
```
none → pending (user uploads document) → approved / rejected (admin reviews)
```
- Supported file types: PDF, JPG, PNG (max 5MB)
- Secure storage with access logging
- Email notifications at each status change

### Middleware Stack
| Middleware | File | Purpose |
|---|---|---|
| `isAuthenticated` | `custom-auth.ts` | Verifies valid session |
| `isAdmin` | `custom-auth.ts` | Verifies admin role |
| `isAdminOrSupport` | `custom-auth.ts` | Verifies admin or support role |
| `isNotUnderReview` | `custom-auth.ts` | Blocks pending accounts |
| `hasPermission()` | `custom-auth.ts` | Checks granular staff permissions |
| `csrfMiddleware` | `csrf.ts` | CSRF token validation |
| `lastActivity` | `custom-auth.ts` | Session inactivity tracking |

---

## Security Architecture

### Encryption
- **AES-256-GCM**: Primary encryption for sensitive data (12-byte IV, authentication tag)
- **AES-256-CBC**: Backward-compatible fallback for legacy data
- **SHA-256**: File integrity hashing for document verification
- **bcrypt**: Password hashing (12 salt rounds)
- Fail-closed on authentication errors

### Rate Limiting
- **Primary**: PostgreSQL-backed rate limiting (`rate_limit_entries` table)
- **Fallback**: In-memory rate limiting (10K entry cap per type, auto-cleanup)
- **Endpoints protected**: Login, registration, OTP requests, order creation, contact forms
- Configuration per endpoint type via `getRateLimitConfig()`

### Security Headers
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy

### Input Validation & Sanitization
- Zod schema validation on all API inputs
- DOMPurify sanitization (client-side)
- `sanitizeHtml()` / `sanitizeObject()` (server-side)
- Email normalization (lowercase, trim)
- Path traversal protection on document routes

### Audit System
- `logAudit()` for security-relevant actions
- Stored in `audit_logs` table with IP, userId, action, details
- Viewable in admin Activity panel
- Auto-cleanup of logs older than 90 days

### Data Isolation
- All user queries filtered by authenticated `userId`
- Order claim endpoints verify unclaimed status before association
- Document downloads verify ownership before serving
- Admin endpoints require admin/support role verification

---

## Design System

### Brand Colors
| Token | Hex | Usage |
|---|---|---|
| Green Primary | `#00C48C` | Primary actions, links, accents |
| Green Neon | `#00E57A` | Highlights, CTA emphasis |
| Green Lima | `#B4ED50` | Secondary actions, VIP elements |
| Deep Green | `#00855F` | Darker green accents |
| Dark Base | `#0A1F17` | Dark/forest backgrounds, footer |
| Card Dark | `#112B1E` | Card backgrounds in dark mode |
| Light BG | `#F5FBF8` | Light mode background |
| Dark BG | `#050505` | Dark mode (AMOLED black) |
| Forest BG | `#0A1F17` | Forest mode background |

### Typography
| Font | Usage |
|---|---|
| Space Grotesk | h1/h2 hero headings |
| Inter | h3/h4 section headings |
| DM Sans | Body text, UI elements |

### Theme System
Three modes stored in localStorage key `ui-theme`:
1. **Light**: Clean white/green palette (`#F5FBF8` background)
2. **Dark**: Pure black AMOLED (`#050505` background, `.dark` class)
3. **Forest**: Dark green (`#0A1F17` background, `.dark.forest` classes)

Both Dark and Forest share `.dark` class so all `dark:` Tailwind utilities apply to both. System auto-detection maps OS preference to dark/light.

### Component Variants

**Button Variants:** `default` (green), `cta` (green prominent), `secondary` (lima), `neon`, `outline` (green border), `ghost`, `destructive`, `link`, `premium`

**Badge Variants:** `default`, `pending` (amber), `processing` (purple), `completed` (green), `cancelled` (red), `paid` (green), `documentsReady` (lime), `active` (green), `inactive` (gray), `draft`, `submitted`, `filed` (lime), `vip` (lima-to-green gradient)

### Layout Components
- **Navbar**: Glassmorphism (`backdrop-blur-md`, `bg-white/95` light, `bg-[#0A1F17]/95` dark) with green accents, language toggle, theme toggle
- **Footer**: Dark green (`bg-[#0A1F17]`) with `#00C48C` hover links, `white/80` text, `#112B1E` separators
- **Hero Sections**: Dark wash gradient over images for text readability in all themes
- **Loading Screen**: Branded Exentax logo animation with gradient progress bar

### Elevation & Interactions
- `hover-elevate`: Subtle elevation on hover (works on any background)
- `active-elevate-2`: Stronger elevation on press/active
- `toggle-elevate` + `toggle-elevated`: Toggle state styling
- Buttons and Badges have built-in hover/active states (never add custom hover backgrounds to them)
- `animate-press`: Subtle press animation for mobile touch targets

---

## Internationalization (i18n)

### Configuration
- Library: react-i18next
- Detection: Browser language → localStorage → default (ES)
- Server-side: User `preferredLanguage` field used for emails
- Total keys per language: 3,209+ with 100% parity across all 7 languages

### Supported Languages
| Code | Language | Flag |
|---|---|---|
| `es` | Spanish (primary) | Spain |
| `en` | English | UK/US |
| `ca` | Catalan | Catalonia |
| `fr` | French | France |
| `de` | German | Germany |
| `it` | Italian | Italy |
| `pt` | Portuguese | Portugal |

### Translation Structure (Top-Level Keys)
`profile`, `notFound`, `common`, `helpSection`, `nav`, `hero`, `benefits`, `ctaSection`, `howWeWork`, `timing`, `whyUs`, `services`, `packsTitle`, `stateComparison`, `pricing`, `auth`, `validation`, `application`, `maintenance`, `dashboard`, `tour`, `contact`, `faq`, `footer`, `legal`, `theme`, `mobile`, `errors`, `progress`, `payment`, `tabs`, `actions`, `toast`, `newsletter`, `whatsapp`, `taxComparator`, `tools`, `seo`, `consultations`, `homeFaq`, `wallet`, `form`, `ntf`, `legalTerms`, `legalPrivacy`, `legalRefunds`, `legalCookies`, `freeConsultation`, `start`

---

## Order System

### Order Status Flow
```
pending → processing → completed
    ↘                      ↗
      → cancelled ←--------
```

### Order Events Timeline
Each order has a timeline of events (`order_events` table):
- Status changes with descriptions
- Admin notes
- Document requests
- Payment requests
- System events (auto-generated)

### Order Types
1. **LLC Formation**: Company formation in NM/WY/DE
2. **Maintenance**: Annual maintenance service

### Order Claiming
- Orders created during unauthenticated form submission get `userId: null`
- After login/register, users claim orders via `/api/orders/claim-llc` or `/api/orders/claim-maintenance`
- Security: Endpoints verify order is unclaimed before association (prevents hijacking)

---

## Pricing (EUR)

### LLC Formation
| State | Price |
|---|---|
| New Mexico | €899 |
| Wyoming | €1,199 |
| Delaware | €1,599 |

### Annual Maintenance
| State | Price |
|---|---|
| New Mexico | €699 |
| Wyoming | €899 |
| Delaware | €1,299 |

---

## PDF Generation

### Server-Side (pdfkit)
| Function | File | Description |
|---|---|---|
| `generateInvoicePdf` | `pdf-generator.ts` | Standard order invoice |
| `generateCustomInvoicePdf` | `pdf-generator.ts` | Admin standalone invoice |
| `generateOperatingAgreement` | `pdf-generator.ts` | LLC operating agreement |
| `generateOrderInvoice` | `pdf-generator.ts` | Order-specific invoice |

### Client-Side (jspdf)
- Invoice Generator tool (`/tools/invoice`)
- CSV Transaction Generator (`/tools/csv-generator`)

---

## Consultation System

### Features
- Public booking without authentication
- Configurable consultation types with pricing
- Weekly availability schedule (day + time slots)
- Blocked dates management
- Email confirmations and reminders
- Admin management panel

### Tables
- `consultation_types`: Service types (name, duration, price)
- `consultation_availability`: Weekly slots (dayOfWeek, startTime, endTime)
- `consultation_blocked_dates`: Dates unavailable for booking
- `consultation_bookings`: Booked appointments (client, type, date, time, status)
- `consultation_settings`: Global settings (timezone, advance booking limits)

---

## Background Services

### Scheduled Tasks
| Service | File | Description |
|---|---|---|
| Backup Service | `backup.ts` + `backup-service.ts` | Periodic backup to Object Storage |
| Abandoned Applications | `abandoned-service.ts` | Detect and email reminders for incomplete apps |
| Rate Limit Cleanup | `rate-limiter.ts` | Purge expired rate limit entries |
| Consultation Reminders | `consultations.ts` | Send upcoming consultation reminders |
| Audit Log Cleanup | `security.ts` | Remove logs older than 90 days |

### Task Watchdog
- Monitors health of all scheduled tasks
- Reports via `/api/admin/system-stats`
- Tracks last run time, success/failure counts

### Email Queue
- In-memory queue for email sending
- Batch processing with configurable interval
- Retry logic for transient failures
- Status reporting via `getEmailQueueStatus()`

---

## Push Notifications

### Architecture
- VAPID key-based Web Push (RFC 8292)
- Service Worker: `client/public/sw-push.js`
- Server: `server/lib/push-service.ts`
- Client hook: `client/src/hooks/use-push-notifications.ts`

### Endpoints
- `POST /api/push/subscribe` — Register browser subscription
- `DELETE /api/push/unsubscribe` — Remove subscription
- `GET /api/push/vapid-public-key` — Get public VAPID key
- `GET /api/push/status` — Check current subscription status

### Security
- User ownership verification on subscriptions
- Rate limiting on subscription endpoints
- Stale subscription auto-cleanup on 404/410 errors

---

## SEO & Sitemap

### Dynamic Sitemap (`/sitemap.xml`)
Generated from `server/sitemap.ts` with all public routes:
```
/ (priority: 1.0, weekly)
/servicios (0.9, weekly)
/start (0.9, weekly)
/llc/formation (0.9, weekly)
/agendar-consultoria (0.8, weekly)
/faq (0.8, monthly)
/llc/maintenance (0.8, weekly)
/contacto (0.7, monthly)
/tools/price-calculator (0.7, monthly)
/tools/invoice (0.6, monthly)
/tools/operating-agreement (0.6, monthly)
/links (0.6, monthly)
/legal/* (0.4, yearly)
```

### robots.txt
- Allow: `/`
- Disallow: `/api/`, `/dashboard`, `/admin`, `/auth/`
- Crawl-delay: 1

### Meta Tags
- Unique titles per page via `usePageTitle` hook
- Open Graph tags for social sharing
- Meta descriptions per route

---

## GDPR Compliance

### Data Export
- Endpoint: `GET /api/user/data-export`
- Downloads all user data as JSON
- Includes: profile, orders, applications, documents, messages, consultations, notifications, invoices
- Strips sensitive fields: `passwordHash`, `internalNotes`, etc.
- Rate-limited, logged as audit activity

### Data Deletion
- **User self-service**: Account deactivation (data preserved for legal compliance)
- **Admin**: Full cascade deletion of user and all associated data

### Cookie Policy
- Cookie consent management
- Detailed cookie policy page (`/legal/cookies`)

---

## Monitoring & Observability

### API Metrics (`api-metrics.ts`)
- Response time tracking per endpoint
- Path normalization (strips dynamic IDs)
- Slowest routes analysis
- Admin dashboard endpoint: `/api/admin/api-metrics`

### System Health (`security.ts`)
- Database health check (connection + latency)
- Memory usage monitoring
- Uptime tracking
- Available via `/api/admin/system-stats`

### Logging (`logger.ts`)
- Structured logging with levels: DEBUG, INFO, WARN, ERROR
- Timestamp + module prefix format
- Console output with color coding

### Error Tracking
- Sentry integration (optional, `server/lib/sentry.ts`)
- Client-side error boundary
- `asyncHandler` wrapper for all async route handlers

---

## Recent Changes (Feb 2026)
- **Domain Migration:** All references migrated from creamostullc.com and easyusllc.com to exentax.com
- **Brand Rebrand:** "Easy US LLC" → "Exentax" across entire codebase
- **New /start Page:** Sales funnel with tax calculator + free consultation CTA
- **Dashboard Refactor:** Modular panel extraction (18 files), URL-based navigation, server-side pagination
- **Security Hardening:** Order claim verification, full security audit, data isolation confirmed
- **Web Push Notifications:** VAPID-based with service worker
- **GDPR Data Export:** Full user data export as JSON
- **Session Auto-Expire:** 2-hour inactivity timeout
- **Persistent Rate Limiting:** PostgreSQL-backed with in-memory fallback
- **Task Watchdog:** Scheduled task health monitoring
- **API Metrics:** Response time tracking with admin dashboard
- **Mobile Dashboard UX:** Bigger tab buttons, proper spacing, sticky scroll behavior
- **Code Cleanup:** Removed unused imports, fixed TypeScript errors, lazy-loaded heavy components
