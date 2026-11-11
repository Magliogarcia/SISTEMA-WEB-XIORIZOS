import { NextResponse } from "next/server";
import { readDB, writeDB, DBOrder } from "@/lib/db";

// GET /api/pedidos - Listar pedidos (para admin)
export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json({ success: true, pedidos: db.orders });
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

    const db = readDB();

    // Descontar stock real de cada producto comprado
    if (Array.isArray(items)) {
      items.forEach((item: any) => {
        const prodId = item.productId || item.product?.id || item.id;
        const prod = db.products.find((p) => p.id === prodId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (item.cantidad || 1));
        }
      });
    }

    const nuevoPedido: DBOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim(),
      clienteEmail: clienteEmail.trim(),
      direccion: direccion.trim(),
      items,
      total: Number(total) || 0,
      metodoPago: metodoPago === "pagomovil" ? "pagomovil" : "efectivo",
      pagoMovil: metodoPago === "pagomovil" ? pagoMovil : undefined,
      estado: "pendiente_verificacion",
      creadoEn: new Date().toISOString(),
    };

    db.orders.unshift(nuevoPedido);
    writeDB(db);

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
    const { id, estado, notificadoWhatsApp } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const db = readDB();
    const pedido = db.orders.find((p) => p.id === id);
    if (!pedido) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    if (estado !== undefined) {
      // Si se cancela el pedido, restablecer el stock a los productos
      if (estado === "cancelado" && pedido.estado !== "cancelado") {
        if (Array.isArray(pedido.items)) {
          pedido.items.forEach((item: any) => {
            const prodId = item.productId || item.product?.id || item.id;
            const prod = db.products.find((p) => p.id === prodId);
            if (prod) {
              prod.stock += (item.cantidad || 1);
            }
          });
        }
      }
      pedido.estado = estado;
    }
    if (notificadoWhatsApp !== undefined) {
      pedido.notificadoWhatsApp = notificadoWhatsApp;
    }
    writeDB(db);

    return NextResponse.json({ success: true, pedido });
  } catch (error) {
    console.error("Error in PATCH /api/pedidos:", error);
    return NextResponse.json({ error: "Error al actualizar estado del pedido" }, { status: 500 });
  }
}

