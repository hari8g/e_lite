export type VehicleStatus = "online" | "offline" | "charging";

/** e-lite: GPS / non-CAN telematics only; electric 2W assets */
export interface Vehicle {
  id: string;
  registrationNumber: string;
  displayName: string;
  model: string;
  assetClass: "2W";
  immobilisationEnabled: boolean;
  immobilisationArmed: boolean;
  latitude: number;
  longitude: number;
  lastPositionAt: string;
  socPercent: number;
  batteryKwh: number;
  dteKm: number;
  dailyKm: number;
  utilizationPercent: number;
  odometerKm: number;
  status: VehicleStatus;
  pairedDeviceId: string | null;
}

/** Live packet from `/api/vehicles/:id/live` (map + operator popup) */
export interface VehicleLiveTelemetry {
  vehicleId: string;
  registrationNumber: string;
  displayName: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  speedKmh: number;
  headingDeg: number;
  harshAccelerationCount30s: number;
  harshBrakingCount30s: number;
  harshEventsWindowSec: number;
  nextHarshWindowInMs: number;
  dteKm: number;
  socPercent: number;
  driverScore: number;
  totalKmToday: number;
  kmSinceIgnitionOn: number;
  idleTimeMinutes: number;
  immobilisationArmed: boolean;
  immobilisationEnabled: boolean;
  updatedAt: string;
}

export interface TelematicsDevice {
  id: string;
  serialNumber: string;
  firmware: string;
  deviceType: "gps";
  pairedVehicleId: string | null;
  lastSeenAt: string;
}

/** Toggles for what the command centre displays */
export interface CommandCentreVisibility {
  showOperationalMap: boolean;
  showLiveAssetStrip: boolean;
  showSocAndRange: boolean;
  showTripEnergyLedger: boolean;
  showImmobilisationControls: boolean;
  highlightStalePositions: boolean;
  highlightLowSoc: boolean;
}

export type VisibilityTier = "full" | "reduced" | "minimal";

export interface CommandCentreVisibilityState extends CommandCentreVisibility {
  tier: VisibilityTier;
  expectedPositionIntervalSec: number;
  immobilisationFleetDisabled: boolean;
  geofenceAlertsEnabled: boolean;
}

export interface DashboardSummary {
  assetClass: string;
  telematics: string;
  vehicleCount: number;
  onlineCount: number;
  chargingCount: number;
  offlineCount: number;
  totalDailyKm: number;
  avgUtilizationPercent: number;
  avgSocPercent: number;
  totalDteKm: number;
  lowSocCount: number;
  policyLowSocThresholdPercent: number;
  stalePositionCount: number;
  stalePositionSlaMinutes: number;
  immobilisationArmedCount: number;
  fleetEnergyKwh: number;
  fleetPolicy: EliteFleetConfig;
  visibility: CommandCentreVisibilityState;
}

export interface EliteFleetConfig {
  product: string;
  telematics: string;
  positionReportIntervalSec: number;
  stalePositionThresholdMin: number;
  immobilisationPolicy: string;
  lowSocAlertPercent: number;
  geofenceAlerts: boolean;
  commandCentre: CommandCentreVisibility;
}

export interface UtilizationSnapshot {
  vehicleId: string;
  registrationNumber: string;
  date: string;
  dailyKm: number;
  utilizationPercent: number;
  dteKm: number;
  socPercent: number;
  batteryKwh: number;
  estimatedRangeKm: number;
  odometerKm: number;
  assetClass: string;
}

export type MaintenanceWorkType =
  | "scheduled_service"
  | "battery_check"
  | "inspection"
  | "tyre"
  | "repair";

export type MaintenanceStatus =
  | "open"
  | "scheduled"
  | "in_progress"
  | "overdue"
  | "done"
  | "cancelled";

/** Work order row from `/api/maintenance` */
export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  workType: MaintenanceWorkType | string;
  title: string;
  dueDate: string;
  odometerAtDue: number | null;
  status: MaintenanceStatus | string;
  vendor: string;
  notes: string;
}
