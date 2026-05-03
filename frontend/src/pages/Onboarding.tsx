import { FormEvent, useState } from "react";
import { api } from "../api/client";
import type { Vehicle } from "../types";
import { Bike, CheckCircle2, Info } from "lucide-react";

export function Onboarding() {
  const [registrationNumber, setRegistrationNumber] = useState("KA01EV9001");
  const [displayName, setDisplayName] = useState("");
  const [model, setModel] = useState("E-2W Urban Pro");
  const [immobilisationEnabled, setImmobilisationEnabled] = useState(true);
  const [latitude, setLatitude] = useState("12.9716");
  const [longitude, setLongitude] = useState("77.5946");
  const [batteryKwh, setBatteryKwh] = useState("3.2");
  const [odometerKm, setOdometerKm] = useState("0");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const wh = Number(batteryKwh) || 3;
      const v = await api.onboardVehicle({
        registrationNumber,
        displayName: displayName || `Unit ${registrationNumber}`,
        model,
        immobilisationEnabled,
        latitude: Number(latitude),
        longitude: Number(longitude),
        batteryKwh: wh,
        odometerKm: Number(odometerKm),
        socPercent: 100,
        dteKm: Math.round(wh * 22),
      });
      setResult(v);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Register vehicle</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Add a <strong className="font-medium text-slate-800">two-wheeler EV</strong> to the fleet.
          e-lite ingests position and energy estimates via{" "}
          <strong className="font-medium text-slate-800">GPS telematics only</strong> — there is no
          CAN bus path in this product.
        </p>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 flex gap-3 text-sm text-teal-950">
        <Info className="w-5 h-5 shrink-0 text-teal-700 mt-0.5" />
        <div>
          <p className="font-semibold text-teal-900">Non-CAN telematics</p>
          <p className="text-teal-800/90 mt-1 text-xs leading-relaxed">
            Pair an ELITE-GPS device after onboarding under GPS devices. Commands such as
            immobilisation are relayed through the cellular GPS unit.
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-sm ring-1 ring-slate-900/[0.03]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-600">Registration</span>
            <input
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 font-mono"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-600">Display name</span>
            <input
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Depot north lead"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-slate-600">Model</span>
          <input
            className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </label>

        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={immobilisationEnabled}
            onChange={(e) => setImmobilisationEnabled(e.target.checked)}
            className="rounded border-slate-300 text-teal-600"
          />
          <span className="text-sm text-slate-800">
            Allow remote immobilisation (GPS relay)
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-600">Seed latitude</span>
            <input
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              type="number"
              step="any"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-600">Seed longitude</span>
            <input
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              type="number"
              step="any"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-600">Battery pack (kWh)</span>
            <input
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={batteryKwh}
              onChange={(e) => setBatteryKwh(e.target.value)}
              type="number"
              min={0.5}
              step={0.1}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-600">Odometer (km)</span>
            <input
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={odometerKm}
              onChange={(e) => setOdometerKm(e.target.value)}
              type="number"
              min={0}
            />
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-800 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2.5 text-sm shadow-sm disabled:opacity-50 transition-colors"
        >
          <Bike className="w-4 h-4" />
          {busy ? "Saving…" : "Register into fleet"}
        </button>
      </form>

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 flex gap-3 items-start shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-emerald-900">Vehicle registered</p>
            <p className="text-sm text-emerald-800 mt-1 font-mono">
              {result.registrationNumber} · {result.id}
            </p>
            <p className="text-xs text-emerald-800/80 mt-2">
              Pair a GPS device under <strong>GPS devices</strong> to attach telemetry.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
