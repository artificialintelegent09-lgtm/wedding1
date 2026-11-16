"use client";

import { motion, type Variants } from "framer-motion";
import { MailOpen } from "lucide-react";
import Image from "next/image";
import { useInvitation } from "@/components/InvitationContext";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { luxe } from "@/lib/motion";
import { formatParts } from "@/lib/datetime";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.35 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: luxe } },
};

/** Both doors share one burgundy gradient that spans the full screen, so they read as a single surface. */
function doorStyle(side: "left" | "right") {
  return {
    backgroundImage:
      "radial-gradient(ellipse at center, #7b2038 0%, #5b1224 55%, #35081a 100%), var(--damask)",
    backgroundSize: "200% 100%, 96px 96px",
    backgroundPosition: `${side} center, 0 0`,
  } as const;
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none absolute w-[54vw] max-w-[360px] md:max-w-[440px] ${className}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.12 }}
      transition={{ duration: 1.6, ease: luxe, delay: 0.2 }}
    >
      <FloralCorner className="h-auto w-full origin-top-left motion-safe:animate-sway" />
    </motion.div>
  );
}

export function Cover({ onOpen }: { onOpen: () => void }) {
  const { data, copy, guestName } = useInvitation();
  const { bride, groom } = data.couple;
  const date = formatParts(data.weddingDate, data.locale, data.events[0]?.timeZone ?? "UTC");

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden text-paper"
      role="dialog"
      aria-modal="true"
      aria-label={`${bride.nickname} & ${groom.nickname}`}
    >
      {/* the two doors that part */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 border-r border-gold/60"
        style={doorStyle("left")}
        exit={{ x: "-101%" }}
        transition={{ duration: 1.35, ease: luxe, delay: 0.45 }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 border-l border-gold/60"
        style={doorStyle("right")}
        exit={{ x: "101%" }}
        transition={{ duration: 1.35, ease: luxe, delay: 0.45 }}
      />

      {/* frame + florals */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-gold/60 sm:inset-5"
        initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.6, ease: luxe }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18px] border border-gold/25 sm:inset-[30px]"
        initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.6, ease: luxe, delay: 0.15 }}
      />
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 -scale-x-100" />
      <Corner className="bottom-0 left-0 -scale-y-100" />
      <Corner className="bottom-0 right-0 -scale-100" />

      {/* content */}
      <motion.div
        className="absolute inset-0 z-10 overflow-y-auto overscroll-contain"
        exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.6, ease: "easeIn" } }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center px-8 py-14 text-center"
        >
          <motion.p variants={item} className="text-[0.7rem] font-light uppercase tracking-[0.5em] text-gold-light sm:text-xs">
            {copy.cover.kicker}
          </motion.p>

          <motion.div
            variants={item}
            className="relative mt-5 aspect-[3/4] h-[24svh] max-h-60 min-h-28 [@media(max-height:600px)]:hidden"
          >
            <div className="absolute -inset-2 rounded-t-full border border-gold/70" />
            <div className="absolute -inset-1 rounded-t-full border border-gold/35" />
            <div className="relative h-full w-full overflow-hidden rounded-t-full">
              <Image
                src={data.images.cover.src}
                alt={data.images.cover.alt}
                fill
                priority
                sizes="180px"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.h1 variants={item} className="mt-6 font-script text-[4.2rem] leading-[0.82] sm:text-8xl">
            <span className="block text-gold-gradient">{bride.nickname}</span>
            <span className="my-0.5 block text-3xl text-gold-light/80 sm:text-4xl">&amp;</span>
            <span className="block text-gold-gradient">{groom.nickname}</span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 font-display text-lg uppercase tracking-[0.32em] text-paper/90">
            {date.day} · {date.month} · {date.year}
          </motion.p>

          <motion.div variants={item} className="mt-7 min-h-[4.5rem]">
            <p className="text-[0.7rem] font-light uppercase tracking-[0.4em] text-gold-light/80">{copy.cover.dear}</p>
            <motion.p
              key={guestName || "fallback"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-1.5 break-words font-display text-2xl font-medium italic leading-tight text-paper sm:text-3xl"
            >
              {guestName || copy.cover.guestFallback}
            </motion.p>
          </motion.div>

          <motion.div variants={item} className="relative mt-8">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-gold motion-safe:animate-pulse-ring"
            />
            <button
              type="button"
              onClick={onOpen}
              className="relative inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full bg-gold-gradient px-9 text-sm font-medium uppercase tracking-[0.26em] text-deep shadow-[0_10px_40px_-10px_rgba(201,164,92,0.7)] transition-transform active:scale-95 motion-safe:animate-shimmer"
            >
              <MailOpen className="h-5 w-5" aria-hidden="true" />
              {copy.cover.open}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
