import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface SocialLoginProps {
  mode?: "login" | "connect";
  onSuccess?: () => void;
  googleConnected?: boolean;
  appleConnected?: boolean;
}

export function SocialLogin({ mode = "login", onSuccess, googleConnected, appleConnected }: SocialLoginProps) {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;

    setIsLoadingGoogle(true);
    try {
      const endpoint = mode === "connect" ? "/api/auth/connect/google" : "/api/auth/google";
      const res = await apiRequest("POST", endpoint, {
        credential: credentialResponse.credential,
      });
      const result = await res.json();

      if (mode === "login") {
        await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
        toast({ title: "Bienvenido", description: "Sesion iniciada con Google" });
        setLocation("/dashboard");
      } else {
        toast({ title: "Exito", description: "Cuenta de Google vinculada correctamente" });
        onSuccess?.();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al autenticar con Google",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoadingApple(true);
    try {
      const endpoint = mode === "connect" ? "/api/auth/connect/apple" : "/api/auth/apple";
      toast({
        title: "Apple Sign-In",
        description: "El inicio de sesion con Apple requiere configuracion adicional del servidor",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al autenticar con Apple",
        variant: "destructive",
      });
    } finally {
      setIsLoadingApple(false);
    }
  };

  const handleDisconnect = async (provider: "google" | "apple") => {
    const setLoading = provider === "google" ? setIsLoadingGoogle : setIsLoadingApple;
    setLoading(true);
    try {
      await apiRequest("POST", `/api/auth/disconnect/${provider}`);
      toast({ title: "Exito", description: `Cuenta de ${provider === "google" ? "Google" : "Apple"} desvinculada` });
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || `Error al desvincular ${provider}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === "connect") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <SiGoogle className="w-5 h-5 text-red-500" />
            <span className="font-medium text-sm">Google</span>
          </div>
          {googleConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisconnect("google")}
              disabled={isLoadingGoogle}
              className="text-destructive border-destructive/50"
              data-testid="button-disconnect-google"
            >
              {isLoadingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> : "Desvincular"}
            </Button>
          ) : (
            <div className="overflow-hidden rounded-md">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast({ title: "Error", description: "Error al iniciar Google", variant: "destructive" })}
                size="medium"
                text="signin"
                shape="rectangular"
                theme="outline"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <SiApple className="w-5 h-5" />
            <span className="font-medium text-sm">Apple</span>
          </div>
          {appleConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisconnect("apple")}
              disabled={isLoadingApple}
              className="text-destructive border-destructive/50"
              data-testid="button-disconnect-apple"
            >
              {isLoadingApple ? <Loader2 className="w-4 h-4 animate-spin" /> : "Desvincular"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAppleLogin}
              disabled={isLoadingApple}
              data-testid="button-connect-apple"
            >
              {isLoadingApple ? <Loader2 className="w-4 h-4 animate-spin" /> : "Vincular"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-900 px-2 text-muted-foreground">O continuar con</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full flex justify-center overflow-hidden rounded-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast({ title: "Error", description: "Error al iniciar Google", variant: "destructive" })}
            size="large"
            text="continue_with"
            shape="pill"
            theme="outline"
            width="320"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAppleLogin}
          disabled={isLoadingApple}
          className="w-full rounded-full h-11 font-medium flex items-center justify-center gap-2 bg-black text-white hover:bg-black/90"
          data-testid="button-apple-login"
        >
          {isLoadingApple ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <SiApple className="w-5 h-5" />
              Continuar con Apple
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
