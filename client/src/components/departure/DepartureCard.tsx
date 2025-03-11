import React from 'react';
import '../../style/departure/departure.css';

interface DepartureCardProps {
    time: string;
    trainType: string;
    destination: string;
    track?: string;
}

const DepartureCard: React.FC<DepartureCardProps> = ({ time, trainType, destination, track }) => {
    return (
        <div className="departure-card">
            <div className="departure-header">
                <div className="departure-time">{time}</div>
                <div className="departure-type">{trainType}</div>
            </div>
            <div className="departure-destination">
                To: {destination}
                {track && (
                    <span className="departure-track">
                        Track: {track}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DepartureCard; 