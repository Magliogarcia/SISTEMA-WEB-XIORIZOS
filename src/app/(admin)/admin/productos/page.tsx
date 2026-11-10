"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Upload,
  CheckCircle2,
  Package,
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
import type { DBProduct } from "@/lib/db";

const CATEGORIAS_PRODUCTO = [
  "Cremas",
  "Definidores",
  "Geles",
  "Tratamientos",
  "Aceites",
  "Shampoo",
  "Acondicionadores",
  "Mascarillas",
  "Accesorios",
  "Kits",
];

const IMAGENES_DISPONIBLES = [
  "/images/crema_de_peinar_etniker.webp",
  "/images/gel_definidor.webp",
  "/images/shampoo_hidratante.webp",
  "/images/mascarilla_capilar.webp",
  "/images/oleo_capilar.webp",
  "/images/crecimiento_capilar.webp",
  "/images/crema_de_peinar_ibella.webp",
  "/images/gel_capilar.webp",
  "/images/mascarilla_nutritiva.webp",
];

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<DBProduct[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Dialogs
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [imagenPopup, setImagenPopup] = useState<{ url: string; nombre: string; precio: number; categoria: string } | null>(null);

  // Form states
  const [idSeleccionado, setIdSeleccionado] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("Xiorizos");
  const [categoria, setCategoria] = useState("Cremas");
  const [costo, setCosto] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("10");
  const [imagenUrl, setImagenUrl] = useState(IMAGENES_DISPONIBLES[0]);

  // Subida de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<{ id: string; nombre: string } | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [uploadMensaje, setUploadMensaje] = useState<string | null>(null);

  async function cargarProductos() {
    setCargando(true);
    try {
      const res = await fetch("/api/productos");
      const data = await res.json();
      if (data.success && data.productos) {
        setProductos(data.productos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function abrirNuevo() {
    setModoEdicion(false);
    setIdSeleccionado("");
    setNombre("");
    setDescripcion("");
    setMarca("Xiorizos");
    setCategoria("Cremas");
    setCosto("");
    setPrecio("");
    setStock("10");
    setImagenUrl(IMAGENES_DISPONIBLES[0]);
    setUploadMensaje(null);
    setModalAbierto(true);
  }

  function abrirEditar(p: DBProduct) {
    setModoEdicion(true);
    setIdSeleccionado(p.id);
    setNombre(p.nombre);
    setDescripcion(p.descripcion);
    setMarca(p.marca);
    setCategoria(p.categoria);
    setCosto(p.costo !== undefined ? p.costo.toString() : (p.precio * 0.55).toFixed(2));
    setPrecio(p.precio.toString());
    setStock(p.stock.toString());
    setImagenUrl(p.imagenUrl);
    setUploadMensaje(null);
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
        setUploadMensaje("Foto subida y optimizada a WebP correctamente");
      } else {
        setUploadMensaje(data.error || "No se pudo subir la foto");
      }
    } catch (err) {
      console.error(err);
      setUploadMensaje("Error al subir la imagen");
    } finally {
      setSubiendoFoto(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (modoEdicion) {
        const res = await fetch("/api/productos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: idSeleccionado,
            nombre,
            descripcion,
            marca,
            categoria,
            costo: parseFloat(costo) || 0,
            precio: parseFloat(precio) || 0,
            stock: parseInt(stock, 10) || 0,
            imagenUrl,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setProductos((prev) =>
            prev.map((p) => (p.id === idSeleccionado ? data.producto : p))
          );
        }
      } else {
        const res = await fetch("/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            descripcion,
            marca,
            categoria,
            costo: parseFloat(costo) || 0,
            precio: parseFloat(precio) || 0,
            stock: parseInt(stock, 10) || 0,
            imagenUrl,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setProductos((prev) => [data.producto, ...prev]);
        }
      }
      setModalAbierto(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function confirmarEliminarProducto() {
    if (!productoAEliminar) return;
    setEliminando(true);
    try {
      const res = await fetch(`/api/productos?id=${productoAEliminar.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id));
        setProductoAEliminar(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEliminando(false);
    }
  }

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inventario y Productos</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de catálogo, costes de adquisición, precios de venta, stock y fotos.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={cargarProductos} className="rounded-sm border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Actualizar</span>
          </Button>

          <Button
            onClick={abrirNuevo}
            size="sm"
            className="rounded-sm bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo producto</span>
          </Button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, categoría o marca..."
            className="pl-9 bg-white rounded-sm text-xs border-slate-200"
          />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="rounded-sm border border-slate-200 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          {cargando ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Cargando catálogo de productos...
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No se encontraron productos con el filtro aplicado.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Marca</th>
                  <th className="py-3 px-4">Precio / Margen</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productosFiltrados.map((p) => {
                  const costoUnit = p.costo !== undefined ? p.costo : p.precio * 0.55;
                  const gananciaUnit = p.precio - costoUnit;
                  const porcentaje = costoUnit > 0 ? (gananciaUnit / costoUnit) * 100 : 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setImagenPopup({
                                url: p.imagenUrl,
                                nombre: p.nombre,
                                precio: p.precio,
                                categoria: p.categoria,
                              })
                            }
                            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-slate-100 border border-slate-200 hover:opacity-85 hover:ring-2 hover:ring-amber-500 transition-all cursor-zoom-in group shadow-xs"
                            title="Clic para ampliar foto"
                          >
                            <Image
                              src={p.imagenUrl}
                              alt={p.nombre}
                              fill
                              unoptimized={true}
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </button>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{p.nombre}</p>
                            <p className="text-slate-500 line-clamp-1 max-w-xs">{p.descripcion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-slate-600 capitalize">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.marca}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-sm text-slate-900">
                          {formatCurrency(p.precio)}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          +{formatCurrency(gananciaUnit)} ({porcentaje.toFixed(0)}%)
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              p.stock <= 5 ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                          />
                          <span className={p.stock <= 5 ? "text-rose-700" : "text-slate-800"}>
                            {p.stock} unid.
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => abrirEditar(p)}
                            className="p-1.5 rounded-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                            title="Editar producto"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductoAEliminar({ id: p.id, nombre: p.nombre })}
                            className="p-1.5 rounded-sm text-rose-600 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* Modal Crear / Editar Producto (Solo se cierra por la X o Cancelar, no por clic afuera) */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-lg rounded-sm max-h-[85vh] overflow-y-auto p-5 sm:p-6 border border-slate-200"
        >
          <DialogHeader className="pb-2 border-b border-slate-200">
            <DialogTitle className="text-base font-bold text-slate-900">
              {modoEdicion ? "Editar información del producto" : "Añadir nuevo producto"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 text-xs">
            <div className="space-y-1">
              <Label htmlFor="prodNombre" className="text-xs font-semibold text-slate-700">
                Nombre del producto *
              </Label>
              <Input
                id="prodNombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Crema de Peinar Etniker"
                className="rounded-sm text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodMarca" className="text-xs font-semibold text-slate-700">
                  Marca *
                </Label>
                <Input
                  id="prodMarca"
                  required
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  placeholder="Ej. Etniker, Skala, Cantu"
                  className="rounded-sm text-xs"
                />
              </div>

              {/* Selector Desplegable de Categorías */}
              <div className="space-y-1">
                <Label htmlFor="prodCat" className="text-xs font-semibold text-slate-700">
                  Categoría *
                </Label>
                <select
                  id="prodCat"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-sm border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-xs"
                >
                  {CATEGORIAS_PRODUCTO.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fila única compacta: Costo, Venta, Ganancia y % Margen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
              <div className="space-y-1">
                <Label htmlFor="prodCosto" className="text-xs font-semibold text-slate-700">
                  Precio de costo ($) *
                </Label>
                <Input
                  id="prodCosto"
                  type="number"
                  step="0.01"
                  required
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                  placeholder="12.00"
                  className="rounded-sm text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prodPrecio" className="text-xs font-semibold text-slate-700">
                  Precio de venta ($) *
                </Label>
                <Input
                  id="prodPrecio"
                  type="number"
                  step="0.01"
                  required
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="22.00"
                  className="rounded-sm text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block truncate">
                  Ganancia y margen
                </span>
                {(() => {
                  const p = parseFloat(precio) || 0;
                  const c = parseFloat(costo) || 0;
                  const ganancia = p - c;
                  const porcentaje = c > 0 ? (ganancia / c) * 100 : 0;
                  const esPositivo = ganancia >= 0;

                  return (
                    <div
                      className={`h-9 px-2.5 rounded-sm border flex items-center justify-between text-xs font-medium ${
                        !precio && !costo
                          ? "bg-slate-50 border-slate-200 text-slate-400"
                          : esPositivo
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                          : "bg-rose-50/80 border-rose-200 text-rose-800"
                      }`}
                    >
                      <span className="font-bold truncate">
                        {esPositivo ? `+$${ganancia.toFixed(2)}` : `-$${Math.abs(ganancia).toFixed(2)}`}
                      </span>
                      <span className={`text-[11px] font-bold ${esPositivo ? "text-emerald-700" : "text-rose-700"}`}>
                        {c > 0 ? `${esPositivo ? "+" : ""}${porcentaje.toFixed(0)}%` : "0%"}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodStock" className="text-xs font-semibold text-slate-700">
                  Stock disponible *
                </Label>
                <Input
                  id="prodStock"
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="rounded-sm text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="prodDesc" className="text-xs font-semibold text-slate-700">
                  Descripción
                </Label>
                <Input
                  id="prodDesc"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Beneficios y textura para rizos."
                  className="rounded-sm text-xs"
                />
              </div>
            </div>

            {/* Subida de Imagen con optimización WebP */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <Label className="text-xs font-semibold text-slate-700">Foto del producto</Label>
              
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-sm overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                  {imagenUrl ? (
                    <Image
                      src={imagenUrl}
                      alt="Preview"
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={subiendoFoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-sm text-xs font-semibold flex items-center gap-1.5 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <Upload className="h-3.5 w-3.5 text-slate-600" />
                    <span>{subiendoFoto ? "Procesando..." : "Subir foto (JPG, PNG, WebP)"}</span>
                  </Button>
                </div>
              </div>

              {uploadMensaje && (
                <p className="text-xs font-medium text-emerald-700 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{uploadMensaje}</span>
                </p>
              )}

              {/* Galería de Selección Rápida */}
              <div className="pt-1">
                <p className="text-[11px] font-medium text-slate-500 mb-1.5">O elige del catálogo existente:</p>
                <div className="grid grid-cols-6 gap-2 p-1.5 bg-slate-50 rounded-sm border border-slate-200 max-h-24 overflow-y-auto">
                  {IMAGENES_DISPONIBLES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setImagenUrl(img)}
                      className={`relative aspect-square rounded-sm overflow-hidden border transition-all ${
                        imagenUrl === img
                          ? "border-slate-900 ring-2 ring-slate-900 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Preview" fill unoptimized={true} className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
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
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-sm text-xs shadow-xs"
              >
                {modoEdicion ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Lightbox de Foto de Producto */}
      {imagenPopup && (
        <Dialog open={!!imagenPopup} onOpenChange={() => setImagenPopup(null)}>
          <DialogContent className="max-w-sm sm:max-w-md p-5 rounded-sm border border-slate-200">
            <DialogHeader className="pb-2 border-b border-slate-200">
              <DialogTitle className="text-sm font-bold text-slate-900 truncate">
                {imagenPopup.nombre}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-slate-50 border border-slate-200">
                <Image
                  src={imagenPopup.url}
                  alt={imagenPopup.nombre}
                  fill
                  unoptimized={true}
                  className="object-contain p-2"
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-medium capitalize">
                  {imagenPopup.categoria}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(imagenPopup.precio)}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Personalizado de Confirmación para Eliminar Producto */}
      <Dialog open={!!productoAEliminar} onOpenChange={(open) => !open && setProductoAEliminar(null)}>
        <DialogContent className="max-w-sm rounded-sm p-5 border border-slate-200 font-sans">
          <DialogHeader className="pb-2 border-b border-slate-200">
            <DialogTitle className="text-sm font-bold text-slate-900">
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 text-xs text-slate-600">
            ¿Estás seguro de que deseas eliminar <strong className="text-slate-900">&quot;{productoAEliminar?.nombre}&quot;</strong> del catálogo de la tienda? Esta acción no se puede deshacer.
          </div>
          <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setProductoAEliminar(null)}
              disabled={eliminando}
              className="rounded-sm text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmarEliminarProducto}
              disabled={eliminando}
              className="rounded-sm text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {eliminando ? "Eliminando..." : "Eliminar producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
