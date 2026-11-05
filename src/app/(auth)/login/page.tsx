"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ShieldCheck, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const login = useAuthStore((state) => state.login);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Credenciales incorrectas.");
        setCargando(false);
        return;
      }

      // Guardar en store
      login(data.user);

      // Si es admin, redirigir directo al panel administrativo
      if (data.user.rol === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectTo);
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al servidor.");
      setCargando(false);
    }
  }

  // Helper rápido para rellenar credenciales del admin
  function setAdminCredentials() {
    setIdentifier("admin");
    setPassword("123");
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingresa a tu cuenta de Xiorizos o accede como administrador.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-xs font-semibold">
            Usuario o Correo electrónico
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="identifier"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin o tu@correo.com"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </div>

        <Button type="submit" className="w-full font-semibold" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </form>

      {/* Acceso directo predeterminado de Administrador */}
      <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-secondary">
            <ShieldCheck className="h-4 w-4" />
            <span>Acceso Administrador</span>
          </div>
          <button
            type="button"
            onClick={setAdminCredentials}
            className="text-[11px] underline font-medium text-primary hover:text-secondary"
          >
            Autocompletar
          </button>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Usuario: <strong className="text-foreground">admin</strong> | Contraseña: <strong className="text-foreground">123</strong>
        </p>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-primary hover:underline">
          Crear cuenta nueva
        </Link>
      </p>
    </div>
  );
}
