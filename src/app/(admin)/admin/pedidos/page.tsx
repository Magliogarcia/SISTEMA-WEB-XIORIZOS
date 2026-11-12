"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
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
  ChevronLeft,
  ChevronRight,
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
    .map((it) => `• ${it.cantidad}x ${it.nombre} (${formatCurrency(it.precio * it.cantidad)})`)
    .join("\n");

  if (pedido.metodoPago === "efectivo") {
    return (
      `¡Hola ${pedido.clienteNombre}! 👋 Te saludamos desde la tienda botánica de *Estudio Xiorizos*.\n\n` +
      `Hemos recibido el registro de tu pedido ${pedido.id} con pago en efectivo al momento de la entrega o retiro:\n` +
      `${itemsText}\n\n` +
      `💰 *Total:* ${formatCurrency(pedido.total)}\n` +
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
    `💰 *Total:* ${formatCurrency(pedido.total)}\n` +
    (pedido.direccion
      ? `📍 *Dirección de entrega:* ${pedido.direccion}\n\n`
      : `📍 *Retiro:* Directamente en nuestro salón en Naguanagua\n\n`) +
    `Nos encontramos preparando tus productos con el mayor cuidado botánico. Te avisaremos en cuanto tu paquete salga a despacho o esté listo para entregar. ¡Muchas gracias por tu confianza en Xiorizos! 🌿✨`
  );
}

function getPedidoPagoErroneoWhatsAppMessage(pedido: DBOrder): string {
  return (
    `¡Hola ${pedido.clienteNombre}! 👋 Te saludamos desde *Estudio Xiorizos* en Naguanagua.\n\n` +
    `Estuvimos revisando tu pedido *${pedido.id}*, pero no pudimos comprobar tu Pago Móvil por un monto de *${formatCurrency(pedido.total)}* porque los datos bancarios registrados presentan alguna inconsistencia.\n\n` +
    `Por favor, reenvíanos los datos correctos por aquí o comparte una captura del comprobante bancario para verificarlo y despachar tu paquete:\n\n` +
    `📋 *Formato para comprobar tu pago:*\n` +
    `• Banco emisor:\n` +
    `• Número de referencia:\n` +
    `• Teléfono emisor:\n` +
    `• Monto transferido ($ o Bs.):\n\n` +
    `¡Quedamos atentos para procesar tu orden de inmediato! 🌿✨`
  );
}

function getPedidoPagoErroneoWhatsAppUrl(pedido: DBOrder): string {
  const phone = normalizePhoneForWhatsApp(pedido.clienteTelefono);
  const msg = getPedidoPagoErroneoWhatsAppMessage(pedido);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
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
  const [mostrarErrorPago, setMostrarErrorPago] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const ELEMENTOS_POR_PAGINA = 20;

  const totalPaginas = Math.ceil(pedidos.length / ELEMENTOS_POR_PAGINA) || 1;
  const inicioIdx = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
  const finIdx = Math.min(inicioIdx + ELEMENTOS_POR_PAGINA, pedidos.length);
  const pedidosPaginados = pedidos.slice(inicioIdx, finIdx);


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
    nuevoEstado: "pendiente_verificacion" | "verificado" | "entregado" | "cancelado",
    motivoCancelacion?: string
  ) {
    try {
      const res = await fetch("/api/pedidos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado, motivoCancelacion }),
      });
      const data = await res.json();
      if (data.success) {
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, estado: nuevoEstado, motivoCancelacion: motivoCancelacion ?? p.motivoCancelacion } : p
          )
        );
        if (pedidoDetalle?.id === id) {
          setPedidoDetalle((prev) =>
            prev ? { ...prev, estado: nuevoEstado, motivoCancelacion: motivoCancelacion ?? prev.motivoCancelacion } : null
          );
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
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Orden</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pedidosPaginados.map((pedido) => {
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

                      {/* Total */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-bold text-sm text-slate-900">
                          {formatCurrency(pedido.total)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {pedido.items.length} producto{pedido.items.length !== 1 && "s"}
                        </p>
                      </td>

                      {/* Método */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          {pedido.metodoPago === "pagomovil" ? (
                            <>
                              <Landmark className="h-3.5 w-3.5 text-blue-600" />
                              <span>Pago Móvil</span>
                            </>
                          ) : (
                            <>
                              <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Efectivo</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Estado: Indicador dot puro, sin contenedor ni recuadros */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              pedido.estado === "verificado"
                                ? "bg-emerald-500"
                                : pedido.estado === "entregado"
                                ? "bg-blue-500"
                                : pedido.estado === "cancelado"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span
                            className={
                              pedido.estado === "verificado"
                                ? "text-emerald-700"
                                : pedido.estado === "entregado"
                                ? "text-blue-700"
                                : pedido.estado === "cancelado"
                                ? "text-rose-700"
                                : "text-amber-700"
                            }
                          >
                            {pedido.estado === "verificado"
                              ? "Verificado"
                              : pedido.estado === "entregado"
                              ? "Entregado"
                              : pedido.estado === "cancelado"
                              ? "Cancelado"
                              : "Pendiente"}
                          </span>
                        </span>
                      </td>

                      {/* Acción única: Detalle */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setPedidoDetalle(pedido)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                          title="Ver información completa y gestionar pedido"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          <span>Detalle</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Barra de Paginación (20 pedidos por página) */}
        {pedidos.length > 0 && (
          <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
            <div>
              <span>Mostrando </span>
              <strong className="text-slate-900 font-mono">{inicioIdx + 1}</strong>
              <span> a </span>
              <strong className="text-slate-900 font-mono">{finIdx}</strong>
              <span> de </span>
              <strong className="text-slate-900 font-mono">{pedidos.length}</strong>
              <span> pedidos</span>
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center gap-1 self-center sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
                  disabled={paginaActual === 1}
                  className="h-8 px-2.5 text-xs rounded-sm border-slate-200 bg-white"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Anterior
                </Button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPaginaActual(num)}
                      className={`h-8 w-8 rounded-sm text-xs font-semibold font-mono transition-colors ${
                        paginaActual === num
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="h-8 px-2.5 text-xs rounded-sm border-slate-200 bg-white"
                >
                  Siguiente
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Rediseñado: Tamaño específico max-w-2xl sin scroll y distribución en 2 columnas */}
      {pedidoDetalle && (
        <Dialog open={!!pedidoDetalle} onOpenChange={() => { setPedidoDetalle(null); setMostrarErrorPago(false); }}>
          <DialogContent className="max-w-2xl rounded-lg font-sans p-5 sm:p-6 border border-slate-200">
            <DialogHeader className="pb-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    Orden {pedidoDetalle.id}
                  </DialogTitle>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Registrada el {formatDate(new Date(pedidoDetalle.creadoEn))}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      pedidoDetalle.estado === "verificado"
                        ? "bg-emerald-500"
                        : pedidoDetalle.estado === "entregado"
                        ? "bg-blue-500"
                        : pedidoDetalle.estado === "cancelado"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <span
                    className={
                      pedidoDetalle.estado === "verificado"
                        ? "text-emerald-700"
                        : pedidoDetalle.estado === "entregado"
                        ? "text-blue-700"
                        : pedidoDetalle.estado === "cancelado"
                        ? "text-rose-700"
                        : "text-amber-700"
                    }
                  >
                    {pedidoDetalle.estado === "verificado"
                      ? "Verificado"
                      : pedidoDetalle.estado === "entregado"
                      ? "Entregado"
                      : pedidoDetalle.estado === "cancelado"
                      ? "Cancelado (Stock devuelto)"
                      : "Pendiente"}
                  </span>
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              {/* Contenido en 2 Columnas Equilibradas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                {/* Columna Izquierda: Cliente & Pago */}
                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cliente & Entrega</span>
                    <p className="font-bold text-slate-900 text-sm">{pedidoDetalle.clienteNombre}</p>
                    <p className="flex items-center gap-1.5 text-slate-600 font-mono text-xs">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{pedidoDetalle.clienteTelefono}</span>
                    </p>
                    {pedidoDetalle.direccion ? (
                      <p className="flex items-start gap-1 text-slate-600 text-[11px] pt-1 border-t border-slate-200/60">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{pedidoDetalle.direccion}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        📍 Retiro directo en salón
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pago</span>
                      <span className="font-bold text-sm text-slate-900 font-mono">
                        {formatCurrency(pedidoDetalle.total)}
                      </span>
                    </div>

                    {pedidoDetalle.metodoPago === "pagomovil" && pedidoDetalle.pagoMovil ? (
                      <div className="p-2 bg-blue-50/60 rounded-sm border border-blue-200 text-[11px] text-slate-700 space-y-0.5">
                        <p className="flex justify-between">
                          <span><strong>Banco:</strong> {pedidoDetalle.pagoMovil.banco}</span>
                          <span><strong>Ref:</strong> <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded-sm border border-blue-300 text-slate-900">{pedidoDetalle.pagoMovil.referencia}</span></span>
                        </p>
                        {pedidoDetalle.pagoMovil.telefonoEmisor && (
                          <p><strong>Tel. Emisor:</strong> <span className="font-mono">{pedidoDetalle.pagoMovil.telefonoEmisor}</span></p>
                        )}
                      </div>
                    ) : (
                      <div className="p-2 bg-emerald-50/60 rounded-sm border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-1.5">
                        <Banknote className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>Pago en efectivo al retirar/recibir</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Columna Derecha: Productos en la Orden & Avisos */}
                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Productos ({pedidoDetalle.items.length})
                    </span>
                    <div className="divide-y divide-slate-200 bg-white rounded-sm border border-slate-200 p-2 max-h-36 overflow-y-auto space-y-1">
                      {pedidoDetalle.items.map((it, idx) => (
                        <div key={idx} className="py-1 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                          <div className="min-w-0 pr-2">
                            <p className="font-semibold text-slate-900 truncate">{it.nombre}</p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {it.cantidad} {it.cantidad === 1 ? "ud." : "uds."} &times; {formatCurrency(it.precio)}
                            </p>
                          </div>
                          <span className="font-bold text-slate-900 font-mono shrink-0">
                            {formatCurrency(it.precio * it.cantidad)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avisos contextuales */}
                  {pedidoDetalle.estado === "verificado" && (
                    <div className="flex items-center justify-between gap-2 p-2 bg-emerald-50 rounded-sm border border-emerald-200 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                        <span className="text-[11px] text-emerald-900 truncate">
                          {pedidoDetalle.notificadoWhatsApp ? "✓ Ya notificado" : "Pago verificado"}
                        </span>
                      </div>
                      {!pedidoDetalle.notificadoWhatsApp && (
                        <a
                          href={getPedidoWhatsAppUrl(pedidoDetalle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => marcarNotificadoWhatsApp(pedidoDetalle.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shrink-0"
                        >
                          <WhatsAppIcon className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  )}

                  {pedidoDetalle.estado === "cancelado" && (
                    <div className="p-2 bg-rose-50 rounded-sm border border-rose-200 text-xs flex items-center justify-between gap-1">
                      <span className="text-[11px] text-rose-800 truncate">
                        Cancelado &bull; Stock devuelto
                      </span>
                      <a
                        href={getPedidoPagoErroneoWhatsAppUrl(pedidoDetalle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 shrink-0"
                      >
                        <WhatsAppIcon className="w-2.5 h-2.5 text-[#25D366]" />
                        <span>Avisar</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de Acción al Pie */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
                {pedidoDetalle.estado === "pendiente_verificacion" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "verificado")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold shadow-xs"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Verificar Pago
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await cambiarEstado(pedidoDetalle.id, "cancelado", "Pago no comprobado (comprobante erróneo)");
                        if (typeof window !== "undefined") {
                          window.open(getPedidoPagoErroneoWhatsAppUrl(pedidoDetalle), "_blank");
                        }
                      }}
                      className="text-amber-800 hover:text-amber-950 hover:bg-amber-50 border-amber-300 rounded-sm text-xs font-medium"
                      title="Cancela la compra debido a comprobante erróneo, devuelve el stock y abre WhatsApp"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600" />
                      <span>Datos de pago erróneos</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "cancelado", "Cancelado por el administrador")}
                      className="text-rose-700 hover:text-rose-900 hover:bg-rose-50 border-rose-300 rounded-sm text-xs font-medium"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancelar Orden
                    </Button>
                  </>
                )}

                {pedidoDetalle.estado === "verificado" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "entregado")}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-semibold shadow-xs"
                    >
                      Marcar como Entregado
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(pedidoDetalle.id, "pendiente_verificacion")}
                      className="text-amber-800 hover:text-amber-950 hover:bg-amber-50 border-amber-300 rounded-sm text-xs font-medium"
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
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300 rounded-sm text-xs font-medium"
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
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-sm text-xs font-semibold shadow-xs"
                    title="Reactivar orden (descontará nuevamente el stock de inventario)"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reactivar Orden
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
