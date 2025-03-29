import React from 'react';
import DepartureCard from './DepartureCard';
import '../../style/departure/departure.css';

interface Departure {
    AdvertisedTimeAtLocation: string;
    FromLocation: string;
    ProductInformation: (string | number)[];
    ToLocation: string;
    TrackAtLocation: number;
}

interface DepartureBoardProps {
    stationName: string;
    departures: Departure[];
    isLoading: boolean;
    error: string;
    onRefresh: () => void;
}

const DepartureBoard: React.FC<DepartureBoardProps> = ({
    stationName,
    departures,
    isLoading,
    error,
    onRefresh
}) => {
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

    if (isLoading) {
        return (
            <div className="loading-container">
                <p>Loading train departures...</p>
            </div>
        );
    }

    return (
        <div className="transport-container">
            <div className="transport-header">
                <h1 className="transport-title">Next Trains at {stationName}</h1>
                <button className="refresh-button" onClick={onRefresh}>
                    Refresh
                </button>
            </div>

            {error ? (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button className="try-again-button" onClick={onRefresh}>
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
                        <DepartureCard
                            key={index}
                            time={departure.AdvertisedTimeAtLocation}
                            fromLocation={departure.FromLocation}
                            trainType={departure.ProductInformation}
                            toLocation={departure.ToLocation}
                            track={departure.TrackAtLocation}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DepartureBoard; 