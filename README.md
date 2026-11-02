# Xiorizos — Sitio Web & Estudio Especializado en Rizos

Sitio web oficial, catálogo interactivo, simulación de colorimetría y agendamiento de citas online para el salón y estudio **Xiorizos** en Naguanagua, Valencia, Venezuela. Especialistas certificados en cabello ondulado, rizado y afro.

---

## 🌟 Características Principales

- **Multi-página fluida con Next.js 14 App Router:**
  - **Inicio (`/`):** Hero visual panorámico, doble carrusel infinito de servicios (Cortes, Color, Terapias y Uñas), sección "Sobre Nosotros" con video recorrido del estudio, fotos del equipo y comunidad, simulador de color, boutique destacada con video de productos, banner con integración oficial de **Cashea**, carrusel continuo de testimonios reales y ubicación con Google Maps.
  - **Sobre Nosotros (`/nosotros`):** Historia del estudio, video recorrido unificado sin márgenes grises, galería de personal y fichas individuales de las 7 integrantes del equipo real.
  - **Servicios (`/servicios`):** Catálogo de los 12 servicios especializados con navegación por ancla directa (`#servicio-id`), fichas detalladas y bloque destacado para el Servicio de Uñas con video demostrativo.
  - **Simulador de Color (`/simulador`):** Previsualización interactiva de tonos con control deslizante protegido contra arrastre fantasma en escritorio.
  - **Catálogo de Productos (`/catalogo`):** Tienda online con filtros por categoría y marca, buscador reactivo, tarjetas de producto con redondeo ligero (2px en imágenes) y banner con video demostrativo.
  - **Agendar Cita (`/citas`):** Wizard en 4 pasos (Servicio, Especialista con avatar real, Fecha/Hora, Confirmación) con preselección automática por URL.
- **Carrito de compras deslizante (Drawer):** Control interactivo de cantidades (`+` y `-`), cálculo de subtotales y eliminación de productos.
- **Botón Flotante de WhatsApp:** Conexión directa y rápida con el salón (+58 412 7434761).
- **Diseño Responsivo:** Píldoras de navegación tipo app en desktop y menú drawer móvil optimizado.
- **Optimización de Producción:** Paquete `sharp` integrado para procesamiento y optimización ultra-rápida de imágenes WebP.

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS con tokens de diseño personalizados
- **Estado Global:** Zustand (carrito, citas, autenticación, simulador)
- **Componentes:** Radix UI / Shadcn UI + Lucide React + Material Symbols
- **Imágenes & Multimedia:** Next Image + Sharp + HTML5 Video optimizado

---

## 📦 Requisitos Previos

- **Node.js:** v18.18.0 o superior
- **npm:** v9.0 o superior

---

## 🚀 Instalación y Puesta en Marcha

1. Clonar el repositorio (si aún no lo has hecho):
```bash
git clone https://github.com/Magliogarcia/SISTEMA-WEB-XIORIZOS.git
cd SISTEMA-WEB-XIORIZOS
```

2. Instalar dependencias:
```bash
npm install --legacy-peer-deps
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Compilación para Producción

Para compilar y verificar que todo esté 100% libre de errores:

```bash
npm run build
npm run start
```

---

## 📍 Ubicación e Información del Salón

- **Dirección:** Planta Baja, Torre Anexa del Centro Científico Metropolitano del Norte, Naguanagua, Valencia 2001, Carabobo, Venezuela.
- **Horario de Atención:** Martes a Sábado de 8:30 a.m. a 5:30 p.m. (Domingos y Lunes cerrado).
- **WhatsApp:** +58 412 7434761
- **Métodos de Pago:** Transferencia, Pago Móvil, Efectivo, Cashea (cuotas sin interés).
