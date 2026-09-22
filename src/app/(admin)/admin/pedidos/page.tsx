"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

type EstadoPedido = "procesando" | "enviado" | "entregado" | "cancelado";

interface Pedido {
  id: string;
  cliente: string;
  fecha: string;
  items: number;
  total: number;
  estado: EstadoPedido;
}

const pedidosIniciales: Pedido[] = [
  { id: "#ORD-1042", cliente: "Ana Torres", fecha: "31/08/2026", items: 3, total: 58.4, estado: "procesando" },
  { id: "#ORD-1041", cliente: "Carlos Díaz", fecha: "30/08/2026", items: 1, total: 18.5, estado: "enviado" },
  { id: "#ORD-1040", cliente: "Valentina Ruiz", fecha: "29/08/2026", items: 2, total: 39.9, estado: "entregado" },
  { id: "#ORD-1039", cliente: "Roberto Silva", fecha: "28/08/2026", items: 1, total: 24.9, estado: "cancelado" },
];

const estadoVariant: Record<EstadoPedido, "warning" | "secondary" | "success" | "destructive"> = {
  procesando: "warning",
  enviado: "secondary",
  entregado: "success",
  cancelado: "destructive",
};

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);

  function cambiarEstado(id: string, estado: EstadoPedido) {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Pedidos de la tienda</h1>
        <p className="text-sm text-muted-foreground">Gestiona el estado de los pedidos de clientes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="text-sm font-medium">{pedido.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{pedido.cliente}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{pedido.fecha}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{pedido.items}</TableCell>
                  <TableCell className="text-sm font-medium">{formatCurrency(pedido.total)}</TableCell>
                  <TableCell>
                    <Select
                      value={pedido.estado}
                      onValueChange={(value) => cambiarEstado(pedido.id, value as EstadoPedido)}
                    >
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue>
                          <Badge variant={estadoVariant[pedido.estado]}>{pedido.estado}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="procesando">Procesando</SelectItem>
                        <SelectItem value="enviado">Enviado</SelectItem>
                        <SelectItem value="entregado">Entregado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver detalle">
                      <Eye className="h-4 w-4" />
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
