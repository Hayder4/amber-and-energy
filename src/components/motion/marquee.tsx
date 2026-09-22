export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-10 py-2">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm tracking-[0.25em] text-amber-300/70 whitespace-nowrap uppercase"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-amber-500/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
