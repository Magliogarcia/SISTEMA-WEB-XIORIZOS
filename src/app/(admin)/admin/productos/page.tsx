"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [dialogAbierto, setDialogAbierto] = useState(false);

  const productos = mockProducts.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">Gestión de inventario y catálogo</p>
        </div>

        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo producto</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setDialogAbierto(false);
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="nombre">Nombre del producto</Label>
                  <Input id="nombre" required placeholder="Ej. Tinte Permanente" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="marca">Marca</Label>
                  <Input id="marca" required placeholder="Ej. Biokera" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Input id="categoria" required placeholder="Ej. Tintes" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="precio">Precio</Label>
                  <Input id="precio" type="number" step="0.01" required placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" required placeholder="0" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar producto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Listado de productos</CardTitle>
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              className="pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <Image src={p.imagenUrl} alt={p.nombre} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-medium">{p.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.marca}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.categoria}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(p.precio)}</TableCell>
                  <TableCell>
                    <Badge variant={p.stock <= 5 ? "destructive" : "secondary"}>{p.stock} und.</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
