import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { formatEmployee, DBEmployee } from "@/lib/db";
import { validatePassword } from "@/lib/validation";

export async function GET() {
  try {
    const rawEmployees = await prisma.employee.findMany({
      orderBy: { creadoEn: "asc" },
    });
    const employees = rawEmployees.map(formatEmployee);
    return NextResponse.json({ success: true, employees });
  } catch (error) {
    console.error("Error in GET /api/empleados:", error);
    return NextResponse.json({ error: "Error al obtener empleados" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, telefono, cargo, especialidad, avatarUrl, serviciosIds, activo, username, password } = body;

    if (!nombre || !cargo) {
      return NextResponse.json({ error: "Nombre y cargo son requeridos" }, { status: 400 });
    }

    if (!username || !username.trim()) {
      return NextResponse.json({ error: "El nombre de usuario es requerido para el acceso del empleado" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "La contraseña es requerida para el acceso del empleado" }, { status: 400 });
    }

    // Validación de contraseña: mínimo 8 caracteres, minúscula, mayúscula, número y símbolo
    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      return NextResponse.json(
        {
          error:
            passCheck.error ||
            "La contraseña debe tener al menos 8 caracteres e incluir una letra minúscula, una mayúscula, un número y un símbolo especial (ej. Xiorizos28$).",
        },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim();

    // Validar nombre de usuario duplicado
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: `${cleanUsername}@xiorizos.com` },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: `El nombre de usuario "${cleanUsername}" ya existe en el sistema. Elige otro.` },
        { status: 400 }
      );
    }

    const empId = `emp-${Date.now()}`;
    const newEmployee = await prisma.employee.create({
      data: {
        id: empId,
        nombre: nombre.trim(),
        telefono: telefono || "",
        cargo: cargo.trim(),
        especialidad: especialidad || "",
        avatarUrl: avatarUrl || "/images/fundadora_xioilin_guzman.webp",
        serviciosIds: serviciosIds || ["s1", "s2"],
        activo: activo !== false,
      },
    });

    const hashedPassword = bcrypt.hashSync(password.trim(), 10);
    const newUser = await prisma.user.create({
      data: {
        id: `u-${empId}`,
        username: cleanUsername,
        nombre: nombre.trim(),
        email: `${cleanUsername}@xiorizos.com`,
        password: hashedPassword,
        rol: "empleado",
        telefono: telefono || null,
      },
    });

    return NextResponse.json({
      success: true,
      employee: formatEmployee(newEmployee),
      user: {
        id: newUser.id,
        username: newUser.username,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/empleados:", error);
    return NextResponse.json({ error: "Error al crear empleado" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      nombre,
      telefono,
      cargo,
      especialidad,
      avatarUrl,
      serviciosIds,
      activo,
      tipoInoperatividad,
      fechaInicioInoperatividad,
      fechaFinInoperatividad,
      fechasAusente,
      motivoInoperativo,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de empleado requerido" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (telefono !== undefined) dataToUpdate.telefono = telefono;
    if (cargo !== undefined) dataToUpdate.cargo = cargo;
    if (especialidad !== undefined) dataToUpdate.especialidad = especialidad;
    if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl;
    if (serviciosIds !== undefined) dataToUpdate.serviciosIds = serviciosIds;
    if (activo !== undefined) dataToUpdate.activo = activo;
    if (tipoInoperatividad !== undefined) dataToUpdate.tipoInoperatividad = tipoInoperatividad;
    if (fechaInicioInoperatividad !== undefined) dataToUpdate.fechaInicioInoperatividad = fechaInicioInoperatividad;
    if (fechaFinInoperatividad !== undefined) dataToUpdate.fechaFinInoperatividad = fechaFinInoperatividad;
    if (fechasAusente !== undefined) dataToUpdate.fechasAusente = fechasAusente;
    if (motivoInoperativo !== undefined) dataToUpdate.motivoInoperativo = motivoInoperativo;

    const updated = await prisma.employee.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, employee: formatEmployee(updated) });
  } catch (error) {
    console.error("Error in PUT /api/empleados:", error);
    return NextResponse.json({ error: "Error al actualizar empleado" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de empleado requerido" }, { status: 400 });
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/empleados:", error);
    return NextResponse.json({ error: "Error al eliminar empleado" }, { status: 500 });
  }
}
