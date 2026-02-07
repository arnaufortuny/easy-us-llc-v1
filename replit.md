# Easy US LLC - Compressed Project Overview

## Overview
Easy US LLC is a platform dedicated to simplifying US business formation for LLCs in New Mexico, Wyoming, and Delaware, primarily targeting Spanish-speaking entrepreneurs. The platform aims to provide comprehensive support, including banking assistance, annual maintenance, and multilingual services, to streamline legal and financial procedures for international clients. The project's vision is to achieve significant market presence by offering accessible, high-quality services to this niche market.

## User Preferences
I want to be communicated with in a clear and concise manner. I prefer explanations that are easy to understand, avoiding overly technical jargon. I appreciate an iterative development approach where I can provide feedback throughout the process. Please ask for my approval before implementing any significant changes to the codebase or design.

## System Architecture
The application features a modern, responsive UI/UX with a consistent design system (Primary Green, Carbon Black, Off White, Soft Gray, Text Gray) and a premium fintech typography hierarchy (Space Grotesk, Inter, DM Sans). It supports a full dark/light theme system. The project uses two distinct domains: `creamostullc.com` for isolated landing pages and `easyusllc.com` for the main website, which includes home, services, FAQ, legal, dashboard, forms, and authentication with full i18n support. UI animations are powered by Framer Motion.

**Technical Implementations:**
- **Client-side:** Built with React, utilizing Wouter for routing.
- **Server-side:** Powered by an Express.js backend, providing extensive API endpoints for various functionalities including admin, user management, orders, LLC applications, maintenance, messaging, newsletters, authentication, and PDF generation.
- **Database:** PostgreSQL with Drizzle ORM and Zod for type validation, comprising 28 tables.
- **Email System:** Manages professional email templates via IONOS for notifications, support, and review requests.
- **Authentication:** Features OTP verification, robust session management, secure passwords, Google OAuth, and CSRF protection. Users must be 18+ for LLC creation.
- **Form Management:** Implements multi-step wizard forms with auto-fill, local storage draft saving, and unauthenticated data transfer upon account creation.
- **Admin Panel:** Provides comprehensive control over orders, users, messages, payment accounts, discounts, and billing.
- **Performance Optimizations:** Includes Gzip compression, advanced cache headers, lazy loading, PWA support, in-memory cache, and an email queue system.
- **Security:** Employs enhanced rate limiting, comprehensive security headers, CSRF protection, secure API endpoints with validation, HTML sanitization, audit logging, advanced fraud detection, OTP for sensitive changes, LLC data locking, AES-256-CBC encryption, SHA-256 file integrity verification, and document access logging.
- **Internationalization (i18n):** Full 7-language support (Spanish/English/Catalan/French/German/Italian/Portuguese) via react-i18next with 2439 verified translation keys per language.
- **PDF Generation:** Supports both client-side and server-side PDF generation for documents like invoices and operating agreements.
- **Testing:** Utilizes Vitest for an automated test suite.
- **SEO Optimization:** Includes targeted keywords, structured data (JSON-LD), server-side SEO headers, optimized robots.txt, dual sitemaps, and meta tags.
- **Unified ID System:** Centralized `id-generator.ts` for all unique IDs across the system.
- **Document Backup System:** Automated hourly incremental backup of `/uploads/` files to Replit Object Storage.

**Feature Specifications:**
- **Order & Account System:** Mandatory account creation for orders, flexible payment options, and detection of existing users.
- **Pricing:** Clearly defined pricing for LLC formation and maintenance in New Mexico, Wyoming, and Delaware, managed via a centralized configuration.
- **OTP Verification System:** Used for account creation, password resets, sensitive profile changes, and email verification.
- **Messaging System:** Links messages from authenticated users, sends email notifications, supports threaded replies.
- **Admin Features:** Includes payment link management, CRUD operations for users and orders, document request management, and invoice generation.
- **Compliance Calendar System:** Automatically calculates IRS deadlines, annual reports, and registered agent renewals with reminders.
- **Progress Widget:** A visual 5-step progress tracker for LLC and Maintenance applications.
- **Abandoned Application Recovery:** Tracks and recovers incomplete applications with email reminders.
- **Client Tools:** Provides an Invoice Generator, Operating Agreement Generator, CSV Transaction Record Generator, and a Price Calculator (tax comparison tool).
- **State Comparison:** Interactive comparison of New Mexico, Wyoming, and Delaware with pros, cons, ideal scenarios, pricing, and processing times.

## External Dependencies
- **Drizzle ORM:** Database interaction.
- **Zod:** Data validation.
- **Express.js:** Backend framework.
- **Framer Motion:** UI animations.
- **shadcn/ui:** UI components and design system.
- **TanStack Query:** Client-side data fetching and caching.
- **wouter:** Client-side routing.
- **react-i18next:** Internationalization.
- **jspdf:** Client-side PDF generation.
- **pdfkit:** Server-side PDF generation.
- **Mercury / Relay:** Banking assistance integrations.
- **Stripe:** Payment processing portal integration.
- **Google Fonts:** Typography.
- **nodemailer:** Email sending.