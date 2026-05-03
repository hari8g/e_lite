import express from "express";
import cors from "cors";
import {
  getFleetConfig,
  updateFleetConfig,
  listVehicles,
  getVehicle,
  onboardVehicle,
  updateVehicle,
  setImmobilisation,
  getVehicleLiveTelemetry,
  listTelematics,
  registerTelematics,
  pairTelematics,
  unpairTelematics,
  getDashboardSummary,
  getUtilizationSnapshots,
  listMaintenance,
  createMaintenance,
  updateMaintenance,
} from "./store.js";

const app = express();
const PORT = process.env.PORT || 4000;

const defaultCorsOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const envCorsOrigins =
  process.env.CORS_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
app.use(cors({ origin: [...defaultCorsOrigins, ...envCorsOrigins] }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "e-lite Electric FMS API",
    version: "2.0.0",
    telematics: "gps_only",
    assetClasses: ["2W"],
  });
});

app.get("/api/fleet/config", (_req, res) => {
  res.json(getFleetConfig());
});

app.patch("/api/fleet/config", (req, res) => {
  res.json(updateFleetConfig(req.body ?? {}));
});

app.get("/api/vehicles", (_req, res) => {
  res.json(listVehicles());
});

/** Live GPS / driving snapshot (simulated stream; harsh counts roll every 30s) */
app.get("/api/vehicles/:id/live", (req, res) => {
  const live = getVehicleLiveTelemetry(req.params.id);
  if (!live) return res.status(404).json({ error: "Vehicle not found" });
  res.json(live);
});

app.get("/api/vehicles/:id", (req, res) => {
  const v = getVehicle(req.params.id);
  if (!v) return res.status(404).json({ error: "Vehicle not found" });
  res.json(v);
});

app.post("/api/vehicles", (req, res) => {
  try {
    const v = onboardVehicle(req.body ?? {});
    res.status(201).json(v);
  } catch (e) {
    res.status(400).json({ error: String(e.message ?? e) });
  }
});

app.patch("/api/vehicles/:id", (req, res) => {
  const v = updateVehicle(req.params.id, req.body ?? {});
  if (!v) return res.status(404).json({ error: "Vehicle not found" });
  res.json(v);
});

/** Operator immobilisation command (GPS device relay — e-lite path only) */
app.post("/api/vehicles/:id/immobilisation", (req, res) => {
  const arm = Boolean(req.body?.arm);
  const result = setImmobilisation(req.params.id, arm);
  if (result.error) return res.status(400).json(result);
  res.json(result.vehicle);
});

app.get("/api/telematics", (_req, res) => {
  res.json(listTelematics());
});

app.post("/api/telematics", (req, res) => {
  const t = registerTelematics(req.body ?? {});
  res.status(201).json(t);
});

app.post("/api/telematics/:id/pair", (req, res) => {
  const { vehicleId } = req.body ?? {};
  const result = pairTelematics(req.params.id, vehicleId);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post("/api/telematics/:id/unpair", (req, res) => {
  const t = unpairTelematics(req.params.id);
  if (!t) return res.status(404).json({ error: "Device not found" });
  res.json(t);
});

app.get("/api/dashboard/summary", (_req, res) => {
  res.json(getDashboardSummary());
});

app.get("/api/utilization/snapshots", (_req, res) => {
  res.json(getUtilizationSnapshots());
});

app.get("/api/maintenance", (_req, res) => {
  res.json(listMaintenance());
});

app.post("/api/maintenance", (req, res) => {
  const row = createMaintenance(req.body ?? {});
  if (row.error) return res.status(400).json(row);
  res.status(201).json(row);
});

app.patch("/api/maintenance/:id", (req, res) => {
  const m = updateMaintenance(req.params.id, req.body ?? {});
  if (!m) return res.status(404).json({ error: "Work item not found" });
  res.json(m);
});

app.listen(PORT, () => {
  console.log(`e-lite FMS API listening on http://localhost:${PORT}`);
});
