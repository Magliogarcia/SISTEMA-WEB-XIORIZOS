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
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Equipo y Especialistas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona al personal del salón y activa o desactiva su disponibilidad para las citas de los clientes.
          </p>
        </div>

        <Button
          onClick={abrirNuevo}
          className="bg-primary hover:bg-secondary text-white font-semibold rounded-lg flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Empleado</span>
        </Button>
      </div>

      {/* Métricas Rápidas con esquinas menos redondeadas y alto contraste */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-lg border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total de Empleados</p>
              <p className="text-2xl font-bold text-primary mt-1">{empleados.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Operativos en Agenda</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{operativosCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-border shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Inoperativos / Reposo</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{inoperativosCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <UserX className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Empleados */}
      <Card className="rounded-lg border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-lg font-bold text-primary">Directorio del Personal</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Cargando equipo...</div>
          ) : empleados.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay empleados registrados. Haz clic en &quot;Añadir Empleado&quot; para crear uno.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {empleados.map((emp) => (
                <div
                  key={emp.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors"
                >
                  {/* Foto y Datos del Empleado */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-secondary/10 border border-border shrink-0">
                      {emp.avatarUrl ? (
                        <Image src={emp.avatarUrl} alt={emp.nombre} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                          {emp.nombre.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-foreground">{emp.nombre}</h3>
                        <Badge
                          variant="outline"
                          className={
                            emp.activo !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold"
                              : "bg-rose-50 text-rose-700 border-rose-200 text-xs font-semibold"
                          }
                        >
                          {emp.activo !== false ? "Operativo" : "Inoperativo"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Briefcase className="h-3.5 w-3.5 text-secondary" />
                          <span>{emp.cargo}</span>
                        </span>
                        {emp.especialidad && (
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span>{emp.especialidad}</span>
                          </span>
                        )}
                        {emp.telefono && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-blue-500" />
                            <span>{emp.telefono}</span>
                          </span>
                        )}
                      </div>
                      {emp.activo === false && emp.motivoInoperativo && (
                        <p className="text-xs text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded mt-1.5 w-fit">
                          Motivo: {emp.motivoInoperativo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Acciones y Switch de Disponibilidad */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Botón rápido de Activar / Desactivar */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEstado(emp)}
                      className={`text-xs font-semibold rounded-lg ${
                        emp.activo !== false
                          ? "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                          : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                      }`}
                      title={
                        emp.activo !== false
                          ? "Hacer clic para marcar como Inoperativo (por enfermedad o reposo)"
                          : "Hacer clic para activar y poner disponible en la agenda del cliente"
                      }
                    >
                      {emp.activo !== false ? (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-amber-600 mr-1" />
                          <span>Desactivar</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                          <span>Activar</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-secondary/15 rounded-lg"
                      onClick={() => abrirEditar(emp)}
                      title="Editar información del empleado"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={() => eliminarEmpleado(emp.id, emp.nombre)}
                      title="Eliminar empleado"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Añadir / Editar Empleado (Compacto y amigable a pantallas) */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md rounded-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-primary">
              {modoEdicion ? "Editar información del empleado" : "Registrar nuevo empleado"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="empNombre" className="text-xs font-semibold">
                Nombre y Apellido *
              </Label>
              <Input
                id="empNombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Carolina Mendoza"
                className="rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="empCargo" className="text-xs font-semibold">
                  Cargo *
                </Label>
                <Input
                  id="empCargo"
                  required
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ej. Estilista Senior"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="empTelefono" className="text-xs font-semibold">
                  Teléfono Celular
                </Label>
                <Input
                  id="empTelefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="0412 1234567"
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="empEspecialidad" className="text-xs font-semibold">
                Especialidad Técnica
              </Label>
              <Input
                id="empEspecialidad"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                placeholder="Ej. Corte en seco, Colorimetría, Terapia capilar"
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs font-semibold">Estado de Operatividad en Agenda</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="estadoOperativo"
                    checked={activo === true}
                    onChange={() => setActivo(true)}
                    className="accent-primary"
                  />
                  <span>Operativo (Disponible para clientes)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="estadoOperativo"
                    checked={activo === false}
                    onChange={() => setActivo(false)}
                    className="accent-primary"
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
                    placeholder="Ej. Reposo médico, vacaciones, permiso especial"
                    className="mt-1 rounded-lg text-xs"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)} className="rounded-lg">
                Cancelar
              </Button>
              <Button type="submit" disabled={guardando} className="bg-primary hover:bg-secondary text-white font-semibold rounded-lg">
                {guardando ? "Guardando..." : modoEdicion ? "Guardar cambios" : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
