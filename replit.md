# Exentax — Platform Documentation

## Overview
Exentax is a full-stack SaaS platform designed to streamline US LLC formation for international entrepreneurs, especially Spanish-speaking clients. It offers comprehensive services for business formation in New Mexico, Wyoming, and Delaware, alongside annual maintenance, banking assistance, compliance tracking, and multilingual professional support. The platform features an admin panel, secure document handling, and an automated compliance calendar, aiming to simplify US business entry for a global audience.

**Domain:** https://exentax.com
**Brand:** Exentax
**Primary Audience:** International entrepreneurs (Spanish-speaking focus)
**Supported States:** New Mexico, Wyoming, Delaware

## User Preferences
- Clear, concise communication without technical jargon
- Iterative development with feedback at each stage
- Approval required before significant codebase or design changes
- Spanish as primary language, with full multilingual support (7 languages)
- Exhaustive testing and validation before deployment
- All emails must follow consistent branded Exentax templates with full multilingual support

## System Architecture
Exentax employs a React 18 frontend with Vite and TypeScript, utilizing Wouter for routing, TanStack Query v5 for data management, and shadcn/ui with Radix for UI components. Styling is handled by Tailwind CSS with animations via Framer Motion. The backend is built with Express.js (Node.js) and TypeScript, connected to a PostgreSQL database (Neon-backed) using Drizzle ORM for schema management and Zod for validation.

Key architectural decisions include:
- **UI/UX**: Features a "Glassmorphism" navbar, a dark green footer, and hero sections with dark wash gradients. It offers three theme modes (Light, Dark, Forest) with specific brand colors (Green Primary, Green Neon, Dark Base, etc.) and typography (Space Grotesk, Inter, DM Sans). Components like Buttons and Badges have predefined variants and interactive states.
- **Authentication**: Custom session-based authentication with bcrypt hashing, Google OAuth, and OTP verification for registration and sensitive actions. Session management includes PostgreSQL storage, regeneration on login, and a 2-hour inactivity auto-expire. Account statuses (active, pending, deactivated, VIP) control access levels, and identity verification involves user uploads and admin review.
- **Security**: Implements AES-256-GCM/CBC encryption for sensitive data, SHA-256 for file integrity, and bcrypt for passwords. Rate limiting is applied to critical endpoints using a PostgreSQL-backed system with an in-memory fallback. Security headers (CSP, HSTS, X-Frame-Options) are enforced. Input validation uses Zod and server-side/client-side sanitization. An audit system logs security-relevant actions, and data isolation ensures users only access their own data.
- **Internationalization**: Full multilingual support for 7 languages (ES, EN, CA, FR, DE, IT, PT) via `react-i18next`, with 100% key parity across all 3,209+ translation keys. Language detection prioritizes browser settings, then localStorage, defaulting to Spanish.
- **Email System**: Uses IONOS SMTP via Nodemailer with an in-memory queue and retry logic. Over 40 email templates support all 7 languages and are wrapped in a consistent branded design.
- **Order System**: Manages LLC formation and annual maintenance applications with a `pending` -> `processing` -> `completed` status flow. An order events timeline tracks all changes. Users can claim unauthenticated orders after login.
- **PDF Generation**: Utilizes `pdfkit` for server-side generation of invoices and operating agreements, and `jspdf` for client-side invoice and CSV generation.
- **Consultation System**: Allows public booking of consultations with configurable types, pricing, weekly availability, and blocked dates.
- **Background Services**: Includes scheduled tasks for backups, abandoned application reminders, rate limit cleanup, and consultation reminders. A task watchdog monitors their health.
- **Push Notifications**: Implements VAPID-based Web Push notifications via a service worker and server-side service.
- **SEO**: Dynamic sitemap generation, `robots.txt` directives, and page-specific meta tags for titles and Open Graph.
- **GDPR Compliance**: Provides user data export as JSON and options for account deactivation (data preserved for legal reasons) or full admin-initiated deletion.
- **Monitoring**: API metrics track response times, system health monitors database, memory, and uptime, and structured logging is implemented. Sentry integration is optional.

## External Dependencies
- **Database**: PostgreSQL (Neon-backed)
- **Email Service**: IONOS SMTP
- **Authentication**: Google OAuth
- **Error Monitoring**: Sentry (optional)
- **Reviews**: Trustpilot (optional)
- **Deployment Platform:** Replit Object Storage (for file storage)