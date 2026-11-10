import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Interceptar todas las rutas de /admin excepto la pantalla de login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const role = request.cookies.get("xiorizos_role")?.value;

    // Si no cuenta con una cookie válida de administrador o empleado, redirigir inmediatamente
    if (!role || (role !== "admin" && role !== "empleado" && role !== "estilista")) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Empleados y estilistas solo tienen autorización para ver sus citas agendadas
    if ((role === "empleado" || role === "estilista") && pathname !== "/admin/citas") {
      const citasUrl = new URL("/admin/citas", request.url);
      return NextResponse.redirect(citasUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

