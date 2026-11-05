"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  Landmark,
  Banknote,
  Eye,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { DBOrder } from "@/lib/db";

const estadoLabel: Record<string, string> = {
  pendiente_verificacion: "Por Verificar",
  verificado: "Verificado",
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

  async function cambiarEstado(id: string, nuevoEstado: "verificado" | "entregado" | "cancelado") {
    try {
      const res = await fetch("/api/pedidos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
        );
        if (pedidoDetalle?.id === id) {
          setPedidoDetalle((prev) => (prev ? { ...prev, estado: nuevoEstado } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pedidos de la Tienda
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprobación de compras, verificación de referencias de Pago Móvil y entrega.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={cargarPedidos}
          className="rounded-md border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Tabla con esquinas rounded-md y fondo blanco nítido */}
      <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Registro de Pedidos ({pedidos.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          {cargando ? (
            <div className="py-12 text-center text-xs text-slate-500">Cargando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No hay pedidos registrados en el sistema aún.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Orden</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Método de Pago</th>
                  <th className="py-3 px-4">Comprobante Pago Móvil</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-slate-900 text-xs">{pedido.id}</p>
                      <p className="text-[11px] text-slate-500">
                        {formatDate(new Date(pedido.creadoEn))}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 text-sm">{pedido.clienteNombre}</p>
                      <p className="flex items-center gap-1 text-slate-500 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{pedido.clienteTelefono}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      {pedido.metodoPago === "pagomovil" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <Landmark className="h-3 w-3" />
                          <span>Pago Móvil</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Banknote className="h-3 w-3" />
                          <span>Efectivo</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {pedido.metodoPago === "pagomovil" && pedido.pagoMovil ? (
                        <div className="space-y-0.5">
                          <p className="text-slate-600">
                            <strong>Banco:</strong> {pedido.pagoMovil.banco}
                          </p>
                          <p className="text-slate-600">
                            <strong>Ref:</strong>{" "}
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {pedido.pagoMovil.referencia}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">Pago en efectivo al retirar</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-sm text-slate-900">
                        {formatCurrency(pedido.total)}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {pedido.items.length} producto{pedido.items.length !== 1 && "s"}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                          pedido.estado === "verificado"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : pedido.estado === "entregado"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : pedido.estado === "cancelado"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {estadoLabel[pedido.estado] || pedido.estado}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPedidoDetalle(pedido)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                          title="Ver detalle de la orden"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Detalle</span>
                        </button>

                        {pedido.estado === "pendiente_verificacion" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(pedido.id, "verificado")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                            title="Validar comprobante de Pago Móvil"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Validar Pago</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Detalle de Pedido (Viewport safe max-h-[85vh] y rounded-md) */}
      {pedidoDetalle && (
        <Dialog open={!!pedidoDetalle} onOpenChange={() => setPedidoDetalle(null)}>
          <DialogContent className="max-w-md rounded-md max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-2 border-b border-slate-200">
              <DialogTitle className="flex items-center justify-between text-base font-bold text-slate-900">
                <span>Detalle de Orden {pedidoDetalle.id}</span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    pedidoDetalle.estado === "verificado"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : pedidoDetalle.estado === "entregado"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {estadoLabel[pedidoDetalle.estado] || pedidoDetalle.estado}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 text-xs pt-1">
              {/* Datos del Cliente */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1.5">
                <p className="font-semibold text-slate-900 text-sm">{pedidoDetalle.clienteNombre}</p>
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{pedidoDetalle.clienteTelefono}</span>
                </p>
                {pedidoDetalle.clienteEmail && (
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{pedidoDetalle.clienteEmail}</span>
                  </p>
                )}
                {pedidoDetalle.direccion && (
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{pedidoDetalle.direccion}</span>
                  </p>
                )}
              </div>

              {/* Comprobante de Pago Móvil */}
              {pedidoDetalle.metodoPago === "pagomovil" && pedidoDetalle.pagoMovil && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-md text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-xs">
                    <Landmark className="h-4 w-4 text-blue-700" />
                    <span>Comprobante Pago Móvil</span>
                  </p>
                  <p><strong>Banco Emisor:</strong> {pedidoDetalle.pagoMovil.banco}</p>
                  <p>
                    <strong>Número de Referencia:</strong>{" "}
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-950">
                      {pedidoDetalle.pagoMovil.referencia}
                    </span>
                  </p>
                </div>
              )}

              {/* Lista de Productos Comprados */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200">
                <p className="font-semibold text-slate-900">Productos ({pedidoDetalle.items.length})</p>
                <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                  {pedidoDetalle.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{it.nombre}</p>
                        <p className="text-[11px] text-slate-500">{it.cantidad}x {formatCurrency(it.precio)}</p>
                      </div>
                      <p className="font-bold text-slate-900">{formatCurrency(it.precio * it.cantidad)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total y Botón de Validación */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500">Monto total:</p>
                  <p className="text-base font-bold text-slate-900">{formatCurrency(pedidoDetalle.total)}</p>
                </div>

                {pedidoDetalle.estado === "pendiente_verificacion" && (
                  <Button
                    onClick={() => cambiarEstado(pedidoDetalle.id, "verificado")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold"
                  >
                    Marcar Pago como Verificado
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
