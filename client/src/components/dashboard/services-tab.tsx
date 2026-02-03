import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { AlertCircle, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LLCProgressWidget } from "@/components/llc-progress-widget";
import { getOrderStatusLabel } from "./types";

interface ServicesTabProps {
  orders: any[] | undefined;
  draftOrders: any[];
  activeOrders: any[];
}

export function ServicesTab({ orders, draftOrders, activeOrders }: ServicesTabProps) {
  const { t } = useTranslation();

  return (
    <div key="services" className="space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Mis trámites</h2>
        <p className="text-sm text-muted-foreground mt-1">Gestiona tus trámites activos</p>
      </div>
      
      {draftOrders.map((order) => {
        const abandonedAt = order.application?.abandonedAt || order.maintenanceApplication?.abandonedAt;
        const hoursRemaining = abandonedAt ? Math.max(0, Math.round((48 - ((Date.now() - new Date(abandonedAt).getTime()) / 3600000)))) : null;
        return (
        <div key={`draft-banner-${order.id}`} className="rounded-2xl shadow-md bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 overflow-hidden flex" data-testid={`banner-pending-application-${order.id}`}>
          <div className="w-1 bg-yellow-500 flex-shrink-0" />
          <div className="p-4 md:p-5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-semibold text-foreground">Solicitud pendiente de completar</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.maintenanceApplication 
                      ? `Mantenimiento ${order.maintenanceApplication.state || ''}`
                      : order.application?.companyName 
                        ? `${order.application.companyName} LLC`
                        : `${order.application?.state || 'Tu LLC'}`
                    }
                    {hoursRemaining !== null && (
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold ml-2">
                        · Se eliminará en {hoursRemaining}h
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Link href={order.maintenanceApplication ? "/llc/maintenance" : "/llc/formation"} data-testid={`link-continue-application-${order.id}`}>
                <Button className="bg-accent text-primary font-bold rounded-full" size="sm" data-testid={`button-continue-application-${order.id}`}>
                  Continuar solicitud
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );})}
      
      {(!orders || orders.length === 0) ? (
        <Card className="rounded-2xl border-0 shadow-sm bg-white dark:bg-card p-6 md:p-8 text-center">
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 md:mb-2 text-center">Aún no tienes servicios activos</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 text-center">Empieza hoy y constituye tu LLC en EE. UU. en pocos pasos.</p>
            </div>
            <Link href="/servicios#pricing">
              <Button className="bg-accent text-accent-foreground font-semibold rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base" data-testid="button-view-packs">
                Ver planes disponibles
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {activeOrders.map((order) => (
              <LLCProgressWidget 
                key={`progress-${order.id}`}
                status={order.status}
                serviceName={
                  order.maintenanceApplication 
                    ? `Mant. ${order.maintenanceApplication.state || order.product?.name?.replace(' LLC', '') || ''}`
                    : order.application?.companyName 
                      ? `${order.application.companyName} LLC`
                      : order.product?.name || 'Tu LLC'
                }
                state={order.application?.state || order.maintenanceApplication?.state}
                requestCode={order.application?.requestCode || order.maintenanceApplication?.requestCode || order.invoiceNumber}
                isMaintenance={!!order.maintenanceApplication}
              />
            ))}
          </div>
          
          {orders.length > 0 && (
            <div className="mt-4 md:mt-6">
              <h3 className="text-xs md:text-sm font-bold text-muted-foreground mb-2 md:mb-3">Todos los Pedidos</h3>
              <div className="space-y-2 md:space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="rounded-lg md:rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-card overflow-hidden" data-testid={`card-order-${order.id}`}>
                    <div className="flex items-center justify-between p-3 md:p-4 gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[9px] md:text-[10px] font-bold text-accent uppercase tracking-wider">
                            {order.application?.requestCode || order.maintenanceApplication?.requestCode || order.invoiceNumber || `#${order.id}`}
                          </p>
                          <Badge className={`${getOrderStatusLabel(order.status, t).className} font-bold uppercase text-[8px] md:text-[9px] px-1.5 py-0`} data-testid={`badge-order-status-${order.id}`}>
                            {getOrderStatusLabel(order.status, t).label}
                          </Badge>
                        </div>
                        <p className="text-sm md:text-base font-bold text-primary truncate">
                          {order.maintenanceApplication 
                            ? `Mantenimiento ${order.maintenanceApplication.state || ''}`
                            : order.application?.companyName 
                              ? `${order.application.companyName} LLC`
                              : order.product?.name || 'LLC pendiente'
                          }
                        </p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {order.application?.state || order.maintenanceApplication?.state || ''}
                          {order.createdAt && ` · ${new Date(order.createdAt).toLocaleDateString('es-ES')}`}
                        </p>
                      </div>
                      {order.status === 'pending' && order.application && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-[9px] md:text-[10px] h-7 md:h-8 px-2 md:px-3 rounded-full font-bold shrink-0"
                          onClick={() => window.location.href = `/llc/formation?edit=${order.application.id}`}
                          data-testid={`button-modify-order-${order.id}`}
                        >
                          Modificar
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
