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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { DBAppointment } from "@/lib/db";

export default function AdminCitasPage() {
  const [citas, setCitas] = useState<DBAppointment[]>([]);
  const [cargando, setCargando] = useState(true);

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
        // Notificar en vivo a la barra de notificaciones para que se actualice inmediatamente
        window.dispatchEvent(new CustomEvent("xiorizos-admin-update"));
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
                            <p className="text-[11px] text-slate-600 flex items-center gap-1">
                              <Landmark className="h-3 w-3 text-blue-600 shrink-0" />
                              <span>
                                {cita.pagoMovil.banco} &bull; Ref: <strong className="font-mono text-slate-900 bg-slate-100 px-1 rounded">{cita.pagoMovil.referencia}</strong>
                              </span>
                            </p>
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
                        {cita.estado === "pendiente" && (
                          <>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "confirmada")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                              title="Confirmar cita"
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
                            onClick={() => cambiarEstado(cita.id, "confirmada")}
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
    </div>
  );
}
