"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { User, UserRole } from "@/types/user";

const usuariosIniciales: User[] = [
  { id: "u1", nombre: "Xiomara Rodríguez", email: "admin@xiorizos.com", rol: "admin" },
  { id: "u2", nombre: "Axel Alvarado", email: "axel@xiorizos.com", rol: "estilista" },
  { id: "u3", nombre: "Yolennis Yélamo", email: "yolennis@xiorizos.com", rol: "estilista" },
  { id: "u4", nombre: "María González", email: "maria@ejemplo.com", rol: "cliente" },
];

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

  function eliminarUsuario(id: string) {
    if (!confirm("¿Deseas eliminar este usuario?")) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Usuarios Registrados</h1>
          <p className="text-xs text-slate-500 mt-0.5">Control de cuentas, roles y accesos al sistema</p>
        </div>

        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md flex items-center gap-1.5 text-xs shadow-sm self-start sm:self-auto">
              <Plus className="h-4 w-4" />
              <span>Nuevo Usuario</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-md max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-2 border-b border-slate-200">
              <DialogTitle className="text-base font-bold text-slate-900">Crear usuario</DialogTitle>
            </DialogHeader>
            <form className="space-y-3.5 pt-1 text-xs" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="nombre" className="text-xs font-semibold text-slate-700">Nombre completo *</Label>
                <Input id="nombre" name="nombre" required placeholder="Ej. Sofía Marín" className="rounded-md text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Correo electrónico *</Label>
                <Input id="email" name="email" type="email" required placeholder="correo@ejemplo.com" className="rounded-md text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rol" className="text-xs font-semibold text-slate-700">Rol</Label>
                <Select value={rolNuevo} onValueChange={(value) => setRolNuevo(value as UserRole)}>
                  <SelectTrigger id="rol" className="rounded-md text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="estilista">Estilista</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogAbierto(false)} className="rounded-md text-xs">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md text-xs">
                  Guardar usuario
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Listado de Usuarios ({usuarios.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Correo</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {usuarios.map((usuario) => {
                const iniciales = usuario.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr key={usuario.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-md border border-slate-200">
                          <AvatarFallback className="bg-slate-100 text-xs font-bold text-slate-700 rounded-md">
                            {iniciales}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-slate-900 text-sm">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{usuario.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                          usuario.rol === "admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : usuario.rol === "estilista"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => eliminarUsuario(usuario.id)}
                        className="p-1.5 rounded text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
