import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  nombre: string;
  rol?: string;
  calificacion: number;
  comentario: string;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const iniciales = testimonial.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="relative h-full">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <Quote className="h-6 w-6 text-primary/30" />

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {testimonial.comentario}
        </p>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < testimonial.calificacion
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {iniciales}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{testimonial.nombre}</p>
            {testimonial.rol && (
              <p className="text-xs text-muted-foreground">{testimonial.rol}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
