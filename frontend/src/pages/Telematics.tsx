import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { TelematicsDevice, Vehicle } from "../types";
import { Link2, Link2Off, Plus, Radio } from "lucide-react";

export function TelematicsPage() {
  const [devices, setDevices] = useState<TelematicsDevice[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [serialNumber, setSerialNumber] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [d, v] = await Promise.all([api.telematics(), api.vehicles()]);
    setDevices(d);
    setVehicles(v);
  }

  useEffect(() => {
    refresh().catch(() => setError("Could not load devices"));
  }, []);

  const vehicleById = useMemo(() => {
    const m = new Map<string, Vehicle>();
    vehicles.forEach((v) => m.set(v.id, v));
    return m;
  }, [vehicles]);

  async function register(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.registerTelematics({
        serialNumber: serialNumber || undefined,
        firmware: "2.4.1",
      });
      setSerialNumber("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    }
  }

  async function pair(deviceId: string, vehicleId: string) {
    setBusyId(deviceId);
    setError(null);
    try {
      await api.pair(deviceId, vehicleId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pair failed");
    } finally {
      setBusyId(null);
    }
  }

  async function unpair(deviceId: string) {
    setBusyId(deviceId);
    setError(null);
    try {
      await api.unpair(deviceId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unpair failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">GPS devices</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Register ELITE-GPS units and bind them to two-wheeler assets. e-lite does not ship a CAN
          interface — all runtime data flows through the cellular GPS module (position, relayed
          commands).
        </p>
      </div>

      <form
        onSubmit={register}
        className="rounded-2xl border border-slate-200/90 bg-white p-6 flex flex-col sm:flex-row gap-4 items-end shadow-sm ring-1 ring-slate-900/[0.03]"
      >
        <label className="flex-1 w-full space-y-1.5">
          <span className="text-xs font-medium text-slate-600">Serial number (optional)</span>
          <input
            className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm font-mono"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="ELITE-GPS-… auto if empty"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Register unit
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-800 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-sm ring-1 ring-slate-900/[0.03]">
        <table className="w-full text-sm text-slate-800">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide text-left border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" /> Device
                </span>
              </th>
              <th className="px-4 py-3 font-semibold">Firmware</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Last seen</th>
              <th className="px-4 py-3 font-semibold">Paired 2W</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {devices.map((d) => {
              const paired = d.pairedVehicleId ? vehicleById.get(d.pairedVehicleId) : undefined;
              return (
                <tr key={d.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm font-semibold text-teal-800">{d.serialNumber}</div>
                    <div className="text-[11px] text-slate-400">{d.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums">{d.firmware}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                      GPS
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs tabular-nums">
                    {new Date(d.lastSeenAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {paired ? (
                      <span>
                        <span className="font-mono font-medium">{paired.registrationNumber}</span>{" "}
                        <span className="text-slate-400 text-xs">(2W)</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {d.pairedVehicleId ? (
                      <button
                        type="button"
                        disabled={busyId === d.id}
                        onClick={() => unpair(d.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm"
                      >
                        <Link2Off className="w-3.5 h-3.5" />
                        Unpair
                      </button>
                    ) : (
                      <PairSelect
                        busy={busyId === d.id}
                        devices={devices}
                        device={d}
                        vehicles={vehicles}
                        onPair={(vehicleId) => pair(d.id, vehicleId)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PairSelect({
  device,
  devices,
  vehicles,
  busy,
  onPair,
}: {
  device: TelematicsDevice;
  devices: TelematicsDevice[];
  vehicles: Vehicle[];
  busy: boolean;
  onPair: (vehicleId: string) => void;
}) {
  const [vehicleId, setVehicleId] = useState("");

  const taken = new Set(
    devices.filter((x) => x.pairedVehicleId && x.id !== device.id).map((x) => x.pairedVehicleId),
  );

  const eligible = vehicles.filter((v) => !taken.has(v.id));

  return (
    <span className="inline-flex items-center gap-2">
      <select
        className="rounded-md bg-white border border-slate-200 text-slate-900 text-xs px-2 py-1.5 max-w-[180px] shadow-sm font-mono"
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
      >
        <option value="">Select 2W…</option>
        {eligible.map((v) => (
          <option key={v.id} value={v.id}>
            {v.registrationNumber}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={busy || !vehicleId}
        onClick={() => vehicleId && onPair(vehicleId)}
        className="inline-flex items-center gap-1 rounded-md bg-teal-50 border border-teal-200 px-2 py-1 text-xs text-teal-900 hover:bg-teal-100 disabled:opacity-40 font-semibold"
      >
        <Link2 className="w-3.5 h-3.5" />
        Pair
      </button>
    </span>
  );
}
