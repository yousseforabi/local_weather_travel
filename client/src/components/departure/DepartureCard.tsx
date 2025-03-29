import React from 'react';

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatTime(time)}
                </div>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                    {trainType[0]}
                </div>
            </div>
            <div className="space-y-2">
                {fromLocation && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <span className="font-medium">From: {fromLocation}</span>
                    </div>
                )}
                {toLocation && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span className="font-medium">To: {toLocation}</span>
                    </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium">Track: {track}</span>
                </div>
            </div>
        </div>
    );
};

export default DepartureCard; 