import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    const identifier = (username || email || "").trim().toLowerCase();
    const pass = (password || "").trim();

    if (!identifier || !pass) {
      return NextResponse.json(
        { error: "Por favor ingresa usuario/correo y contraseña." },
        { status: 400 }
      );
    }

    // Comprobación de usuario directamente en PostgreSQL
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: identifier, mode: "insensitive" } },
          { email: { equals: identifier, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales incorrectas. Verifica tu usuario o contraseña." },
        { status: 401 }
      );
    }

    // Verificación criptográfica con bcrypt (con retrocompatibilidad)
    let isMatch = false;
    try {
      isMatch = bcrypt.compareSync(pass, user.password) || user.password === pass;
    } catch {
      isMatch = user.password === pass;
    }

    if (!isMatch) {
      return NextResponse.json(
        { error: "Credenciales incorrectas. Verifica tu usuario o contraseña." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono || undefined,
      },
    });

    // Guardar cookie de sesión para verificación de seguridad instantánea en Middleware
    response.cookies.set("xiorizos_role", user.rol, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json({ error: "Error en el servidor al iniciar sesión." }, { status: 500 });
  }
}
