import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface PageTitleConfig {
  titleKey?: string;
  descriptionKey?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const routeTitles: Record<string, PageTitleConfig> = {
  "/": {
    titleKey: "seo.home.title",
    descriptionKey: "seo.home.description",
    fallbackTitle: "Constituir LLC en USA con Optimización Fiscal | Todo Incluido | Exentax",
    fallbackDescription: "Constituye tu LLC en Estados Unidos con optimización fiscal internacional, estructura legal eficiente y soporte experto. En Exentax gestionamos todo el proceso, incluyendo cumplimiento normativo, banca empresarial y asesoramiento estratégico para negocios digitales y emprendedores globales."
  },
  "/servicios": {
    titleKey: "seo.servicios.title",
    descriptionKey: "seo.servicios.description",
    fallbackTitle: "Servicios y Precios | Exentax",
    fallbackDescription: "Descubre nuestros packs de formación de LLC en New Mexico, Wyoming y Delaware. Precios transparentes desde 899€."
  },
  "/faq": {
    titleKey: "seo.faq.title",
    descriptionKey: "seo.faq.description",
    fallbackTitle: "Preguntas Frecuentes | Exentax",
    fallbackDescription: "Resuelve todas tus dudas sobre la formación de LLC en Estados Unidos. Centro de ayuda completo."
  },
  "/contacto": {
    titleKey: "seo.contacto.title",
    descriptionKey: "seo.contacto.description",
    fallbackTitle: "Contacto | Exentax",
    fallbackDescription: "Contacta con nuestro equipo de expertos en formación de LLC en Estados Unidos."
  },
  "/dashboard": {
    titleKey: "seo.dashboard.title",
    descriptionKey: "seo.dashboard.description",
    fallbackTitle: "Mi Panel | Exentax",
    fallbackDescription: "Gestiona tu LLC, documentos y servicios desde tu panel personal."
  },
  "/llc/formation": {
    titleKey: "seo.formation.title",
    descriptionKey: "seo.formation.description",
    fallbackTitle: "Constituir LLC | Exentax",
    fallbackDescription: "Inicia el proceso de constitución de tu LLC en Estados Unidos. Formulario simple y seguro."
  },
  "/llc/maintenance": {
    titleKey: "seo.maintenance.title",
    descriptionKey: "seo.maintenance.description",
    fallbackTitle: "Mantenimiento LLC | Exentax",
    fallbackDescription: "Renueva el mantenimiento anual de tu LLC. Agente registrado y cumplimiento incluido."
  },
  "/auth/login": {
    titleKey: "seo.login.title",
    descriptionKey: "seo.login.description",
    fallbackTitle: "Iniciar Sesión | Exentax",
    fallbackDescription: "Accede a tu cuenta de Exentax para gestionar tu empresa."
  },
  "/auth/register": {
    titleKey: "seo.register.title",
    descriptionKey: "seo.register.description",
    fallbackTitle: "Crear Cuenta | Exentax",
    fallbackDescription: "Crea tu cuenta gratuita en Exentax."
  },
  "/auth/forgot-password": {
    titleKey: "seo.forgotPassword.title",
    descriptionKey: "seo.forgotPassword.description",
    fallbackTitle: "Recuperar Contraseña | Exentax",
    fallbackDescription: "Recupera el acceso a tu cuenta de Exentax."
  },
  "/tools/invoice": {
    titleKey: "seo.invoice.title",
    descriptionKey: "seo.invoice.description",
    fallbackTitle: "Generador de Facturas | Exentax",
    fallbackDescription: "Crea facturas profesionales para tu LLC de forma gratuita."
  },
  "/tools/price-calculator": {
    titleKey: "seo.calculator.title",
    descriptionKey: "seo.calculator.description",
    fallbackTitle: "Calculadora de Rentabilidad | Exentax",
    fallbackDescription: "Calcula costes, márgenes y rentabilidad real para que tu negocio crezca con números claros."
  },
  "/tools/operating-agreement": {
    titleKey: "seo.operatingAgreement.title",
    descriptionKey: "seo.operatingAgreement.description",
    fallbackTitle: "Generador Operating Agreement | Exentax",
    fallbackDescription: "Genera el Operating Agreement de tu LLC de forma automática."
  },
  "/tools/csv-generator": {
    titleKey: "seo.csvGenerator.title",
    descriptionKey: "seo.csvGenerator.description",
    fallbackTitle: "Generador CSV de Transacciones | Exentax",
    fallbackDescription: "Genera archivos CSV de transacciones bancarias para tu LLC de forma gratuita."
  },
  "/legal/terminos": {
    titleKey: "seo.legal.terminos.title",
    descriptionKey: "seo.legal.terminos.description",
    fallbackTitle: "Términos y Condiciones | Exentax",
    fallbackDescription: "Consulta los términos y condiciones de uso de Exentax."
  },
  "/legal/privacidad": {
    titleKey: "seo.legal.privacidad.title",
    descriptionKey: "seo.legal.privacidad.description",
    fallbackTitle: "Política de Privacidad | Exentax",
    fallbackDescription: "Consulta nuestra política de privacidad y protección de datos."
  },
  "/legal/reembolsos": {
    titleKey: "seo.legal.reembolsos.title",
    descriptionKey: "seo.legal.reembolsos.description",
    fallbackTitle: "Política de Reembolsos | Exentax",
    fallbackDescription: "Consulta nuestra política de reembolsos y devoluciones."
  },
  "/legal/cookies": {
    titleKey: "seo.legal.cookies.title",
    descriptionKey: "seo.legal.cookies.description",
    fallbackTitle: "Política de Cookies | Exentax",
    fallbackDescription: "Información sobre el uso de cookies en Exentax."
  },
  "/agendar-consultoria": {
    titleKey: "seo.asesoriaGratis.title",
    descriptionKey: "seo.asesoriaGratis.description",
    fallbackTitle: "Consulta Gratuita | Exentax",
    fallbackDescription: "Reserva una consulta gratuita de 20 minutos con nuestros expertos en formación de LLC en Estados Unidos."
  }
};

export function usePageTitle(customTitle?: string) {
  const { t, i18n } = useTranslation();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    const config = routeTitles[pathname];
    
    if (customTitle) {
      document.title = customTitle;
      return;
    }

    if (config) {
      const title = config.titleKey ? t(config.titleKey, { defaultValue: config.fallbackTitle }) : config.fallbackTitle;
      const description = config.descriptionKey ? t(config.descriptionKey, { defaultValue: config.fallbackDescription }) : config.fallbackDescription;
      
      if (title) {
        document.title = title as string;
      }
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && description) {
        metaDescription.setAttribute("content", description as string);
      }
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && title) {
        ogTitle.setAttribute("content", title as string);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription && description) {
        ogDescription.setAttribute("content", description as string);
      }
    }
  }, [pathname, i18n.language, customTitle, t]);
}

export function getPageTitle(pathname: string): string {
  const config = routeTitles[pathname];
  return config?.fallbackTitle || "Constituir LLC en USA con Optimización Fiscal | Todo Incluido | Exentax";
}
