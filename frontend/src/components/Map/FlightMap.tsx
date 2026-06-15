import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
interface Props {
  flights: any[];
}

const planeIcon = (heading: number) =>
  L.divIcon({
    html: `<div style="transform: rotate(${heading-45}deg);">✈️</div>`,
    className: "plane-icon",
    iconSize: [20, 20],
  });

export default function FlightMap({
  flights,
}: Props) {
  return (
    <MapContainer
      center={[10.5276, 76.2144]}
      zoom={8}
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {flights.map((flight) => (
        <Marker
        key={flight.id}
        position={[
            flight.latitude,
            flight.longitude,
        ]}
        icon={planeIcon(flight.heading)}
        >
          <Popup>
            <strong>
              {flight.callsign}
            </strong>

            <br />

            Altitude:
            {" "}
            {flight.altitude}

            <br />

            Speed:
            {" "}
            {flight.velocity}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}