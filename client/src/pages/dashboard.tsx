import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Building2, FileText, Clock, ChevronRight, User, Settings, Package, CreditCard, PlusCircle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

type Tab = 'services' | 'profile' | 'payments' | 'documents';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthenticated, authLoading]);

  const { data: orders, isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { id: 'services', label: 'Mis Servicios', icon: Package },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'payments', label: 'Pagos y Facturas', icon: CreditCard },
    { id: 'profile', label: 'Mi Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans">
      <Navbar />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <p className="text-accent font-black uppercase tracking-widest text-sm mb-2">Área de Clientes</p>
              <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter leading-none">
                {user?.firstName ? `Hola, ${user.firstName}` : 'Mi Panel'}
              </h1>
            </div>
            <Link href="/servicios#pricing">
              <Button className="bg-primary text-white font-black rounded-full px-8 py-6 hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Nueva LLC
              </Button>
            </Link>
          </motion.div>
        </header>

        {/* Desktop Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-tight transition-all whitespace-nowrap ${
                activeTab === item.id 
                ? 'bg-accent text-primary shadow-lg shadow-accent/20 scale-105' 
                : 'bg-white text-muted-foreground hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tight mb-6">Tus Servicios Activos</h2>
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse" />)}
                    </div>
                  ) : orders && Array.isArray(orders) && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <Card key={order.id} className="rounded-[2rem] border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-primary transition-colors">
                                <Building2 className="w-7 h-7" />
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-primary uppercase tracking-tight">{order.product?.name || "Constitución LLC"}</h3>
                                <p className="text-muted-foreground font-medium">Pedido #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.status === 'paid' ? 'Activo' : 'Pendiente Pago'}
                              </span>
                              <Button variant="ghost" className="rounded-full w-12 h-12 p-0 bg-gray-50 group-hover:bg-accent group-hover:text-primary">
                                <ChevronRight className="w-6 h-6" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-16 rounded-[3rem] text-center shadow-sm">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-gray-300" />
                      </div>
                      <h3 className="text-2xl font-black text-primary uppercase mb-3">No tienes servicios aún</h3>
                      <p className="text-muted-foreground mb-8 max-w-md mx-auto">Emprende hoy mismo y constituye tu empresa en Estados Unidos con Easy US LLC.</p>
                      <Link href="/servicios#pricing">
                        <Button className="bg-accent text-primary font-black rounded-full px-10 py-7 text-lg shadow-xl shadow-accent/20">
                          Empezar ahora
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Card className="rounded-[2rem] border-0 shadow-sm">
                    <CardHeader className="p-8">
                      <CardTitle className="text-2xl font-black text-primary uppercase tracking-tight">Información Personal</CardTitle>
                      <CardDescription>Gestiona tus datos de contacto y preferencias.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nombre</label>
                          <div className="p-4 bg-gray-50 rounded-xl font-bold">{user?.firstName || 'No disponible'}</div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Apellido</label>
                          <div className="p-4 bg-gray-50 rounded-xl font-bold">{user?.lastName || 'No disponible'}</div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email de cuenta</label>
                          <div className="p-4 bg-gray-50 rounded-xl font-bold">{user?.email || 'No disponible'}</div>
                        </div>
                      </div>
                      <Button className="w-full md:w-auto bg-primary text-white font-black rounded-full px-8">
                        Guardar cambios
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Card className="rounded-[2.5rem] bg-primary text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="p-10 relative z-10">
                      <div className="flex justify-between items-start mb-12">
                        <CreditCard className="w-12 h-12 text-accent" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Suscripción Activa</span>
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Métodos de Pago</h3>
                      <p className="text-white/60 font-medium mb-8">Gestiona tus tarjetas, facturas y suscripciones a través de Stripe.</p>
                      <a href="https://billing.stripe.com/p/login/test_6oE5mG0Y0" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-accent text-primary font-black rounded-full px-8 py-6 flex items-center gap-2 hover:bg-white transition-colors">
                          Acceder al Portal de Pago <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent opacity-5 rounded-full" />
                  </Card>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-primary uppercase tracking-tight mb-6">Centro de Documentación</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="rounded-[2rem] border-0 shadow-sm p-8 flex flex-col items-center text-center group hover:bg-accent transition-all">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-black text-primary uppercase tracking-tight mb-2">Contrato de Servicio</h3>
                      <p className="text-sm text-muted-foreground mb-6 font-medium">Tus términos aceptados y firmados con Easy US LLC.</p>
                      <Button variant="outline" className="rounded-full font-black border-2 w-full">
                        <Download className="w-4 h-4 mr-2" /> Descargar PDF
                      </Button>
                    </Card>
                    
                    <Card className="rounded-[2rem] border-0 shadow-sm p-8 flex flex-col items-center text-center opacity-50 bg-gray-50/50">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="font-black text-primary uppercase tracking-tight mb-2">Articles of Organization</h3>
                      <p className="text-sm text-muted-foreground mb-6 font-medium">Disponible una vez que el estado procese tu LLC.</p>
                      <Button disabled variant="outline" className="rounded-full font-black border-2 w-full">
                        Pendiente...
                      </Button>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tight text-primary mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> Seguimiento
              </h3>
              <div className="space-y-6">
                {[
                  { title: "Verificación de Datos", status: "completed", date: "Completado" },
                  { title: "Preparación de Documentos", status: "current", date: "En curso" },
                  { title: "Presentación Estatal", status: "pending", date: "Pendiente" },
                  { title: "Obtención de EIN", status: "pending", date: "Pendiente" },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx < 3 && <div className="absolute left-3 top-6 w-0.5 h-10 bg-gray-100" />}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.status === 'completed' ? 'bg-accent text-primary' : 
                      step.status === 'current' ? 'bg-primary text-white border-4 border-accent' : 
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? <Package className="w-3 h-3" /> : null}
                    </div>
                    <div>
                      <p className={`text-sm font-black uppercase tracking-tight ${step.status === 'pending' ? 'text-gray-400' : 'text-primary'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs font-bold text-muted-foreground">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-accent/10 p-8 rounded-[2.5rem] border-2 border-accent/20">
              <h3 className="text-lg font-black uppercase tracking-tight text-primary mb-4">¿Necesitas ayuda?</h3>
              <p className="text-sm text-primary/70 font-medium mb-6 leading-relaxed">Nuestro equipo de expertos está listo para resolver tus dudas sobre la LLC.</p>
              <a href="https://wa.me/34614916910" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-primary text-white font-black rounded-full py-6">
                  Contactar Soporte
                </Button>
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
