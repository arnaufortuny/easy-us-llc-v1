# Easy US LLC - Replit Agent Guide

## Overview

Easy US LLC is a full-stack web application for a business formation service that helps users create LLCs (Limited Liability Companies) in the United States. The platform targets Spanish-speaking entrepreneurs and handles the complete LLC formation workflow: product selection, order creation, application form completion with document uploads, and status tracking. It integrates with Stripe for payment processing and provides a dashboard for users to manage their LLC applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (new-york style)
- **Animations**: Framer Motion
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

The frontend follows a pages-based structure where each route corresponds to a page component in `client/src/pages/`. Components are organized into UI primitives (shadcn/ui in `components/ui/`), layout components (`components/layout/`), and feature-specific components. Custom hooks in `hooks/` handle data fetching and authentication.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage

The backend uses a storage abstraction layer (`server/storage.ts`) that implements database operations through a `DatabaseStorage` class implementing the `IStorage` interface. Routes are registered in `server/routes.ts` and the server entry point is `server/index.ts`.

### Data Storage
- **Database**: PostgreSQL (provisioned via Replit)
- **Schema Location**: `shared/schema.ts` using Drizzle ORM
- **Migrations**: Managed via drizzle-kit with migrations stored in `/migrations` folder
- **Push Command**: `npm run db:push` to sync schema changes

Key database tables:
- `users` and `sessions` - Authentication (required for Replit Auth)
- `products` - LLC packages with pricing (New Mexico, Wyoming, Delaware)
- `orders` - Purchase records linked to users and products
- `llc_applications` - Form data for LLC formation applications
- `application_documents` - Uploaded document references

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Implementation**: Passport.js with custom OIDC strategy in `server/replit_integrations/auth/`
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Protected Routes**: Uses `isAuthenticated` middleware for API endpoints requiring auth
- **Auth Storage**: Dedicated `authStorage` class for user operations

### Shared Code Structure
The `shared/` directory contains code shared between frontend and backend:
- `schema.ts` - Drizzle database schema and Zod validation schemas
- `routes.ts` - API route definitions with type-safe request/response schemas
- `models/auth.ts` - User and session table definitions

## External Dependencies

### Payment Processing
- **Stripe**: Payment processing for LLC formation orders (referenced in build allowlist and schema)

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Authentication
- **Replit Auth**: OpenID Connect provider via `ISSUER_URL` (defaults to replit.com/oidc)
- **Required Secrets**: `SESSION_SECRET`, `REPL_ID` for auth configuration

### Email Services
- **Nodemailer**: Email sending capability (in dependencies)

### AI Services
- **OpenAI**: AI capabilities (in build allowlist)
- **Google Generative AI**: Additional AI service integration

### File Handling
- **Multer**: File upload handling for document submissions
- **XLSX**: Spreadsheet processing capability

### External Communication
- **WhatsApp Integration**: Contact links to +34 614 916 910 for customer support