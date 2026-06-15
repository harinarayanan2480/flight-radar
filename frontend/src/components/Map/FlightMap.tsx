import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Props {
  flights: any[];
}

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