"use client";

import { useState, useEffect } from "react";
import { Check, X, CalendarCheck, Clock, User, Phone, RefreshCw, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { DBAppointment } from "@/lib/db";

const estadoVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  confirmada: "success",
  pendiente: "warning",
  completada: "secondary",
  cancelada: "destructive",
};

export default function AdminCitasPage() {
  const [citas, setCitas] = useState<DBAppointment[]>([]);
  const [cargando, setCargando] = useState(true);

  async function cargarCitas() {
    setCargando(true);
    try {
      const res = await fetch("/api/citas");
      const data = await res.json();
      if (data.success && data.citas) {
        setCitas(data.citas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cambiarEstado(id: string, nuevoEstado: "confirmada" | "completada" | "cancelada") {
    try {
      const res = await fetch("/api/citas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) {
        setCitas((prev) =>
          prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Agenda de Citas</h1>
          <p className="text-sm text-muted-foreground">
            Revisa quién agendó, a qué hora, con qué especialista y gestiona la confirmación.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={cargarCitas} className="w-fit flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" />
          <span>Actualizar</span>
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Citas registradas ({citas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Cargando citas...</div>
          ) : citas.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No hay citas registradas en el sistema aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente & Contacto</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Especialista</TableHead>
                    <TableHead>Fecha & Hora</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>
                        <p className="font-semibold text-foreground text-sm">{cita.clienteNombre}</p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Phone className="h-3 w-3 text-secondary" />
                          <span>{cita.clienteTelefono}</span>
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-xs sm:text-sm text-primary flex items-center gap-1">
                          <Scissors className="h-3.5 w-3.5 text-secondary shrink-0" />
                          <span>{cita.servicioNombre}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(cita.servicioPrecio)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs sm:text-sm font-medium flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-secondary shrink-0" />
                          <span>{cita.profesionalNombre}</span>
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs sm:text-sm font-medium">
                          {formatDate(new Date(cita.fecha))}
                        </p>
                        <p className="text-xs text-secondary font-bold flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{cita.hora}</span>
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-[180px]">
                          {cita.notas || "Sin notas"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoVariant[cita.estado] || "secondary"} className="capitalize text-xs font-semibold">
                          {cita.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {cita.estado !== "confirmada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs"
                              title="Confirmar cita"
                              onClick={() => cambiarEstado(cita.id, "confirmada")}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                          )}
                          {cita.estado === "confirmada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                              title="Marcar como atendida/completada"
                              onClick={() => cambiarEstado(cita.id, "completada")}
                            >
                              <CalendarCheck className="h-4 w-4 mr-1" />
                              Completada
                            </Button>
                          )}
                          {cita.estado !== "cancelada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-destructive hover:bg-destructive/10 text-xs"
                              title="Cancelar cita"
                              onClick={() => cambiarEstado(cita.id, "cancelada")}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
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
    </div>
  );
}
