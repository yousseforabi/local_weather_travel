import { useState, useEffect } from 'react';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

interface Departure {
    AdvertisedTimeAtLocation: string;
    ProductInformation: Array<{ Product: string }>;
    ToLocation: Array<{ LocationName: string }>;
    LocationSignature: string;
}

const TransportDepartures = () => {
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const requestBody = `
                <REQUEST>
                    <LOGIN authenticationkey="${import.meta.env.VITE_TRAFIKVERKET_API_KEY}" />
                    <QUERY objecttype="TrainAnnouncement" schemaversion="1.4">
                        <FILTER>
                            <AND>
                                <EQ name="LocationSignature" value="Cst" />
                                <GT name="AdvertisedTimeAtLocation" value="$dateadd(-00:30:00)" />
                                <LT name="AdvertisedTimeAtLocation" value="$dateadd(00:30:00)" />
                            </AND>
                        </FILTER>
                        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                        <INCLUDE>ProductInformation</INCLUDE>
                        <INCLUDE>ToLocation</INCLUDE>
                        <INCLUDE>LocationSignature</INCLUDE>
                    </QUERY>
                </REQUEST>
            `;

            try {
                console.log('Sending request with body:', requestBody);
                const response = await axios.post(
                    'https://api.trafikinfo.trafikverket.se/v2/data.xml', 
                    requestBody, 
                    { 
                        headers: { 
                            'Content-Type': 'text/xml',
                            'Accept': 'application/xml'
                        }
                    }
                );

                console.log('Raw response:', response.data);
                
                // Parse XML response
                const parser = new XMLParser();
                const result = parser.parse(response.data);
                
                console.log('Parsed response:', result);

                if (result.RESPONSE?.RESULT?.[0]?.TrainAnnouncement) {
                    const data = result.RESPONSE.RESULT[0].TrainAnnouncement;
                    console.log('Found announcements:', data);
                    setDepartures(Array.isArray(data) ? data : [data]);
                } else if (result.RESPONSE?.RESULT?.[0]?.ERROR) {
                    console.error('API Error:', result.RESPONSE.RESULT[0].ERROR);
                    setError(`API Error: ${result.RESPONSE.RESULT[0].ERROR.MESSAGE}`);
                } else {
                    console.error('No train announcements found in response');
                    setError('No departures found');
                }
            } catch (error) {
                console.error("Failed to fetch departures:", error);
                if (axios.isAxiosError(error)) {
                    console.error('Response data:', error.response?.data);
                    setError(`Failed to load data: ${error.response?.data || error.message}`);
                } else {
                    setError('Failed to load data');
                }
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString('sv-SE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div>
            <h1>Next Trains at Central Station</h1>
            {error ? <p style={{ color: 'red' }}>{error}</p> : (
                <ul>
                    {departures.map((departure, index) => (
                        <li key={index}>
                            <strong>Time:</strong> {formatTime(departure.AdvertisedTimeAtLocation)}<br />
                            <strong>Type:</strong> {departure.ProductInformation[0]?.Product || 'N/A'}<br />
                            <strong>To:</strong> {departure.ToLocation[0]?.LocationName || 'N/A'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TransportDepartures;
