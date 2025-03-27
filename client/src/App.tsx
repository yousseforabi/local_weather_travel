import AddressInput from "./components/AddressInput";
import TransportDeparture from "./components/departure/TransportDeparture";
import WeatherComponent from "./components/weather/Weather";
import MapTraffic from "./components/traffic/MapTraffic";
import "./index.css";
import ErrorBoundary from "./components/error/ErrorBoudary";

const App = () => {
  return (
    <>
        <div className="space-y-4">
          <ErrorBoundary>
            <AddressInput />
          </ErrorBoundary>
          <TransportDeparture />
          <WeatherComponent />
          <MapTraffic />
        </div>
    </>
  );
};

export default App;