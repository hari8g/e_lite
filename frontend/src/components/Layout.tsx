import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Bike, LayoutDashboard, Radio, Settings2, UserCircle2, Wrench } from "lucide-react";

const navLink = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal",
    isActive
      ? "bg-teal-50 text-teal-900 border border-teal-200 shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent",
  ].join(" ");

export function Layout() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="border-b md:border-b-0 md:border-r border-slate-200 bg-white shrink-0 md:w-52 lg:w-56 md:min-h-screen flex flex-col">
        <div className="flex items-start gap-3 px-3 pt-4 pb-3 md:px-4 md:pt-5 md:pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white shadow-sm shrink-0">
            <Bike className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="font-display text-base font-bold text-slate-900 tracking-tight leading-tight">
              e-lite
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">Basic fleet stack</p>
          </div>
        </div>
        <nav className="flex md:flex-col gap-0.5 p-2 md:p-3 md:pt-2 overflow-x-auto md:overflow-y-auto md:overflow-x-visible md:flex-1">
          <NavLink to="/" end className={navLink}>
            <LayoutDashboard className="w-4 h-4 shrink-0 opacity-80" />
            Command center
          </NavLink>
          <NavLink to="/onboard" className={navLink}>
            <Bike className="w-4 h-4 shrink-0 opacity-80" />
            Add vehicle
          </NavLink>
          <NavLink to="/telematics" className={navLink}>
            <Radio className="w-4 h-4 shrink-0 opacity-80" />
            GPS devices
          </NavLink>
          <NavLink to="/maintenance" className={navLink}>
            <Wrench className="w-4 h-4 shrink-0 opacity-80" />
            Maintenance
          </NavLink>
          <NavLink to="/config" className={navLink}>
            <Settings2 className="w-4 h-4 shrink-0 opacity-80" />
            Policy &amp; visibility
          </NavLink>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col min-h-0 min-w-0">
        <header className="shrink-0 border-b border-slate-200 bg-white z-10">
          <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                <span className="font-display text-lg font-bold text-slate-900 tracking-tight">e-lite</span>
                <span className="text-sm text-slate-500 font-medium">Electric fleet operations</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-[0.12em] font-semibold mt-1">
                GPS telematics · CAN · 2W · Bengaluru
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-xs text-slate-500 tabular-nums text-right leading-tight max-w-[9.5rem] sm:max-w-none">
                {now.toLocaleString(undefined, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                Live
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                aria-label="Operator menu"
              >
                <UserCircle2 className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Operator</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
