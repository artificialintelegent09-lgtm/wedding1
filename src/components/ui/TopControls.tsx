"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useInvitation } from "@/components/InvitationContext";
import type { MusicStatus } from "@/lib/use-background-music";
import type { Locale } from "@/types/invitation";

const LANGUAGES: { value: Locale; label: string; name: string }[] = [
  { value: "id", label: "ID", name: "Bahasa Indonesia" },
  { value: "en", label: "EN", name: "English" },
];

interface MusicControl {
  status: MusicStatus;
  toggle: () => void;
}

/**
 * One slim chip, fixed top-right and always reachable: language (ID | EN) and, once the
 * invitation is open and a music file loads, the sound toggle. A missing audio file hides
 * the toggle rather than showing a button that does nothing.
 */
export function TopControls({ music }: { music: MusicControl }) {
  const { locale, setLocale, copy, opened } = useInvitation();
  const showSound = opened && (music.status === "playing" || music.status === "paused");
  const playing = music.status === "playing";

  return (
    <div className="fixed right-3 top-3 z-[95] flex items-stretch border border-gold/45 bg-deep/85 backdrop-blur-sm sm:right-5 sm:top-5">
      {LANGUAGES.map((option, i) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            lang={option.value}
            aria-label={option.name}
            aria-pressed={active}
            onClick={() => setLocale(option.value)}
            className={`relative flex h-10 min-w-11 items-center justify-center px-3 text-[0.64rem] font-normal tracking-[0.22em] transition-colors duration-300 ${
              i > 0 ? "border-l border-gold/30" : ""
            } ${active ? "text-paper" : "text-gold-light/55 hover:text-gold-light"}`}
          >
            {active && <span aria-hidden="true" className="absolute inset-x-2.5 bottom-1.5 h-px bg-gold" />}
            {option.label}
          </button>
        );
      })}

      {showSound && (
        <button
          type="button"
          onClick={music.toggle}
          aria-label={playing ? copy.music.off : copy.music.on}
          aria-pressed={playing}
          className={`flex h-10 w-11 items-center justify-center border-l border-gold/30 transition-colors duration-300 ${
            playing ? "text-paper" : "text-gold-light/55 hover:text-gold-light"
          }`}
        >
          {playing ? <Volume2 className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.4} aria-hidden="true" /> : <VolumeX className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.4} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
