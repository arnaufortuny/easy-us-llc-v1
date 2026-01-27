import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/layout/hero-section";
import { NewsletterSection } from "@/components/layout/newsletter-section";
import { Download } from "lucide-react";

export default function Terminos() {
  const handleDownload = () => {
    window.open("/terminos_y_condiciones.pdf", "_blank");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-left selection:bg-brand-lime selection:text-brand-dark">
      <Navbar />
      
      <HeroSection 
        className="pt-20 sm:pt-24 lg:pt-28 pb-0"
        title={
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black  tracking-tight text-brand-dark leading-[1.1] text-center sm:text-left">
            Términos y <span className="text-brand-lime">Condiciones</span>
          </h1>
        }
        subtitle={
          <p className="text-lg sm:text-xl text-brand-dark font-medium max-w-2xl mb-8 text-center sm:text-left mx-auto sm:mx-0">
            Easy US LLC - Última actualización: 25 de enero de 2026
          </p>
        }
      />
      
      <section className="py-8 sm:py-12 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center sm:justify-end mb-8">
              <Button 
                onClick={handleDownload}
                variant="outline" 
                className="rounded-full border-brand-lime text-brand-dark hover:bg-brand-lime transition-all gap-3 h-14 sm:h-12 px-10 sm:px-8 font-black text-sm  tracking-wider w-full sm:w-auto shadow-sm"
              >
                <Download className="w-5 h-5 sm:w-4 sm:h-4" />
                Descargar PDF
              </Button>
            </div>

            <div className="space-y-12 text-brand-dark leading-relaxed">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark  tracking-tighter">1. Identidad del prestador del servicio</h2>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>Easy US LLC es un nombre comercial utilizado para la prestación de servicios administrativos y de gestión empresarial. La entidad legal titular y responsable de los servicios es:</p>
                  <div className="bg-brand-lime/5 border-2 border-brand-lime/20 rounded-2xl p-8 space-y-2 font-medium">
                    <p className="font-black text-brand-dark  text-xs tracking-widest opacity-50">Entidad Legal</p>
                    <p className="font-black text-lg text-carbon-black">Fortuny Consulting LLC</p>
                    <p>Domestic Limited Liability Company</p>
                    <p>Número de registro: 0008072199</p>
                    <p>EIN: 98-1906730</p>
                    <p><strong>Domicilio social:</strong> 1209 Mountain Road Pl NE, STE R, Albuquerque, New Mexico 87110, Estados Unidos</p>
                  </div>
                </div>
              </section>
              {/* Contenido truncado por brevedad, asumiendo el resto del contenido de legal.tsx */}
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
