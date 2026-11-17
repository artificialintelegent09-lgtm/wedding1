"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useInvitation } from "@/components/InvitationContext";
import { getTimeZone, toDate } from "@/lib/datetime";
import { useNowSeconds } from "@/lib/use-now";

function Unit({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? "––" : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center px-1 first:pl-0 last:pr-0">
      <div className="relative flex h-14 items-center overflow-hidden sm:h-24">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="font-display text-[2.3rem] font-normal tabular-nums leading-none tracking-[-0.03em] text-paper sm:text-7xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[0.58rem] font-normal uppercase tracking-[0.3em] text-gold-light sm:text-xs">{label}</span>
    </div>
  );
}

/**
 * Counts down to `target` using the live clock (recomputed every second from Date.now()).
 * Both timestamps come from the invitation data; one without a UTC offset is read in the
 * invitation's own zone (Asia/Jakarta by default), never the visitor's device zone.
 *
 * Three states, never a negative number:
 *  - before `target`: the four-unit countdown,
 *  - from `target` until `end`: "celebration has begun",
 *  - after `end`: a thank-you line.
 */
export function Countdown({ target, end }: { target: string; end?: string }) {
  const { copy, data } = useInvitation();
  const timeZone = getTimeZone(data);
  const now = useNowSeconds();

  const startSec = Math.floor(toDate(target, timeZone).getTime() / 1000);
  const endSec = end ? Math.floor(toDate(end, timeZone).getTime() / 1000) : startSec;

  // A malformed date in the data would otherwise render "NaN": show nothing instead.
  if (!Number.isFinite(startSec)) return null;

  if (now !== null && now >= startSec) {
    const live = now < endSec;
    return (
      <p className="text-center font-display text-3xl italic text-gold-light" role="status">
        {live ? copy.events.started : copy.events.ended}
      </p>
    );
  }

  const remaining = now === null ? null : startSec - now;
  const d = remaining === null ? null : Math.floor(remaining / 86400);
  const h = remaining === null ? null : Math.floor((remaining % 86400) / 3600);
  const m = remaining === null ? null : Math.floor((remaining % 3600) / 60);
  const s = remaining === null ? null : remaining % 60;

  return (
    <>
      <div role="timer" aria-label={copy.events.countdownLabel} className="mx-auto grid max-w-md grid-cols-4 divide-x divide-gold/30 sm:max-w-2xl">
        <Unit value={d} label={copy.events.days} />
        <Unit value={h} label={copy.events.hours} />
        <Unit value={m} label={copy.events.minutes} />
        <Unit value={s} label={copy.events.seconds} />
      </div>
      <p className="mt-5 text-center text-[0.66rem] uppercase tracking-[0.34em] text-paper/60">{copy.events.countdownLabel}</p>
    </>
  );
}
