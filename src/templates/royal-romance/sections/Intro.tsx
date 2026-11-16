import { ParallaxLayer } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { FloralSpray } from "@/components/ornaments/FloralSpray";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Monogram } from "@/components/ornaments/Monogram";
import type { SectionProps } from "./types";

export function Intro({ data }: SectionProps) {
  const { intro, couple } = data;
  return (
    <section
      id="intro"
      className="grain relative bg-paper bg-damask-light px-6 pb-24 pt-28 text-center sm:pb-32 sm:pt-36"
    >
      {/* garland straddling the hero edge */}
      <ParallaxLayer distance={14} className="pointer-events-none absolute left-1/2 top-0 z-10 w-[min(96vw,640px)] -translate-x-1/2 -translate-y-[52%]">
        <FloralSpray className="h-auto w-full drop-shadow-[0_14px_20px_rgba(53,8,26,0.35)]" />
      </ParallaxLayer>

      <div className="mx-auto max-w-2xl">
        <Reveal>
          <Monogram monogram={couple.monogram} className="mx-auto w-28 text-[0.65rem] sm:w-32" />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <blockquote>
            <p className="font-display text-[1.45rem] italic leading-[1.6] text-primary sm:text-3xl sm:leading-[1.55]">
              “{intro.quote}”
            </p>
            {intro.quoteSource && (
              <footer className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-gold-deep">
                — {intro.quoteSource}
              </footer>
            )}
          </blockquote>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <GoldDivider />
        </Reveal>

        <Reveal delay={0.2} className="mt-8">
          <p className="mx-auto max-w-lg text-[0.98rem] font-light leading-[1.9] text-ink/80 sm:text-lg">
            {intro.message}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
