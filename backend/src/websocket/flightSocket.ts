import { WebSocketServer, WebSocket } from 'ws';
import { getCachedFlights, flightEvents } from '../services/cache.service';

let wss: WebSocketServer;

export const initWebSocket = (server: any) => {
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        console.log('🟢 Client connected to WebSocket');
        ws.send(JSON.stringify({ type: 'FLIGHT_UPDATE', data: getCachedFlights() }));

        ws.on('close', () => {
            console.log('🔴 Client disconnected');
        });
    });
    flightEvents.on('flightsUpdated', (flights) => {
        broadcastFlights(flights);
    });
};

const broadcastFlights = (flights: any[]) => {
    if (!wss) return;
    
    const payload = JSON.stringify({ type: 'FLIGHT_UPDATE', data: flights });
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
};