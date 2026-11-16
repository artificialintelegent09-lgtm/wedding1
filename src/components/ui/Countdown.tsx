"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useInvitation } from "@/components/InvitationContext";
import { useNowSeconds } from "@/lib/use-now";

function Unit({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? "––" : String(value).padStart(2, "0");
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex h-[4.4rem] w-[4.4rem] items-center justify-center overflow-hidden rounded-t-full border border-gold/60 bg-deep/40 backdrop-blur-sm sm:h-24 sm:w-24">
        <div className="pointer-events-none absolute inset-[3px] rounded-t-full border border-gold/25" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="font-display text-3xl font-medium tabular-nums text-gold-light sm:text-4xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[0.62rem] font-light uppercase tracking-[0.28em] text-paper/75 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ target }: { target: string }) {
  const { copy } = useInvitation();
  const now = useNowSeconds();

  const remaining = now === null ? null : Math.max(0, Math.floor(new Date(target).getTime() / 1000) - now);
  const started = remaining === 0;

  const d = remaining === null ? null : Math.floor(remaining / 86400);
  const h = remaining === null ? null : Math.floor((remaining % 86400) / 3600);
  const m = remaining === null ? null : Math.floor((remaining % 3600) / 60);
  const s = remaining === null ? null : remaining % 60;

  if (started) {
    return (
      <p className="text-center font-script text-3xl text-gold-light" role="status">
        {copy.events.started}
      </p>
    );
  }

  return (
    <div role="timer" aria-label={copy.events.countdownLabel}>
      <div className="flex items-start justify-center gap-2.5 sm:gap-5">
        <Unit value={d} label={copy.events.days} />
        <Unit value={h} label={copy.events.hours} />
        <Unit value={m} label={copy.events.minutes} />
        <Unit value={s} label={copy.events.seconds} />
      </div>
    </div>
  );
}
