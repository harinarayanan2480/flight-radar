// frontend/src/utils/airlineLookup.ts

export const getAirlineName = (callsign: string | undefined | null): string => {
  if (!callsign || callsign.length < 3) return "Unknown Airline";

  // Get the first 3 characters and ensure they are uppercase
  const code = callsign.substring(0, 3).toUpperCase();

  const airlines: Record<string, string> = {
    // Indian Airlines
    "IGO": "IndiGo",
    "AIC": "Air India",
    "AXB": "Air India Express",
    "VTI": "Vistara",
    "SEJ": "SpiceJet",
    "AKX": "Akasa Air",
    "IAD": "AirAsia India",

    // Middle Eastern Airlines (Very common in Kerala)
    "UAE": "Emirates",
    "QTR": "Qatar Airways",
    "ABY": "Air Arabia",
    "ETD": "Etihad Airways",
    "OMA": "Oman Air",
    "SVA": "Saudia",
    "FDB": "flydubai",
    "KAC": "Kuwait Airways",
    "GFA": "Gulf Air",
    "JZR": "Jazeera Airways",

    // Southeast Asian Airlines
    "ALK": "SriLankan Airlines",
    "SIA": "Singapore Airlines",
    "MAS": "Malaysia Airlines",
    "AXM": "AirAsia",
    "THY": "Turkish Airlines",
  };

  // Return the airline name, or if it's not in our list, return the 3-letter code
  return airlines[code] || `Unknown (${code})`;
};