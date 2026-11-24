import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatProduct, DBProduct } from "@/lib/db";

// GET /api/productos - Listar productos
export async function GET() {
  try {
    const rawProducts = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });
    const productos = rawProducts.map(formatProduct);
    return NextResponse.json({ success: true, productos });
  } catch (error) {
    console.error("Error in GET /api/productos:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

// POST /api/productos - Crear nuevo producto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, descripcion, precio, costo, imagenUrl, categoria, marca, stock } = body;

    if (!nombre || !precio) {
      return NextResponse.json({ error: "Nombre y precio son obligatorios." }, { status: 400 });
    }

    const numPrecio = Number(precio);
    const numCosto = costo !== undefined && costo !== "" ? Number(costo) : Math.round(numPrecio * 0.55 * 100) / 100;
    const prodId = `prod-${Date.now()}`;

    const created = await prisma.product.create({
      data: {
        id: prodId,
        nombre: nombre.trim(),
        descripcion: (descripcion || "").trim(),
        precio: numPrecio,
        costo: numCosto,
        imagenUrl: (imagenUrl || "/images/crema_de_peinar_etniker.webp").trim(),
        categoria: (categoria || "General").trim(),
        marca: (marca || "Xiorizos Care").trim(),
        stock: Number(stock) || 10,
        rating: 5.0,
        resenasCount: 1,
      },
    });

    return NextResponse.json({ success: true, producto: formatProduct(created) });
  } catch (error) {
    console.error("Error in POST /api/productos:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}

// PUT /api/productos - Modificar producto existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombre, descripcion, precio, costo, imagenUrl, categoria, marca, stock } = body;

    if (!id) {
      return NextResponse.json({ error: "ID del producto requerido" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (nombre !== undefined) dataToUpdate.nombre = String(nombre).trim();
    if (descripcion !== undefined) dataToUpdate.descripcion = String(descripcion).trim();
    if (precio !== undefined) dataToUpdate.precio = Number(precio);
    if (costo !== undefined && costo !== "") dataToUpdate.costo = Number(costo);
    if (imagenUrl !== undefined) dataToUpdate.imagenUrl = String(imagenUrl).trim();
    if (categoria !== undefined) dataToUpdate.categoria = String(categoria).trim();
    if (marca !== undefined) dataToUpdate.marca = String(marca).trim();
    if (stock !== undefined) dataToUpdate.stock = Number(stock);

    const updated = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, producto: formatProduct(updated) });
  } catch (error) {
    console.error("Error in PUT /api/productos:", error);
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

// DELETE /api/productos - Eliminar producto
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID del producto requerido" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error in DELETE /api/productos:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
