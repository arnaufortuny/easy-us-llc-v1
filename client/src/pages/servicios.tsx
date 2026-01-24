import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/layout/hero-section";
import { NewsletterSection } from "@/components/layout/newsletter-section";
import type { Product } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronDown, Check, Loader2, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const maintenanceFormSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  mensaje: z.string().min(10, "Cuéntanos más sobre tu LLC"),
  otp: z.string().min(6, "Código de 6 dígitos"),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Servicios() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (window.location.hash === '#pricing') {
      const element = document.getElementById('pricing');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [maintenanceStep, setMaintenanceStep] = useState<"ask" | "form">("ask");
  const [selectedState, setSelectedState] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const { toast } = useToast();

  const mForm = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: { nombre: "", email: "", mensaje: "", otp: "" },
  });

  const sendOtp = async () => {
    const email = mForm.getValues("email");
    if (!email || !z.string().email().safeParse(email).success) {
      toast({ title: "Error", description: "Email inválido", variant: "destructive" });
      return;
    }
    setIsSendingOtp(true);
    try {
      await apiRequest("POST", "/api/contact/send-otp", { email });
      setIsOtpSent(true);
      toast({ 
        title: "¡Código enviado!", 
        description: "Revisa tu bandeja de entrada.",
        variant: "success"
      });
    } catch {
      toast({ title: "Error", description: "No se pudo enviar el código", variant: "destructive" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const email = mForm.getValues("email");
    const otp = mForm.getValues("otp");
    setIsVerifyingOtp(true);
    try {
      await apiRequest("POST", "/api/contact/verify-otp", { email, otp });
      setIsEmailVerified(true);
      toast({ 
        title: "¡Email verificado!", 
        description: "Ya puedes enviar tu mantenimiento.",
        variant: "success"
      });
    } catch {
      toast({ title: "Error", description: "Código incorrecto", variant: "destructive" });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const onMaintenanceSubmit = async (data: MaintenanceFormValues) => {
    try {
      await apiRequest("POST", "/api/contact", {
        ...data,
        apellido: "(Mantenimiento)",
        subject: `Pack Mantenimiento ${selectedState}`,
      });
      toast({ 
        title: "¡Solicitud enviada!", 
        description: "Revisa tu bandeja de entrada.",
        variant: "success"
      });
      mForm.reset();
      setMaintenanceStep("ask");
      setMaintenanceDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Error al enviar la solicitud", variant: "destructive" });
    }
  };

  const handleSelectProduct = (stateName: string) => {
    setLocation(`/application?state=${encodeURIComponent(stateName)}`);
  };

  const handleMaintenanceClick = (stateName: string) => {
    setSelectedState(stateName);
    setMaintenanceDialogOpen(true);
    setMaintenanceStep("ask");
  };

  const packFeatures = [
    "Tasas del estado pagadas",
    "Registered Agent (12 meses)",
    "Articles of Organization",
    "Operating Agreement",
    "EIN del IRS",
    "BOI Report presentado",
    "Dirección nuestra",
    "Asistencia con bancos",
    "Soporte completo 12 meses",
    "Servicio Express"
  ];

  return (
    <div className="min-h-screen font-sans bg-background text-center overflow-x-hidden w-full relative">
      <Navbar />
      
      <HeroSection 
        className="flex flex-col items-center justify-center text-center pt-32 sm:pt-16 min-h-[450px] sm:min-h-[auto] w-full"
        showOverlay={false}
        title={
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-primary uppercase tracking-tight leading-[1.1] text-center">
            Constituimos tu LLC en Estados Unidos de <span className="text-accent">forma simple, rápida y transparente.</span>
          </h1>
        }
        subtitle={
            <motion.div 
              className="flex flex-col items-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
            <motion.div className="text-[13px] sm:text-xl lg:text-2xl text-primary font-medium leading-relaxed max-w-2xl text-center mb-8 sm:mb-12 mx-auto px-2" variants={fadeIn}>
                Todo lo que necesitas saber sobre tu LLC: estructura, impuestos, bancos y cómo trabajamos.
            </motion.div>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl px-4 mb-12"
                variants={fadeIn}
              >
                {[
                  "Tu LLC en 2 días",
                  "Pack Todo Incluido",
                  "Sin IVA",
                  "Precios Transparentes",
                  "Trato Cercano",
                  "Apertura Cuenta Mercury & Relay",
                  "Tarjeta Física de Crédito y Débito"
                ].map((text, i) => (
                  <div 
                    key={i} 
                    className="bg-white text-primary font-black text-sm px-4 py-2 rounded-full border border-primary shadow-sm"
                  >
                    {text}
                  </div>
                ))}
              </motion.div>
            </motion.div>
        }
      />

      <section className="py-12 sm:py-20 bg-background border-t border-primary/5" id="pricing">
        <div className="w-full px-4 sm:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12 flex flex-col items-center justify-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight text-center" variants={fadeIn}>
              <span className="text-accent uppercase tracking-widest text-sm font-black block mb-2 text-center">PACKS</span>
              NUESTROS PACKS
            </motion.h2>
            <motion.p className="text-accent font-black uppercase tracking-wide text-base sm:text-lg mt-1 sm:mt-2 text-center" variants={fadeIn}>
              (Elige el plan que mejor se adapte a ti)
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4 sm:px-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* New Mexico */}
            <motion.div className="border-[2px] border-accent rounded-none overflow-hidden relative bg-background shadow-lg flex flex-col h-full transform transition-all hover:scale-[1.01] hover:shadow-xl group mx-auto w-full max-w-[280px] sm:max-w-none" variants={fadeIn}>
              <div className="p-5 sm:p-6 flex-grow text-center">
                <div className="flex justify-between items-start mb-3 sm:mb-3">
                  <h3 className="text-xl sm:text-xl font-black text-primary uppercase tracking-tight">New Mexico</h3>
                  <span className="bg-accent/20 text-primary text-[10px] sm:text-[11px] font-black px-2 py-1 uppercase">Popular | 2-3 días</span>
                </div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <p className="text-4xl sm:text-4xl font-black text-primary">639€</p>
                  <span className="text-muted-foreground text-xs sm:text-xs font-medium">/año 1</span>
                </div>
                <div className="text-muted-foreground text-[10px] sm:text-[9px] font-black uppercase tracking-widest mb-4 sm:mb-4 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-accent" />
                  Tasas estatales incluidas
                </div>
                  <div className="space-y-2 sm:space-y-2 text-sm sm:text-base mb-4 sm:mb-4 border-t border-accent/10 pt-4 sm:pt-4">
                  {packFeatures.map((f) => (
                    <div key={f} className="flex items-start justify-start gap-2 sm:gap-2 text-primary/80 font-medium text-left leading-tight">
                      <Check className="text-accent w-5 h-5 mt-0.5 flex-shrink-0" /> 
                      <span className="text-xs sm:text-base">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-0">
                <Button 
                  onClick={() => handleSelectProduct("New Mexico")}
                  className="w-full bg-accent text-primary font-black text-sm rounded-none py-4 sm:py-4 border-0 shadow-md hover:bg-accent/90 transition-all transform active:scale-95 h-11 sm:h-11 shadow-accent/20 uppercase"
                >
                  Elegir New Mexico
                </Button>
              </div>
              <div 
                className="bg-accent/5 px-5 py-3 sm:px-5 sm:py-3 border-t border-accent/10 mt-auto text-center cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => handleMaintenanceClick("New Mexico")}
              >
                <p className="font-black text-[10px] sm:text-[9px] uppercase tracking-widest text-primary/70">Mantenimiento Año 2: 349€</p>
              </div>
            </motion.div>

            {/* Wyoming */}
            <motion.div className="border-[2px] border-accent rounded-none overflow-hidden relative bg-background shadow-lg flex flex-col h-full transform transition-all hover:scale-[1.01] hover:shadow-xl group mx-auto w-full max-w-[280px] sm:max-w-none" variants={fadeIn}>
              <div className="p-5 sm:p-6 flex-grow text-center">
                <div className="flex justify-between items-start mb-3 sm:mb-3">
                  <h3 className="text-xl sm:text-xl font-black text-primary uppercase tracking-tight">Wyoming</h3>
                  <span className="bg-primary text-primary-foreground text-[10px] sm:text-[11px] font-black px-2 py-1 uppercase">Premium | 2-3 días</span>
                </div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <p className="text-4xl sm:text-4xl font-black text-primary">799€</p>
                  <span className="text-muted-foreground text-xs sm:text-xs font-medium">/año 1</span>
                </div>
                <div className="text-muted-foreground text-[10px] sm:text-[9px] font-black uppercase tracking-widest mb-4 sm:mb-4 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-accent" />
                  Tasas estatales incluidas
                </div>
                  <div className="space-y-2 sm:space-y-2 text-sm sm:text-base mb-4 sm:mb-4 border-t border-accent/10 pt-4 sm:pt-4">
                  {packFeatures.map((f) => (
                    <div key={f} className="flex items-start justify-start gap-2 sm:gap-2 text-primary/80 font-medium text-left leading-tight">
                      <Check className="text-accent w-5 h-5 mt-0.5 flex-shrink-0" /> 
                      <span className="text-xs sm:text-base">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-0">
                <Button 
                  onClick={() => handleSelectProduct("Wyoming")}
                  className="w-full bg-accent text-primary font-black text-sm rounded-none py-4 sm:py-4 border-0 shadow-md hover:bg-accent/90 transition-all transform active:scale-95 h-11 sm:h-11 shadow-accent/20 uppercase"
                >
                  Elegir Wyoming
                </Button>
              </div>
              <div 
                className="bg-accent/5 px-5 py-3 sm:px-5 sm:py-3 border-t border-accent/10 mt-auto text-center cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => handleMaintenanceClick("Wyoming")}
              >
                <p className="font-black text-[10px] sm:text-[9px] uppercase tracking-widest text-primary/70">Mantenimiento Año 2: 499€</p>
              </div>
            </motion.div>

            {/* Delaware */}
            <motion.div className="border-[2px] border-accent rounded-none overflow-hidden relative bg-background shadow-lg flex flex-col h-full transform transition-all hover:scale-[1.01] hover:shadow-xl group mx-auto w-full max-w-[280px] sm:max-w-none" variants={fadeIn}>
              <div className="p-5 sm:p-6 flex-grow text-center">
                <div className="flex justify-between items-start mb-3 sm:mb-3">
                  <h3 className="text-xl sm:text-xl font-black text-primary uppercase tracking-tight">Delaware</h3>
                  <span className="bg-accent text-primary text-[10px] sm:text-[11px] font-black px-2 py-1 uppercase">Startups | 2-5 días</span>
                </div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <p className="text-4xl sm:text-4xl font-black text-primary">999€</p>
                  <span className="text-muted-foreground text-xs sm:text-xs font-medium">/año 1</span>
                </div>
                <div className="text-muted-foreground text-[10px] sm:text-[9px] font-black uppercase tracking-widest mb-4 sm:mb-4 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-accent" />
                  Tasas estatales incluidas
                </div>
                  <div className="space-y-2 sm:space-y-2 text-sm sm:text-base mb-4 sm:mb-4 border-t border-accent/10 pt-4 sm:pt-4">
                  {packFeatures.map((f) => (
                    <div key={f} className="flex items-start justify-start gap-2 sm:gap-2 text-primary/80 font-medium text-left leading-tight">
                      <Check className="text-accent w-5 h-5 mt-0.5 flex-shrink-0" /> 
                      <span className="text-xs sm:text-base">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-0">
                <Button 
                  onClick={() => handleSelectProduct("Delaware")}
                  className="w-full bg-accent text-primary font-black text-sm rounded-none py-4 sm:py-4 border-0 shadow-md hover:bg-accent/90 transition-all transform active:scale-95 h-11 sm:h-11 shadow-accent/20 uppercase"
                >
                  Elegir Delaware
                </Button>
              </div>
              <div 
                className="bg-accent/5 px-5 py-3 sm:px-5 sm:py-3 border-t border-accent/10 mt-auto text-center cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => handleMaintenanceClick("Delaware")}
              >
                <p className="font-black text-[10px] sm:text-[9px] uppercase tracking-widest text-primary/70">Mantenimiento Año 2: 599€</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-12 sm:mt-16 flex justify-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Button 
              onClick={() => {
                setLocation("/?scroll=servicios");
              }}
              className="group bg-accent text-primary font-black text-sm rounded-none px-8 py-6 h-14 shadow-md hover:bg-accent/90 transition-all transform hover:scale-105 active:scale-95 shadow-accent/20 uppercase"
            >
              ¿Qué incluyen?
              <ChevronDown className="ml-2 w-5 h-5 transition-transform group-hover:translate-y-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-background border-t border-primary/5" id="bancos">
        <div className="w-full px-5 sm:px-8">
          <motion.div 
            className="text-center mb-8 sm:mb-12 flex flex-col items-center justify-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight text-center" variants={fadeIn}>
              <span className="text-accent uppercase tracking-widest text-sm font-black block mb-2 text-center">BANCOS</span>
              Asistencia Bancaria
            </motion.h2>
            <motion.p className="text-accent font-black uppercase tracking-wide text-base sm:text-lg mt-1 sm:mt-2 text-center" variants={fadeIn}>
              (Ayudamos a abrir cuentas en fintech y bancos, si el cliente lo requiere)
            </motion.p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 mb-5 sm:mb-6 max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { title: "Mercury", desc: "Te acompañamos en todo el proceso de solicitud de cuenta en Mercury, ayudándote a presentar correctamente la información de tu LLC." },
              { title: "Relay", desc: "Asistencia en la apertura de cuenta en Relay, una alternativa bancaria sólida para la operativa diaria de tu empresa." },
              { title: "Estrategia bancaria", desc: "Te orientamos sobre la opción bancaria más adecuada según tu tipo de negocio y forma de operar." },
              { title: "Acompañamiento continuo", desc: "Te acompañamos durante el proceso y resolvemos tus dudas hasta que la solicitud queda resuelta." },
            ].map((service, i) => (
              <motion.div key={i} className="p-6 bg-accent/5 rounded-none border border-accent/10 sm:border-accent/10 border-accent/30 hover:bg-accent/10 transition-colors text-center" variants={fadeIn}>
                <span className="inline-flex items-center px-4 py-2 rounded-none bg-accent text-primary font-black text-sm shadow-sm mb-4 uppercase">
                  {service.title}
                </span>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8 mb-12 flex justify-center">
            <div className="bg-accent px-8 py-3 rounded-none shadow-lg transform -rotate-1">
              <p className="text-primary font-sans font-black uppercase tracking-[0.2em] text-sm sm:text-base">
                Incluido en tu paquete inicial
              </p>
            </div>
          </div>

          <div className="border-t border-primary/5 w-full max-w-7xl mx-auto mb-12" />

          <motion.div 
            className="text-center mb-6 sm:mb-10 flex flex-col items-center justify-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary uppercase tracking-tight text-center" variants={fadeIn}>
              <span className="text-accent uppercase tracking-widest text-sm font-black block mb-2 text-center">MANTENIMIENTO</span>
              Packs Mantenimiento
            </motion.h2>
            <motion.p className="text-accent font-black uppercase tracking-wide text-base sm:text-lg mt-1 sm:mt-2 text-center" variants={fadeIn}>(Lo que incluye tu servicio anual)</motion.p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4 sm:px-0 mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { state: "New Mexico", price: "349€", annual: true },
              { state: "Wyoming", price: "499€", annual: true },
              { state: "Delaware", price: "599€", annual: true }
            ].map((item, i) => (
              <motion.div key={i} className="border-[2px] border-accent rounded-none overflow-hidden relative bg-background shadow-lg flex flex-col h-full transform transition-all hover:scale-[1.01] hover:shadow-xl group text-center mx-auto w-full max-w-[280px] sm:max-w-none" variants={fadeIn}>
                <div className="p-5 sm:p-6 flex-grow text-center">
                  <div className="flex justify-between items-start mb-3 sm:mb-3">
                    <h3 className="text-xl sm:text-xl font-black text-primary uppercase tracking-tight">{item.state}</h3>
                    <span className="bg-accent/20 text-primary text-[10px] sm:text-[11px] font-black px-2 py-1 uppercase">Mantenimiento</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <p className="text-4xl sm:text-4xl font-black text-primary">{item.price}</p>
                    <span className="text-muted-foreground text-xs sm:text-xs font-medium">/año</span>
                  </div>
                  <div className="text-muted-foreground text-[10px] sm:text-[9px] font-black uppercase tracking-widest mb-4 sm:mb-4 flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-accent" />
                    Gestión integral anual
                  </div>
                  <div className="space-y-2 sm:space-y-2 text-sm sm:text-base mb-4 sm:mb-4 border-t border-accent/10 pt-4 sm:pt-4">
                    <div className="flex items-start justify-start gap-2 sm:gap-2 text-primary/80 font-medium text-left leading-tight">
                      <Check className="text-accent w-5 h-5 mt-0.5 flex-shrink-0" /> 
                      <span className="text-xs sm:text-base">IRS Form 1120/5472</span>
                    </div>
                    <div className="flex items-start justify-start gap-2 sm:gap-2 text-primary/80 font-medium text-left leading-tight">
                      <Check className="text-accent w-5 h-5 mt-0.5 flex-shrink-0" /> 
                      <span className="text-xs sm:text-base">Annual Report</span>
                    </div>
                    <div className="flex items-start justify-start gap-2 sm:gap-2 text-primary/80 font-medium text-left leading-tight">
                      <Check className="text-accent w-5 h-5 mt-0.5 flex-shrink-0" /> 
                      <span className="text-xs sm:text-base">Registered Agent</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 sm:p-6 pt-0">
                  <Button 
                    onClick={() => handleMaintenanceClick(item.state)}
                    className="w-full bg-accent text-primary font-black text-sm rounded-none py-4 sm:py-4 border-0 shadow-md hover:bg-accent/90 transition-all transform active:scale-95 h-11 sm:h-11 shadow-accent/20 uppercase"
                  >
                    Contratar {item.state}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-background border-t border-primary/5">
        <div className="container max-w-5xl mx-auto px-5">
          <motion.div 
            className="grid md:grid-cols-2 gap-8 md:gap-16 items-start"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="space-y-6 sm:space-y-8" variants={fadeIn}>
              <h2 className="text-3xl sm:text-4xl font-black text-primary uppercase tracking-tight leading-tight">
                ¿QUÉ INCLUYE EL <span className="text-accent">MANTENIMIENTO ANUAL</span>?
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {maintenanceProcess.map((step, i) => (
                  <div key={i} className="flex gap-4 sm:gap-5 group">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-accent text-primary flex items-center justify-center text-lg sm:text-xl font-black rounded-none shadow-sm group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-primary uppercase tracking-tight mb-1">{step.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="bg-accent/5 p-6 sm:p-8 rounded-none border border-accent/20 shadow-xl relative overflow-hidden" variants={fadeIn}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 -mr-12 -mt-12 transform rotate-45" />
              <h3 className="text-xl sm:text-2xl font-black text-primary uppercase tracking-tight mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-accent" />
                Ventajas del Pack
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {maintenanceFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-primary/90 font-medium">
                    <Check className="text-accent w-5 h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-accent/20">
                <Button 
                  onClick={() => setMaintenanceDialogOpen(true)}
                  className="w-full bg-accent text-primary font-black text-sm rounded-none py-6 sm:py-7 border-0 shadow-lg hover:bg-accent/90 active:scale-95 transition-all shadow-accent/20 uppercase"
                >
                  Consultar sobre mantenimiento
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />

      <AnimatePresence>
        {maintenanceDialogOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-auto">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" onClick={() => setMaintenanceDialogOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-[320px] bg-white rounded-none shadow-[0_30px_90px_rgba(0,0,0,0.2)] border border-accent/20 overflow-hidden"
            >
              <button 
                onClick={() => setMaintenanceDialogOpen(false)}
                className="absolute top-2 right-2 p-1 hover:bg-accent/10 rounded-none transition-colors z-[1000001]"
              >
                <X className="w-5 h-5 text-primary/40" />
              </button>
              
              <div className="p-6 text-center">
                <DialogHeader className="mb-4 text-center">
                  <DialogTitle className="text-xs font-black uppercase tracking-tighter text-primary leading-tight text-center w-full">
                    ¿QUIERES EL MANTENIMIENTO DE TU LLC EN {selectedState.toUpperCase()}?
                  </DialogTitle>
                </DialogHeader>

                {maintenanceStep === "ask" ? (
                  <div className="space-y-4">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
                      Si ya tienes tu LLC, nosotros nos encargamos de toda la burocracia anual por ti.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        className="w-full border-primary text-primary font-black text-[10px] h-10 rounded-none uppercase"
                        onClick={() => setMaintenanceDialogOpen(false)}
                      >
                        No, gracias
                      </Button>
                      <Button 
                        className="w-full bg-accent text-primary font-black text-[10px] h-10 rounded-none shadow-md shadow-accent/20 uppercase"
                        onClick={() => setMaintenanceStep("form")}
                      >
                        Sí, ayúdame
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form {...mForm}>
                    <form onSubmit={mForm.handleSubmit(onMaintenanceSubmit)} className="space-y-3">
                      <FormField
                        control={mForm.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="NOMBRE COMPLETO" {...field} className="rounded-none border-primary/20 text-[10px] h-9 font-black uppercase" />
                            </FormControl>
                            <FormMessage className="text-[8px] uppercase font-black" />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <FormField
                          control={mForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="TU EMAIL" {...field} className="rounded-none border-primary/20 text-[10px] h-9 font-black uppercase" />
                              </FormControl>
                              <FormMessage className="text-[8px] uppercase font-black" />
                            </FormItem>
                          )}
                        />
                        {!isEmailVerified && (
                          <Button 
                            type="button" 
                            onClick={sendOtp} 
                            disabled={isSendingOtp}
                            className="bg-primary text-white text-[9px] h-9 px-3 rounded-none font-black uppercase"
                          >
                            {isSendingOtp ? "..." : "OTP"}
                          </Button>
                        )}
                      </div>
                      {isOtpSent && !isEmailVerified && (
                        <div className="flex gap-2">
                          <FormField
                            control={mForm.control}
                            name="otp"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder="CÓDIGO OTP" {...field} className="rounded-none border-primary/20 text-[10px] h-9 font-black uppercase" />
                                </FormControl>
                                <FormMessage className="text-[8px] uppercase font-black" />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="button" 
                            onClick={verifyOtp} 
                            disabled={isVerifyingOtp}
                            className="bg-accent text-primary text-[9px] h-9 px-3 rounded-none font-black uppercase"
                          >
                            {isVerifyingOtp ? "..." : "OK"}
                          </Button>
                        </div>
                      )}
                      <FormField
                        control={mForm.control}
                        name="mensaje"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea placeholder="CUÉNTANOS SOBRE TU LLC..." {...field} className="rounded-none border-primary/20 text-[10px] min-h-[60px] font-black uppercase" />
                            </FormControl>
                            <FormMessage className="text-[8px] uppercase font-black" />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        disabled={!isEmailVerified}
                        className="w-full bg-accent text-primary font-black text-[10px] h-10 rounded-none shadow-md shadow-accent/20 uppercase disabled:opacity-50"
                      >
                        ENVIAR SOLICITUD
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
