import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatAppointment, DBAppointment } from "@/lib/db";
import {
  findConflictingAppointment,
  getServiceDurationByName,
} from "@/lib/booking-availability";

// GET /api/citas - Listar citas (para panel admin y disponibilidad de agenda)
export async function GET() {
  try {
    const rawAppointments = await prisma.appointment.findMany({
      orderBy: { creadoEn: "desc" },
    });
    const citas = rawAppointments.map(formatAppointment);
    return NextResponse.json({ success: true, citas });
  } catch (error) {
    console.error("Error in GET /api/citas:", error);
    return NextResponse.json({ error: "Error al obtener citas" }, { status: 500 });
  }
}

// POST /api/citas - Crear nueva cita con validación anti-solapamiento de agendas
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clienteNombre,
      clienteTelefono,
      servicioNombre,
      servicioPrecio,
      duracionMin,
      profesionalNombre,
      fecha,
      hora,
      notas,
      metodoPago,
      pagoMovil,
    } = body;

    if (!clienteNombre || !clienteTelefono || !servicioNombre || !profesionalNombre || !fecha || !hora) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para agendar la cita." },
        { status: 400 }
      );
    }

    if (metodoPago === "pagomovil") {
      if (!pagoMovil?.banco || !pagoMovil?.referencia || !pagoMovil?.telefonoEmisor) {
        return NextResponse.json(
          { error: "Para abonar la reserva por Pago Móvil debes indicar el banco, número de referencia y teléfono emisor." },
          { status: 400 }
        );
      }
    }

    const duracionFinal = getServiceDurationByName(servicioNombre, Number(duracionMin));

    // Cálculo del 20% de reserva y 80% restante en salón
    const precioTotal = Number(servicioPrecio) || 0;
    const montoReserva = Math.round(precioTotal * 0.20 * 100) / 100;
    const montoRestante = Math.round((precioTotal - montoReserva) * 100) / 100;

    // Obtener citas existentes en esa fecha con ese profesional para validar solapamiento
    const existingRaw = await prisma.appointment.findMany({
      where: {
        fecha,
        profesionalNombre,
        estado: { not: "cancelada" },
      },
    });
    const existingAppointments = existingRaw.map(formatAppointment);

    // Verificación de solapamiento en el servidor
    const conflicto = findConflictingAppointment({
      slot: hora,
      serviceDurationMin: duracionFinal,
      targetDate: fecha,
      professionalName: profesionalNombre,
      existingAppointments,
    });

    if (conflicto) {
      const motivo =
        "motivo" in conflicto
          ? conflicto.motivo
          : `El especialista ${profesionalNombre} ya tiene una cita reservada que coincide con ese horario. Por favor selecciona otra hora.`;

      return NextResponse.json(
        { error: motivo, conflicto: true },
        { status: 409 }
      );
    }

    const id = `cita-${Date.now()}`;
    const created = await prisma.appointment.create({
      data: {
        id,
        clienteNombre: clienteNombre.trim(),
        clienteTelefono: clienteTelefono.trim(),
        servicioNombre,
        servicioPrecio: precioTotal,
        montoReserva,
        montoRestante,
        metodoPago: metodoPago === "pagomovil" ? "pagomovil" : "efectivo",
        pagoMovilBanco: metodoPago === "pagomovil" ? (pagoMovil?.banco || null) : null,
        pagoMovilReferencia: metodoPago === "pagomovil" ? (pagoMovil?.referencia || null) : null,
        pagoMovilTelefonoEmisor: metodoPago === "pagomovil" ? (pagoMovil?.telefonoEmisor || null) : null,
        notificadoWhatsApp: false,
        duracionMin: duracionFinal,
        profesionalNombre,
        fecha,
        hora,
        notas: notas ? notas.trim() : null,
        estado: "pendiente",
      },
    });

    const nuevaCita = formatAppointment(created);
    return NextResponse.json({ success: true, cita: nuevaCita });
  } catch (error) {
    console.error("Error in POST /api/citas:", error);
    return NextResponse.json({ error: "Error al guardar la cita." }, { status: 500 });
  }
}

// PATCH /api/citas - Cambiar estado de la cita o marcar notificado por WhatsApp
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, estado, notificadoWhatsApp, motivoCancelacion } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (estado !== undefined) dataToUpdate.estado = estado;
    if (motivoCancelacion !== undefined) dataToUpdate.motivoCancelacion = motivoCancelacion;
    if (notificadoWhatsApp !== undefined) dataToUpdate.notificadoWhatsApp = notificadoWhatsApp;

    const updated = await prisma.appointment.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, cita: formatAppointment(updated) });
  } catch (error) {
    console.error("Error in PATCH /api/citas:", error);
    return NextResponse.json({ error: "Error al actualizar cita" }, { status: 500 });
  }
}
