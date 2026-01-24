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
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] sm:w-[350px] max-w-md rounded-[2.5rem] border-0 shadow-2xl overflow-hidden p-0 z-[350] !bg-white">
        <div className="bg-accent h-1.5 w-full" />
        <div className="p-6 sm:p-8 pt-6 sm:pt-8">
          <div className="flex justify-center mb-5">
            <img src={logoIcon} alt="Easy US LLC" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
          </div>
          <DialogHeader className="mb-6 sm:mb-8 text-center">
            <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary leading-tight mb-2">
              Constituye ahora<br />tu LLC
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-xs sm:text-sm">
              Selecciona el estado para comenzar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2.5 sm:gap-3">
            {STATES.map((state) => (
              <button
                key={state.id}
                onClick={() => handleSelect(state.name)}
                className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all text-left w-full active:scale-[0.98] bg-white`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div>
                    <p className="font-black uppercase tracking-tight text-primary text-sm sm:text-base leading-none mb-1">{state.name}</p>
                    <p className="text-accent font-black text-[10px] sm:text-xs">{state.price}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
              </button>
            ))}
          </div>
          
          <p className="mt-6 sm:mt-8 text-[9px] sm:text-[10px] text-center text-gray-400 uppercase font-black tracking-widest opacity-40">
            Expertos en formación de LLC
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
