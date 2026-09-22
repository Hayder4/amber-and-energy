import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`mb-12 flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start text-start"
      } md:flex-row md:items-end md:justify-between`}
    >
      <Reveal>
        <div>
          <h2 className="font-display text-3xl text-foreground md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 max-w-xl text-sm text-muted md:text-base">{subtitle}</p>}
        </div>
      </Reveal>
      {viewAllHref && (
        <Reveal delay={0.1}>
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-amber-300 underline decoration-amber-500/40 underline-offset-4 hover:text-amber-200"
          >
            {viewAllLabel}
          </Link>
        </Reveal>
      )}
    </div>
  );
}
