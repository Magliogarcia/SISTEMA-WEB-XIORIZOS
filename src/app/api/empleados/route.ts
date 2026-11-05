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
    const { nombre, telefono, cargo, especialidad, avatarUrl, serviciosIds, activo } = body;

    if (!nombre || !cargo) {
      return NextResponse.json({ error: "Nombre y cargo son requeridos" }, { status: 400 });
    }

    const db = readDB();

    const newEmployee: DBEmployee = {
      id: `emp-${Date.now()}`,
      nombre,
      telefono: telefono || "",
      cargo,
      especialidad: especialidad || "",
      avatarUrl: avatarUrl || "/images/fundadora_xioilin_guzman.webp",
      serviciosIds: serviciosIds || ["s1", "s2"],
      activo: activo !== false,
      creadoEn: new Date().toISOString(),
    };

    db.employees = [newEmployee, ...(db.employees || [])];
    writeDB(db);

    return NextResponse.json({ success: true, employee: newEmployee });
  } catch (error) {
    console.error("Error in POST /api/empleados:", error);
    return NextResponse.json({ error: "Error al crear empleado" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombre, telefono, cargo, especialidad, avatarUrl, serviciosIds, activo, motivoInoperativo } = body;

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

