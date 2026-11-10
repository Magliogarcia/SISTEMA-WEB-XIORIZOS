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
  Check,
  RotateCcw,
  X,
  Package,
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

function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
    </svg>
  );
}

function normalizePhoneForWhatsApp(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "58" + digits.slice(1);
  } else if (digits.length === 10 && !digits.startsWith("58")) {
    digits = "58" + digits;
  }
  return digits;
}

function getPedidoWhatsAppMessage(pedido: DBOrder): string {
  const itemsText = pedido.items
    .map((it) => `• ${it.cantidad}x ${it.nombre} ($${(it.precio * it.cantidad).toFixed(2)})`)
    .join("\n");

  if (pedido.metodoPago === "efectivo") {
    return (
      `¡Hola ${pedido.clienteNombre}! 👋 Te saludamos desde la tienda botánica de *Estudio Xiorizos*.\n\n` +
      `Hemos recibido el registro de tu pedido ${pedido.id} con pago en efectivo al momento de la entrega o retiro:\n` +
      `${itemsText}\n\n` +
      `💰 *Total:* $${pedido.total.toFixed(2)}\n` +
      (pedido.direccion
        ? `📍 *Dirección de entrega:* ${pedido.direccion}\n\n`
        : `📍 *Retiro:* Directamente en nuestro salón en Naguanagua\n\n`) +
      `Nos ponemos en contacto contigo para coordinar la entrega de tus productos botánicos. ¡Muchas gracias por tu preferencia! 🌿✨`
    );
  }

  // Pago Móvil comprobado
  return (
    `¡Hola ${pedido.clienteNombre}! 👋 Te saludamos desde la tienda botánica de *Estudio Xiorizos*.\n\n` +
    `✅ *¡El pago de tu orden ha sido COMPROBADO con éxito!*\n\n` +
    `🛍️ *Detalles de tu orden ${pedido.id}:*\n` +
    `${itemsText}\n\n` +
    `💰 *Total:* $${pedido.total.toFixed(2)}\n` +
    (pedido.direccion
      ? `📍 *Dirección de entrega:* ${pedido.direccion}\n\n`
      : `📍 *Retiro:* Directamente en nuestro salón en Naguanagua\n\n`) +
    `Nos encontramos preparando tus productos con el mayor cuidado botánico. Te avisaremos en cuanto tu paquete salga a despacho o esté listo para entregar. ¡Muchas gracias por tu confianza en Xiorizos! 🌿✨`
  );
}

function getPedidoWhatsAppUrl(pedido: DBOrder): string {
  const phone = normalizePhoneForWhatsApp(pedido.clienteTelefono);
  const msg = getPedidoWhatsAppMessage(pedido);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

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

  async function cambiarEstado(
    id: string,
    nuevoEstado: "pendiente_verificacion" | "verificado" | "entregado" | "cancelado"
  ) {
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
        window.dispatchEvent(new CustomEvent("xiorizos-admin-update"));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function marcarNotificadoWhatsApp(id: string) {
    try {
      const res = await fetch("/api/pedidos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notificadoWhatsApp: true }),
      });
      const data = await res.json();
      if (data.success) {
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, notificadoWhatsApp: true } : p))
        );
        if (pedidoDetalle?.id === id) {
          setPedidoDetalle((prev) => (prev ? { ...prev, notificadoWhatsApp: true } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pedidos de la Tienda
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprobación de compras, verificación de pagos y control de entregas.
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

      {/* Tabla con esquinas rounded-md y fondo limpio */}
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
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[130px] whitespace-nowrap">Orden</th>
                  <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">Cliente</th>
                  <th className="py-3 px-4 min-w-[130px] whitespace-nowrap">Método de Pago</th>
                  <th className="py-3 px-4 min-w-[190px] whitespace-nowrap">Comprobante Pago</th>
                  <th className="py-3 px-4 min-w-[110px] whitespace-nowrap">Total</th>
                  <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">Estado</th>
                  <th className="py-3 px-4 min-w-[180px] whitespace-nowrap text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pedidos.map((pedido) => {
                  const puedeEnviarWhatsApp =
                    pedido.estado === "verificado" || pedido.metodoPago === "efectivo";

                  return (
                    <tr key={pedido.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-mono font-bold text-slate-900 text-xs">{pedido.id}</p>
                        <p className="text-[11px] text-slate-500">
                          {formatDate(new Date(pedido.creadoEn))}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-900 text-sm">{pedido.clienteNombre}</p>
                        <p className="flex items-center gap-1.5 text-slate-500 mt-0.5 font-mono text-xs">
                          <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{pedido.clienteTelefono}</span>
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {pedido.metodoPago === "pagomovil" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Landmark className="h-3 w-3 shrink-0" />
                            <span>Pago Móvil</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Banknote className="h-3 w-3 shrink-0" />
                            <span>Efectivo</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
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
                            {pedido.pagoMovil.telefonoEmisor && (
                              <p className="text-[10px] text-slate-500 font-mono">
                                Emisor: {pedido.pagoMovil.telefonoEmisor}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">Pago en efectivo al entregar/retirar</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-bold text-sm text-slate-900">
                          {formatCurrency(pedido.total)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {pedido.items.length} producto{pedido.items.length !== 1 && "s"}
                        </p>
                      </td>

                      {/* Estado: Badge limpio (NO selector editable en la tabla) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                            pedido.estado === "verificado"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : pedido.estado === "entregado"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : pedido.estado === "cancelado"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {estadoLabel[pedido.estado] || pedido.estado}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Botón WhatsApp: SOLO aparece tras verificar o en efectivo, y desaparece tras ser notificado */}
                          {puedeEnviarWhatsApp && (
                            pedido.notificadoWhatsApp ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200">
                                <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                                <span>Notificado</span>
                              </span>
                            ) : (
                              <a
                                href={getPedidoWhatsAppUrl(pedido)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => marcarNotificadoWhatsApp(pedido.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all cursor-pointer shadow-xs"
                                title="Enviar confirmación oficial por WhatsApp"
                              >
                                <WhatsAppIcon className="h-3 w-3" />
                                <span>WhatsApp</span>
                              </a>
                            )
                          )}

                          {/* Botón Detalle */}
                          <button
                            type="button"
                            onClick={() => setPedidoDetalle(pedido)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                            title="Ver información completa y gestionar orden"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Detalle</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Detalle de Pedido y Acciones Reversibles */}
      {pedidoDetalle && (
        <Dialog open={!!pedidoDetalle} onOpenChange={() => setPedidoDetalle(null)}>
          <DialogContent className="max-w-md rounded-md max-h-[85vh] overflow-y-auto font-sans">
            <DialogHeader className="pb-2 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base font-bold text-slate-900">
                  Orden {pedidoDetalle.id}
                </DialogTitle>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                    pedidoDetalle.estado === "verificado"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : pedidoDetalle.estado === "entregado"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : pedidoDetalle.estado === "cancelado"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {estadoLabel[pedidoDetalle.estado] || pedidoDetalle.estado}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-3.5 text-xs pt-1">
              {/* Datos del Cliente */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1.5">
                <p className="font-semibold text-slate-900 text-sm">{pedidoDetalle.clienteNombre}</p>
                <p className="flex items-center gap-1.5 text-slate-600 font-mono">
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
              {pedidoDetalle.metodoPago === "pagomovil" && pedidoDetalle.pagoMovil ? (
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
                  {pedidoDetalle.pagoMovil.telefonoEmisor && (
                    <p>
                      <strong>Teléfono Emisor:</strong>{" "}
                      <span className="font-mono font-medium">{pedidoDetalle.pagoMovil.telefonoEmisor}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-slate-700 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-xs">
                    <Banknote className="h-4 w-4 text-slate-600" />
                    <span>Método de Pago: Efectivo</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    El cliente abonará el total en efectivo al recibir o retirar en salón.
                  </p>
                </div>
              )}

              {/* Lista de Productos Comprados */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200">
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-slate-400" />
                  <span>Productos ({pedidoDetalle.items.length}):</span>
                </p>
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

              {/* Notificación WhatsApp en Modal */}
              <div className="p-3 bg-emerald-50/50 rounded-md border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Notificación por WhatsApp:</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pedidoDetalle.notificadoWhatsApp
                      ? "Ya se notificó la comprobación/contacto al cliente."
                      : "Envía el mensaje predeterminado directamente."}
                  </p>
                </div>
                {pedidoDetalle.notificadoWhatsApp ? (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    ✓ Ya notificado
                  </span>
                ) : (
                  <a
                    href={getPedidoWhatsAppUrl(pedidoDetalle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => marcarNotificadoWhatsApp(pedidoDetalle.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-xs shrink-0"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Abrir WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Total y Botones de Acción Reversibles */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] text-slate-500">Monto total:</p>
                  <p className="text-base font-bold text-slate-900">{formatCurrency(pedidoDetalle.total)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {pedidoDetalle.estado === "pendiente_verificacion" && (
                    <Button
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "verificado")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Marcar Pago Verificado
                    </Button>
                  )}

                  {pedidoDetalle.estado === "verificado" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => cambiarEstado(pedidoDetalle.id, "entregado")}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold"
                      >
                        Marcar como Entregado
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cambiarEstado(pedidoDetalle.id, "pendiente_verificacion")}
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 rounded-md text-xs"
                        title="Deshacer si se verificó por error"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Revertir a Pendiente
                      </Button>
                    </>
                  )}

                  {pedidoDetalle.estado === "entregado" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "verificado")}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs"
                      title="Reabrir si se marcó como entregado por error"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Revertir a Verificado
                    </Button>
                  )}

                  {pedidoDetalle.estado === "cancelado" && (
                    <Button
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "pendiente_verificacion")}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Reactivar Orden
                    </Button>
                  )}

                  {pedidoDetalle.estado !== "cancelado" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "cancelado")}
                      className="text-rose-700 hover:bg-rose-50 border-rose-200 rounded-md text-xs"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancelar Orden
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
