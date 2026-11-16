/**
 * Generates atmospheric placeholder "photography" so the template looks complete
 * before a customer supplies their own photos. Cinematic golden-hour scenes:
 * arched light, dappled foliage shadow, soft florals, bokeh, film grain.
 *
 *   npm run images:placeholders
 *
 * Output: public/images/demo/*.jpg. Replace these paths in the invitation data
 * file with real photos; nothing else needs to change.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "images", "demo");

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = {
  dusk: { sky: ["#1d0709", "#6a2230", "#d99a68"], glow: "#ffd7a3", bokeh: "#ffd9a8", ground: "#14050a", leaf: "#10050a" },
  wine: { sky: ["#240810", "#4a0f1c", "#a4534a"], glow: "#efb07f", bokeh: "#f0c08e", ground: "#12040a", leaf: "#0d0307" },
  ivory: { sky: ["#e3d2b6", "#f4e9d5", "#d4b88f"], glow: "#fffaf0", bokeh: "#fff3d8", ground: "#6f5238", leaf: "#3a2a1e" },
  blush: { sky: ["#e8c8bd", "#e6bcae", "#b17c70"], glow: "#fff1e6", bokeh: "#fff1e6", ground: "#4a2527", leaf: "#2a1214" },
};

function bloom(cx, cy, size, tone) {
  const fills = {
    wine: ["#4a0f1c", "#7a1f33", "#a8485a"],
    blush: ["#c58f89", "#e0b8af", "#f4e0d8"],
    ivory: ["#cdb48a", "#eadcc0", "#fbf5e8"],
  }[tone];
  let out = "";
  for (let ring = 0; ring < 3; ring++) {
    const n = 7 - ring * 2;
    const rr = size * (1 - ring * 0.3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.5;
      const px = cx + Math.cos(a) * rr * 0.48;
      const py = cy + Math.sin(a) * rr * 0.48;
      out += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(rr * 0.42).toFixed(1)}" ry="${(rr * 0.52).toFixed(1)}" transform="rotate(${((a * 180) / Math.PI + 90).toFixed(0)} ${px.toFixed(1)} ${py.toFixed(1)})" fill="${fills[ring]}" opacity=".94"/>`;
    }
  }
  return out;
}

/** One leaf pointing along +x from the origin. */
const leaf = (L) => `M0 0C${L * 0.2} ${-L * 0.36} ${L * 0.7} ${-L * 0.38} ${L} 0C${L * 0.7} ${L * 0.38} ${L * 0.2} ${L * 0.36} 0 0Z`;

/** A leafy branch from (x,y) heading `angle` degrees. */
function branch(rand, { x, y, angle, len, leafLen, color, opacity = 0.9 }) {
  const rad = (angle * Math.PI) / 180;
  const nx = (t) => x + Math.cos(rad) * len * t + Math.sin(rad) * Math.sin(t * 3) * len * 0.06;
  const ny = (t) => y + Math.sin(rad) * len * t - Math.cos(rad) * Math.sin(t * 3) * len * 0.06;
  let d = `M${x} ${y}`;
  for (let t = 0.1; t <= 1.001; t += 0.1) d += `L${nx(t).toFixed(1)} ${ny(t).toFixed(1)}`;
  let out = `<path d="${d}" stroke="${color}" stroke-width="${Math.max(2, leafLen * 0.05)}" fill="none" opacity="${opacity}"/>`;
  const n = Math.round(len / (leafLen * 0.55));
  for (let i = 0; i < n; i++) {
    const t = 0.12 + (i / n) * 0.88;
    const side = i % 2 ? 1 : -1;
    const a = angle + side * (38 + rand() * 20);
    const size = leafLen * (1.05 - t * 0.5) * (0.8 + rand() * 0.4);
    out += `<path d="${leaf(size)}" transform="translate(${nx(t).toFixed(1)} ${ny(t).toFixed(1)}) rotate(${a.toFixed(0)})" fill="${color}" opacity="${opacity}"/>`;
  }
  return out;
}

/**
 * opts: { w, h, seed, palette, arch, gobo, branches: [{x,y,angle,len,leaf,blur}] (fractions),
 *         blooms: [{x,y,size,tone,blur}], bokeh, dust, glowX, glowY }
 */
function scene(o) {
  const { w, h, seed, palette } = o;
  const P = PALETTES[palette];
  const rand = rng(seed);
  const m = Math.min(w, h);

  let bokeh = "";
  for (let i = 0; i < (o.bokeh ?? 22); i++) {
    const r = (0.015 + rand() * 0.06) * m;
    bokeh += `<circle cx="${(rand() * w).toFixed(0)}" cy="${(rand() * h * 0.8).toFixed(0)}" r="${r.toFixed(0)}" fill="${P.bokeh}" opacity="${(0.08 + rand() * 0.26).toFixed(2)}"/>`;
  }

  // Dappled foliage shadow thrown across the lit area (the "gobo" look).
  let gobo = "";
  if (o.gobo) {
    for (let i = 0; i < 5; i++) {
      gobo += branch(rand, {
        x: w * (0.1 + rand() * 0.8), y: -h * 0.05, angle: 70 + rand() * 40,
        len: h * (0.5 + rand() * 0.4), leafLen: m * (0.12 + rand() * 0.07), color: P.leaf, opacity: 0.22,
      });
    }
  }

  // Foreground / midground branches, blurred by depth.
  const branches = (o.branches ?? [])
    .map((b) => {
      const filter = b.blur >= 2 ? "url(#fg)" : b.blur === 1 ? "url(#b4)" : "none";
      return `<g filter="${filter}">${branch(rand, {
        x: w * b.x, y: h * b.y, angle: b.angle, len: m * b.len, leafLen: m * b.leaf, color: P.leaf, opacity: b.opacity ?? 0.92,
      })}</g>`;
    })
    .join("");

  let ground = "";
  for (let i = 0; i < 14; i++) {
    ground += `<ellipse cx="${(rand() * w).toFixed(0)}" cy="${(h * (0.84 + rand() * 0.2)).toFixed(0)}" rx="${(w * (0.07 + rand() * 0.1)).toFixed(0)}" ry="${(h * (0.04 + rand() * 0.06)).toFixed(0)}" fill="${P.ground}" opacity="${(0.5 + rand() * 0.45).toFixed(2)}"/>`;
  }

  const blooms = (o.blooms ?? [])
    .map((b) => `<g filter="url(#b${Math.round(b.blur ?? 0)})">${bloom(w * b.x, h * b.y, m * b.size, b.tone)}</g>`)
    .join("");

  let dust = "";
  for (let i = 0; i < (o.dust ?? 40); i++) {
    dust += `<circle cx="${(rand() * w).toFixed(0)}" cy="${(rand() * h).toFixed(0)}" r="${(0.8 + rand() * 2.4).toFixed(1)}" fill="#fff1d2" opacity="${(0.15 + rand() * 0.5).toFixed(2)}"/>`;
  }

  const rays = o.arch
    ? [0, 1, 2, 3].map((i) => {
        const x0 = w * (0.32 + i * 0.1);
        return `<polygon points="${x0},0 ${x0 + w * 0.04},0 ${x0 + w * (0.16 + i * 0.05) - w * 0.1},${h} ${x0 - w * 0.22 + i * w * 0.06},${h}" fill="url(#ray)" opacity="${0.08 + (i % 2) * 0.05}"/>`;
      }).join("")
    : "";
  const arch = o.arch
    ? `<path d="M${w * 0.18} ${h} V${h * 0.38} a${w * 0.32} ${w * 0.32} 0 0 1 ${w * 0.64} 0 V${h}" fill="none" stroke="${P.glow}" stroke-opacity=".22" stroke-width="${w * 0.01}"/>
       <path d="M${w * 0.22} ${h} V${h * 0.4} a${w * 0.28} ${w * 0.28} 0 0 1 ${w * 0.56} 0 V${h}" fill="${P.glow}" fill-opacity=".09"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".55" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${P.sky[2]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${o.glowX ?? 0.5}" cy="${o.glowY ?? 0.58}" r=".62">
      <stop offset="0" stop-color="${P.glow}" stop-opacity=".9"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="leak" cx="1" cy="0" r=".75">
      <stop offset="0" stop-color="#ff9d5c" stop-opacity=".5"/><stop offset="1" stop-color="#ff9d5c" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".8">
      <stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#12030a" stop-opacity=".62"/>
    </radialGradient>
    <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.glow}" stop-opacity=".9"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/></linearGradient>
    <filter id="bk"><feGaussianBlur stdDeviation="${m * 0.016}"/></filter>
    <filter id="fg"><feGaussianBlur stdDeviation="${m * 0.022}"/></filter>
    <filter id="b0"><feGaussianBlur stdDeviation="${m * 0.011}"/></filter>
    <filter id="b4"><feGaussianBlur stdDeviation="${m * 0.005}"/></filter>
    <filter id="b10"><feGaussianBlur stdDeviation="${m * 0.019}"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="${m * 0.004}"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}"/>
      <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .35  0 0 0 .24 0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#sky)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect width="100%" height="100%" fill="url(#leak)"/>
  <g filter="url(#bk)">${bokeh}</g>
  ${arch}
  ${rays}
  <g filter="url(#soft)">${gobo}</g>
  <g filter="url(#fg)">${ground}</g>
  ${dust}
  ${branches}
  ${blooms}
  <rect width="100%" height="100%" fill="url(#vig)"/>
  <rect width="100%" height="100%" filter="url(#grain)" opacity=".6"/>
</svg>`;
}

// Reusable foliage framings (fractions of the frame; len/leaf relative to the short side).
const leftBranch = { x: -0.02, y: 0.62, angle: -35, len: 0.9, leaf: 0.2, blur: 2 };
const rightBranch = { x: 1.02, y: 0.3, angle: 150, len: 0.85, leaf: 0.19, blur: 2 };
const topRight = { x: 1.02, y: -0.02, angle: 128, len: 0.75, leaf: 0.17, blur: 1 };
const topLeft = { x: -0.02, y: -0.02, angle: 50, len: 0.7, leaf: 0.16, blur: 2 };
const bottomLeft = { x: -0.03, y: 1.03, angle: -50, len: 0.8, leaf: 0.2, blur: 2 };
const bottomRight = { x: 1.03, y: 1.03, angle: -130, len: 0.8, leaf: 0.2, blur: 2 };

const jobs = {
  hero: { w: 1600, h: 2000, seed: 11, palette: "dusk", arch: true, gobo: true, glowY: 0.5, bokeh: 26, branches: [bottomLeft, bottomRight, topRight], blooms: [{ x: 0.06, y: 0.97, size: 0.42, tone: "wine", blur: 10 }, { x: 0.97, y: 0.93, size: 0.36, tone: "blush", blur: 10 }] },
  cover: { w: 900, h: 1200, seed: 5, palette: "wine", arch: true, gobo: true, glowY: 0.5, branches: [topLeft, bottomRight] },
  bride: { w: 1000, h: 1300, seed: 21, palette: "blush", glowY: 0.4, arch: true, gobo: true, branches: [topRight], blooms: [{ x: 0.1, y: 0.94, size: 0.4, tone: "wine", blur: 10 }, { x: 0.88, y: 0.84, size: 0.28, tone: "ivory", blur: 4 }] },
  groom: { w: 1000, h: 1300, seed: 22, palette: "wine", glowY: 0.4, arch: true, gobo: true, branches: [topLeft, bottomRight] },
  closing: { w: 1800, h: 1200, seed: 31, palette: "dusk", glowY: 0.6, bokeh: 34, arch: true, gobo: true, branches: [leftBranch, rightBranch, bottomLeft], blooms: [{ x: 0.05, y: 1, size: 0.38, tone: "wine", blur: 10 }, { x: 0.95, y: 1, size: 0.38, tone: "blush", blur: 10 }] },
  "gallery-1": { w: 1000, h: 1333, seed: 41, palette: "dusk", arch: true, gobo: true, branches: [bottomLeft] },
  "gallery-2": { w: 1400, h: 1000, seed: 42, palette: "ivory", arch: true, gobo: true, glowY: 0.4, branches: [topRight] },
  "gallery-3": { w: 1000, h: 1000, seed: 43, palette: "wine", bokeh: 28, blooms: [{ x: 0.36, y: 0.5, size: 0.62, tone: "wine", blur: 4 }, { x: 0.74, y: 0.3, size: 0.34, tone: "blush", blur: 10 }, { x: 0.78, y: 0.82, size: 0.3, tone: "ivory", blur: 10 }] },
  "gallery-4": { w: 1000, h: 1400, seed: 44, palette: "blush", arch: true, gobo: true, branches: [topLeft], blooms: [{ x: 0.9, y: 0.95, size: 0.36, tone: "wine", blur: 4 }] },
  "gallery-5": { w: 1500, h: 1000, seed: 45, palette: "dusk", glowX: 0.4, glowY: 0.7, bokeh: 34, branches: [leftBranch, topRight] },
  "gallery-6": { w: 1000, h: 1400, seed: 46, palette: "wine", arch: true, gobo: true, branches: [bottomRight] },
  "gallery-7": { w: 1000, h: 1000, seed: 47, palette: "ivory", glowY: 0.4, gobo: true, blooms: [{ x: 0.5, y: 0.55, size: 0.5, tone: "blush", blur: 4 }] },
  "gallery-8": { w: 1400, h: 1000, seed: 48, palette: "blush", branches: [topRight], blooms: [{ x: 0.3, y: 0.55, size: 0.55, tone: "ivory", blur: 4 }, { x: 0.68, y: 0.4, size: 0.5, tone: "wine", blur: 10 }, { x: 0.52, y: 0.9, size: 0.3, tone: "blush", blur: 10 }] },
  "gallery-9": { w: 1000, h: 1333, seed: 49, palette: "wine", arch: true, gobo: true, glowY: 0.4, branches: [topLeft] },
  "story-1": { w: 900, h: 900, seed: 51, palette: "ivory", glowY: 0.4, arch: true, gobo: true },
  "story-2": { w: 900, h: 900, seed: 52, palette: "dusk", branches: [bottomLeft] },
  "story-3": { w: 900, h: 900, seed: 53, palette: "blush", blooms: [{ x: 0.5, y: 0.5, size: 0.7, tone: "wine", blur: 4 }, { x: 0.2, y: 0.8, size: 0.3, tone: "ivory", blur: 10 }] },
  "story-4": { w: 900, h: 900, seed: 54, palette: "wine", arch: true, gobo: true },
  og: { w: 1200, h: 630, seed: 61, palette: "wine", glowX: 0.5, glowY: 0.5, arch: true, gobo: true, branches: [topLeft, bottomRight] },
};

await mkdir(OUT, { recursive: true });
for (const [name, opts] of Object.entries(jobs)) {
  await sharp(Buffer.from(scene(opts)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUT, `${name}.jpg`));
  console.log("wrote", `${name}.jpg`);
}
