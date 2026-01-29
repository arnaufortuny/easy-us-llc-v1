import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Check, ShieldCheck, Mail, Building2, Loader2, MessageCircle, Info, Upload, CreditCard, Calendar, User, Phone, Globe, MapPin, Briefcase, HelpCircle, Lock, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { StepProgress } from "@/components/ui/step-progress";
import { useFormDraft } from "@/hooks/use-form-draft";

const TOTAL_STEPS = 12;

const BUSINESS_CATEGORIES = [
  "Tecnología y Software (SaaS, desarrollo web/apps, IT services)",
  "E-commerce (tienda online, dropshipping, Amazon FBA)",
  "Consultoría y Servicios Profesionales (consultoría, coaching, asesoría)",
  "Marketing y Publicidad (agencia digital, social media, SEO/SEM)",
  "Educación y Formación (cursos online, academia digital, e-learning)",
  "Contenido Digital y Medios (producción audiovisual, podcast, influencer)",
  "Diseño y Creatividad (diseño gráfico, fotografía, web design)",
  "Servicios Financieros (contabilidad, gestión fiscal, inversiones)",
  "Salud y Bienestar (coaching wellness, nutrición online, fitness)",
  "Inmobiliaria (inversión, gestión de propiedades)",
  "Importación / Exportación (comercio internacional, distribución)",
  "Servicios Legales (preparación de documentos, servicios paralegal)",
  "Trading e Inversiones (forex, criptomonedas, bolsa)",
  "Entretenimiento (gaming, eventos, producción)",
  "Retail y Comercio (venta minorista, distribución de productos)",
  "Otra (especificar)"
];

const formSchema = z.object({
  ownerFullName: z.string().min(1, "Requerido"),
  ownerPhone: z.string().min(1, "Requerido"),
  ownerEmail: z.string().email("Email inválido"),
  ownerBirthDate: z.string().min(1, "Requerido"),
  ownerIdType: z.string().min(1, "Requerido"),
  ownerIdNumber: z.string().min(1, "Requerido"),
  ownerCountryResidency: z.string().min(1, "Requerido"),
  ownerAddress: z.string().min(1, "Requerido"),
  companyName: z.string().min(1, "Requerido"),
  businessActivity: z.string().min(1, "Requerido"),
  businessCategory: z.string().min(1, "Requerido"),
  needsBankAccount: z.string().min(1, "Requerido"),
  notes: z.string().optional(),
  otp: z.string().optional(),
  password: z.string().optional(),
  paymentMethod: z.string().optional(),
  dataProcessingConsent: z.boolean().refine(val => val === true, "Debes aceptar"),
  termsConsent: z.boolean().refine(val => val === true, "Debes aceptar"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationWizard() {
  const { user, isAuthenticated, refetch: refetchAuth } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [requestCode, setRequestCode] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [existingUserName, setExistingUserName] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const stateFromUrl = params.get("state") || "New Mexico";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerFullName: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerBirthDate: "",
      ownerIdType: "DNI",
      ownerIdNumber: "",
      ownerCountryResidency: "",
      ownerAddress: "",
      companyName: "",
      businessActivity: "",
      businessCategory: "",
      needsBankAccount: "",
      notes: "",
      otp: "",
      password: "",
      paymentMethod: "transfer",
      dataProcessingConsent: false,
      termsConsent: false
    },
  });

  const prevStepRef = useRef(step);
  const direction = step > prevStepRef.current ? "forward" : "backward";
  
  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);

  const formDefaults = {
    ownerFullName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerBirthDate: "",
    ownerIdType: "DNI",
    ownerIdNumber: "",
    ownerCountryResidency: "",
    ownerAddress: "",
    companyName: "",
    businessActivity: "",
    businessCategory: "",
    needsBankAccount: "",
    notes: "",
    otp: "",
    password: "",
    paymentMethod: "transfer",
    dataProcessingConsent: false,
    termsConsent: false
  };

  const { clearDraft } = useFormDraft({
    form,
    storageKey: "application-wizard-draft",
    debounceMs: 1000,
    defaultValues: formDefaults,
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const addressParts = [
        user.address,
        user.streetType,
        user.city,
        user.province,
        user.postalCode,
        user.country
      ].filter(Boolean);
      const fullAddress = addressParts.join(", ");
      
      form.reset({
        ...form.getValues(),
        ownerFullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        ownerEmail: user.email || "",
        ownerPhone: user.phone || "",
        ownerAddress: fullAddress || form.getValues().ownerAddress,
        ownerCountryResidency: user.country || form.getValues().ownerCountryResidency,
        businessActivity: user.businessActivity || form.getValues().businessActivity,
      });
      if (user.emailVerified) {
        setIsEmailVerified(true);
      }
    }
  }, [isAuthenticated, user, form]);

  const checkEmailExists = async (email: string) => {
    setIsCheckingEmail(true);
    try {
      const res = await apiRequest("POST", "/api/auth/check-email", { email });
      const data = await res.json();
      setEmailExists(data.exists);
      setExistingUserName(data.firstName || "");
      return data.exists;
    } catch {
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const nextStep = async () => {
    const stepsValidation: Record<number, (keyof FormValues)[]> = {
      0: ["ownerFullName"],
      1: ["ownerPhone"],
      2: ["ownerEmail"],
      3: ["ownerBirthDate"],
      4: ["ownerIdType", "ownerIdNumber"],
      5: ["ownerCountryResidency"],
      6: ["ownerAddress"],
      7: ["companyName"],
      8: ["businessActivity"],
      9: ["businessCategory"],
      10: ["needsBankAccount"],
      11: ["notes"],
    };

    const fieldsToValidate = stepsValidation[step];
    if (fieldsToValidate) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (step === 2) {
      const email = form.getValues("ownerEmail");
      const exists = await checkEmailExists(email);
      if (exists && !isAuthenticated) {
        setStep(12);
        return;
      }
    }

    if (step === 11) {
      if (isAuthenticated || isEmailVerified) {
        setStep(14);
      } else {
        setStep(13);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleLogin = async () => {
    const email = form.getValues("ownerEmail");
    const password = form.getValues("password");
    
    if (!password || password.length < 1) {
      toast({ title: "Introduce tu contraseña", variant: "destructive" });
      return;
    }

    try {
      const res = await apiRequest("POST", "/api/login", { email, password });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.message || "Contraseña incorrecta", variant: "destructive" });
        return;
      }
      await refetchAuth();
      setIsEmailVerified(true);
      toast({ title: "Sesión iniciada correctamente" });
      setStep(3);
    } catch {
      toast({ title: "Error al iniciar sesión", variant: "destructive" });
    }
  };

  const sendOtp = async () => {
    const email = form.getValues("ownerEmail");
    try {
      const res = await apiRequest("POST", "/api/register/send-otp", { email });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.message || "Error", variant: "destructive" });
        return;
      }
      setIsOtpSent(true);
      toast({ title: "Código enviado a tu email" });
    } catch {
      toast({ title: "Error al enviar código", variant: "destructive" });
    }
  };

  const verifyOtp = async () => {
    const email = form.getValues("ownerEmail");
    const otp = form.getValues("otp");
    try {
      const res = await apiRequest("POST", "/api/register/verify-otp", { email, otp });
      if (!res.ok) {
        toast({ title: "Código incorrecto", variant: "destructive" });
        return;
      }
      setIsEmailVerified(true);
      toast({ title: "Email verificado" });
      setStep(14);
    } catch {
      toast({ title: "Código incorrecto", variant: "destructive" });
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const productId = stateFromUrl.includes("Wyoming") ? 2 : stateFromUrl.includes("Delaware") ? 3 : 1;
      
      if (isAuthenticated) {
        const res = await apiRequest("POST", "/api/orders", { productId });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Error al crear pedido");
        }
        const orderData = await res.json();
        
        await apiRequest("PUT", `/api/llc/${orderData.application.id}`, {
          ...data,
          state: stateFromUrl,
          status: "submitted"
        });
        
        setRequestCode(orderData.application.requestCode || "");
        toast({ title: "Solicitud enviada correctamente" });
        clearDraft();
        setLocation(`/contacto?success=true&type=llc&orderId=${encodeURIComponent(orderData.application.requestCode || "")}`);
      } else {
        if (!data.password || data.password.length < 8) {
          toast({ title: "La contraseña debe tener al menos 8 caracteres", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        
        const res = await apiRequest("POST", "/api/orders", {
          productId,
          email: data.ownerEmail,
          password: data.password,
          ownerFullName: data.ownerFullName,
          paymentMethod: data.paymentMethod || "transfer"
        });
        
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Error al crear pedido");
        }
        
        const orderData = await res.json();
        
        await apiRequest("PUT", `/api/llc/${orderData.application.id}`, {
          ...data,
          state: stateFromUrl,
          status: "submitted"
        });
        
        setRequestCode(orderData.application.requestCode || "");
        toast({ title: "Solicitud enviada y cuenta creada" });
        clearDraft();
        setLocation(`/contacto?success=true&type=llc&orderId=${encodeURIComponent(orderData.application.requestCode || "")}`);
      }
    } catch (err: any) {
      toast({ title: err.message || "Error al enviar", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans w-full">
      <Navbar />
      <main className="pt-24 pb-16 max-w-4xl mx-auto px-5 sm:px-6 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black mb-4 text-primary leading-tight text-center">
          Constituir mi <span className="text-accent">LLC</span>
        </h1>
        
        {!isAuthenticated && (
          <div className="mb-8 flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">¿Ya tienes cuenta?</span>
            <Link href="/login">
              <button className="text-primary font-black hover:underline">Inicia sesión</button>
            </Link>
          </div>
        )}
        
        <div>
          <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} className="mb-6" />
          <div className="space-y-6">
            <Form {...form}>
              <form className="space-y-6 md:space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                
                {step === 0 && (
                  <div key="step-0" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <User className="w-6 h-6 text-accent" /> 1️⃣ ¿Cómo te llamas?
                    </h2>
                    <FormDescription>Tal y como aparece en tu documento oficial</FormDescription>
                    <FormField control={form.control} name="ownerFullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                          Nombre completo:
                        </FormLabel>
                        <FormControl><Input {...field} className="rounded-full h-14 px-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-owner-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="button" onClick={nextStep} className="w-full bg-[#6EDC8A] text-primary font-black py-7 rounded-full text-lg shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all" data-testid="button-next-step">Siguiente</Button>
                  </div>
                )}

                {step === 1 && (
                  <div key="step-1" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Phone className="w-6 h-6 text-accent" /> 2️⃣ Teléfono de contacto
                    </h2>
                    <FormDescription>Para comunicarnos contigo rápidamente si hace falta</FormDescription>
                    <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                          Teléfono:
                        </FormLabel>
                        <FormControl><Input {...field} className="rounded-full h-14 px-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base" data-testid="button-prev">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base" data-testid="button-next">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div key="step-2" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Mail className="w-6 h-6 text-accent" /> 3️⃣ Email
                    </h2>
                    <FormDescription>Aquí recibirás toda la documentación y avisos importantes</FormDescription>
                    <FormField control={form.control} name="ownerEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                          Email:
                        </FormLabel>
                        <FormControl><Input {...field} type="email" inputMode="email" className="rounded-full h-14 px-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-email" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} disabled={isCheckingEmail} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">
                        {isCheckingEmail ? <Loader2 className="animate-spin" /> : "Siguiente"}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 12 && emailExists && !isAuthenticated && (
                  <div key="step-login" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Lock className="w-6 h-6 text-accent" /> ¡Hola de nuevo{existingUserName ? `, ${existingUserName}` : ""}!
                    </h2>
                    <p className="text-muted-foreground">
                      Ya tienes una cuenta con este email. Introduce tu contraseña para continuar.
                    </p>
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary">Contraseña:</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input {...field} type={showPassword ? "text" : "password"} className="rounded-full h-14 px-6 pr-12 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-password" />
                          </FormControl>
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="button" onClick={handleLogin} className="w-full bg-[#6EDC8A] text-primary font-black py-7 rounded-full text-lg shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all" data-testid="button-login">
                      Iniciar Sesión y Continuar
                    </Button>
                    <Link href="/forgot-password" className="block text-center text-sm text-muted-foreground hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                    <Button type="button" variant="link" onClick={() => { setEmailExists(false); setStep(2); }} className="w-full text-sm">
                      Usar otro email
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div key="step-3" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-accent" /> 4️⃣ Fecha de nacimiento
                    </h2>
                    <FormField control={form.control} name="ownerBirthDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                          Fecha:
                        </FormLabel>
                        <FormControl><Input {...field} type="date" className="rounded-full h-14 px-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-birthdate" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div key="step-4" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-accent" /> 5️⃣ Documento de identidad
                    </h2>
                    <div className="space-y-4">
                      <FormField control={form.control} name="ownerIdType" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-black text-[10px] text-primary">Tipo de documento:</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-3">
                              {["DNI", "Pasaporte"].map((opt) => (
                                <label key={opt} className="flex items-center gap-3 p-4 rounded-full border border-black/20 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all active:scale-[0.98]">
                                  <input type="radio" {...field} value={opt} checked={field.value === opt} className="w-5 h-5 accent-[#6EDC8A]" />
                                  <span className="font-black text-primary text-sm md:text-base">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="ownerIdNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                            Número del documento:
                          </FormLabel>
                          <FormControl><Input {...field} className="rounded-full h-14 px-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-id-number" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div key="step-5" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Globe className="w-6 h-6 text-accent" /> 6️⃣ País de residencia
                    </h2>
                    <FormField control={form.control} name="ownerCountryResidency" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                          País:
                        </FormLabel>
                        <FormControl><Input {...field} className="rounded-full h-14 px-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-country" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div key="step-6" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-accent" /> 7️⃣ Dirección completa
                    </h2>
                    <FormDescription>Calle, número, ciudad, código postal y país</FormDescription>
                    <FormField control={form.control} name="ownerAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                          Dirección:
                        </FormLabel>
                        <FormControl><Textarea {...field} className="rounded-[2rem] min-h-[120px] p-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div key="step-7" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-accent" /> 8️⃣ Nombre deseado para la LLC
                    </h2>
                    <FormDescription>Si tienes varias opciones, pon la principal aquí</FormDescription>
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-black text-primary flex items-center gap-2">
                          Nombre deseado:
                        </FormLabel>
                        <FormControl><Input {...field} className="rounded-full h-14 px-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-company-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div key="step-8" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-accent" /> 9️⃣ Actividad del negocio
                    </h2>
                    <FormDescription>Explícanos brevemente a qué se dedicará tu empresa, con tus propias palabras</FormDescription>
                    <FormField control={form.control} name="businessActivity" render={({ field }) => (
                      <FormItem>
                        <FormControl><Textarea {...field} className="rounded-[2rem] min-h-[120px] p-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-business-activity" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 9 && (
                  <div key="step-9" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-accent" /> 🔟 Categoría de negocio
                    </h2>
                    <FormField control={form.control} name="businessCategory" render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl><SelectTrigger className="rounded-full h-14 px-6 border-black/20 focus:ring-[#6EDC8A] font-black text-primary text-lg" data-testid="select-category"><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {BUSINESS_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 10 && (
                  <div key="step-10" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-accent" /> 1️⃣1️⃣ ¿Necesitas cuenta bancaria?
                    </h2>
                    <FormDescription>Te ayudamos a abrirla en bancos como Mercury o Relay</FormDescription>
                    <FormField control={form.control} name="needsBankAccount" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <div className="flex flex-col gap-3">
                            {["Sí", "No", "Ya tengo una"].map((opt) => (
                              <label key={opt} className="flex items-center gap-3 p-4 rounded-full border border-black/20 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all active:scale-[0.98]">
                                <input type="radio" {...field} value={opt} checked={field.value === opt} className="w-5 h-5 accent-[#6EDC8A]" />
                                <span className="font-black text-primary text-sm md:text-base">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 11 && (
                  <div key="step-11" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-accent" /> 1️⃣2️⃣ ¿Algo más que debamos saber?
                    </h2>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormControl><Textarea {...field} className="rounded-[2rem] min-h-[120px] p-6 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-notes" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="button" onClick={nextStep} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base">Siguiente</Button>
                    </div>
                  </div>
                )}

                {step === 13 && !isAuthenticated && (
                  <div key="step-otp" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <Mail className="w-6 h-6 text-accent" /> Verificación de Email
                    </h2>
                    {!isOtpSent ? (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground">Para continuar, debemos verificar tu correo electrónico: <strong>{form.getValues("ownerEmail")}</strong></p>
                        <Button type="button" onClick={sendOtp} className="w-full bg-accent text-primary font-black py-7 rounded-full text-lg shadow-lg" data-testid="button-send-otp">Enviar Código</Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <FormField control={form.control} name="otp" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-black">Ingresa el código de 6 dígitos:</FormLabel>
                            <FormControl><Input {...field} className="rounded-full h-14 text-center text-2xl tracking-[0.5em] font-black" maxLength={6} inputMode="numeric" data-testid="input-otp" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="button" onClick={verifyOtp} className="w-full bg-[#6EDC8A] text-primary font-black py-7 rounded-full text-lg shadow-lg shadow-[#6EDC8A]/20" data-testid="button-verify-otp">Verificar y Continuar</Button>
                        <button type="button" onClick={sendOtp} className="w-full text-xs text-muted-foreground hover:underline">Reenviar código</button>
                      </div>
                    )}
                    <Button type="button" variant="link" onClick={() => setStep(11)} className="w-full">Atrás</Button>
                  </div>
                )}

                {step === 14 && (
                  <div key="step-final" className="space-y-6 text-left">
                    <h2 className="text-xl md:text-2xl font-black text-primary border-b border-accent/20 pb-2 leading-tight flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-accent" /> Último paso: Confirmación
                    </h2>
                    
                    {!isAuthenticated && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                        <FormField control={form.control} name="password" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm md:text-base font-black text-primary">Crea una contraseña para tu cuenta (mínimo 8 caracteres):</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input {...field} type={showPassword ? "text" : "password"} className="rounded-full h-14 px-6 pr-12 border-black/20 focus:border-[#6EDC8A] transition-all font-black text-primary text-lg" data-testid="input-new-password" />
                              </FormControl>
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    )}

                    <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                      <h3 className="font-black text-primary">Método de pago:</h3>
                      <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <div className="flex flex-col gap-3">
                              <label className="flex items-start gap-3 p-4 rounded-2xl border border-black/20 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all">
                                <input type="radio" {...field} value="transfer" checked={field.value === "transfer"} className="w-5 h-5 mt-1 accent-[#6EDC8A]" />
                                <div>
                                  <span className="font-black text-primary text-sm md:text-base block">Transferencia bancaria</span>
                                  <span className="text-xs text-muted-foreground">Fortuny Consulting LLC - Cuenta: 141432778929495 - Routing: 121145433 - Column N.A.</span>
                                </div>
                              </label>
                              <label className="flex items-start gap-3 p-4 rounded-2xl border border-black/20 bg-white hover:border-[#6EDC8A] cursor-pointer transition-all">
                                <input type="radio" {...field} value="link" checked={field.value === "link"} className="w-5 h-5 mt-1 accent-[#6EDC8A]" />
                                <div>
                                  <span className="font-black text-primary text-sm md:text-base block">Enlace de pago</span>
                                  <span className="text-xs text-muted-foreground">Te enviaremos un enlace seguro por email</span>
                                </div>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="space-y-4">
                      <FormField control={form.control} name="dataProcessingConsent" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-2xl bg-gray-50">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-privacy" /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs md:text-sm font-medium">Acepto el tratamiento de mis datos personales según la política de privacidad.</FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="termsConsent" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-2xl bg-gray-50">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-terms" /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs md:text-sm font-medium">He leído y acepto los Términos y Condiciones de Easy US LLC.</FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )} />
                    </div>
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Button type="button" variant="outline" onClick={() => setStep(11)} className="flex-1 rounded-full h-12 md:h-14 font-black border-black/20 active:scale-95 transition-all text-sm md:text-base">Atrás</Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#6EDC8A] text-primary font-black rounded-full h-12 md:h-14 shadow-lg shadow-[#6EDC8A]/20 active:scale-95 transition-all text-sm md:text-base" data-testid="button-submit">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Enviar Solicitud"}
                      </Button>
                    </div>
                  </div>
                )}
                
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
