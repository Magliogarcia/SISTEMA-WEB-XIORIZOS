import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  titulo: string;
  valor: string;
  icon: LucideIcon;
  descripcion?: string;
  tendencia?: { valor: string; positiva: boolean };
  badgeBg?: string;
  badgeText?: string;
}

export function MetricCard({
  titulo,
  valor,
  icon: Icon,
  descripcion,
  tendencia,
  badgeBg = "bg-slate-100",
  badgeText = "text-slate-700",
}: MetricCardProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{titulo}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight font-sans">{valor}</p>
          {descripcion && (
            <p className="text-xs text-slate-500 font-normal">{descripcion}</p>
          )}
          {tendencia && (
            <p className={cn("text-xs font-semibold", tendencia.positiva ? "text-emerald-600" : "text-rose-600")}>
              {tendencia.positiva ? "▲" : "▼"} {tendencia.valor}
            </p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-md border", badgeBg, badgeText)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
