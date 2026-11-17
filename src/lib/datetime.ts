import type { Locale } from "@/types/invitation";

const INTL_LOCALE: Record<Locale, string> = { en: "en-GB", id: "id-ID" };

/** Every invitation is for an event in Indonesia unless its events say otherwise. */
export const DEFAULT_TIME_ZONE = "Asia/Jakarta";

/** The zone the invitation is "in": its first event's zone, else Asia/Jakarta (never the visitor's device zone). */
export function getTimeZone(data: { events: { timeZone: string }[] }): string {
  return data.events[0]?.timeZone ?? DEFAULT_TIME_ZONE;
}

const HAS_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/i;

/** How far `timeZone` is ahead of UTC at the instant `utcMs`, in ms. */
function zoneOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/**
 * Parses an invitation date-time into an exact instant.
 *  - With an explicit offset ("2027-03-20T08:00:00+07:00" or "…Z") the offset is authoritative.
 *  - Without one ("2027-03-20T08:00:00") it is wall-clock time in `timeZone`. It is never
 *    interpreted in the visitor's device zone, which is what plain `new Date(string)` does.
 * Returns an Invalid Date for unparseable input.
 */
export function toDate(iso: string, timeZone: string = DEFAULT_TIME_ZONE): Date {
  if (HAS_OFFSET.test(iso)) return new Date(iso);
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!m) return new Date(Number.NaN);
  const [y, mo, d, h = "0", mi = "0", s = "0"] = m.slice(1);
  const wall = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
  // Two passes settle zones whose offset changes (DST) near the target time.
  let utc = wall - zoneOffsetMs(wall, timeZone);
  utc = wall - zoneOffsetMs(utc, timeZone);
  return new Date(utc);
}

/**
 * The countdown window: it opens at `weddingDate` and closes when the last event ends.
 * Both are ISO strings straight from the invitation data.
 */
export function getEventWindow(data: {
  weddingDate: string;
  events: { endsAt: string; timeZone: string }[];
}): { start: string; end: string } {
  const tz = getTimeZone(data);
  let end = data.weddingDate;
  let endMs = toDate(end, tz).getTime();
  for (const e of data.events) {
    const ms = toDate(e.endsAt, e.timeZone).getTime();
    if (ms > endMs) {
      end = e.endsAt;
      endMs = ms;
    }
  }
  return { start: data.weddingDate, end };
}

/** "Saturday, 20 March 2027" rendered in the event's own timezone, identical on server and client. */
export function formatLongDate(iso: string, locale: Locale, timeZone: string): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(toDate(iso, timeZone));
}

export function formatParts(iso: string, locale: Locale, timeZone: string) {
  const d = toDate(iso, timeZone);
  const f = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(INTL_LOCALE[locale], { ...opts, timeZone }).format(d);
  return {
    weekday: f({ weekday: "long" }),
    day: f({ day: "numeric" }),
    /** Zero-padded day, "05". */
    dayPadded: f({ day: "2-digit" }),
    month: f({ month: "long" }),
    /** Zero-padded month number in the event's zone, "03". Never derived from UTC. */
    monthNumber: f({ month: "2-digit" }),
    year: f({ year: "numeric" }),
  };
}

/** "08:00 – 10:00 WIB" */
export function formatTimeRange(
  startIso: string,
  endIso: string,
  locale: Locale,
  timeZone: string,
  label?: string,
): string {
  const f = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  });
  const range = `${f.format(toDate(startIso, timeZone))} – ${f.format(toDate(endIso, timeZone))}`;
  return label ? `${range} ${label}` : range;
}

/** A plain calendar date ("2027-03-01"), formatted without any timezone shifting. */
export function formatShortDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
