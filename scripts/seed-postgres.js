/**
 * Script de migración de datos: data/database.json -> PostgreSQL con Prisma
 * Ejecución: node scripts/seed-postgres.js
 */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("=================================================");
  console.log("🚀 Iniciando migración a PostgreSQL...");
  console.log("=================================================");

  const dbPath = path.join(__dirname, "..", "data", "database.json");
  if (!fs.existsSync(dbPath)) {
    console.error("❌ No se encontró data/database.json");
    process.exit(1);
  }

  const raw = fs.readFileSync(dbPath, "utf8");
  const db = JSON.parse(raw);

  // 1. Migrar Productos
  console.log(`📦 Migrando ${db.products.length} productos...`);
  for (const p of db.products) {
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
  console.log("✅ Productos migrados con éxito.");

  // 2. Migrar Usuarios
  console.log(`👤 Migrando ${db.users.length} usuarios...`);
  for (const u of db.users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        username: u.username,
        nombre: u.nombre,
        password: u.password,
        rol: u.rol || "cliente",
        telefono: u.telefono || null,
        creadoEn: u.creadoEn ? new Date(u.creadoEn) : new Date(),
      },
      create: {
        id: u.id,
        username: u.username,
        nombre: u.nombre,
        email: u.email,
        password: u.password,
        rol: u.rol || "cliente",
        telefono: u.telefono || null,
        creadoEn: u.creadoEn ? new Date(u.creadoEn) : new Date(),
      },
    });
  }
  console.log("✅ Usuarios migrados con éxito.");

  // 3. Migrar Empleados
  console.log(`✂️ Migrando ${(db.employees || []).length} especialistas/empleados...`);
  for (const e of db.employees || []) {
    await prisma.employee.upsert({
      where: { id: e.id },
      update: {
        nombre: e.nombre,
        telefono: e.telefono,
        cargo: e.cargo,
        especialidad: e.especialidad,
        avatarUrl: e.avatarUrl || null,
        serviciosIds: e.serviciosIds || [],
        activo: e.activo !== false,
        tipoInoperatividad: e.tipoInoperatividad || "activo",
        motivoInoperativo: e.motivoInoperativo || null,
        fechaInicioInoperatividad: e.fechaInicioInoperatividad || null,
        fechaFinInoperatividad: e.fechaFinInoperatividad || null,
        fechasAusente: e.fechasAusente || [],
        creadoEn: e.creadoEn ? new Date(e.creadoEn) : new Date(),
      },
      create: {
        id: e.id,
        nombre: e.nombre,
        telefono: e.telefono,
        cargo: e.cargo,
        especialidad: e.especialidad,
        avatarUrl: e.avatarUrl || null,
        serviciosIds: e.serviciosIds || [],
        activo: e.activo !== false,
        tipoInoperatividad: e.tipoInoperatividad || "activo",
        motivoInoperativo: e.motivoInoperativo || null,
        fechaInicioInoperatividad: e.fechaInicioInoperatividad || null,
        fechaFinInoperatividad: e.fechaFinInoperatividad || null,
        fechasAusente: e.fechasAusente || [],
        creadoEn: e.creadoEn ? new Date(e.creadoEn) : new Date(),
      },
    });
  }
  console.log("✅ Empleados migrados con éxito.");

  // 4. Migrar Citas
  console.log(`📅 Migrando ${db.appointments.length} citas agendadas...`);
  for (const c of db.appointments) {
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
        creadoEn: c.creadoEn ? new Date(c.creadoEn) : new Date(),
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
  console.log("✅ Citas migradas con éxito.");

  // 5. Migrar Pedidos y sus Items
  console.log(`🛍️ Migrando ${db.orders.length} pedidos de tienda...`);
  for (const o of db.orders) {
    // Upsert Order
    await prisma.order.upsert({
      where: { id: o.id },
      update: {
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
      },
    });

    // Re-crear items del pedido
    await prisma.orderItem.deleteMany({ where: { orderId: o.id } });
    if (Array.isArray(o.items)) {
      for (const item of o.items) {
        await prisma.orderItem.create({
          data: {
            orderId: o.id,
            productId: item.productId,
            nombre: item.nombre,
            precio: Number(item.precio),
            cantidad: Number(item.cantidad || 1),
            imagenUrl: item.imagenUrl || null,
          },
        });
      }
    }
  }
  console.log("✅ Pedidos y sus items migrados con éxito.");

  console.log("=================================================");
  console.log("🎉 ¡MIGRACIÓN A POSTGRESQL COMPLETADA AL 100%!");
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error("❌ Error durante la migración:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

