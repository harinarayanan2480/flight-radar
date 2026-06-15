const transformFlight = (state: any) => ({
  id: state[0],
  callsign: state[1]?.trim() || "Unknown",
  country: state[2],
  longitude: state[5],
  latitude: state[6],
  altitude: state[7],
  velocity: state[9],
  heading: state[10],
});

export default transformFlight;