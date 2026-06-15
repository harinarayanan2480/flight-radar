import { useEffect, useState, useRef } from "react";
import type { Flight } from "../types/flight";

export default function useWebSocket() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const lastServerDataRef = useRef<Map<string, Flight>>(new Map());

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        const serverFlights: Flight[] = parsedMessage.type === 'FLIGHT_UPDATE' 
            ? parsedMessage.data 
            : Array.isArray(parsedMessage) ? parsedMessage : [];

        if (serverFlights.length > 0) {
          setFlights((currentExtrapolatedFlights) => {
            
            const mergedFlights = serverFlights.map((newServerFlight) => {
              const lastServerFlight = lastServerDataRef.current.get(newServerFlight.id || newServerFlight.callsign);
              
              if (
                lastServerFlight && 
                lastServerFlight.latitude === newServerFlight.latitude && 
                lastServerFlight.longitude === newServerFlight.longitude
              ) {
                const extrapolatedFlight = currentExtrapolatedFlights.find(
                    f => (f.id || f.callsign) === (newServerFlight.id || newServerFlight.callsign)
                );
                return extrapolatedFlight || newServerFlight;
              }
              
              return newServerFlight;
            });

            lastServerDataRef.current.clear();
            serverFlights.forEach(f => lastServerDataRef.current.set((f.id || f.callsign), f));

            return mergedFlights;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (error) => {
      if (socket.readyState !== WebSocket.CLOSED) console.error("WebSocket error:", error);
    };

    return () => {
      if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener('open', () => socket.close());
      } else {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlights((currentFlights) => {
        return currentFlights.map((flight) => {
          if (!flight.velocity || flight.heading === null) {
            return flight;
          }

          const headingRad = flight.heading * (Math.PI / 180);
          const earthRadiusMeters = 111320;

          const latChange = (flight.velocity * Math.cos(headingRad)) / earthRadiusMeters;
          const lonChange = (flight.velocity * Math.sin(headingRad)) / 
                            (earthRadiusMeters * Math.cos(flight.latitude * (Math.PI / 180)));

          return {
            ...flight,
            latitude: flight.latitude + latChange,
            longitude: flight.longitude + lonChange,
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return flights;
}