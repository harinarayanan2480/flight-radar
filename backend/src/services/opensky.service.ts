import axios from 'axios';
import  transformFlight  from '../utils/transformFlight';

const LAMIN = 8.0;
const LAMAX = 13.0;
const LOMIN = 74.0;
const LOMAX = 78.0;

let accessToken: string | null = null;
let tokenExpirationTime: number = 0;

const getAccessToken = async () => {
    const CLIENT_ID = process.env.OPENSKY_CLIENT_ID;
    const CLIENT_SECRET = process.env.OPENSKY_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('❌ ERROR: OpenSky credentials are missing in the .env file!');
        return null;
    }

    if (accessToken && Date.now() < tokenExpirationTime - 60000) {
        return accessToken;
    }

    console.log('🔑 Requesting new OpenSky Access Token...');
    try {
        const response = await axios.post(
            'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        accessToken = response.data.access_token;
        tokenExpirationTime = Date.now() + (response.data.expires_in * 1000); 
        console.log('✅ Token received successfully!');
        
        return accessToken;
    } catch (error) {
        console.error('❌ Failed to get OpenSky token. Check your Client ID and Secret.');
        return null;
    }
};

export const fetchFlightsFromOpenSky = async () => {
    const token = await getAccessToken();
    
    if (!token) {
        throw new Error("No access token available");
    }

    const url = `https://opensky-network.org/api/states/all?lamin=${LAMIN}&lamax=${LAMAX}&lomin=${LOMIN}&lomax=${LOMAX}`;
    
    try {
        const response = await axios.get(url, { 
            timeout: 8000,
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'FlightRadar-StudentProject/1.0' 
            }
        }); 

        if (!response.data || !response.data.states) {
            return [];
        }

        return response.data.states.map(transformFlight).filter(Boolean);
    } catch (error: any) {
        console.error(`[OpenSky Error]: ${error.response?.status || error.message}`);
        throw error; 
    }
};