import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-none border border-gold-deep/45 bg-white/55 px-4 py-3 font-sans text-base text-ink placeholder:text-muted/60 transition-colors focus:border-gold-deep focus:bg-white/80 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-gold/40 aria-[invalid=true]:border-red-700/70 aria-[invalid=true]:bg-red-50/60";

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {label}
        </label>
        {hint && <span className="text-xs font-light text-muted">{hint}</span>}
      </div>
      {children}
      <p id={`${id}-error`} role={error ? "alert" : undefined} className="mt-1.5 min-h-[1.1rem] text-sm text-red-800">
        {error}
      </p>
    </div>
  );
}

export function SubmitButton({ idle, icon }: { idle: string; icon?: ReactNode }) {
  return (
    <button
      type="submit"
      className="group relative inline-flex min-h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-8 text-sm font-medium uppercase tracking-[0.24em] text-gold-light transition-colors hover:bg-primary-soft"
    >
      <span className="pointer-events-none absolute inset-0 bg-gold-gradient opacity-0 mix-blend-soft-light transition-opacity group-hover:opacity-60 motion-safe:animate-shimmer" aria-hidden="true" />
      <span className="relative inline-flex items-center gap-2.5">
        {icon}
        {idle}
      </span>
    </button>
  );
}
