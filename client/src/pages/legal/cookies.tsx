import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { NewsletterSection } from "@/components/layout/newsletter-section";

export default function Cookies() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <Navbar />
      <HeroSection 
        title="Política de Cookies" 
        subtitle={
          <p className="text-lg sm:text-xl text-brand-dark font-medium max-w-2xl mb-8">
            Easy US LLC - Última actualización: 25 de enero de 2026
          </p>
        }
      />
      
      <section className="py-8 sm:py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12 text-brand-dark leading-relaxed">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">1. ¿Qué son las Cookies?</h2>
                </div>
                <div className="text-sm sm:text-base space-y-4">
                  <p>Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestro sitio web. Ayudan a que el sitio funcione correctamente y a mejorar su experiencia de navegación.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">2. Tipos de Cookies que Utilizamos</h2>
                </div>
                <div className="text-sm sm:text-base">
                  <ul className="grid grid-cols-1 gap-4 list-none font-medium">
                    <li className="p-4 bg-brand-lime/5 border border-brand-lime/20 rounded-xl">
                      <strong className="block text-brand-dark mb-1">Cookies Esenciales:</strong> 
                      Necesarias para el funcionamiento básico del sitio, como la autenticación de usuarios y la seguridad.
                    </li>
                    <li className="p-4 bg-brand-lime/5 border border-brand-lime/20 rounded-xl">
                      <strong className="block text-brand-dark mb-1">Cookies de Análisis:</strong> 
                      Nos ayudan a entender cómo los visitantes interactúan con el sitio mediante la recopilación de información anónima.
                    </li>
                    <li className="p-4 bg-brand-lime/5 border border-brand-lime/20 rounded-xl">
                      <strong className="block text-brand-dark mb-1">Cookies de Preferencia:</strong> 
                      Permiten que el sitio recuerde información que cambia la forma en que el sitio se comporta o se ve.
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">3. Gestión de Cookies</h2>
                </div>
                <div className="text-sm sm:text-base space-y-4">
                  <p>Usted puede controlar y/o eliminar las cookies según desee a través de la configuración de su navegador. Tenga en cuenta que si deshabilita las cookies, algunas funciones de este sitio pueden no estar disponibles.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <NewsletterSection />
      <Footer />
    </div>
  );
}
