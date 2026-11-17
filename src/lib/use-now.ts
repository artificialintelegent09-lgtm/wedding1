"use client";

import { useSyncExternalStore } from "react";

/**
 * Ticks on the second boundary (not "1000 ms after subscribing"), so the displayed seconds
 * change exactly when the clock's seconds do. The value is always recomputed from Date.now(),
 * so a throttled background tab or a sleeping phone catches up correctly on the next tick.
 */
function subscribe(callback: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const tick = () => {
    callback();
    timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  };
  timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  // Catch up immediately when a hidden tab becomes visible again.
  const onVisible = () => document.visibilityState === "visible" && callback();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

/**
 * Current time in whole seconds, ticking every second.
 * `null` during server render and hydration, so markup never mismatches.
 */
export function useNowSeconds(): number | null {
  return useSyncExternalStore<number | null>(subscribe, getSnapshot, getServerSnapshot);
}
