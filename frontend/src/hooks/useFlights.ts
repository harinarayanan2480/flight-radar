import { useEffect, useState } from "react";

import { api } from "../services/api";

import type { Flight } from "../types/flight";

export default function useFlights() {
  const [flights, setFlights] =
    useState<Flight[]>([]);

  useEffect(() => {
    const loadFlights =
      async () => {
        try {
          const response =
            await api.get("/flights");

          setFlights(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };

    loadFlights();

    const interval =
      setInterval(
        loadFlights,
        10000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return flights;
}