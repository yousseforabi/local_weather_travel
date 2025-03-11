import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";
import Traffic from "./components/traffic/Traffic";
import TransportDeparture from "./components/departure/TransportDeparture";

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
      </AddressProvider>
    </>
  )
}

export default App
