import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { User, Phone, Mail, Building2, ShieldCheck, Briefcase, CheckSquare, Trash2, Check, CreditCard, Info, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NewsletterSection } from "@/components/layout/newsletter-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertMaintenanceApplicationSchema } from "@shared/schema";

const formSchema = z.object({
  creationSource: z.string().min(1, "Requerido"),
  ownerFullName: z.string().min(1, "Requerido"),
  ownerPhone: z.string().min(1, "Requerido"),
  ownerEmail: z.string().email("Email inválido"),
  companyName: z.string().min(1, "Requerido"),
  ein: z.string().min(1, "Requerido"),
  state: z.string().min(1, "Requerido"),
  businessActivity: z.string().min(1, "Requerido"),
  expectedServices: z.string().min(1, "Requerido"),
  wantsDissolve: z.string().min(1, "Requerido"),
  otp: z.string().optional(),
  authorizedManagement: z.boolean().refine(val => val === true, "Debes autorizar"),
  termsConsent: z.boolean().refine(val => val === true, "Debes aceptar"),
  dataProcessingConsent: z.boolean().refine(val => val === true, "Debes aceptar"),
});

type FormValues = z.infer<typeof formSchema>;

export default function MaintenanceApplication() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [appId, setAppId] = useState<number | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const stateFromUrl = params.get("state") || "New Mexico";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creationSource: "",
      ownerFullName: "",
      ownerPhone: "",
      ownerEmail: "",
      companyName: "",
      ein: "",
      state: stateFromUrl,
      businessActivity: "",
      expectedServices: "",
      wantsDissolve: "No",
      otp: "",
      authorizedManagement: false,
      termsConsent: false,
      dataProcessingConsent: false
    },
  });

  useEffect(() => {
    async function init() {
      try {
        const productId = stateFromUrl.includes("Wyoming") ? 2 : stateFromUrl.includes("Delaware") ? 3 : 1;
        const res = await apiRequest("POST", "/api/maintenance/orders", { productId, state: stateFromUrl });
        const data = await res.json();
        setAppId(data.application.id);
      } catch (err) {
        console.error("Error initializing maintenance application:", err);
      }
    }
    init();
  }, [stateFromUrl]);

  const nextStep = async () => {
    const stepsValidation: Record<number, (keyof FormValues)[]> = {
      0: ["creationSource"],
      1: ["ownerFullName"],
      2: ["ownerPhone"],
      3: ["ownerEmail"],
      4: ["companyName"],
      5: ["ein"],
      6: ["state"],
      7: ["businessActivity"],
      8: ["expectedServices"],
      9: ["wantsDissolve"],
    };

    const fieldsToValidate = stepsValidation[step];
    if (fieldsToValidate) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (step === 10) {
      if (isEmailVerified) setStep(12);
      else setStep(11);
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const sendOtp = async () => {
    const email = form.getValues("ownerEmail");
    try {
      await apiRequest("POST", `/api/maintenance/${appId}/send-otp`, { email });
      setIsOtpSent(true);
      toast({ title: "Código enviado" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const verifyOtp = async () => {
    const otp = form.getValues("otp");
    try {
      await apiRequest("POST", `/api/maintenance/${appId}/verify-otp`, { otp });
      setIsEmailVerified(true);
      toast({ title: "Email verificado", variant: "success" });
      setStep(12);
    } catch {
      toast({ title: "Código incorrecto", variant: "destructive" });
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await apiRequest("PUT", `/api/maintenance/${appId}`, { ...data, status: "submitted" });
      toast({ title: "Solicitud enviada", variant: "success" });
      setLocation("/contacto?success=true&type=maintenance");
    } catch {
      toast({ title: "Error al enviar", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans w-full">
      <Navbar />
      <main className="pt-24 pb-16 max-w-4xl mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase mb-8 md:mb-12 text-primary leading-tight text-left px-4 sm:px-0">
          Pack de <span className="text-accent">Mantenimiento</span> LLC
        </h1>
        
        <Form {...form}>
          <form className="space-y-6 md:space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* STEP 0: Ya tienes LLC? */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#6EDC8A]" /> 1️⃣ ¿Ya tienes una LLC creada?
                </h2>
                <FormDescription>Para saber desde dónde partimos</FormDescription>
                <FormField control={form.control} name="creationSource" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        {["Sí", "No (en ese caso, te orientamos primero)"].map((opt) => (
                          <label key={opt} className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all active:scale-[0.98]">
                            <input type="radio" {...field} value={opt} checked={field.value === opt} className="w-5 h-5 accent-[#6EDC8A]" />
                            <span className="font-bold text-primary text-sm md:text-base">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="button" onClick={nextStep} className="w-full bg-[#6EDC8A] text-primary font-bold py-7 rounded-full text-lg shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all">Siguiente</Button>
              </motion.div>
            )}

            {/* STEP 1: Nombre Completo */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <User className="w-6 h-6 text-[#6EDC8A]" /> 2️⃣ Nombre completo
                </h2>
                <FormDescription>El de los documentos oficiales</FormDescription>
                <FormField control={form.control} name="ownerFullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
                      Nombre completo:
                    </FormLabel>
                    <FormControl><Input {...field} className="rounded-full h-14 px-6 border-gray-200 focus:border-[#6EDC8A] transition-all font-bold text-primary placeholder:text-primary/30 text-lg" placeholder="Tu nombre" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Teléfono */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <Phone className="w-6 h-6 text-[#6EDC8A]" /> 3️⃣ Teléfono de contacto
                </h2>
                <FormDescription>Para avisos importantes y comunicación rápida</FormDescription>
                <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
                      Teléfono:
                    </FormLabel>
                    <FormControl><Input {...field} className="rounded-full h-14 px-6 border-gray-200 focus:border-[#6EDC8A] transition-all font-bold text-primary placeholder:text-primary/30 text-lg" placeholder="+34..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Email */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <Mail className="w-6 h-6 text-[#6EDC8A]" /> 4️⃣ Email
                </h2>
                <FormDescription>Aquí recibirás recordatorios y documentación</FormDescription>
                <FormField control={form.control} name="ownerEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
                      Email:
                    </FormLabel>
                    <FormControl><Input {...field} type="email" inputMode="email" className="rounded-full h-14 px-6 border-gray-200 focus:border-[#6EDC8A] transition-all font-bold text-primary placeholder:text-primary/30 text-lg" placeholder="email@ejemplo.com" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Nombre Legal LLC */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#6EDC8A]" /> 5️⃣ Nombre legal de la LLC
                </h2>
                <FormDescription>Tal y como figura en los documentos oficiales</FormDescription>
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
                      Nombre de la LLC:
                    </FormLabel>
                    <FormControl><Input {...field} className="rounded-full h-14 px-6 border-gray-200 focus:border-[#6EDC8A] transition-all font-bold text-primary placeholder:text-primary/30 text-lg" placeholder="MI EMPRESA LLC" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: EIN */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#6EDC8A]" /> 6️⃣ EIN
                </h2>
                <FormDescription>El número fiscal de tu empresa en EE. UU.</FormDescription>
                <FormField control={form.control} name="ein" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
                      EIN:
                    </FormLabel>
                    <FormControl><Input {...field} className="rounded-full h-14 px-6 border-gray-200 focus:border-[#6EDC8A] transition-all font-bold text-primary placeholder:text-primary/30 text-lg" placeholder="00-0000000" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Estado de constitución */}
            {step === 6 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                  <Globe className="w-6 h-6 text-accent" /> 7️⃣ Estado de constitución
                </h2>
                <FormDescription>Cada estado tiene sus propios plazos</FormDescription>
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold text-primary flex items-center gap-2">
                      Estado:
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl><SelectTrigger className="rounded-full h-14 px-6 border-gray-200 focus:ring-[#6EDC8A] font-bold text-primary text-lg"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="New Mexico">New Mexico</SelectItem><SelectItem value="Wyoming">Wyoming</SelectItem><SelectItem value="Delaware">Delaware</SelectItem></SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 7: Actividad */}
            {step === 7 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-[#6EDC8A]" /> 8️⃣ Actividad
                </h2>
                <FormDescription>Tipo de negocio o producto</FormDescription>
                <FormField control={form.control} name="businessActivity" render={({ field }) => (
                  <FormItem>
                    <FormControl><Textarea {...field} className="rounded-[2rem] min-h-[120px] p-6 border-gray-200 focus:border-[#6EDC8A] transition-all font-bold text-primary placeholder:text-primary/30 text-lg" placeholder="A qué se dedica tu LLC..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 8: Servicios */}
            {step === 8 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <CheckSquare className="w-6 h-6 text-[#6EDC8A]" /> 9️⃣ ¿Qué necesitas gestionar?
                </h2>
                <FormDescription>Marca lo que aplique</FormDescription>
                <FormField control={form.control} name="expectedServices" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        {["Recordatorios y cumplimiento anual", "Presentación de documentos obligatorios", "Soporte durante el año", "Revisión general de la situación de la LLC"].map(opt => (
                          <label key={opt} className="flex items-center gap-3 p-4 rounded-[2rem] border border-gray-200 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all active:scale-[0.98]">
                            <Checkbox 
                              checked={field.value?.split(", ").includes(opt)}
                              onCheckedChange={(checked) => {
                                const current = field.value ? field.value.split(", ") : [];
                                const next = checked ? [...current, opt] : current.filter(v => v !== opt);
                                field.onChange(next.join(", "));
                              }}
                              className="border-gray-200 data-[state=checked]:bg-[#6EDC8A] data-[state=checked]:border-[#6EDC8A]"
                            />
                            <span className="font-bold text-sm text-primary">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 9: Disolver? */}
            {step === 9 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <Trash2 className="w-6 h-6 text-[#6EDC8A]" /> 1️⃣0️⃣ ¿Deseas disolver tu LLC?
                </h2>
                <FormDescription>Si necesitas cerrar la empresa de forma correcta y ordenada</FormDescription>
                <FormField control={form.control} name="wantsDissolve" render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        {["No", "Sí, quiero disolver mi LLC", "Quiero que me expliquéis primero el proceso"].map((opt) => (
                          <label key={opt} className="flex items-center gap-3 p-4 rounded-full border border-gray-200 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all active:scale-[0.98]">
                            <input type="radio" {...field} value={opt} checked={field.value === opt} className="w-5 h-5 accent-[#6EDC8A]" />
                            <span className="font-bold text-primary text-sm md:text-base">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Verificar Email</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 10: Autorización y Consentimiento */}
            {step === 10 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#6EDC8A]" /> 1️⃣1️⃣ Confirmación final
                </h2>
                <div className="bg-accent/5 p-6 rounded-[2rem] border border-[#6EDC8A]/20 space-y-4">
                  <p className="text-sm font-bold text-primary/80">Revisa que tus datos sean correctos antes de proceder a la verificación.</p>
                  <div className="space-y-3">
                    <FormField control={form.control} name="authorizedManagement" render={({ field }) => (
                      <FormItem className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 border-gray-200 data-[state=checked]:bg-[#6EDC8A] data-[state=checked]:border-[#6EDC8A]" /></FormControl>
                        <span className="text-[10px] md:text-xs font-bold text-primary leading-tight">Autorizo a Fortuny Consulting LLC a realizar las gestiones en mi nombre.</span>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="dataProcessingConsent" render={({ field }) => (
                      <FormItem className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 border-gray-200 data-[state=checked]:bg-[#6EDC8A] data-[state=checked]:border-[#6EDC8A]" /></FormControl>
                        <span className="text-[10px] md:text-xs font-bold text-primary leading-tight">Acepto el tratamiento de mis datos personales para la gestión de esta solicitud.</span>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="termsConsent" render={({ field }) => (
                      <FormItem className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1 border-gray-200 data-[state=checked]:bg-[#6EDC8A] data-[state=checked]:border-[#6EDC8A]" /></FormControl>
                        <span className="text-[10px] md:text-xs font-bold text-primary leading-tight">He leído y acepto los términos del servicio y la política de privacidad.</span>
                      </FormItem>
                    )} />
                  </div>
                </div>
                <div className="flex gap-3 max-w-md mx-auto">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-bold border-gray-200 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                  <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-bold rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Verificar Email</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 11: OTP Verification */}
            {step === 11 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left px-4 sm:px-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase text-primary border-b border-[#6EDC8A]/20 pb-2 leading-tight flex items-center gap-2">
                  <Mail className="w-6 h-6 text-[#6EDC8A]" /> 1️⃣2️⃣ Verifica tu email
                </h2>
                <div className="space-y-4">
                  {!isOtpSent ? (
                    <Button type="button" onClick={sendOtp} className="w-full bg-[#6EDC8A] text-primary font-bold py-7 rounded-full text-lg shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all">Enviar código a {form.getValues("ownerEmail")}</Button>
                  ) : (
                    <div className="space-y-4">
                      <FormField control={form.control} name="otp" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input {...field} className="rounded-full h-16 text-center text-3xl font-black tracking-[0.5em] border-accent/30 focus:border-accent text-primary placeholder:text-primary/20" placeholder="000000" maxLength={6} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="button" onClick={verifyOtp} className="w-full bg-[#6EDC8A] text-primary font-bold py-7 rounded-full text-lg shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all">Validar Código</Button>
                      <button type="button" onClick={sendOtp} className="w-full text-[#6EDC8A] font-black text-xs uppercase tracking-widest hover:underline">Reenviar código</button>
                    </div>
                  )}
                </div>
                <Button type="button" variant="ghost" onClick={() => setStep(10)} className="w-full font-bold text-primary/50 text-sm">Volver al resumen</Button>
              </motion.div>
            )}

            {/* STEP 12: Final Submit */}
            {step === 12 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center px-4 sm:px-0">
                <div className="w-20 h-20 bg-[#6EDC8A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-[#6EDC8A]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-primary leading-tight">¡Email Verificado!</h2>
                <p className="text-primary/70 font-medium text-lg leading-relaxed">Todo listo para enviar tu solicitud de mantenimiento para {stateFromUrl}.</p>
                <div className="pt-6">
                  <Button type="submit" className="w-full bg-[#6EDC8A] text-primary font-bold py-8 rounded-full text-xl shadow-2xl shadow-[#6EDC8A]/30 hover:scale-[1.02] active:scale-95 transition-all">
                    Enviar Solicitud Ahora
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </Form>
      </main>
      <NewsletterSection />
      <Footer />
    </div>
  );
}
