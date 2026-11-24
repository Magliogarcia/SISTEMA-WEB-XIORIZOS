"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Scissors,
  Check,
  X,
  AlertTriangle,
  UploadCloud,
  UserCheck,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import type { DBService, DBEmployee } from "@/lib/db";

const CATEGORIAS_PRESET = [
  "Corte y Definición",
  "Definición",
  "Color",
  "Tratamiento",
  "Terapia",
  "Infantil",
  "Caballeros",
  "Uñas",
  "General",
];

const IMAGENES_DISPONIBLES = [
  { label: "Full Curl", url: "/images/Full_curl.webp" },
  { label: "Definición Curl", url: "/images/definicion_curl.webp" },
  { label: "Curly Color", url: "/images/Curly_color.webp" },
  { label: "Definición Flash", url: "/images/definicion_flash.webp" },
  { label: "Curly Men", url: "/images/curly_men.webp" },
  { label: "Curly Boy", url: "/images/curly_boy.webp" },
  { label: "Tratamiento Refresh", url: "/images/tratamiento_refresh.webp" },
  { label: "Renacer Capilar", url: "/images/tratamiento_renacer_capilar.webp" },
  { label: "Renacer Color", url: "/images/tratamiento_renacer_color.webp" },
  { label: "Crecimiento Capilar", url: "/images/crecimiento_capilar.webp" },
  { label: "Curly Girls", url: "/images/curly_girls.webp" },
  { label: "Servicio de Uñas", url: "/images/servicio_de_unas.webp" },
];

export default function AdminServiciosPage() {
  const [servicios, setServicios] = useState<DBService[]>([]);
  const [empleados, setEmpleados] = useState<DBEmployee[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("TODAS");
  const [estadoFiltro, setEstadoFiltro] = useState<"TODOS" | "ACTIVOS" | "INACTIVOS">("TODOS");

  // Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState<DBService | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  // Estados del Formulario
  const [idSeleccionado, setIdSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracionMin, setDuracionMin] = useState("60");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Corte y Definición");
  const [otraCategoriaTexto, setOtraCategoriaTexto] = useState("");
  const [imagenUrl, setImagenUrl] = useState(IMAGENES_DISPONIBLES[0].url);
  const [activo, setActivo] = useState(true);
  const [items, setItems] = useState<string[]>([]);
  const [nuevoItemTexto, setNuevoItemTexto] = useState("");
  const [especialistasSeleccionados, setEspecialistasSeleccionados] = useState<string[]>([]);

  // Subida de imagen
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [uploadMensaje, setUploadMensaje] = useState<string | null>(null);

  async function cargarServicios() {
    setCargando(true);
    try {
      const [resServ, resEmp] = await Promise.all([
        fetch("/api/servicios?all=true").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/empleados").then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (resServ.success && resServ.servicios) {
        setServicios(resServ.servicios);
      }
      if (resEmp.success && resEmp.employees) {
        setEmpleados(resEmp.employees);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarServicios();
  }, []);

  function abrirModalCrear() {
    setModoEdicion(false);
    setIdSeleccionado("");
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setDuracionMin("60");
    setCategoriaSeleccionada("Corte y Definición");
    setOtraCategoriaTexto("");
    setImagenUrl(IMAGENES_DISPONIBLES[0].url);
    setUploadMensaje(null);
    setActivo(true);
    // Por defecto seleccionar el primer empleado activo o todos los activos
    const empActivos = empleados.filter((e) => e.activo).map((e) => e.id);
    setEspecialistasSeleccionados(empActivos.length > 0 ? [empActivos[0]] : []);
    setItems([
      "Diagnóstico capilar personalizado",
      "Tratamiento de cierre técnico",
      "Definición y secado experto",
    ]);
    setErrorForm(null);
    setModalAbierto(true);
  }

  function abrirModalEditar(s: DBService) {
    setModoEdicion(true);
    setIdSeleccionado(s.id);
    setNombre(s.nombre);
    setDescripcion(s.descripcion);
    setPrecio(String(s.precio));
    setDuracionMin(String(s.duracionMin));

    if (CATEGORIAS_PRESET.includes(s.categoria)) {
      setCategoriaSeleccionada(s.categoria);
      setOtraCategoriaTexto("");
    } else {
      setCategoriaSeleccionada("OTRA");
      setOtraCategoriaTexto(s.categoria);
    }

    setImagenUrl(s.imagenUrl || IMAGENES_DISPONIBLES[0].url);
    setUploadMensaje(null);
    setActivo(s.activo);
    setItems(s.items ? [...s.items] : []);

    // Cargar especialistas asignados a este servicio
    if (s.especialistasIds && s.especialistasIds.length > 0) {
      setEspecialistasSeleccionados(s.especialistasIds);
    } else {
      // Buscar en empleados locales
      const asignados = empleados.filter((e) => e.serviciosIds && e.serviciosIds.includes(s.id)).map((e) => e.id);
      setEspecialistasSeleccionados(asignados);
    }

    setErrorForm(null);
    setModalAbierto(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoFoto(true);
    setUploadMensaje(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImagenUrl(data.url);
        setUploadMensaje("Imagen cargada y optimizada exitosamente.");
      } else {
        setUploadMensaje(data.error || "No se pudo subir la imagen.");
      }
    } catch (err) {
      console.error("Error al subir foto:", err);
      setUploadMensaje("Error de conexión al subir la imagen.");
    } finally {
      setSubiendoFoto(false);
    }
  }

  function agregarItem() {
    if (!nuevoItemTexto.trim()) return;
    setItems((prev) => [...prev, nuevoItemTexto.trim()]);
    setNuevoItemTexto("");
  }

  function eliminarItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGuardarServicio(e: React.FormEvent) {
    e.preventDefault();
    setErrorForm(null);

    if (!nombre.trim()) {
      setErrorForm("El nombre del servicio es obligatorio.");
      return;
    }

    const numPrecio = parseFloat(precio);
    if (isNaN(numPrecio) || numPrecio < 0) {
      setErrorForm("Por favor ingresa un precio válido igual o mayor a 0.");
      return;
    }

    const numDuracion = parseInt(duracionMin, 10);
    if (isNaN(numDuracion) || numDuracion <= 0) {
      setErrorForm("Por favor ingresa una duración en minutos válida (mayor a 0).");
      return;
    }

    // Categoría final
    let categoriaFinal = categoriaSeleccionada;
    if (categoriaSeleccionada === "OTRA") {
      if (!otraCategoriaTexto.trim()) {
        setErrorForm("Por favor escribe el nombre de la categoría personalizada.");
        return;
      }
      categoriaFinal = otraCategoriaTexto.trim();
    }

    // Validación OBLIGATORIA de especialistas
    if (especialistasSeleccionados.length === 0) {
      setErrorForm("Es obligatorio habilitar al menos un especialista que realice este servicio.");
      return;
    }

    setGuardando(true);
    try {
      if (modoEdicion) {
        // Actualizar existente
        const res = await fetch("/api/servicios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: idSeleccionado,
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: numPrecio,
            duracionMin: numDuracion,
            categoria: categoriaFinal,
            imagenUrl: imagenUrl.trim(),
            items,
            activo,
            especialistasIds: especialistasSeleccionados,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Error al actualizar servicio");
        }

        setServicios((prev) =>
          prev.map((s) => (s.id === idSeleccionado ? data.servicio : s))
        );
      } else {
        // Crear nuevo
        const res = await fetch("/api/servicios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: numPrecio,
            duracionMin: numDuracion,
            categoria: categoriaFinal,
            imagenUrl: imagenUrl.trim(),
            items,
            activo,
            especialistasIds: especialistasSeleccionados,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Error al crear servicio");
        }

        setServicios((prev) => [data.servicio, ...prev]);
      }

      setModalAbierto(false);
    } catch (err: any) {
      setErrorForm(err.message || "Error al procesar la solicitud");
    } finally {
      setGuardando(false);
    }
  }

  async function toggleEstadoRapido(s: DBService) {
    try {
      const nuevoActivo = !s.activo;
      const res = await fetch("/api/servicios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: s.id,
          activo: nuevoActivo,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setServicios((prev) =>
          prev.map((item) => (item.id === s.id ? { ...item, activo: nuevoActivo } : item))
        );
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  }

  async function confirmarEliminar() {
    if (!servicioAEliminar) return;
    try {
      const res = await fetch(`/api/servicios?id=${servicioAEliminar.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setServicios((prev) => prev.filter((s) => s.id !== servicioAEliminar.id));
        setServicioAEliminar(null);
      }
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
    }
  }

  // Filtrado
  const serviciosFiltrados = servicios.filter((s) => {
    const matchBusqueda =
      s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.categoria.toLowerCase().includes(busqueda.toLowerCase());

    const matchCategoria =
      categoriaFiltro === "TODAS" || s.categoria.toLowerCase() === categoriaFiltro.toLowerCase();

    const matchEstado =
      estadoFiltro === "TODOS" ||
      (estadoFiltro === "ACTIVOS" && s.activo) ||
      (estadoFiltro === "INACTIVOS" && !s.activo);

    return matchBusqueda && matchCategoria && matchEstado;
  });

  const categoriasUnicas = Array.from(new Set(servicios.map((s) => s.categoria))).filter(Boolean);
  const totalActivos = servicios.filter((s) => s.activo).length;
  const precioPromedio =
    servicios.length > 0
      ? servicios.reduce((acc, s) => acc + s.precio, 0) / servicios.length
      : 0;

  return (
    <div className="space-y-6 font-sans">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E8DCD1]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gestión de Servicios y Tarifas
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF6F2] text-[#855230] border border-[#E8DCD1]">
              Solo Administrador
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modifica precios, ajusta duraciones, activa o suspende servicios y añade nuevos rituales al salón.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={cargarServicios}
            disabled={cargando}
            className="border-[#E8DCD1] text-slate-700 hover:bg-[#FAF6F2]"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${cargando ? "animate-spin" : ""}`} />
            Actualizar
          </Button>

          <Button
            size="sm"
            onClick={abrirModalCrear}
            className="bg-gradient-to-r from-[#6E3D21] to-[#855230] hover:from-[#5C3016] hover:to-[#734323] text-white font-medium shadow-md shadow-[#6E3D21]/20"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Métricas Resumidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Servicios
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{servicios.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-emerald-600 block tracking-wider">
            Activos en Agenda
          </span>
          <p className="text-2xl font-bold text-emerald-700 mt-0.5">{totalActivos}</p>
        </div>
        <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
            Tarifa Promedio
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{formatCurrency(precioPromedio)}</p>
        </div>
        <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
            Categorías
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{categoriasUnicas.length}</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, descripción o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Categoría */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="h-9 px-3 rounded-md border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="TODAS">Todas las Categorías</option>
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Selector de Estado */}
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value as any)}
            className="h-9 px-3 rounded-md border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ACTIVOS">Solo Activos</option>
            <option value="INACTIVOS">Solo Inactivos</option>
          </select>
        </div>
      </div>

      {/* Grid de Tarjetas de Servicios */}
      {cargando ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-md border border-slate-200">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
          Cargando catálogo de servicios desde la base de datos...
        </div>
      ) : serviciosFiltrados.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-md border border-slate-200">
          <Scissors className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 font-semibold text-sm">No se encontraron servicios</p>
          <p className="text-xs text-slate-400 mt-1">Prueba cambiando los filtros de búsqueda o añade uno nuevo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviciosFiltrados.map((s) => {
            const montoAbono = Math.round(s.precio * 0.2 * 100) / 100;
            const montoRestante = Math.round((s.precio - montoAbono) * 100) / 100;

            return (
              <div
                key={s.id}
                className={`bg-white rounded-md border transition-all hover:shadow-md flex flex-col justify-between ${
                  s.activo ? "border-slate-200" : "border-rose-200 bg-rose-50/20 opacity-80"
                }`}
              >
                <div>
                  {/* Imagen y Badges */}
                  <div className="relative h-44 w-full bg-slate-100 rounded-t-md overflow-hidden">
                    <Image
                      src={s.imagenUrl || "/images/Full_curl.webp"}
                      alt={s.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white border border-white/20">
                        {s.categoria}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border shadow-xs ${
                          s.activo
                            ? "bg-emerald-600/90 text-white border-emerald-400"
                            : "bg-rose-600/90 text-white border-rose-400"
                        }`}
                      >
                        {s.activo ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Activo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-2.5 h-2.5" />
                            <span>Pausado</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] text-slate-200 uppercase tracking-wider font-semibold block">
                          Precio Total
                        </span>
                        <span className="text-xl font-extrabold tracking-tight">
                          {formatCurrency(s.precio)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-sm">
                        <Clock className="w-3 h-3" />
                        <span>{s.duracionMin} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{s.nombre}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {s.descripcion}
                      </p>
                    </div>

                    {/* Desglose de Reserva 20% */}
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-sm border border-slate-200/80 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-medium">Abono 20% (Reserva)</span>
                        <span className="font-bold text-emerald-700">{formatCurrency(montoAbono)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-medium">Restante 80% (Salón)</span>
                        <span className="font-bold text-slate-700">{formatCurrency(montoRestante)}</span>
                      </div>
                    </div>

                    {/* Pasos / Items incluidos */}
                    {s.items && s.items.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Protocolo Incluido:
                        </span>
                        <ul className="text-[11px] text-slate-600 space-y-0.5">
                          {s.items.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="h-3 w-3 text-secondary shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                          {s.items.length > 3 && (
                            <li className="text-[10px] text-slate-400 font-medium pl-4">
                              +{s.items.length - 3} pasos adicionales
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Especialistas asignados a este servicio */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full sm:w-auto">
                        Especialistas:
                      </span>
                      {s.especialistasIds && s.especialistasIds.length > 0 ? (
                        s.especialistasIds.map((empId) => {
                          const emp = empleados.find((e) => e.id === empId);
                          if (!emp) return null;
                          return (
                            <span
                              key={empId}
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#f6eee7] text-[#693b1b] border border-[#e8d7c9] font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                              {emp.nombre.split(" ")[0]}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                          Sin especialistas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleEstadoRapido(s)}
                    className={`text-xs h-7 px-2.5 font-medium ${
                      s.activo
                        ? "text-rose-700 border-rose-200 hover:bg-rose-50"
                        : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    }`}
                    title={s.activo ? "Pausar este servicio de la agenda pública" : "Activar para que las clientas puedan reservarlo"}
                  >
                    {s.activo ? "Pausar" : "Reactivar"}
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => abrirModalEditar(s)}
                      className="text-xs h-7 px-2.5 text-slate-700 border-slate-300 hover:bg-slate-100"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setServicioAEliminar(s)}
                      className="text-xs h-7 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Servicio */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-lg rounded-md font-sans p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3 border-b border-slate-200">
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>{modoEdicion ? "Modificar Servicio y Tarifa" : "Añadir Nuevo Servicio"}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGuardarServicio} className="space-y-4 pt-3 text-xs">
            {errorForm && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-sm text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorForm}</span>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Nombre del Servicio *</Label>
              <Input
                placeholder="Ej. FULL CURL PREMIUM, BALAYAGE BOTÁNICO..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            {/* Categoría y Duración */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Categoría del Servicio *</Label>
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-md border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-secondary"
                  required
                >
                  {CATEGORIAS_PRESET.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="OTRA">+ Otra categoría personalizada...</option>
                </select>
                {categoriaSeleccionada === "OTRA" && (
                  <Input
                    placeholder="Escribe la nueva categoría..."
                    value={otraCategoriaTexto}
                    onChange={(e) => setOtraCategoriaTexto(e.target.value)}
                    className="text-xs h-8 mt-1.5"
                    required
                  />
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Duración estimada (minutos) *</Label>
                <Input
                  type="number"
                  min="15"
                  step="5"
                  value={duracionMin}
                  onChange={(e) => setDuracionMin(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            {/* Precio en USD ($) */}
            <div className="space-y-1 bg-[#FAF6F2] p-3 rounded-md border border-[#E8DCD1]">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-[#4A2612]">Precio Total ($ USD) *</Label>
                {parseFloat(precio) > 0 && (
                  <span className="text-[11px] font-semibold text-secondary">
                    Abono 20%: {formatCurrency(Math.round(parseFloat(precio) * 0.2 * 100) / 100)} &bull; Salón:{" "}
                    {formatCurrency(Math.round(parseFloat(precio) * 0.8 * 100) / 100)}
                  </span>
                )}
              </div>
              <Input
                type="number"
                min="0"
                step="0.5"
                placeholder="Ej. 45"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="text-xs h-9 bg-white font-bold"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Descripción detallada</Label>
              <Textarea
                placeholder="Explica a la clienta en qué consiste el procedimiento y qué resultados obtendrá..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>

            {/* Imagen del Servicio - Subir desde PC o seleccionar de catálogo */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">Imagen del Servicio *</Label>
                <span className="text-[11px] text-slate-500">Formato WebP / JPG / PNG</span>
              </div>

              {/* Input de archivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Caja de subida de archivo */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border border-slate-200">
                <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden border border-slate-200 bg-white shadow-xs">
                  {imagenUrl ? (
                    <Image
                      src={imagenUrl}
                      alt="Vista previa del servicio"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={subiendoFoto}
                      className="text-xs h-8 bg-white border-slate-300 hover:bg-slate-100 text-slate-700"
                    >
                      {subiendoFoto ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin text-secondary" />
                          Subiendo foto...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-3.5 w-3.5 mr-1.5 text-secondary" />
                          Subir imagen desde equipo
                        </>
                      )}
                    </Button>
                  </div>
                  {uploadMensaje && (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {uploadMensaje}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    O pulsa sobre alguna de las fotos sugeridas abajo:
                  </p>
                </div>
              </div>

              {/* Selector de presets sugeridos */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                {IMAGENES_DISPONIBLES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => {
                      setImagenUrl(img.url);
                      setUploadMensaje(null);
                    }}
                    className={`relative h-14 sm:h-16 w-full rounded-md overflow-hidden border-2 transition-all ${
                      imagenUrl === img.url
                        ? "border-secondary ring-2 ring-secondary/40 scale-95 shadow-sm"
                        : "border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-400"
                    }`}
                    title={img.label}
                  >
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      sizes="100px"
                      unoptimized={true}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Especialistas Habilitados (OBLIGATORIO) */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-secondary" />
                  <span>Especialistas Habilitados *</span>
                  <span className="text-[10px] font-normal text-rose-500">(Mínimo 1 requerido)</span>
                </Label>
                <span className="text-[11px] font-bold text-secondary">
                  {especialistasSeleccionados.length} seleccionado(s)
                </span>
              </div>

              {empleados.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay especialistas registrados en el sistema.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-md border border-slate-200">
                  {empleados.map((emp) => {
                    const seleccionado = especialistasSeleccionados.includes(emp.id);
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          if (seleccionado) {
                            setEspecialistasSeleccionados((prev) => prev.filter((id) => id !== emp.id));
                          } else {
                            setEspecialistasSeleccionados((prev) => [...prev, emp.id]);
                          }
                        }}
                        className={`flex items-center gap-2.5 p-2 rounded-md border text-left transition-all ${
                          seleccionado
                            ? "border-secondary bg-white ring-1 ring-secondary/40 shadow-xs"
                            : "border-slate-200 bg-white/70 hover:border-slate-300 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                          <Image
                            src={emp.avatarUrl || "/images/fundadora_xioilin_guzman.webp"}
                            alt={emp.nombre}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate">{emp.nombre}</p>
                          <p className="text-[10px] text-slate-500 truncate">{emp.cargo}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            seleccionado ? "bg-secondary text-white" : "border border-slate-300"
                          }`}
                        >
                          {seleccionado && <Check className="h-2.5 w-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {especialistasSeleccionados.length === 0 && (
                <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  Debes seleccionar obligatoriamente al menos un especialista.
                </p>
              )}
            </div>

            {/* Pasos / Items incluidos en el ritual */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <Label className="text-xs font-semibold text-slate-700">Protocolo / Pasos incluidos</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej. Lavado con ozonoterapia, Diagnóstico capilar..."
                  value={nuevoItemTexto}
                  onChange={(e) => setNuevoItemTexto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      agregarItem();
                    }
                  }}
                  className="text-xs h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={agregarItem}
                  className="text-xs h-8 px-2.5 shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir
                </Button>
              </div>

              {items.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-sm border border-slate-200">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded-sm border border-slate-200"
                    >
                      <span className="truncate pr-2">{item}</span>
                      <button
                        type="button"
                        onClick={() => eliminarItem(idx)}
                        className="text-rose-500 hover:text-rose-700 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Estado Activo */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <input
                type="checkbox"
                id="activo-check"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary"
              />
              <Label htmlFor="activo-check" className="text-xs text-slate-700 cursor-pointer font-medium">
                Servicio activo (disponible en la agenda web para reservaciones de clientas)
              </Label>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalAbierto(false)}
                className="text-xs h-8"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={guardando}
                className="bg-secondary hover:bg-[#6e3d21] text-white text-xs h-8 font-medium shadow-xs"
              >
                {guardando ? "Guardando..." : modoEdicion ? "Guardar Cambios" : "Crear Servicio"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmar Eliminación */}
      {servicioAEliminar && (
        <Dialog open={!!servicioAEliminar} onOpenChange={() => setServicioAEliminar(null)}>
          <DialogContent className="max-w-md rounded-md font-sans p-5 sm:p-6">
            <DialogHeader className="pb-3 border-b border-slate-200">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-rose-600" />
                <span>¿Eliminar servicio?</span>
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 text-xs text-slate-600 space-y-2">
              <p>
                Estás a punto de eliminar el servicio <strong>{servicioAEliminar.nombre}</strong> ({formatCurrency(servicioAEliminar.precio)}).
              </p>
              <p className="text-slate-500">
                Si solo deseas que no aparezca temporalmente en la agenda de citas de las clientas, te sugerimos utilizar la opción de <strong>Pausar</strong> en lugar de eliminarlo definitivamente.
              </p>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setServicioAEliminar(null)}
                className="text-xs h-8"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={confirmarEliminar}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8"
              >
                Confirmar Eliminación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
