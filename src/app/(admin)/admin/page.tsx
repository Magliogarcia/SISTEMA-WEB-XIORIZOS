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
  BarChart3,
  PieChart,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Scissors,
  ShoppingBag,
  Calendar,
  Layers,
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

  // Cálculo de ganancia y ventas
  let totalGanancia = 0;
  let totalVentas = 0;

  // Agrupación de ventas diarias para la gráfica de barras
  const ventasPorDia = new Map<string, { ventas: number; ganancia: number; pedidos: number }>();

  db.orders.forEach((o) => {
    if (o.estado !== "cancelado") {
      totalVentas += o.total || 0;
      let gananciaOrden = 0;
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const costoUnitario = mapaCostos.get(item.productId) ?? item.precio * 0.55;
          const gananciaUnitaria = item.precio - costoUnitario;
          const g = gananciaUnitaria * (item.cantidad || 1);
          totalGanancia += g;
          gananciaOrden += g;
        });
      }

      if (o.creadoEn) {
        const dia = o.creadoEn.split("T")[0];
        const actual = ventasPorDia.get(dia) || { ventas: 0, ganancia: 0, pedidos: 0 };
        actual.ventas += o.total || 0;
        actual.ganancia += gananciaOrden;
        actual.pedidos += 1;
        ventasPorDia.set(dia, actual);
      }
    }
  });

  // Métricas de citas
  const totalCitas = db.appointments.length || 1;
  const citasConfirmadas = db.appointments.filter((c) => c.estado === "confirmada").length;
  const citasPendientes = db.appointments.filter((c) => c.estado === "pendiente").length;
  const citasCompletadas = db.appointments.filter((c) => c.estado === "completada").length;
  const citasCanceladas = db.appointments.filter((c) => c.estado === "cancelada").length;

  const pctConfirmadas = Math.round((citasConfirmadas / totalCitas) * 100);
  const pctPendientes = Math.round((citasPendientes / totalCitas) * 100);
  const pctCompletadas = Math.round((citasCompletadas / totalCitas) * 100);
  const pctCanceladas = Math.round((citasCanceladas / totalCitas) * 100);

  // Top servicios más solicitados
  const conteoServicios: Record<string, number> = {};
  db.appointments.forEach((c) => {
    if (c.servicioNombre) {
      conteoServicios[c.servicioNombre] = (conteoServicios[c.servicioNombre] || 0) + 1;
    }
  });
  const topServicios = Object.entries(conteoServicios)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([nombre, count]) => ({
      nombre,
      count,
      pct: Math.round((count / totalCitas) * 100),
    }));

  // Métricas de pedidos
  const totalPedidos = db.orders.length || 1;
  const pedidosPendientes = db.orders.filter((o) => o.estado === "pendiente_verificacion").length;
  const pedidosVerificados = db.orders.filter((o) => o.estado === "verificado" || o.estado === "entregado").length;
  const pedidosCancelados = db.orders.filter((o) => o.estado === "cancelado").length;
  const tasaAprobacion = Math.round((pedidosVerificados / totalPedidos) * 100);

  // Días ordenados para la gráfica (últimos 6 registros con actividad)
  const ultimosDias = Array.from(ventasPorDia.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6);

  const maxVentaDia = Math.max(...ultimosDias.map(([, d]) => d.ventas), 120);

  const stockBajo = db.products.filter((p) => p.stock <= 5).length;

  // 1. Balance Global de Facturación del Negocio (Servicios vs Tienda & Composición de Pagos)
  const citasValidas = db.appointments.filter((c) => c.estado !== "cancelada");
  const totalFacturacionCitas = citasValidas.reduce((acc, c) => acc + (c.servicioPrecio || 0), 0);
  const totalAbonosCitas = citasValidas.reduce(
    (acc, c) => acc + (c.montoReserva || Math.round((c.servicioPrecio || 0) * 0.2 * 100) / 100),
    0
  );
  const totalRestanteCitas = totalFacturacionCitas - totalAbonosCitas;
  const totalFacturacionGlobal = totalFacturacionCitas + totalVentas;
  const pctServicios = totalFacturacionGlobal > 0 ? Math.round((totalFacturacionCitas / totalFacturacionGlobal) * 100) : 50;
  const pctTienda = 100 - pctServicios;

  // 2. Ocupación Semanal del Salón (Distribución por día de la semana)
  const diasSemanaMap: { [key: number]: { nombre: string; abreviado: string; count: number } } = {
    1: { nombre: "Lunes", abreviado: "Lun", count: 0 },
    2: { nombre: "Martes", abreviado: "Mar", count: 0 },
    3: { nombre: "Miércoles", abreviado: "Mié", count: 0 },
    4: { nombre: "Jueves", abreviado: "Jue", count: 0 },
    5: { nombre: "Viernes", abreviado: "Vie", count: 0 },
    6: { nombre: "Sábado", abreviado: "Sáb", count: 0 },
    0: { nombre: "Domingo", abreviado: "Dom", count: 0 },
  };

  db.appointments.forEach((c) => {
    if (c.fecha && c.estado !== "cancelada") {
      try {
        const parts = c.fecha.split("-").map(Number);
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          const diaNum = d.getDay();
          if (diasSemanaMap[diaNum]) {
            diasSemanaMap[diaNum].count += 1;
          }
        }
      } catch {
        // ignore
      }
    }
  });

  const diasSemanaOrdenados = [
    diasSemanaMap[2], // Mar
    diasSemanaMap[3], // Mié
    diasSemanaMap[4], // Jue
    diasSemanaMap[5], // Vie
    diasSemanaMap[6], // Sáb
    diasSemanaMap[1], // Lun
    diasSemanaMap[0], // Dom
  ];
  const maxCitasPorDia = Math.max(...diasSemanaOrdenados.map((d) => d.count), 1);
  const diaPico = [...diasSemanaOrdenados].sort((a, b) => b.count - a.count)[0];

  // 3. Distribución de Inventario por Categoría
  const inventarioPorCategoria: Record<string, { stock: number; totalValor: number; count: number }> = {};
  db.products.forEach((p) => {
    const cat = p.categoria || "General";
    if (!inventarioPorCategoria[cat]) {
      inventarioPorCategoria[cat] = { stock: 0, totalValor: 0, count: 0 };
    }
    inventarioPorCategoria[cat].stock += p.stock || 0;
    inventarioPorCategoria[cat].totalValor += (p.stock || 0) * (p.precio || 0);
    inventarioPorCategoria[cat].count += 1;
  });

  const categoriasInventario = Object.entries(inventarioPorCategoria).map(([categoria, info]) => ({
    categoria,
    stock: info.stock,
    totalValor: info.totalValor,
    count: info.count,
  })).sort((a, b) => b.stock - a.stock);

  const totalStockGeneral = categoriasInventario.reduce((acc, c) => acc + c.stock, 0) || 1;
  const maxStockCategoria = Math.max(...categoriasInventario.map((c) => c.stock), 1);
  const totalValorInventario = categoriasInventario.reduce((acc, c) => acc + c.totalValor, 0);

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
    <div className="space-y-6 font-sans">
      {/* Encabezado Principal */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisión analítica y operativa en tiempo real del estudio Xiorizos
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

      {/* Alerta Crítica si algún servicio no tiene personal */}
      {serviciosCriticos.length > 0 && (
        <div className="rounded-sm border-2 border-rose-400 bg-rose-50/90 p-4 sm:p-5 shadow-sm space-y-3 font-sans">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-sm bg-rose-600 text-white shrink-0 shadow-xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                  Alerta Crítica: {serviciosCriticos.length} servicio(s) deshabilitado(s) por inoperatividad
                </h2>
                <Button asChild size="sm" variant="outline" className="h-7 text-xs font-semibold rounded-sm bg-white border-rose-300 text-rose-800 hover:bg-rose-100 self-start sm:self-auto">
                  <Link href="/admin/empleados">Gestionar personal</Link>
                </Button>
              </div>

              <p className="text-xs text-rose-900 leading-relaxed">
                El sistema detectó personal ausente. Se deshabilitaron automáticamente en la agenda del cliente para evitar reservas inviables:
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
          titulo="Ganancia Neta en Tienda"
          valor={formatCurrency(totalGanancia)}
          icon={TrendingUp}
          descripcion={`Ventas totales: ${formatCurrency(totalVentas)}`}
          badgeBg="bg-emerald-50 border-emerald-200"
          badgeText="text-emerald-700"
        />
        <MetricCard
          titulo="Citas por Atender"
          valor={citasPendientes.toString()}
          icon={CalendarCheck}
          descripcion={`${citasConfirmadas} confirmadas activas`}
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

      {/* SECCIÓN DE GRÁFICAS DINÁMICAS Y VISUALES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Gráfica 1: Flujo de Ventas y Ganancia (Columnas SVG proporcionales) */}
        <div className="lg:col-span-7 rounded-sm border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Rendimiento de Ventas Diarias
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Comparativa de facturación bruta y ganancia neta en tienda
                  </p>
                </div>
              </div>

              {/* Leyenda visual */}
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-800" />
                  <span>Venta ($)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span>Ganancia ($)</span>
                </span>
              </div>
            </div>

            {/* Visualizador de Barras SVG Dinámico */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 border-b border-slate-200 px-2">
                {ultimosDias.map(([diaStr, dato]) => {
                  const alturaVenta = Math.round((dato.ventas / maxVentaDia) * 100);
                  const alturaGanancia = Math.round((dato.ganancia / maxVentaDia) * 100);
                  const diaFormateado = diaStr.split("-").slice(1).reverse().join("/");

                  return (
                    <div key={diaStr} className="flex flex-col items-center h-full justify-end group">
                      {/* Valores flotantes al hacer hover */}
                      <span className="text-[10px] font-mono font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                        ${Math.round(dato.ventas)}
                      </span>

                      {/* Contenedor de barras dobles */}
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        {/* Barra Venta */}
                        <div
                          style={{ height: `${Math.max(10, Math.min(100, alturaVenta))}%` }}
                          className="w-1/2 max-w-[20px] bg-slate-800 hover:bg-slate-900 rounded-t-xs transition-all relative"
                          title={`Ventas: ${formatCurrency(dato.ventas)} (${dato.pedidos} pedidos)`}
                        />
                        {/* Barra Ganancia */}
                        <div
                          style={{ height: `${Math.max(8, Math.min(100, alturaGanancia))}%` }}
                          className="w-1/2 max-w-[20px] bg-emerald-500 hover:bg-emerald-600 rounded-t-xs transition-all"
                          title={`Ganancia Neta: ${formatCurrency(dato.ganancia)}`}
                        />
                      </div>

                      {/* Etiqueta del día */}
                      <span className="text-[10px] font-semibold text-slate-500 mt-2 font-mono">
                        {diaFormateado}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resumen inferior de la gráfica */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-sm bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Facturación</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalVentas)}</span>
            </div>
            <div className="p-2 rounded-sm bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 block">Ganancia Neta</span>
              <span className="font-bold text-emerald-800">{formatCurrency(totalGanancia)}</span>
            </div>
            <div className="p-2 rounded-sm bg-blue-50 border border-blue-100">
              <span className="text-[10px] text-blue-700 block">Margen Promedio</span>
              <span className="font-bold text-blue-800">
                {totalVentas > 0 ? `${Math.round((totalGanancia / totalVentas) * 100)}%` : "0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Gráfica 2: Distribución de Citas y Demanda de Servicios */}
        <div className="lg:col-span-5 rounded-sm border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-sm bg-purple-50 text-purple-700 border border-purple-200">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Distribución de Citas
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Estado de las {totalCitas} citas agendadas
                  </p>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-slate-600 hover:text-slate-900">
                <Link href="/admin/citas">Ver citas</Link>
              </Button>
            </div>

            {/* Barra segmentada proporcional tipo barra de progreso */}
            <div className="pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-semibold text-slate-700">Composición de Estados</span>
                <span className="text-[10px] font-mono text-slate-500">{totalCitas} registros</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden p-0.5 border border-slate-200">
                <div
                  style={{ width: `${pctConfirmadas}%` }}
                  className="bg-emerald-500 h-full rounded-l-full"
                  title={`Confirmadas: ${citasConfirmadas} (${pctConfirmadas}%)`}
                />
                <div
                  style={{ width: `${pctPendientes}%` }}
                  className="bg-amber-400 h-full"
                  title={`Pendientes: ${citasPendientes} (${pctPendientes}%)`}
                />
                <div
                  style={{ width: `${pctCompletadas}%` }}
                  className="bg-blue-500 h-full"
                  title={`Completadas: ${citasCompletadas} (${pctCompletadas}%)`}
                />
                <div
                  style={{ width: `${pctCanceladas}%` }}
                  className="bg-rose-400 h-full rounded-r-full"
                  title={`Canceladas: ${citasCanceladas} (${pctCanceladas}%)`}
                />
              </div>

              {/* Badges de estado con conteos */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-sm bg-emerald-50/70 border border-emerald-200">
                  <span className="flex items-center gap-1.5 text-emerald-900 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Confirmadas</span>
                  </span>
                  <span className="font-bold text-emerald-950 font-mono">{citasConfirmadas} ({pctConfirmadas}%)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-sm bg-amber-50/70 border border-amber-200">
                  <span className="flex items-center gap-1.5 text-amber-900 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>Pendientes</span>
                  </span>
                  <span className="font-bold text-amber-950 font-mono">{citasPendientes} ({pctPendientes}%)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-sm bg-blue-50/70 border border-blue-200">
                  <span className="flex items-center gap-1.5 text-blue-900 font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Completadas</span>
                  </span>
                  <span className="font-bold text-blue-950 font-mono">{citasCompletadas} ({pctCompletadas}%)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-sm bg-rose-50/70 border border-rose-200">
                  <span className="flex items-center gap-1.5 text-rose-900 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                    <span>Canceladas</span>
                  </span>
                  <span className="font-bold text-rose-950 font-mono">{citasCanceladas} ({pctCanceladas}%)</span>
                </div>
              </div>
            </div>

            {/* Demanda de Top Servicios */}
            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Servicios Más Demandados
              </span>
              <div className="space-y-2">
                {topServicios.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[200px]">
                        {s.nombre}
                      </span>
                      <span className="font-mono text-slate-600 text-[10px] font-bold">
                        {s.count} citas ({s.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(15, s.pct)}%` }}
                        className="bg-indigo-600 h-full rounded-full transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos de Estado del Salón e Inventario */}
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

      {/* SECCIÓN ANALÍTICA: Gráficas de Inteligencia de Negocio y Ocupación */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Gráfica 3: Balance Global de Ingresos (Servicios vs Tienda & Flujo de Abonos) */}
        <div className="lg:col-span-6 rounded-sm border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Balance Global del Negocio
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Facturación estimada global: {formatCurrency(totalFacturacionGlobal)}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
                {totalFacturacionGlobal > 0 ? "100% Activo" : "Sin ventas"}
              </span>
            </div>

            {/* Visualización Proporcional Servicios vs Tienda */}
            <div className="pt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Servicios en Salón ({pctServicios}%)</span>
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatCurrency(totalFacturacionCitas)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    style={{ width: `${pctServicios}%` }}
                    className="bg-indigo-600 h-full rounded-full transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Productos en Tienda ({pctTienda}%)</span>
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatCurrency(totalVentas)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    style={{ width: `${pctTienda}%` }}
                    className="bg-emerald-500 h-full rounded-full transition-all"
                  />
                </div>
              </div>

              {/* Sub-desglose financiero del Salón: Abonos vs Cobro en Salón */}
              <div className="p-3 bg-slate-50/80 rounded-sm border border-slate-200 space-y-2 mt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Flujo de Cobro de Citas
                </span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-sm border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Abonos Recibidos (20%)</span>
                    <span className="font-bold text-emerald-700 text-sm font-mono mt-0.5 block">
                      {formatCurrency(totalAbonosCitas)}
                    </span>
                    <span className="text-[9px] text-slate-400">Verificado en Pago Móvil</span>
                  </div>
                  <div className="p-2 bg-white rounded-sm border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Restante en Salón (80%)</span>
                    <span className="font-bold text-slate-800 text-sm font-mono mt-0.5 block">
                      {formatCurrency(totalRestanteCitas)}
                    </span>
                    <span className="text-[9px] text-slate-400">Por cobrar al atender</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Rendimiento combinado salón + tienda</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 text-[11px]">
              {db.appointments.length} Citas &bull; {db.orders.length} Pedidos
            </span>
          </div>
        </div>

        {/* Gráfica 4: Ocupación Semanal del Salón */}
        <div className="lg:col-span-6 rounded-sm border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Ocupación Semanal del Salón
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Citas activas distribuidas por día de la semana
                  </p>
                </div>
              </div>

              {diaPico && Boolean(diaPico.count) && (
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-200">
                  Pico: {diaPico.nombre} ({diaPico.count} citas)
                </span>
              )}
            </div>

            {/* Barras de Días de la Semana */}
            <div className="pt-5 pb-2">
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 items-end h-40 border-b border-slate-200 px-1">
                {diasSemanaOrdenados.map((dia) => {
                  const alturaPct = maxCitasPorDia !== 0 ? Math.round((dia.count / maxCitasPorDia) * 100) : 0;
                  const esPico = dia.count === maxCitasPorDia && Boolean(dia.count);

                  return (
                    <div key={dia.nombre} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-slate-700 mb-1">
                        {dia.count}
                      </span>
                      <div className="w-full flex items-end justify-center h-28">
                        <div
                          style={{ height: `${Math.max(10, Math.min(100, alturaPct))}%` }}
                          className={`w-full max-w-[28px] rounded-t-xs transition-all ${
                            esPico
                              ? "bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                              : Boolean(dia.count)
                              ? "bg-slate-400 hover:bg-slate-500"
                              : "bg-slate-200"
                          }`}
                          title={`${dia.nombre}: ${dia.count} citas agendadas`}
                        />
                      </div>
                      <span className={`text-[10px] font-semibold mt-2 font-mono ${esPico ? "text-indigo-900 font-bold" : "text-slate-500"}`}>
                        {dia.abreviado}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Horario comercial de atención: Mar a Sáb</span>
            <Button asChild variant="ghost" size="sm" className="h-6 text-xs text-indigo-700 hover:text-indigo-900 p-0 font-semibold">
              <Link href="/admin/citas" className="flex items-center gap-1">
                <span>Gestionar Agenda</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Gráfica 5: Salud y Distribución de Inventario por Categoría */}
      <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-200">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Distribución y Salud de Inventario por Categoría
              </h2>
              <p className="text-[11px] text-slate-500">
                {totalProductos} productos registrados &bull; {totalStockGeneral} unidades en anaquel &bull; Valor estimado: {formatCurrency(totalValorInventario)}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold rounded-sm border-slate-200 self-start sm:self-auto">
            <Link href="/admin/productos" className="flex items-center gap-1">
              <span>Ver Inventario Completo</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>

        {/* Barras de Distribución de Stock por Categoría */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriasInventario.map((cat, idx) => {
            const pctStock = Math.round((cat.stock / totalStockGeneral) * 100);
            const colores = [
              { bar: "bg-amber-500", text: "text-amber-800", bg: "bg-amber-50 border-amber-200" },
              { bar: "bg-blue-500", text: "text-blue-800", bg: "bg-blue-50 border-blue-200" },
              { bar: "bg-emerald-500", text: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200" },
              { bar: "bg-purple-500", text: "text-purple-800", bg: "bg-purple-50 border-purple-200" },
              { bar: "bg-rose-500", text: "text-rose-800", bg: "bg-rose-50 border-rose-200" },
              { bar: "bg-slate-500", text: "text-slate-800", bg: "bg-slate-50 border-slate-200" },
            ];
            const color = colores[idx % colores.length];

            return (
              <div key={cat.categoria} className="p-3.5 rounded-sm border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{cat.categoria}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border ${color.bg} ${color.text}`}>
                    {cat.count} producto(s)
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Stock disponible:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {cat.stock} unids ({pctStock}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(8, Math.min(100, (cat.stock / maxStockCategoria) * 100))}%` }}
                      className={`${color.bar} h-full rounded-full transition-all`}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Valoración en anaquel:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(cat.totalValor)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
