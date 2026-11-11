"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import {
  filterNameInput,
  validateFullName,
  validateEmail,
  validatePassword,
} from "@/lib/validation";

export default function RegistroPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [cargando, setCargando] = useState(false);

  const [nombre, setNombre] = useState("");
  const [nombreError, setNombreError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const passValidation = validatePassword(password);
  const { rules } = passValidation;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let hasErrors = false;

    const rNombre = validateFullName(nombre);
    if (!rNombre.isValid) {
      setNombreError(rNombre.error || "Nombre no válido");
      hasErrors = true;
    } else {
      setNombreError(null);
    }

    const rEmail = validateEmail(email);
    if (!rEmail.isValid) {
      setEmailError(rEmail.error || "Correo no válido");
      hasErrors = true;
    } else {
      setEmailError(null);
    }

    const rPass = validatePassword(password);
    if (!rPass.isValid) {
      setPasswordError(rPass.error || "La contraseña no cumple con los requisitos de seguridad.");
      hasErrors = true;
    } else {
      setPasswordError(null);
    }

    if (hasErrors) return;

    setCargando(true);

    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: rNombre.formatted || nombre,
          email: rEmail.formatted || email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setEmailError(data.error || "No se pudo registrar la cuenta.");
        setCargando(false);
        return;
      }

      login(data.user);
      router.push("/");
    } catch (err) {
      console.error(err);
      setEmailError("Error de conexión al registrar cuenta.");
      setCargando(false);
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-2xl font-bold">Crear cuenta</h1>
      <p className="mb-6 text-sm text-muted-foreground">Únete a la comunidad Xiorizos</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            name="nombre"
            required
            value={nombre}
            onChange={(e) => {
              setNombre(filterNameInput(e.target.value));
              if (nombreError) setNombreError(null);
            }}
            placeholder="Ej. Sofía Marín"
            className={nombreError ? "border-destructive" : ""}
          />
          {nombreError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {nombreError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            placeholder="tucorreo@ejemplo.com"
            className={emailError ? "border-destructive" : ""}
          />
          {emailError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {emailError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={mostrarPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              placeholder="Ej. SofiRizos2026$"
              className={`pr-10 ${passwordError ? "border-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              tabIndex={-1}
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {passwordError && (
            <p className="text-xs text-destructive flex items-center gap-1 pt-0.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {passwordError}
            </p>
          )}

          {/* Requisitos visuales en tiempo real */}
          <div className="mt-2 rounded-lg border border-border/80 bg-muted/40 p-2.5 text-[11px] space-y-1">
            <p className="font-semibold text-foreground text-xs mb-1">Requisitos de seguridad:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
              <p
                className={`flex items-center gap-1.5 transition-colors ${
                  rules.minLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {rules.minLength ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[3]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 ml-0.5 mr-1" />
                )}
                <span>Mínimo 8 caracteres</span>
              </p>

              <p
                className={`flex items-center gap-1.5 transition-colors ${
                  rules.hasUpper ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {rules.hasUpper ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[3]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 ml-0.5 mr-1" />
                )}
                <span>Una letra mayúscula (A-Z)</span>
              </p>

              <p
                className={`flex items-center gap-1.5 transition-colors ${
                  rules.hasLower ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {rules.hasLower ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[3]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 ml-0.5 mr-1" />
                )}
                <span>Una letra minúscula (a-z)</span>
              </p>

              <p
                className={`flex items-center gap-1.5 transition-colors ${
                  rules.hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {rules.hasNumber ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[3]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 ml-0.5 mr-1" />
                )}
                <span>Al menos un número (0-9)</span>
              </p>

              <p
                className={`flex items-center gap-1.5 sm:col-span-2 transition-colors ${
                  rules.hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"
                }`}
              >
                {rules.hasSpecial ? (
                  <Check className="h-3 w-3 shrink-0 stroke-[3]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 ml-0.5 mr-1" />
                )}
                <span>Un símbolo o caracter (!@#$%^&*...)</span>
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={cargando}>
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
