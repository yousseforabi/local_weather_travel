import { useState, useCallback } from "react";
import { useAddressStore } from "../store/store";

type Suggestion = {
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
};

const AddressInput = () => {
  // Using Zustand store to manage state
  const setCoordinates = useAddressStore((state) => state.setCoordinates);
  const setSelectedAddress = useAddressStore((state) => state.setSelectedAddress);
  const address = useAddressStore((state) => state.address);
  const setAddress = useAddressStore((state) => state.setAddress);
  
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
    let retries = 3;

    while (retries > 0) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const data = await fetchWithTimeout(apiUrl);
        console.log("API Response:", data);

        if (data.status.toLowerCase() === "ok" && data.results.length > 0) {
          const coordinates = data.results[0].geometry.location;
          console.log(`Latitudine: ${coordinates.lat}, Longitudine: ${coordinates.lng}`);
          console.log("Final coordinates are: ", coordinates);

          setSuggestions(data.results);
          setLoading(false);
          return;
        }

      } catch (err) {
        console.error("Error fetching coordinates:", err);
      }

      console.warn(`Request failed, retrying... (${retries - 1} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      retries--;
    }

    setError("Address not found or unavailable after multiple attempts.");
    setSuggestions([]);
    setLoading(false);
  }, [address]);

  const sendCoordinatesToBackend = async (lat: number, lon: number) => {
    try {
      const response = await fetch("http://localhost:8080/logCoordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lon }),
      });

      if (!response.ok) {
        console.error("Failed to send coordinates to backend.");
      } else {
        console.log("Coordinates sent to backend.");
      }
    } catch (err) {
      console.error("Error sending coordinates:", err);
    }
  };

  const handleSelectSuggestion = async (lat: number, lon: number, formattedAddress: string) => {
    setCoordinates({ lat, lon });
    setSelectedAddress(formattedAddress);
    console.log("Coordinates:", { lat, lon });
    setSuggestions([]);

    await sendCoordinatesToBackend(lat, lon);
  };

  const formatAddress = (address: string) => {
    const formatted = address.replace(/,([^\s])/g, ", $1");
    return formatted;
  };

  return (
    <section className="w-full flex flex-col items-center justify-center m-auto p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-text mb-4">Local Travel & Weather Dashboard</h2>
  
      <section className="flex flex-col lg:flex-row items-baseline w-full max-w-[500px] justify-between gap-4 sm:w-full">
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full lg:w-3/5 p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchCoordinates}
          disabled={loading}
          className={`w-full lg:w-auto px-9 py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "SEARCH"}
        </button>
      </section>
  
      {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
  
      {suggestions.length > 0 && (
        <ul className="w-full mt-4 border border-gray-300 rounded-lg bg-white max-w-[500px]">
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
              className="p-3 border-b last:border-none hover:bg-gray-100 cursor-pointer"
            >
              {formatAddress(result.formatted_address)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );  
};

export default AddressInput;
