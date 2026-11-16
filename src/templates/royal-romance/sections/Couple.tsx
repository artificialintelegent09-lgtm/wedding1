import { AtSign } from "lucide-react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ParallaxLayer } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Person } from "@/types/invitation";
import type { SectionProps } from "./types";

function Profile({ person, side }: { person: Person; side: "left" | "right" }) {
  return (
    <article className="relative flex flex-col items-center text-center">
      <div className="relative w-[min(70vw,300px)]">
        {/* arch outlines, outside the clipped photo */}
        <div aria-hidden="true" className="absolute -inset-2.5 rounded-t-full border border-gold/70" />
        <div aria-hidden="true" className="absolute -inset-1 rounded-t-full border border-gold/35" />
        <ImageReveal from={side} className="relative aspect-[3/4] rounded-t-full">
          <Photo asset={person.photo} sizes="(min-width: 1024px) 300px, 70vw" />
        </ImageReveal>
      </div>
      <Reveal className="-mt-10 w-full">
        <div className="relative mx-auto max-w-sm bg-paper px-6 pb-2 pt-8">
          <h3 className="font-script text-6xl leading-none text-gold-gradient sm:text-7xl">{person.nickname}</h3>
          <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.16em] text-primary sm:text-2xl">
            {person.fullName}
          </p>
          <GoldDivider className="my-4" />
          <p className="text-xs font-light uppercase tracking-[0.28em] text-muted">{person.childOf}</p>
          <p className="mt-2 font-display text-lg leading-snug text-ink">
            {person.fatherName}
            <span className="mx-1.5 text-gold">&amp;</span>
            {person.motherName}
          </p>
          {person.instagram && (
            <a
              href={`https://instagram.com/${person.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm tracking-wide text-gold-deep underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              <AtSign className="h-4 w-4" aria-hidden="true" />
              {person.instagram}
            </a>
          )}
        </div>
      </Reveal>
    </article>
  );
}

export function Couple({ data, copy }: SectionProps) {
  const { bride, groom } = data.couple;
  return (
    <section id="couple" className="grain relative overflow-hidden bg-paper-2 px-6 py-24 sm:py-32">
      <ParallaxLayer distance={40} className="pointer-events-none absolute -left-8 -top-2 w-32 opacity-90 sm:-left-10 sm:top-10 sm:w-80">
        <FloralCorner className="h-auto w-full" />
      </ParallaxLayer>
      <ParallaxLayer distance={40} className="pointer-events-none absolute -right-10 bottom-10 w-60 -scale-100 opacity-90 sm:w-80">
        <FloralCorner className="h-auto w-full" />
      </ParallaxLayer>

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading eyebrow={copy.couple.eyebrow} title={copy.couple.title} />

        <div className="mt-16 grid items-start gap-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <Profile person={bride} side="left" />

          <Reveal className="hidden self-center lg:block">
            <span className="font-script text-8xl text-gold-gradient">{copy.couple.and}</span>
          </Reveal>
          <Reveal className="text-center font-script text-6xl text-gold-gradient lg:hidden">{copy.couple.and}</Reveal>

          <div className="lg:mt-28">
            <Profile person={groom} side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
