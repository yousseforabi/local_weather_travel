import { useState, useEffect } from 'react';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

interface Departure {
    AdvertisedTimeAtLocation: string;
    ModifiedTime: string;
    ProductInformation: {
        Code: string;
        Description: string;
    }[];
    ToLocation: {
        LocationName: string;
        Priority: number;
        Order: number;
    }[];
    TrackAtLocation: string;
}

const TransportDepartures = () => {
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            if (!import.meta.env.VITE_TRAFIKVERKET_API_KEY) {
                throw new Error('API key is not configured. Please check your .env file.');
            }

            const requestBody = `
                <REQUEST>
                    <LOGIN authenticationkey="${import.meta.env.VITE_TRAFIKVERKET_API_KEY}"/>
                    <QUERY objecttype="TrainAnnouncement" lastmodified="true" orderby="AdvertisedTimeAtLocation" schemaversion="1.6">
                        <FILTER>
                            <AND>
                                <EQ name="ActivityType" value="Avgang" />
                                <EQ name="LocationSignature" value="Cst" />
                                <OR>
                                    <AND>
                                        <GT name="AdvertisedTimeAtLocation" value="$dateadd(-00:15:00)" />
                                        <LT name="AdvertisedTimeAtLocation" value="$dateadd(02:00:00)" />
                                    </AND>
                                    <AND>
                                        <GT name="EstimatedTimeAtLocation" value="$dateadd(-00:15:00)" />
                                        <LT name="EstimatedTimeAtLocation" value="$dateadd(02:00:00)" />
                                    </AND>
                                </OR>
                            </AND>
                        </FILTER>
                        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
                        <INCLUDE>ModifiedTime</INCLUDE>
                        <INCLUDE>ProductInformation</INCLUDE>
                        <INCLUDE>ToLocation</INCLUDE>
                        <INCLUDE>TrackAtLocation</INCLUDE>
                    </QUERY>
                </REQUEST>
            `.trim();

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

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: ""
            });
            const result = parser.parse(response.data);
            console.log('API Response:', result);

            if (result?.RESPONSE?.RESULT?.[0]?.TrainAnnouncement) {
                const announcements = result.RESPONSE.RESULT[0].TrainAnnouncement;
                const departuresList = Array.isArray(announcements) ? announcements : [announcements];
                console.log('Departures list:', departuresList);
                setDepartures(departuresList);
            } else {
                console.log('No train announcements found in response');
                setDepartures([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            let errorMessage = 'Failed to load train departures. Please try again later.';
            if (axios.isAxiosError(error)) {
                console.error('API Error:', error.response?.data);
                errorMessage = error.response?.data?.RESPONSE?.RESULT?.[0]?.ERROR?.MESSAGE || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            setDepartures([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (timeString: string) => {
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('sv-SE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            console.error('Error formatting time:', timeString, error);
            return 'Invalid time';
        }
    };

    const getDestination = (departure: Departure) => {
        try {
            const toLocation = departure.ToLocation?.[0];
            return toLocation ? toLocation.LocationName : 'N/A';
        } catch (error) {
            console.error('Error getting destination:', error);
            return 'N/A';
        }
    };

    const getTrainType = (departure: Departure) => {
        try {
            const info = departure.ProductInformation?.[0];
            return info ? `${info.Description || info.Code}` : 'N/A';
        } catch (error) {
            console.error('Error getting train type:', error);
            return 'N/A';
        }
    };

    if (loading && !error) {
        return (
            <div className="loading-container">
                <p>Loading train departures...</p>
            </div>
        );
    }

    return (
        <div className="transport-container">
            <div className="transport-header">
                <h1 className="transport-title">Next Trains at Central Station</h1>
                <button className="refresh-button" onClick={fetchData}>
                    Refresh
                </button>
            </div>

            {error ? (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button className="try-again-button" onClick={fetchData}>
                        Try Again
                    </button>
                </div>
            ) : departures.length === 0 ? (
                <p className="no-departures">
                    No departures found for the next 2 hours
                </p>
            ) : (
                <div className="departures-grid">
                    {departures.map((departure, index) => (
                        <div key={index} className="departure-card">
                            <div className="departure-header">
                                <div className="departure-time">
                                    {formatTime(departure.AdvertisedTimeAtLocation)}
                                </div>
                                <div className="departure-type">
                                    {getTrainType(departure)}
                                </div>
                            </div>
                            <div className="departure-destination">
                                To: {getDestination(departure)}
                                {departure.TrackAtLocation && (
                                    <span className="departure-track">
                                        Track: {departure.TrackAtLocation}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransportDepartures;
