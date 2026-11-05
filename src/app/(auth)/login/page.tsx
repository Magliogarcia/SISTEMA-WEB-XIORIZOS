"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock, User, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { login, logout, user, isAuthenticated } = useAuthStore();
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

      login(data.user);

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

  return (
    <div className="space-y-5 font-sans">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Iniciar sesión</h1>
        <p className="mt-1 text-xs text-slate-500">
          Ingresa tus credenciales para acceder a tu cuenta.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isAuthenticated && user && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">Sesión actual: {user.nombre}</span>
            <span className="font-semibold text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
              {user.rol}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
            {user.rol === "admin" && (
              <Button
                type="button"
                size="sm"
                className="flex-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md"
                onClick={() => router.push("/admin")}
              >
                Panel Administrador
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 text-xs rounded-md border-slate-200 text-slate-700 hover:bg-slate-100"
              onClick={() => logout()}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div className="space-y-1">
          <Label htmlFor="identifier" className="text-xs font-semibold text-slate-700">
            Usuario o Correo electrónico
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              id="identifier"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ej. usuario o tu@correo.com"
              className="pl-9 text-xs rounded-md border-slate-200"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9 text-xs rounded-md border-slate-200"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs py-2 shadow-sm"
          disabled={cargando}
        >
          {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 pt-1">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-slate-900 hover:underline">
          Crear cuenta nueva
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
