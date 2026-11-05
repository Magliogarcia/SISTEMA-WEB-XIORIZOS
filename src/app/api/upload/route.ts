import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Carpeta destino exclusiva para fotos de productos
    const uploadDir = path.join(process.cwd(), "public", "images", "productos");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Nombre de archivo sanitizado
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
    const uniqueFileName = `${Date.now()}_${cleanName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/productos/${uniqueFileName}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json({ error: "Error interno al guardar la imagen" }, { status: 500 });
  }
}

