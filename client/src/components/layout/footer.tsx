import { Link, useLocation } from "wouter";
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import relayLogo from "@assets/relay-logo.webp";
import trustpilotLogo from "@assets/trustpilot-logo.png";
import mercuryLogo from "@assets/mercury-logo.png";

export function Footer() {
  const [location, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleHashClick = (href: string) => {
    const sectionId = href.replace('/#', '');
    if (location === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setLocation('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "¡Suscrito!", description: "Revisa tu bandeja de entrada." });
        setEmail("");
      } else {
        toast({ title: "Error", description: data.message || "No se pudo completar la suscripción.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Error de conexión.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t bg-brand-dark text-white py-12 sm:py-20 overflow-hidden font-sans">
      <div className="container max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-black tracking-tighter uppercase text-brand-lime">
                Easy US<span className="text-white"> LLC</span>
              </span>
            </Link>
            <p className="text-white/70 text-base leading-relaxed font-medium max-w-xs">
              Tu LLC en Estados Unidos, creada y gestionada con criterios profesionales, sin complicaciones y con soporte continuo.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/easyusllc" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-lime border-b border-brand-lime/30 pb-1 inline-block">Servicios</h4>
            <nav className="flex flex-col gap-3 text-base text-white/70">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
              <button onClick={() => handleHashClick('/#pricing')} className="hover:text-white transition-colors text-left">Precios</button>
              <button onClick={() => handleHashClick('/#faq')} className="hover:text-white transition-colors text-left">FAQ</button>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-lime border-b border-brand-lime/30 pb-1 inline-block">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="text-brand-lime mt-1 flex-shrink-0" size={18} />
                <a href="mailto:info@easyusllc.com" className="text-white/70 hover:text-white transition-colors font-bold text-sm">info@easyusllc.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-brand-lime mt-1 flex-shrink-0" size={18} />
                <a href="https://wa.me/34614916910" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors font-bold text-sm">+34 614 916 910</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-lime mt-1 flex-shrink-0" size={18} />
                <span className="text-white/70 font-bold text-sm">New Mexico, USA</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-brand-lime border-b border-brand-lime/30 pb-1 inline-block">Newsletter</h4>
            <p className="text-white/70 text-sm font-bold leading-snug">
              Suscríbete para recibir consejos sobre fiscalidad y banca en USA.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group">
                <Input 
                  type="email" 
                  placeholder="Tu email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-full h-12 pr-12 focus:border-brand-lime transition-all"
                  required
                />
                <Button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 h-10 w-10 rounded-full bg-brand-lime text-brand-dark p-0 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-[10px] text-white/30 font-medium px-2">
                Al suscribirte aceptas nuestra política de privacidad. No spam.
              </p>
            </form>
          </div>
        </div>

        {/* Partners section */}
        <div className="mt-10 sm:mt-14 pt-8 border-t border-white/20">
          <p className="text-center text-white/50 text-sm font-black uppercase tracking-widest mb-6">Partners</p>
          <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
            <a href="https://es.trustpilot.com/review/easyusllc.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center gap-2 grayscale hover:grayscale-0">
              <img src={trustpilotLogo} alt="Trustpilot" className="h-6 sm:h-7 w-auto brightness-0 invert" />
            </a>
            <a href="https://mercury.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center gap-2 grayscale hover:grayscale-0">
              <img src={mercuryLogo} alt="Mercury" className="h-6 sm:h-7 w-auto brightness-0 invert" />
            </a>
            <a href="https://relay.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center gap-2 grayscale hover:grayscale-0">
              <img src={relayLogo} alt="Relay" className="h-6 sm:h-7 w-auto brightness-0 invert" />
            </a>
          </div>
        </div>
        
        {/* Legal Disclaimer */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-white/20">
          <p className="text-white/40 text-[10px] leading-relaxed text-center max-w-4xl mx-auto">
            Easy US LLC no es un despacho de abogados ni un asesor fiscal y no puede proporcionar asesoramiento legal o fiscal. Somos especialistas en tramitación administrativa de LLCs y te ofrecemos orientación general basada en nuestra experiencia. La información en nuestro sitio web, así como la compartida por email, WhatsApp y otros canales de comunicación, es únicamente informativa y educativa, no constituye asesoramiento legal ni fiscal. Para decisiones legales o fiscales específicas, consulta con profesionales cualificados de tu jurisdicción. Al usar nuestros servicios y acceder a nuestro sitio web, aceptas nuestros <Link href="/legal" className="underline hover:text-white">Términos y Condiciones</Link> y <Link href="/privacidad" className="underline hover:text-white">Política de Privacidad</Link>.
          </p>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} Easy US LLC. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/legal" className="text-white/40 hover:text-brand-lime transition-colors text-[10px] font-black uppercase tracking-tighter">Aviso Legal</Link>
            <Link href="/privacidad" className="text-white/40 hover:text-brand-lime transition-colors text-[10px] font-black uppercase tracking-tighter">Privacidad</Link>
            <Link href="/cookies" className="text-white/40 hover:text-brand-lime transition-colors text-[10px] font-black uppercase tracking-tighter">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
