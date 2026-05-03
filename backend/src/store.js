import { nanoid } from "nanoid";

/**
 * e-lite: electric fleet FMS — GPS / non-CAN telematics only (no CAN bus).
 * Asset class: 2W (two-wheelers) for operator map and reports.
 */
const SEED_VEHICLES = [
  {
    id: "veh_ka_mg_road",
    registrationNumber: "KA01EV1001",
    displayName: "Ops · MG Road",
    model: "E-2W Urban Pro",
    assetClass: "2W",
    latitude: 12.9755,
    longitude: 77.6059,
    lastPositionAt: new Date().toISOString(),
    socPercent: 82,
    batteryKwh: 3.2,
    dteKm: 68,
    dailyKm: 47,
    utilizationPercent: 71,
    odometerKm: 8450,
    status: "online",
    immobilisationEnabled: true,
    immobilisationArmed: false,
    pairedDeviceId: "tel_001",
  },
  {
    id: "veh_ka_koramangala",
    registrationNumber: "KA03EV2044",
    displayName: "Delivery · Koramangala",
    model: "E-2W Cargo",
    assetClass: "2W",
    latitude: 12.9352,
    longitude: 77.6245,
    lastPositionAt: new Date().toISOString(),
    socPercent: 45,
    batteryKwh: 4.1,
    dteKm: 42,
    dailyKm: 112,
    utilizationPercent: 88,
    odometerKm: 22100,
    status: "online",
    immobilisationEnabled: true,
    immobilisationArmed: true,
    pairedDeviceId: "tel_002",
  },
  {
    id: "veh_ka_whitefield",
    registrationNumber: "KA51EV3155",
    displayName: "Hub · Whitefield",
    model: "E-2W Fleet",
    assetClass: "2W",
    latitude: 12.9698,
    longitude: 77.75,
    lastPositionAt: new Date().toISOString(),
    socPercent: 91,
    batteryKwh: 3.5,
    dteKm: 78,
    dailyKm: 34,
    utilizationPercent: 54,
    odometerKm: 18900,
    status: "charging",
    immobilisationEnabled: true,
    immobilisationArmed: false,
    pairedDeviceId: "tel_003",
  },
  {
    id: "veh_ka_indiranagar",
    registrationNumber: "KA05EV4220",
    displayName: "City · Indiranagar",
    model: "E-2W Lite",
    assetClass: "2W",
    latitude: 12.9719,
    longitude: 77.6412,
    lastPositionAt: new Date().toISOString(),
    socPercent: 67,
    batteryKwh: 2.9,
    dteKm: 55,
    dailyKm: 89,
    utilizationPercent: 76,
    odometerKm: 12400,
    status: "online",
    immobilisationEnabled: false,
    immobilisationArmed: false,
    pairedDeviceId: "tel_004",
  },
  {
    id: "veh_ka_jayanagar",
    registrationNumber: "KA41EV5088",
    displayName: "Metro link · Jayanagar",
    model: "E-2W Urban Pro",
    assetClass: "2W",
    latitude: 12.9257,
    longitude: 77.5938,
    lastPositionAt: new Date().toISOString(),
    socPercent: 38,
    batteryKwh: 3.2,
    dteKm: 28,
    dailyKm: 156,
    utilizationPercent: 92,
    odometerKm: 30200,
    status: "online",
    immobilisationEnabled: true,
    immobilisationArmed: false,
    pairedDeviceId: "tel_005",
  },
  {
    id: "veh_ka_hebbal",
    registrationNumber: "KA02EV6112",
    displayName: "North · Hebbal",
    model: "E-2W Fleet",
    assetClass: "2W",
    latitude: 13.0358,
    longitude: 77.597,
    lastPositionAt: new Date(Date.now() - 3600000).toISOString(),
    socPercent: 74,
    batteryKwh: 3.5,
    dteKm: 61,
    dailyKm: 63,
    utilizationPercent: 62,
    odometerKm: 16750,
    status: "offline",
    immobilisationEnabled: true,
    immobilisationArmed: false,
    pairedDeviceId: "tel_006",
  },
  {
    id: "veh_ka_electronic_city",
    registrationNumber: "KA51EV7234",
    displayName: "Tech park · Electronic City",
    model: "E-2W Lite",
    assetClass: "2W",
    latitude: 12.8456,
    longitude: 77.6603,
    lastPositionAt: new Date().toISOString(),
    socPercent: 95,
    batteryKwh: 2.9,
    dteKm: 72,
    dailyKm: 22,
    utilizationPercent: 41,
    odometerKm: 5600,
    status: "online",
    immobilisationEnabled: false,
    immobilisationArmed: false,
    pairedDeviceId: "tel_007",
  },
  {
    id: "veh_ka_rr_nagar",
    registrationNumber: "KA41EV8341",
    displayName: "Last mile · RR Nagar",
    model: "E-2W Cargo",
    assetClass: "2W",
    latitude: 12.9236,
    longitude: 77.5187,
    lastPositionAt: new Date().toISOString(),
    socPercent: 52,
    batteryKwh: 4.1,
    dteKm: 48,
    dailyKm: 98,
    utilizationPercent: 81,
    odometerKm: 25300,
    status: "online",
    immobilisationEnabled: true,
    immobilisationArmed: false,
    pairedDeviceId: "tel_008",
  },
  {
    id: "veh_ka_manyata",
    registrationNumber: "KA50EV9455",
    displayName: "Campus · Manyata",
    model: "E-2W Urban Pro",
    assetClass: "2W",
    latitude: 13.0456,
    longitude: 77.6189,
    lastPositionAt: new Date().toISOString(),
    socPercent: 88,
    batteryKwh: 3.2,
    dteKm: 74,
    dailyKm: 41,
    utilizationPercent: 58,
    odometerKm: 9800,
    status: "online",
    immobilisationEnabled: true,
    immobilisationArmed: false,
    pairedDeviceId: "tel_009",
  },
  {
    id: "veh_ka_btm",
    registrationNumber: "KA05EV0567",
    displayName: "Express · BTM",
    model: "E-2W Fleet",
    assetClass: "2W",
    latitude: 12.9166,
    longitude: 77.6101,
    lastPositionAt: new Date().toISOString(),
    socPercent: 29,
    batteryKwh: 3.5,
    dteKm: 22,
    dailyKm: 178,
    utilizationPercent: 95,
    odometerKm: 41000,
    status: "online",
    immobilisationEnabled: true,
    immobilisationArmed: false,
    pairedDeviceId: "tel_010",
  },
];

const SEED_TELEMATICS = [
  { id: "tel_001", serialNumber: "ELITE-GPS-77821", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_mg_road", lastSeenAt: new Date().toISOString() },
  { id: "tel_002", serialNumber: "ELITE-GPS-77822", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_koramangala", lastSeenAt: new Date().toISOString() },
  { id: "tel_003", serialNumber: "ELITE-GPS-77823", firmware: "2.4.0", deviceType: "gps", pairedVehicleId: "veh_ka_whitefield", lastSeenAt: new Date().toISOString() },
  { id: "tel_004", serialNumber: "ELITE-GPS-77824", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_indiranagar", lastSeenAt: new Date().toISOString() },
  { id: "tel_005", serialNumber: "ELITE-GPS-77825", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_jayanagar", lastSeenAt: new Date().toISOString() },
  { id: "tel_006", serialNumber: "ELITE-GPS-77826", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_hebbal", lastSeenAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "tel_007", serialNumber: "ELITE-GPS-77827", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_electronic_city", lastSeenAt: new Date().toISOString() },
  { id: "tel_008", serialNumber: "ELITE-GPS-77828", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_rr_nagar", lastSeenAt: new Date().toISOString() },
  { id: "tel_009", serialNumber: "ELITE-GPS-77829", firmware: "2.4.0", deviceType: "gps", pairedVehicleId: "veh_ka_manyata", lastSeenAt: new Date().toISOString() },
  { id: "tel_010", serialNumber: "ELITE-GPS-77830", firmware: "2.4.1", deviceType: "gps", pairedVehicleId: "veh_ka_btm", lastSeenAt: new Date().toISOString() },
];

/** GPS-only telematics + command-centre visibility (e-lite has no CAN path) */
let fleetConfig = {
  product: "e-lite",
  telematics: "gps_only",
  positionReportIntervalSec: 60,
  /** Last GPS fix older than this (minutes) counts as stale on the command centre */
  stalePositionThresholdMin: 15,
  immobilisationPolicy: "operator_controlled",
  lowSocAlertPercent: 20,
  geofenceAlerts: false,
  /** What operators see in the command centre (toggleable fleet-wide) */
  commandCentre: {
    showOperationalMap: true,
    showLiveAssetStrip: true,
    showSocAndRange: true,
    showTripEnergyLedger: true,
    showImmobilisationControls: true,
    highlightStalePositions: true,
    highlightLowSoc: true,
  },
};

let vehicles = SEED_VEHICLES.map((v) => ({ ...v }));
let telematicsDevices = SEED_TELEMATICS.map((t) => ({ ...t }));

const DEFAULT_COMMAND_CENTRE = {
  showOperationalMap: true,
  showLiveAssetStrip: true,
  showSocAndRange: true,
  showTripEnergyLedger: true,
  showImmobilisationControls: true,
  highlightStalePositions: true,
  highlightLowSoc: true,
};

export function getFleetConfig() {
  return {
    ...fleetConfig,
    stalePositionThresholdMin: fleetConfig.stalePositionThresholdMin ?? 15,
    commandCentre: {
      ...DEFAULT_COMMAND_CENTRE,
      ...(fleetConfig.commandCentre ?? {}),
    },
  };
}

export function updateFleetConfig(patch) {
  const p = patch ?? {};
  fleetConfig = {
    ...fleetConfig,
    ...p,
    commandCentre: {
      ...fleetConfig.commandCentre,
      ...(p.commandCentre ?? {}),
    },
  };
  return getFleetConfig();
}

export function listVehicles() {
  return vehicles.map((v) => ({ ...v }));
}

export function getVehicle(id) {
  return vehicles.find((v) => v.id === id) ?? null;
}

export function onboardVehicle(payload) {
  const id = `veh_${nanoid(10)}`;
  const row = {
    id,
    registrationNumber: String(payload.registrationNumber ?? "").toUpperCase(),
    displayName: payload.displayName ?? "New asset",
    model: payload.model ?? "E-2W",
    assetClass: "2W",
    latitude: Number(payload.latitude) || 12.9716,
    longitude: Number(payload.longitude) || 77.5946,
    lastPositionAt: new Date().toISOString(),
    socPercent: Number(payload.socPercent) || 100,
    batteryKwh: Number(payload.batteryKwh) || 3,
    dteKm: Number(payload.dteKm) || Math.round((Number(payload.batteryKwh) || 3) * 18),
    dailyKm: 0,
    utilizationPercent: 0,
    odometerKm: Number(payload.odometerKm) || 0,
    status: "online",
    immobilisationEnabled: Boolean(payload.immobilisationEnabled),
    immobilisationArmed: false,
    pairedDeviceId: null,
  };
  if (!row.registrationNumber) {
    row.registrationNumber = `KA${nanoid(6).toUpperCase()}`;
  }
  vehicles.push(row);
  return row;
}

export function updateVehicle(id, patch) {
  const i = vehicles.findIndex((v) => v.id === id);
  if (i === -1) return null;
  const cur = vehicles[i];
  const next = {
    ...cur,
    ...patch,
    registrationNumber:
      patch.registrationNumber != null
        ? String(patch.registrationNumber).toUpperCase()
        : cur.registrationNumber,
  };
  if (patch.immobilisationArmed != null) {
    next.immobilisationArmed = Boolean(patch.immobilisationArmed);
  }
  vehicles[i] = next;
  return next;
}

export function setImmobilisation(vehicleId, arm) {
  const cfg = getFleetConfig();
  if (cfg.immobilisationPolicy === "disabled") {
    return { error: "Immobilisation is disabled fleet-wide by policy" };
  }
  const cc = cfg.commandCentre ?? {};
  if (cc.showImmobilisationControls === false) {
    return { error: "Immobilisation controls are hidden by fleet visibility policy" };
  }
  const v = vehicles.find((x) => x.id === vehicleId);
  if (!v) return { error: "Vehicle not found" };
  if (!v.immobilisationEnabled) return { error: "Immobilisation not enabled for this asset" };
  v.immobilisationArmed = Boolean(arm);
  return { vehicle: { ...v } };
}

export function listTelematics() {
  return telematicsDevices.map((t) => ({ ...t }));
}

export function registerTelematics(payload) {
  const id = `tel_${nanoid(8)}`;
  const row = {
    id,
    serialNumber: payload.serialNumber ?? `ELITE-GPS-${nanoid(6).toUpperCase()}`,
    firmware: payload.firmware ?? "2.4.1",
    deviceType: "gps",
    pairedVehicleId: null,
    lastSeenAt: new Date().toISOString(),
  };
  telematicsDevices.push(row);
  return row;
}

export function pairTelematics(telematicsId, vehicleId) {
  const tel = telematicsDevices.find((t) => t.id === telematicsId);
  const veh = vehicles.find((v) => v.id === vehicleId);
  if (!tel || !veh) return { error: "Device or vehicle not found" };
  telematicsDevices.forEach((t) => {
    if (t.pairedVehicleId === vehicleId) t.pairedVehicleId = null;
  });
  vehicles.forEach((v) => {
    if (v.id === vehicleId) v.pairedDeviceId = null;
    else if (v.pairedDeviceId === telematicsId) v.pairedDeviceId = null;
  });
  tel.pairedVehicleId = vehicleId;
  veh.pairedDeviceId = telematicsId;
  return { telematics: { ...tel }, vehicle: { ...veh } };
}

export function unpairTelematics(telematicsId) {
  const tel = telematicsDevices.find((t) => t.id === telematicsId);
  if (!tel) return null;
  const veh = vehicles.find((v) => v.id === tel.pairedVehicleId);
  if (veh) veh.pairedDeviceId = null;
  tel.pairedVehicleId = null;
  return { ...tel };
}

function visibilityTierFromPolicy(cc) {
  const m = cc?.showOperationalMap !== false;
  const s = cc?.showLiveAssetStrip !== false;
  const l = cc?.showTripEnergyLedger !== false;
  if (!m && !s) return "minimal";
  if (!m || !s || !l) return "reduced";
  return "full";
}

export function getDashboardSummary() {
  const cfg = getFleetConfig();
  const list = listVehicles();
  const totalKmToday = list.reduce((s, v) => s + (v.dailyKm || 0), 0);
  const avgUtil = list.length
    ? Math.round(list.reduce((s, v) => s + (v.utilizationPercent || 0), 0) / list.length)
    : 0;
  const avgSoc = list.length
    ? Math.round(list.reduce((s, v) => s + (v.socPercent || 0), 0) / list.length)
    : 0;
  const threshold = Number(cfg.lowSocAlertPercent) || 20;
  const lowSoc = list.filter((v) => (v.socPercent ?? 100) < threshold).length;
  const armed = list.filter((v) => v.immobilisationArmed).length;

  const staleMin = Number(cfg.stalePositionThresholdMin) || 15;
  const staleMs = staleMin * 60 * 1000;
  const now = Date.now();
  const stalePositionCount = list.filter((v) => {
    const t = new Date(v.lastPositionAt).getTime();
    return Number.isFinite(t) && now - t > staleMs;
  }).length;

  const cc = cfg.commandCentre ?? {};

  return {
    assetClass: "2W",
    telematics: "gps_only",
    vehicleCount: list.length,
    onlineCount: list.filter((v) => v.status === "online").length,
    chargingCount: list.filter((v) => v.status === "charging").length,
    offlineCount: list.filter((v) => v.status === "offline").length,
    totalDailyKm: totalKmToday,
    avgUtilizationPercent: avgUtil,
    avgSocPercent: avgSoc,
    totalDteKm: list.reduce((s, v) => s + (v.dteKm || 0), 0),
    lowSocCount: lowSoc,
    policyLowSocThresholdPercent: threshold,
    stalePositionCount,
    stalePositionSlaMinutes: staleMin,
    immobilisationArmedCount: armed,
    fleetEnergyKwh: list.reduce((s, v) => s + (v.batteryKwh || 0), 0),
    fleetPolicy: getFleetConfig(),
    visibility: {
      tier: visibilityTierFromPolicy(cc),
      expectedPositionIntervalSec: cfg.positionReportIntervalSec,
      immobilisationFleetDisabled: cfg.immobilisationPolicy === "disabled",
      geofenceAlertsEnabled: cfg.geofenceAlerts === true,
      ...cc,
    },
  };
}

export function getUtilizationSnapshots() {
  const today = new Date().toISOString().slice(0, 10);
  return listVehicles().map((v) => ({
    vehicleId: v.id,
    registrationNumber: v.registrationNumber,
    date: today,
    dailyKm: v.dailyKm,
    utilizationPercent: v.utilizationPercent,
    dteKm: v.dteKm,
    socPercent: v.socPercent,
    batteryKwh: v.batteryKwh,
    estimatedRangeKm: v.dteKm,
    odometerKm: v.odometerKm,
    assetClass: v.assetClass,
  }));
}

/** Deterministic 0..1 from id + salt + bucket */
function noise01(id, salt, bucket) {
  const s = `${id}:${salt}:${bucket}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
}

/**
 * Simulated live GPS / behaviour packet for map & operator popup.
 * Position & speed refresh every ~2s of wall clock; harsh events roll on 30s windows.
 */
export function getVehicleLiveTelemetry(vehicleId) {
  const v = getVehicle(vehicleId);
  if (!v) return null;

  const now = Date.now();
  const bucket30 = Math.floor(now / 30000);
  const tick2 = Math.floor(now / 2000);

  const wobbleLat =
    Math.sin(tick2 * 0.35) * 0.00012 + Math.cos(tick2 * 0.22) * 0.00007;
  const wobbleLng =
    Math.cos(tick2 * 0.31) * 0.00011 + Math.sin(tick2 * 0.19) * 0.00009;

  let speedKmh = 0;
  let headingDeg = (tick2 * 11 + Math.floor(noise01(vehicleId, "hd", bucket30) * 40)) % 360;

  if (v.status === "offline") {
    speedKmh = 0;
  } else if (v.status === "charging") {
    speedKmh = 0;
    headingDeg = 0;
  } else if (v.immobilisationArmed) {
    speedKmh = 0;
  } else {
    const base = 12 + noise01(vehicleId, "sp0", bucket30) * 38;
    const pulse = Math.sin(tick2 * 0.8) * 6;
    speedKmh = Math.max(0, Math.min(62, Math.round(base + pulse)));
  }

  const harshAccel30s = Math.floor(noise01(vehicleId, "ha", bucket30) * 6);
  const harshBraking30s = Math.floor(noise01(vehicleId, "hb", bucket30) * 5);
  const penalty = harshAccel30s * 3 + harshBraking30s * 4;
  const driverScore = Math.max(
    52,
    Math.min(99, Math.round(96 - penalty + noise01(vehicleId, "ds", bucket30) * 6)),
  );

  const fracToday = noise01(vehicleId, "kt", tick2) * 0.08;
  const totalKmToday = Math.round((v.dailyKm + fracToday) * 10) / 10;
  const kmSinceIgnitionOn =
    Math.round((2.5 + noise01(vehicleId, "ki", bucket30) * 18 + noise01(vehicleId, "ki2", tick2) * 0.4) * 10) /
    10;
  const idleTimeMinutes = Math.floor(noise01(vehicleId, "idle", bucket30) * 32);

  const nextWindowMs = (bucket30 + 1) * 30000 - now;

  return {
    vehicleId: v.id,
    registrationNumber: v.registrationNumber,
    displayName: v.displayName,
    status: v.status,
    latitude: v.latitude + wobbleLat,
    longitude: v.longitude + wobbleLng,
    speedKmh,
    headingDeg,
    harshAccelerationCount30s: harshAccel30s,
    harshBrakingCount30s: harshBraking30s,
    harshEventsWindowSec: 30,
    nextHarshWindowInMs: Math.max(0, nextWindowMs),
    dteKm: v.dteKm,
    socPercent: v.socPercent,
    driverScore,
    totalKmToday,
    kmSinceIgnitionOn,
    idleTimeMinutes,
    immobilisationArmed: v.immobilisationArmed,
    immobilisationEnabled: v.immobilisationEnabled,
    updatedAt: new Date(now).toISOString(),
  };
}

/** Maintenance & service work items (2W fleet) */
const SEED_MAINTENANCE = [
  {
    id: "mnt_001",
    vehicleId: "veh_ka_mg_road",
    registrationNumber: "KA01EV1001",
    workType: "scheduled_service",
    title: "A-service · brake & belt check",
    dueDate: "2026-05-08",
    odometerAtDue: 8600,
    status: "open",
    vendor: "Elite Service Hub — MG Road",
    notes: "Confirm regen braking test",
  },
  {
    id: "mnt_002",
    vehicleId: "veh_ka_koramangala",
    registrationNumber: "KA03EV2044",
    workType: "battery_check",
    title: "Pack health scan + BMS log pull",
    dueDate: "2026-05-12",
    odometerAtDue: null,
    status: "scheduled",
    vendor: "CellCare EV",
    notes: "",
  },
  {
    id: "mnt_003",
    vehicleId: "veh_ka_whitefield",
    registrationNumber: "KA51EV3155",
    workType: "inspection",
    title: "Annual safety inspection",
    dueDate: "2026-04-28",
    odometerAtDue: 19200,
    status: "overdue",
    vendor: "RTO partner bay",
    notes: "Reschedule from April slot",
  },
  {
    id: "mnt_004",
    vehicleId: "veh_ka_btm",
    registrationNumber: "KA05EV0567",
    workType: "tyre",
    title: "Tyre wear review (rear)",
    dueDate: "2026-05-15",
    odometerAtDue: 41500,
    status: "open",
    vendor: "",
    notes: "High daily km — priority",
  },
  {
    id: "mnt_005",
    vehicleId: "veh_ka_jayanagar",
    registrationNumber: "KA41EV5088",
    workType: "repair",
    title: "Handlebar mount torque + harness check",
    dueDate: "2026-05-04",
    odometerAtDue: null,
    status: "in_progress",
    vendor: "Urban EV Clinic",
    notes: "Parts on order",
  },
];

let maintenanceItems = SEED_MAINTENANCE.map((m) => ({ ...m }));

export function listMaintenance() {
  return maintenanceItems.map((m) => ({ ...m }));
}

export function createMaintenance(payload) {
  const veh = vehicles.find((v) => v.id === payload.vehicleId);
  if (!veh) return { error: "Vehicle not found" };
  const id = `mnt_${nanoid(10)}`;
  const row = {
    id,
    vehicleId: veh.id,
    registrationNumber: veh.registrationNumber,
    workType: String(payload.workType || "scheduled_service"),
    title: String(payload.title || "Work item").slice(0, 200),
    dueDate: String(payload.dueDate || new Date().toISOString().slice(0, 10)),
    odometerAtDue: payload.odometerAtDue != null ? Number(payload.odometerAtDue) : null,
    status: String(payload.status || "open"),
    vendor: String(payload.vendor || "").slice(0, 120),
    notes: String(payload.notes || "").slice(0, 500),
  };
  maintenanceItems.push(row);
  return row;
}

export function updateMaintenance(id, patch) {
  const i = maintenanceItems.findIndex((m) => m.id === id);
  if (i === -1) return null;
  const cur = maintenanceItems[i];
  const next = {
    ...cur,
    title: patch.title != null ? String(patch.title).slice(0, 200) : cur.title,
    dueDate: patch.dueDate != null ? String(patch.dueDate) : cur.dueDate,
    status: patch.status != null ? String(patch.status) : cur.status,
    vendor: patch.vendor != null ? String(patch.vendor).slice(0, 120) : cur.vendor,
    notes: patch.notes != null ? String(patch.notes).slice(0, 500) : cur.notes,
    workType: patch.workType != null ? String(patch.workType) : cur.workType,
    odometerAtDue:
      patch.odometerAtDue === null
        ? null
        : patch.odometerAtDue != null
          ? Number(patch.odometerAtDue)
          : cur.odometerAtDue,
  };
  maintenanceItems[i] = next;
  return next;
}
