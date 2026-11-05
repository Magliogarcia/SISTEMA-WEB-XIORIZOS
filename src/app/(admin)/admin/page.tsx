import Link from "next/link";
import {
  DollarSign,
  CalendarCheck,
  PackageX,
  CreditCard,
  ArrowRight,
  UserCheck,
  Phone,
  Package,
  Scissors,
  User,
  Clock,
  Landmark,
  Banknote,
  Calendar,
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const db = readDB();

  const totalVentas = db.orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const citasPendientes = db.appointments.filter((c) => c.estado === "pendiente").length;
  const pedidosPendientes = db.orders.filter((o) => o.estado === "pendiente_verificacion").length;
  const stockBajo = db.products.filter((p) => p.stock <= 5).length;

  const ultimasCitas = db.appointments.slice(0, 4);
  const ultimosPedidos = db.orders.slice(0, 4);
  const empleadosOperativos = (db.employees || []).filter((e) => e.activo !== false).length;
  const totalEmpleados = (db.employees || []).length;
  const totalProductos = db.products.length;

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            Supervisión operativa y administrativa de Xiorizos en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Sistema Operativo</span>
          </span>
        </div>
      </div>

      {/* 4 Métricas Clave con tipografía firme */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          titulo="Total en Ventas"
          valor={formatCurrency(totalVentas)}
          icon={DollarSign}
          descripcion="Ingresos acumulados de pedidos"
          badgeBg="bg-emerald-50 border-emerald-300"
          badgeText="text-emerald-800"
        />
        <MetricCard
          titulo="Citas Pendientes"
          valor={citasPendientes.toString()}
          icon={CalendarCheck}
          descripcion="Pendientes por confirmar"
          badgeBg="bg-blue-50 border-blue-300"
          badgeText="text-blue-800"
        />
        <MetricCard
          titulo="Pagos por Verificar"
          valor={pedidosPendientes.toString()}
          icon={CreditCard}
          descripcion="Comprobantes de Pago Móvil"
          badgeBg="bg-amber-50 border-amber-300"
          badgeText="text-amber-800"
        />
        <MetricCard
          titulo="Stock Crítico"
          valor={stockBajo.toString()}
          icon={PackageX}
          descripcion="5 o menos unidades en tienda"
          badgeBg="bg-rose-50 border-rose-300"
          badgeText="text-rose-800"
        />
      </div>

      {/* Accesos de Estado del Salón */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-md border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-md bg-amber-50 flex items-center justify-center text-amber-800 border border-amber-200 shrink-0">
              <UserCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Equipo y Especialistas</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                <strong className="text-emerald-700">{empleadosOperativos} de {totalEmpleados}</strong> operativos para agendar citas.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-md text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-100">
            <Link href="/admin/empleados">Gestionar</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-md border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-md bg-blue-50 flex items-center justify-center text-blue-800 border border-blue-200 shrink-0">
              <Package className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Catálogo de Productos</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                <strong className="text-slate-900">{totalProductos} productos</strong> &bull; <strong className="text-rose-600">{stockBajo} con stock bajo</strong>.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-md text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-100">
            <Link href="/admin/productos">Ver Catálogo</Link>
          </Button>
        </div>
      </div>

      {/* 2 Paneles de Operaciones: Distribución ordenada, limpia y sin aglomeración de texto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Próximas Citas Agendadas */}
        <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/70">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Próximas Citas Agendadas
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Clientes agendados en el salón
              </p>
            </div>
            <Link
              href="/admin/citas"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#855230] hover:text-[#5a341c] transition-colors"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {ultimasCitas.length === 0 ? (
              <p className="text-xs font-semibold text-slate-500 py-10 text-center">
                No hay citas agendadas por el momento.
              </p>
            ) : (
              ultimasCitas.map((cita) => (
                <div
                  key={cita.id}
                  className="p-4 hover:bg-slate-50/90 transition-colors space-y-2.5"
                >
                  {/* Fila 1: Cliente, Teléfono y Horario */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {cita.clienteNombre}
                      </span>
                      {cita.clienteTelefono && (
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                          <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                          <span>{cita.clienteTelefono}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{cita.hora}</span>
                      </span>
                      <span className="font-semibold text-xs text-slate-700 hidden sm:inline">
                        {formatDate(new Date(cita.fecha))}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${
                          cita.estado === "confirmada"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : cita.estado === "completada"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : cita.estado === "cancelada"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Fila 2: Chips visuales de Servicio y Especialista (Separados, no apilados en texto plano) */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-md">
                      <Scissors className="h-3.5 w-3.5 text-amber-700" />
                      <span>{cita.servicioNombre}</span>
                      <span className="text-amber-800 font-black">({formatCurrency(cita.servicioPrecio)})</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md">
                      <User className="h-3.5 w-3.5 text-slate-600" />
                      <span>{cita.profesionalNombre}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 2: Pedidos y Verificación de Pagos */}
        <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/70">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Pedidos y Verificación de Pagos
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Compras de productos en tienda
              </p>
            </div>
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#855230] hover:text-[#5a341c] transition-colors"
            >
              <span>Ver pedidos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {ultimosPedidos.length === 0 ? (
              <p className="text-xs font-semibold text-slate-500 py-10 text-center">
                No hay pedidos registrados aún.
              </p>
            ) : (
              ultimosPedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="p-4 hover:bg-slate-50/90 transition-colors space-y-2.5"
                >
                  {/* Fila 1: Cliente, Orden y Total */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {pedido.clienteNombre}
                      </span>
                      <span className="font-mono font-black text-xs bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md">
                        {pedido.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        {formatCurrency(pedido.total)}
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${
                          pedido.estado === "verificado"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : pedido.estado === "entregado"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : pedido.estado === "cancelado"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        {pedido.estado === "pendiente_verificacion"
                          ? "Por Verificar"
                          : pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Fila 2: Chips visuales de Método de Pago y Productos */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {pedido.metodoPago === "pagomovil" ? (
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs px-2.5 py-1 rounded-md">
                        <Landmark className="h-3.5 w-3.5 text-blue-700" />
                        <span>Pago Móvil: {pedido.pagoMovil?.banco || "Banesco"}</span>
                        {pedido.pagoMovil?.referencia && (
                          <span className="font-mono bg-blue-100 text-blue-950 px-1.5 py-0.2 rounded border border-blue-300 font-black">
                            Ref: {pedido.pagoMovil.referencia}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs px-2.5 py-1 rounded-md">
                        <Banknote className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Efectivo al retirar</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md">
                      <Package className="h-3.5 w-3.5 text-slate-600" />
                      <span>{pedido.items.length} producto(s)</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
