import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { FloralSpray } from "@/components/ornaments/FloralSpray";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Monogram } from "@/components/ornaments/Monogram";
import { Photo } from "@/components/ui/Photo";
import { formatLongDate } from "@/lib/datetime";
import type { SectionProps } from "./types";

export function Closing({ data, copy }: SectionProps) {
  const { bride, groom } = data.couple;
  return (
    <section
      id="closing"
      className="relative isolate overflow-hidden bg-deep px-6 pb-32 pt-20 text-center text-paper sm:pb-36 sm:pt-28"
    >
      <Parallax amount={8} className="absolute inset-0 -z-20">
        <Photo asset={data.images.closing} sizes="100vw" />
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-deep via-deep/80 to-deep/90" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-damask opacity-60" aria-hidden="true" />

      <Reveal>
        <FloralSpray className="mx-auto h-auto w-[min(92vw,560px)] drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)]" />
      </Reveal>

      <div className="mx-auto mt-6 max-w-xl">
        <Reveal delay={0.1}>
          <p className="text-xs font-light uppercase tracking-[0.5em] text-gold-light">{copy.closing.kicker}</p>
          <p className="mt-6 font-display text-[1.4rem] italic leading-[1.65] text-paper/90 sm:text-2xl">
            {data.closing.message}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <GoldDivider />
          <p className="mt-8 font-script text-6xl leading-[0.95] text-gold-gradient sm:text-7xl">
            {bride.nickname}
            <span className="mx-3 text-4xl text-gold-light/80 sm:text-5xl">&amp;</span>
            {groom.nickname}
          </p>
          <p className="mt-6 font-display text-sm uppercase tracking-[0.4em] text-paper/70">
            {formatLongDate(data.weddingDate, data.locale, data.events[0]?.timeZone ?? "UTC")}
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-12">
          <Monogram monogram={data.couple.monogram} className="mx-auto w-24 text-[0.55rem]" />
        </Reveal>
      </div>
    </section>
  );
}
