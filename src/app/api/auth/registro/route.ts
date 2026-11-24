import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/validation";

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

    // Validación estricta de contraseña (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo)
    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      return NextResponse.json(
        { error: passCheck.error || "La contraseña no cumple con los requisitos mínimos de seguridad." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Comprobar si ya existe un usuario con ese correo
    const existing = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: "insensitive" } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una cuenta registrada con este correo electrónico." },
        { status: 409 }
      );
    }

    // Hasheo criptográfico unidireccional con bcrypt (salt rounds = 10)
    const hashedPassword = bcrypt.hashSync(password.trim(), 10);
    const userId = `u-${Date.now()}`;
    const username = cleanEmail.split("@")[0];

    const newUser = await prisma.user.create({
      data: {
        id: userId,
        username,
        nombre: nombre.trim(),
        email: cleanEmail,
        password: hashedPassword,
        rol: "cliente",
        telefono: telefono ? telefono.trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
        telefono: newUser.telefono || undefined,
      },
    });
  } catch (error) {
    console.error("Error in registration route:", error);
    return NextResponse.json(
      { error: "Error en el servidor al procesar el registro." },
      { status: 500 }
    );
  }
}
