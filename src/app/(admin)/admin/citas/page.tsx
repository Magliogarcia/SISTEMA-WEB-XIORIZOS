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
  User,
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
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("xiorizos-admin-update"));
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agenda de Citas
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            Control de reservas de clientes, especialistas asignados y confirmación de turnos.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={cargarCitas}
          className="rounded-md border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Contenedor de Tabla con diseño ordenado y sin texto encimado */}
      <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Citas registradas ({citas.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          {cargando ? (
            <div className="py-12 text-center text-sm font-bold text-slate-500">Cargando citas...</div>
          ) : citas.length === 0 ? (
            <div className="py-12 text-center text-sm font-bold text-slate-500">
              No hay citas registradas en el sistema aún.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3.5 px-4 min-w-[240px] whitespace-nowrap">Cliente & Contacto</th>
                  <th className="py-3.5 px-4 min-w-[220px] whitespace-nowrap">Servicio & Tarifa</th>
                  <th className="py-3.5 px-4 min-w-[170px] whitespace-nowrap">Especialista</th>
                  <th className="py-3.5 px-4 min-w-[200px] whitespace-nowrap">Fecha & Hora</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Notas</th>
                  <th className="py-3.5 px-4 min-w-[150px] whitespace-nowrap">Estado</th>
                  <th className="py-3.5 px-4 min-w-[200px] text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-slate-50/90 transition-colors">
                    {/* Cliente y Teléfono en línea con badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm tracking-tight">
                          {cita.clienteNombre}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                          <span>{cita.clienteTelefono}</span>
                        </span>
                      </div>
                    </td>

                    {/* Servicio y Tarifa destacados */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {cita.servicioNombre}
                        </span>
                        <span className="font-black text-xs text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                          {formatCurrency(cita.servicioPrecio)}
                        </span>
                      </div>
                    </td>

                    {/* Especialista con icono y chip */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        <span>{cita.profesionalNombre}</span>
                      </span>
                    </td>

                    {/* Fecha y Hora en una sola línea armónica */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs bg-slate-900 text-white px-2 py-0.5 rounded inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{cita.hora}</span>
                        </span>
                        <span className="font-bold text-slate-700 text-xs">
                          {formatDate(new Date(cita.fecha))}
                        </span>
                      </div>
                    </td>

                    {/* Notas */}
                    <td className="py-4 px-4 max-w-[160px] text-slate-600 font-medium truncate" title={cita.notas}>
                      {cita.notas || <span className="text-slate-400 italic">Sin notas</span>}
                    </td>

                    {/* Estado con Selector Editable */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={cita.estado}
                        onChange={(e) =>
                          cambiarEstado(
                            cita.id,
                            e.target.value as "pendiente" | "confirmada" | "completada" | "cancelada"
                          )
                        }
                        className={`text-xs font-black px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-xs ${
                          cita.estado === "confirmada"
                            ? "bg-emerald-50 text-emerald-850 border-emerald-300"
                            : cita.estado === "completada"
                            ? "bg-blue-50 text-blue-850 border-blue-300"
                            : cita.estado === "cancelada"
                            ? "bg-rose-50 text-rose-850 border-rose-300"
                            : "bg-amber-50 text-amber-850 border-amber-300"
                        }`}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>

                    {/* Acciones reversibles */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {cita.estado === "pendiente" && (
                          <>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "confirmada")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
                              title="Confirmar cita"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Confirmar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "cancelada")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                              title="Cancelar cita"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Cancelar</span>
                            </button>
                          </>
                        )}

                        {cita.estado === "confirmada" && (
                          <>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "completada")}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors cursor-pointer"
                              title="Marcar como atendida/completada"
                            >
                              <CalendarCheck className="h-3.5 w-3.5" />
                              <span>Completada</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "pendiente")}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                              title="Revertir a Pendiente"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>Pendiente</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstado(cita.id, "cancelada")}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                              title="Cancelar cita"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Cancelar</span>
                            </button>
                          </>
                        )}

                        {cita.estado === "cancelada" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(cita.id, "confirmada")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer shadow-xs"
                            title="Deshacer cancelación y reactivar la cita"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reactivar cita</span>
                          </button>
                        )}

                        {cita.estado === "completada" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(cita.id, "confirmada")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
                            title="Reabrir cita"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Reabrir</span>
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
    </div>
  );
}
