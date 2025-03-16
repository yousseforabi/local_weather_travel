import React, { useEffect, useState, useContext } from "react";
import { useAddressStore } from "../../store/store";
import axios from "axios";
import Heading from "../heading/Heading";
// import { AddressContext } from "../../context/AddressContext";

type TrafficData = {
  Id: string;
  CountryCode: string;
  PublicationTime: string;
  Description: string;
  Message?: string;
  Icon?: string,
};

const Traffic: React.FC = () => {
  //const { coordinates } = useContext(AddressContext)!;

  //use zustand instead context
  const coordinates = useAddressStore((state) => state.coordinates);
  
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      if (!coordinates) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8080/fetchDataTrafficSituation?lat=${coordinates.lat}&lon=${coordinates.lon}`
        );

        console.log("Traffic API Response:", response.data);

        const firstSituation = response.data.RESPONSE?.RESULT?.[0]?.Situation?.[0];
        const firstDeviation = response.data.RESPONSE?.RESULT?.[0]?.Situation?.[0].Deviation[0].Message;
        const firstIcon = response.data.RESPONSE?.RESULT?.[0]?.Situation?.[0].Deviation[0].IconId;
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
  }, [coordinates]);

  return (
    <section className="flex justify-center flex-col w-2/4 m-auto border bg-background text-text p-6 rounded-lg shadow-md">
      <section className="mb-4">
        <Heading label="TRAFFIC UPDATES" />
      </section>

      <section className="bg-foreground p-4 rounded-lg">
        {loading ? (
          <p className="text-text">Loading traffic data...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : data ? (
          <section className="space-y-2 w-full">
            
            <p className="text-text"><strong>ID:</strong> {data.Id}</p>
              <section className="flex justify-between items-center flex-wrap w-full py-4 px-4 rounded-md bg-background">
                <p className="text-text"><strong>Country Code:</strong> {data.CountryCode}</p>
                <p className="text-text"><strong>Publication Time:</strong> {data.PublicationTime}</p>
              </section>

              <section className="flex justify-between items-start flex-col flex-wrap w-full">
                <p className="text-text w-full break-words"><strong>Description:</strong> {data.Description}</p>
                <p className="text-text w-full break-words"><strong>Message:</strong> {data.Message}</p>
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
