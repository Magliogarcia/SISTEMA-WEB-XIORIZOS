import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

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

    const db = readDB();

    // Comprobación de usuario (por username o por email)
    const user = db.users.find(
      (u) =>
        (u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier) &&
        u.password === pass
    );

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales incorrectas. Verifica tu usuario o contraseña." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
      },
    });
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json({ error: "Error en el servidor al iniciar sesión." }, { status: 500 });
  }
}

