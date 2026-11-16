/** Circular monogram: initials joined by a script ampersand inside a double gold ring. */
export function Monogram({
  monogram,
  className = "",
}: {
  monogram: string;
  className?: string;
}) {
  const [a = "", b = ""] = monogram.split("&").map((s) => s.trim());
  return (
    <div
      className={`relative grid aspect-square place-items-center ${className}`}
      role="img"
      aria-label={`${a} and ${b}`}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="100" cy="100" r="97" fill="none" stroke="#c9a45c" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="91" fill="none" stroke="#c9a45c" strokeWidth="0.6" strokeOpacity=".7" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#c9a45c" strokeWidth="0.5" strokeDasharray="1.5 4.5" strokeLinecap="round" />
        {[0, 90, 180, 270].map((r) => (
          <path
            key={r}
            transform={`rotate(${r} 100 100)`}
            d="M100 -1l3.6 4.6L100 8l-3.6-4.4z"
            fill="#c9a45c"
          />
        ))}
      </svg>
      <div className="relative flex items-baseline gap-[0.08em] font-display leading-none text-gold-gradient">
        <span className="text-[2.6em] font-medium">{a}</span>
        <span className="font-script text-[2em] -translate-y-[0.1em]">&amp;</span>
        <span className="text-[2.6em] font-medium">{b}</span>
      </div>
    </div>
  );
}
