import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  titulo: string;
  valor: string;
  icon: LucideIcon;
  tendencia?: { valor: string; positiva: boolean };
  colorIcono?: string;
}

export function MetricCard({ titulo, valor, icon: Icon, tendencia, colorIcono = "text-primary" }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="mt-1 font-heading text-2xl font-bold">{valor}</p>
          {tendencia && (
            <p className={cn("mt-1 text-xs font-medium", tendencia.positiva ? "text-emerald-600" : "text-destructive")}>
              {tendencia.positiva ? "▲" : "▼"} {tendencia.valor}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-secondary", colorIcono)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
