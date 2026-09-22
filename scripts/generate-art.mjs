// One-off generator for placeholder amber-gemstone artwork (SVG) used as
// product/collection imagery until real photography is uploaded through the
// admin panel. Deterministic per seed string so re-runs are stable.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const PALETTES = {
  honey: ["#F5B94A", "#D3862E", "#7A4415", "#3A2110"],
  cognac: ["#E0994A", "#B0672A", "#5C3417", "#2A160A"],
  cherry: ["#D06A4B", "#A13A26", "#4C1710", "#210B08"],
  green: ["#A6BB74", "#71824A", "#3C4626", "#1B2010"],
  black: ["#6B6156", "#3A342C", "#1C1712", "#0A0806"],
  milky: ["#F1E3BE", "#D3B476", "#8E6B37", "#3F2E14"],
  gold: ["#F6D77A", "#D4A437", "#8A611C", "#3A2A0C"],
};

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

function bead(cx, cy, r, colors, rng, idOffset) {
  const id = `g${idOffset}`;
  return {
    id,
    def: `<radialGradient id="${id}" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="45%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </radialGradient>`,
    shape: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})" />
      <ellipse cx="${cx - r * 0.32}" cy="${cy - r * 0.38}" rx="${r * 0.22}" ry="${r * 0.13}" fill="#FFF6E0" opacity="${0.22 + rng() * 0.15}" />`,
  };
}

export function renderArt({ seed, variant = "honey", kind = "product", width = 900, height = 900 }) {
  const colors = PALETTES[variant] || PALETTES.honey;
  const rng = mulberry32(hashSeed(seed));
  const defs = [];
  const shapes = [];
  const cx = width / 2;
  const cy = height / 2;

  if (kind === "collection") {
    // wide banner: a loose strand of graduated beads drifting across
    const count = 9;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const x = width * 0.08 + t * width * 0.84;
      const y = cy + Math.sin(t * Math.PI * 1.4 + rng() * 0.6) * height * 0.16;
      const r = height * (0.07 + 0.05 * Math.sin(t * Math.PI));
      const b = bead(x, y, r, colors, rng, `${seed}-${i}`);
      defs.push(b.def);
      shapes.push(b.shape);
    }
  } else if (kind === "ring") {
    const ringR = width * 0.27;
    defs.push(`<linearGradient id="band-${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[3]}"/>
      <stop offset="100%" stop-color="${colors[1]}"/>
    </linearGradient>`);
    shapes.push(
      `<circle cx="${cx}" cy="${cy + height * 0.08}" r="${ringR}" fill="none" stroke="url(#band-${seed})" stroke-width="${width * 0.045}"/>`
    );
    const b = bead(cx, cy - height * 0.14, width * 0.16, colors, rng, `${seed}-stone`);
    defs.push(b.def);
    shapes.push(b.shape);
  } else {
    // default cluster: one large hero bead plus orbiting smaller beads
    const main = bead(cx, cy, width * 0.26, colors, rng, `${seed}-main`);
    defs.push(main.def);
    shapes.push(main.shape);
    const satellites = 4 + Math.floor(rng() * 3);
    for (let i = 0; i < satellites; i++) {
      const angle = (i / satellites) * Math.PI * 2 + rng() * 0.5;
      const dist = width * (0.32 + rng() * 0.14);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist * 0.7;
      const r = width * (0.05 + rng() * 0.05);
      const b = bead(x, y, r, colors, rng, `${seed}-s${i}`);
      defs.push(b.def);
      shapes.push(b.shape);
    }
  }

  const grainId = `grain-${hashSeed(seed)}`;
  const bgId = `bg-${hashSeed(seed)}`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${bgId}" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#1c140b"/>
      <stop offset="100%" stop-color="#0a0704"/>
    </radialGradient>
    <filter id="${grainId}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.55  0 0 0 0 0.3  0 0 0 0.05 0"/>
    </filter>
    ${defs.join("\n    ")}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${bgId})"/>
  ${shapes.join("\n  ")}
  <rect width="${width}" height="${height}" filter="url(#${grainId})"/>
</svg>`;
}

function write(path, svg) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg, "utf-8");
}

const isMain = process.argv[1] && process.argv[1].endsWith("generate-art.mjs");
if (isMain) {
  const { COLLECTIONS, PRODUCTS } = await import("../src/lib/catalog-seed-data.mjs");
  for (const c of COLLECTIONS) {
    const svg = renderArt({ seed: c.slug, variant: c.variant, kind: "collection", width: 1200, height: 700 });
    write(`public/images/collections/${c.slug}.svg`, svg);
  }
  for (const p of PRODUCTS) {
    const kind = p.kind || "product";
    const svg1 = renderArt({ seed: p.slug + "-1", variant: p.variant, kind, width: 1000, height: 1000 });
    const svg2 = renderArt({ seed: p.slug + "-2", variant: p.variant, kind, width: 1000, height: 1000 });
    write(`public/images/products/${p.slug}-1.svg`, svg1);
    write(`public/images/products/${p.slug}-2.svg`, svg2);
  }
  console.log(`Generated art for ${COLLECTIONS.length} collections and ${PRODUCTS.length} products.`);
}
