import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { NewsletterSection } from "@/components/layout/newsletter-section";

export default function Terminos() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <HeroSection title="Términos y Condiciones" />
      <div className="container max-w-4xl mx-auto py-12 sm:py-16 px-5 sm:px-8 text-left">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">1. Servicios y Precios</h2>
          <p className="mb-4 text-sm sm:text-base text-muted-foreground leading-relaxed">Easy US LLC ofrece servicios de formación de empresas en los Estados Unidos. Los precios vigentes son:</p>
          <ul className="list-disc pl-6 mb-6 text-sm sm:text-base text-muted-foreground space-y-2">
            <li><strong>New Mexico LLC:</strong> 639€ (Año 1)</li>
            <li><strong>Wyoming LLC:</strong> 799€ (Año 1)</li>
            <li><strong>Delaware LLC:</strong> 999€ (Año 1)</li>
          </ul>
          
          <p className="mb-4 text-sm sm:text-base text-muted-foreground leading-relaxed">Los servicios de mantenimiento anual tienen los siguientes costes:</p>
          <ul className="list-disc pl-6 mb-8 text-sm sm:text-base text-muted-foreground space-y-2">
            <li><strong>Mantenimiento New Mexico:</strong> 349€/año</li>
            <li><strong>Mantenimiento Wyoming:</strong> 499€/año</li>
            <li><strong>Mantenimiento Delaware:</strong> 599€/año</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">2. Paquetes de Formación</h2>
          <p className="mb-4 text-sm sm:text-base text-muted-foreground leading-relaxed">Cada paquete de formación incluye:</p>
          <ul className="list-disc pl-6 mb-8 text-sm sm:text-base text-muted-foreground space-y-2">
            <li><strong>New Mexico:</strong> Tasas estatales, Agente Registrado (12 meses), Articles of Organization, Operating Agreement, EIN, BOI Report, Declaraciones año 1.</li>
            <li><strong>Wyoming:</strong> Tasas estatales, Agente Registrado (12 meses), Articles of Organization, Operating Agreement, EIN garantizado, BOI Report, Annual Report año 1, Declaraciones año 1.</li>
            <li><strong>Delaware:</strong> Tasas estatales, Agente Registrado (12 meses), Articles of Organization, Operating Agreement, EIN, BOI Report, Declaraciones año 1.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">3. Alcance del Servicio</h2>
          <p className="mb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">Nuestros servicios incluyen la gestión de documentos ante las autoridades estatales y federales correspondientes. No proporcionamos asesoramiento legal o contable específico.</p>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">4. Política de Reembolsos</h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>Dada la naturaleza de los servicios y las tasas gubernamentales no reembolsables:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Una vez iniciada la tramitación ante el estado, no se realizarán reembolsos del importe de las tasas.</li>
              <li>Las cancelaciones antes de iniciar el trámite podrán estar sujetas a una comisión de gestión.</li>
              <li>El servicio de mantenimiento no es reembolsable una vez procesado el pago anual.</li>
            </ul>
          </div>
        </div>
      </div>
      <NewsletterSection />
      <Footer />
    </div>
  );
}
