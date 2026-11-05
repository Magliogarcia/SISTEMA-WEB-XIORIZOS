"use client";

import { useState, useEffect } from "react";
import { Check, X, CalendarCheck, Clock, User, Phone, RefreshCw, Scissors } from "lucide-react";
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

  async function cambiarEstado(id: string, nuevoEstado: "confirmada" | "completada" | "cancelada") {
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

      {/* Contenedor de Tabla con esquinas sutiles (rounded-md) y fondo blanco limpio */}
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Cliente & Contacto</th>
                  <th className="py-3 px-4">Servicio</th>
                  <th className="py-3 px-4">Especialista</th>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Notas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 text-sm">{cita.clienteNombre}</p>
                      <p className="flex items-center gap-1 text-slate-500 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{cita.clienteTelefono}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{cita.servicioNombre}</p>
                      <p className="text-slate-500">{formatCurrency(cita.servicioPrecio)}</p>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {cita.profesionalNombre}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-700">{formatDate(new Date(cita.fecha))}</p>
                      <p className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{cita.hora}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px] text-slate-500 truncate">
                      {cita.notas || "Sin notas"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                          cita.estado === "confirmada"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : cita.estado === "completada"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : cita.estado === "cancelada"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {cita.estado === "pendiente" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(cita.id, "confirmada")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <Check className="h-3 w-3" />
                            <span>Confirmar</span>
                          </button>
                        )}
                        {cita.estado === "confirmada" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(cita.id, "completada")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                          >
                            <CalendarCheck className="h-3 w-3" />
                            <span>Completada</span>
                          </button>
                        )}
                        {cita.estado !== "cancelada" && (
                          <button
                            type="button"
                            onClick={() => cambiarEstado(cita.id, "cancelada")}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                            <span>Cancelar</span>
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
