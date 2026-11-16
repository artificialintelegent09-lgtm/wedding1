/**
 * Generates atmospheric placeholder "photography" so the template looks complete
 * before a customer supplies their own photos.
 *
 *   node scripts/generate-placeholders.mjs
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
  dusk: { sky: ["#2a0b1b", "#7d2a40", "#e6a06a"], glow: "#ffd9a0", fig: "#1d0710", bokeh: "#ffd9a0", ground: "#1a0610" },
  wine: { sky: ["#35081a", "#5e1527", "#b3584a"], glow: "#f0b27c", fig: "#18050c", bokeh: "#f2c48c", ground: "#16050b" },
  ivory: { sky: ["#e9d6b8", "#f5e8d0", "#d8b585"], glow: "#fffaf0", fig: "#4a1f2b", bokeh: "#fff3d8", ground: "#8c6a4a" },
  blush: { sky: ["#edc9bd", "#e9b9aa", "#b87769"], glow: "#fff1e6", fig: "#3c1420", bokeh: "#fff1e6", ground: "#5a2a2e" },
};

function bloom(r, cx, cy, size, tone) {
  const fills = {
    wine: ["#5a1426", "#8d2a43", "#b9506a"],
    blush: ["#d68f8d", "#eab8b0", "#fbe3dc"],
    ivory: ["#d9bd8f", "#f2e1c0", "#fffaf0"],
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

/**
 * opts: { w, h, seed, palette, arch, blooms: [{x,y,size,tone,blur}], bokeh, dust }

 */
function scene(o) {
  const { w, h, seed, palette } = o;
  const P = PALETTES[palette];
  const rand = rng(seed);

  let bokeh = "";
  for (let i = 0; i < (o.bokeh ?? 22); i++) {
    const r = (0.02 + rand() * 0.07) * Math.min(w, h);
    bokeh += `<circle cx="${(rand() * w).toFixed(0)}" cy="${(rand() * h * 0.78).toFixed(0)}" r="${r.toFixed(0)}" fill="${P.bokeh}" opacity="${(0.1 + rand() * 0.3).toFixed(2)}"/>`;
  }

  let foliage = "";
  for (let i = 0; i < 16; i++) {
    const x = rand() * w;
    const y = h * (0.7 + rand() * 0.32);
    foliage += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(w * (0.06 + rand() * 0.1)).toFixed(0)}" ry="${(h * (0.04 + rand() * 0.08)).toFixed(0)}" fill="${P.ground}" opacity="${(0.55 + rand() * 0.4).toFixed(2)}"/>`;
  }

  const blooms = (o.blooms ?? [])
    .map((b) => `<g filter="url(#b${Math.round(b.blur ?? 0)})">${bloom(0, w * b.x, h * b.y, Math.min(w, h) * b.size, b.tone)}</g>`)
    .join("");

  let dust = "";
  for (let i = 0; i < (o.dust ?? 46); i++) {
    dust += `<circle cx="${(rand() * w).toFixed(0)}" cy="${(rand() * h).toFixed(0)}" r="${(1 + rand() * 3).toFixed(1)}" fill="#fff4d6" opacity="${(0.2 + rand() * 0.6).toFixed(2)}"/>`;
  }
  const rays = o.arch
    ? [0, 1, 2, 3, 4].map((i) => {
        const x0 = w * (0.3 + i * 0.1);
        return `<polygon points="${x0},0 ${x0 + w * 0.05},0 ${x0 + w * (0.2 + i * 0.06) - w * 0.1},${h} ${x0 - w * 0.25 + i * w * 0.07},${h}" fill="url(#ray)" opacity="${0.1 + (i % 2) * 0.06}"/>`;
      }).join("")
    : "";
  const arch = o.arch
    ? `<path d="M${w * 0.18} ${h} V${h * 0.38} a${w * 0.32} ${w * 0.32} 0 0 1 ${w * 0.64} 0 V${h}" fill="none" stroke="${P.glow}" stroke-opacity=".28" stroke-width="${w * 0.012}"/>
       <path d="M${w * 0.22} ${h} V${h * 0.4} a${w * 0.28} ${w * 0.28} 0 0 1 ${w * 0.56} 0 V${h}" fill="${P.glow}" fill-opacity=".1"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".55" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${P.sky[2]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${o.glowX ?? 0.5}" cy="${o.glowY ?? 0.62}" r=".6">
      <stop offset="0" stop-color="${P.glow}" stop-opacity=".85"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx=".5" cy=".5" r=".78">
      <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0208" stop-opacity=".55"/>
    </radialGradient>
    <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.glow}" stop-opacity=".9"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/></linearGradient>
    <filter id="bk"><feGaussianBlur stdDeviation="${Math.min(w, h) * 0.018}"/></filter>
    <filter id="fg"><feGaussianBlur stdDeviation="${Math.min(w, h) * 0.03}"/></filter>
    <filter id="b0"><feGaussianBlur stdDeviation="${Math.min(w, h) * 0.012}"/></filter>
    <filter id="b4"><feGaussianBlur stdDeviation="${Math.min(w, h) * 0.006}"/></filter>
    <filter id="b10"><feGaussianBlur stdDeviation="${Math.min(w, h) * 0.02}"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${seed}"/>
      <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .35  0 0 0 .22 0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#sky)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g filter="url(#bk)">${bokeh}</g>
  ${arch}
  <g filter="url(#fg)">${foliage}</g>
  ${rays}
  ${dust}
  ${blooms}
  <rect width="100%" height="100%" fill="url(#vig)"/>
  <rect width="100%" height="100%" filter="url(#grain)" opacity=".55"/>
</svg>`;
}

const jobs = {
  hero: { w: 1600, h: 2000, seed: 11, palette: "dusk", arch: true, glowY: 0.5, bokeh: 26, blooms: [{ x: 0.04, y: 0.96, size: 0.5, tone: "wine", blur: 10 }, { x: 0.98, y: 0.9, size: 0.42, tone: "blush", blur: 10 }, { x: 0.14, y: 0.78, size: 0.22, tone: "ivory", blur: 4 }] },
  cover: { w: 900, h: 1200, seed: 5, palette: "wine", arch: true, glowY: 0.5, blooms: [{ x: 0.5, y: 1.0, size: 0.8, tone: "wine", blur: 10 }] },
  bride: { w: 1000, h: 1300, seed: 21, palette: "blush", glowY: 0.4, arch: true, blooms: [{ x: 0.1, y: 0.92, size: 0.42, tone: "wine", blur: 10 }, { x: 0.86, y: 0.8, size: 0.3, tone: "ivory", blur: 4 }] },
  groom: { w: 1000, h: 1300, seed: 22, palette: "wine", glowY: 0.4, arch: true, blooms: [{ x: 0.92, y: 0.94, size: 0.38, tone: "blush", blur: 10 }] },
  closing: { w: 1800, h: 1200, seed: 31, palette: "dusk", glowY: 0.6, bokeh: 34, arch: true, blooms: [{ x: 0.06, y: 1, size: 0.4, tone: "wine", blur: 10 }, { x: 0.94, y: 1, size: 0.4, tone: "blush", blur: 10 }] },
  "gallery-1": { w: 1000, h: 1333, seed: 41, palette: "dusk", arch: true },
  "gallery-2": { w: 1400, h: 1000, seed: 42, palette: "ivory", arch: true, glowY: 0.4 },
  "gallery-3": { w: 1000, h: 1000, seed: 43, palette: "wine", bokeh: 28, blooms: [{ x: 0.36, y: 0.5, size: 0.62, tone: "wine", blur: 4 }, { x: 0.74, y: 0.3, size: 0.34, tone: "blush", blur: 10 }, { x: 0.78, y: 0.82, size: 0.3, tone: "ivory", blur: 10 }] },
  "gallery-4": { w: 1000, h: 1400, seed: 44, palette: "blush", arch: true, blooms: [{ x: 0.9, y: 0.95, size: 0.36, tone: "wine", blur: 4 }] },
  "gallery-5": { w: 1500, h: 1000, seed: 45, palette: "dusk", glowX: 0.4, glowY: 0.7, bokeh: 34 },
  "gallery-6": { w: 1000, h: 1400, seed: 46, palette: "wine", arch: true },
  "gallery-7": { w: 1000, h: 1000, seed: 47, palette: "ivory", glowY: 0.4, blooms: [{ x: 0.5, y: 0.55, size: 0.5, tone: "blush", blur: 4 }] },
  "gallery-8": { w: 1400, h: 1000, seed: 48, palette: "blush", blooms: [{ x: 0.3, y: 0.55, size: 0.55, tone: "ivory", blur: 4 }, { x: 0.68, y: 0.4, size: 0.5, tone: "wine", blur: 10 }, { x: 0.52, y: 0.9, size: 0.3, tone: "blush", blur: 10 }] },
  "gallery-9": { w: 1000, h: 1333, seed: 49, palette: "wine", arch: true, glowY: 0.4 },
  "story-1": { w: 900, h: 900, seed: 51, palette: "ivory", glowY: 0.4, arch: true },
  "story-2": { w: 900, h: 900, seed: 52, palette: "dusk" },
  "story-3": { w: 900, h: 900, seed: 53, palette: "blush", blooms: [{ x: 0.5, y: 0.5, size: 0.7, tone: "wine", blur: 4 }, { x: 0.2, y: 0.8, size: 0.3, tone: "ivory", blur: 10 }] },
  "story-4": { w: 900, h: 900, seed: 54, palette: "wine", arch: true },
  og: { w: 1200, h: 630, seed: 61, palette: "wine", glowX: 0.5, glowY: 0.5, arch: true },
};

await mkdir(OUT, { recursive: true });
for (const [name, opts] of Object.entries(jobs)) {
  await sharp(Buffer.from(scene(opts)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUT, `${name}.jpg`));
  console.log("wrote", `${name}.jpg`);
}
