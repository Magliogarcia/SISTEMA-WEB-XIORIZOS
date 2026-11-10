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
          { error: "Para Pago Móvil debes indicar el banco, número de referencia (8 dígitos) y teléfono emisor." },
          { status: 400 }
        );
      }
    }

    const db = readDB();
    const nuevoPedido: DBOrder = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
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

// PATCH /api/pedidos - Actualizar estado del pedido (ej. Verificar Pago Móvil)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, estado } = body;

    if (!id || !estado) {
      return NextResponse.json({ error: "ID y estado son requeridos" }, { status: 400 });
    }

    const db = readDB();
    const pedido = db.orders.find((p) => p.id === id);
    if (!pedido) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    pedido.estado = estado;
    writeDB(db);

    return NextResponse.json({ success: true, pedido });
  } catch (error) {
    console.error("Error in PATCH /api/pedidos:", error);
    return NextResponse.json({ error: "Error al actualizar estado del pedido" }, { status: 500 });
  }
}

