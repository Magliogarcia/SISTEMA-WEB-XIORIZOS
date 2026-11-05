"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { DBEmployee } from "@/lib/db";

export default function AdminEmpleadosPage() {
  const [empleados, setEmpleados] = useState<DBEmployee[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(null);

  // Form states
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargo, setCargo] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [activo, setActivo] = useState(true);
  const [motivoInoperativo, setMotivoInoperativo] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  async function cargarEmpleados() {
    try {
      setCargando(true);
      const res = await fetch("/api/empleados");
      const data = await res.json();
      if (data.success) {
        setEmpleados(data.employees || []);
      }
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    } finally {
      setCargando(false);
    }
  }

  function abrirNuevo() {
    setModoEdicion(false);
    setIdSeleccionado(null);
    setNombre("");
    setTelefono("");
    setCargo("");
    setEspecialidad("");
    setActivo(true);
    setMotivoInoperativo("");
    setModalAbierto(true);
  }

  function abrirEditar(emp: DBEmployee) {
    setModoEdicion(true);
    setIdSeleccionado(emp.id);
    setNombre(emp.nombre);
    setTelefono(emp.telefono || "");
    setCargo(emp.cargo);
    setEspecialidad(emp.especialidad);
    setActivo(emp.activo !== false);
    setMotivoInoperativo(emp.motivoInoperativo || "");
    setModalAbierto(true);
  }

  async function toggleEstado(emp: DBEmployee) {
    const nuevoEstado = !emp.activo;
    try {
      const res = await fetch("/api/empleados", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: emp.id,
          activo: nuevoEstado,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmpleados((prev) =>
          prev.map((e) => (e.id === emp.id ? { ...e, activo: nuevoEstado } : e))
        );
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);

    try {
      if (modoEdicion && idSeleccionado) {
        const res = await fetch("/api/empleados", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: idSeleccionado,
            nombre,
            telefono,
            cargo,
            especialidad,
            activo,
            motivoInoperativo: !activo ? motivoInoperativo : "",
          }),
        });
        const data = await res.json();
        if (data.success) {
          setEmpleados((prev) =>
            prev.map((e) => (e.id === idSeleccionado ? data.employee : e))
          );
          setModalAbierto(false);
        }
      } else {
        const res = await fetch("/api/empleados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            telefono,
            cargo,
            especialidad,
            activo,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setEmpleados((prev) => [data.employee, ...prev]);
          setModalAbierto(false);
        }
      }
    } catch (err) {
      console.error("Error al guardar empleado:", err);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarEmpleado(id: string, nombreEmp: string) {
    if (!confirm(`¿Estás seguro de eliminar a ${nombreEmp} del equipo?`)) return;

    try {
      const res = await fetch(`/api/empleados?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEmpleados((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
    }
  }

  const operativosCount = empleados.filter((e) => e.activo !== false).length;
  const inoperativosCount = empleados.filter((e) => e.activo === false).length;

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Personal y Especialistas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestiona al equipo del salón y activa o desactiva su disponibilidad para las citas de los clientes.
          </p>
        </div>

        <Button
          onClick={abrirNuevo}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md flex items-center gap-1.5 text-xs shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Empleado</span>
        </Button>
      </div>

      {/* Métricas Rápidas con esquinas sutiles (rounded-md) y tipografía firme */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total de Empleados</p>
            <p className="text-2xl font-black text-slate-900">{empleados.length}</p>
          </div>
          <div className="w-11 h-11 rounded-md bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-300">
            <Users className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Operativos en Agenda</p>
            <p className="text-2xl font-black text-emerald-800">{operativosCount}</p>
          </div>
          <div className="w-11 h-11 rounded-md bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-300">
            <UserCheck className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inoperativos / Reposo</p>
            <p className="text-2xl font-black text-amber-800">{inoperativosCount}</p>
          </div>
          <div className="w-11 h-11 rounded-md bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-300">
            <UserX className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Directorio de Empleados */}
      <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Directorio del Personal</h2>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-xs text-slate-500">Cargando equipo...</div>
        ) : empleados.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No hay empleados registrados. Haz clic en &quot;Añadir Empleado&quot; para registrar uno.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {empleados.map((emp) => (
              <div
                key={emp.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/80 transition-colors"
              >
                {/* Foto y Datos del Empleado */}
                <div className="flex items-center gap-3.5">
                  <div className="relative h-11 w-11 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {emp.avatarUrl ? (
                      <Image src={emp.avatarUrl} alt={emp.nombre} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-sm">
                        {emp.nombre.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{emp.nombre}</h3>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${
                          emp.activo !== false
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        {emp.activo !== false ? "Operativo en Agenda" : "Inoperativo"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                      <span className="inline-flex items-center gap-1.5 text-slate-800 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        <Briefcase className="h-3 w-3 text-slate-600" />
                        <span>{emp.cargo}</span>
                      </span>
                      {emp.especialidad && (
                        <span className="inline-flex items-center gap-1.5 text-amber-900 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <Sparkles className="h-3 w-3 text-amber-600" />
                          <span>{emp.especialidad}</span>
                        </span>
                      )}
                      {emp.telefono && (
                        <span className="inline-flex items-center gap-1.5 text-slate-800 font-mono font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          <Phone className="h-3 w-3 text-slate-600" />
                          <span>{emp.telefono}</span>
                        </span>
                      )}
                    </div>
                    {emp.activo === false && emp.motivoInoperativo && (
                      <p className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-300 mt-1.5 w-fit">
                        Motivo: {emp.motivoInoperativo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones y Toggle */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => toggleEstado(emp)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                      emp.activo !== false
                        ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                        : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                    }`}
                    title={
                      emp.activo !== false
                        ? "Hacer clic para marcar como Inoperativo (ocultar de la agenda del cliente)"
                        : "Hacer clic para activar y habilitar en la agenda del cliente"
                    }
                  >
                    {emp.activo !== false ? (
                      <>
                        <XCircle className="h-3 w-3 text-amber-600" />
                        <span>Desactivar</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Activar en Agenda</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => abrirEditar(emp)}
                    className="p-1.5 rounded text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                    title="Editar información"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminarEmpleado(emp.id, emp.nombre)}
                    className="p-1.5 rounded text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                    title="Eliminar empleado"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Añadir / Editar Empleado (rounded-md y max-h-[85vh]) */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md rounded-md max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b border-slate-200">
            <DialogTitle className="text-base font-bold text-slate-900">
              {modoEdicion ? "Editar empleado" : "Registrar nuevo empleado"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 text-xs">
            <div className="space-y-1">
              <Label htmlFor="empNombre" className="text-xs font-semibold text-slate-700">
                Nombre y Apellido *
              </Label>
              <Input
                id="empNombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Carolina Mendoza"
                className="rounded-md text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="empCargo" className="text-xs font-semibold text-slate-700">
                  Cargo *
                </Label>
                <Input
                  id="empCargo"
                  required
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ej. Estilista de Corte"
                  className="rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="empTelefono" className="text-xs font-semibold text-slate-700">
                  Teléfono Celular
                </Label>
                <Input
                  id="empTelefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="0412 1234567"
                  className="rounded-md text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="empEspecialidad" className="text-xs font-semibold text-slate-700">
                Especialidad Técnica
              </Label>
              <Input
                id="empEspecialidad"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                placeholder="Ej. Corte en seco, Balayage, Definición"
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <Label className="text-xs font-semibold text-slate-700">Estado en Agenda</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="estadoOperativo"
                    checked={activo === true}
                    onChange={() => setActivo(true)}
                    className="accent-slate-900"
                  />
                  <span>Operativo (Disponible)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="estadoOperativo"
                    checked={activo === false}
                    onChange={() => setActivo(false)}
                    className="accent-slate-900"
                  />
                  <span>Inoperativo (Reposo / Ausente)</span>
                </label>
              </div>

              {!activo && (
                <div className="pt-2">
                  <Label htmlFor="motivo" className="text-xs font-semibold text-amber-800">
                    Motivo de inoperatividad (opcional)
                  </Label>
                  <Input
                    id="motivo"
                    value={motivoInoperativo}
                    onChange={(e) => setMotivoInoperativo(e.target.value)}
                    placeholder="Ej. Reposo médico, vacaciones"
                    className="mt-1 rounded-md text-xs"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)} className="rounded-md text-xs">
                Cancelar
              </Button>
              <Button type="submit" disabled={guardando} className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md text-xs shadow-sm">
                {guardando ? "Guardando..." : modoEdicion ? "Guardar cambios" : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
