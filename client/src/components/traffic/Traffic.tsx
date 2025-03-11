import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Heading from "../heading/Heading";
import "../../style/traffic/traffic.css";
import { AddressContext } from "../../context/AddressContext";

type TrafficData = {
  Id: string;
  CountryCode: string;
  PublicationTime: string;
  Description: string;
};

const Traffic: React.FC = () => {
  const { coordinates } = useContext(AddressContext)!;
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

        if (firstSituation) {
          setData({
            Id: firstSituation.Id,
            CountryCode: firstSituation.CountryCode,
            PublicationTime: firstSituation.PublicationTime,
            Description: firstSituation.Description || "No description available",
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
    <section className="wrapper">
      <div className="title-container">
        <Heading label="TRAFFIC UPDATES" />
      </div>

      <div className="data-container">
        {loading ? (
          <p>Loading traffic data...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : data ? (
          <>
            <div className="text-data-container">
              <p><strong>ID:</strong> {data.Id}</p>
              <p><strong>Country Code:</strong> {data.CountryCode}</p>
              <p><strong>Publication Time:</strong> {data.PublicationTime}</p>
              <p><strong>Description:</strong> {data.Description}</p>
            </div>
          </>
        ) : (
          <p>No traffic data found.</p>
        )}
      </div>
    </section>
  );
};

export default Traffic;
