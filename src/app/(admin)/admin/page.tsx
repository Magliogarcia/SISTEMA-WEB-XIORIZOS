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
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisión operativa en tiempo real del salón Xiorizos
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Sistema Operativo</span>
          </span>
        </div>
      </div>

      {/* 4 Métricas Clave */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          titulo="Total en Ventas"
          valor={formatCurrency(totalVentas)}
          icon={DollarSign}
          descripcion="Ingresos acumulados en pedidos"
          badgeBg="bg-emerald-50 border-emerald-200"
          badgeText="text-emerald-700"
        />
        <MetricCard
          titulo="Citas Pendientes"
          valor={citasPendientes.toString()}
          icon={CalendarCheck}
          descripcion="Por confirmar en agenda"
          badgeBg="bg-blue-50 border-blue-200"
          badgeText="text-blue-700"
        />
        <MetricCard
          titulo="Pagos por Verificar"
          valor={pedidosPendientes.toString()}
          icon={CreditCard}
          descripcion="Pago Móvil pendiente de revisión"
          badgeBg="bg-amber-50 border-amber-200"
          badgeText="text-amber-700"
        />
        <MetricCard
          titulo="Stock Crítico"
          valor={stockBajo.toString()}
          icon={PackageX}
          descripcion="5 o menos unidades en tienda"
          badgeBg="bg-rose-50 border-rose-200"
          badgeText="text-rose-700"
        />
      </div>

      {/* Accesos de Estado del Salón */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Personal y Especialistas</p>
              <p className="text-xs text-slate-500">
                {empleadosOperativos} de {totalEmpleados} operativos en agenda para clientes.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-md text-xs font-medium border-slate-200 hover:bg-slate-50">
            <Link href="/admin/empleados">Gestionar</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Catálogo de Productos</p>
              <p className="text-xs text-slate-500">
                {totalProductos} productos registrados &bull; {stockBajo} con stock crítico.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-md text-xs font-medium border-slate-200 hover:bg-slate-50">
            <Link href="/admin/productos">Ver Catálogo</Link>
          </Button>
        </div>
      </div>

      {/* 2 Paneles de Operaciones (Esquinas sutiles, fondo blanco nítido, sin curvas excesivas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Citas */}
        <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Próximas Citas Agendadas</h2>
              <p className="text-xs text-slate-500 mt-0.5">Clientes programados en el salón</p>
            </div>
            <Link
              href="/admin/citas"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {ultimasCitas.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No hay citas registradas.</p>
            ) : (
              ultimasCitas.map((cita) => (
                <div key={cita.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{cita.clienteNombre}</p>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          cita.estado === "confirmada"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : cita.estado === "completada"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : cita.estado === "cancelada"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {cita.servicioNombre} &bull; <span className="font-medium text-slate-800">{cita.profesionalNombre}</span>
                    </p>
                    {cita.clienteTelefono && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{cita.clienteTelefono}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900">{cita.hora}</p>
                    <p className="text-xs text-slate-500">{formatDate(new Date(cita.fecha))}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pedidos y Pagos Móviles Recientes */}
        <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Pedidos y Verificación de Pagos</h2>
              <p className="text-xs text-slate-500 mt-0.5">Compras de productos en tienda</p>
            </div>
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <span>Ver pedidos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {ultimosPedidos.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No hay pedidos registrados.</p>
            ) : (
              ultimosPedidos.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-600">{pedido.id}</span>
                      <p className="text-sm font-semibold text-slate-900">{pedido.clienteNombre}</p>
                    </div>
                    <p className="text-xs text-slate-600">
                      Método: <strong className="capitalize text-slate-800">{pedido.metodoPago}</strong>
                      {pedido.pagoMovil && (
                        <span className="ml-1 text-slate-600">
                          ({pedido.pagoMovil.banco} &bull; Ref: <strong className="text-slate-900">{pedido.pagoMovil.referencia}</strong>)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {pedido.items.length} producto(s) &bull; <strong className="text-slate-900">{formatCurrency(pedido.total)}</strong>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        pedido.estado === "verificado"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : pedido.estado === "entregado"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : pedido.estado === "cancelado"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {pedido.estado === "pendiente_verificacion" ? "Pendiente" : pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
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
