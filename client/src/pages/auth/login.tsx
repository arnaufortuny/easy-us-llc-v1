import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FormInput } from "@/components/forms";

const loginSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => setLoginError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const res = await apiRequest("POST", "/api/auth/login", data);
      const result = await res.json();
      
      if (result.success) {
        await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
        toast({ title: "Bienvenido de nuevo", description: "Sesión iniciada correctamente" });
        setLocation("/dashboard");
      }
    } catch (err: any) {
      let errorMsg = "Error al iniciar sesión";
      if (err.message?.includes("401")) {
        errorMsg = "Email o contraseña incorrectos";
      } else if (err.message?.includes("404")) {
        errorMsg = "Usuario no encontrado";
      } else if (err.message) {
        errorMsg = err.message;
      }
      setLoginError(errorMsg);
      toast({ 
        title: "Error de autenticación", 
        description: errorMsg, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-sm md:max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">
              Iniciar <span className="text-accent">sesion</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Accede a tu area de cliente</p>
          </div>

          {loginError && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
              <p className="text-destructive font-medium text-xs md:text-sm">{loginError}</p>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-border shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  inputMode="email"
                />

                <div className="relative">
                  <FormInput
                    control={form.control}
                    name="password"
                    label="Contrasena"
                    type={showPassword ? "text" : "password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    aria-label={showPassword ? "Ocultar" : "Mostrar"}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="text-center">
                  <Link href="/forgot-password">
                    <Button variant="link" className="text-accent p-0 h-auto text-xs md:text-sm" data-testid="link-forgot-password">
                      Recuperar contrasena
                    </Button>
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-primary font-black rounded-full h-11 md:h-12 text-sm md:text-base shadow-lg shadow-accent/20"
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-5 border-t border-border text-center">
              <p className="text-muted-foreground text-xs md:text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/register">
                  <span className="font-black text-primary hover:text-accent transition-colors cursor-pointer" data-testid="link-register">
                    Registrate
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
