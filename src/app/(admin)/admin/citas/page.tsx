"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  CalendarCheck,
  Clock,
  Phone,
  RefreshCw,
  RotateCcw,
  Landmark,
  Banknote,
  Eye,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatCurrency } from "@/lib/utils";
import { normalizeName } from "@/lib/booking-availability";
import { useAuthStore } from "@/store/auth-store";
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
  if (cita.metodoPago === "efectivo") {
    return (
      `¡Hola ${cita.clienteNombre}! 👋 Te saludamos desde *Estudio Xiorizos* en Naguanagua.\n\n` +
      `Hemos registrado tu reserva de cita con método de pago en efectivo en salón:\n` +
      `📅 *Fecha:* ${formatDate(new Date(cita.fecha))}\n` +
      `⏰ *Hora:* ${cita.hora}\n` +
      `✂️ *Servicio:* ${cita.servicioNombre}\n` +
      `👤 *Especialista:* ${cita.profesionalNombre}\n` +
      `📍 *Lugar:* Planta Baja, Torre Anexa, Centro Científico Metropolitano del Norte, Naguanagua, Edo. Carabobo.\n\n` +
      `Nos ponemos en contacto contigo para verificar los detalles y dejar tu turno reservado. ¡Te esperamos con mucho amor para consentir tus rizos! 🌿✨`
    );
  }

  // Pago Móvil confirmado
  return (
    `¡Hola ${cita.clienteNombre}! 👋 Te saludamos desde *Estudio Xiorizos* en Naguanagua.\n\n` +
    `✅ *¡Tu abono de reserva ha sido verificado con éxito!*\n\n` +
    `✨ *Tu cita está CONFIRMADA:*\n` +
    `📅 *Fecha:* ${formatDate(new Date(cita.fecha))}\n` +
    `⏰ *Hora:* ${cita.hora}\n` +
    `✂️ *Servicio:* ${cita.servicioNombre}\n` +
    `👤 *Especialista:* ${cita.profesionalNombre}\n` +
    `📍 *Lugar:* Planta Baja, Torre Anexa, Centro Científico Metropolitano del Norte, Naguanagua, Edo. Carabobo.\n\n` +
    `¡Te esperamos con muchas ganas para cuidar y consentir tus rizos! 🌿✨`
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
  const [citaDetalle, setCitaDetalle] = useState<DBAppointment | null>(null);

  const user = useAuthStore((state) => state.user);
  const esAdmin = user?.rol === "admin";

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
    nuevoEstado: "pendiente" | "confirmada" | "completada" | "cancelada"
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
        if (citaDetalle?.id === id) {
          setCitaDetalle((prev) => (prev ? { ...prev, estado: nuevoEstado } : null));
        }
        window.dispatchEvent(new CustomEvent("xiorizos-admin-update"));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function marcarNotificadoWhatsApp(id: string) {
    try {
      const res = await fetch("/api/citas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notificadoWhatsApp: true }),
      });
      const data = await res.json();
      if (data.success) {
        setCitas((prev) =>
          prev.map((c) => (c.id === id ? { ...c, notificadoWhatsApp: true } : c))
        );
        if (citaDetalle?.id === id) {
          setCitaDetalle((prev) => (prev ? { ...prev, notificadoWhatsApp: true } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Filtrado: los empleados solo ven las citas donde ellos son el profesional asignado
  const citasFiltradas = esAdmin
    ? citas
    : citas.filter((c) => {
        const profNorm = normalizeName(c.profesionalNombre);
        const userNorm = normalizeName(user?.nombre || "");
        const userFirst = userNorm.split(" ")[0];
        return profNorm.includes(userFirst) || userNorm.includes(profNorm);
      });

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {esAdmin ? "Agenda de Citas" : "Mis Citas Agendadas"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {esAdmin
              ? "Control de turnos, confirmación de abonos y asignación de especialistas."
              : `Turnos asignados a ${user?.nombre || "tu agenda de trabajo"}.`}
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

      {/* Contenedor de Tabla con bordes limpios (rounded-md) */}
      <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            {esAdmin
              ? `Citas registradas (${citasFiltradas.length})`
              : `Mis citas asignadas (${citasFiltradas.length})`}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {cargando ? (
            <div className="py-12 text-center text-xs text-slate-500">Cargando citas...</div>
          ) : citasFiltradas.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No hay citas registradas para mostrar.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[190px] whitespace-nowrap">Cliente & Contacto</th>
                  <th className="py-3 px-4 min-w-[160px]">Servicio & Abono</th>
                  <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">Especialista</th>
                  <th className="py-3 px-4 min-w-[150px] whitespace-nowrap">Fecha & Hora</th>
                  <th className="py-3 px-4 min-w-[180px]">Notas</th>
                  <th className="py-3 px-4 min-w-[120px] whitespace-nowrap">Estado</th>
                  <th className="py-3 px-4 min-w-[200px] text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {citasFiltradas.map((cita) => {
                  const reserva = cita.montoReserva || Math.round(cita.servicioPrecio * 0.2 * 100) / 100;

                  // Condición de WhatsApp: solo si está confirmada o es efectivo
                  const puedeEnviarWhatsApp =
                    cita.estado === "confirmada" || cita.metodoPago === "efectivo";

                  return (
                    <tr key={cita.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Cliente y Teléfono */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-900 text-sm tracking-tight">{cita.clienteNombre}</p>
                        <p className="flex items-center gap-1.5 text-slate-600 mt-0.5 text-xs font-mono font-medium">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{cita.clienteTelefono}</span>
                        </p>
                      </td>

                      {/* Servicio y Abono */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 text-xs">{cita.servicioNombre}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                          <span>Total: {formatCurrency(cita.servicioPrecio)}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-emerald-700 font-semibold">20%: {formatCurrency(reserva)}</span>
                        </div>
                      </td>

                      {/* Especialista */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {cita.profesionalNombre}
                      </td>

                      {/* Fecha y Hora */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-medium text-slate-800">
                          {formatDate(new Date(cita.fecha))}
                        </p>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5 text-xs font-mono">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{cita.hora}</span>
                        </p>
                      </td>

                      {/* Notas: Truncado estricto para no colisionar con el siguiente campo */}
                      <td className="py-3.5 px-4 max-w-[180px]">
                        <p
                          className="truncate text-slate-600 cursor-help"
                          title={cita.notas || "Sin notas"}
                        >
                          {cita.notas || <span className="text-slate-400 italic">Sin notas</span>}
                        </p>
                      </td>

                      {/* Estado: Badge limpio (NO selector editable en tabla) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                            cita.estado === "confirmada"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : cita.estado === "completada"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : cita.estado === "cancelada"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {cita.estado === "confirmada"
                            ? "Confirmada"
                            : cita.estado === "completada"
                            ? "Completada"
                            : cita.estado === "cancelada"
                            ? "Cancelada"
                            : "Pendiente"}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Botón WhatsApp: SOLO aparece tras confirmar o en efectivo, y desaparece tras ser notificado */}
                          {puedeEnviarWhatsApp && (
                            cita.notificadoWhatsApp ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200">
                                <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                                <span>Notificado</span>
                              </span>
                            ) : (
                              <a
                                href={getCitaWhatsAppUrl(cita)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => marcarNotificadoWhatsApp(cita.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all cursor-pointer shadow-xs"
                                title="Enviar confirmación oficial por WhatsApp"
                              >
                                <WhatsAppIcon className="h-3 w-3" />
                                <span>WhatsApp</span>
                              </a>
                            )
                          )}

                          {/* Botón único de Detalle y Gestión para evitar redundancia */}
                          <button
                            type="button"
                            onClick={() => setCitaDetalle(cita)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                            title="Ver información completa y gestionar cita"
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

      {/* Modal Detalle Completo y Gestión de la Cita */}
      {citaDetalle && (
        <Dialog open={!!citaDetalle} onOpenChange={() => setCitaDetalle(null)}>
          <DialogContent className="max-w-lg rounded-md max-h-[85vh] overflow-y-auto font-sans">
            <DialogHeader className="pb-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base font-bold text-slate-900">
                  Detalle de Cita
                </DialogTitle>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                    citaDetalle.estado === "confirmada"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : citaDetalle.estado === "completada"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : citaDetalle.estado === "cancelada"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {citaDetalle.estado === "confirmada"
                    ? "Confirmada"
                    : citaDetalle.estado === "completada"
                    ? "Completada"
                    : citaDetalle.estado === "cancelada"
                    ? "Cancelada"
                    : "Pendiente"}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              {/* Tarjeta de Cliente y Contacto */}
              <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-1.5">
                <p className="font-semibold text-slate-900 text-sm">{citaDetalle.clienteNombre}</p>
                <p className="flex items-center gap-1.5 text-slate-600 font-mono">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{citaDetalle.clienteTelefono}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-slate-700">
                  <p><strong>Servicio:</strong> {citaDetalle.servicioNombre}</p>
                  <p><strong>Especialista:</strong> {citaDetalle.profesionalNombre}</p>
                  <p><strong>Fecha:</strong> {formatDate(new Date(citaDetalle.fecha))}</p>
                  <p><strong>Hora:</strong> {citaDetalle.hora}</p>
                </div>
              </div>

              {/* Información de Pago y Reserva */}
              <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 space-y-1.5 text-slate-700">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">Método de Abono:</span>
                  <span className="font-medium flex items-center gap-1">
                    {citaDetalle.metodoPago === "pagomovil" ? (
                      <>
                        <Landmark className="h-3.5 w-3.5 text-blue-600" />
                        <span>Pago Móvil</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="h-3.5 w-3.5 text-slate-600" />
                        <span>Efectivo en Salón</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500">Total Servicio:</span>
                    <p className="font-bold text-slate-900">{formatCurrency(citaDetalle.servicioPrecio)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Abono 20%:</span>
                    <p className="font-bold text-emerald-700">
                      {formatCurrency(citaDetalle.montoReserva || citaDetalle.servicioPrecio * 0.2)}
                    </p>
                  </div>
                </div>

                {citaDetalle.metodoPago === "pagomovil" && citaDetalle.pagoMovil && (
                  <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
                    <p><strong>Banco Emisor:</strong> {citaDetalle.pagoMovil.banco}</p>
                    <p>
                      <strong>Número de Referencia:</strong>{" "}
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                        {citaDetalle.pagoMovil.referencia}
                      </span>
                    </p>
                    {citaDetalle.pagoMovil.telefonoEmisor && (
                      <p><strong>Teléfono Emisor:</strong> {citaDetalle.pagoMovil.telefonoEmisor}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Notas del Cliente completas (sin recortar) */}
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Notas o indicaciones del cliente:</span>
                </p>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {citaDetalle.notas ? citaDetalle.notas : <span className="text-slate-400 italic">No se indicaron notas adicionales.</span>}
                </p>
              </div>

              {/* Notificación por WhatsApp dentro del Modal */}
              <div className="p-3 bg-emerald-50/50 rounded-md border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Notificación por WhatsApp:</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {citaDetalle.notificadoWhatsApp
                      ? "Ya se envió mensaje de confirmación/contacto al cliente."
                      : "Puedes enviar el mensaje oficial predeterminado directamente."}
                  </p>
                </div>
                {citaDetalle.notificadoWhatsApp ? (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    ✓ Ya notificado
                  </span>
                ) : (
                  <a
                    href={getCitaWhatsAppUrl(citaDetalle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => marcarNotificadoWhatsApp(citaDetalle.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-xs shrink-0"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Abrir WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Botones de Acción Reversibles */}
              {esAdmin && (
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
                  {citaDetalle.estado === "pendiente" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => cambiarEstado(citaDetalle.id, "confirmada")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Confirmar Cita
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cambiarEstado(citaDetalle.id, "cancelada")}
                        className="text-rose-700 hover:bg-rose-50 border-rose-200 rounded-md text-xs"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Cancelar Cita
                      </Button>
                    </>
                  )}

                  {citaDetalle.estado === "confirmada" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => cambiarEstado(citaDetalle.id, "completada")}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold"
                      >
                        <CalendarCheck className="h-3.5 w-3.5 mr-1" />
                        Marcar Atendida
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cambiarEstado(citaDetalle.id, "pendiente")}
                        className="text-amber-700 hover:bg-amber-50 border-amber-200 rounded-md text-xs"
                        title="Revertir por si se confirmó por error"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Revertir a Pendiente
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cambiarEstado(citaDetalle.id, "cancelada")}
                        className="text-rose-700 hover:bg-rose-50 border-rose-200 rounded-md text-xs"
                      >
                        Cancelar
                      </Button>
                    </>
                  )}

                  {citaDetalle.estado === "completada" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(citaDetalle.id, "confirmada")}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs"
                      title="Reabrir si se marcó por error"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Revertir a Confirmada
                    </Button>
                  )}

                  {citaDetalle.estado === "cancelada" && (
                    <Button
                      size="sm"
                      onClick={() => cambiarEstado(citaDetalle.id, "confirmada")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold"
                      title="Deshacer cancelación"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Reactivar Cita
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
