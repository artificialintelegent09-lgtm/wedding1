import { showWishes } from "@/lib/contact";
import { Reveal } from "@/components/motion/Reveal";
import { Guestbook } from "@/components/forms/Guestbook";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SectionProps } from "./types";

export function Wishes({ data, copy }: SectionProps) {
  if (!showWishes(data)) return null;
  return (
    <section id="wishes" className="grain relative bg-paper bg-damask-light px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={copy.wishes.eyebrow} title={copy.wishes.title} />
        <Reveal className="mt-14" y={30}>
          <Guestbook />
        </Reveal>
      </div>
    </section>
  );
}
