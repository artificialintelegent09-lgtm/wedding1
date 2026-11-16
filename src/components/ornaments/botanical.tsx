import type { ReactNode } from "react";

/**
 * Hand-built SVG botanical primitives. Every primitive renders a <g> in its own
 * local coordinate space (origin at the flower's heart) so compositions can
 * place, rotate and scale them freely.
 */

export type RoseTone = "wine" | "blush" | "ivory";

/** Gradients shared by every floral composition. Ids are stable and identical across instances. */
export function FloralDefs() {
  return (
    <defs>
      <radialGradient id="fl-wine" cx="50%" cy="65%" r="75%">
        <stop offset="0%" stopColor="#4d0f20" />
        <stop offset="60%" stopColor="#8a2640" />
        <stop offset="100%" stopColor="#b3475d" />
      </radialGradient>
      <radialGradient id="fl-wine-in" cx="50%" cy="60%" r="80%">
        <stop offset="0%" stopColor="#3a0a17" />
        <stop offset="100%" stopColor="#74203a" />
      </radialGradient>
      <radialGradient id="fl-blush" cx="50%" cy="70%" r="75%">
        <stop offset="0%" stopColor="#d99a96" />
        <stop offset="65%" stopColor="#efc3bb" />
        <stop offset="100%" stopColor="#fbe6df" />
      </radialGradient>
      <radialGradient id="fl-blush-in" cx="50%" cy="60%" r="80%">
        <stop offset="0%" stopColor="#c47f7d" />
        <stop offset="100%" stopColor="#e9b3ad" />
      </radialGradient>
      <radialGradient id="fl-ivory" cx="50%" cy="70%" r="75%">
        <stop offset="0%" stopColor="#e6cfa8" />
        <stop offset="65%" stopColor="#f6e9d2" />
        <stop offset="100%" stopColor="#fffaf0" />
      </radialGradient>
      <radialGradient id="fl-ivory-in" cx="50%" cy="60%" r="80%">
        <stop offset="0%" stopColor="#d3b789" />
        <stop offset="100%" stopColor="#f0dcb9" />
      </radialGradient>
      <linearGradient id="fl-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a9812f" />
        <stop offset="45%" stopColor="#ecd6a0" />
        <stop offset="100%" stopColor="#b8913f" />
      </linearGradient>
      <linearGradient id="fl-leaf-gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8f6b26" />
        <stop offset="55%" stopColor="#d6b46a" />
        <stop offset="100%" stopColor="#f0dba5" />
      </linearGradient>
      <linearGradient id="fl-leaf-olive" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2c3320" />
        <stop offset="60%" stopColor="#56623a" />
        <stop offset="100%" stopColor="#7d8b57" />
      </linearGradient>
    </defs>
  );
}

const PETAL_OUTER = "M0 -3C-23 -4 -29 -25 -10 -34C-2 -37 6 -37 12 -33C29 -25 23 -4 0 -3Z";
const PETAL_MID = "M0 -2C-16 -3 -20 -17 -7 -23C-1 -25 5 -25 9 -22C20 -17 16 -3 0 -2Z";
const PETAL_IN = "M0 -1C-10 -2 -12 -11 -4 -14C0 -15 4 -15 6 -13C12 -10 10 -2 0 -1Z";

interface Placement {
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
}

function place({ x = 0, y = 0, rotate = 0, scale = 1 }: Placement) {
  return `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
}

export function Rose({ tone = "wine", ...p }: Placement & { tone?: RoseTone }) {
  const rim = tone === "wine" ? "#e3c27d" : tone === "blush" ? "#c98a86" : "#c9a45c";
  return (
    <g transform={place(p)} opacity={p.opacity}>
      {/* soft shadow under the bloom */}
      <circle r="34" fill="#000" opacity="0.14" cy="3" />
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d={PETAL_OUTER}
          transform={`rotate(${a})`}
          fill={`url(#fl-${tone})`}
          stroke={rim}
          strokeWidth="0.7"
          strokeOpacity="0.75"
        />
      ))}
      {[36, 108, 180, 252, 324].map((a) => (
        <path
          key={a}
          d={PETAL_MID}
          transform={`rotate(${a})`}
          fill={`url(#fl-${tone})`}
          stroke={rim}
          strokeWidth="0.6"
          strokeOpacity="0.6"
        />
      ))}
      {[10, 135, 250].map((a) => (
        <path
          key={a}
          d={PETAL_IN}
          transform={`rotate(${a})`}
          fill={`url(#fl-${tone}-in)`}
          stroke={rim}
          strokeWidth="0.5"
          strokeOpacity="0.55"
        />
      ))}
      <path
        d="M0 0c-2.6-.2-3.6-2.4-2.2-3.8 1.9-1.8 5.2-.6 5.3 2 .1 2.9-3.2 4.6-6.2 3.6"
        fill="none"
        stroke={rim}
        strokeWidth="0.8"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
    </g>
  );
}

export function Leaf({
  tone = "gold",
  length = 38,
  ...p
}: Placement & { tone?: "gold" | "olive"; length?: number }) {
  const k = length / 38;
  return (
    <g transform={`${place(p)} scale(${k})`} opacity={p.opacity}>
      <path
        d="M0 0C6-10 24-13 38 0 24 13 6 10 0 0Z"
        fill={`url(#fl-leaf-${tone})`}
        stroke={tone === "gold" ? "#8f6b26" : "#2c3320"}
        strokeWidth="0.5"
        strokeOpacity="0.6"
      />
      <path
        d="M2 0C14-1 26-.5 35 0M12-.4 18-5.5M12 .4 18 5.5M21-.3 26.5-4.2M21 .3 26.5 4.2"
        fill="none"
        stroke={tone === "gold" ? "#fff3cf" : "#c4d1a0"}
        strokeWidth="0.55"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
    </g>
  );
}

export function Bud({ tone = "wine", ...p }: Placement & { tone?: RoseTone }) {
  return (
    <g transform={place(p)} opacity={p.opacity}>
      <path
        d="M0 0C-9-6-9-20 0-27 9-20 9-6 0 0Z"
        fill={`url(#fl-${tone})`}
        stroke="#c9a45c"
        strokeWidth="0.6"
        strokeOpacity="0.8"
      />
      <path d="M0-2C-4-9-3-18 0-24" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.7" />
      <path d="M0 0C-8 2-12-4-10-10-5-8-2-4 0 0ZM0 0C8 2 12-4 10-10 5-8 2-4 0 0Z" fill="url(#fl-leaf-olive)" />
    </g>
  );
}

export function Berry({ x = 0, y = 0, r = 3 }: { x?: number; y?: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="url(#fl-gold)" />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#fff7dc" opacity="0.7" />
    </g>
  );
}

export function Vine({ d, width = 1.5 }: { d: string; width?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="url(#fl-gold)"
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

/** Wraps a composition in an SVG with shared defs. */
export function FloralSvg({
  viewBox,
  className,
  children,
}: {
  viewBox: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <FloralDefs />
      {children}
    </svg>
  );
}
