import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Bike, LayoutDashboard, Radio, Settings2, UserCircle2, Wrench } from "lucide-react";

const navLink = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white z-20">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm shrink-0">
              <Bike className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-display text-lg font-semibold text-slate-900 tracking-tight">
                  e-lite
                </span>
                <span className="text-sm text-slate-500 hidden sm:inline">
                  Electric fleet operations
                </span>
              </div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                GPS telematics · 2W · Bengaluru
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline text-xs text-slate-500 tabular-nums">
              {now.toLocaleString(undefined, {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short",
              })}
            </span>
            <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
              Live
            </span>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white"
              aria-label="Operator menu"
            >
              <UserCircle2 className="h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">Operator</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        <aside className="border-b md:border-b-0 md:border-r border-slate-200 bg-white md:w-52 lg:w-56 shrink-0 md:min-h-0">
          <nav className="flex md:flex-col gap-0.5 p-2 md:p-3 md:pt-4 overflow-x-auto md:overflow-visible">
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

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
