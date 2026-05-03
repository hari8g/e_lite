import { useCallback, useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { api } from "../api/client";
import type { Vehicle, VehicleLiveTelemetry, VehicleStatus } from "../types";
import { twoWheelerDivIcon } from "../lib/twoWheelerMapIcon";
import {
  Activity,
  Battery,
  Bike,
  Flame,
  Gauge,
  KeyRound,
  Lock,
  MapPinned,
  Navigation,
  Sparkles,
  Timer,
  Unlock,
  Zap,
} from "lucide-react";
import { immobilisePillClass } from "../lib/immobiliseStyles";

const LIVE_POLL_MS = 2000;

type Props = {
  vehicle: Vehicle;
  showImmobilisationControls: boolean;
  onVehicleUpdated?: (v: Vehicle) => void;
};

function headerGradient(status: VehicleStatus): string {
  switch (status) {
    case "charging":
      return "from-violet-500 via-purple-600 to-indigo-800";
    case "offline":
      return "from-slate-400 via-slate-500 to-slate-700";
    default:
      return "from-teal-400 via-teal-600 to-emerald-900";
  }
}

function scoreHue(score: number): string {
  if (score >= 88) return "text-emerald-700";
  if (score >= 75) return "text-teal-800";
  if (score >= 65) return "text-amber-800";
  return "text-rose-700";
}

function scoreBg(score: number): string {
  if (score >= 88) return "from-emerald-400/30 to-teal-500/20 border-emerald-300/50";
  if (score >= 75) return "from-teal-400/25 to-cyan-500/15 border-teal-300/50";
  if (score >= 65) return "from-amber-400/25 to-orange-400/15 border-amber-300/50";
  return "from-rose-400/25 to-orange-400/15 border-rose-300/50";
}

export function VehicleMapMarker({
  vehicle,
  showImmobilisationControls,
  onVehicleUpdated,
}: Props) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [position, setPosition] = useState<[number, number]>([vehicle.latitude, vehicle.longitude]);
  const [live, setLive] = useState<VehicleLiveTelemetry | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [immobBusy, setImmobBusy] = useState(false);
  const icon = useRef(twoWheelerDivIcon(vehicle.status, vehicle.id));

  const fetchLive = useCallback(async () => {
    try {
      const data = await api.vehicleLive(vehicle.id);
      setLive(data);
      setLiveError(null);
      setPosition([data.latitude, data.longitude]);
    } catch (e) {
      setLiveError(e instanceof Error ? e.message : "Live feed failed");
    }
  }, [vehicle.id]);

  useEffect(() => {
    if (!popupOpen) {
      setPosition([vehicle.latitude, vehicle.longitude]);
      setLive(null);
      setLiveError(null);
      return;
    }
    void fetchLive();
    const id = window.setInterval(() => void fetchLive(), LIVE_POLL_MS);
    return () => window.clearInterval(id);
  }, [popupOpen, vehicle.latitude, vehicle.longitude, fetchLive]);

  async function toggleImmobilisation() {
    if (!vehicle.immobilisationEnabled || !live) return;
    setImmobBusy(true);
    try {
      const next = await api.setImmobilisation(vehicle.id, !live.immobilisationArmed);
      onVehicleUpdated?.(next);
      await fetchLive();
    } catch (e) {
      setLiveError(e instanceof Error ? e.message : "Immobilisation command failed");
    } finally {
      setImmobBusy(false);
    }
  }

  const display = live;
  const speed = display?.speedKmh ?? 0;
  const canImmobUi =
    showImmobilisationControls && vehicle.immobilisationEnabled && display?.status !== "offline";

  return (
    <Marker
      position={position}
      icon={icon.current}
      eventHandlers={{
        popupopen: () => setPopupOpen(true),
        popupclose: () => setPopupOpen(false),
      }}
    >
      <Popup
        className="elite-map-popup"
        minWidth={280}
        maxWidth={380}
        maxHeight={580}
        autoPan
        autoPanPadding={[20, 20]}
        keepInView
      >
        <div className="elite-popup-scroll rounded-2xl text-slate-900 text-[13px] leading-snug">
          {/* Colourful header */}
          <div
            className={`relative px-3 sm:px-4 pt-3 sm:pt-4 pb-8 sm:pb-9 bg-gradient-to-br ${headerGradient(display?.status ?? vehicle.status)} text-white shrink-0`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-20%,rgba(255,255,255,0.35),transparent)] pointer-events-none" />
            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-base sm:text-lg tracking-tight text-white drop-shadow-sm break-all">
                    {vehicle.registrationNumber}
                  </span>
                  <div className="flex items-center gap-1 shrink-0" title="Electric two-wheeler · live">
                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-white/20 border border-white/35 text-white shadow-md backdrop-blur-sm ring-1 ring-white/20">
                      <Bike
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white drop-shadow animate-[pulse_2s_ease-in-out_infinite]"
                        strokeWidth={2.4}
                      />
                    </span>
                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-amber-300/25 border border-amber-200/50 text-amber-50 shadow-md backdrop-blur-sm ring-1 ring-amber-200/30">
                      <Zap
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-100 drop-shadow animate-pulse"
                        strokeWidth={2.4}
                      />
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/90 mt-1.5 font-medium leading-snug break-words">
                  {vehicle.displayName}
                </p>
              </div>
              <MapPinned className="w-5 h-5 text-white/75 shrink-0 mt-0.5" strokeWidth={2} />
            </div>
          </div>

          <div className="px-3 sm:px-4 -mt-5 relative z-[1] pb-3 sm:pb-4 pt-0">
            {liveError && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200/80 rounded-xl px-3 py-2 mb-3 shadow-sm">
                {liveError}
              </p>
            )}

            {!display && !liveError && (
              <div className="rounded-2xl bg-white/95 border border-slate-200/90 shadow-lg px-4 py-8 text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-700 mb-2">
                  <Activity className="h-5 w-5 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-slate-600">Connecting live feed…</p>
              </div>
            )}

            {display && (
              <div className="space-y-2.5 sm:space-y-3">
                {/* Speed hero card */}
                <div className="rounded-2xl border border-teal-200/60 bg-gradient-to-br from-white via-teal-50/40 to-cyan-50/30 p-3 sm:p-4 shadow-md ring-1 ring-teal-500/10">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner ${
                          speed > 0
                            ? "bg-gradient-to-br from-teal-400 to-emerald-600 text-white"
                            : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600"
                        }`}
                      >
                        <div className="elite-live-bob flex items-center justify-center">
                          <Navigation
                            className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow shrink-0"
                            strokeWidth={2.2}
                            style={{ transform: `rotate(${display.headingDeg}deg)` }}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700/80">
                          Live movement
                        </p>
                        <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 break-words">
                          GPS · {LIVE_POLL_MS / 1000}s ·{" "}
                          <span className="font-mono text-slate-700">{display.headingDeg}°</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl sm:text-3xl font-display font-bold tabular-nums bg-gradient-to-br from-slate-900 to-teal-900 bg-clip-text text-transparent leading-none">
                        {speed}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-teal-700/90 mt-0.5">km/h</p>
                    </div>
                  </div>
                </div>

                {/* Colourful metric tiles */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 min-w-0">
                  <div className="rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-orange-50/80 px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm min-w-0">
                    <div className="flex items-center gap-1 text-amber-800/90 min-w-0">
                      <Zap className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide truncate">
                        Harsh accel
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold tabular-nums text-amber-950 mt-1">
                      {display.harshAccelerationCount30s}
                      <span className="text-[11px] font-semibold text-amber-800/70 ml-1">
                        / {display.harshEventsWindowSec}s
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-200/70 bg-gradient-to-br from-rose-50 to-fuchsia-50/70 px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm min-w-0">
                    <div className="flex items-center gap-1 text-rose-800/90 min-w-0">
                      <Flame className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide truncate">
                        Harsh brake
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold tabular-nums text-rose-950 mt-1">
                      {display.harshBrakingCount30s}
                      <span className="text-[11px] font-semibold text-rose-800/70 ml-1">
                        / {display.harshEventsWindowSec}s
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-teal-50/80 px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm min-w-0">
                    <div className="flex items-center gap-1 text-emerald-800/90">
                      <Battery className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">DTE</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold tabular-nums text-emerald-950 mt-1 truncate">
                      {display.dteKm} km
                    </p>
                  </div>
                  <div
                    className={`rounded-xl border bg-gradient-to-br px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm min-w-0 ${scoreBg(display.driverScore)}`}
                  >
                    <div className={`flex items-center gap-1 min-w-0 ${scoreHue(display.driverScore)}`}>
                      <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide truncate">
                        Driver score
                      </span>
                    </div>
                    <p className={`text-base sm:text-lg font-bold tabular-nums mt-1 ${scoreHue(display.driverScore)}`}>
                      {display.driverScore}
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-200/70 bg-gradient-to-br from-sky-50 to-blue-50/80 px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm min-w-0">
                    <div className="flex items-center gap-1 text-sky-900/80">
                      <Gauge className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">Today</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold tabular-nums text-sky-950 mt-1 truncate">
                      {display.totalKmToday} km
                    </p>
                  </div>
                  <div className="rounded-xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-violet-50/70 px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm min-w-0">
                    <div className="flex items-center gap-1 text-indigo-900/80 min-w-0">
                      <KeyRound className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide leading-tight">
                        Since ignition
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold tabular-nums text-indigo-950 mt-1 truncate">
                      {display.kmSinceIgnitionOn} km
                    </p>
                  </div>
                  <div className="rounded-xl border border-violet-200/70 bg-gradient-to-br from-violet-50 to-purple-50/60 px-2.5 sm:px-3 py-2 sm:py-2.5 shadow-sm col-span-2 min-w-0">
                    <div className="flex items-center gap-1 text-violet-900/80">
                      <Timer className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">
                        Idle (session)
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-bold tabular-nums text-violet-950 mt-1">
                      {display.idleTimeMinutes} min
                    </p>
                  </div>
                </div>

                {/* SOC strip */}
                <div className="rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-slate-100/80 px-2.5 sm:px-3 py-2 sm:py-2.5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                      <Battery className="h-3.5 w-3.5 text-cyan-600" />
                      Pack SOC
                    </span>
                    <span className="font-mono font-bold text-slate-800">{display.socPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200/90 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-600 transition-all duration-500"
                      style={{ width: `${Math.min(100, display.socPercent)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 text-center">
                    Harsh window resets in{" "}
                    <span className="font-mono font-semibold text-violet-700">
                      {Math.ceil(display.nextHarshWindowInMs / 1000)}s
                    </span>
                  </p>
                </div>

                {canImmobUi && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      disabled={immobBusy || display.status === "offline"}
                      onClick={() => void toggleImmobilisation()}
                      className={immobilisePillClass(display.immobilisationArmed)}
                    >
                      {display.immobilisationArmed ? (
                        <>
                          <Unlock className="h-3.5 w-3.5 opacity-80" />
                          Release
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5 opacity-80" />
                          Immobilise
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
