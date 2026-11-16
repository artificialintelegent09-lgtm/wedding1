import { getRsvpChannel } from "@/lib/contact";
import { ParallaxLayer } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { RsvpForm } from "@/components/forms/RsvpForm";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { OrnateFrame } from "@/components/ui/OrnateFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SectionProps } from "./types";

export function Rsvp({ data, copy }: SectionProps) {
  if (!getRsvpChannel(data)) return null;
  return (
    <section id="rsvp" className="grain relative overflow-hidden bg-paper-2 px-5 py-24 sm:py-32">
      <ParallaxLayer distance={30} className="pointer-events-none absolute -left-12 top-0 w-56 opacity-90 sm:w-72">
        <FloralCorner className="h-auto w-full" />
      </ParallaxLayer>
      <ParallaxLayer distance={30} className="pointer-events-none absolute -right-12 bottom-0 w-56 -scale-100 opacity-90 sm:w-72">
        <FloralCorner className="h-auto w-full" />
      </ParallaxLayer>

      <div className="relative mx-auto max-w-xl">
        <SectionHeading eyebrow={copy.rsvp.eyebrow} title={copy.rsvp.title} />
        {data.rsvp?.message && (
          <Reveal className="mx-auto mt-6 max-w-md text-center">
            <p className="font-display text-xl italic text-ink/80">{data.rsvp?.message}</p>
          </Reveal>
        )}
        <Reveal className="mt-10" y={36}>
          <OrnateFrame className="bg-paper/80 shadow-[0_30px_70px_-40px_rgba(91,18,36,0.6)]" innerClassName="p-7 sm:p-10">
            <RsvpForm />
          </OrnateFrame>
        </Reveal>
      </div>
    </section>
  );
}
