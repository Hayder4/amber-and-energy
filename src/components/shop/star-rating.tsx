import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={14}
            className={filled ? "fill-amber-400 text-amber-400" : "text-amber-800/60"}
          />
        );
      })}
    </div>
  );
}
