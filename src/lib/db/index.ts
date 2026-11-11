import fs from "fs";
import path from "path";
import { mockProducts } from "@/lib/mock-data";

export interface DBUser {
  id: string;
  username: string;
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "cliente" | "empleado" | "estilista";
  telefono?: string;
  creadoEn: string;
}

export interface DBAppointment {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  servicioNombre: string;
  servicioPrecio: number;
  montoReserva?: number; // 20% abono para agendar
  montoRestante?: number; // 80% restante a pagar en salón
  metodoPago?: "pagomovil" | "efectivo";
  pagoMovil?: {
    banco: string;
    referencia: string;
    telefonoEmisor?: string;
  };
  notificadoWhatsApp?: boolean; // true si ya se le envió notificación por WS
  duracionMin?: number;
  profesionalNombre: string;
  fecha: string;
  hora: string;
  notas?: string;
  motivoCancelacion?: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  creadoEn: string;
}

export interface DBProduct {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo?: number;
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
  notificadoWhatsApp?: boolean;
  creadoEn: string;
}

export interface DBEmployee {
  id: string;
  nombre: string;
  telefono: string;
  cargo: string;
  especialidad: string;
  avatarUrl?: string;
  serviciosIds: string[];
  activo: boolean; // true = Operativo (en agenda), false = Inoperativo
  tipoInoperatividad?: "activo" | "reposo" | "vacaciones" | "permiso" | "fechas_especificas" | "indefinido";
  fechaInicioInoperatividad?: string; // YYYY-MM-DD
  fechaFinInoperatividad?: string; // YYYY-MM-DD
  fechasAusente?: string[]; // Fechas específicas de inasistencia (YYYY-MM-DD)
  motivoInoperativo?: string;
  creadoEn: string;
}

export interface DatabaseSchema {
  users: DBUser[];
  appointments: DBAppointment[];
  products: DBProduct[];
  orders: DBOrder[];
  employees: DBEmployee[];
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
        password: "Maglio28$",
        rol: "admin",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-xioilin",
        username: "xioilin",
        nombre: "Xioilin Guzmán",
        email: "xioilin@xiorizos.com",
        password: "Xioilin28$",
        rol: "empleado",
        telefono: "0412 8493021",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-axel",
        username: "axel",
        nombre: "Axel Alvarado",
        email: "axel@xiorizos.com",
        password: "Axel28$",
        rol: "empleado",
        telefono: "0414 4321980",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-yolennis",
        username: "yolennis",
        nombre: "Yolennis Yélamo",
        email: "yolennis@xiorizos.com",
        password: "Yolennis28$",
        rol: "empleado",
        telefono: "0424 5543210",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-yakeline",
        username: "yakeline",
        nombre: "Yakeline Daboin",
        email: "yakeline@xiorizos.com",
        password: "Yakeline28$",
        rol: "empleado",
        telefono: "0416 9988776",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-german",
        username: "german",
        nombre: "Germán Jácome",
        email: "german@xiorizos.com",
        password: "German28$",
        rol: "empleado",
        telefono: "0412 1122334",
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
    employees: [
      {
        id: "emp-1",
        nombre: "Xioilin Guzmán",
        telefono: "0412 8493021",
        cargo: "Master Curly",
        especialidad: "Diagnóstico capilar y asesoría integral",
        avatarUrl: "/images/fundadora_xioilin_guzman.webp",
        serviciosIds: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11"],
        activo: true,
        creadoEn: new Date().toISOString(),
      },
      {
        id: "emp-2",
        nombre: "Axel Alvarado",
        telefono: "0414 4321980",
        cargo: "Estilista Colorista",
        especialidad: "Balayage e iluminaciones botánicas",
        avatarUrl: "/images/especialista_en_color_y_curvaturas_Axel_Alvarado.webp",
        serviciosIds: ["s3", "s8", "s9"],
        activo: true,
        creadoEn: new Date().toISOString(),
      },
      {
        id: "emp-3",
        nombre: "Yolennis Yélamo",
        telefono: "0424 5543210",
        cargo: "Estilista de Corte",
        especialidad: "Técnicas en seco y definición profunda",
        avatarUrl: "/images/especialista_en_rizos_Yolennis_Yelamo.webp",
        serviciosIds: ["s1", "s2", "s4", "s5", "s6", "s7", "s8", "s10", "s11"],
        activo: true,
        creadoEn: new Date().toISOString(),
      },
      {
        id: "emp-4",
        nombre: "Yakeline Daboin",
        telefono: "0416 9988776",
        cargo: "Nail Artist",
        especialidad: "Manicura rusa y pedicura spa",
        avatarUrl: "/images/especialista_unas_yakeline_daboin.webp",
        serviciosIds: ["s12"],
        activo: true,
        creadoEn: new Date().toISOString(),
      },
      {
        id: "emp-5",
        nombre: "Germán Jácome",
        telefono: "0412 1122334",
        cargo: "Gerente General",
        especialidad: "Operaciones y calidad de experiencia",
        avatarUrl: "/images/Gerente_general_German_Jacome.webp",
        serviciosIds: [],
        activo: true,
        creadoEn: new Date().toISOString(),
      },
    ],
  };
}

const globalForDB = globalThis as unknown as {
  __xiorizosDbCache?: { mtimeMs: number; data: DatabaseSchema };
};

// Lectura de la base de datos con caché en memoria invalidado por fecha de modificación
export function readDB(): DatabaseSchema {
  try {
    let mtimeMs: number | null = null;
    try {
      mtimeMs = fs.statSync(DB_FILE).mtimeMs;
    } catch {
      mtimeMs = null;
    }

    if (mtimeMs !== null && globalForDB.__xiorizosDbCache?.mtimeMs === mtimeMs) {
      return structuredClone(globalForDB.__xiorizosDbCache.data);
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (mtimeMs === null) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      const newStat = fs.statSync(DB_FILE);
      globalForDB.__xiorizosDbCache = { mtimeMs: newStat.mtimeMs, data: structuredClone(initial) };
      return initial;
    }

    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content) as DatabaseSchema;

    // Asegurar que existan todos los arreglos por si el archivo JSON previo no los tenía
    if (!parsed.employees || parsed.employees.length === 0) {
      parsed.employees = getInitialData().employees;
      writeDB(parsed);
      return parsed;
    }

    globalForDB.__xiorizosDbCache = { mtimeMs, data: structuredClone(parsed) };
    return parsed;
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
    const stat = fs.statSync(DB_FILE);
    globalForDB.__xiorizosDbCache = { mtimeMs: stat.mtimeMs, data: structuredClone(data) };
    return true;
  } catch (error) {
    console.error("Error writing database file:", error);
    return false;
  }
}

