import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { EliteFleetConfig } from "../types";
import { Eye, Info, LayoutDashboard } from "lucide-react";

export function FleetConfigPage() {
  const [cfg, setCfg] = useState<EliteFleetConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .fleetConfig()
      .then(setCfg)
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cfg) return;
    setSaved(false);
    const next = await api.updateFleetConfig(cfg);
    setCfg(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading || !cfg) {
    return <div className="text-slate-500 text-sm">Loading fleet policy…</div>;
  }

  const cc = cfg.commandCentre;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Fleet policy</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Telemetry rules and <strong className="text-slate-800">command-centre visibility</strong>{" "}
          for GPS-only electric 2W operations. Changes apply immediately to the{" "}
          <Link to="/" className="text-teal-700 font-medium hover:underline inline-flex items-center gap-1">
            <LayoutDashboard className="w-3.5 h-3.5" /> command centre
          </Link>
          .
        </p>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50/90 px-4 py-3 flex gap-3 text-sm shadow-sm">
        <Eye className="w-5 h-5 shrink-0 text-teal-700 mt-0.5" />
        <div className="text-xs text-teal-950 leading-relaxed">
          <p className="font-semibold text-teal-900">Visibility controls</p>
          <p className="mt-1">
            Turn panels on or off for all operators. Alert highlights use the thresholds below (low
            SOC, stale GPS fix). Immobilisation still respects per-vehicle enablement unless disabled
            fleet-wide.
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/[0.03]"
      >
        <fieldset className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <legend className="text-sm font-semibold text-slate-900 px-1 flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-600" />
            Command centre visibility
          </legend>
          <p className="text-xs text-slate-500 -mt-1 mb-2">
            Controls what appears on the operations dashboard. Does not stop data collection on
            devices.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {(
              [
                ["showOperationalMap", "Operational map (live positions)"],
                ["showLiveAssetStrip", "Live asset strip (side list)"],
                ["showSocAndRange", "SOC & est. range in strip"],
                ["showTripEnergyLedger", "Trip & energy ledger table"],
                ["showImmobilisationControls", "Immobilise / release buttons"],
                ["highlightStalePositions", "Highlight assets past GPS freshness SLA"],
                ["highlightLowSoc", "Highlight low-SOC against policy threshold"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-start gap-2.5 text-sm text-slate-800 cursor-pointer rounded-lg border border-transparent hover:border-slate-200 p-2 -m-2"
              >
                <input
                  type="checkbox"
                  checked={cc[key as keyof typeof cc] !== false}
                  onChange={(e) =>
                    setCfg({
                      ...cfg,
                      commandCentre: { ...cc, [key]: e.target.checked },
                    })
                  }
                  className="rounded border-slate-300 text-teal-600 mt-0.5"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4">
          <legend className="text-sm font-semibold text-slate-900 px-1">
            Telemetry &amp; alert thresholds
          </legend>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              GPS uplink target interval
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="number"
                min={30}
                max={600}
                step={10}
                className="w-28 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm tabular-nums"
                value={cfg.positionReportIntervalSec}
                onChange={(e) =>
                  setCfg({
                    ...cfg,
                    positionReportIntervalSec: Number(e.target.value) || 60,
                  })
                }
              />
              <span className="text-sm text-slate-500">seconds (shown on command centre as SLA)</span>
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Stale position threshold
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="number"
                min={5}
                max={120}
                step={5}
                className="w-24 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm tabular-nums"
                value={cfg.stalePositionThresholdMin ?? 15}
                onChange={(e) =>
                  setCfg({
                    ...cfg,
                    stalePositionThresholdMin: Number(e.target.value) || 15,
                  })
                }
              />
              <span className="text-sm text-slate-500">
                minutes — last fix older than this is flagged when highlighting is on
              </span>
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Low SOC alert threshold
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="number"
                min={5}
                max={50}
                className="w-24 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm tabular-nums"
                value={cfg.lowSocAlertPercent}
                onChange={(e) =>
                  setCfg({
                    ...cfg,
                    lowSocAlertPercent: Number(e.target.value) || 20,
                  })
                }
              />
              <span className="text-sm text-slate-500">% pack — fleet-wide alert band</span>
            </div>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={cfg.geofenceAlerts}
              onChange={(e) => setCfg({ ...cfg, geofenceAlerts: e.target.checked })}
              className="rounded border-slate-300 text-teal-600"
            />
            Geofence breach alerts (when zones are configured downstream)
          </label>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2">
          <legend className="text-sm font-semibold text-slate-900 px-1">
            Immobilisation (fleet-wide)
          </legend>
          <p className="text-xs text-slate-500 mb-2">
            When disabled, remote immobilisation is blocked for all assets and controls can be hidden
            via visibility toggles above.
          </p>
          <select
            className="w-full max-w-md rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
            value={cfg.immobilisationPolicy}
            onChange={(e) => setCfg({ ...cfg, immobilisationPolicy: e.target.value })}
          >
            <option value="operator_controlled">Operator controlled — dispatch may arm / release</option>
            <option value="supervisor_ack">Supervisor acknowledgement required (audit)</option>
            <option value="disabled">Disabled fleet-wide — no remote immobilisation</option>
          </select>
        </fieldset>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex gap-3 text-sm text-slate-700">
          <Info className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
          <p className="text-xs leading-relaxed">
            Product <span className="font-mono font-medium">{cfg.product}</span> · mode{" "}
            <span className="font-mono">{cfg.telematics}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2.5 text-sm shadow-sm transition-colors"
          >
            Save policy
          </button>
          {saved && <span className="text-sm text-emerald-600 font-medium">Saved — command centre updated.</span>}
        </div>
      </form>
    </div>
  );
}
