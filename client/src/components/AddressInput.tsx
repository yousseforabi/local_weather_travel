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
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);  // State for loading indicator

  const fetchCoordinates = useCallback(async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    setError("");
    setLoading(true); // Start loading

    const apiUrl = `http://localhost:8080/geocode?address=${encodeURIComponent(address)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Request failed with status: ${response.status}`);

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status.toLowerCase() === "ok" && data.results.length > 0) {
        setSuggestions(data.results);
      } else {
        setError("Address not found or unavailable.");
        setSuggestions([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch coordinates.");
    } finally {
      setLoading(false); // End loading
    }
  }, [address]);

  const handleSelectSuggestion = (lat: number, lon: number, formattedAddress: string) => {
    setCoordinates({ lat, lon });
    setSelectedAddress(formattedAddress);
    setSuggestions([]);
  };

  // Function to add space after commas in the formatted address
  const formatAddress = (address: string) => {
    return address.replace(/,([^\s])/g, ", $1"); // Adds space after comma if not followed by a space
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
              {formatAddress(result.formatted_address)} {/* Format the address */}
            </li>
          ))}
        </ul>
      )}

      {/* Visa den valda adressen och koordinaterna */}
      {selectedAddress && coordinates && (
        <div>
          <h3>Selected Address:</h3>
          <p>{formatAddress(selectedAddress)}</p> {/* Format the selected address */}
          <h4>Coordinates:</h4>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lon}</p>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
