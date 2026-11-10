export type UserRole = "cliente" | "admin" | "estilista" | "empleado";

export interface User {
  id: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
  rol: UserRole;
  telefono?: string;
}
