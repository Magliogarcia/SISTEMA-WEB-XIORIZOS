import type { LucideIcon } from "lucide-react";
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
  badgeText = "text-slate-800",
}: MetricCardProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{titulo}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{valor}</p>
          {descripcion && (
            <p className="text-xs font-semibold text-slate-500">{descripcion}</p>
          )}
          {tendencia && (
            <p className={cn("text-xs font-black", tendencia.positiva ? "text-emerald-700" : "text-rose-700")}>
              {tendencia.positiva ? "▲" : "▼"} {tendencia.valor}
            </p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-md border shadow-xs", badgeBg, badgeText)}>
          <Icon className="h-5 w-5 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
}
