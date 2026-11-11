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
  CalendarClock,
  Calendar,
  CalendarOff,
  AlertTriangle,
  X,
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
import { formatDate } from "@/lib/utils";
import { validatePassword } from "@/lib/validation";
import type { DBEmployee } from "@/lib/db";

export default function AdminEmpleadosPage() {
  const [empleados, setEmpleados] = useState<DBEmployee[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(null);

  // Form states perfil empleado
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargo, setCargo] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorForm, setErrorForm] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Modal de disponibilidad / reposo
  const [empleadoReposo, setEmpleadoReposo] = useState<DBEmployee | null>(null);
  const [tipoInop, setTipoInop] = useState<
    "activo" | "reposo" | "vacaciones" | "permiso" | "fechas_especificas" | "indefinido"
  >("activo");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [motivoReposo, setMotivoReposo] = useState("");
  const [fechasAusente, setFechasAusente] = useState<string[]>([]);
  const [nuevaFechaAusente, setNuevaFechaAusente] = useState("");
  const [guardandoReposo, setGuardandoReposo] = useState(false);

  // Modal eliminación
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState<{ id: string; nombre: string } | null>(null);
  const [eliminando, setEliminando] = useState(false);

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
    setUsername("");
    setPassword("");
    setErrorForm("");
    setModalAbierto(true);
  }

  function abrirEditar(emp: DBEmployee) {
    setModoEdicion(true);
    setIdSeleccionado(emp.id);
    setNombre(emp.nombre);
    setTelefono(emp.telefono || "");
    setCargo(emp.cargo);
    setEspecialidad(emp.especialidad);
    setUsername("");
    setPassword("");
    setErrorForm("");
    setModalAbierto(true);
  }

  function abrirGestionReposo(emp: DBEmployee) {
    setEmpleadoReposo(emp);
    setTipoInop(emp.tipoInoperatividad || (emp.activo === false ? "indefinido" : "activo"));
    setFechaInicio(emp.fechaInicioInoperatividad || "");
    setFechaFin(emp.fechaFinInoperatividad || "");
    setMotivoReposo(emp.motivoInoperativo || "");
    setFechasAusente(emp.fechasAusente || []);
    setNuevaFechaAusente("");
  }

  function agregarFechaAusente() {
    if (!nuevaFechaAusente) return;
    if (!fechasAusente.includes(nuevaFechaAusente)) {
      setFechasAusente([...fechasAusente, nuevaFechaAusente].sort());
    }
    setNuevaFechaAusente("");
  }

  function eliminarFechaAusente(fechaParaEliminar: string) {
    setFechasAusente(fechasAusente.filter((f) => f !== fechaParaEliminar));
  }

  async function guardarDisponibilidad() {
    if (!empleadoReposo) return;
    setGuardandoReposo(true);

    try {
      const estaActivo = tipoInop === "activo";
      const payload = {
        id: empleadoReposo.id,
        activo: estaActivo,
        tipoInoperatividad: tipoInop,
        fechaInicioInoperatividad: tipoInop === "reposo" ? fechaInicio : undefined,
        fechaFinInoperatividad: tipoInop === "reposo" ? fechaFin : undefined,
        fechasAusente: tipoInop === "fechas_especificas" ? fechasAusente : [],
        motivoInoperativo: tipoInop !== "activo" ? motivoReposo : "",
      };

      const res = await fetch("/api/empleados", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.employee) {
        setEmpleados((prev) =>
          prev.map((e) => (e.id === empleadoReposo.id ? data.employee : e))
        );
        setEmpleadoReposo(null);
      }
    } catch (err) {
      console.error("Error al guardar disponibilidad:", err);
    } finally {
      setGuardandoReposo(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorForm("");
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
          }),
        });
        const data = await res.json();
        if (data.success) {
          setEmpleados((prev) =>
            prev.map((e) => (e.id === idSeleccionado ? data.employee : e))
          );
          setModalAbierto(false);
        } else {
          setErrorForm(data.error || "Error al actualizar empleado");
        }
      } else {
        // Validación de contraseña segura
        const passCheck = validatePassword(password);
        if (!passCheck.isValid) {
          setErrorForm(
            passCheck.error ||
            "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo especial."
          );
          setGuardando(false);
          return;
        }

        const res = await fetch("/api/empleados", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            telefono,
            cargo,
            especialidad,
            username,
            password,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setEmpleados((prev) => [data.employee, ...prev]);
          setModalAbierto(false);
        } else {
          setErrorForm(data.error || "Error al registrar empleado");
        }
      }
    } catch (err) {
      console.error("Error al guardar empleado:", err);
      setErrorForm("Ocurrió un error de red al procesar la solicitud.");
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminarEmpleado() {
    if (!empleadoAEliminar) return;
    setEliminando(true);
    try {
      const res = await fetch(`/api/empleados?id=${empleadoAEliminar.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEmpleados((prev) => prev.filter((e) => e.id !== empleadoAEliminar.id));
        setEmpleadoAEliminar(null);
      }
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
    } finally {
      setEliminando(false);
    }
  }

  const operativosCount = empleados.filter((e) => e.activo !== false && (!e.tipoInoperatividad || e.tipoInoperatividad === "activo")).length;
  const enReposoCount = empleados.filter((e) => e.tipoInoperatividad === "reposo" || e.tipoInoperatividad === "vacaciones").length;
  const inoperativosCount = empleados.filter((e) => e.activo === false || e.tipoInoperatividad === "indefinido").length;

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Personal y Especialistas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de equipo, reposos médicos, vacaciones e inasistencias en el calendario.
          </p>
        </div>

        <Button
          onClick={abrirNuevo}
          size="sm"
          className="rounded-sm bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir empleado</span>
        </Button>
      </div>

      {/* Resumen de Estado Operativo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-sm border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs font-semibold text-emerald-950">Operativos en Agenda</p>
              <p className="text-[11px] text-emerald-700">Disponibles para citas de clientes</p>
            </div>
          </div>
          <span className="text-lg font-bold text-emerald-700">{operativosCount}</span>
        </div>

        <div className="p-3.5 rounded-sm border border-amber-200 bg-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarOff className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-xs font-semibold text-amber-950">En Reposo / Vacaciones</p>
              <p className="text-[11px] text-amber-700">Pausados temporalmente por fechas</p>
            </div>
          </div>
          <span className="text-lg font-bold text-amber-700">{enReposoCount}</span>
        </div>

        <div className="p-3.5 rounded-sm border border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-xs font-semibold text-slate-900">Total en Equipo</p>
              <p className="text-[11px] text-slate-500">Especialistas y dirección</p>
            </div>
          </div>
          <span className="text-lg font-bold text-slate-800">{empleados.length}</span>
        </div>
      </div>

      {/* Listado de Empleados */}
      <div className="rounded-sm border border-slate-200 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Equipo de Trabajo ({empleados.length})
          </h2>
          <span className="text-[11px] text-slate-500">
            Haz clic en <strong>Disponibilidad / Reposo</strong> para programar permisos o inasistencias
          </span>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Cargando equipo de colaboradores...
          </div>
        ) : empleados.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No hay empleados registrados.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {empleados.map((emp) => {
              const esAdminOgerente =
                emp.nombre.toLowerCase().includes("germán") ||
                emp.cargo.toLowerCase().includes("gerente") ||
                emp.serviciosIds.length === 0;

              return (
                <div
                  key={emp.id}
                  className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 transition-colors"
                >
                  {/* Foto y Datos del Especialista */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image
                        src={emp.avatarUrl || "/images/fundadora_xioilin_guzman.webp"}
                        alt={emp.nombre}
                        fill
                        unoptimized={true}
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm text-slate-900 truncate">{emp.nombre}</p>

                        {/* Status Badge de Disponibilidad / Reposo */}
                        {esAdminOgerente ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            Dirección General
                          </span>
                        ) : emp.tipoInoperatividad === "reposo" || emp.tipoInoperatividad === "vacaciones" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
                            <CalendarOff className="h-2.5 w-2.5" />
                            <span>
                              En Reposo {emp.fechaFinInoperatividad ? `(hasta ${emp.fechaFinInoperatividad})` : ""}
                            </span>
                          </span>
                        ) : emp.tipoInoperatividad === "fechas_especificas" && emp.fechasAusente && emp.fechasAusente.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>Ausente en {emp.fechasAusente.length} fecha(s)</span>
                          </span>
                        ) : emp.activo === false ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                            <UserX className="h-2.5 w-2.5" />
                            <span>Inoperativo</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Operativo (Disponible)</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <Briefcase className="h-3 w-3 text-slate-400" />
                        <span>{emp.cargo}</span>
                        {emp.especialidad && (
                          <span className="text-slate-400 text-[11px]">&bull; {emp.especialidad}</span>
                        )}
                      </p>

                      {emp.motivoInoperativo && (emp.tipoInoperatividad === "reposo" || emp.tipoInoperatividad === "vacaciones" || emp.activo === false) && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/60 px-2 py-0.5 rounded-sm border border-amber-200 inline-block">
                          Motivo: <strong>{emp.motivoInoperativo}</strong>
                          {emp.fechaInicioInoperatividad && emp.fechaFinInoperatividad && (
                            <span className="ml-1 text-amber-900">
                              ({emp.fechaInicioInoperatividad} al {emp.fechaFinInoperatividad})
                            </span>
                          )}
                        </p>
                      )}

                      {emp.fechasAusente && emp.fechasAusente.length > 0 && emp.tipoInoperatividad === "fechas_especificas" && (
                        <p className="text-[11px] text-blue-800 bg-blue-50/60 px-2 py-0.5 rounded-sm border border-blue-200 inline-block">
                          Fechas ausente: <strong>{emp.fechasAusente.join(", ")}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Acciones Rediseñadas */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {!esAdminOgerente && (
                      <button
                        type="button"
                        onClick={() => abrirGestionReposo(emp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
                        title="Gestionar reposo médico, vacaciones o fechas de inasistencia"
                      >
                        <CalendarClock className="h-3.5 w-3.5 text-slate-600" />
                        <span>Disponibilidad / Reposo</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => abrirEditar(emp)}
                      className="p-1.5 rounded-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      title="Editar información personal"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEmpleadoAEliminar({ id: emp.id, nombre: emp.nombre })}
                      className="p-1.5 rounded-sm text-rose-600 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Eliminar empleado"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal 1: Añadir / Editar Perfil de Empleado (SIN ESTADO DE AGENDA como se solicitó) */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md rounded-sm max-h-[85vh] overflow-y-auto p-5 sm:p-6 border border-slate-200 font-sans">
          <DialogHeader className="pb-2 border-b border-slate-200">
            <DialogTitle className="text-base font-bold text-slate-900">
              {modoEdicion ? "Editar información de empleado" : "Registrar nuevo empleado"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 text-xs">
            {errorForm && (
              <div className="p-2.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorForm}
              </div>
            )}

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
                className="rounded-sm text-xs"
              />
            </div>

            {/* Credenciales de acceso para el empleado (solo en creación) */}
            {!modoEdicion && (
              <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-3">
                <p className="text-[11px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Credenciales de acceso al sistema</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="empUser" className="text-xs font-semibold text-slate-700">
                      Nombre de usuario *
                    </Label>
                    <Input
                      id="empUser"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ej. carolina"
                      className="rounded-sm text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="empPass" className="text-xs font-semibold text-slate-700">
                      Contraseña inicial *
                    </Label>
                    <Input
                      id="empPass"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ej. Carolina28$"
                      className="rounded-sm text-xs bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-700">Requisitos de la contraseña:</p>
                  <p className="flex items-center gap-1.5">
                    <span className={password.length >= 8 ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {password.length >= 8 ? "✓" : "•"} Mínimo 8 caracteres
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className={/[A-Z]/.test(password) ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {/[A-Z]/.test(password) ? "✓" : "•"} Al menos una letra mayúscula (A-Z)
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className={/[a-z]/.test(password) ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {/[a-z]/.test(password) ? "✓" : "•"} Al menos una letra minúscula (a-z)
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className={/\d/.test(password) ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {/\d/.test(password) ? "✓" : "•"} Al menos un número (0-9)
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className={/[^a-zA-Z0-9]/.test(password) ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {/[^a-zA-Z0-9]/.test(password) ? "✓" : "•"} Al menos un símbolo o carácter especial (!@#$%^&*...)
                    </span>
                  </p>
                </div>
              </div>
            )}

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
                  className="rounded-sm text-xs"
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
                  className="rounded-sm text-xs"
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
                className="rounded-sm text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalAbierto(false)}
                className="rounded-sm text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={guardando}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-sm text-xs shadow-xs"
              >
                {guardando ? "Guardando..." : modoEdicion ? "Guardar cambios" : "Registrar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Gestión Dedicada de Disponibilidad, Reposo e Inasistencias en Calendario */}
      {empleadoReposo && (
        <Dialog open={!!empleadoReposo} onOpenChange={(open) => !open && setEmpleadoReposo(null)}>
          <DialogContent className="max-w-lg rounded-sm max-h-[85vh] overflow-y-auto p-5 sm:p-6 border border-slate-200 font-sans">
            <DialogHeader className="pb-3 border-b border-slate-200">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-slate-700" />
                <span>Disponibilidad y Reposo: {empleadoReposo.nombre}</span>
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-1">
                Especifica si el especialista se encuentra activo, en reposo médico por un rango de tiempo, o si no asistirá en fechas específicas del calendario.
              </p>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Opción 1: Operativo */}
              <label className={`p-3 rounded-sm border flex items-start gap-3 cursor-pointer transition-all ${
                tipoInop === "activo"
                  ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500"
                  : "border-slate-200 hover:bg-slate-50"
              }`}>
                <input
                  type="radio"
                  name="tipoDisponibilidad"
                  checked={tipoInop === "activo"}
                  onChange={() => setTipoInop("activo")}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <p className="font-bold text-slate-900">Operativo (Disponible para todas las citas)</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    El especialista atiende con normalidad y los clientes pueden agendarlo en la página.
                  </p>
                </div>
              </label>

              {/* Opción 2: Reposo médico / vacaciones / permiso por rango de fechas */}
              <div className={`p-3 rounded-sm border space-y-3 transition-all ${
                tipoInop === "reposo"
                  ? "border-amber-500 bg-amber-50/40 ring-1 ring-amber-500"
                  : "border-slate-200"
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoDisponibilidad"
                    checked={tipoInop === "reposo"}
                    onChange={() => setTipoInop("reposo")}
                    className="mt-0.5 accent-amber-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Poner en reposo médico, vacaciones o permiso temporal</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Define desde qué fecha hasta qué fecha no asistirá. La agenda online bloqueará su selección durante ese lapso.
                    </p>
                  </div>
                </label>

                {tipoInop === "reposo" && (
                  <div className="pl-6 pt-2 space-y-3 border-t border-amber-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="repInicio" className="text-[11px] font-semibold text-slate-700">
                          Fecha inicio de reposo *
                        </Label>
                        <Input
                          id="repInicio"
                          type="date"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          className="rounded-sm text-xs bg-white h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="repFin" className="text-[11px] font-semibold text-slate-700">
                          Fecha fin de reposo *
                        </Label>
                        <Input
                          id="repFin"
                          type="date"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          className="rounded-sm text-xs bg-white h-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="repMotivo" className="text-[11px] font-semibold text-slate-700">
                        Motivo del reposo / permiso *
                      </Label>
                      <Input
                        id="repMotivo"
                        value={motivoReposo}
                        onChange={(e) => setMotivoReposo(e.target.value)}
                        placeholder="Ej. Reposo médico por 5 días, Vacaciones anuales, Permiso personal"
                        className="rounded-sm text-xs bg-white h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Opción 3: Fechas específicas de inasistencia en el calendario */}
              <div className={`p-3 rounded-sm border space-y-3 transition-all ${
                tipoInop === "fechas_especificas"
                  ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500"
                  : "border-slate-200"
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoDisponibilidad"
                    checked={tipoInop === "fechas_especificas"}
                    onChange={() => setTipoInop("fechas_especificas")}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Inasistencia en fechas específicas del calendario</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Para días puntuales en que el especialista no trabajará (ej. citas médicas, trámites, descansos acordados).
                    </p>
                  </div>
                </label>

                {tipoInop === "fechas_especificas" && (
                  <div className="pl-6 pt-2 space-y-3 border-t border-blue-200">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700">
                        Seleccionar fecha de inasistencia:
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={nuevaFechaAusente}
                          onChange={(e) => setNuevaFechaAusente(e.target.value)}
                          className="rounded-sm text-xs bg-white h-8 flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={agregarFechaAusente}
                          disabled={!nuevaFechaAusente}
                          className="rounded-sm text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
                        >
                          Añadir fecha
                        </Button>
                      </div>
                    </div>

                    {fechasAusente.length > 0 ? (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold text-slate-700">
                          Días en que no asistirá ({fechasAusente.length}):
                        </p>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-white rounded border border-slate-200">
                          {fechasAusente.map((f) => (
                            <span
                              key={f}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold"
                            >
                              <span>{f}</span>
                              <button
                                type="button"
                                onClick={() => eliminarFechaAusente(f)}
                                className="text-blue-500 hover:text-rose-600 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        No has añadido ninguna fecha aún.
                      </p>
                    )}

                    <div className="space-y-1">
                      <Label htmlFor="motivoPuntual" className="text-[11px] font-semibold text-slate-700">
                        Motivo de la inasistencia (opcional):
                      </Label>
                      <Input
                        id="motivoPuntual"
                        value={motivoReposo}
                        onChange={(e) => setMotivoReposo(e.target.value)}
                        placeholder="Ej. Cita odontológica, trámite personal"
                        className="rounded-sm text-xs bg-white h-8"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmpleadoReposo(null)}
                className="rounded-sm text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={guardarDisponibilidad}
                disabled={guardandoReposo}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-sm text-xs shadow-xs"
              >
                {guardandoReposo ? "Guardando..." : "Guardar disponibilidad"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal 3: Confirmación para Eliminar Empleado */}
      <Dialog open={!!empleadoAEliminar} onOpenChange={(open) => !open && setEmpleadoAEliminar(null)}>
        <DialogContent className="max-w-sm rounded-sm p-5 border border-slate-200 font-sans">
          <DialogHeader className="pb-2 border-b border-slate-200">
            <DialogTitle className="text-sm font-bold text-slate-900">
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 text-xs text-slate-600">
            ¿Estás seguro de que deseas eliminar a <strong className="text-slate-900">{empleadoAEliminar?.nombre}</strong> del equipo de especialistas? Esta acción no se puede deshacer.
          </div>
          <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmpleadoAEliminar(null)}
              disabled={eliminando}
              className="rounded-sm text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmarEliminarEmpleado}
              disabled={eliminando}
              className="rounded-sm text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {eliminando ? "Eliminando..." : "Eliminar empleado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
