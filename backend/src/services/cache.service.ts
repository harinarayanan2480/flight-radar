import { EventEmitter } from 'events';
import { fetchFlightsFromOpenSky } from './opensky.service';

export const flightEvents = new EventEmitter();

let cachedFlights: any[] = [];
let lastUpdated: number = 0;
const CACHE_INTERVAL_MS = 10000; // 10 seconds is safe for OpenSky

export const getCachedFlights = () => cachedFlights;

export const startFlightPolling = () => {
    console.log('✈️  Started background flight polling...');
    pollFlights();
    setInterval(pollFlights, CACHE_INTERVAL_MS);
};

const pollFlights = async () => {
    try {
        const newFlights = await fetchFlightsFromOpenSky();
        
        if (newFlights && newFlights.length > 0) {
            cachedFlights = newFlights;
            lastUpdated = Date.now();
            console.log(`[Cache] Updated at ${new Date().toLocaleTimeString()} - Flights tracked: ${cachedFlights.length}`);
            flightEvents.emit('flightsUpdated', cachedFlights);
        }
    } catch (error) {
        console.error('[Cache] OpenSky rate limited or unreachable. Using old cache.');
    }
};