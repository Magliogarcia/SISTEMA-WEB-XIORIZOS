import { mockServices } from "@/lib/mock-data";
import type { DBAppointment } from "@/lib/db";

// Horario oficial del salón Xiorizos:
// 8:30 a.m. a 5:30 p.m. (Martes a Sábado)
// Receso de almuerzo del personal: 12:00 m. a 12:30 p.m.
export const SALON_OPENING_MINUTES = 8 * 60 + 30; // 510 minutos (08:30)
export const SALON_CLOSING_MINUTES = 17 * 60 + 30; // 1050 minutos (17:30)
export const LUNCH_BREAK_START_MINUTES = 12 * 60; // 720 minutos (12:00)
export const LUNCH_BREAK_END_MINUTES = 12 * 60 + 30; // 750 minutos (12:30)

/**
 * Convierte una hora en formato "HH:MM" a minutos transcurridos desde medianoche.
 * Ej: "08:30" -> 510, "10:00" -> 600, "17:30" -> 1050
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  const h = Number(parts[0]) || 0;
  const m = Number(parts[1]) || 0;
  return h * 60 + m;
}

/**
 * Convierte minutos desde medianoche a formato "HH:MM".
 * Ej: 510 -> "08:30", 600 -> "10:00"
 */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Normaliza nombres quitando tildes y espacios para comparación robusta.
 */
export function normalizeName(name: string): string {
  return (name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Obtiene la duración en minutos de un servicio a partir de su nombre o duración explícita.
 */
export function getServiceDurationByName(serviceName: string, explicitDuracion?: number): number {
  if (explicitDuracion && explicitDuracion > 0) return explicitDuracion;
  if (!serviceName) return 60;

  const clean = normalizeName(serviceName);
  const direct = mockServices.find((s) => normalizeName(s.nombre) === clean);
  if (direct) return direct.duracionMin;

  // Búsqueda por palabras clave del catálogo Xiorizos
  if (clean.includes("curly color") || clean.includes("color")) return 180;
  if (clean.includes("full curl")) return 90;
  if (clean.includes("men")) return 50;
  if (clean.includes("boy") || clean.includes("flash") || clean.includes("refresh") || clean.includes("una") || clean.includes("unas")) {
    return 45;
  }
  if (
    clean.includes("renacer") ||
    clean.includes("crecimiento") ||
    clean.includes("girl") ||
    clean.includes("definici")
  ) {
    return 60;
  }

  return 60; // Duración estándar de respaldo
}

/**
 * Compara si dos fechas corresponden al mismo día del calendario de manera agnóstica a timezone.
 */
export function areDatesOnSameDay(date1: Date | string, date2: Date | string): boolean {
  if (!date1 || !date2) return false;
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;

  // 1. Comparación por componentes locales (año, mes, día)
  if (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  ) {
    return true;
  }

  // 2. Comparación por componentes UTC (por si se almacenó en ISO UTC)
  if (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  ) {
    return true;
  }

  // 3. Comparación por substring YYYY-MM-DD
  const s1 = typeof date1 === "string" ? date1.slice(0, 10) : d1.toISOString().slice(0, 10);
  const s2 = typeof date2 === "string" ? date2.slice(0, 10) : d2.toISOString().slice(0, 10);
  if (s1 === s2) return true;

  return false;
}

export interface ConflictCheckParams {
  slot: string;
  serviceDurationMin: number;
  targetDate: Date | string;
  professionalName: string;
  existingAppointments: DBAppointment[];
}

/**
 * Encuentra si existe una cita existente que colisione con el intervalo solicitado.
 * Considera:
 * 1. Mismo especialista (ignorando tildes y mayúsculas).
 * 2. Mismo día de calendario.
 * 3. Solo citas activas (las "cancelada" no bloquean el horario).
 * 4. Superposición estricta de intervalos de tiempo [inicio, fin).
 * 5. Límite del horario de cierre del salón (5:30 p.m.).
 */
export function findConflictingAppointment({
  slot,
  serviceDurationMin,
  targetDate,
  professionalName,
  existingAppointments,
}: ConflictCheckParams): DBAppointment | { id: string; motivo: string } | null {
  if (!slot || !targetDate || !professionalName || !existingAppointments) return null;

  const candidateStart = timeToMinutes(slot);
  const candidateDuration = serviceDurationMin > 0 ? serviceDurationMin : 60;
  const candidateEnd = candidateStart + candidateDuration;

  // Si el servicio termina después de la hora de cierre del salón (17:30 = 1050 min)
  if (candidateEnd > SALON_CLOSING_MINUTES) {
    return {
      id: "cierre-salon",
      motivo: `El servicio tiene una duración de ${candidateDuration} min y terminaría a las ${minutesToTime(candidateEnd)}, después de la hora de cierre del salón (5:30 p.m.).`,
    };
  }

  // Receso oficial de almuerzo del personal (12:00 m. a 12:30 p.m.)
  if (candidateStart < LUNCH_BREAK_END_MINUTES && candidateEnd > LUNCH_BREAK_START_MINUTES) {
    return {
      id: "almuerzo-personal",
      motivo: "El turno coincide con el receso de almuerzo del personal (12:00 m. a 12:30 p.m.).",
    };
  }

  const normProf = normalizeName(professionalName);

  for (const cita of existingAppointments) {
    // Si la cita fue cancelada, el turno está libre
    if (cita.estado === "cancelada") continue;

    // Verificar si es con el mismo especialista
    if (normalizeName(cita.profesionalNombre) !== normProf) continue;

    // Verificar si es el mismo día
    if (!areDatesOnSameDay(cita.fecha, targetDate)) continue;

    const appStart = timeToMinutes(cita.hora);
    const appDuration = getServiceDurationByName(cita.servicioNombre, cita.duracionMin);
    const appEnd = appStart + appDuration;

    // Dos intervalos [s1, e1) y [s2, e2) colisionan si s1 < e2 && e1 > s2
    if (candidateStart < appEnd && candidateEnd > appStart) {
      return cita;
    }
  }

  return null;
}

/**
 * Retorna true si el horario no está disponible por colisión con otra cita o fuera de horario.
 */
export function isSlotConflicting(params: ConflictCheckParams): boolean {
  return !!findConflictingAppointment(params);
}

