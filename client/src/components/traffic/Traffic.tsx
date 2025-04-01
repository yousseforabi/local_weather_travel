import React, { useEffect, useState } from "react";
import { useAddressStore } from "../../store/store";
import axios from "axios";
import Heading from "../heading/Heading";
import { TrafficData, TrafficApiResponse } from "../../types/types";


const Traffic: React.FC = () => {
  const defaultCoordinates = { lat: 59.32671282807284, lon: 18.022816125917494 };

  const coordinates = useAddressStore((state) => state.coordinates);

  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setLoading(true);
        setError(null);

        const lat = coordinates?.lat || defaultCoordinates.lat;
        const lon = coordinates?.lon || defaultCoordinates.lon;

        const response = await axios.get<TrafficApiResponse>(
          `http://localhost:8080/fetchDataTrafficSituation?lat=${lat}&lon=${lon}`
        );

        console.log("Traffic API Response:", response.data);

        const firstSituation = response.data.RESPONSE?.RESULT?.[0]?.Situation?.[0];
        const firstDeviation = firstSituation?.Deviation?.[0]?.Message;
        const firstIcon = firstSituation?.Deviation?.[0]?.IconId;

        if (firstSituation) {
          setData({
            Id: firstSituation.Id,
            CountryCode: firstSituation.CountryCode,
            PublicationTime: firstSituation.PublicationTime,
            Description: firstSituation.locationdescriptor || "No description available",
            Message: firstDeviation || "No specific message available",
            Icon: firstIcon
          });
        } else {
          setError("No traffic data available for this location.");
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching traffic data:", err);
        setError("Failed to fetch traffic data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficData();
  }, [coordinates]); // Re-fetch when coordinates change
  
  if (loading) {
    return (
      <section className="flex justify-center items-center flex-col w-full h-auto p-6 rounded-lg shadow-md bg-background">
        <Heading label="TRAFFIC UPDATES" />
        <p className="text-text">Loading traffic data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center flex-col w-full h-auto p-6 rounded-lg shadow-md bg-background">
        <Heading label="TRAFFIC UPDATES" />
        <p className="text-red-600 font-semibold">{error}</p>
      </section>
    );
  }

  return (
    <section className="flex justify-center items-center flex-col h-auto px-6 bg-background">
      <section className="mb-4">
        <Heading label="TRAFFIC UPDATES" />
      </section>

      <section className="bg-foreground p-4 rounded-lg w-full min-h-[300px] h-auto">
        {data ? (
          <section className="space-y-2 w-full">
            <p className="text-text"><strong>ID:</strong> {data.Id}</p>
            <section className="flex justify-between items-center flex-wrap w-full py-4 px-4 rounded-md bg-background">
              <p className="text-text"><strong>Country Code:</strong> {data.CountryCode}</p>
              <p className="text-text"><strong>Publication Time:</strong> {data.PublicationTime}</p>
            </section>

            <section className="flex flex-col justify-center items-center w-full">
              <p className="text-text w-full py-3 sm:w-5/6 text-justify border border-gray-300 break-words"><strong>Message:</strong> {data.Message}</p>
            </section>
          </section>
        ) : (
          <p className="text-secondary">No traffic data found.</p>
        )}
      </section>
    </section>
  );
};

export default Traffic;
