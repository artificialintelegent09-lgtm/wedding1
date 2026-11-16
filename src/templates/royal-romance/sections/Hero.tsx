"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useInvitation } from "@/components/InvitationContext";
import { Parallax, ParallaxLayer } from "@/components/motion/Parallax";
import { FallingPetals } from "@/components/ornaments/FallingPetals";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Photo } from "@/components/ui/Photo";
import { formatParts } from "@/lib/datetime";
import { luxe } from "@/lib/motion";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 1.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxe } },
};

export function Hero() {
  const { data, copy, opened } = useInvitation();
  const { bride, groom } = data.couple;
  const date = formatParts(data.weddingDate, data.locale, data.events[0]?.timeZone ?? "UTC");
  const state = opened ? "show" : "hidden";

  return (
    <section
      id="home"
      aria-label={`${bride.nickname} & ${groom.nickname}`}
      className="relative isolate min-h-[100svh] overflow-hidden bg-deep text-paper"
    >
      {/* burgundy damask panel (visible beside the photo on desktop) */}
      <div className="absolute inset-0 -z-20 bg-primary bg-damask" aria-hidden="true" />

      {/* photograph: full-bleed on mobile, an arched window on desktop */}
      <div className="absolute inset-0 -z-10 lg:inset-auto lg:bottom-[8%] lg:right-[7%] lg:top-[8%] lg:w-[38%]">
        <div
          aria-hidden="true"
          className="absolute -inset-3 hidden rounded-t-full border border-gold/70 lg:block"
        />
        <div
          aria-hidden="true"
          className="absolute -inset-[7px] hidden rounded-t-full border border-gold/30 lg:block"
        />
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.18 }}
          animate={{ scale: opened ? 1 : 1.18 }}
          transition={{ duration: 3, ease: luxe, delay: 0.3 }}
        >
          <Parallax amount={9} className="absolute inset-0 lg:rounded-t-full">
            <Photo asset={data.images.hero} sizes="(min-width: 1024px) 40vw, 100vw" priority />
          </Parallax>
        </motion.div>
        {/* readability gradient for mobile text */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/55 via-35% to-deep/10 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/60 to-transparent to-25% lg:hidden" />
      </div>

      {/* florals */}
      <ParallaxLayer distance={30} className="pointer-events-none absolute left-0 top-0 w-[52vw] max-w-[320px] lg:max-w-[460px]">
        <FloralCorner className="h-auto w-full origin-top-left motion-safe:animate-sway" />
      </ParallaxLayer>
      <ParallaxLayer distance={30} className="pointer-events-none absolute right-0 top-0 w-[52vw] max-w-[320px] -scale-x-100 lg:max-w-[360px]">
        <FloralCorner className="h-auto w-full origin-top-left motion-safe:animate-sway" />
      </ParallaxLayer>
      <ParallaxLayer distance={30} className="pointer-events-none absolute bottom-0 left-0 hidden w-[360px] -scale-y-100 lg:block">
        <FloralCorner className="h-auto w-full origin-top-left motion-safe:animate-sway" />
      </ParallaxLayer>

      <FallingPetals />

      {/* inset frame */}
      <div className="pointer-events-none absolute inset-3 border border-gold/45 sm:inset-5" aria-hidden="true" />

      {/* text */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={state}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-6 pb-28 pt-36 text-center lg:w-[58%] lg:justify-center lg:pb-10 lg:pt-10"
      >
        <motion.p variants={rise} className="text-[0.7rem] font-light uppercase tracking-[0.5em] text-gold-light sm:text-xs">
          {copy.hero.kicker}
        </motion.p>

        <motion.h1 variants={rise} className="mt-5 font-script leading-[0.85] text-gold-gradient">
          <span className="block text-[5.2rem] sm:text-[7rem] lg:text-[8.5rem]">{bride.nickname}</span>
          <span className="my-1 block text-4xl text-gold-light/80 sm:text-5xl">&amp;</span>
          <span className="block text-[5.2rem] sm:text-[7rem] lg:text-[8.5rem]">{groom.nickname}</span>
        </motion.h1>

        <motion.div variants={rise} className="mt-7">
          <GoldDivider />
          <p className="mt-4 font-display text-[0.8rem] uppercase tracking-[0.42em] text-paper/80 sm:text-sm">
            {date.weekday}
          </p>
          <p className="mt-1 font-display text-3xl font-medium uppercase tracking-[0.26em] text-paper sm:text-4xl">
            {date.day} {date.month}
          </p>
          <p className="mt-1 font-display text-xl tracking-[0.5em] text-gold-light">{date.year}</p>
        </motion.div>

        <motion.a
          variants={rise}
          href="#intro"
          aria-label={copy.hero.scroll}
          className="mt-8 flex flex-col items-center gap-1 text-[0.65rem] uppercase tracking-[0.4em] text-gold-light/80 transition-colors hover:text-gold-light"
        >
          {copy.hero.scroll}
          <ChevronDown className="h-5 w-5 motion-safe:animate-float" aria-hidden="true" />
        </motion.a>
      </motion.div>
    </section>
  );
}
