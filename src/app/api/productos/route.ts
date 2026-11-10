import { NextResponse } from "next/server";
import { readDB, writeDB, DBProduct } from "@/lib/db";

// GET /api/productos - Listar productos
export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json({ success: true, productos: db.products });
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

    const db = readDB();
    const nuevoProducto: DBProduct = {
      id: `prod-${Date.now()}`,
      nombre: nombre.trim(),
      descripcion: (descripcion || "").trim(),
      precio: numPrecio,
      costo: numCosto,
      imagenUrl: (imagenUrl || "/images/crema_de_peinar_etniker.webp").trim(),
      categoria: (categoria || "General").trim(),
      marca: (marca || "Xiorizos").trim(),
      stock: Number(stock) || 10,
      rating: 5.0,
      reseñasCount: 1,
    };

    db.products.unshift(nuevoProducto);
    writeDB(db);

    return NextResponse.json({ success: true, producto: nuevoProducto });
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

    const db = readDB();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    db.products[index] = {
      ...db.products[index],
      nombre: nombre !== undefined ? String(nombre).trim() : db.products[index].nombre,
      descripcion: descripcion !== undefined ? String(descripcion).trim() : db.products[index].descripcion,
      precio: precio !== undefined ? Number(precio) : db.products[index].precio,
      costo: costo !== undefined && costo !== "" ? Number(costo) : db.products[index].costo,
      imagenUrl: imagenUrl !== undefined ? String(imagenUrl).trim() : db.products[index].imagenUrl,
      categoria: categoria !== undefined ? String(categoria).trim() : db.products[index].categoria,
      marca: marca !== undefined ? String(marca).trim() : db.products[index].marca,
      stock: stock !== undefined ? Number(stock) : db.products[index].stock,
    };

    writeDB(db);
    return NextResponse.json({ success: true, producto: db.products[index] });
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

    const db = readDB();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);

    if (db.products.length === initialLen) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    writeDB(db);
    return NextResponse.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error in DELETE /api/productos:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}

