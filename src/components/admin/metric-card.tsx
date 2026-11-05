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
  badgeBg = "bg-primary/10",
  badgeText = "text-primary",
}: MetricCardProps) {
  return (
    <Card className="rounded-lg border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="font-heading text-2xl font-bold text-foreground">{valor}</p>
          {descripcion && (
            <p className="text-xs text-muted-foreground">{descripcion}</p>
          )}
          {tendencia && (
            <p className={cn("text-xs font-semibold", tendencia.positiva ? "text-emerald-600" : "text-destructive")}>
              {tendencia.positiva ? "▲" : "▼"} {tendencia.valor}
            </p>
          )}
        </div>
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg shadow-sm border", badgeBg, badgeText)}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
