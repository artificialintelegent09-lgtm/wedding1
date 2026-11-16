import { Clock, Heart, MapPin, Shirt, Sparkles } from "lucide-react";
import { ParallaxLayer } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { FloralCorner } from "@/components/ornaments/FloralCorner";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import { Countdown } from "@/components/ui/Countdown";
import { OrnateFrame } from "@/components/ui/OrnateFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatParts, formatTimeRange } from "@/lib/datetime";
import type { WeddingEvent } from "@/types/invitation";
import type { SectionProps } from "./types";

function EventCard({ event, data, copy }: { event: WeddingEvent; data: SectionProps["data"]; copy: SectionProps["copy"] }) {
  const parts = formatParts(event.startsAt, data.locale, event.timeZone);
  const Icon = event.kind === "reception" ? Sparkles : Heart;

  return (
    <OrnateFrame className="h-full" innerClassName="flex h-full flex-col items-center px-6 py-10 text-center sm:px-9 sm:py-12">
      <Icon className="h-7 w-7 text-gold" strokeWidth={1.2} aria-hidden="true" />
      <h3 className="mt-3 font-display text-3xl font-medium uppercase tracking-[0.2em] text-gold-light sm:text-4xl">
        {event.title}
      </h3>

      <div className="mt-7 flex items-center justify-center gap-5 text-paper">
        <div className="text-right">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-paper/70">{parts.weekday}</p>
        </div>
        <p className="font-display text-7xl font-medium leading-none text-gold-gradient sm:text-8xl">{parts.day}</p>
        <div className="text-left">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-paper/70">{parts.month}</p>
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-paper/70">{parts.year}</p>
        </div>
      </div>

      <p className="mt-6 inline-flex items-center gap-2 text-sm tracking-[0.12em] text-paper">
        <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
        <time dateTime={event.startsAt}>
          {formatTimeRange(event.startsAt, event.endsAt, data.locale, event.timeZone, event.timezoneLabel)}
        </time>
      </p>

      <div className="mx-auto my-6 h-px w-16 bg-gold/50" aria-hidden="true" />

      <p className="font-display text-2xl font-medium text-paper">{event.venue.name}</p>
      <p className="mt-2 inline-flex max-w-xs items-start gap-1.5 text-sm font-light leading-relaxed text-paper/75">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <span>{event.venue.address}</span>
      </p>

      {event.note && <p className="mt-4 font-display text-lg italic text-paper/80">{event.note}</p>}
      {event.dressCode && (
        <p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold-light">
          <Shirt className="h-4 w-4" aria-hidden="true" />
          <span>
            <span className="text-paper/60">{copy.events.dressCode}:</span> {event.dressCode}
          </span>
        </p>
      )}

      <div className="mt-auto flex flex-col items-center gap-3 pt-8 sm:flex-row">
        <a
          href="#location"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 text-xs font-medium uppercase tracking-[0.2em] text-deep transition-colors hover:bg-gold-light"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {copy.events.viewMap}
        </a>
        <AddToCalendar event={event} />
      </div>
    </OrnateFrame>
  );
}

export function Events({ data, copy }: SectionProps) {
  return (
    <section id="events" className="relative isolate overflow-hidden bg-deep bg-damask px-5 py-24 text-paper sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(123,32,56,0.7),transparent_65%)]" aria-hidden="true" />
      <ParallaxLayer distance={30} className="pointer-events-none absolute -right-8 -top-6 -z-0 w-56 -scale-x-100 opacity-80 sm:w-72">
        <FloralCorner className="h-auto w-full" />
      </ParallaxLayer>

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading eyebrow={copy.events.eyebrow} title={copy.events.title} tone="light" />

        <Reveal className="mt-12">
          <Countdown target={data.weddingDate} />
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-8">
          {data.events.map((event, i) => (
            <Reveal key={event.id} delay={i * 0.15} y={40} className="h-full">
              <EventCard event={event} data={data} copy={copy} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
