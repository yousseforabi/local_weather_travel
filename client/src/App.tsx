import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";
import Traffic from "./components/traffic/Traffic";
import TransportDepartures from "./components/transportDeparture";
import "./index.css";
import WeatherComponent from "./components/weather/Weather";
const App = () => {
  return (
    <>
      <AddressProvider>
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
