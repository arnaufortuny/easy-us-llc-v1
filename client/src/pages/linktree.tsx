import { Instagram, MessageCircle, Package, Briefcase, PiggyBank, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  {
    label: "Instagram",
    href: "https://instagram.com/easyusllc",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
    external: true
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/34612345678",
    icon: MessageCircle,
    color: "bg-[#25D366]",
    external: true
  },
  {
    label: "Ver nuestros paquetes",
    href: "https://easyusllc.com/servicios#pricing",
    icon: Package,
    color: "bg-primary",
    external: true
  },
  {
    label: "Nuestros servicios",
    href: "https://easyusllc.com/servicios",
    icon: Briefcase,
    color: "bg-primary",
    external: true
  },
  {
    label: "Ventajas fiscales",
    href: "https://easyusllc.com/#ventajas",
    icon: PiggyBank,
    color: "bg-primary",
    external: true
  },
  {
    label: "¿Tienes dudas? FAQ",
    href: "https://easyusllc.com/faq",
    icon: HelpCircle,
    color: "bg-primary",
    external: true
  }
];

export default function LinktreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E1215] via-[#1a1f24] to-[#0E1215] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-2xl shadow-primary/30 ring-4 ring-primary/20">
          <span className="text-4xl font-black text-white tracking-tight">EU</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center tracking-tight">
          Creamos tu LLC
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mb-8 text-center max-w-xs">
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
                className={`w-full h-14 ${link.color} hover:opacity-90 text-white font-bold text-base rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3`}
                variant="default"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Button>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Easy US LLC
          </p>
        </div>
      </div>
    </div>
  );
}
