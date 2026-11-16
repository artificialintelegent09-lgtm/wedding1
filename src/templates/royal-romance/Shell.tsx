"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { InvitationContext } from "@/components/InvitationContext";
import { getCopy } from "@/lib/i18n";
import { useGuestName } from "@/lib/use-guest-name";
import type { InvitationData } from "@/types/invitation";
import { FloatingNav } from "./FloatingNav";
import { Cover } from "./sections/Cover";

/**
 * Client boundary for the invitation: owns the cover's open/closed state,
 * locks scrolling while the cover is up, and provides context to descendants.
 * The sections themselves arrive as server-rendered `children`.
 */
export function Shell({ data, children }: { data: InvitationData; children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const guestName = useGuestName();
  const copy = getCopy(data.locale);

  useEffect(() => {
    if (opened) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [opened]);

  const open = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpened(true);
  }, []);

  return (
    // reducedMotion="user" removes transform/layout animation for people who ask for less motion.
    <MotionConfig reducedMotion="user">
      <InvitationContext.Provider value={{ data, copy, opened, guestName }}>
        <AnimatePresence>{!opened && <Cover key="cover" onOpen={open} />}</AnimatePresence>
        <main data-template="royal-romance" className="bg-paper font-sans text-ink">
          {children}
        </main>
        <FloatingNav />
      </InvitationContext.Provider>
    </MotionConfig>
  );
}
