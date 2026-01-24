import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import logoIcon from "@/assets/logo-icon.png";

interface StateSelectorPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATES = [
  { id: "NM", name: "New Mexico", price: "639€", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { id: "WY", name: "Wyoming", price: "799€", color: "bg-purple-50 text-purple-700 border-purple-100" },
  { id: "DE", name: "Delaware", price: "999€", color: "bg-amber-50 text-amber-700 border-amber-100" }
];

export function StateSelectorPopup({ isOpen, onOpenChange }: StateSelectorPopupProps) {
  const [, setLocation] = useLocation();

  const handleSelect = async (state: string) => {
    try {
      // Notify admin about activity
      await apiRequest("POST", "/api/activity/track", { 
        action: "CLICK_ELEGIR_ESTADO", 
        details: `Usuario seleccionó ${state}` 
      });
    } catch (e) {
      console.error("Error tracking activity:", e);
    }
    
    onOpenChange(false);
    setLocation(`/application?state=${state}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* ELIMINACIÓN DE BACKDROP OSCURO DEL DIALOG */}
      <DialogContent 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[320px] max-w-md rounded-2xl border-0 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden p-0 z-[99999] !bg-white focus:outline-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{ background: 'white' }}
      >
        <div className="p-6 sm:p-8">
          {/* LOGO SIN CONTENEDORES CIRCULARES, SOLO LA IMAGEN PNG */}
          <div className="flex justify-center mb-4 bg-transparent">
            <img src={logoIcon} alt="Easy US LLC" className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-transparent" style={{ display: 'block', background: 'none', border: 'none', borderRadius: '0' }} />
          </div>
          <DialogHeader className="mb-4 sm:mb-6 text-center">
            <DialogTitle className="text-lg sm:text-xl font-black uppercase tracking-tight text-primary leading-tight">
              Constituye tu LLC
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-2 sm:gap-3">
            {STATES.map((state) => (
              <button
                key={state.id}
                onClick={() => handleSelect(state.name)}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all text-left w-full active:scale-[0.98] bg-white"
              >
                <div className="flex items-center">
                  <div>
                    <p className="font-black uppercase tracking-tight text-primary text-xs sm:text-sm leading-none mb-1">{state.name}</p>
                    <p className="text-accent font-black text-[10px] sm:text-xs">{state.price}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
