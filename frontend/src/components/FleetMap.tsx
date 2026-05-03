import { MapContainer, TileLayer } from "react-leaflet";
import type { Vehicle } from "../types";
import { VehicleMapMarker } from "./VehicleMapMarker";

const bangaloreCenter: [number, number] = [12.9716, 77.5946];

type FleetMapProps = {
  vehicles: Vehicle[];
  showImmobilisationControls?: boolean;
  onVehicleUpdated?: (v: Vehicle) => void;
};

export function FleetMap({
  vehicles,
  showImmobilisationControls = true,
  onVehicleUpdated,
}: FleetMapProps) {
  return (
    <MapContainer
      center={bangaloreCenter}
      zoom={11}
      className="h-[min(520px,52vh)] w-full rounded-b-xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles.map((v) => (
        <VehicleMapMarker
          key={v.id}
          vehicle={v}
          showImmobilisationControls={showImmobilisationControls}
          onVehicleUpdated={onVehicleUpdated}
        />
      ))}
    </MapContainer>
  );
}
