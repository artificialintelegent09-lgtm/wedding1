"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useInvitation } from "@/components/InvitationContext";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import type { WeddingEvent } from "@/types/invitation";

export function AddToCalendar({ event }: { event: WeddingEvent }) {
  const { data, copy } = useInvitation();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const headline = `${data.couple.bride.nickname} & ${data.couple.groom.nickname}`;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex min-h-11 w-full items-center px-5 text-left text-sm tracking-wide text-paper transition-colors hover:bg-gold/15 focus-visible:bg-gold/15";

  return (
    <div ref={wrapper} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/70 px-5 text-xs font-medium uppercase tracking-[0.2em] text-gold-light transition-colors hover:bg-gold hover:text-deep"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        {copy.events.addToCalendar}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 z-20 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-lg border border-gold/50 bg-deep/95 py-1 shadow-2xl shadow-black/40 backdrop-blur"
          >
            <a
              href={googleCalendarUrl(event, headline)}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              {copy.events.googleCalendar}
            </a>
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                downloadIcs(event, headline, data.slug);
                setOpen(false);
              }}
            >
              {copy.events.downloadIcs}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
