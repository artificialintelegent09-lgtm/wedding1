import { mapsEmbedUrl } from "@/lib/calendar";

/** Keyless Google Maps embed with a warm tint so it sits comfortably in the palette. */
export function MapEmbed({ query, title }: { query: string; title: string }) {
  return (
    <div className="relative">
      <div className="absolute -inset-2 border border-gold/50" aria-hidden="true" />
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2 sm:aspect-[16/10]">
        <iframe
          title={title}
          src={mapsEmbedUrl(query)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.35)_saturate(0.85)_hue-rotate(-10deg)_contrast(1.02)]"
        />
      </div>
    </div>
  );
}
