# Xiorizos — Sistema Web & Plataforma Integral para Salón Curly

Plataforma web oficial, tienda en línea, simulador de colorimetría con Inteligencia Artificial y sistema administrativo completo para **Xiorizos**, estudio especializado certificado en cabello ondulado, rizado y afro en Naguanagua, Valencia, Venezuela.

---

## 🌟 Módulos y Características del Sistema

### 1. Tienda Online & Catálogo Boutique (`/catalogo`, `/checkout`)
* **Catálogo Reactivo:** Filtros por categoría y marcas especializadas en método curly, buscador instantáneo y vista detallada de productos.
* **Carrito Deslizante (Cart Drawer):** Gestión interactiva de cantidades, cálculo dinámico de totales en formato venezolano `X,XX$`.
* **Checkout & Pago Móvil:** Pasarela adaptada a Venezuela con soporte para Pago Móvil (bancos nacionales, número de referencia, teléfono emisor) y pago en efectivo.
* **Integración Cashea:** Indicadores visuales de financiamiento en cuotas sin interés.

### 2. Agendamiento de Citas con Disponibilidad Inteligente (`/citas`)
* **Flujo en 4 Pasos:** Selección de servicio (12 servicios categorizados), especialista con avatar real, fecha y hora con bloqueo dinámico de colisiones.
* **Reserva con Abono:** Cálculo automático del 20% de reserva y 80% restante a pagar en salón.
* **Disponibilidad y Ausencias:** Validación en tiempo real de horarios operativos, días de inoperatividad de estilistas (reposo, vacaciones, permisos especiales) y citas simultáneas.
* **Confirmación por WhatsApp:** Generación de enlaces automáticos directos a WhatsApp con la plantilla de confirmación de la cita.

### 3. Simulador de Colorimetría con IA en el Cliente (`/simulador`)
* **Procesamiento 100% en el Navegador:** Impulsado por **Google MediaPipe Hair Segmenter** compilado en **WebAssembly (WASM)** y modelo TFLite.
* **Cero Costo de APIs:** No consume APIs externas de pago; corre directo en la GPU/CPU del dispositivo del cliente.
* **Privacidad Total:** Las fotos del cliente nunca abandonan el navegador ni se almacenan en servidores.
* **Paleta Realista de Salón:** 7 tonos profesionales (Rubio Miel, Castaño Caramelo, Chocolate Profundo, Cobrizo Natural, Borgoña Vino, Negro Azabache y Rubio Cenizo), respetando la textura tridimensional y el brillo de los rizos.

### 4. Panel de Administración Integral (`/admin`)
* **Dashboard Visual de Inteligencia de Negocio:**
  * Flujo de facturación bruta y ganancia neta en tienda por día.
  * Gráfica comparativa del **Balance Global del Negocio** (Servicios en Salón vs Productos en Tienda con desglose de abonos 20% vs cobro 80%).
  * Gráfica de **Ocupación Semanal del Salón** con detección automática del día pico de mayor demanda.
  * Gráfica de **Salud y Capacidad de Inventario por Categoría** con valoración en anaquel.
* **Gestión de Citas (`/admin/citas`):** Visualización paginada (20 por página), modal de detalle adaptativo en 2 columnas sin scroll, verificación de abonos, cancelación justificada con notificación por WhatsApp y gestión de estados (*pendiente*, *confirmada*, *completada*, *cancelada*).
* **Gestión de Pedidos (`/admin/pedidos`):** Control paginado de compras (20 por página), comprobación de referencias de Pago Móvil, control de despacho (*por verificar*, *verificado*, *entregado*, *cancelado*) y retorno automático de productos al stock si el pago es erróneo.
* **Gestión de Productos (`/admin/productos`):** Creación, edición, control de inventario/stock, subida de imágenes y costos.
* **Gestión de Empleados & Horarios (`/admin/empleados`):** Registro de estilistas, asignación de servicios y control de inoperatividad (vacaciones, reposos médicos o ausencias en fechas específicas para bloquear su agenda automáticamente).
* **Gestión de Usuarios (`/admin/usuarios`):** Control de acceso por roles (*admin*, *empleado*, *cliente*).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) + React 18 + TypeScript 5 |
| **Base de Datos** | **PostgreSQL** alojado en la nube en **Supabase** + **Prisma ORM 5.22** (con tolerancia a fallos offline) |
| **Estilos & UI** | Tailwind CSS + Radix UI / Shadcn UI + Lucide Icons |
| **Estado Global** | Zustand (carrito, citas, autenticación, simulador) |
| **Inteligencia Artificial** | Google MediaPipe Vision Tasks (`@mediapipe/tasks-vision`) + WebAssembly (WASM) + TFLite |
| **Validación de Datos** | Zod + React Hook Form |
| **Procesamiento de Imágenes** | Sharp para optimización estática y conversión a WebP |

---

## 🔐 Cuentas de Acceso para Pruebas

Para demostraciones y pruebas del sistema, se encuentran pre-configuradas las siguientes credenciales:

### Cuenta Administrador
* **URL:** `/admin/login` o `/login`
* **Email:** `admin@xiorizos.com`
* **Contraseña:** `Maglio28$`
* **Rol:** Acceso total al panel administrativo, finanzas, pedidos, citas y personal.

### Cuenta Empleado / Estilista
* **Email:** `xioilin@xiorizos.com` *(o cualquier otro miembro del equipo: `axel@xiorizos.com`, `yolennis@xiorizos.com`)*
* **Contraseña:** `Xioilin28$` *(o `Axel28$`, `Yolennis28$`)*
* **Rol:** Acceso a citas y pedidos del estudio.

### Cuenta Cliente Demo
* **Email:** `maria@ejemplo.com`
* **Contraseña:** `123`
* **Rol:** Cliente registrado con acceso a agendamiento y pedidos.

---

## 🚀 Instalación y Puesta en Marcha en Otra Computadora

Si descargas o clonas este proyecto en otra laptop o PC, sigue estos pasos:

### 1. Requisitos Previos
* **Node.js:** v18.18.0 o superior (recomendado v20+ LTS).
* **npm:** v9.0 o superior.

### 2. Clonar el repositorio
```bash
git clone https://github.com/Magliogarcia/SISTEMA-WEB-XIORIZOS.git
cd SISTEMA-WEB-XIORIZOS
```

### 3. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 4. Configurar las Variables de Entorno (`.env`)
Crea un archivo llamado `.env` en la raíz del proyecto y coloca las credenciales de conexión a la base de datos PostgreSQL de Supabase (toma como referencia el archivo `.env.example`):

```env
DATABASE_URL="postgresql://postgres.uwkjwzzgjxckiutnaoiu:TU_CONTRASEÑA@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.uwkjwzzgjxckiutnaoiu:TU_CONTRASEÑA@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

> **💡 Nota importante de portabilidad:**  
> Gracias a que la base de datos está centralizada en la nube en **Supabase**, cualquier cita agendada o producto modificado desde una computadora se sincronizará automáticamente en tiempo real en cualquier otra máquina donde abras el sistema. Además, el sistema cuenta con respaldo local para seguir funcionando incluso sin conexión a internet.

### 5. Iniciar en modo desarrollo
```bash
npm run dev
```

* **Sitio público:** [http://localhost:3000](http://localhost:3000)
* **Panel Administrativo:** [http://localhost:3000/admin](http://localhost:3000/admin)
* **Simulador de Colorimetría:** [http://localhost:3000/simulador](http://localhost:3000/simulador)

---

## 🗄️ Comandos Útiles de Base de Datos (Prisma)

* `npm run db:push` — Sincroniza y crea las tablas del esquema en PostgreSQL.
* `npm run db:seed` — Vuelca todo el catálogo, usuarios y registros históricos hacia PostgreSQL.
* `npm run db:studio` — Abre una interfaz visual en el navegador para explorar y editar tus tablas directamente.

---

## 🏗️ Compilación para Producción

```bash
npm run build
npm run start
```

---

## 📍 Información del Salón

* **Ubicación:** Planta Baja, Torre Anexa del Centro Científico Metropolitano del Norte, Naguanagua, Valencia 2001, Carabobo, Venezuela.
* **Horario:** Martes a Sábado de 8:30 a.m. a 5:30 p.m.
* **WhatsApp de Atención:** +58 412 7434761
* **Métodos de Pago:** Pago Móvil, Efectivo, Transferencia, Cashea.
