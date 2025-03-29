import React from 'react';
import '../../style/departure/departure.css';

interface DepartureCardProps {
    time: string;
    fromLocation?: string;
    trainType: (string | number)[];
    toLocation?: string;
    track: number;
}

const DepartureCard: React.FC<DepartureCardProps> = ({ time, fromLocation, trainType, toLocation, track }) => {
    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('sv-SE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="departure-card">
            <div className="departure-header">
                <div className="departure-time">{formatTime(time)}</div>
                <div className="departure-type">{trainType[0]}</div>
            </div>
            <div className="departure-info">
                {fromLocation && (
                    <div className="departure-from">
                        From: {fromLocation}
                    </div>
                )}
                {toLocation && (
                    <div className="departure-destination">
                        To: {toLocation}
                    </div>
                )}
                <div className="departure-track">
                    Track: {track}
                </div>
            </div>
        </div>
    );
};

export default DepartureCard; 