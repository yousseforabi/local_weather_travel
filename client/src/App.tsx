import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";
import Traffic from "../components/traffic/Traffic";
import TransportDeparture from "./components/departure/TransportDeparture";

import TransportDepartures from "../components/transportDeparture";
import "./index.css";
import WeatherComponent from "./components/weather/Weather";
const App = () => {
  return (
    <>
      <AddressProvider>
        <div style={{ padding: '20px' }}>
          <h1>Local Travel & Weather Dashboard</h1>
          <div style={{ marginBottom: '20px' }}>
            <AddressInput />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <Traffic />
          </div>
          <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px' }}>
            <TransportDeparture />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          Local Travel & Weather Dashboard
        </h1>
        <div className="space-y-4">
          <AddressInput />
          <TransportDepartures />
          <Traffic />
          <WeatherComponent city="Stockholm" />{" "}
          {/* Have to integrate with coordinates from AddressInput component*/}
        </div>
      </AddressProvider>
    </>
  );
};

export default App;
