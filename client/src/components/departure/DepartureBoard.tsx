import React from "react";
import DepartureCard from "./DepartureCard";

interface Departure {
  AdvertisedTimeAtLocation: string;
  FromLocation?: string;
  ProductInformation: (string | number)[];
  ToLocation?: string;
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
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading train departures...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          {stationName}
        </h1>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-red-800 dark:text-red-200 text-center">
              {error}
            </p>
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : departures.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No departures found for the next 2 hours
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {departures.slice(0, 6).map((departure, index) => (
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
