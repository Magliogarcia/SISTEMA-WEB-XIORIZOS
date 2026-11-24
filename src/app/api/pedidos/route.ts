import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatOrder, DBOrder } from "@/lib/db";

// GET /api/pedidos - Listar pedidos (para admin)
export async function GET() {
  try {
    const rawOrders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { creadoEn: "desc" },
    });
    const pedidos = rawOrders.map(formatOrder);
    return NextResponse.json({ success: true, pedidos });
  } catch (error) {
    console.error("Error in GET /api/pedidos:", error);
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 });
  }
}

// POST /api/pedidos - Crear nuevo pedido desde checkout
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clienteNombre, clienteTelefono, clienteEmail, direccion, items, total, metodoPago, pagoMovil } = body;

    if (!clienteNombre || !clienteTelefono || !clienteEmail || !direccion || !items || !items.length) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para procesar el pedido." },
        { status: 400 }
      );
    }

    if (metodoPago === "pagomovil") {
      if (!pagoMovil?.banco || !pagoMovil?.referencia || !pagoMovil?.telefonoEmisor) {
        return NextResponse.json(
          { error: "Para Pago Móvil debes indicar el banco, número de referencia y teléfono emisor." },
          { status: 400 }
        );
      }
    }

    // Descontar stock real en PostgreSQL de cada producto comprado
    if (Array.isArray(items)) {
      for (const item of items) {
        const prodId = item.productId || item.product?.id || item.id;
        if (prodId) {
          await prisma.product.update({
            where: { id: prodId },
            data: { stock: { decrement: Number(item.cantidad || 1) } },
          }).catch(() => {});
        }
      }
    }

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = await prisma.order.create({
      data: {
        id: orderId,
        clienteNombre: clienteNombre.trim(),
        clienteTelefono: clienteTelefono.trim(),
        clienteEmail: clienteEmail.trim(),
        direccion: direccion.trim(),
        total: Number(total) || 0,
        metodoPago: metodoPago === "pagomovil" ? "pagomovil" : "efectivo",
        pagoMovilBanco: metodoPago === "pagomovil" ? (pagoMovil?.banco || null) : null,
        pagoMovilReferencia: metodoPago === "pagomovil" ? (pagoMovil?.referencia || null) : null,
        pagoMovilTelefonoEmisor: metodoPago === "pagomovil" ? (pagoMovil?.telefonoEmisor || null) : null,
        estado: "pendiente_verificacion",
        notificadoWhatsApp: false,
        items: {
          create: (items || []).map((it: any) => ({
            productId: it.productId || it.product?.id || it.id,
            nombre: it.nombre,
            precio: Number(it.precio || 0),
            cantidad: Number(it.cantidad || 1),
            imagenUrl: it.imagenUrl || null,
          })),
        },
      },
      include: { items: true },
    });

    const nuevoPedido = formatOrder(created);
    return NextResponse.json({ success: true, pedido: nuevoPedido });
  } catch (error) {
    console.error("Error in POST /api/pedidos:", error);
    return NextResponse.json({ error: "Error al crear el pedido." }, { status: 500 });
  }
}

// PATCH /api/pedidos - Actualizar estado del pedido o marcar notificado por WhatsApp
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, estado, notificadoWhatsApp, motivoCancelacion } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const current = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // Si se cancela el pedido, restablecer el stock a los productos
    if (estado !== undefined) {
      if (estado === "cancelado" && current.estado !== "cancelado") {
        for (const item of current.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.cantidad } },
          }).catch(() => {});
        }
      } else if (current.estado === "cancelado" && estado !== "cancelado") {
        for (const item of current.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.cantidad } },
          }).catch(() => {});
        }
      }
    }

    const dataToUpdate: any = {};
    if (estado !== undefined) dataToUpdate.estado = estado;
    if (motivoCancelacion !== undefined) dataToUpdate.motivoCancelacion = motivoCancelacion;
    if (notificadoWhatsApp !== undefined) dataToUpdate.notificadoWhatsApp = notificadoWhatsApp;

    const updated = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
      include: { items: true },
    });

    return NextResponse.json({ success: true, pedido: formatOrder(updated) });
  } catch (error) {
    console.error("Error in PATCH /api/pedidos:", error);
    return NextResponse.json({ error: "Error al actualizar estado del pedido" }, { status: 500 });
  }
}
