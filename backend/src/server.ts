import express from 'express';
import http from 'http';
import cors from 'cors';
import flightRoutes from './routes/flights';
import { initWebSocket } from './websocket/flightSocket';
import { startFlightPolling } from './services/cache.service'; // Add this
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/flights', flightRoutes);

// Initialize WebSockets
initWebSocket(server);

// 🔥 START THE BACKGROUND CACHE POLLER
startFlightPolling();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});