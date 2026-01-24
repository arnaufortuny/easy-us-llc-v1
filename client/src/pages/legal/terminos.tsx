import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { Button } from "@/components/ui/button";

export default function Terminos() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <HeroSection title="Términos y Condiciones" />
      <div className="container max-w-4xl mx-auto py-16 px-5 sm:px-8">
        <h2 className="text-2xl font-bold mb-6">1. Servicios y Precios</h2>
        <p className="mb-4 text-muted-foreground leading-relaxed">Easy US LLC ofrece servicios de formación de empresas en los Estados Unidos. Los precios vigentes son:</p>
        <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
          <li><strong>New Mexico LLC:</strong> 639€ (Año 1)</li>
          <li><strong>Wyoming LLC:</strong> 799€ (Año 1)</li>
          <li><strong>Delaware LLC:</strong> 999€ (Año 1)</li>
        </ul>
        
        <p className="mb-4 text-muted-foreground leading-relaxed">Los servicios de mantenimiento anual tienen los siguientes costes:</p>
        <ul className="list-disc pl-6 mb-8 text-muted-foreground space-y-2">
          <li><strong>Mantenimiento New Mexico:</strong> 349€/año</li>
          <li><strong>Mantenimiento Wyoming:</strong> 499€/año</li>
          <li><strong>Mantenimiento Delaware:</strong> 599€/año</li>
        </ul>

        <h2 className="text-2xl font-bold mb-6">2. Alcance del Servicio</h2>
        <p className="mb-6 text-muted-foreground leading-relaxed">Nuestros servicios incluyen la gestión de documentos ante las autoridades estatales y federales correspondientes. No proporcionamos asesoramiento legal o contable específico.</p>

        <h2 className="text-2xl font-bold mb-6">3. Política de Reembolsos</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>Dada la naturaleza de los servicios y las tasas gubernamentales no reembolsables:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Una vez iniciada la tramitación ante el estado, no se realizarán reembolsos del importe de las tasas.</li>
            <li>Las cancelaciones antes de iniciar el trámite podrán estar sujetas a una comisión de gestión.</li>
            <li>El servicio de mantenimiento no es reembolsable una vez procesado el pago anual.</li>
          </ul>
        </div>
      </div>
      <section className="py-8 sm:py-14 bg-muted/40">
        <div className="container max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-lg sm:text-2xl font-bold text-primary mb-4 uppercase">¿Necesitas ayuda?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Si tienes dudas sobre nuestros términos y condiciones, 
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
