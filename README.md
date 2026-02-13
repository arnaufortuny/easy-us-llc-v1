# Exentax — Plataforma de Formación de LLCs en EE.UU.

## Descripción

Exentax es una plataforma SaaS integral para la creación y gestión de empresas LLC en Estados Unidos (New Mexico, Wyoming, Delaware), enfocada en emprendedores hispanohablantes e internacionales. Incluye formación empresarial, mantenimiento anual, asistencia bancaria, compliance, y soporte profesional multilingüe.

## Dominio

**exentax.com**

## Stack Tecnológico

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- react-i18next (7 idiomas: ES, EN, FR, DE, IT, PT, CA)
- Temas: Light, Dark, Forest

### Backend
- Express.js + Node.js + TypeScript
- PostgreSQL con Drizzle ORM
- Nodemailer (IONOS SMTP)

### Características Técnicas
- **Autenticación**: Sistema propio con email/password, Google OAuth, OTP
- **Almacenamiento**: Replit Object Storage
- **Notificaciones**: web-push
- **PDFs**: pdfkit (servidor) + jspdf (cliente)

## Estructura del Proyecto

```
client/                - Frontend React
├── src/
│   ├── components/    - Componentes UI y layout
│   ├── pages/         - Páginas de la aplicación
│   ├── locales/       - Traducciones (7 idiomas)
│   ├── hooks/         - Custom hooks
│   └── lib/           - Utilidades
server/                - Backend Express
├── lib/               - Servicios core (email, auth, pdf, seguridad)
├── routes/            - Endpoints API organizados por dominio
└── replit_integrations/    - Integraciones Replit
shared/                - Esquemas y tipos compartidos (Drizzle + Zod)
```

## Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run db:push      # Sincronizar base de datos
npm run check        # Verificación TypeScript
```

## Seguridad

- Encriptación AES-256-GCM para datos sensibles
- Rate limiting en endpoints sensibles (login, OTP, registro)
- Protección CSRF en todas las rutas con estado
- Headers de seguridad (CSP, HSTS, X-Frame-Options)
- Sanitización de inputs (DOMPurify)
- Sesiones seguras (httpOnly, secure, sameSite)
- Validación Zod en todas las rutas
- Audit logging completo

## Características Principales

- Dashboard de cliente y administrador
- Wizard de formación LLC multi-paso
- Sistema de facturación y pagos
- Gestión de documentos con Object Storage
- Calendario de compliance automático
- Sistema de mensajería interna
- Notificaciones push y email
- Consultas/videollamadas con reserva
- Herramientas de cálculo de impuestos
- Generación de Operating Agreement PDF
- SEO optimizado con sitemap dinámico
- GDPR compliance (exportación datos, desactivación cuenta)

## Reglas de Desarrollo

- Solo el usuario **afortuny07@gmail.com** puede asignar privilegios de administrador
- Las cuentas admin están siempre verificadas automáticamente
- No se realizan cambios sin autorización previa
- Email de contacto: **hola@exentax.com**
- Email de envío: **no-reply@exentax.com**

---

© Exentax Holdings LLC 2024
