"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Credenciales incorrectas.");
        setCargando(false);
        return;
      }

      if (data.user.rol !== "admin" && data.user.rol !== "empleado" && data.user.rol !== "estilista") {
        setError("Esta cuenta no tiene permisos para acceder al panel de control.");
        setCargando(false);
        return;
      }

      login(data.user);
      if (data.user.rol === "admin") {
        router.push("/admin");
      } else {
        router.push("/admin/citas");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1F140E] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary">Panel de Control</h1>
          <p className="text-xs text-muted-foreground">
            Acceso exclusivo para el personal operativo y administración de Xiorizos
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="adminUser" className="text-xs font-semibold">
              Usuario de Administrador
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="adminUser"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adminPass" className="text-xs font-semibold">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="adminPass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full font-semibold" disabled={cargando}>
            {cargando ? "Accediendo al panel..." : "Ingresar al Panel"}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver a la tienda pública</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

