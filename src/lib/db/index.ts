import fs from "fs";
import path from "path";
import { mockProducts } from "@/lib/mock-data";

export interface DBUser {
  id: string;
  username: string;
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "cliente";
  telefono?: string;
  creadoEn: string;
}

export interface DBAppointment {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  servicioNombre: string;
  servicioPrecio: number;
  profesionalNombre: string;
  fecha: string;
  hora: string;
  notas?: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  creadoEn: string;
}

export interface DBProduct {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  marca: string;
  stock: number;
  rating: number;
  reseñasCount: number;
}

export interface DBOrder {
  id: string;
  usuarioId?: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  direccion: string;
  items: Array<{
    productId: string;
    nombre: string;
    precio: number;
    cantidad: number;
    imagenUrl: string;
  }>;
  total: number;
  metodoPago: "efectivo" | "pagomovil";
  pagoMovil?: {
    banco: string;
    referencia: string;
    telefonoEmisor?: string;
  };
  estado: "pendiente_verificacion" | "verificado" | "entregado" | "cancelado";
  creadoEn: string;
}

export interface DatabaseSchema {
  users: DBUser[];
  appointments: DBAppointment[];
  products: DBProduct[];
  orders: DBOrder[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

function getInitialData(): DatabaseSchema {
  return {
    users: [
      {
        id: "admin-root",
        username: "admin",
        nombre: "Administrador Xiorizos",
        email: "admin@xiorizos.com",
        password: "123",
        rol: "admin",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-cliente-demo",
        username: "maria",
        nombre: "María González",
        email: "maria@ejemplo.com",
        password: "123",
        rol: "cliente",
        telefono: "0412 1234567",
        creadoEn: new Date().toISOString(),
      },
    ],
    appointments: [
      {
        id: "cita-101",
        clienteNombre: "María González",
        clienteTelefono: "0412 1234567",
        servicioNombre: "Xiorizos Full Curl",
        servicioPrecio: 35,
        profesionalNombre: "Xioilin Guzmán",
        fecha: new Date(Date.now() + 86400000).toISOString(),
        hora: "10:00",
        notas: "Primera vez en el salón, cabello ondulado 2C.",
        estado: "confirmada",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "cita-102",
        clienteNombre: "Valeria Mendoza",
        clienteTelefono: "0414 7654321",
        servicioNombre: "Color & Iluminación Curly",
        servicioPrecio: 50,
        profesionalNombre: "Axel Alvarado",
        fecha: new Date(Date.now() + 172800000).toISOString(),
        hora: "14:30",
        notas: "Interesada en tonos cobrizos.",
        estado: "pendiente",
        creadoEn: new Date().toISOString(),
      },
    ],
    products: mockProducts.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      imagenUrl: p.imagenUrl,
      categoria: p.categoria,
      marca: p.marca,
      stock: p.stock,
      rating: p.rating,
      reseñasCount: p.reseñasCount,
    })),
    orders: [
      {
        id: "#ORD-9102",
        clienteNombre: "Valeria Mendoza",
        clienteTelefono: "0414 7654321",
        clienteEmail: "valeria@correo.com",
        direccion: "Urb. La Viña, Calle Los Mangos, Valencia",
        items: [
          {
            productId: "p1",
            nombre: "Crema de Peinar Etniker",
            precio: 25,
            cantidad: 1,
            imagenUrl: "/images/crema_de_peinar_etniker.webp",
          },
          {
            productId: "p2",
            nombre: "Gel Definidor",
            precio: 18,
            cantidad: 1,
            imagenUrl: "/images/gel_definidor.webp",
          },
        ],
        total: 43,
        metodoPago: "pagomovil",
        pagoMovil: {
          banco: "Banesco",
          referencia: "0948271",
          telefonoEmisor: "0414 7654321",
        },
        estado: "pendiente_verificacion",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "#ORD-9101",
        clienteNombre: "Carlos Rojas",
        clienteTelefono: "0412 8887766",
        clienteEmail: "carlos@correo.com",
        direccion: "Av. Bolívar Norte, Valencia",
        items: [
          {
            productId: "p3",
            nombre: "Shampoo Hidratante",
            precio: 15,
            cantidad: 2,
            imagenUrl: "/images/shampoo_hidratante.webp",
          },
        ],
        total: 30,
        metodoPago: "efectivo",
        estado: "verificado",
        creadoEn: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  };
}

// Lectura de la base de datos
export function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error("Error reading database file:", error);
    return getInitialData();
  }
}

// Escritura atómica en la base de datos
export function writeDB(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (error) {
    console.error("Error writing database file:", error);
    return false;
  }
}

