import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";
import TransportDeparture from "./components/departure/TransportDeparture";
import WeatherComponent from "./components/weather/Weather";
import MapTraffic from "./components/traffic/MapTraffic";
import "./index.css";


const App = () => {
  return (
    <AddressProvider>
      <div style={{ padding: '20px' }}>
        <h1>Local Travel & Weather Dashboard</h1>
        <div style={{ marginBottom: '20px' }}>
          <AddressInput />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <MapTraffic />
        </div>
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px' }}>
          <TransportDeparture />
        </div>
      </div>

      <div className="space-y-4">
        <WeatherComponent city="Stockholm" /> {/* To do: Integrate with coordinates from AddressInput */}
      </div>
    </AddressProvider>
  );
};

export default App;
