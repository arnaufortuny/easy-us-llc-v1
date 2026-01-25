import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/layout/hero-section";
import { Download } from "lucide-react";

export default function Legal() {
  const handleDownload = () => {
    window.open("/assets/terminos_y_condiciones.pdf", "_blank");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      <Navbar />
      
      <HeroSection 
        className="pt-24 sm:pt-32 lg:pt-40"
        title={
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-brand-dark leading-[1.1]">
            Términos y <span className="text-brand-lime">Condiciones</span>
          </h1>
        }
        subtitle={
          <p className="text-lg sm:text-xl text-brand-dark font-medium max-w-2xl mb-12 sm:mb-20">
            Fortuny Consulting LLC - Última actualización: 25 de enero de 2026
          </p>
        }
      />
      
      <section className="py-12 sm:py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-end mb-12">
              <Button 
                onClick={handleDownload}
                variant="outline" 
                className="rounded-full border-brand-lime text-brand-dark hover:bg-brand-lime transition-all gap-2 h-12 px-6 font-bold"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            </div>

            <div className="space-y-12 text-brand-dark leading-relaxed">
              
              <section className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">1. Identidad del prestador del servicio</h2>
                </div>
                <div className="bg-brand-lime/5 border-2 border-brand-lime/20 rounded-2xl p-8 sm:p-10 space-y-4 text-sm sm:text-base font-medium relative overflow-hidden">
                  <p>Easy US LLC es un nombre comercial utilizado para la prestación de servicios administrativos y de gestión empresarial. La entidad legal titular y responsable de los servicios es:</p>
                  <div className="bg-white/50 p-6 rounded-xl border border-brand-lime/20">
                    <p className="font-black text-brand-dark uppercase text-xs tracking-widest mb-2 opacity-50">Entidad Legal</p>
                    <p className="font-bold text-lg mb-4 text-carbon-black">Fortuny Consulting LLC</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <p><strong>Número de registro:</strong> 0008072199</p>
                      <p><strong>EIN:</strong> 98-1906730</p>
                      <p className="sm:col-span-2"><strong>Domicilio social:</strong> 1209 Mountain Road Pl NE, STE R, Albuquerque, New Mexico 87110, Estados Unidos</p>
                    </div>
                  </div>
                  <p>Correo electrónico: info@easyusllc.com | Teléfono: +34 614 916 910</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">2. Ámbito de actividad</h2>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>Fortuny Consulting LLC, bajo la marca Easy US LLC, presta servicios administrativos, de gestión y acompañamiento empresarial, especializados en la constitución y mantenimiento de sociedades de responsabilidad limitada (LLC) en Estados Unidos.</p>
                  <p><strong>Easy US LLC no es un despacho de abogados</strong>, ni una firma de asesoría legal, fiscal o financiera regulada. Toda la información facilitada tiene carácter administrativo, informativo y orientativo. El cliente es responsable de consultar con profesionales cualificados cuando su situación lo requiera.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">3. Servicios ofrecidos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
                  <div className="bg-brand-dark/5 border-2 border-brand-dark/10 rounded-2xl p-8">
                    <ul className="space-y-3 font-medium opacity-90">
                      <li>• Constitución de LLC (NM, WY, DE)</li>
                      <li>• Gestión de Articles of Organization</li>
                      <li>• Elaboración del Operating Agreement</li>
                      <li>• Obtención del EIN ante el IRS</li>
                    </ul>
                  </div>
                  <div className="bg-brand-dark/5 border-2 border-brand-dark/10 rounded-2xl p-8">
                    <ul className="space-y-3 font-medium opacity-90">
                      <li>• Presentación del BOI Report (FinCEN)</li>
                      <li>• Registered Agent (12 meses)</li>
                      <li>• Dirección administrativa</li>
                      <li>• Asistencia en apertura de cuentas</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">4. Packs de constitución y precios</h2>
                </div>
                <div className="bg-brand-lime/5 border-2 border-brand-lime/20 rounded-2xl p-8 sm:p-10 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-brand-lime/20 text-center">
                      <p className="text-2xl font-black text-brand-dark">639€</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Pack New Mexico</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-brand-lime/20 text-center">
                      <p className="text-2xl font-black text-brand-dark">799€</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Pack Wyoming</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-brand-lime/20 text-center">
                      <p className="text-2xl font-black text-brand-dark">999€</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Pack Delaware</p>
                    </div>
                  </div>
                  <p className="text-sm text-center opacity-80">Los precios indicados incluyen las tasas estatales de constitución y los servicios detallados en cada pack.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">5. Plazos de prestación</h2>
                </div>
                <div className="text-sm sm:text-base space-y-4">
                  <p>El plazo estimado de constitución es de 2 a 3 días hábiles tras recibir la información necesaria. En determinados casos, el proceso puede extenderse hasta un máximo de 15 días hábiles debido a verificaciones adicionales o cargas administrativas ajenas a Easy US LLC.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">6. Duración y Registered Agent</h2>
                </div>
                <div className="text-sm sm:text-base space-y-4">
                  <p>Los packs de constitución y mantenimiento tienen una duración de 12 meses. El servicio de Registered Agent se incluye durante los primeros 12 meses. Finalizado dicho periodo, el cliente será responsable de renovar este servicio con Easy US LLC o con un proveedor de su elección.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">7. Pagos y Política de No Reembolso</h2>
                </div>
                <div className="bg-white border-2 border-brand-lime/10 rounded-2xl p-8 sm:p-10 space-y-4 text-sm sm:text-base">
                  <p><strong>7.1. Pago Anticipado:</strong> Todos los servicios deberán ser abonados por adelantado. El pago implica la aceptación expresa de estos Términos.</p>
                  <p><strong>7.2. Ejecución Inmediata:</strong> El servicio se considera iniciado desde la confirmación del pago debido a su carácter personalizado y administrativo.</p>
                  <p><strong>7.3. No Reembolso:</strong> No se admiten reembolsos, totales ni parciales, una vez iniciado el proceso o realizados trámites ante organismos públicos.</p>
                  <p><strong>7.4. Disputas:</strong> El cliente se compromete a no iniciar contracargos (chargebacks). La apertura de una disputa se considera un incumplimiento grave del contrato.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">8. Bancos, Fintech y Terceros</h2>
                </div>
                <div className="text-sm sm:text-base space-y-4">
                  <p>Easy US LLC ofrece asistencia en la apertura de cuentas, pero no garantiza la aprobación de las mismas. Las decisiones finales dependen exclusivamente de las entidades financieras y sus políticas internas de riesgo.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">9. Limitación de Responsabilidad</h2>
                </div>
                <div className="text-sm sm:text-base space-y-4">
                  <p>Easy US LLC no será responsable de pérdidas económicas, consecuencias fiscales o legales derivadas del uso de la LLC. La responsabilidad máxima quedará limitada al importe abonado por el cliente por el servicio contratado.</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-2 h-10 bg-brand-lime rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tighter">10. Jurisdicción</h2>
                </div>
                <div className="bg-brand-dark text-white rounded-2xl p-8 sm:p-12">
                  <p className="text-sm sm:text-base leading-relaxed opacity-90">Este contrato se rige exclusivamente por las leyes del Estado de New Mexico, USA. Cualquier litigio será resuelto en los tribunales de Albuquerque, NM, renunciando el cliente a cualquier otro fuero.</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
