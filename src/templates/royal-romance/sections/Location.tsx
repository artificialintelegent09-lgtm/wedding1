import { Clock, MapPin, Navigation } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatTimeRange } from "@/lib/datetime";
import type { Venue, WeddingEvent } from "@/types/invitation";
import type { SectionProps } from "./types";

/** Events that share a physical place are presented together under one map. */
function groupByVenue(events: WeddingEvent[]) {
  const groups = new Map<string, { venue: Venue; events: WeddingEvent[] }>();
  for (const event of events) {
    const key = event.venue.mapsQuery;
    const group = groups.get(key);
    if (group) group.events.push(event);
    else groups.set(key, { venue: event.venue, events: [event] });
  }
  return [...groups.values()];
}

export function Location({ data, copy }: SectionProps) {
  const groups = groupByVenue(data.events);

  return (
    <section id="location" className="grain relative bg-paper bg-damask-light px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow={copy.location.eyebrow} title={copy.location.title} />

        <div className="mt-14 space-y-20">
          {groups.map(({ venue, events }) => (
            <div key={venue.mapsQuery} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className="order-2 text-center lg:order-1 lg:text-left">
                <MapPin className="mx-auto h-8 w-8 text-gold-deep lg:mx-0" strokeWidth={1.2} aria-hidden="true" />
                <h3 className="mt-3 font-display text-3xl font-semibold uppercase tracking-[0.14em] text-primary sm:text-4xl">
                  {venue.placeName ?? venue.name}
                </h3>
                <p className="mt-4 max-w-md font-light leading-relaxed text-ink/80 lg:max-w-sm">{venue.address}</p>

                <ul className="mt-6 space-y-3 border-y border-gold-deep/25 py-5 text-left">
                  {events.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-lg font-semibold text-primary">{e.title}</p>
                        {e.venue.placeName && <p className="text-sm font-light text-muted">{e.venue.name}</p>}
                      </div>
                      <p className="inline-flex shrink-0 items-center gap-1.5 text-sm tracking-wide text-ink/80">
                        <Clock className="h-3.5 w-3.5 text-gold-deep" aria-hidden="true" />
                        {formatTimeRange(e.startsAt, e.endsAt, data.locale, e.timeZone, e.timezoneLabel)}
                      </p>
                    </li>
                  ))}
                </ul>

                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-primary px-8 text-sm font-medium uppercase tracking-[0.22em] text-gold-light transition-colors hover:bg-primary-soft"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  {copy.location.openMaps}
                </a>
              </Reveal>

              <Reveal delay={0.1} className="order-1 lg:order-2">
                <MapEmbed query={venue.mapsQuery} title={`${copy.location.mapTitle}: ${venue.name}`} />
              </Reveal>
            </div>
          ))}
        </div>

        <GoldDivider className="mt-20" />
      </div>
    </section>
  );
}
