"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }

    const esAdmin = user?.rol === "admin";
    const esEmpleado = user?.rol === "empleado" || user?.rol === "estilista";

    if (!isAuthenticated || (!esAdmin && !esEmpleado)) {
      router.replace("/admin/login");
      return;
    }

    // Los empleados solo pueden ver su agenda de citas
    if (!esAdmin && esEmpleado && pathname !== "/admin/citas") {
      router.replace("/admin/citas");
      return;
    }

    setChecked(true);
  }, [pathname, isAuthenticated, user, router]);

  // Si estamos en /admin/login, renderizar solo la pantalla limpia de login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1F140E] text-white">
        <p className="text-sm animate-pulse">Verificando permisos de administración...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-slate-900 font-sans antialiased">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
