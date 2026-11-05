import Link from "next/link";
import { DollarSign, CalendarCheck, PackageX, ShoppingCart, ArrowRight } from "lucide-react";
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

  const ultimasCitas = db.appointments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Panel de Administración Xiorizos</h1>
        <p className="text-sm text-muted-foreground">
          Gestión en tiempo real de citas, inventario de productos y verificación de pagos móviles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          titulo="Total en Ventas"
          valor={formatCurrency(totalVentas)}
          icon={DollarSign}
        />
        <MetricCard
          titulo="Citas Pendientes"
          valor={citasPendientes.toString()}
          icon={CalendarCheck}
          colorIcono="text-blue-600"
        />
        <MetricCard
          titulo="Pedidos por Verificar"
          valor={pedidosPendientes.toString()}
          icon={ShoppingCart}
          colorIcono="text-amber-600"
        />
        <MetricCard
          titulo="Productos con Stock Bajo"
          valor={stockBajo.toString()}
          icon={PackageX}
          colorIcono="text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citas recientes */}
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Próximas Citas</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/admin/citas" className="flex items-center gap-1">
                <span>Ver todas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ultimasCitas.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No hay citas registradas.</p>
            ) : (
              ultimasCitas.map((cita) => (
                <div key={cita.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{cita.clienteNombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {cita.servicioNombre} con <span className="font-medium">{cita.profesionalNombre}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">{cita.hora}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(new Date(cita.fecha))}</p>
                    </div>
                    <Badge variant={cita.estado === "confirmada" ? "success" : "warning"} className="capitalize text-xs">
                      {cita.estado}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card className="rounded-2xl shadow-sm border-border flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Operaciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/pedidos"
              className="flex items-center justify-between p-3.5 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors group"
            >
              <div>
                <p className="font-semibold text-sm text-primary">Comprobar Pagos Móviles</p>
                <p className="text-xs text-muted-foreground">
                  Hay {pedidosPendientes} pedido(s) pendientes de verificación de referencia bancaria.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-secondary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/productos"
              className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
            >
              <div>
                <p className="font-semibold text-sm text-primary">Gestión de Catálogo</p>
                <p className="text-xs text-muted-foreground">
                  Modificar precios, añadir nuevos productos o actualizar existencias.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/citas"
              className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
            >
              <div>
                <p className="font-semibold text-sm text-primary">Control de Citas del Estudio</p>
                <p className="text-xs text-muted-foreground">
                  Ver clientes agendados, teléfono de contacto y especialista asignado.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
