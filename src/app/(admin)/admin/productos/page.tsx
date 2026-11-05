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
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
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
        setUploadMensaje("Foto subida correctamente a la carpeta de productos");
      } else {
        setUploadMensaje(data.error || "No se pudo subir la foto");
      }
    } catch (err) {
      console.error(err);
      setUploadMensaje("Error de conexión al subir la imagen");
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
    if (!confirm(`¿Estás seguro de que deseas eliminar "${nombreProd}" del catálogo?`)) {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Inventario y Productos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona productos, sube fotos, ajusta precios y actualiza el stock disponible en tienda.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={cargarProductos} className="rounded-lg flex items-center gap-1.5 text-xs font-semibold">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>

          <Button onClick={abrirNuevo} className="rounded-lg flex items-center gap-1.5 bg-primary hover:bg-secondary text-white text-xs font-semibold shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border-border shadow-sm">
        <CardHeader className="flex-col sm:flex-row gap-3 sm:items-center justify-between pb-3 border-b border-border">
          <CardTitle className="text-base font-bold text-primary">
            Catálogo General ({productosFiltrados.length})
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, categoría o marca..."
              className="pl-9 rounded-lg text-sm"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {cargando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Cargando productos...</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No se encontraron productos coincidentes.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productosFiltrados.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary/10 border border-border">
                            <Image src={p.imagenUrl} alt={p.nombre} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{p.nombre}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{p.descripcion}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs font-semibold">
                          {p.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {p.marca}
                      </TableCell>
                      <TableCell className="font-bold text-sm text-primary">
                        {formatCurrency(p.precio)}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          p.stock <= 5 ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {p.stock} unid.
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-secondary/15 rounded-md"
                            onClick={() => abrirEditar(p)}
                            title="Editar información y precio"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-md"
                            onClick={() => eliminarProducto(p.id, p.nombre)}
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear / Editar Producto (Optimizado en altura, no se corta en pantallas) */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-lg rounded-lg max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          <DialogHeader className="pb-2 border-b border-border">
            <DialogTitle className="text-lg font-bold text-primary">
              {modoEdicion ? "Editar información del producto" : "Añadir nuevo producto"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label htmlFor="prodNombre" className="text-xs font-semibold">
                Nombre del producto *
              </Label>
              <Input
                id="prodNombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Crema de Peinar Etniker"
                className="rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodMarca" className="text-xs font-semibold">
                  Marca
                </Label>
                <Input
                  id="prodMarca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  placeholder="Ej. Etniker, Skala, Cantu"
                  className="rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prodCat" className="text-xs font-semibold">
                  Categoría
                </Label>
                <Input
                  id="prodCat"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ej. Cremas, Geles, Tratamientos"
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodPrecio" className="text-xs font-semibold">
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
                  className="rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prodStock" className="text-xs font-semibold">
                  Stock disponible *
                </Label>
                <Input
                  id="prodStock"
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prodDesc" className="text-xs font-semibold">
                Descripción
              </Label>
              <Textarea
                id="prodDesc"
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Beneficios, modo de uso y textura para rizos."
                className="rounded-lg text-xs"
              />
            </div>

            {/* Subida de Imagen Dedicada a Carpeta de Productos */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs font-semibold">Foto del producto</Label>
              
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-border bg-muted/40 shadow-sm">
                  {imagenUrl ? (
                    <Image src={imagenUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
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
                    className="rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5 text-secondary" />
                    <span>{subiendoFoto ? "Subiendo foto..." : "Subir foto desde mi equipo"}</span>
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Se guarda en la carpeta exclusiva <code className="text-foreground">/images/productos/</code>
                  </p>
                </div>
              </div>

              {uploadMensaje && (
                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{uploadMensaje}</span>
                </p>
              )}

              {/* Galería de Selección Rápida */}
              <div className="pt-1">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5">O elige una foto del catálogo existente:</p>
                <div className="grid grid-cols-6 gap-2 p-1.5 bg-muted/30 rounded-lg max-h-24 overflow-y-auto">
                  {IMAGENES_DISPONIBLES.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setImagenUrl(img)}
                      className={`relative aspect-square rounded-md overflow-hidden border transition-all ${
                        imagenUrl === img
                          ? "border-primary ring-2 ring-primary scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Preview" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)} className="rounded-lg">
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-secondary text-white font-semibold rounded-lg shadow-sm">
                {modoEdicion ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
