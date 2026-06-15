import { useEffect, useState } from "react";
import type { Flight } from "../types/flight";

export default function useFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    setFlights([
      {
        id: "1",
        callsign: "TEST123",
        latitude: 10.5276,
        longitude: 76.2144,
        altitude: 35000,
        velocity: 850,
        heading: 90,
      },
    ]);
  }, []);

  return flights;
}