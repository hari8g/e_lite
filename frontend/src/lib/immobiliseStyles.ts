/** Subtle pill styling for immobilise / release (strip + map popup) */
export function immobilisePillClass(armed: boolean): string {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all shadow-sm border disabled:opacity-40 disabled:pointer-events-none";
  if (armed) {
    return `${base} border-amber-200/80 bg-gradient-to-b from-amber-50/95 to-amber-100/70 text-amber-950 hover:from-amber-50 hover:to-amber-100`;
  }
  return `${base} border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 text-slate-700 hover:from-slate-50/80 hover:to-slate-100/80`;
}
