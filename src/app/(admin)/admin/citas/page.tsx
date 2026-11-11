"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  CalendarCheck,
  AlertTriangle,
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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

function getCitaPagoErroneoWhatsAppMessage(cita: DBAppointment): string {
  const reserva = cita.montoReserva || Math.round(cita.servicioPrecio * 0.2 * 100) / 100;
  return (
    `¡Hola ${cita.clienteNombre}! 👋 Te saludamos desde *Estudio Xiorizos* en Naguanagua.\n\n` +
    `Estuvimos revisando tu reserva para el *${formatDate(new Date(cita.fecha))}* a las *${cita.hora}*, pero no pudimos comprobar el abono del 20% (${formatCurrency(reserva)}) porque los datos bancarios ingresados presentan alguna inconsistencia.\n\n` +
    `Por favor, reenvíanos los datos correctos por aquí o comparte una captura del comprobante bancario para verificarlo y dejar tu turno confirmado oficialmente:\n\n` +
    `📋 *Formato para comprobar tu pago:*\n` +
    `• Banco emisor:\n` +
    `• Número de referencia:\n` +
    `• Teléfono emisor:\n` +
    `• Monto transferido ($ o Bs.):\n\n` +
    `¡Quedamos atentos para ayudarte a asegurar tu cita! 🌿✨`
  );
}

function getCitaPagoErroneoWhatsAppUrl(cita: DBAppointment): string {
  const phone = normalizePhoneForWhatsApp(cita.clienteTelefono);
  const msg = getCitaPagoErroneoWhatsAppMessage(cita);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function getCitaWhatsAppUrl(cita: DBAppointment): string {
  const phone = normalizePhoneForWhatsApp(cita.clienteTelefono);
  const msg = getCitaWhatsAppMessage(cita);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function haPasadoTiempoCita(fechaStr?: string, horaStr?: string): boolean {
  if (!fechaStr) return false;
  try {
    const datePart = fechaStr.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);
    if (!year || !month || !day) return false;

    let hour = 0;
    let minute = 0;
    if (horaStr) {
      const [h, m] = horaStr.split(":").map(Number);
      if (!isNaN(h)) hour = h;
      if (!isNaN(m)) minute = m;
    }

    const citaDate = new Date(year, month - 1, day, hour, minute);
    return citaDate.getTime() <= Date.now();
  } catch {
    return false;
  }
}

export default function AdminCitasPage() {
  const [citas, setCitas] = useState<DBAppointment[]>([]);
  const [cargando, setCargando] = useState(true);
  const [citaDetalle, setCitaDetalle] = useState<DBAppointment | null>(null);
  const [mostrarErrorPago, setMostrarErrorPago] = useState(false);
  const [modalCancelarOpen, setModalCancelarOpen] = useState(false);
  const [citaACancelar, setCitaACancelar] = useState<DBAppointment | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [guardandoCancelacion, setGuardandoCancelacion] = useState(false);


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
    nuevoEstado: "pendiente" | "confirmada" | "completada" | "cancelada",
    motivo?: string
  ) {
    try {
      const res = await fetch("/api/citas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado, motivoCancelacion: motivo }),
      });
      const data = await res.json();
      if (data.success) {
        setCitas((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, estado: nuevoEstado, motivoCancelacion: motivo ?? c.motivoCancelacion } : c
          )
        );
        if (citaDetalle?.id === id) {
          setCitaDetalle((prev) =>
            prev ? { ...prev, estado: nuevoEstado, motivoCancelacion: motivo ?? prev.motivoCancelacion } : null
          );
        }
        window.dispatchEvent(new CustomEvent("xiorizos-admin-update"));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConfirmarCancelarCita() {
    if (!citaACancelar) return;
    setGuardandoCancelacion(true);
    try {
      await cambiarEstado(citaACancelar.id, "cancelada", motivoCancelacion.trim());
      setModalCancelarOpen(false);
      setCitaACancelar(null);
      setMotivoCancelacion("");
    } finally {
      setGuardandoCancelacion(false);
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
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Servicio</th>
                  <th className="py-3 px-4 whitespace-nowrap">Especialista</th>
                  <th className="py-3 px-4 whitespace-nowrap">Fecha & Hora</th>
                  <th className="py-3 px-4 whitespace-nowrap">Estado</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {citasFiltradas.map((cita) => {
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

                      {/* Servicio */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 text-xs">{cita.servicioNombre}</p>
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

                      {/* Estado: Indicador dot puro, sin contenedor ni recuadros */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              cita.estado === "confirmada"
                                ? "bg-emerald-500"
                                : cita.estado === "completada"
                                ? "bg-blue-500"
                                : cita.estado === "cancelada"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span
                            className={
                              cita.estado === "confirmada"
                                ? "text-emerald-700"
                                : cita.estado === "completada"
                                ? "text-blue-700"
                                : cita.estado === "cancelada"
                                ? "text-rose-700"
                                : "text-amber-700"
                            }
                          >
                            {cita.estado === "confirmada"
                              ? "Confirmada"
                              : cita.estado === "completada"
                              ? "Completada"
                              : cita.estado === "cancelada"
                              ? "Cancelada"
                              : "Pendiente"}
                          </span>
                        </span>
                      </td>

                      {/* Acción única: Detalle */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setCitaDetalle(cita)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-xs"
                          title="Ver información completa y gestionar cita"
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
      </div>

      {/* Modal Rediseñado: Detalle Completo y Gestión de la Cita */}
      {citaDetalle && (
        <Dialog open={!!citaDetalle} onOpenChange={() => { setCitaDetalle(null); setMostrarErrorPago(false); }}>
          <DialogContent className="max-w-xl rounded-sm max-h-[90vh] overflow-y-auto font-sans p-5 sm:p-6 border border-slate-200">
            <DialogHeader className="pb-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    Detalle de Cita
                  </DialogTitle>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ID: {citaDetalle.id} &bull; Solicitada: {formatDate(new Date(citaDetalle.creadoEn || citaDetalle.fecha))}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      citaDetalle.estado === "confirmada"
                        ? "bg-emerald-500"
                        : citaDetalle.estado === "completada"
                        ? "bg-blue-500"
                        : citaDetalle.estado === "cancelada"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <span
                    className={
                      citaDetalle.estado === "confirmada"
                        ? "text-emerald-700"
                        : citaDetalle.estado === "completada"
                        ? "text-blue-700"
                        : citaDetalle.estado === "cancelada"
                        ? "text-rose-700"
                        : "text-amber-700"
                    }
                  >
                    {citaDetalle.estado === "confirmada"
                      ? "Confirmada"
                      : citaDetalle.estado === "completada"
                      ? "Completada"
                      : citaDetalle.estado === "cancelada"
                      ? "Cancelada"
                      : "Pendiente"}
                  </span>
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-3.5 pt-2 text-xs divide-y divide-slate-100">
              {/* Sección 1: Datos del Cliente */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cliente</span>
                <p className="font-bold text-slate-900 text-sm">{citaDetalle.clienteNombre}</p>
                <p className="flex items-center gap-1.5 text-slate-600 font-mono text-xs mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{citaDetalle.clienteTelefono}</span>
                </p>
              </div>

              {/* Sección 2: Servicio & Horario */}
              <div className="pt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Servicio Agendado</span>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Servicio:</span>
                    <p className="font-semibold text-slate-900">{citaDetalle.servicioNombre}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Especialista:</span>
                    <p className="font-semibold text-slate-900">{citaDetalle.profesionalNombre}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Fecha:</span>
                    <p className="font-semibold text-slate-900">{formatDate(new Date(citaDetalle.fecha))}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Hora:</span>
                    <p className="font-semibold text-slate-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{citaDetalle.hora}</span>
                      {citaDetalle.duracionMin && <span className="text-slate-500 font-normal">({citaDetalle.duracionMin} min)</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección 3: Desglose de Pago */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Desglose de Pago</span>
                  <span className="font-medium text-xs flex items-center gap-1 text-slate-700">
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

                <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 p-2 rounded-sm border border-slate-200">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Total Servicio</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{formatCurrency(citaDetalle.servicioPrecio)}</p>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Abono 20% (Reserva)</span>
                    <p className="font-bold text-emerald-700 text-sm mt-0.5">
                      {formatCurrency(citaDetalle.montoReserva || Math.round(citaDetalle.servicioPrecio * 0.2 * 100) / 100)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Restante Salón (80%)</span>
                    <p className="font-bold text-slate-700 text-sm mt-0.5">
                      {formatCurrency(citaDetalle.montoRestante || Math.round((citaDetalle.servicioPrecio * 0.8) * 100) / 100)}
                    </p>
                  </div>
                </div>

                {citaDetalle.metodoPago === "pagomovil" && citaDetalle.pagoMovil && (
                  <div className="p-2.5 bg-slate-50 rounded-sm border border-slate-200 space-y-1 text-slate-700">
                    <p><strong>Banco:</strong> {citaDetalle.pagoMovil.banco}</p>
                    <p>
                      <strong>Número de Referencia:</strong>{" "}
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded-sm border border-slate-200 text-slate-900">
                        {citaDetalle.pagoMovil.referencia}
                      </span>
                    </p>
                    {citaDetalle.pagoMovil.telefonoEmisor && (
                      <p><strong>Teléfono Emisor:</strong> <span className="font-mono">{citaDetalle.pagoMovil.telefonoEmisor}</span></p>
                    )}
                  </div>
                )}
              </div>

              {/* Sección 4: Notas del Cliente */}
              {citaDetalle.notas && (
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notas o Indicaciones</span>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                    {citaDetalle.notas}
                  </p>
                </div>
              )}

              {/* Sección 5: Opciones de Contacto WhatsApp (AL FINAL DEL MODAL) */}
              <div className="pt-3 space-y-2">
                {/* Contacto tras confirmación */}
                {citaDetalle.estado === "confirmada" && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-emerald-50 rounded-sm border border-emerald-200">
                    <div>
                      <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Confirmación por WhatsApp</span>
                      </p>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        {citaDetalle.notificadoWhatsApp
                          ? "Ya se notificó la confirmación oficial al cliente."
                          : "Envía el mensaje oficial con fecha, hora y lugar."}
                      </p>
                    </div>
                    {citaDetalle.notificadoWhatsApp ? (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-sm shrink-0">
                        ✓ Ya notificado
                      </span>
                    ) : (
                      <a
                        href={getCitaWhatsAppUrl(citaDetalle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => marcarNotificadoWhatsApp(citaDetalle.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-xs shrink-0"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Abrir WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Subpanel de Reportar Pago Erróneo (cuando está pendiente) */}
                {mostrarErrorPago && citaDetalle.estado === "pendiente" && (
                  <div className="p-3 bg-amber-50 rounded-sm border border-amber-300 space-y-2 animate-in fade-in duration-200">
                    <p className="font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Notificar inconsistencia en datos del pago</span>
                    </p>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Se enviará un mensaje directo al WhatsApp del cliente ({citaDetalle.clienteTelefono}) indicando que no se pudo verificar el pago y solicitando los datos con el formato correspondiente o la captura del comprobante.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={getCitaPagoErroneoWhatsAppUrl(citaDetalle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Enviar WhatsApp de datos erróneos</span>
                      </a>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarErrorPago(false)}
                        className="text-slate-700 hover:text-slate-900 hover:bg-white border-slate-300 rounded-sm text-xs"
                      >
                        Cerrar aviso
                      </Button>
                    </div>
                  </div>
                )}

                {/* Motivo de cancelación si fue cancelada */}
                {citaDetalle.estado === "cancelada" && citaDetalle.motivoCancelacion && (
                  <div className="p-3 bg-rose-50 rounded-sm border border-rose-200 text-xs">
                    <p className="font-semibold text-rose-800">Motivo de cancelación registrado:</p>
                    <p className="text-rose-700 mt-0.5">{citaDetalle.motivoCancelacion}</p>
                  </div>
                )}

                {/* Botones de Acción de Estado Reversibles */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  {esAdmin && citaDetalle.estado === "pendiente" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => cambiarEstado(citaDetalle.id, "confirmada")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Confirmar Cita
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarErrorPago((prev) => !prev)}
                        className="text-amber-800 hover:text-amber-950 hover:bg-amber-50 border-amber-300 rounded-sm text-xs font-medium"
                        title="Enviar WhatsApp al cliente indicando que los datos bancarios fueron erróneos"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600" />
                        <span>Datos de pago erróneos</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCitaACancelar(citaDetalle);
                          setMotivoCancelacion("");
                          setModalCancelarOpen(true);
                        }}
                        className="text-rose-700 hover:text-rose-900 hover:bg-rose-50 border-rose-300 rounded-sm text-xs font-medium"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Cancelar Cita
                      </Button>
                    </>
                  )}

                  {citaDetalle.estado === "confirmada" && (
                    <>
                      {haPasadoTiempoCita(citaDetalle.fecha, citaDetalle.hora) ? (
                        <Button
                          size="sm"
                          onClick={() => cambiarEstado(citaDetalle.id, "completada")}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-semibold shadow-xs"
                        >
                          <CalendarCheck className="h-3.5 w-3.5 mr-1" />
                          Marcar Atendida
                        </Button>
                      ) : (
                        esAdmin && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cambiarEstado(citaDetalle.id, "pendiente")}
                              className="text-amber-800 hover:text-amber-950 hover:bg-amber-50 border-amber-300 rounded-sm text-xs font-medium"
                              title="Revertir si se confirmó por error"
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              Revertir a Pendiente
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCitaACancelar(citaDetalle);
                                setMotivoCancelacion("");
                                setModalCancelarOpen(true);
                              }}
                              className="text-rose-700 hover:text-rose-900 hover:bg-rose-50 border-rose-300 rounded-sm text-xs font-medium"
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Cancelar Cita
                            </Button>
                          </>
                        )
                      )}
                    </>
                  )}

                  {esAdmin && citaDetalle.estado === "completada" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(citaDetalle.id, "confirmada")}
                      className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300 rounded-sm text-xs font-medium"
                      title="Reabrir si se marcó por error"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Revertir a Confirmada
                    </Button>
                  )}

                  {esAdmin && citaDetalle.estado === "cancelada" && (
                    <Button
                      size="sm"
                      onClick={() => cambiarEstado(citaDetalle.id, "confirmada")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold shadow-xs"
                      title="Deshacer cancelación"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      Reactivar Cita
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para ingresar descripción corta al cancelar cita */}
      {modalCancelarOpen && citaACancelar && (
        <Dialog open={modalCancelarOpen} onOpenChange={(open) => { if (!open) setModalCancelarOpen(false); }}>
          <DialogContent className="max-w-md rounded-sm font-sans p-5 sm:p-6 border border-slate-200">
            <DialogHeader className="pb-3 border-b border-slate-200">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <span>Cancelar Cita</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1">
                Indica una descripción corta o motivo para registrar la cancelación del turno de <strong>{citaACancelar.clienteNombre}</strong> ({citaACancelar.servicioNombre}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-3">
              <div className="space-y-1.5">
                <label htmlFor="motivoCancelacionInput" className="text-xs font-semibold text-slate-700">
                  Motivo de cancelación <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="motivoCancelacionInput"
                  rows={3}
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Ej: Cliente solicitó cancelar, inconsistencia en comprobante de pago, no se presentó al salón..."
                  className="w-full text-xs rounded-sm border border-slate-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalCancelarOpen(false)}
                  disabled={guardandoCancelacion}
                  className="text-xs rounded-sm"
                >
                  Regresar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmarCancelarCita}
                  disabled={guardandoCancelacion}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-sm shadow-xs"
                >
                  {guardandoCancelacion ? "Cancelando..." : "Confirmar Cancelación"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
