import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatService, DBService } from "@/lib/db";

// GET /api/servicios - Listar servicios
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    const [rawServices, rawEmployees] = await Promise.all([
      prisma.service.findMany({
        where: all ? undefined : { activo: true },
        orderBy: { id: "asc" },
      }),
      prisma.employee.findMany({
        select: { id: true, nombre: true, cargo: true, avatarUrl: true, serviciosIds: true },
      }),
    ]);

    const servicios = rawServices.map((s) => {
      const formatted = formatService(s);
      const especialistasIds = rawEmployees
        .filter((emp) => emp.serviciosIds && emp.serviciosIds.includes(s.id))
        .map((emp) => emp.id);
      return {
        ...formatted,
        especialistasIds,
      };
    });

    return NextResponse.json({ success: true, servicios });
  } catch (error) {
    console.error("Error in GET /api/servicios:", error);
    return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 });
  }
}

// POST /api/servicios - Crear nuevo servicio (solo admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, descripcion, precio, duracionMin, categoria, imagenUrl, items, activo, especialistasIds } = body;

    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: "El nombre del servicio es obligatorio." }, { status: 400 });
    }

    if (precio === undefined || precio === null || isNaN(Number(precio)) || Number(precio) < 0) {
      return NextResponse.json({ error: "El precio debe ser un número válido igual o mayor a 0." }, { status: 400 });
    }

    if (!Array.isArray(especialistasIds) || especialistasIds.length === 0) {
      return NextResponse.json(
        { error: "Es obligatorio asignar al menos un especialista a este servicio." },
        { status: 400 }
      );
    }

    const duracion = Number(duracionMin) > 0 ? Number(duracionMin) : 60;
    const servId = `serv-${Date.now()}`;

    const created = await prisma.service.create({
      data: {
        id: servId,
        nombre: nombre.trim(),
        descripcion: (descripcion || "").trim(),
        duracionMin: duracion,
        precio: Number(precio),
        categoria: (categoria || "General").trim(),
        imagenUrl: (imagenUrl || "/images/Full_curl.webp").trim(),
        items: Array.isArray(items) ? items.filter(Boolean) : [],
        activo: activo !== false,
      },
    });

    // Asignar el servicio a los especialistas seleccionados
    for (const empId of especialistasIds) {
      const emp = await prisma.employee.findUnique({ where: { id: empId } });
      if (emp && !emp.serviciosIds.includes(servId)) {
        await prisma.employee.update({
          where: { id: empId },
          data: { serviciosIds: [...emp.serviciosIds, servId] },
        });
      }
    }

    const resService = {
      ...formatService(created),
      especialistasIds,
    };

    return NextResponse.json({ success: true, servicio: resService });
  } catch (error) {
    console.error("Error in POST /api/servicios:", error);
    return NextResponse.json({ error: "Error al crear el servicio." }, { status: 500 });
  }
}

// PUT /api/servicios - Modificar servicio existente (solo admin)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nombre, descripcion, precio, duracionMin, categoria, imagenUrl, items, activo, especialistasIds } = body;

    if (!id) {
      return NextResponse.json({ error: "ID del servicio requerido" }, { status: 400 });
    }

    if (especialistasIds !== undefined) {
      if (!Array.isArray(especialistasIds) || especialistasIds.length === 0) {
        return NextResponse.json(
          { error: "Es obligatorio asignar al menos un especialista a este servicio." },
          { status: 400 }
        );
      }
    }

    const dataToUpdate: any = {};
    if (nombre !== undefined) dataToUpdate.nombre = String(nombre).trim();
    if (descripcion !== undefined) dataToUpdate.descripcion = String(descripcion).trim();
    if (precio !== undefined) dataToUpdate.precio = Number(precio);
    if (duracionMin !== undefined) dataToUpdate.duracionMin = Number(duracionMin);
    if (categoria !== undefined) dataToUpdate.categoria = String(categoria).trim();
    if (imagenUrl !== undefined) dataToUpdate.imagenUrl = String(imagenUrl).trim();
    if (items !== undefined && Array.isArray(items)) dataToUpdate.items = items.filter(Boolean);
    if (activo !== undefined) dataToUpdate.activo = Boolean(activo);

    const updated = await prisma.service.update({
      where: { id },
      data: dataToUpdate,
    });

    // Sincronizar especialistas si fueron proporcionados
    if (Array.isArray(especialistasIds)) {
      const allEmployees = await prisma.employee.findMany();
      for (const emp of allEmployees) {
        const shouldHave = especialistasIds.includes(emp.id);
        const currentlyHas = emp.serviciosIds && emp.serviciosIds.includes(id);

        if (shouldHave && !currentlyHas) {
          await prisma.employee.update({
            where: { id: emp.id },
            data: { serviciosIds: [...(emp.serviciosIds || []), id] },
          });
        } else if (!shouldHave && currentlyHas) {
          await prisma.employee.update({
            where: { id: emp.id },
            data: { serviciosIds: emp.serviciosIds.filter((sid) => sid !== id) },
          });
        }
      }
    }

    // Obtener lista final de especialistas
    const finalEmployees = await prisma.employee.findMany({
      where: { serviciosIds: { has: id } },
      select: { id: true },
    });

    const resService = {
      ...formatService(updated),
      especialistasIds: finalEmployees.map((e) => e.id),
    };

    return NextResponse.json({ success: true, servicio: resService });
  } catch (error) {
    console.error("Error in PUT /api/servicios:", error);
    return NextResponse.json({ error: "Error al actualizar servicio." }, { status: 500 });
  }
}

// DELETE /api/servicios - Eliminar servicio (solo admin)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID del servicio requerido" }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("Error in DELETE /api/servicios:", error);
    return NextResponse.json({ error: "Error al eliminar servicio." }, { status: 500 });
  }
}
