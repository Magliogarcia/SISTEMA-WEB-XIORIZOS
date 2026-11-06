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
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("10");
  const [imagenUrl, setImagenUrl] = useState(IMAGENES_DISPONIBLES[0]);

  // Subida de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
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
        setUploadMensaje("Foto subida correctamente");
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

  async function eliminarProducto(id: string, nombreProd: string) {
    if (!confirm(`¿Estás seguro de eliminar "${nombreProd}" del catálogo?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/productos?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProductos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
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
            Gestión de catálogo, precios, stock y subida de fotos.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={cargarProductos} className="rounded-md border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Actualizar</span>
          </Button>

          <Button onClick={abrirNuevo} className="rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">
            Catálogo General ({productosFiltrados.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar por nombre, categoría o marca..."
              className="pl-8 rounded-md text-xs h-9 border-slate-200"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {cargando ? (
            <div className="py-12 text-center text-xs text-slate-500">Cargando productos...</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No se encontraron productos coincidentes.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Marca</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {productosFiltrados.map((p) => (
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
                          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-slate-100 border border-slate-200 hover:opacity-85 hover:ring-2 hover:ring-amber-500 transition-all cursor-zoom-in group shadow-xs"
                          title="Clic para ampliar foto"
                        >
                          <Image
                            src={p.imagenUrl}
                            alt={p.nombre}
                            fill
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
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.marca}
                    </td>
                    <td className="py-3 px-4 font-bold text-sm text-slate-900">
                      {formatCurrency(p.precio)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                        p.stock <= 5 ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {p.stock} unid.
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => abrirEditar(p)}
                          className="p-1.5 rounded text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                          title="Editar producto"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarProducto(p.id, p.nombre)}
                          className="p-1.5 rounded text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Crear / Editar Producto (max-h-[85vh] y rounded-md) */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-lg rounded-md max-h-[85vh] overflow-y-auto p-5 sm:p-6">
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
                className="rounded-md text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodMarca" className="text-xs font-semibold text-slate-700">
                  Marca
                </Label>
                <Input
                  id="prodMarca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  placeholder="Ej. Etniker, Skala, Cantu"
                  className="rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prodCat" className="text-xs font-semibold text-slate-700">
                  Categoría
                </Label>
                <Input
                  id="prodCat"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ej. Cremas, Geles, Tratamientos"
                  className="rounded-md text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodPrecio" className="text-xs font-semibold text-slate-700">
                  Precio (USD) *
                </Label>
                <Input
                  id="prodPrecio"
                  type="number"
                  step="0.01"
                  required
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="25.00"
                  className="rounded-md text-xs"
                />
              </div>

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
                  className="rounded-md text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prodDesc" className="text-xs font-semibold text-slate-700">
                Descripción
              </Label>
              <Textarea
                id="prodDesc"
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Beneficios, modo de uso y textura para rizos."
                className="rounded-md text-xs"
              />
            </div>

            {/* Subida de Imagen Limpia y sin textos indebidos */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <Label className="text-xs font-semibold text-slate-700">Foto del producto</Label>
              
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                  {imagenUrl ? (
                    <Image src={imagenUrl} alt="Preview" fill className="object-cover" />
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
                    className="rounded-md text-xs font-semibold flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Upload className="h-3.5 w-3.5 text-slate-600" />
                    <span>{subiendoFoto ? "Subiendo..." : "Subir foto"}</span>
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
                <div className="grid grid-cols-6 gap-2 p-1.5 bg-slate-50 rounded-md border border-slate-200 max-h-24 overflow-y-auto">
                  {IMAGENES_DISPONIBLES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setImagenUrl(img)}
                      className={`relative aspect-square rounded overflow-hidden border transition-all ${
                        imagenUrl === img
                          ? "border-slate-900 ring-2 ring-slate-900 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Preview" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)} className="rounded-md text-xs">
                Cancelar
              </Button>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md text-xs shadow-sm">
                {modoEdicion ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Modal Lightbox de Foto de Producto */}
      {imagenPopup && (
        <Dialog open={!!imagenPopup} onOpenChange={() => setImagenPopup(null)}>
          <DialogContent className="max-w-sm sm:max-w-md p-5 rounded-md">
            <DialogHeader className="pb-2 border-b border-slate-200">
              <DialogTitle className="text-sm font-bold text-slate-900 truncate">
                {imagenPopup.nombre}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="relative w-full aspect-square rounded-md overflow-hidden bg-slate-50 border border-slate-200">
                <Image
                  src={imagenPopup.url}
                  alt={imagenPopup.nombre}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium capitalize">
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
    </div>
  );
}
