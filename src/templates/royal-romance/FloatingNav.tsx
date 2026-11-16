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

/** Bottom navigation pill: thumb-reachable on phones, labelled on larger screens. */
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
      transition={{ duration: 0.9, ease: luxe, delay: opened ? 1.6 : 0 }}
      className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3"
    >
      <ul className="pointer-events-auto flex max-w-full items-center gap-0.5 rounded-full border border-gold/45 bg-deep/85 p-1.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {items.map(({ id, label, icon: Icon }) => {
          const current = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-label={label}
                aria-current={current ? "location" : undefined}
                className={`flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                  current ? "bg-gold text-deep" : "text-gold-light/85 hover:bg-gold/15"
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} aria-hidden="true" />
                <span className={current ? "hidden lg:inline" : "hidden xl:inline"}>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
