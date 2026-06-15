import { useEffect, useState } from "react";
import type { Flight } from "../types/flight";

export default function useWebSocket() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        
        if (parsedMessage.type === 'FLIGHT_UPDATE') {
          setFlights(parsedMessage.data);
        } else if (Array.isArray(parsedMessage)) {
          setFlights(parsedMessage);
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    socket.onerror = (error) => {
      if (socket.readyState !== WebSocket.CLOSED) {
        console.error("WebSocket error:", error);
      }
    };

    return () => {
      if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener('open', () => socket.close());
      } else {
        socket.close();
      }
    };
  }, []);

  return flights;
}