import type {
  DashboardSummary,
  EliteFleetConfig,
  MaintenanceRecord,
  TelematicsDevice,
  UtilizationSnapshot,
  Vehicle,
  VehicleLiveTelemetry,
} from "../types";

/** Dev: Vite proxy. Prod: must set VITE_API_URL (HTTPS Render URL); never default to http://localhost on HTTPS — mixed content blocks it. */
const base = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/$/, "") ?? "";

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  if (!import.meta.env.DEV && !base) {
    throw new Error(
      "VITE_API_URL is not set. In Vercel → Project → Settings → Environment Variables, add VITE_API_URL with your Render API origin (e.g. https://your-api.onrender.com), then redeploy.",
    );
  }
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => json<{ ok: boolean; telematics?: string }>("/api/health"),
  vehicles: () => json<Vehicle[]>("/api/vehicles"),
  vehicle: (id: string) => json<Vehicle>(`/api/vehicles/${id}`),
  vehicleLive: (id: string) => json<VehicleLiveTelemetry>(`/api/vehicles/${id}/live`),
  onboardVehicle: (body: Partial<Vehicle> & Record<string, unknown>) =>
    json<Vehicle>("/api/vehicles", { method: "POST", body: JSON.stringify(body) }),
  updateVehicle: (id: string, body: Partial<Vehicle>) =>
    json<Vehicle>(`/api/vehicles/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  setImmobilisation: (id: string, arm: boolean) =>
    json<Vehicle>(`/api/vehicles/${id}/immobilisation`, {
      method: "POST",
      body: JSON.stringify({ arm }),
    }),
  telematics: () => json<TelematicsDevice[]>("/api/telematics"),
  registerTelematics: (body: { serialNumber?: string; firmware?: string }) =>
    json<TelematicsDevice>("/api/telematics", { method: "POST", body: JSON.stringify(body) }),
  pair: (telematicsId: string, vehicleId: string) =>
    json<{ telematics: TelematicsDevice; vehicle: Vehicle }>(
      `/api/telematics/${telematicsId}/pair`,
      { method: "POST", body: JSON.stringify({ vehicleId }) },
    ),
  unpair: (telematicsId: string) =>
    json<TelematicsDevice>(`/api/telematics/${telematicsId}/unpair`, { method: "POST" }),
  dashboardSummary: () => json<DashboardSummary>("/api/dashboard/summary"),
  utilizationSnapshots: () => json<UtilizationSnapshot[]>("/api/utilization/snapshots"),
  fleetConfig: () => json<EliteFleetConfig>("/api/fleet/config"),
  updateFleetConfig: (patch: Partial<EliteFleetConfig>) =>
    json<EliteFleetConfig>("/api/fleet/config", { method: "PATCH", body: JSON.stringify(patch) }),
  maintenance: () => json<MaintenanceRecord[]>("/api/maintenance"),
  createMaintenance: (body: Record<string, unknown>) =>
    json<MaintenanceRecord>("/api/maintenance", { method: "POST", body: JSON.stringify(body) }),
  updateMaintenance: (id: string, body: Record<string, unknown>) =>
    json<MaintenanceRecord>(`/api/maintenance/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
};
