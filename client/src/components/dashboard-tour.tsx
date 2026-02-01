import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface DashboardTourProps {
  isNewUser: boolean;
  onComplete: () => void;
}

export function DashboardTour({ isNewUser, onComplete }: DashboardTourProps) {
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!isNewUser || hasShown) return;

    const tourShown = localStorage.getItem('dashboard-tour-completed');
    if (tourShown) return;

    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayOpacity: 0.7,
        stagePadding: 10,
        popoverClass: 'dashboard-tour-popover',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: 'Empezar',
        progressText: '{{current}} de {{total}}',
        onDestroyStarted: () => {
          localStorage.setItem('dashboard-tour-completed', 'true');
          setHasShown(true);
          onComplete();
          driverObj.destroy();
        },
        steps: [
          {
            popover: {
              title: 'Bienvenido a tu Area de Cliente',
              description: 'Te mostraremos las principales funciones de tu panel para que puedas sacar el maximo provecho.',
              side: 'over' as const,
              align: 'center' as const
            }
          },
          {
            element: '[data-tour="orders"]',
            popover: {
              title: 'Tus Pedidos',
              description: 'Aqui puedes ver todos tus pedidos, su estado actual y los documentos asociados.',
              side: 'bottom' as const,
              align: 'start' as const
            }
          },
          {
            element: '[data-tour="calendar"]',
            popover: {
              title: 'Calendario Fiscal',
              description: 'Consulta las fechas importantes de cumplimiento fiscal de tu LLC: formularios IRS, informes anuales y renovaciones.',
              side: 'bottom' as const,
              align: 'start' as const
            }
          },
          {
            element: '[data-tour="messages"]',
            popover: {
              title: 'Mensajes',
              description: 'Comunicacion directa con nuestro equipo. Responderemos cualquier duda sobre tu LLC.',
              side: 'bottom' as const,
              align: 'start' as const
            }
          },
          {
            element: '[data-tour="profile"]',
            popover: {
              title: 'Tu Perfil',
              description: 'Gestiona tus datos personales, contrasena y preferencias de cuenta.',
              side: 'bottom' as const,
              align: 'start' as const
            }
          },
          {
            element: '[data-tour="tools"]',
            popover: {
              title: 'Herramientas',
              description: 'Accede a herramientas utiles como el generador de facturas para tu negocio.',
              side: 'bottom' as const,
              align: 'start' as const
            }
          },
          {
            popover: {
              title: 'Listo para empezar',
              description: 'Ya conoces tu area de cliente. Si tienes dudas, contacta con nosotros desde la seccion de Mensajes.',
              side: 'over' as const,
              align: 'center' as const
            }
          }
        ]
      });

      driverObj.drive();
    }, 800);

    return () => clearTimeout(timer);
  }, [isNewUser, hasShown, onComplete]);

  return null;
}

export function resetDashboardTour() {
  localStorage.removeItem('dashboard-tour-completed');
}
