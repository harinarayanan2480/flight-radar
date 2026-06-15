import FlightMap from "./components/Map/FlightMap";
import useWebSocket from "./hooks/useWebSocket";

function App() {
  const flights = useWebSocket();

  return (
    <FlightMap flights={flights} />
  );
}

export default App;