import React, { useEffect, useState } from "react";
import Map from "./Map";
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

        const firstDeviation = firstSituation?.Deviation?.[0];
        const firstDescription = firstDeviation?.LocationDescriptor || "No description available";
        const firstMessage = firstDeviation?.Message || "No specific message available";
        
        if (firstSituation) {
          setData({
            Id: firstSituation.Id,
            CountryCode: firstSituation.CountryCode,
            PublicationTime: firstSituation.PublicationTime,
            Description: firstDescription,
            Message: firstMessage,
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
  }, [coordinates]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
  
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    return date.toLocaleString('sv-SE', options);
  };
  
  
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
    <section className="flex justify-center items-center flex-col h-auto px-6 pb-4 bg-background">
      <section className="mb-4">
        <Heading label="TRAFFIC UPDATES" />
      </section>
  
      <section className="bg-foreground flex justify-between items-center p-6 rounded-lg w-full min-h-[300px] h-auto flex-col lg:flex-row sm:flex-col xs:flex-col">
        {data ? (
          <section className="space-y-2 p-2 w-full">
            <p className="text-text text-center"><strong>ID: </strong> 
              {data.Id}
            </p>
            <section className="flex justify-between items-center flex-wrap w-full py-4 px-4 rounded-md bg-background">
              <p className="text-text">
                <strong>Country Code: </strong>
                   {data.CountryCode}
              </p>
              <p className="text-text">
                <strong>Publication Time: </strong>
                   {formatDate(data.PublicationTime)}
              </p>
            </section>
  
            <section className="flex flex-col justify-center items-center w-full">
              <p className="text-text w-full py-3 sm:w-5/6 text-justify break-words">
                <strong>Description: </strong>
                   {data.Description}
              </p>
              <p className="text-text w-full py-3 sm:w-5/6 text-justify break-words">
                <strong>Message: </strong>
                   {data.Message}
              </p>
            </section>
          </section>
        ) : (
          <p className="text-secondary">No traffic data found.</p>
        )}
        <Map/>
      </section>
    </section>
  );
  
  
};

export default Traffic;
