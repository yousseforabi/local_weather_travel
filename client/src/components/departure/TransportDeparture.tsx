import { useState, useEffect } from "react";
import axios from "axios";
import DepartureBoard from "./DepartureBoard";
import "../../style/departure/departure.css";
import { useAddressStore } from "../../store/store";

interface Station {
  LocationSignature: string;
  AdvertisedLocationName: string;
  Latitude: number;
  Longitude: number;
  Prognosticated?: boolean;
}

interface Departure {
  AdvertisedTimeAtLocation: string;
  FromLocation?: string; // Added based on sample data
  ProductInformation: (string | number)[]; // Adjusted to match sample data
  ToLocation?: string; // Adjusted to match sample data
  TrackAtLocation: number; // Adjusted type from string to number based on sample data
}

const TransportDeparture = () => {
  const coordinates = useAddressStore((state) => state.coordinates);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);

  const findNearestStation = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/findNearestStation?lat=${latitude}&lon=${longitude}`
      );

      const station = response.data as Station;
      if (station) {
        setCurrentStation(station);
        return station;
      }
      throw new Error("No stations found");
    } catch (error) {
      console.error("Error finding nearest station:", error);
      const defaultStation = {
        LocationSignature: "Cst",
        AdvertisedLocationName: "Stockholm Central",
        Latitude: 59.3307,
        Longitude: 18.0586,
        Prognosticated: true,
      };
      setCurrentStation(defaultStation);
      return defaultStation;
    }
  };

  const fetchData = async (latitude?: number, longitude?: number) => {
    try {
      setLoading(true);
      setError("");

      let stationToUse = currentStation;

      if (latitude !== undefined && longitude !== undefined) {
        stationToUse = await findNearestStation(latitude, longitude);
      } else if (!stationToUse) {
        stationToUse = {
          LocationSignature: "Cst",
          AdvertisedLocationName: "Stockholm Central",
          Latitude: 59.3307,
          Longitude: 18.0586,
        };
      }

      if (!stationToUse) {
        throw new Error("No station available");
      }

      const response = await axios.get(
        `http://localhost:8080/trainDepartures?stationId=${stationToUse.LocationSignature}`
      );

      if (response.data) {
        const departuresList = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setDepartures(departuresList);
      } else {
        setDepartures([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      let errorMessage =
        "Failed to load train departures. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setDepartures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!coordinates) return;

    const fetchTrainData = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchData(coordinates.lat, coordinates.lon);
      } catch (err) {
        console.error("Error fetching train data:", err);
        setError("Failed to fetch train data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainData();
    const interval = setInterval(fetchTrainData, 30000);
    return () => clearInterval(interval);
  }, [coordinates]);

  return (
    <div className="transport-departures">
      <DepartureBoard
        stationName={
          currentStation?.AdvertisedLocationName || "Central Station"
        }
        departures={departures}
        isLoading={loading}
        error={error}
        onRefresh={() => fetchData(coordinates?.lat, coordinates?.lon)}
      />
    </div>
  );
};

export default TransportDeparture;
