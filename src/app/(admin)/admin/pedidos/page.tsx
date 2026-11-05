"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Landmark, Banknote, CheckCircle2, RefreshCw, Eye, Phone, MapPin, Mail, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DBOrder } from "@/lib/db";

const estadoVariant: Record<string, "warning" | "secondary" | "success" | "destructive"> = {
  pendiente_verificacion: "warning",
  verificado: "success",
  entregado: "secondary",
  cancelado: "destructive",
};

const estadoLabel: Record<string, string> = {
  pendiente_verificacion: "Pendiente verificación",
  verificado: "Pago verificado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<DBOrder[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoDetalle, setPedidoDetalle] = useState<DBOrder | null>(null);

  async function cargarPedidos() {
    setCargando(true);
    try {
      const res = await fetch("/api/pedidos");
      const data = await res.json();
      if (data.success && data.pedidos) {
        setPedidos(data.pedidos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cambiarEstado(id: string, nuevoEstado: string) {
    try {
      const res = await fetch("/api/pedidos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado as any } : p))
        );
        if (pedidoDetalle && pedidoDetalle.id === id) {
          setPedidoDetalle({ ...pedidoDetalle, estado: nuevoEstado as any });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Pedidos de la Tienda</h1>
          <p className="text-sm text-muted-foreground">
            Revisa las compras realizadas, comprueba las referencias de Pago Móvil y gestiona entregas.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={cargarPedidos} className="w-fit flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" />
          <span>Actualizar</span>
        </Button>
      </div>

      <Card className="rounded-lg shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
          <CardTitle className="text-base font-bold text-primary">Registro de Pedidos ({pedidos.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Cargando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No hay pedidos registrados aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Comprobante Pago Móvil</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidos.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>
                        <p className="font-bold text-sm text-primary">{pedido.id}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDate(new Date(pedido.creadoEn))}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="font-medium text-sm text-foreground">{pedido.clienteNombre}</p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 text-secondary" />
                          <span>{pedido.clienteTelefono}</span>
                        </p>
                      </TableCell>

                      <TableCell>
                        {pedido.metodoPago === "pagomovil" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Landmark className="h-3.5 w-3.5" />
                            Pago Móvil
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Banknote className="h-3.5 w-3.5" />
                            Efectivo
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {pedido.metodoPago === "pagomovil" && pedido.pagoMovil ? (
                          <div className="text-xs space-y-0.5">
                            <p><strong>Banco:</strong> {pedido.pagoMovil.banco}</p>
                            <p>
                              <strong>Ref:</strong>{" "}
                              <span className="font-mono font-bold text-primary bg-secondary/10 px-1.5 py-0.5 rounded">
                                {pedido.pagoMovil.referencia}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Pago en físico</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-sm text-primary">
                          {formatCurrency(pedido.total)}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {pedido.items.length} producto{pedido.items.length !== 1 && "s"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={estadoVariant[pedido.estado] || "secondary"}
                          className="capitalize text-xs font-medium"
                        >
                          {estadoLabel[pedido.estado] || pedido.estado}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pedido.metodoPago === "pagomovil" && pedido.estado === "pendiente_verificacion" && (
                            <Button
                              size="sm"
                              className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1"
                              onClick={() => cambiarEstado(pedido.id, "verificado")}
                              title="Marcar Pago Móvil como verificado y aprobado"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Verificar Pago</span>
                            </Button>
                          )}
                          {pedido.estado === "verificado" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg flex items-center gap-1"
                              onClick={() => cambiarEstado(pedido.id, "entregado")}
                              title="Marcar pedido como entregado al cliente"
                            >
                              <PackageCheck className="h-3.5 w-3.5" />
                              <span>Entregar</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => setPedidoDetalle(pedido)}
                            title="Ver detalles completos"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalle de Pedido */}
      {pedidoDetalle && (
        <Dialog open={!!pedidoDetalle} onOpenChange={() => setPedidoDetalle(null)}>
          <DialogContent className="max-w-md rounded-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Detalle de Orden {pedidoDetalle.id}</span>
                <Badge variant={estadoVariant[pedidoDetalle.estado]}>
                  {estadoLabel[pedidoDetalle.estado] || pedidoDetalle.estado}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs pt-2">
              <div className="p-3 bg-muted/50 rounded-lg space-y-1.5">
                <p className="font-semibold text-foreground text-sm">{pedidoDetalle.clienteNombre}</p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{pedidoDetalle.clienteTelefono}</span>
                </p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{pedidoDetalle.clienteEmail}</span>
                </p>
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{pedidoDetalle.direccion}</span>
                </p>
              </div>

              {pedidoDetalle.metodoPago === "pagomovil" && pedidoDetalle.pagoMovil && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Landmark className="h-4 w-4" />
                    <span>Datos de Pago Móvil:</span>
                  </p>
                  <p><strong>Banco:</strong> {pedidoDetalle.pagoMovil.banco}</p>
                  <p><strong>Referencia:</strong> <span className="font-mono font-bold text-base">{pedidoDetalle.pagoMovil.referencia}</span></p>
                  {pedidoDetalle.pagoMovil.telefonoEmisor && (
                    <p><strong>Teléfono emisor:</strong> {pedidoDetalle.pagoMovil.telefonoEmisor}</p>
                  )}
                </div>
              )}

              <div>
                <p className="font-semibold text-foreground mb-2">Productos ({pedidoDetalle.items.length}):</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {pedidoDetalle.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                          <Image src={it.imagenUrl} alt={it.nombre} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-xs text-foreground">{it.nombre}</p>
                          <p className="text-[10px] text-muted-foreground">Cant: {it.cantidad} x {formatCurrency(it.precio)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-primary">{formatCurrency(it.precio * it.cantidad)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-bold">
                <span>Total pagado:</span>
                <span className="text-base text-primary">{formatCurrency(pedidoDetalle.total)}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
