import { CheckCircle2, Circle, Clock, FileText, Building2, CreditCard, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressWidgetProps {
  status: string;
  serviceName?: string;
  state?: string;
  requestCode?: string;
  isMaintenance?: boolean;
}

const LLC_STEPS = [
  { id: 'pending', label: 'Pedido Recibido', icon: CreditCard, description: 'Tu pedido ha sido registrado' },
  { id: 'paid', label: 'Pago Confirmado', icon: CheckCircle2, description: 'Pago procesado correctamente' },
  { id: 'processing', label: 'En Tramitación', icon: Clock, description: 'Preparando documentación' },
  { id: 'filed', label: 'Presentado', icon: FileText, description: 'Documentos enviados al estado' },
  { id: 'completed', label: 'LLC Activa', icon: Building2, description: 'Tu LLC está operativa' }
];

const MAINTENANCE_STEPS = [
  { id: 'pending', label: 'Solicitud Recibida', icon: CreditCard, description: 'Tu solicitud está registrada' },
  { id: 'paid', label: 'Pago Confirmado', icon: CheckCircle2, description: 'Pago procesado correctamente' },
  { id: 'processing', label: 'En Proceso', icon: Clock, description: 'Gestionando tu renovación' },
  { id: 'filed', label: 'Presentado', icon: FileText, description: 'Documentos actualizados' },
  { id: 'completed', label: 'Completado', icon: Wrench, description: 'Mantenimiento finalizado' }
];

const STATUS_ORDER = ['pending', 'paid', 'processing', 'filed', 'documents_ready', 'completed'];

export function LLCProgressWidget({ status, serviceName, state, requestCode, isMaintenance = false }: ProgressWidgetProps) {
  const STEPS = isMaintenance ? MAINTENANCE_STEPS : LLC_STEPS;
  const currentIndex = STATUS_ORDER.indexOf(status);
  const progressPercent = currentIndex >= 0 ? Math.min(((currentIndex + 1) / STEPS.length) * 100, 100) : 0;
  
  const getStepStatus = (stepIndex: number) => {
    if (status === 'cancelled') return 'cancelled';
    if (currentIndex < 0) return 'pending';
    if (stepIndex < currentIndex || (stepIndex === currentIndex && status === 'completed')) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const stateLabels: Record<string, string> = {
    new_mexico: 'New Mexico',
    wyoming: 'Wyoming',
    delaware: 'Delaware',
    'New Mexico': 'New Mexico',
    'Wyoming': 'Wyoming',
    'Delaware': 'Delaware'
  };

  if (status === 'cancelled') {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900" data-testid="widget-cancelled">
        <CardHeader className="pb-2 p-3 md:p-4">
          <CardTitle className="text-sm md:text-base flex items-center gap-2 text-red-700 dark:text-red-400">
            <Circle className="h-4 w-4" />
            Pedido Cancelado
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
          <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
            Este pedido ha sido cancelado. Contacta con soporte si tienes dudas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden" data-testid={`widget-progress-${isMaintenance ? 'maintenance' : 'llc'}`}>
      <CardHeader className="pb-2 md:pb-3 p-3 md:p-4 bg-primary/5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-sm md:text-base font-bold flex items-center gap-2">
            {isMaintenance ? (
              <Wrench className="h-4 w-4 md:h-5 md:w-5 text-accent" />
            ) : (
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            )}
            <span className="truncate max-w-[180px] md:max-w-none">
              {serviceName || (isMaintenance ? 'Mantenimiento' : 'Tu LLC')}
            </span>
          </CardTitle>
          {state && (
            <span className="text-[10px] md:text-xs bg-muted px-2 py-0.5 md:py-1 rounded-md font-medium shrink-0">
              {stateLabels[state] || state}
            </span>
          )}
        </div>
        {requestCode && (
          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Ref: {requestCode}</p>
        )}
      </CardHeader>
      <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex justify-between text-[10px] md:text-xs">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-bold text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 md:h-2" />
        </div>

        <div className="relative">
          <div className="absolute left-[9px] md:left-[11px] top-5 md:top-6 bottom-5 md:bottom-6 w-0.5 bg-border" />
          
          <div className="space-y-2 md:space-y-3">
            {STEPS.map((step, index) => {
              const stepStatus = getStepStatus(index);
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-start gap-2 md:gap-3 relative">
                  <div className={`
                    relative z-10 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-colors shrink-0
                    ${stepStatus === 'completed' 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : stepStatus === 'current'
                        ? 'bg-primary/10 border-primary text-primary animate-pulse'
                        : 'bg-background border-muted-foreground/30 text-muted-foreground'
                    }
                  `}>
                    {stepStatus === 'completed' ? (
                      <CheckCircle2 className="h-2.5 w-2.5 md:h-3.5 md:w-3.5" />
                    ) : (
                      <Icon className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pb-1 md:pb-2">
                    <p className={`text-xs md:text-sm font-medium leading-tight ${
                      stepStatus === 'completed' 
                        ? 'text-foreground' 
                        : stepStatus === 'current'
                          ? 'text-primary font-bold'
                          : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-tight hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
