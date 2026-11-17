"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicConfig } from "@/types/invitation";

/**
 * - idle:        not started yet (the visitor has not opened the invitation)
 * - playing / paused: normal states
 * - unavailable: the audio file is missing or unsupported: the control is hidden, nothing pretends to play
 */
export type MusicStatus = "idle" | "playing" | "paused" | "unavailable";

const PREF_KEY = "wedding-music";
const FADE_MS = 1400;

/**
 * Background music with consent:
 *  - nothing is fetched or played until `start()` runs, which must be called from the
 *    "open invitation" click (browsers only allow sound after a user gesture),
 *  - one <audio> element lives for the whole visit, so scrolling between sections never
 *    restarts or re-triggers it,
 *  - `toggle()` pauses/resumes it, and a visitor who switched it off stays muted next time,
 *  - it pauses while the tab is hidden and resumes after, only if it was playing.
 */
export function useBackgroundMusic(config: MusicConfig | undefined) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const started = useRef(false);
  const resumeOnVisible = useRef(false);
  const fade = useRef<ReturnType<typeof setInterval>>(undefined);
  const [status, setStatus] = useState<MusicStatus>("idle");

  const target = config?.volume ?? 0.5;

  const fadeIn = useCallback(
    (el: HTMLAudioElement) => {
      clearInterval(fade.current);
      el.volume = 0;
      const step = target / (FADE_MS / 60);
      fade.current = setInterval(() => {
        const next = Math.min(target, el.volume + step);
        el.volume = next;
        if (next >= target) clearInterval(fade.current);
      }, 60);
    },
    [target],
  );

  const create = useCallback(() => {
    if (audio.current || !config) return audio.current;
    const el = new Audio();
    el.preload = "none";
    el.loop = true;
    el.volume = target;
    el.src = config.src;
    el.addEventListener("playing", () => setStatus("playing"));
    el.addEventListener("pause", () => setStatus((s) => (s === "unavailable" ? s : "paused")));
    el.addEventListener("error", () => {
      setStatus("unavailable");
      console.warn(`[music] Could not load "${config.src}". Add the audio file under /public (see public/audio/README.txt).`);
    });
    audio.current = el;
    return el;
  }, [config, target]);

  const play = useCallback(
    (el: HTMLAudioElement) => {
      el.play().then(
        () => fadeIn(el),
        (err: unknown) => {
          // A blocked autoplay is recoverable (the visitor can press the button);
          // anything else means there is nothing to play.
          if ((err as DOMException)?.name === "NotAllowedError") setStatus("paused");
          else setStatus("unavailable");
        },
      );
    },
    [fadeIn],
  );

  /** Call from the open-invitation click handler. Safe to call more than once. */
  const start = useCallback(() => {
    if (started.current || !config) return;
    started.current = true;
    const el = create();
    if (!el) return;
    let preferOff = false;
    try {
      preferOff = localStorage.getItem(PREF_KEY) === "off";
    } catch {
      /* storage unavailable */
    }
    if (preferOff) setStatus("paused");
    else play(el);
  }, [config, create, play]);

  const toggle = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    try {
      if (el.paused) {
        localStorage.setItem(PREF_KEY, "on");
        play(el);
      } else {
        localStorage.setItem(PREF_KEY, "off");
        clearInterval(fade.current);
        el.pause();
      }
    } catch {
      if (el.paused) play(el);
      else el.pause();
    }
  }, [play]);

  // Be a good citizen: silence while the tab is in the background (phone locked, app switched).
  useEffect(() => {
    const onVisibility = () => {
      const el = audio.current;
      if (!el) return;
      if (document.visibilityState === "hidden") {
        if (!el.paused) {
          resumeOnVisible.current = true;
          el.pause();
        }
      } else if (resumeOnVisible.current) {
        resumeOnVisible.current = false;
        el.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(
    () => () => {
      clearInterval(fade.current);
      audio.current?.pause();
      audio.current = null;
    },
    [],
  );

  return { status, start, toggle, enabled: !!config };
}
