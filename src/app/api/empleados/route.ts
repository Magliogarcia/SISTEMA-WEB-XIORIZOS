import { NextResponse } from "next/server";
import { readDB, writeDB, DBEmployee } from "@/lib/db";

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json({ success: true, employees: db.employees || [] });
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

    // Validación de contraseña: minúscula, mayúscula, número y símbolo
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    if (password.length < 6 || !hasLower || !hasUpper || !hasNumber || !hasSymbol) {
      return NextResponse.json(
        {
          error:
            "La contraseña debe tener al menos 6 caracteres e incluir una letra minúscula, una mayúscula, un número y un símbolo especial (ej. Xiorizos28$).",
        },
        { status: 400 }
      );
    }

    const db = readDB();
    const cleanUsername = username.toLowerCase().trim();

    // Validar nombre de usuario duplicado
    if (db.users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return NextResponse.json(
        { error: `El nombre de usuario "${cleanUsername}" ya existe en el sistema. Elige otro.` },
        { status: 400 }
      );
    }

    const newEmployee: DBEmployee = {
      id: `emp-${Date.now()}`,
      nombre: nombre.trim(),
      telefono: telefono || "",
      cargo: cargo.trim(),
      especialidad: especialidad || "",
      avatarUrl: avatarUrl || "/images/fundadora_xioilin_guzman.webp",
      serviciosIds: serviciosIds || ["s1", "s2"],
      activo: activo !== false,
      creadoEn: new Date().toISOString(),
    };

    const newUser = {
      id: `u-${newEmployee.id}`,
      username: cleanUsername,
      nombre: nombre.trim(),
      email: `${cleanUsername}@xiorizos.com`,
      password: password,
      rol: "empleado" as const,
      telefono: telefono || "",
      creadoEn: new Date().toISOString(),
    };

    db.employees = [newEmployee, ...(db.employees || [])];
    db.users = [newUser, ...(db.users || [])];
    writeDB(db);

    return NextResponse.json({ success: true, employee: newEmployee, user: newUser });
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

    const db = readDB();
    const index = db.employees.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    const current = db.employees[index];
    const updated: DBEmployee = {
      ...current,
      nombre: nombre !== undefined ? nombre : current.nombre,
      telefono: telefono !== undefined ? telefono : current.telefono,
      cargo: cargo !== undefined ? cargo : current.cargo,
      especialidad: especialidad !== undefined ? especialidad : current.especialidad,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : current.avatarUrl,
      serviciosIds: serviciosIds !== undefined ? serviciosIds : current.serviciosIds,
      activo: activo !== undefined ? activo : current.activo,
      tipoInoperatividad: tipoInoperatividad !== undefined ? tipoInoperatividad : current.tipoInoperatividad,
      fechaInicioInoperatividad: fechaInicioInoperatividad !== undefined ? fechaInicioInoperatividad : current.fechaInicioInoperatividad,
      fechaFinInoperatividad: fechaFinInoperatividad !== undefined ? fechaFinInoperatividad : current.fechaFinInoperatividad,
      fechasAusente: fechasAusente !== undefined ? fechasAusente : current.fechasAusente,
      motivoInoperativo: motivoInoperativo !== undefined ? motivoInoperativo : current.motivoInoperativo,
    };

    db.employees[index] = updated;
    writeDB(db);

    return NextResponse.json({ success: true, employee: updated });
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

    const db = readDB();
    db.employees = db.employees.filter((e) => e.id !== id);
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/empleados:", error);
    return NextResponse.json({ error: "Error al eliminar empleado" }, { status: 500 });
  }
}

