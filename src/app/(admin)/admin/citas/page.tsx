"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  CalendarCheck,
  Clock,
  Phone,
  RefreshCw,
  Scissors,
  RotateCcw,
  Landmark,
  Banknote,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { DBAppointment } from "@/lib/db";

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

function getCitaWhatsAppMessage(cita: DBAppointment): string {
  const reserva = cita.montoReserva || Math.round(cita.servicioPrecio * 0.2 * 100) / 100;
  const restante = cita.montoRestante || Math.round((cita.servicioPrecio - reserva) * 100) / 100;

  let detalleAbono = "";
  if (cita.metodoPago === "pagomovil" && cita.pagoMovil) {
    detalleAbono = `Hemos verificado con éxito tu abono del 20% ($${reserva.toFixed(2)}) por Pago Móvil (Banco: ${cita.pagoMovil.banco}, Ref: ${cita.pagoMovil.referencia}).`;
  } else {
    detalleAbono = `Hemos comprobado y registrado tu abono de reserva del 20% ($${reserva.toFixed(2)}).`;
  }

  return (
    `¡Hola ${cita.clienteNombre}! 👋 Te saludamos de *Estudio Xiorizos* en Naguanagua.\n\n` +
    `✅ *¡Tu pago de reserva ha sido comprobado con éxito!*\n` +
    `${detalleAbono}\n\n` +
    `✨ *Tu cita ha sido CONFIRMADA oficialmente:*\n` +
    `📅 *Fecha:* ${formatDate(new Date(cita.fecha))}\n` +
    `⏰ *Hora:* ${cita.hora}\n` +
    `✂️ *Servicio:* ${cita.servicioNombre}\n` +
    `👤 *Especialista:* ${cita.profesionalNombre}\n` +
    `💵 *Monto restante a pagar en el salón (80%):* $${restante.toFixed(2)}\n` +
    `📍 *Lugar:* Planta Baja, Torre Anexa, Centro Científico Metropolitano del Norte, Naguanagua, Edo. Carabobo.\n\n` +
    `¡Te esperamos con mucho amor para cuidar y consentir tus rizos! 🌿✨ Si necesitas reprogramar con anticipación, por favor escríbenos por aquí.`
  );
}

function getCitaWhatsAppUrl(cita: DBAppointment): string {
  const phone = normalizePhoneForWhatsApp(cita.clienteTelefono);
  const msg = getCitaWhatsAppMessage(cita);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export default function AdminCitasPage() {
  const [citas, setCitas] = useState<DBAppointment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalWhatsAppCita, setModalWhatsAppCita] = useState<DBAppointment | null>(null);

  async function cargarCitas() {
    setCargando(true);
    try {
      const res = await fetch("/api/citas");
      const data = await res.json();
      if (data.success && data.citas) {
        setCitas(data.citas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cambiarEstado(
    id: string,
    nuevoEstado: "pendiente" | "confirmada" | "completada" | "cancelada",
    abrirWhatsAppModal = false
  ) {
    try {
      const res = await fetch("/api/citas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) {
        setCitas((prev) =>
          prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
        );
        // Notificar en vivo a la barra de notificaciones para que se actualice inmediatamente
        window.dispatchEvent(new CustomEvent("xiorizos-admin-update"));

        if (abrirWhatsAppModal) {
          const citaActualizada = citas.find((c) => c.id === id);
          if (citaActualizada) {
            setModalWhatsAppCita({ ...citaActualizada, estado: nuevoEstado });
          }
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
            Agenda de Citas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Control de reservas de clientes, especialistas asignados y confirmación de turnos.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={cargarCitas}
          className="rounded-md border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Contenedor de Tabla con anchos fijos y sin saltos de línea antiestéticos */}
      <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Citas registradas ({citas.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          {cargando ? (
            <div className="py-12 text-center text-xs text-slate-500">Cargando citas...</div>
          ) : citas.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No hay citas registradas en el sistema aún.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">Cliente & Contacto</th>
                  <th className="py-3 px-4 min-w-[170px]">Servicio & Total</th>
                  <th className="py-3 px-4 min-w-[200px] whitespace-nowrap">Reserva (20%) & Pago</th>
                  <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">Especialista</th>
                  <th className="py-3 px-4 min-w-[160px] whitespace-nowrap">Fecha & Hora</th>
                  <th className="py-3 px-4 min-w-[140px]">Notas</th>
                  <th className="py-3 px-4 min-w-[130px] whitespace-nowrap">Estado</th>
                  <th className="py-3 px-4 min-w-[220px] text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {citas.map((cita) => {
                  const reserva = cita.montoReserva || Math.round(cita.servicioPrecio * 0.2 * 100) / 100;
                  const restante = cita.montoRestante || Math.round((cita.servicioPrecio - reserva) * 100) / 100;

                  return (
                    <tr key={cita.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Cliente y Teléfono sin saltos de línea cortados */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-900 text-sm tracking-tight">{cita.clienteNombre}</p>
                        <p className="flex items-center gap-1.5 text-slate-600 mt-0.5 text-xs font-mono font-medium">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{cita.clienteTelefono}</span>
                        </p>
                      </td>

                      {/* Servicio y Precio */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 text-xs sm:text-sm">{cita.servicioNombre}</p>
                        <p className="text-slate-500 font-medium">Total: {formatCurrency(cita.servicioPrecio)}</p>
                      </td>

                      {/* Abono 20% y Estado de Pago */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
                              Abono 20%: {formatCurrency(reserva)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              (Resta: {formatCurrency(restante)})
                            </span>
                          </div>
                          {cita.metodoPago === "pagomovil" && cita.pagoMovil ? (
                            <div className="space-y-0.5 text-[11px] text-slate-600">
                              <p className="flex items-center gap-1">
                                <Landmark className="h-3 w-3 text-blue-600 shrink-0" />
                                <span>
                                  {cita.pagoMovil.banco} &bull; Ref: <strong className="font-mono text-slate-900 bg-slate-100 px-1 rounded">{cita.pagoMovil.referencia}</strong>
                                </span>
                              </p>
                              {cita.pagoMovil.telefonoEmisor && (
                                <p className="text-[10px] text-slate-500 font-mono">
                                  Emisor: {cita.pagoMovil.telefonoEmisor}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Banknote className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>Efectivo en recepción</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Especialista */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {cita.profesionalNombre}
                      </td>

                    {/* Fecha y Hora en una sola línea armónica */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800">
                        {formatDate(new Date(cita.fecha))}
                      </p>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5 text-xs font-mono">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{cita.hora}</span>
                      </p>
                    </td>

                    {/* Notas */}
                    <td className="py-3.5 px-4 max-w-[200px] text-slate-500 truncate" title={cita.notas}>
                      {cita.notas || "Sin notas"}
                    </td>

                    {/* Estado con Selector / Indicador */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={cita.estado}
                        onChange={(e) =>
                          cambiarEstado(
                            cita.id,
                            e.target.value as "pendiente" | "confirmada" | "completada" | "cancelada"
                          )
                        }
                        className={`text-xs font-semibold px-2 py-1 rounded border cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400 ${
                          cita.estado === "confirmada"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : cita.estado === "completada"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : cita.estado === "cancelada"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>

                    {/* Acciones reversibles para cualquier estado */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón directo de WhatsApp para contactar o notificar al cliente */}
                        <a
                          href={getCitaWhatsAppUrl(cita)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all cursor-pointer shadow-xs"
                          title="Enviar mensaje de confirmación oficial al WhatsApp del cliente"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {cita.estado === "pendiente" && (
                          <>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "confirmada", true)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                              title="Confirmar cita y enviar WhatsApp"
                            >
                              <Check className="h-3 w-3" />
                              <span>Confirmar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "cancelada")}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                              title="Cancelar cita"
                            >
                              <X className="h-3 w-3" />
                              <span>Cancelar</span>
                            </button>
                          </>
                        )}

                        {cita.estado === "confirmada" && (
                          <>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "completada")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                              title="Marcar como atendida/completada"
                            >
                              <CalendarCheck className="h-3 w-3" />
                              <span>Completada</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "pendiente")}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                              title="Revertir a Pendiente"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Pendiente</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "cancelada")}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                              title="Cancelar cita"
                            >
                              <X className="h-3 w-3" />
                              <span>Cancelar</span>
                            </button>
                          </>
                        )}

                        {cita.estado === "cancelada" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(cita.id, "confirmada", true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                            title="Deshacer cancelación y reactivar la cita"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Reactivar cita</span>
                          </button>
                        )}

                        {cita.estado === "completada" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(cita.id, "confirmada")}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                            title="Reabrir cita"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Reabrir</span>
                          </button>
                        )}
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

      {/* Modal Dialog para Notificación de Cita por WhatsApp */}
      {modalWhatsAppCita && (
        <Dialog open={!!modalWhatsAppCita} onOpenChange={() => setModalWhatsAppCita(null)}>
          <DialogContent className="max-w-md rounded-md max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-2 border-b border-slate-200">
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <p className="leading-tight">Cita Confirmada</p>
                  <p className="text-[11px] font-normal text-slate-500">
                    Notificar comprobación de abono por WhatsApp
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-900 text-sm">
                  {modalWhatsAppCita.clienteNombre}
                </p>
                <p className="text-slate-600 font-mono">
                  Teléfono: {modalWhatsAppCita.clienteTelefono}
                </p>
                <p className="text-slate-600">
                  <strong>Servicio:</strong> {modalWhatsAppCita.servicioNombre}
                </p>
                <p className="text-slate-600">
                  <strong>Fecha y Hora:</strong> {formatDate(new Date(modalWhatsAppCita.fecha))} a las {modalWhatsAppCita.hora}
                </p>
                <p className="text-slate-600">
                  <strong>Especialista:</strong> {modalWhatsAppCita.profesionalNombre}
                </p>
                {modalWhatsAppCita.pagoMovil && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-slate-700">
                    <p className="font-semibold text-slate-800">Comprobante Pago Móvil:</p>
                    <p>Banco: {modalWhatsAppCita.pagoMovil.banco} &bull; Ref: <strong className="font-mono">{modalWhatsAppCita.pagoMovil.referencia}</strong></p>
                    {modalWhatsAppCita.pagoMovil.telefonoEmisor && (
                      <p className="font-mono text-slate-500">Teléfono emisor: {modalWhatsAppCita.pagoMovil.telefonoEmisor}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-1">
                  Mensaje preparado para WhatsApp:
                </p>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-[11px] font-sans whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                  {getCitaWhatsAppMessage(modalWhatsAppCita)}
                </pre>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalWhatsAppCita(null)}
                  className="rounded-md text-xs border-slate-300"
                >
                  Cerrar
                </Button>

                <a
                  href={getCitaWhatsAppUrl(modalWhatsAppCita)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setModalWhatsAppCita(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Abrir WhatsApp y Enviar</span>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
