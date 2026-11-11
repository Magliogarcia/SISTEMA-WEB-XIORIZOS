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
  AlertTriangle,
  CalendarOff,
  Ban,
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { readDB } from "@/lib/db";
import { mockServices } from "@/lib/mock-data";

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
  const empleadosOperativos = (db.employees || []).filter(
    (e) => e.activo !== false && (!e.tipoInoperatividad || e.tipoInoperatividad === "activo")
  ).length;
  const totalEmpleados = (db.employees || []).length;
  const totalProductos = db.products.length;

  // Detección automática de personal inoperativo y servicios deshabilitados
  const hoyStr = new Date().toISOString().split("T")[0];

  const serviciosCriticos = mockServices
    .map((servicio) => {
      const especialistasAsignados = (db.employees || []).filter((e) =>
        Array.isArray(e.serviciosIds) && e.serviciosIds.includes(servicio.id)
      );

      const especialistasOperativos = especialistasAsignados.filter((e) => {
        if (e.activo === false) return false;
        if (e.tipoInoperatividad === "reposo" || e.tipoInoperatividad === "vacaciones") {
          if (e.fechaInicioInoperatividad && e.fechaFinInoperatividad) {
            if (hoyStr >= e.fechaInicioInoperatividad && hoyStr <= e.fechaFinInoperatividad) {
              return false;
            }
          } else {
            return false;
          }
        }
        return true;
      });

      return {
        servicio,
        asignados: especialistasAsignados,
        operativos: especialistasOperativos,
        deshabilitado: especialistasAsignados.length > 0 && especialistasOperativos.length === 0,
      };
    })
    .filter((item) => item.deshabilitado);

  const personalEnReposo = (db.employees || []).filter((e) => {
    if (e.activo === false) return true;
    if (e.tipoInoperatividad === "reposo" || e.tipoInoperatividad === "vacaciones") {
      if (e.fechaInicioInoperatividad && e.fechaFinInoperatividad) {
        return hoyStr >= e.fechaInicioInoperatividad && hoyStr <= e.fechaFinInoperatividad;
      }
      return true;
    }
    return false;
  });

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
          {serviciosCriticos.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-rose-50 text-rose-800 border border-rose-300 text-xs font-bold animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              <span>{serviciosCriticos.length} Alerta(s) Operativa(s)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Sistema Operativo</span>
            </span>
          )}
        </div>
      </div>

      {/* Alerta Crítica si algún servicio no tiene personal que lo realice */}
      {serviciosCriticos.length > 0 && (
        <div className="rounded-sm border-2 border-rose-400 bg-rose-50/90 p-4 sm:p-5 shadow-sm space-y-3 font-sans">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-sm bg-rose-600 text-white shrink-0 shadow-xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                  Alerta Crítica: {serviciosCriticos.length} servicio(s) deshabilitado(s) por falta de personal operativo
                </h2>
                <Button asChild size="sm" variant="outline" className="h-7 text-xs font-semibold rounded-sm bg-white border-rose-300 text-rose-800 hover:bg-rose-100 self-start sm:self-auto">
                  <Link href="/admin/empleados">Gestionar personal</Link>
                </Button>
              </div>

              <p className="text-xs text-rose-900 leading-relaxed">
                El sistema detectó que los siguientes servicios no cuentan con ningún colaborador disponible en turno. Han sido <strong>deshabilitados automáticamente en la agenda del cliente</strong> para evitar agendamientos inviables:
              </p>

              <div className="mt-3 space-y-2 pt-1">
                {serviciosCriticos.map(({ servicio, asignados }) => (
                  <div
                    key={servicio.id}
                    className="p-3 bg-white rounded-sm border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{servicio.nombre}</span>
                        <span className="text-[10px] uppercase font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-sm">
                          {servicio.categoria}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800 mt-1 flex items-center gap-1.5 flex-wrap">
                        <CalendarOff className="h-3 w-3 text-rose-600" />
                        <span>
                          Especialista asignada:{" "}
                          <strong>
                            {asignados
                              .map(
                                (e) =>
                                  `${e.nombre} (${e.motivoInoperativo || "En reposo"}${
                                    e.fechaFinInoperatividad ? ` hasta ${e.fechaFinInoperatividad}` : ""
                                  })`
                              )
                              .join(", ")}
                          </strong>
                        </span>
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white self-start sm:self-auto shrink-0 shadow-xs">
                      <Ban className="h-3 w-3" />
                      <span>Deshabilitado en Agenda</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
                {empleadosOperativos} de {totalEmpleados} operativos &bull; {personalEnReposo.length} en reposo/permiso
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
                {totalProductos} productos en catálogo &bull; {stockBajo} en stock crítico
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
