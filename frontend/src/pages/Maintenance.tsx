import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { MaintenanceRecord, MaintenanceStatus, MaintenanceWorkType, Vehicle } from "../types";
import { Plus, Wrench } from "lucide-react";

const WORK_TYPE_LABEL: Record<string, string> = {
  scheduled_service: "Scheduled service",
  battery_check: "Battery check",
  inspection: "Inspection",
  tyre: "Tyres",
  repair: "Repair",
};

const STATUS_OPTIONS: MaintenanceStatus[] = [
  "open",
  "scheduled",
  "in_progress",
  "overdue",
  "done",
  "cancelled",
];

function statusBadgeClass(status: string) {
  switch (status) {
    case "done":
      return "bg-emerald-50 text-emerald-900 border-emerald-200";
    case "overdue":
      return "bg-rose-50 text-rose-900 border-rose-200";
    case "in_progress":
      return "bg-amber-50 text-amber-900 border-amber-200";
    case "scheduled":
      return "bg-sky-50 text-sky-900 border-sky-200";
    case "cancelled":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-white text-slate-800 border-slate-200";
  }
}

export function MaintenancePage() {
  const [rows, setRows] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [vehicleId, setVehicleId] = useState("");
  const [workType, setWorkType] = useState<MaintenanceWorkType>("scheduled_service");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState("");
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");

  async function refresh() {
    const [m, v] = await Promise.all([api.maintenance(), api.vehicles()]);
    setRows(m);
    setVehicles(v);
    if (!vehicleId && v.length) setVehicleId(v[0].id);
  }

  useEffect(() => {
    setLoading(true);
    refresh()
      .catch(() => setError("Could not load maintenance"))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [rows]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!vehicleId) {
      setError("Select a vehicle");
      return;
    }
    const body: Record<string, unknown> = {
      vehicleId,
      workType,
      title: title.trim() || "Work item",
      dueDate,
      vendor: vendor.trim(),
      notes: notes.trim(),
      status: "open",
    };
    const o = odometer.trim();
    if (o !== "" && !Number.isNaN(Number(o))) body.odometerAtDue = Number(o);
    try {
      await api.createMaintenance(body);
      setTitle("");
      setNotes("");
      setVendor("");
      setOdometer("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  async function patchStatus(id: string, status: string) {
    setBusyId(id);
    setError(null);
    try {
      const updated = await api.updateMaintenance(id, { status });
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <div className="text-slate-500 text-sm">Loading maintenance…</div>;
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Maintenance &amp; service</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Plan work by vehicle, track due dates and vendor visits, and close items when service is
          complete. Data is stored with the demo fleet (Bengaluru 2W).
        </p>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50/90 px-4 py-3 flex gap-3 text-sm shadow-sm">
        <Wrench className="w-5 h-5 shrink-0 text-teal-700 mt-0.5" />
        <p className="text-xs text-teal-950 leading-relaxed">
          <span className="font-semibold text-teal-900">Operator note:</span> this is a lightweight
          work list for the command centre. Hook the same endpoints to your CMMS or workshop system
          when you are ready.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={onCreate}
        className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm ring-1 ring-slate-900/[0.03] space-y-4"
      >
        <h2 className="text-sm font-semibold text-slate-900">Log new work</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className="text-xs font-medium text-slate-600">Vehicle</span>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} · {v.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-medium text-slate-600">Work type</span>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={workType}
              onChange={(e) => setWorkType(e.target.value as MaintenanceWorkType)}
            >
              {(Object.keys(WORK_TYPE_LABEL) as MaintenanceWorkType[]).map((k) => (
                <option key={k} value={k}>
                  {WORK_TYPE_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 block sm:col-span-2">
            <span className="text-xs font-medium text-slate-600">Title</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. A-service, tyre rotation"
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-medium text-slate-600">Due date</span>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-medium text-slate-600">Odometer at due (optional, km)</span>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm font-mono"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              placeholder="—"
            />
          </label>
          <label className="space-y-1.5 block sm:col-span-2">
            <span className="text-xs font-medium text-slate-600">Vendor / bay (optional)</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          </label>
          <label className="space-y-1.5 block sm:col-span-2">
            <span className="text-xs font-medium text-slate-600">Notes</span>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm resize-y min-h-[2.5rem]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add work item
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/[0.03] overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/80">
          <h2 className="text-sm font-semibold text-slate-900">Open &amp; upcoming</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sorted by due date. Update status as jobs move.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Vehicle</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Title</th>
                <th className="px-4 py-2.5 font-semibold whitespace-nowrap">Due</th>
                <th className="px-4 py-2.5 font-semibold whitespace-nowrap">Odo</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs font-semibold text-slate-900">{r.registrationNumber}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[10rem] md:max-w-[14rem]">
                      {vehicles.find((v) => v.id === r.vehicleId)?.displayName ?? r.vehicleId}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    {WORK_TYPE_LABEL[r.workType] ?? r.workType}
                  </td>
                  <td className="px-4 py-3 text-slate-800 max-w-xs">
                    <div className="font-medium">{r.title}</div>
                    {r.vendor ? <div className="text-xs text-slate-500 mt-0.5">{r.vendor}</div> : null}
                  </td>
                  <td className="px-4 py-3 text-slate-700 tabular-nums whitespace-nowrap">{r.dueDate}</td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums font-mono text-xs whitespace-nowrap">
                    {r.odometerAtDue != null ? `${r.odometerAtDue.toLocaleString()} km` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span
                        className={`inline-flex w-fit text-[11px] font-semibold uppercase tracking-wide rounded-md border px-2 py-0.5 ${statusBadgeClass(r.status)}`}
                      >
                        {r.status.replace(/_/g, " ")}
                      </span>
                      <select
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 shadow-sm max-w-[9rem]"
                        value={r.status}
                        disabled={busyId === r.id}
                        onChange={(e) => patchStatus(r.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No work items yet.</p>
        ) : null}
      </div>
    </div>
  );
}
