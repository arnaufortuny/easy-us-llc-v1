import { Instagram, MessageCircle, Package, Briefcase, PiggyBank, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const links = [
  {
    label: "Instagram",
    href: "https://instagram.com/easyusllc",
    icon: Instagram,
    external: true
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/34612345678",
    icon: MessageCircle,
    external: true
  },
  {
    label: "Ver nuestros paquetes",
    href: "https://easyusllc.com/servicios#pricing",
    icon: Package,
    external: true
  },
  {
    label: "Nuestros servicios",
    href: "https://easyusllc.com/servicios",
    icon: Briefcase,
    external: true
  },
  {
    label: "Ventajas fiscales",
    href: "https://easyusllc.com/#ventajas",
    icon: PiggyBank,
    external: true
  },
  {
    label: "¿Tienes dudas? FAQ",
    href: "https://easyusllc.com/faq",
    icon: HelpCircle,
    external: true
  }
];

export default function LinktreePage() {
  useEffect(() => {
    document.title = "Creamos tu LLC | Tu empresa en Estados Unidos";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Crea tu LLC en Estados Unidos de forma fácil y segura. Formación de empresas en New Mexico, Wyoming y Delaware. Asesoría completa en español.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Crea tu LLC en Estados Unidos de forma fácil y segura. Formación de empresas en New Mexico, Wyoming y Delaware. Asesoría completa en español.';
      document.head.appendChild(meta);
    }

    const ogTags = [
      { property: 'og:title', content: 'Creamos tu LLC | Tu empresa en Estados Unidos' },
      { property: 'og:description', content: 'Formación de LLC en USA para emprendedores hispanohablantes. New Mexico desde 739€.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://creamostullc.com' },
      { property: 'og:site_name', content: 'Creamos tu LLC' }
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    const twitterTags = [
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Creamos tu LLC' },
      { name: 'twitter:description', content: 'Tu empresa en Estados Unidos de forma fácil y segura' }
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2e1a] via-[#134e2a] to-[#1a6b3a] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6EDC8A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#4ade80]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#22c55e]/5 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#6EDC8A] to-[#22c55e] flex items-center justify-center mb-6 shadow-2xl shadow-[#6EDC8A]/40 ring-4 ring-white/10">
          <span className="text-4xl font-black text-white tracking-tight drop-shadow-lg">EU</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center tracking-tight drop-shadow-lg">
          Creamos tu LLC
        </h1>
        <p className="text-sm sm:text-base text-white/70 mb-8 text-center max-w-xs">
          Tu empresa en Estados Unidos de forma fácil y segura
        </p>

        <div className="w-full space-y-3">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="block w-full"
              data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-').replace(/[?¿]/g, '')}`}
            >
              <Button
                className="w-full h-14 bg-[#6EDC8A] hover:bg-[#5cd67a] text-[#0a2e1a] font-bold text-base rounded-xl shadow-lg shadow-[#6EDC8A]/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6EDC8A]/30 active:scale-[0.98] flex items-center justify-center gap-3 border border-[#6EDC8A]/50"
                variant="default"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Button>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Easy US LLC
          </p>
        </div>
      </div>
    </div>
  );
}
