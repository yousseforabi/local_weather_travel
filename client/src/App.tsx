import AddressInput from "./components/AddressInput";
import TransportDeparture from "./components/departure/TransportDeparture";
import "./index.css";
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
        <div className="flex justify-center">
          <TransportDeparture />
          <WeatherComponent />
        </div>
        <MapTraffic />
      </div>
    </>
  );
};

export default App;
