import FlightMap from "./components/Map/FlightMap";
import useFlights from "./hooks/useFlights";

function App() {
  const flights = useFlights();

  return (
    <FlightMap flights={flights} />
  );
}

export default App;