import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { FleetMap } from "../components/FleetMap";
import type {
  DashboardSummary,
  UtilizationSnapshot,
  Vehicle,
  VehicleStatus,
} from "../types";
import {
  Activity,
  AlertTriangle,
  Battery,
  Bike,
  Clock,
  Eye,
  Gauge,
  Lock,
  Map as MapIcon,
  Radio,
  Settings2,
  Unlock,
} from "lucide-react";
import { immobilisePillClass } from "../lib/immobiliseStyles";

function statusLabel(s: VehicleStatus): string {
  if (s === "charging") return "Charging";
  if (s === "offline") return "No link";
  return "Active";
}

function statusPillClass(s: VehicleStatus): string {
  if (s === "charging") return "bg-violet-100 text-violet-800 border-violet-200";
  if (s === "offline") return "bg-slate-100 text-slate-600 border-slate-200";
  return "bg-emerald-100 text-emerald-800 border-emerald-200";
}

function positionStale(lastPositionAt: string, slaMinutes: number): boolean {
  const t = new Date(lastPositionAt).getTime();
  if (!Number.isFinite(t)) return true;
  return Date.now() - t > slaMinutes * 60 * 1000;
}

function tierStyles(tier: string): string {
  if (tier === "minimal") return "border-slate-300 bg-slate-100 text-slate-800";
  if (tier === "reduced") return "border-amber-300 bg-amber-50 text-amber-950";
  return "border-teal-300 bg-teal-50 text-teal-950";
}

export function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [snapshots, setSnapshots] = useState<UtilizationSnapshot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [v, s, u] = await Promise.all([
      api.vehicles(),
      api.dashboardSummary(),
      api.utilizationSnapshots(),
    ]);
    setVehicles(v);
    setSummary(s);
    setSnapshots(u);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refresh();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  async function toggleImmobilisation(v: Vehicle) {
    if (!v.immobilisationEnabled) return;
    setActionId(v.id);
    setError(null);
    try {
      const next = await api.setImmobilisation(v.id, !v.immobilisationArmed);
      setVehicles((list) => list.map((x) => (x.id === next.id ? next : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Command failed");
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500 text-sm">
        Synchronising fleet data…
      </div>
    );
  }

  if (error && vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm max-w-lg">
        <p className="font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Fleet server unreachable
        </p>
        <p className="text-sm mt-1 text-amber-900/90">{error}</p>
        <p className="text-xs mt-2 text-amber-800/80">
          {import.meta.env.DEV ? (
            <>
              Start the API:{" "}
              <code className="font-mono text-teal-800">cd backend && npm run dev</code>
            </>
          ) : import.meta.env.VITE_API_URL ? (
            <>
              Check that the API is up, <code className="font-mono text-teal-800">VITE_API_URL</code> matches your
              Render URL, and Render has <code className="font-mono text-teal-800">CORS_ORIGINS</code> set to this
              site&apos;s origin.
            </>
          ) : (
            <>
              Set <code className="font-mono text-teal-800">VITE_API_URL</code> in Vercel environment variables to
              your Render API URL (HTTPS), then redeploy.
            </>
          )}
        </p>
      </div>
    );
  }

  const vis = summary?.visibility;
  const slaMin = summary?.stalePositionSlaMinutes ?? 15;
  const socThreshold = summary?.policyLowSocThresholdPercent ?? 20;

  const showMap = vis?.showOperationalMap !== false;
  const showStrip = vis?.showLiveAssetStrip !== false;
  const showSocRange = vis?.showSocAndRange !== false;
  const showLedger = vis?.showTripEnergyLedger !== false;
  const showImmobUi =
    vis?.showImmobilisationControls !== false && vis?.immobilisationFleetDisabled !== true;
  const highlightStale = vis?.highlightStalePositions !== false;
  const highlightLowSoc = vis?.highlightLowSoc !== false;

  const kpis = summary
    ? [
        {
          label: "Fleet (2W)",
          value: String(summary.vehicleCount),
          hint: `${summary.onlineCount} reporting · ${summary.offlineCount} no link`,
          icon: Bike,
        },
        {
          label: "Distance today",
          value: `${summary.totalDailyKm} km`,
          hint: `GPS uplink target ${summary.visibility.expectedPositionIntervalSec}s`,
          icon: Gauge,
        },
        {
          label: "Avg SOC",
          value: `${summary.avgSocPercent}%`,
          hint:
            summary.lowSocCount > 0 && highlightLowSoc
              ? `${summary.lowSocCount} below ${summary.policyLowSocThresholdPercent}% (policy)`
              : highlightLowSoc
                ? `Band ≥ ${summary.policyLowSocThresholdPercent}%`
                : "Low-SOC highlights off",
          icon: Battery,
          warn: highlightLowSoc && summary.lowSocCount > 0,
        },
        {
          label: "Est. range pool",
          value: `${summary.totalDteKm} km`,
          hint: `~${summary.fleetEnergyKwh.toFixed(1)} kWh · stale fixes ${highlightStale ? summary.stalePositionCount : "—"}`,
          icon: Activity,
          warn: highlightStale && summary.stalePositionCount > 0,
        },
      ]
    : [];

  const nothingVisible = !showMap && !showStrip && !showLedger;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-[1.65rem] font-semibold text-slate-900 tracking-tight">
            Command center
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Live operations for electric 2W assets over GPS telematics. What you see here follows{" "}
            <Link to="/config" className="text-teal-700 font-medium hover:underline">
              fleet policy
            </Link>
            .
          </p>
        </div>
        {vis && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${tierStyles(vis.tier)}`}
            >
              <Eye className="h-3.5 w-3.5" />
              Visibility: {vis.tier}
            </span>
            <Link
              to="/config"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Edit policy
            </Link>
          </div>
        )}
      </div>

      {vis && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${tierStyles(vis.tier)}`}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold flex items-center gap-2">
              <Radio className="h-4 w-4 opacity-80" />
              Fleet policy → command centre
            </span>
            <span className="text-xs opacity-90">
              Map {showMap ? "on" : "off"} · Strip {showStrip ? "on" : "off"} · Ledger{" "}
              {showLedger ? "on" : "off"} · Immobilise UI {showImmobUi ? "on" : "off"}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium">
            <span className="rounded-md bg-white/70 border border-current/20 px-2 py-0.5">
              GPS interval {vis.expectedPositionIntervalSec}s
            </span>
            <span className="rounded-md bg-white/70 border border-current/20 px-2 py-0.5">
              Stale SLA {slaMin} min
            </span>
            <span className="rounded-md bg-white/70 border border-current/20 px-2 py-0.5">
              Low SOC band &lt; {socThreshold}%
            </span>
            {vis.immobilisationFleetDisabled && (
              <span className="rounded-md bg-red-100 text-red-900 border border-red-200 px-2 py-0.5">
                Immobilisation disabled fleet-wide
              </span>
            )}
            {vis.geofenceAlertsEnabled && (
              <span className="rounded-md bg-white/70 border border-current/20 px-2 py-0.5">
                Geofence alerts armed
              </span>
            )}
          </div>
        </div>
      )}

      {highlightLowSoc && summary && summary.lowSocCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 items-start text-amber-950 text-sm">
          <Battery className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <p className="font-semibold">Low energy visibility</p>
            <p className="text-xs mt-0.5 text-amber-900/90">
              {summary.lowSocCount} asset(s) below policy threshold ({socThreshold}% SOC). Shown in KPIs
              and strip (amber SOC bar).
            </p>
          </div>
        </div>
      )}

      {highlightStale && summary && summary.stalePositionCount > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex gap-3 items-start text-slate-800 text-sm">
          <Clock className="h-5 w-5 shrink-0 text-slate-500 mt-0.5" />
          <div>
            <p className="font-semibold">Position freshness</p>
            <p className="text-xs mt-0.5 text-slate-600">
              {summary.stalePositionCount} asset(s) have no GPS fix within {slaMin} minutes (fleet
              stale SLA). Marked in the live strip when highlighting is enabled.
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {kpis.map(({ label, value, hint, icon: Icon, warn }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.03]"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {label}
              </span>
              <Icon
                className={`w-4 h-4 shrink-0 ${warn ? "text-amber-600" : "text-teal-600"}`}
              />
            </div>
            <div className="mt-2 text-2xl font-display font-semibold text-slate-900 tabular-nums leading-none">
              {value}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">{hint}</p>
          </div>
        ))}
      </div>

      {nothingVisible ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Eye className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="font-display font-semibold text-slate-900">No panels visible</p>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Fleet policy has turned off the map, asset strip, and ledger. Enable at least one under{" "}
            <Link to="/config" className="text-teal-700 font-medium hover:underline">
              Fleet policy
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6 items-start">
          {showMap ? (
            <section className="xl:col-span-3 rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/[0.03] overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/90">
                <div className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4 text-teal-600" />
                  <h2 className="font-display font-semibold text-slate-900 text-sm">
                    Operational map
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">
                  Bengaluru · {vehicles.length} assets · 2W markers
                </span>
              </div>
              <FleetMap
                vehicles={vehicles}
                showImmobilisationControls={showImmobUi}
                onVehicleUpdated={(v) =>
                  setVehicles((list) => list.map((x) => (x.id === v.id ? v : x)))
                }
              />
            </section>
          ) : (
            <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
              Map hidden by fleet policy (visibility).
            </div>
          )}

          {showStrip ? (
            <aside className="xl:col-span-2 rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/[0.03] flex flex-col max-h-[min(560px,62vh)] xl:max-h-[min(520px,52vh)] xl:h-full">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/90 shrink-0">
                <h2 className="font-display font-semibold text-slate-900 text-sm">
                  Live asset strip
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {showSocRange ? "SOC & range per policy" : "Identifiers only (SOC hidden by policy)"}{" "}
                  · immobilise {showImmobUi ? "if enabled on asset" : "hidden by policy"}
                </p>
              </div>
              <ul className="overflow-y-auto divide-y divide-slate-100 flex-1 min-h-0">
                {vehicles.map((v) => {
                  const stale =
                    highlightStale && positionStale(v.lastPositionAt, slaMin) && v.status !== "offline";
                  const lowSoc =
                    highlightLowSoc && v.socPercent < socThreshold;

                  return (
                    <li
                      key={v.id}
                      className={`px-4 py-3 transition-colors ${
                        stale || lowSoc ? "bg-amber-50/50" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm font-semibold text-slate-900">
                              {v.registrationNumber}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              2W
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${statusPillClass(v.status)}`}
                            >
                              {statusLabel(v.status)}
                            </span>
                            {stale && (
                              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border border-amber-300 bg-amber-100 text-amber-900">
                                Stale
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 truncate mt-0.5">{v.displayName}</p>
                          <p className="text-[10px] text-slate-400 mt-1 tabular-nums">
                            Last fix{" "}
                            {new Date(v.lastPositionAt).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {showSocRange ? (
                          <div className="text-right shrink-0">
                            <div
                              className={`text-sm font-semibold tabular-nums ${lowSoc ? "text-amber-800" : "text-slate-900"}`}
                            >
                              {v.socPercent}%
                            </div>
                            <div className="text-[10px] text-slate-500">{v.dteKm} km est.</div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 uppercase">SOC hidden</span>
                        )}
                      </div>
                      {showSocRange && (
                        <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              lowSoc ? "bg-amber-500" : "bg-teal-500"
                            }`}
                            style={{ width: `${Math.min(100, v.socPercent)}%` }}
                          />
                        </div>
                      )}
                      <div className="mt-2 flex justify-end">
                        {showImmobUi && v.immobilisationEnabled ? (
                          <button
                            type="button"
                            disabled={actionId === v.id || v.status === "offline"}
                            onClick={() => toggleImmobilisation(v)}
                            className={immobilisePillClass(v.immobilisationArmed)}
                          >
                            {v.immobilisationArmed ? (
                              <>
                                <Unlock className="h-3.5 w-3.5 opacity-80" /> Release
                              </>
                            ) : (
                              <>
                                <Lock className="h-3.5 w-3.5 opacity-80" /> Immobilise
                              </>
                            )}
                          </button>
                        ) : showImmobUi ? (
                          <span className="text-[10px] text-slate-400">Immob. disabled on asset</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Immob. UI off (policy)</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : (
            <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              Live strip hidden by fleet policy.
            </div>
          )}
        </div>
      )}

      {showLedger && (
        <section>
          <h2 className="font-display text-base font-semibold text-slate-900 mb-3">
            Trip &amp; energy ledger
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/[0.03]">
            <table className="w-full text-sm text-left min-w-[800px]">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Registration</th>
                  <th className="px-4 py-3 font-semibold">Class</th>
                  <th className="px-4 py-3 text-right font-semibold">SOC</th>
                  <th className="px-4 py-3 text-right font-semibold">Est. range</th>
                  <th className="px-4 py-3 text-right font-semibold">Today km</th>
                  <th className="px-4 py-3 text-right font-semibold">Utilisation</th>
                  <th className="px-4 py-3 text-right font-semibold">Pack</th>
                  <th className="px-4 py-3 text-right font-semibold">Odometer</th>
                  <th className="px-4 py-3 font-semibold">Telematics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snapshots.map((row) => (
                  <tr key={row.vehicleId} className="hover:bg-slate-50/90">
                    <td className="px-4 py-3">
                      <span className="font-mono font-medium text-slate-900">
                        {row.registrationNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-slate-600">{row.assetClass}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-800">{row.socPercent}%</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-800">{row.dteKm} km</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-800">{row.dailyKm}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                      {row.utilizationPercent}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-800">{row.batteryKwh} kWh</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                      {row.odometerKm.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">GPS / non-CAN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!showLedger && !nothingVisible && (
        <p className="text-sm text-slate-500 border border-slate-200 rounded-lg bg-slate-50 px-4 py-3">
          Trip &amp; energy ledger is hidden by fleet policy.
        </p>
      )}
    </div>
  );
}
