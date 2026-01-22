# Easy US LLC - Project Overview

## Description
Easy US LLC is a business formation service for Spanish-speaking entrepreneurs looking to establish LLCs in the United States (New Mexico, Wyoming, Delaware).

## Design System
- **Colors**: Pure white background, brand-lime (#d9ff00) accents.
- **Typography**: Inter for titles, Sans-serif for body.
- **Animations**: Framer Motion (fadeIn, staggerContainer).

## Key Features
- LLC formation in 3 states.
- Banking assistance (Mercury, Relay).
- Annual maintenance services.
- Multilingual support (Spanish focus).

## Project Structure
- `client/src/pages/`: Main application pages (Home, Servicios, FAQ, Contacto).
- `client/src/components/layout/`: Shared layout components (Navbar, Footer, HeroSection, Newsletter).
- `shared/schema.ts`: Drizzle database schema and Zod types.
- `server/`: Express backend with Drizzle storage.

## Recent Changes
- Standardized Hero sections on mobile (pt-32, min-h-[450px]).
- Implemented Framer Motion animations across all main pages.
- Standardized Section 1 formatting across all pages.
- Added Newsletter section globally.
- Cleaned up unused components (CookieBanner).
