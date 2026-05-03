import L from "leaflet";
import type { VehicleStatus } from "../types";

const PALETTE: Record<
  VehicleStatus,
  { a: string; b: string; c: string; rim: string; glow: string; chip: string }
> = {
  online: {
    a: "#2dd4bf",
    b: "#0f766e",
    c: "#134e4a",
    rim: "rgba(15,118,110,0.4)",
    glow: "rgba(45,212,191,0.28)",
    chip: "linear-gradient(145deg,#fde68a,#f59e0b)",
  },
  charging: {
    a: "#c4b5fd",
    b: "#6d28d9",
    c: "#4c1d95",
    rim: "rgba(109,40,217,0.4)",
    glow: "rgba(167,139,250,0.32)",
    chip: "linear-gradient(145deg,#e9d5ff,#a855f7)",
  },
  offline: {
    a: "#e2e8f0",
    b: "#64748b",
    c: "#334155",
    rim: "rgba(100,116,139,0.45)",
    glow: "rgba(148,163,184,0.2)",
    chip: "linear-gradient(145deg,#f1f5f9,#94a3b8)",
  },
};

const VIEW_W = 48;
const VIEW_H = 58;

function svgPinOnly(status: VehicleStatus, uid: string): string {
  const p = PALETTE[status];
  const id = `m-${uid}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" width="${VIEW_W}" height="${VIEW_H}" aria-hidden="true">
  <defs>
    <linearGradient id="${id}-pin" x1="24" y1="4" x2="24" y2="46" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${p.a}"/>
      <stop offset="55%" stop-color="${p.b}"/>
      <stop offset="100%" stop-color="${p.c}"/>
    </linearGradient>
    <linearGradient id="${id}-shine" x1="14" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/>
      <stop offset="50%" stop-color="rgba(255,255,255,0.06)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
    <filter id="${id}-drop" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.18"/>
      <feDropShadow dx="0" dy="0.5" stdDeviation="0.35" flood-color="${p.glow}" flood-opacity="0.85"/>
    </filter>
  </defs>
  <path d="M24 3 C12.5 3 4 11.8 4 23.2 C4 31.5 11 42.5 24 55 C37 42.5 44 31.5 44 23.2 C44 11.8 35.5 3 24 3 Z" fill="url(#${id}-pin)" stroke="${p.rim}" stroke-width="0.95" filter="url(#${id}-drop)"/>
  <path d="M24 3 C12.5 3 4 11.8 4 23.2 C4 31.5 11 42.5 24 55 C37 42.5 44 31.5 44 23.2 C44 11.8 35.5 3 24 3 Z" fill="url(#${id}-shine)"/>
  <g transform="translate(24,21.5)" fill="none">
    <circle cx="-9" cy="7.5" r="3.4" fill="rgba(255,255,255,0.92)" stroke="rgba(15,23,42,0.1)" stroke-width="0.35"/>
    <circle cx="9" cy="7.5" r="3.4" fill="rgba(255,255,255,0.92)" stroke="rgba(15,23,42,0.1)" stroke-width="0.35"/>
    <path d="M-11.5 7.5 Q-11.5 2.5 -5 -1.5 L5 -2.5 Q10 -3 11.5 1.5 L11.5 7.5 Z" fill="rgba(255,255,255,0.88)" stroke="rgba(15,23,42,0.12)" stroke-width="0.38" stroke-linejoin="round"/>
    <path d="M-5 -1.5 L-1.5 -6" stroke="rgba(255,255,255,0.92)" stroke-width="0.95" stroke-linecap="round"/>
  </g>
</svg>`;
}

/** Tiny bolt (white on chip) */
function svgBolt(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path fill="white" d="M7.2 0H4.5L2.2 6.4h2.4L1.8 12 10 4.2H6.1L7.2 0z"/></svg>`;
}

/** Tiny wheel dot “live” */
function svgPulseDot(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="7" height="7" aria-hidden="true" class="elite-pin-dot-svg"><circle cx="4" cy="4" r="3" fill="#34d399" stroke="white" stroke-width="1"/></svg>`;
}

const PIN_W = 26;
const PIN_H = 32;

export function twoWheelerDivIcon(status: VehicleStatus, uniqueKey: string): L.DivIcon {
  const uid = uniqueKey.replace(/[^a-zA-Z0-9]/g, "").slice(-12) || "pin";
  const chip = PALETTE[status].chip;
  const pinEnc = encodeURIComponent(svgPinOnly(status, uid));
  const boltEnc = encodeURIComponent(svgBolt());
  const dotEnc = encodeURIComponent(svgPulseDot());

  const html = `
<div class="elite-pin-lively elite-pin-lively--${status}" style="width:${PIN_W}px;height:${PIN_H}px">
  <img class="elite-pin-base" alt="" src="data:image/svg+xml;charset=utf-8,${pinEnc}" width="${PIN_W}" height="${PIN_H}"/>
  <div class="elite-pin-chip elite-pin-chip--bolt" style="background:${chip}" title="EV live">
    <img alt="" src="data:image/svg+xml;charset=utf-8,${boltEnc}" width="10" height="10"/>
  </div>
  <div class="elite-pin-live-dot" aria-hidden="true">
    <img alt="" src="data:image/svg+xml;charset=utf-8,${dotEnc}" width="7" height="7"/>
  </div>
</div>`.trim();

  return L.divIcon({
    className: "elite-tw-marker",
    html,
    iconSize: [PIN_W, PIN_H],
    iconAnchor: [PIN_W / 2, PIN_H],
    popupAnchor: [0, -(PIN_H + 4)],
  });
}
