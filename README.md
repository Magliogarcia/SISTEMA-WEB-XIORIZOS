# Xiorizos — Frontend

Frontend del Sistema Web de Gestión Administrativa, Agendamiento de Citas y Simulador de
Colorimetría Capilar para el salón de belleza **Xiorizos**.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **Zustand** (carrito, sesión, wizard de citas, simulador)
- **Shadcn UI** + **Lucide React**

## Requisitos

- Node.js 18.18 o superior
- npm 9+

## Instalación

```bash
cd xiorizos-frontend
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El panel admin está en `/admin`.

## Verifica que compile

Como este proyecto se generó sin acceso a internet en el entorno donde se escribió (no se
pudo correr `npm install` ni `npm run build` para probarlo), ejecuta esto apenas lo
descargues:

```bash
npm install
npm run build
```

Si aparece algún error, cópialo tal cual y repórtalo para corregirlo.

## Estructura general

```
src/
├── app/
│   ├── (shop)/       # Landing (hero con video + testimonios), catálogo, checkout, citas, simulador
│   ├── (admin)/admin # Dashboard, productos, citas, pedidos, usuarios
│   └── (auth)/       # Login, registro
├── components/
│   ├── ui/           # Componentes base de Shadcn
│   ├── layout/       # Navbar, footer, sidebar admin, topbar admin
│   ├── shop/          booking/  simulator/  admin/
├── store/            # Zustand: cart, auth, booking, simulator
├── types/            # Tipos TypeScript compartidos
└── lib/               # utils, mock-data (datos dummy), constants
```

## Datos de prueba

Todo el frontend funciona con datos mock (`src/lib/mock-data.ts`) para que puedas navegar
todas las vistas sin backend.

## Puntos de integración pendientes (backend)

- **Simulador de color** (`src/store/simulator-store.ts`,
  `src/app/(shop)/simulador/page.tsx`): estado y flujo listos para conectar Hugging Face
  (segmentación) + OpenCV (recoloreo). Busca los comentarios `// NOTA:`.
- **Autenticación** (`src/store/auth-store.ts`, `login/`, `registro/`): simulada con
  `setTimeout`, lista para reemplazar por llamadas reales + manejo de tokens.
- **Checkout y creación de citas**: los `handleSubmit` de `checkout/page.tsx` y
  `booking-summary-form.tsx` están listos para apuntar a endpoints reales.
- **CRUDs del admin**: usan `useState` en memoria. Sustituir por fetch + mutaciones
  (idealmente con React Query o SWR).
- **Video del hero** (`src/app/(shop)/page.tsx`): la URL del video está en la constante
  `HERO_VIDEO_URL` al inicio del archivo — reemplázala fácilmente cuando tengas tu propio
  video de producción (recomendado: H.264, menor a 5MB, para carga rápida).

## Build de producción

```bash
npm run build
npm run start
```
