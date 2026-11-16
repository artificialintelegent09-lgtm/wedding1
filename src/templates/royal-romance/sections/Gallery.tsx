"use client";

import { useState } from "react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Lightbox } from "@/components/ui/Lightbox";
import { Photo } from "@/components/ui/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useInvitation } from "@/components/InvitationContext";

export function Gallery() {
  const { data, copy } = useInvitation();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative isolate overflow-hidden bg-deep px-4 py-24 text-paper sm:px-8 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-damask opacity-70" aria-hidden="true" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={copy.gallery.eyebrow} title={copy.gallery.title} tone="light" />

        {/* masonry: CSS columns keep each photo's own proportions, so mixed tall/wide/square shots compose naturally */}
        <ul className="mt-14 columns-2 gap-3 sm:gap-5 lg:columns-3 lg:gap-6">
          {data.gallery.map((image, i) => (
            <li key={image.src} className="mb-3 break-inside-avoid sm:mb-5 lg:mb-6">
              <Reveal delay={(i % 3) * 0.08} y={36}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`${copy.gallery.open}: ${image.alt}`}
                  className="group relative block w-full border border-gold/40 p-1 transition-colors hover:border-gold sm:p-1.5"
                >
                  <ImageReveal className="relative" delay={(i % 3) * 0.08}>
                    <div className="relative w-full" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                      <Photo
                        asset={image}
                        sizes="(min-width: 1152px) 360px, (min-width: 640px) 33vw, 50vw"
                        className="transition-transform duration-[900ms] ease-out group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-deep/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                  </ImageReveal>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox images={data.gallery} index={active} onChange={setActive} />
    </section>
  );
}
