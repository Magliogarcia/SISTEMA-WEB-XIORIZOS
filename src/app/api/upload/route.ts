import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Carpeta destino exclusiva para fotos de productos
    const uploadDir = path.join(process.cwd(), "public", "images", "productos");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Nombre base limpio sin extensión
    const baseName = path.parse(file.name).name.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const uniqueFileName = `${Date.now()}_${baseName}.webp`;
    const destPath = path.join(uploadDir, uniqueFileName);

    // Convertir y optimizar con sharp a formato WebP moderno
    try {
      await sharp(inputBuffer)
        .rotate() // Respeta la orientación EXIF de fotos tomadas con móviles
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(destPath);
    } catch (sharpError) {
      console.warn("Fallo conversión sharp, guardando buffer original como fallback:", sharpError);
      fs.writeFileSync(destPath, inputBuffer);
    }

    const publicUrl = `/images/productos/${uniqueFileName}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json({ error: "Error interno al procesar la imagen" }, { status: 500 });
  }
}
