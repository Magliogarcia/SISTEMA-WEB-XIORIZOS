"use client";

import { useState } from "react";
import { Check, X, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import type { AppointmentStatus } from "@/types/appointment";

interface CitaAdmin {
  id: string;
  cliente: string;
  servicio: string;
  profesional: string;
  fecha: string;
  hora: string;
  estado: AppointmentStatus;
}

const citasIniciales: CitaAdmin[] = [
  { id: "c1", cliente: "María González", servicio: "Coloración completa", profesional: "Andrea Salazar", fecha: "02/09/2026", hora: "10:00 AM", estado: "confirmada" },
  { id: "c2", cliente: "Pedro Ramírez", servicio: "Corte de cabello", profesional: "Carlos Peña", fecha: "02/09/2026", hora: "11:30 AM", estado: "pendiente" },
  { id: "c3", cliente: "Luisa Fernández", servicio: "Mechas / Balayage", profesional: "Xiomara Rodríguez", fecha: "03/09/2026", hora: "02:00 PM", estado: "pendiente" },
  { id: "c4", cliente: "Jorge Salas", servicio: "Tratamiento capilar", profesional: "Carlos Peña", fecha: "01/09/2026", hora: "09:00 AM", estado: "cancelada" },
];

const estadoVariant: Record<AppointmentStatus, "success" | "warning" | "destructive" | "secondary"> = {
  confirmada: "success",
  pendiente: "warning",
  reprogramada: "secondary",
  cancelada: "destructive",
  completada: "secondary",
};

export default function AdminCitasPage() {
  const [citas, setCitas] = useState(citasIniciales);

  function cambiarEstado(id: string, estado: AppointmentStatus) {
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Citas agendadas</h1>
        <p className="text-sm text-muted-foreground">Confirma, reprograma o cancela citas de clientes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de citas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Profesional</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell className="text-sm font-medium">{cita.cliente}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cita.servicio}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cita.profesional}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cita.fecha}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cita.hora}</TableCell>
                  <TableCell>
                    <Badge variant={estadoVariant[cita.estado]}>{cita.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                      title="Confirmar"
                      onClick={() => cambiarEstado(cita.id, "confirmada")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-amber-600 hover:text-amber-700"
                      title="Reprogramar"
                      onClick={() => cambiarEstado(cita.id, "reprogramada")}
                    >
                      <CalendarClock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Cancelar"
                      onClick={() => cambiarEstado(cita.id, "cancelada")}
                    >
                      <X className="h-4 w-4" />
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
