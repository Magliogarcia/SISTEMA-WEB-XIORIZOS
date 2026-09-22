"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import type { User, UserRole } from "@/types/user";

const usuariosIniciales: User[] = [
  { id: "u1", nombre: "Xiomara Rodríguez", email: "xiomara@xiorizos.com", rol: "admin" },
  { id: "u2", nombre: "Andrea Salazar", email: "andrea@xiorizos.com", rol: "estilista" },
  { id: "u3", nombre: "Carlos Peña", email: "carlos@xiorizos.com", rol: "estilista" },
  { id: "u4", nombre: "María González", email: "maria.gonzalez@gmail.com", rol: "cliente" },
];

const rolVariant: Record<UserRole, "default" | "secondary" | "outline"> = {
  admin: "default",
  estilista: "secondary",
  cliente: "outline",
};

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [rolNuevo, setRolNuevo] = useState<UserRole>("cliente");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nuevoUsuario: User = {
      id: crypto.randomUUID(),
      nombre: String(formData.get("nombre")),
      email: String(formData.get("email")),
      rol: rolNuevo,
    };
    setUsuarios((prev) => [...prev, nuevoUsuario]);
    setDialogAbierto(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Usuarios y roles</h1>
          <p className="text-sm text-muted-foreground">Administra clientes, estilistas y administradores</p>
        </div>

        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Nuevo usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo usuario</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input id="nombre" name="nombre" required placeholder="Ej. Sofía Marín" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" name="email" type="email" required placeholder="correo@ejemplo.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rol">Rol</Label>
                <Select value={rolNuevo} onValueChange={(value) => setRolNuevo(value as UserRole)}>
                  <SelectTrigger id="rol">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="estilista">Estilista</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar usuario</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => {
                const iniciales = usuario.nombre.split(" ").map((n) => n[0]).join("");
                return (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {iniciales}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{usuario.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={rolVariant[usuario.rol]}>{usuario.rol}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
