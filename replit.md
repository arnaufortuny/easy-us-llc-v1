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
- Redesigned application wizard with a vertical flow (Steps 1-4) and a prominent "VAMOS A CONSTITUIR TU LLC" header.
- Implemented a cleaner, more professional UI for the form with larger fields (h-20), rounded corners (rounded-3xl), and solid white backgrounds for all interactive elements.
- Optimized system performance by removing temporary files and unused components.
- Standardized Hero sections and Framer Motion animations across all main pages.
- Enhanced global Newsletter and FAQ sections for better mobile UX.
