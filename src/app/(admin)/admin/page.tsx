import Link from "next/link";
import {
  DollarSign,
  CalendarCheck,
  PackageX,
  CreditCard,
  ArrowRight,
  UserCheck,
  Phone,
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      {/* Encabezado Superior */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Panel de Control General
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Supervisa en vivo las operaciones del salón: citas, pagos móviles, inventario y especialistas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema en línea</span>
          </span>
        </div>
      </div>

      {/* 4 Métricas Clave (Alto contraste, sin círculos marrones oscuros) */}
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

      {/* Accesos de Estado Rápido para Empleados y Catálogo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Estado del Personal en Salón</p>
              <p className="text-xs text-muted-foreground">
                {empleadosOperativos} de {totalEmpleados} empleados operativos en agenda para clientes.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-semibold">
            <Link href="/admin/empleados">Gestionar</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Pagos Móviles por Validar</p>
              <p className="text-xs text-muted-foreground">
                {pedidosPendientes} compras en espera de confirmación de referencia.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-lg text-xs font-semibold">
            <Link href="/admin/pedidos">Revisar</Link>
          </Button>
        </div>
      </div>

      {/* 2 Tablas Principales Operativas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Citas */}
        <Card className="rounded-lg shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div>
              <CardTitle className="text-base font-bold text-primary">Próximas Citas Agendadas</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Clientes programados en el salón</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold">
              <Link href="/admin/citas" className="flex items-center gap-1">
                <span>Ver todas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {ultimasCitas.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No hay citas registradas.</p>
            ) : (
              <div className="divide-y divide-border">
                {ultimasCitas.map((cita) => (
                  <div key={cita.id} className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{cita.clienteNombre}</p>
                        <Badge
                          variant={cita.estado === "confirmada" ? "success" : "warning"}
                          className="capitalize text-xs font-semibold"
                        >
                          {cita.estado}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {cita.servicioNombre} &bull; <span className="font-medium text-foreground">{cita.profesionalNombre}</span>
                      </p>
                      {cita.clienteTelefono && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3 text-secondary" />
                          <span>{cita.clienteTelefono}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{cita.hora}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(new Date(cita.fecha))}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pedidos y Pagos Móviles Recientes */}
        <Card className="rounded-lg shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
            <div>
              <CardTitle className="text-base font-bold text-primary">Pedidos y Verificación de Pagos</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Compras de productos en tienda</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-semibold">
              <Link href="/admin/pedidos" className="flex items-center gap-1">
                <span>Ver pedidos</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {ultimosPedidos.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No hay pedidos registrados.</p>
            ) : (
              <div className="divide-y divide-border">
                {ultimosPedidos.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-secondary">{pedido.id}</span>
                        <p className="text-sm font-semibold text-foreground">{pedido.clienteNombre}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Método: <strong className="capitalize text-foreground">{pedido.metodoPago}</strong>
                        {pedido.pagoMovil && (
                          <span className="ml-1 text-primary">
                            ({pedido.pagoMovil.banco} - Ref: <strong className="text-foreground">{pedido.pagoMovil.referencia}</strong>)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pedido.items.length} producto(s) &bull; <strong className="text-foreground">{formatCurrency(pedido.total)}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge
                        variant={pedido.estado === "verificado" ? "success" : "warning"}
                        className="capitalize text-xs font-semibold"
                      >
                        {pedido.estado === "pendiente_verificacion" ? "Por Verificar" : pedido.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
