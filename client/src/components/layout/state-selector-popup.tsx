import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
      <DialogContent className="sm:max-w-md rounded-[2rem] border-0 shadow-2xl overflow-hidden p-0">
        <div className="bg-brand-lime h-2 w-full" />
        <div className="p-8 pt-6">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black uppercase tracking-tight text-brand-dark leading-none mb-2">
              Selecciona el Estado
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              Elige dónde quieres constituir tu LLC para comenzar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {STATES.map((state) => (
              <button
                key={state.id}
                onClick={() => handleSelect(state.name)}
                className={`group flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 hover:border-brand-lime hover:bg-brand-lime/5 transition-all text-left w-full active:scale-[0.98]`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-dark/5 flex items-center justify-center group-hover:bg-brand-lime group-hover:text-brand-dark transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tight text-brand-dark text-lg leading-none mb-1">{state.name}</p>
                    <p className="text-brand-lime font-black text-sm">{state.price}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-dark transition-colors translate-x-0 group-hover:translate-x-1" />
              </button>
            ))}
          </div>
          
          <p className="mt-8 text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest">
            Expertos en formación de LLC
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
