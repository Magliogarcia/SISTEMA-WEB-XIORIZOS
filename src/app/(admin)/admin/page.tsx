import { DollarSign, CalendarCheck, PackageX, ShoppingCart } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const citasHoy = [
  { id: "1", cliente: "María González", servicio: "Coloración completa", hora: "10:00 AM", estado: "confirmada" },
  { id: "2", cliente: "Pedro Ramírez", servicio: "Corte de cabello", hora: "11:30 AM", estado: "pendiente" },
  { id: "3", cliente: "Luisa Fernández", servicio: "Mechas / Balayage", hora: "02:00 PM", estado: "confirmada" },
];

const estadoBadge: Record<string, "success" | "warning"> = {
  confirmada: "success",
  pendiente: "warning",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen general del negocio</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard titulo="Ventas del mes" valor={formatCurrency(4280)} icon={DollarSign} tendencia={{ valor: "12% vs mes anterior", positiva: true }} />
        <MetricCard titulo="Citas de hoy" valor="8" icon={CalendarCheck} colorIcono="text-blue-600" />
        <MetricCard titulo="Productos con stock bajo" valor="5" icon={PackageX} colorIcono="text-destructive" />
        <MetricCard titulo="Pedidos pendientes" valor="3" icon={ShoppingCart} colorIcono="text-amber-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Citas de hoy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {citasHoy.map((cita) => (
            <div key={cita.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{cita.cliente}</p>
                <p className="text-xs text-muted-foreground">{cita.servicio}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{cita.hora}</span>
                <Badge variant={estadoBadge[cita.estado]}>{cita.estado}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
