import { useState, useCallback, useContext } from "react";
import { AddressContext } from "../context/AddressContext";

type Suggestion = {
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
};

const AddressInput = () => {
  
  const { setSelectedAddress, setCoordinates, selectedAddress, coordinates } = useContext(AddressContext)!;
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);


  const fetchWithTimeout = async (url: string, timeout = 5000, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);

        if (!response.ok) throw new Error(`Request failed with status: ${response.status}`);

        return await response.json();
      } catch (err) {
        clearTimeout(id);
        if (err instanceof Error) {
          console.error("Fetch error:", err.message);
        } else {
          console.error("Unknown error occurred");
        }
        if (i === retries - 1) throw new Error("Failed after multiple attempts");
      }
    }
  };

  const fetchCoordinates = useCallback(async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }
  
    setError("");
    setLoading(true);
  
    const apiUrl = `http://localhost:8080/geocode?address=${encodeURIComponent(address)}`;
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      const data = await fetchWithTimeout(apiUrl);
  
      console.log("API Response:", data);
  
      if (data.status.toLowerCase() === "ok" && data.results.length > 0) {

        //CARMELO>>>>
        const coordinates = data.results[0].geometry.location;
        console.log(`Latitudine: ${coordinates.lat}, Longitudine: ${coordinates.lng}`);
        console.log("Final coordinates are: ", coordinates)
        //<<<<CARMELO


        setSuggestions(data.results);
      } else {
        console.warn("First request failed, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        const retryData = await fetchWithTimeout(apiUrl);
  
        if (retryData.status.toLowerCase() === "ok" && retryData.results.length > 0) {
          setSuggestions(retryData.results);
        } else {
          setError("Address not found or unavailable.");
          setSuggestions([]);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch coordinates.");
    } finally {
      setLoading(false);
    }
  }, [address]);

  const handleSelectSuggestion = (lat: number, lon: number, formattedAddress: string) => {
    console.log("Updating coordinates:", { lat, lon });
    setCoordinates({ lat, lon });
    setSelectedAddress(formattedAddress);
    console.log("Coordinates:", { lat, lon });
    setSuggestions([]);
  };

  const formatAddress = (address: string) => {
    const formatted = address.replace(/,([^\s])/g, ", $1");
    return formatted;
  };

  return (
    <div>
      <h2>Enter Address</h2>
      <input
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={fetchCoordinates} disabled={loading}>
        {loading ? "Loading..." : "Get Coordinates"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((result, index) => (
            <li
              key={index}
              onClick={() =>
                handleSelectSuggestion(
                  result.geometry.location.lat,
                  result.geometry.location.lng,
                  result.formatted_address
                )
              }
            >
              {formatAddress(result.formatted_address)}
            </li>
          ))}
        </ul>
      )}

      {coordinates ? (
        <div>
          <h3>Selected Address:</h3>
          <p>{formatAddress(selectedAddress)}</p>
          <h4>Coordinates:</h4>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lon}</p>
        </div>
        ) : (
          <p>No coordinates available.</p>
        )}
    </div>
      );
    };

export default AddressInput;
