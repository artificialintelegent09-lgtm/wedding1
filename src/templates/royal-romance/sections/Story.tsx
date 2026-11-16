"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useInvitation } from "@/components/InvitationContext";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StoryMoment } from "@/types/invitation";

function Moment({ moment, index }: { moment: StoryMoment; index: number }) {
  const flip = index % 2 === 1;
  return (
    <li className="relative grid gap-5 pl-12 md:grid-cols-2 md:gap-16 md:pl-0">
      {/* marker on the spine */}
      <span
        aria-hidden="true"
        className="absolute left-[11px] top-2 grid h-[18px] w-[18px] -translate-x-1/2 place-items-center rounded-full border border-gold bg-paper md:left-1/2"
      >
        <span className="h-2 w-2 rotate-45 bg-gold" />
      </span>

      {moment.image && (
        <ImageReveal
          from={flip ? "right" : "left"}
          className={`relative aspect-[4/3] w-full max-w-md justify-self-start md:aspect-square ${
            flip ? "md:col-start-2 md:justify-self-start" : "md:col-start-1 md:justify-self-end"
          } md:row-start-1`}
        >
          <Photo asset={moment.image} sizes="(min-width: 768px) 28rem, 80vw" />
        </ImageReveal>
      )}

      <Reveal
        x={flip ? 24 : -24}
        y={0}
        className={`self-center md:row-start-1 ${flip ? "md:col-start-1 md:text-right" : "md:col-start-2 md:text-left"}`}
      >
        <p className="font-script text-4xl leading-none text-gold-gradient">{moment.date}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.14em] text-primary sm:text-3xl">
          {moment.title}
        </h3>
        <p className="mt-3 max-w-md font-light leading-[1.85] text-ink/80 md:inline-block">{moment.body}</p>
      </Reveal>
    </li>
  );
}

export function Story() {
  const { data, copy } = useInvitation();
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const moments = data.story ?? [];

  return (
    <section id="story" className="grain relative overflow-hidden bg-paper px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow={copy.story.eyebrow} title={copy.story.title} />

        <ol ref={listRef} className="relative mt-16 space-y-16 md:space-y-24">
          {/* spine: faint track + a gold line that draws as you scroll */}
          <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px -translate-x-1/2 bg-gold-deep/20 md:left-1/2" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-0 left-[11px] top-0 w-px origin-top -translate-x-1/2 bg-gold md:left-1/2"
            style={{ scaleY: reduce ? 1 : scaleY }}
          />
          {moments.map((m, i) => (
            <Moment key={m.title} moment={m} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
