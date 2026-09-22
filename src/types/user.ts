export type UserRole = "cliente" | "admin" | "estilista";

export interface User {
  id: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
  rol: UserRole;
}
