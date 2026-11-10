import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  CalendarCheck,
  PackageX,
  CreditCard,
  ArrowRight,
  UserCheck,
  Phone,
  Package,
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  // Protección estricta en el servidor contra accesos no autenticados
  const cookieStore = cookies();
  const role = cookieStore.get("xiorizos_role")?.value;
  if (!role || (role !== "admin" && role !== "empleado" && role !== "estilista")) {
    redirect("/admin/login");
  }

  const db = readDB();

  // Mapa de costos por producto para cálculo exacto de ganancia
  const mapaCostos = new Map<string, number>();
  db.products.forEach((p) => {
    mapaCostos.set(p.id, p.costo !== undefined ? p.costo : p.precio * 0.55);
  });

  // Cálculo automático de ganancia neta en ventas de productos deduciendo su coste
  let totalGanancia = 0;
  let totalVentas = 0;

  db.orders.forEach((o) => {
    if (o.estado !== "cancelado") {
      totalVentas += o.total || 0;
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const costoUnitario = mapaCostos.get(item.productId) ?? item.precio * 0.55;
          const gananciaUnitaria = item.precio - costoUnitario;
          totalGanancia += gananciaUnitaria * (item.cantidad || 1);
        });
      }
    }
  });

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Sistema Operativo</span>
          </span>
        </div>
      </div>

      {/* 4 Métricas Clave */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          titulo="Ganancia en Productos"
          valor={formatCurrency(totalGanancia)}
          icon={TrendingUp}
          descripcion={`Margen neto (Ventas: ${formatCurrency(totalVentas)})`}
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
        <div className="flex items-center justify-between p-4 rounded-sm border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Personal y Especialistas</p>
              <p className="text-xs text-slate-500">
                {empleadosOperativos} de {totalEmpleados} especialistas operativos en turno
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-sm border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50">
            <Link href="/admin/empleados">Gestionar</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-sm border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Inventario y Catálogo</p>
              <p className="text-xs text-slate-500">
                {totalProductos} productos activos en tienda online
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-sm border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50">
            <Link href="/admin/productos">Inventario</Link>
          </Button>
        </div>
      </div>

      {/* Paneles de Actividad Reciente */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Panel 1: Citas Recientes */}
        <div className="rounded-sm border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Citas de Clientes
              </h2>
              <p className="text-[11px] text-slate-500">Últimas solicitudes agendadas</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              <Link href="/admin/citas" className="flex items-center gap-1">
                <span>Ver todas</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {ultimasCitas.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400">
                No hay citas agendadas todavía.
              </p>
            ) : (
              ultimasCitas.map((cita) => (
                <div
                  key={cita.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {cita.clienteNombre}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {cita.servicioNombre} &bull; Con {cita.profesionalNombre}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{formatDate(new Date(cita.fecha))} ({cita.hora})</span>
                      {cita.clienteTelefono && (
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <Phone className="h-2.5 w-2.5" />
                          <span>{cita.clienteTelefono}</span>
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider border ${
                        cita.estado === "confirmada"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : cita.estado === "cancelada"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {cita.estado}
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {formatCurrency(cita.servicioPrecio)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 2: Pedidos Recientes */}
        <div className="rounded-sm border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Pedidos de Productos
              </h2>
              <p className="text-[11px] text-slate-500">Ventas en tienda online</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              <Link href="/admin/pedidos" className="flex items-center gap-1">
                <span>Ver todos</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {ultimosPedidos.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400">
                No hay pedidos registrados todavía.
              </p>
            ) : (
              ultimosPedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {pedido.clienteNombre}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pedido.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {pedido.items?.length || 1} producto(s) &bull; Pago Móvil
                    </p>
                    {pedido.pagoMovil && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        Ref: {pedido.pagoMovil.referencia} ({pedido.pagoMovil.banco})
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider border ${
                        pedido.estado === "verificado"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : pedido.estado === "cancelado"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {pedido.estado === "pendiente_verificacion"
                        ? "Por Verificar"
                        : pedido.estado}
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {formatCurrency(pedido.total)}
                    </p>
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
