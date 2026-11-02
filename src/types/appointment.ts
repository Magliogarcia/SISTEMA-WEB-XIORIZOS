export interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  categoria: string;
  items?: string[];
  nota?: string;
}

export interface Professional {
  id: string;
  nombre: string;
  especialidad: string;
  avatarUrl?: string;
  serviciosIds: string[];
}

export type AppointmentStatus = "pendiente" | "confirmada" | "reprogramada" | "cancelada" | "completada";

export interface Appointment {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  servicio: Service;
  profesional: Professional;
  fecha: string;
  hora: string;
  estado: AppointmentStatus;
  notas?: string;
}
