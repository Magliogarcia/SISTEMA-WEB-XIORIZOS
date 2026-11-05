import { NextResponse } from "next/server";
import { readDB, writeDB, DBUser } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, email, password, telefono } = body;

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();

    // Comprobar si ya existe un usuario con ese correo
    const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una cuenta registrada con este correo electrónico." },
        { status: 409 }
      );
    }

    const newUser: DBUser = {
      id: `u-${Date.now()}`,
      username: cleanEmail.split("@")[0],
      nombre: nombre.trim(),
      email: cleanEmail,
      password: password.trim(),
      rol: "cliente",
      telefono: telefono ? telefono.trim() : undefined,
      creadoEn: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDB(db);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
        telefono: newUser.telefono,
      },
    });
  } catch (error) {
    console.error("Error in registro route:", error);
    return NextResponse.json({ error: "Error en el servidor al registrar cuenta." }, { status: 500 });
  }
}

