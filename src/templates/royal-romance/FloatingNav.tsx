"use client";

import { motion } from "framer-motion";
import { CalendarHeart, Gift, Heart, House, Images, Mail, MessageCircleHeart, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInvitation } from "@/components/InvitationContext";
import { getRsvpChannel, showWishes } from "@/lib/contact";
import { luxe } from "@/lib/motion";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Floating dock: a slim burgundy slip with a fine gold double rule, inset from the screen edges
 * so it never reads as a full-width bar. Every section is one 44px tap target; the current
 * section is an ivory chip that also shows its label. Below 380px the label is dropped so
 * seven icons always fit without crowding.
 */
export function FloatingNav() {
  const { data, copy, opened } = useInvitation();
  const [active, setActive] = useState("home");

  const items: NavItem[] = [
    { id: "home", label: copy.nav.home, icon: House },
    { id: "couple", label: copy.nav.couple, icon: Heart },
    { id: "events", label: copy.nav.events, icon: CalendarHeart },
    { id: "gallery", label: copy.nav.gallery, icon: Images },
    ...(data.gift ? [{ id: "gift", label: copy.nav.gift, icon: Gift }] : []),
    ...(getRsvpChannel(data) ? [{ id: "rsvp", label: copy.nav.rsvp, icon: Mail }] : []),
    ...(showWishes(data) ? [{ id: "wishes", label: copy.nav.wishes, icon: MessageCircleHeart }] : []),
  ];
  const idsKey = items.map((i) => i.id).join();

  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      // A section becomes "current" when it crosses the middle of the viewport.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of idsKey.split(",")) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [opened, idsKey]);

  return (
    <motion.nav
      aria-label={copy.nav.label}
      initial={{ y: 90, opacity: 0 }}
      animate={opened ? { y: 0, opacity: 1 } : { y: 90, opacity: 0 }}
      transition={{ duration: 0.9, ease: luxe, delay: opened ? 1.8 : 0 }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <ul className="pointer-events-auto relative flex w-full max-w-md items-center justify-between border border-gold/45 bg-deep p-1 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.75)] lg:w-auto lg:max-w-none lg:gap-1.5 lg:p-1.5">
        {/* second, finer rule inside the first: the stationery double border */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-[3px] border border-gold/15" />
        {items.map(({ id, label, icon: Icon }) => {
          const current = active === id;
          return (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                aria-label={label}
                aria-current={current ? "location" : undefined}
                className={`flex h-11 items-center justify-center transition-colors duration-500 ${
                  current ? "gap-2 bg-paper px-3 text-primary" : "w-9 text-gold-light/70 hover:text-paper lg:w-11"
                }`}
              >
                <Icon className="h-[1.1rem] w-[1.1rem] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {current && (
                  <span className="hidden whitespace-nowrap text-[0.62rem] font-normal uppercase tracking-[0.18em] min-[380px]:inline">
                    {label}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
