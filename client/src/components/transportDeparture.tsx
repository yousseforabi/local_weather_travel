import { useState, useEffect } from 'react';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import DepartureBoard from './DepartureBoard';

interface Station {
    LocationSignature: string;
    AdvertisedLocationName: string;
    Latitude: number;
    Longitude: number;
    Prognosticated?: boolean;
}

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
    console.log('API Key loaded:', !!import.meta.env.VITE_TRAFIKVERKET_API_KEY);
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentStation, setCurrentStation] = useState<Station | null>(null);
    const [locationLoading, setLocationLoading] = useState(true);

    const findNearestStation = async (latitude: number, longitude: number) => {
        try {
            const requestBody = `<REQUEST>
    <LOGIN authenticationkey="${import.meta.env.VITE_TRAFIKVERKET_API_KEY}" />
    <QUERY objecttype="TrainStation" schemaversion="1.0">
        <FILTER>
            <AND>
                <EXISTS name="Advertised" value="true" />
                <EQ name="Deleted" value="false" />
            </AND>
        </FILTER>
        <INCLUDE>Prognosticated</INCLUDE>
        <INCLUDE>AdvertisedLocationName</INCLUDE>
        <INCLUDE>LocationSignature</INCLUDE>
        <INCLUDE>Latitude</INCLUDE>
        <INCLUDE>Longitude</INCLUDE>
    </QUERY>
</REQUEST>`;

            console.log('Station search request:', requestBody);

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

            console.log('Station search response:', response.data);

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: ""
            });
            const result = parser.parse(response.data);
            
            if (result?.RESPONSE?.RESULT?.[0]?.TrainStation) {
                const stations: Station[] = Array.isArray(result.RESPONSE.RESULT[0].TrainStation) 
                    ? result.RESPONSE.RESULT[0].TrainStation 
                    : [result.RESPONSE.RESULT[0].TrainStation];

                // Filter only prognosticated stations
                const activeStations = stations.filter(station => station.Prognosticated === true);

                const nearest = activeStations.reduce((nearest, station) => {
                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        station.Latitude,
                        station.Longitude
                    );
                    return (!nearest || distance < nearest.distance)
                        ? { station, distance }
                        : nearest;
                }, { station: null, distance: Infinity } as { station: Station | null, distance: number });

                if (nearest.station) {
                    setCurrentStation(nearest.station);
                    return nearest.station;
                }
            }
            throw new Error('No stations found');
        } catch (error) {
            console.error('Error finding nearest station:', error);
            const defaultStation = {
                LocationSignature: 'Cst',
                AdvertisedLocationName: 'Stockholm Central',
                Latitude: 59.3307,
                Longitude: 18.0586,
                Prognosticated: true
            };
            setCurrentStation(defaultStation);
            return defaultStation;
        }
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const getUserLocation = () => {
        return new Promise<GeolocationPosition>((resolve, reject) => {
            if (!navigator.geolocation) {
                console.error('Geolocation is not supported by your browser');
                reject(new Error('Geolocation is not supported by your browser'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log('Successfully got user location:', {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        resolve(position);
                    },
                    (error) => {
                        console.error('Error getting user location:', error.message);
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            }
        });
    };

    const fetchData = async (station?: Station) => {
        try {
            setLoading(true);
            setError('');
            console.log('Starting fetchData with API key:', import.meta.env.VITE_TRAFIKVERKET_API_KEY ? 'Present' : 'Missing');

            if (!import.meta.env.VITE_TRAFIKVERKET_API_KEY) {
                throw new Error('API key is not configured. Please check your .env file.');
            }

            const stationToUse = station || currentStation || {
                LocationSignature: 'Cst',
                AdvertisedLocationName: 'Stockholm Central'
            };
            
            console.log('Using station:', stationToUse);

            const requestBody = `<REQUEST>
    <LOGIN authenticationkey="${import.meta.env.VITE_TRAFIKVERKET_API_KEY}" />
    <QUERY objecttype="TrainAnnouncement" orderby="AdvertisedTimeAtLocation" schemaversion="1.0">
        <FILTER>
            <AND>
                <EQ name="ActivityType" value="Avgang" />
                <EQ name="LocationSignature" value="${stationToUse.LocationSignature}" />
                <OR>
                    <AND>
                        <GT name="AdvertisedTimeAtLocation" value="$NOW" />
                        <LT name="AdvertisedTimeAtLocation" value="$NOW.AddHours(2)" />
                    </AND>
                    <AND>
                        <GT name="EstimatedTimeAtLocation" value="$NOW" />
                        <LT name="EstimatedTimeAtLocation" value="$NOW.AddHours(2)" />
                    </AND>
                </OR>
                <EXISTS name="Advertised" value="true" />
                <EQ name="Canceled" value="false" />
            </AND>
        </FILTER>
        <INCLUDE>InformationOwner</INCLUDE>
        <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
        <INCLUDE>EstimatedTimeAtLocation</INCLUDE>
        <INCLUDE>TrackAtLocation</INCLUDE>
        <INCLUDE>FromLocation</INCLUDE>
        <INCLUDE>ToLocation</INCLUDE>
        <INCLUDE>ProductInformation</INCLUDE>
        <INCLUDE>ViaToLocation</INCLUDE>
        <INCLUDE>TimeAtLocation</INCLUDE>
    </QUERY>
</REQUEST>`;

            console.log('Departure search request:', requestBody);

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

            console.log('Departure search response:', response.data);

            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: ""
            });
            const result = parser.parse(response.data);
            console.log('Parsed result:', result);

            if (result?.RESPONSE?.RESULT?.[0]?.TrainAnnouncement) {
                const announcements = result.RESPONSE.RESULT[0].TrainAnnouncement;
                const departuresList = Array.isArray(announcements) ? announcements : [announcements];
                setDepartures(departuresList);
            } else {
                setDepartures([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            let errorMessage = 'Failed to load train departures. Please try again later.';
            if (axios.isAxiosError(error)) {
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
        const initializeLocation = async () => {
            try {
                setLocationLoading(true);
                const position = await getUserLocation();
                const station = await findNearestStation(
                    position.coords.latitude,
                    position.coords.longitude
                );
                await fetchData(station);
            } catch (error) {
                console.error('Error getting location:', error);
                await fetchData();
            } finally {
                setLocationLoading(false);
            }
        };

        initializeLocation();
        const interval = setInterval(() => fetchData(), 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DepartureBoard
            stationName={currentStation?.AdvertisedLocationName || 'Central Station'}
            departures={departures}
            isLoading={locationLoading || loading}
            error={error}
            onRefresh={() => fetchData()}
        />
    );
};

export default TransportDepartures;
