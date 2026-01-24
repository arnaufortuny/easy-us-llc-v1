import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { Button } from "@/components/ui/button";

export default function Cookies() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <HeroSection title="Política de Cookies" />
      <div className="container max-w-4xl mx-auto py-16 px-5 sm:px-8 text-left">
        <h2 className="text-2xl font-bold mb-6">1. ¿Qué son las Cookies?</h2>
        <p className="mb-6 text-muted-foreground leading-relaxed">Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestro sitio web. Ayudan a que el sitio funcione correctamente y a mejorar su experiencia de navegación.</p>

        <h2 className="text-2xl font-bold mb-6">2. Tipos de Cookies que Utilizamos</h2>
        <ul className="list-disc pl-6 mb-8 text-muted-foreground space-y-4">
          <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio, como la autenticación de usuarios y la seguridad.</li>
          <li><strong>Cookies de Análisis:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio mediante la recopilación de información anónima.</li>
          <li><strong>Cookies de Preferencia:</strong> Permiten que el sitio recuerde información que cambia la forma en que el sitio se comporta o se ve.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-6">3. Gestión de Cookies</h2>
        <p className="mb-6 text-muted-foreground leading-relaxed">Usted puede controlar y/o eliminar las cookies según desee a través de la configuración de su navegador. Tenga en cuenta que si deshabilita las cookies, algunas funciones de este sitio pueden no estar disponibles.</p>
      </div>
      <section className="py-8 sm:py-14 bg-muted/40">
        <div className="container max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-lg sm:text-2xl font-bold text-primary mb-4 uppercase">¿Necesitas ayuda?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Si tienes dudas sobre nuestra política de cookies, 
            puedes contactar con nosotros o consultar nuestro asistente virtual.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/34614916910" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button data-testid="button-whatsapp" className="bg-brand-lime text-brand-dark font-black rounded-full w-full border-0 h-12 hover:bg-brand-lime/90 active:bg-brand-lime transition-all">
                Envíanos un WhatsApp
              </Button>
            </a>
            <Button 
              data-testid="button-chatbot" 
              variant="outline" 
              onClick={() => {
                const event = new CustomEvent('open-chatbot');
                window.dispatchEvent(event);
              }}
              className="rounded-full w-full sm:w-auto h-12 font-black"
            >
              Nuestro Asistente 24/7
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
