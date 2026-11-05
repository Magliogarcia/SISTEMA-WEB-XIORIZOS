"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
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
    setModalAbierto(true);
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
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${nombreProd}"?`)) {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Inventario y Productos</h1>
          <p className="text-sm text-muted-foreground">
            Añade nuevos productos, modifica precios, stock e imágenes del catálogo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={cargarProductos} className="flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>

          <Button onClick={abrirNuevo} className="flex items-center gap-1.5 bg-primary hover:bg-secondary text-white">
            <Plus className="h-4 w-4" />
            <span>Nuevo producto</span>
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="flex-col sm:flex-row gap-3 sm:items-center justify-between pb-3">
          <CardTitle className="text-lg">Catálogo disponible ({productosFiltrados.length})</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o marca..."
              className="pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
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
                        <Badge variant="secondary" className="capitalize text-xs">
                          {p.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">
                        {p.marca}
                      </TableCell>
                      <TableCell className="font-bold text-sm text-primary">
                        {formatCurrency(p.precio)}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.stock <= 3 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {p.stock} unid.
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-secondary/15"
                            onClick={() => abrirEditar(p)}
                            title="Editar información y precio"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
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

      {/* Modal Crear / Editar Producto */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {modoEdicion ? "Modificar información del producto" : "Añadir nuevo producto al catálogo"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="prodNombre" className="text-xs font-semibold">
                Nombre del producto *
              </Label>
              <Input
                id="prodNombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Crema de Peinar Etniker"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prodMarca" className="text-xs font-semibold">
                  Marca
                </Label>
                <Input
                  id="prodMarca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  placeholder="Ej. Etniker, Skala, Cantu"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodCat" className="text-xs font-semibold">
                  Categoría
                </Label>
                <Input
                  id="prodCat"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ej. Cremas, Geles, Óleos"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
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
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prodStock" className="text-xs font-semibold">
                  Stock disponible
                </Label>
                <Input
                  id="prodStock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prodDesc" className="text-xs font-semibold">
                Descripción
              </Label>
              <Textarea
                id="prodDesc"
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Beneficios, ingredientes y modo de uso."
              />
            </div>

            {/* Selector de Imagen */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Seleccionar imagen del producto</Label>
              <div className="grid grid-cols-5 gap-2 p-2 bg-muted/40 rounded-xl max-h-32 overflow-y-auto">
                {IMAGENES_DISPONIBLES.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setImagenUrl(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      imagenUrl === img ? "border-primary ring-2 ring-primary/30 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Preview" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-secondary text-white font-semibold">
                {modoEdicion ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
