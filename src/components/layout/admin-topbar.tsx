"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Menu,
  LayoutDashboard,
  Package,
  CalendarCheck,
  ShoppingCart,
  Users,
  UserCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  X,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth-store";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/citas", label: "Citas Agendadas", icon: CalendarCheck },
  { href: "/admin/pedidos", label: "Pedidos y Pagos", icon: ShoppingCart },
  { href: "/admin/productos", label: "Productos / Catálogo", icon: Package },
  { href: "/admin/empleados", label: "Personal y Equipo", icon: UserCheck },
  { href: "/admin/usuarios", label: "Usuarios Registrados", icon: Users },
];

export function AdminTopbar() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  // Estados de notificaciones en vivo
  const [citasPendientes, setCitasPendientes] = useState(0);
  const [pedidosPendientes, setPedidosPendientes] = useState(0);
  const [stockBajo, setStockBajo] = useState(0);

  useEffect(() => {
    // Cargar datos para notificaciones
    Promise.all([
      fetch("/api/citas").then((r) => r.json()).catch(() => ({ citas: [] })),
      fetch("/api/pedidos").then((r) => r.json()).catch(() => ({ pedidos: [] })),
      fetch("/api/productos").then((r) => r.json()).catch(() => ({ productos: [] })),
    ]).then(([cData, pData, prData]) => {
      if (cData.citas) {
        setCitasPendientes(cData.citas.filter((c: any) => c.estado === "pendiente").length);
      }
      if (pData.pedidos) {
        setPedidosPendientes(
          pData.pedidos.filter((p: any) => p.estado === "pendiente_verificacion").length
        );
      }
      if (prData.productos) {
        setStockBajo(prData.productos.filter((pr: any) => pr.stock <= 5).length);
      }
    });
  }, []);

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const totalNotificaciones = citasPendientes + pedidosPendientes + stockBajo;

  const iniciales =
    user?.nombre
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "AD";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 sticky top-0 z-30">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle className="text-left font-bold text-primary">Xiorizos Admin</SheetTitle>
          </SheetHeader>
          <nav className="space-y-1 p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Estudio Xiorizos &bull; Administración
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Campana de Notificaciones Interactiva con Dropdown Funcional */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Abrir panel de notificaciones"
            title="Notificaciones operativas"
          >
            <Bell className="h-4 w-4" />
            {totalNotificaciones > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
                {totalNotificaciones}
              </span>
            )}
          </button>

          {/* Menú de Notificaciones */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">Notificaciones</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                    {totalNotificaciones}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 py-1">
                {totalNotificaciones === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">
                    No tienes alertas ni notificaciones pendientes.
                  </p>
                ) : (
                  <>
                    {citasPendientes > 0 && (
                      <Link
                        href="/admin/citas"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded hover:bg-blue-50/60 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CalendarCheck className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                            {citasPendientes} cita(s) pendiente(s) de confirmación
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Clientes esperando aprobación de horario
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform mt-1" />
                      </Link>
                    )}

                    {pedidosPendientes > 0 && (
                      <Link
                        href="/admin/pedidos"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded hover:bg-amber-50/60 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-amber-700">
                            {pedidosPendientes} pago(s) móvil por verificar
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Comprueba las referencias bancarias de clientes
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform mt-1" />
                      </Link>
                    )}

                    {stockBajo > 0 && (
                      <Link
                        href="/admin/productos"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded hover:bg-rose-50/60 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-rose-700">
                            {stockBajo} producto(s) con inventario bajo
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Menos de 5 unidades en stock disponible
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform mt-1" />
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Perfil Admin */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Avatar className="h-8 w-8 rounded-md border border-slate-200">
            <AvatarFallback className="bg-primary text-xs font-bold text-white rounded-md">
              {iniciales}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">
              {user?.nombre ?? "Administrador"}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
