import React from "react";

interface DepartureCardProps {
  time: string;
  fromLocation?: string;
  trainType: (string | number)[];
  toLocation?: string;
  track: number;
}

const DepartureCard: React.FC<DepartureCardProps> = ({
  time,
  fromLocation,
  trainType = [],
  toLocation,
  track,
}) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatTime(time)}
        </div>
        {trainType?.[0] && (
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-light">
            {trainType[0].toString().slice(0, 2)} {trainType[1]}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {fromLocation && (
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <span className="from-location font-light">{fromLocation}</span>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14m0 0l-6-6m6 6l-6 6"
              />
            </svg>
            <span className="to-location font-light">{toLocation}</span>
          </div>
        )}
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span className="font-light">Track: {track}</span>
        </div>
      </div>
    </div>
  );
};

export default DepartureCard;
