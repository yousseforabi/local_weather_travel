import { useState } from "react";

type Suggestion = {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

const AdressInput = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const fetchWithRetry = async (url: string, retries: number = 3, delayMs: number = 1000) => {
    let attempts = 0;
    while (attempts < retries) {
      try {
        const response = await fetch(url);
        
        if (!response) {
          throw new Error("No response from server");
        }
  
        if (response.ok) return response;
        throw new Error(`Request failed with status: ${response.status}`);
      } catch (error) {
        attempts++;
        console.log(`Retrying request (${attempts}/${retries})...`);
        if (attempts === retries) throw error; 
        await new Promise((resolve) => setTimeout(resolve, delayMs)); 
      }
    }
  };
  
  const fetchCoordinates = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }
  
    try {
      setError("");
      const apiUrl = `http://localhost:8080/geocode?address=${encodeURIComponent(address)}`;
  
      const response = await fetchWithRetry(apiUrl);
  
      if (!response) {
        throw new Error("No response received.");
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (data.status.toLowerCase() === "ok" && data.results.length > 0) {
        setSuggestions(data.results); 
        setCoordinates(null); 
      } else {
        setError("Address not found. Try again.");
        setSuggestions([]); 
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch coordinates. Please try again.");
    }
  };
  

  const handleSelectSuggestion = (lat: number, lon: number) => {
    setCoordinates({ lat, lon }); 
    setSuggestions([]); 
  };

  return (
    <div>
      <h2>Enter Address</h2>
      <input
        type="text"
        id="address"
        name="address"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={fetchCoordinates}>Get Coordinates</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((result, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(result.geometry.location.lat, result.geometry.location.lng)}>
              {result.formatted_address}
            </li>
          ))}
        </ul>
      )}

      {coordinates && (
        <p>
          Latitude: {coordinates.lat}, Longitude: {coordinates.lon}
        </p>
      )}
    </div>
  );
};

export default AdressInput;
