import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
  montoReserva?: number;
  montoRestante?: number;
  metodoPago?: "pagomovil" | "efectivo";
  pagoMovil?: {
    banco: string;
    referencia: string;
    telefonoEmisor?: string;
  };
  notificadoWhatsApp?: boolean;
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
  motivoCancelacion?: string;
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
  activo: boolean;
  tipoInoperatividad?: "activo" | "reposo" | "vacaciones" | "permiso" | "fechas_especificas" | "indefinido";
  fechaInicioInoperatividad?: string;
  fechaFinInoperatividad?: string;
  fechasAusente?: string[];
  motivoInoperativo?: string;
  creadoEn: string;
}

export interface DBService {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  categoria: string;
  imagenUrl?: string;
  items: string[];
  activo: boolean;
  especialistasIds?: string[];
  creadoEn: string;
}

export interface DatabaseSchema {
  users: DBUser[];
  appointments: DBAppointment[];
  products: DBProduct[];
  orders: DBOrder[];
  employees: DBEmployee[];
}

export function formatAppointment(a: any): DBAppointment {
  return {
    id: a.id,
    clienteNombre: a.clienteNombre,
    clienteTelefono: a.clienteTelefono,
    servicioNombre: a.servicioNombre,
    servicioPrecio: Number(a.servicioPrecio || 0),
    montoReserva: Number(a.montoReserva || 0),
    montoRestante: Number(a.montoRestante || 0),
    metodoPago: a.metodoPago as DBAppointment["metodoPago"],
    pagoMovil:
      a.pagoMovilBanco || a.pagoMovilReferencia
        ? {
            banco: a.pagoMovilBanco || "",
            referencia: a.pagoMovilReferencia || "",
            telefonoEmisor: a.pagoMovilTelefonoEmisor || undefined,
          }
        : undefined,
    notificadoWhatsApp: Boolean(a.notificadoWhatsApp),
    duracionMin: a.duracionMin ? Number(a.duracionMin) : undefined,
    profesionalNombre: a.profesionalNombre,
    fecha: a.fecha,
    hora: a.hora,
    notas: a.notas || undefined,
    motivoCancelacion: a.motivoCancelacion || undefined,
    estado: a.estado as DBAppointment["estado"],
    creadoEn: a.creadoEn instanceof Date ? a.creadoEn.toISOString() : String(a.creadoEn),
  };
}

export function formatOrder(o: any): DBOrder {
  return {
    id: o.id,
    usuarioId: o.usuarioId || undefined,
    clienteNombre: o.clienteNombre,
    clienteTelefono: o.clienteTelefono,
    clienteEmail: o.clienteEmail || "",
    direccion: o.direccion || "",
    items: (o.items || []).map((it: any) => ({
      productId: it.productId,
      nombre: it.nombre,
      precio: Number(it.precio || 0),
      cantidad: Number(it.cantidad || 1),
      imagenUrl: it.imagenUrl || "",
    })),
    total: Number(o.total || 0),
    metodoPago: o.metodoPago as DBOrder["metodoPago"],
    pagoMovil:
      o.pagoMovilBanco || o.pagoMovilReferencia
        ? {
            banco: o.pagoMovilBanco || "",
            referencia: o.pagoMovilReferencia || "",
            telefonoEmisor: o.pagoMovilTelefonoEmisor || undefined,
          }
        : undefined,
    estado: o.estado as DBOrder["estado"],
    motivoCancelacion: o.motivoCancelacion || undefined,
    notificadoWhatsApp: Boolean(o.notificadoWhatsApp),
    creadoEn: o.creadoEn instanceof Date ? o.creadoEn.toISOString() : String(o.creadoEn),
  };
}

export function formatProduct(p: any): DBProduct {
  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion || "",
    precio: Number(p.precio || 0),
    costo: p.costo !== null && p.costo !== undefined ? Number(p.costo) : undefined,
    imagenUrl: p.imagenUrl || "",
    categoria: p.categoria || "General",
    marca: p.marca || "Xiorizos Care",
    stock: Number(p.stock || 0),
    rating: Number(p.rating || 5.0),
    reseñasCount: p.resenasCount !== undefined ? Number(p.resenasCount) : Number(p.reseñasCount || 0),
  };
}

export function formatEmployee(e: any): DBEmployee {
  return {
    id: e.id,
    nombre: e.nombre,
    telefono: e.telefono,
    cargo: e.cargo,
    especialidad: e.especialidad,
    avatarUrl: e.avatarUrl || undefined,
    serviciosIds: e.serviciosIds || [],
    activo: Boolean(e.activo),
    tipoInoperatividad: e.tipoInoperatividad as DBEmployee["tipoInoperatividad"],
    fechaInicioInoperatividad: e.fechaInicioInoperatividad || undefined,
    fechaFinInoperatividad: e.fechaFinInoperatividad || undefined,
    fechasAusente: e.fechasAusente || [],
    motivoInoperativo: e.motivoInoperativo || undefined,
    creadoEn: e.creadoEn instanceof Date ? e.creadoEn.toISOString() : String(e.creadoEn),
  };
}

export function formatService(s: any): DBService {
  return {
    id: s.id,
    nombre: s.nombre,
    descripcion: s.descripcion || "",
    duracionMin: Number(s.duracionMin || 60),
    precio: Number(s.precio || 0),
    categoria: s.categoria || "General",
    imagenUrl: s.imagenUrl || "/images/Full_curl.webp",
    items: Array.isArray(s.items) ? s.items : [],
    activo: s.activo !== false,
    creadoEn: s.creadoEn instanceof Date ? s.creadoEn.toISOString() : String(s.creadoEn),
  };
}

export function getInitialData(): DatabaseSchema {
  return {
    users: [
      {
        id: "admin-root",
        username: "admin",
        nombre: "Administrador Xiorizos",
        email: "admin@xiorizos.com",
        password: bcrypt.hashSync("Maglio28$", 10),
        rol: "admin",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-xioilin",
        username: "xioilin",
        nombre: "Xioilin Guzmán",
        email: "xioilin@xiorizos.com",
        password: bcrypt.hashSync("Xioilin28$", 10),
        rol: "empleado",
        telefono: "0412 8493021",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-axel",
        username: "axel",
        nombre: "Axel Alvarado",
        email: "axel@xiorizos.com",
        password: bcrypt.hashSync("Axel28$", 10),
        rol: "empleado",
        telefono: "0414 4321980",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-yolennis",
        username: "yolennis",
        nombre: "Yolennis Yélamo",
        email: "yolennis@xiorizos.com",
        password: bcrypt.hashSync("Yolennis28$", 10),
        rol: "empleado",
        telefono: "0424 5543210",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-yakeline",
        username: "yakeline",
        nombre: "Yakeline Daboin",
        email: "yakeline@xiorizos.com",
        password: bcrypt.hashSync("Yakeline28$", 10),
        rol: "empleado",
        telefono: "0416 9988776",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-emp-german",
        username: "german",
        nombre: "Germán Jácome",
        email: "german@xiorizos.com",
        password: bcrypt.hashSync("German28$", 10),
        rol: "empleado",
        telefono: "0412 1122334",
        creadoEn: new Date().toISOString(),
      },
      {
        id: "u-cliente-demo",
        username: "maria",
        nombre: "María González",
        email: "maria@ejemplo.com",
        password: bcrypt.hashSync("123", 10),
        rol: "cliente",
        telefono: "0412 1234567",
        creadoEn: new Date().toISOString(),
      },
    ],
    appointments: [],
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
    orders: [],
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

let dbCache: { data: DatabaseSchema; timestamp: number } | null = null;
const CACHE_TTL_MS = 2500; // 2.5s TTL para lecturas rápidas manteniendo sincronización

/**
 * Lectura unificada desde PostgreSQL (Supabase) a través de Prisma
 */
export async function readDB(forceFresh = false): Promise<DatabaseSchema> {
  const now = Date.now();
  if (!forceFresh && dbCache && now - dbCache.timestamp < CACHE_TTL_MS) {
    return structuredClone(dbCache.data);
  }

  try {
    const [users, appointments, products, orders, employees] = await Promise.all([
      prisma.user.findMany({ orderBy: { creadoEn: "desc" } }),
      prisma.appointment.findMany({ orderBy: { creadoEn: "desc" } }),
      prisma.product.findMany({ orderBy: { id: "asc" } }),
      prisma.order.findMany({
        include: { items: true },
        orderBy: { creadoEn: "desc" },
      }),
      prisma.employee.findMany({ orderBy: { creadoEn: "asc" } }),
    ]);

    const data: DatabaseSchema = {
      users: users.map((u) => ({
        id: u.id,
        username: u.username,
        nombre: u.nombre,
        email: u.email,
        password: u.password,
        rol: u.rol as DBUser["rol"],
        telefono: u.telefono || undefined,
        creadoEn: u.creadoEn.toISOString(),
      })),
      appointments: appointments.map((a) => ({
        id: a.id,
        clienteNombre: a.clienteNombre,
        clienteTelefono: a.clienteTelefono,
        servicioNombre: a.servicioNombre,
        servicioPrecio: a.servicioPrecio,
        montoReserva: a.montoReserva,
        montoRestante: a.montoRestante,
        metodoPago: a.metodoPago as DBAppointment["metodoPago"],
        pagoMovil:
          a.pagoMovilBanco || a.pagoMovilReferencia
            ? {
                banco: a.pagoMovilBanco || "",
                referencia: a.pagoMovilReferencia || "",
                telefonoEmisor: a.pagoMovilTelefonoEmisor || undefined,
              }
            : undefined,
        notificadoWhatsApp: a.notificadoWhatsApp,
        duracionMin: a.duracionMin || undefined,
        profesionalNombre: a.profesionalNombre,
        fecha: a.fecha,
        hora: a.hora,
        notas: a.notas || undefined,
        motivoCancelacion: a.motivoCancelacion || undefined,
        estado: a.estado as DBAppointment["estado"],
        creadoEn: a.creadoEn.toISOString(),
      })),
      products: products.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion || "",
        precio: p.precio,
        costo: p.costo !== null && p.costo !== undefined ? p.costo : undefined,
        imagenUrl: p.imagenUrl || "",
        categoria: p.categoria,
        marca: p.marca || "Xiorizos Care",
        stock: p.stock,
        rating: p.rating,
        reseñasCount: p.resenasCount,
      })),
      orders: orders.map((o) => ({
        id: o.id,
        usuarioId: o.usuarioId || undefined,
        clienteNombre: o.clienteNombre,
        clienteTelefono: o.clienteTelefono,
        clienteEmail: o.clienteEmail || "",
        direccion: o.direccion || "",
        items: o.items.map((it) => ({
          productId: it.productId,
          nombre: it.nombre,
          precio: it.precio,
          cantidad: it.cantidad,
          imagenUrl: it.imagenUrl || "",
        })),
        total: o.total,
        metodoPago: o.metodoPago as DBOrder["metodoPago"],
        pagoMovil:
          o.pagoMovilBanco || o.pagoMovilReferencia
            ? {
                banco: o.pagoMovilBanco || "",
                referencia: o.pagoMovilReferencia || "",
                telefonoEmisor: o.pagoMovilTelefonoEmisor || undefined,
              }
            : undefined,
        estado: o.estado as DBOrder["estado"],
        motivoCancelacion: o.motivoCancelacion || undefined,
        notificadoWhatsApp: o.notificadoWhatsApp,
        creadoEn: o.creadoEn.toISOString(),
      })),
      employees: employees.map((e) => ({
        id: e.id,
        nombre: e.nombre,
        telefono: e.telefono,
        cargo: e.cargo,
        especialidad: e.especialidad,
        avatarUrl: e.avatarUrl || undefined,
        serviciosIds: e.serviciosIds,
        activo: e.activo,
        tipoInoperatividad: e.tipoInoperatividad as DBEmployee["tipoInoperatividad"],
        fechaInicioInoperatividad: e.fechaInicioInoperatividad || undefined,
        fechaFinInoperatividad: e.fechaFinInoperatividad || undefined,
        fechasAusente: e.fechasAusente,
        motivoInoperativo: e.motivoInoperativo || undefined,
        creadoEn: e.creadoEn.toISOString(),
      })),
    };

    dbCache = { data: structuredClone(data), timestamp: now };
    return data;
  } catch (error) {
    console.error("Error al leer desde PostgreSQL:", error);
    if (dbCache) return structuredClone(dbCache.data);
    return getInitialData();
  }
}

/**
 * Escritura y sincronización completa con PostgreSQL (Supabase) vía Prisma
 */
export async function writeDB(data: DatabaseSchema): Promise<boolean> {
  dbCache = { data: structuredClone(data), timestamp: Date.now() };

  try {
    // 1. Usuarios
    for (const u of data.users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {
          username: u.username,
          nombre: u.nombre,
          email: u.email,
          password: u.password,
          rol: u.rol,
          telefono: u.telefono || null,
        },
        create: {
          id: u.id,
          username: u.username,
          nombre: u.nombre,
          email: u.email,
          password: u.password,
          rol: u.rol,
          telefono: u.telefono || null,
          creadoEn: u.creadoEn ? new Date(u.creadoEn) : new Date(),
        },
      });
    }

    // 2. Citas
    for (const c of data.appointments) {
      await prisma.appointment.upsert({
        where: { id: c.id },
        update: {
          clienteNombre: c.clienteNombre,
          clienteTelefono: c.clienteTelefono,
          servicioNombre: c.servicioNombre,
          servicioPrecio: Number(c.servicioPrecio || 0),
          montoReserva: Number(c.montoReserva || c.servicioPrecio * 0.2 || 0),
          montoRestante: Number(c.montoRestante || c.servicioPrecio * 0.8 || 0),
          metodoPago: c.metodoPago || "pagomovil",
          pagoMovilBanco: c.pagoMovil?.banco || null,
          pagoMovilReferencia: c.pagoMovil?.referencia || null,
          pagoMovilTelefonoEmisor: c.pagoMovil?.telefonoEmisor || null,
          notificadoWhatsApp: Boolean(c.notificadoWhatsApp),
          duracionMin: c.duracionMin ? Number(c.duracionMin) : null,
          profesionalNombre: c.profesionalNombre,
          fecha: c.fecha,
          hora: c.hora,
          notas: c.notas || null,
          motivoCancelacion: c.motivoCancelacion || null,
          estado: c.estado || "pendiente",
        },
        create: {
          id: c.id,
          clienteNombre: c.clienteNombre,
          clienteTelefono: c.clienteTelefono,
          servicioNombre: c.servicioNombre,
          servicioPrecio: Number(c.servicioPrecio || 0),
          montoReserva: Number(c.montoReserva || c.servicioPrecio * 0.2 || 0),
          montoRestante: Number(c.montoRestante || c.servicioPrecio * 0.8 || 0),
          metodoPago: c.metodoPago || "pagomovil",
          pagoMovilBanco: c.pagoMovil?.banco || null,
          pagoMovilReferencia: c.pagoMovil?.referencia || null,
          pagoMovilTelefonoEmisor: c.pagoMovil?.telefonoEmisor || null,
          notificadoWhatsApp: Boolean(c.notificadoWhatsApp),
          duracionMin: c.duracionMin ? Number(c.duracionMin) : null,
          profesionalNombre: c.profesionalNombre,
          fecha: c.fecha,
          hora: c.hora,
          notas: c.notas || null,
          motivoCancelacion: c.motivoCancelacion || null,
          estado: c.estado || "pendiente",
          creadoEn: c.creadoEn ? new Date(c.creadoEn) : new Date(),
        },
      });
    }

    // 3. Pedidos
    for (const o of data.orders) {
      await prisma.order.upsert({
        where: { id: o.id },
        update: {
          estado: o.estado,
          motivoCancelacion: o.motivoCancelacion || null,
          notificadoWhatsApp: Boolean(o.notificadoWhatsApp),
        },
        create: {
          id: o.id,
          usuarioId: o.usuarioId || null,
          clienteNombre: o.clienteNombre,
          clienteTelefono: o.clienteTelefono,
          clienteEmail: o.clienteEmail || null,
          direccion: o.direccion || null,
          total: Number(o.total || 0),
          metodoPago: o.metodoPago || "pagomovil",
          pagoMovilBanco: o.pagoMovil?.banco || null,
          pagoMovilReferencia: o.pagoMovil?.referencia || null,
          pagoMovilTelefonoEmisor: o.pagoMovil?.telefonoEmisor || null,
          estado: o.estado || "pendiente_verificacion",
          motivoCancelacion: o.motivoCancelacion || null,
          notificadoWhatsApp: Boolean(o.notificadoWhatsApp),
          creadoEn: o.creadoEn ? new Date(o.creadoEn) : new Date(),
          items: {
            create: (o.items || []).map((it) => ({
              productId: it.productId,
              nombre: it.nombre,
              precio: Number(it.precio || 0),
              cantidad: Number(it.cantidad || 1),
              imagenUrl: it.imagenUrl || null,
            })),
          },
        },
      });
    }

    // 4. Productos
    const currentProdIds = data.products.map((p) => p.id);
    await prisma.product.deleteMany({
      where: { id: { notIn: currentProdIds } },
    });
    for (const p of data.products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: Number(p.precio),
          costo: p.costo !== undefined ? Number(p.costo) : null,
          imagenUrl: p.imagenUrl,
          categoria: p.categoria,
          marca: p.marca || "Xiorizos Care",
          stock: Number(p.stock || 0),
          rating: Number(p.rating || 5.0),
          resenasCount: Number(p.reseñasCount || 0),
        },
        create: {
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: Number(p.precio),
          costo: p.costo !== undefined ? Number(p.costo) : null,
          imagenUrl: p.imagenUrl,
          categoria: p.categoria,
          marca: p.marca || "Xiorizos Care",
          stock: Number(p.stock || 0),
          rating: Number(p.rating || 5.0),
          resenasCount: Number(p.reseñasCount || 0),
        },
      });
    }

    // 5. Empleados
    const currentEmpIds = data.employees.map((e) => e.id);
    await prisma.employee.deleteMany({
      where: { id: { notIn: currentEmpIds } },
    });
    for (const e of data.employees) {
      await prisma.employee.upsert({
        where: { id: e.id },
        update: {
          nombre: e.nombre,
          telefono: e.telefono,
          cargo: e.cargo,
          especialidad: e.especialidad,
          avatarUrl: e.avatarUrl || null,
          serviciosIds: e.serviciosIds || [],
          activo: Boolean(e.activo),
          tipoInoperatividad: e.tipoInoperatividad || null,
          fechaInicioInoperatividad: e.fechaInicioInoperatividad || null,
          fechaFinInoperatividad: e.fechaFinInoperatividad || null,
          fechasAusente: e.fechasAusente || [],
          motivoInoperativo: e.motivoInoperativo || null,
        },
        create: {
          id: e.id,
          nombre: e.nombre,
          telefono: e.telefono,
          cargo: e.cargo,
          especialidad: e.especialidad,
          avatarUrl: e.avatarUrl || null,
          serviciosIds: e.serviciosIds || [],
          activo: Boolean(e.activo),
          tipoInoperatividad: e.tipoInoperatividad || null,
          fechaInicioInoperatividad: e.fechaInicioInoperatividad || null,
          fechaFinInoperatividad: e.fechaFinInoperatividad || null,
          fechasAusente: e.fechasAusente || [],
          motivoInoperativo: e.motivoInoperativo || null,
          creadoEn: e.creadoEn ? new Date(e.creadoEn) : new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error al persistir en PostgreSQL:", error);
    return false;
  }
}
