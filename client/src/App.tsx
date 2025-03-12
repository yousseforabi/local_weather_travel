import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";
import Traffic from "./components/traffic/Traffic";
import TransportDepartures from "./components/transportDeparture";

const App = () => {

  return (
    <>
   {/*components here*/}
      <AddressProvider>
        <h1>Local Travel & Weather Dashboard</h1>
        <AddressInput />
        <TransportDepartures />
        <Traffic />
      </AddressProvider>
    </>
  )
}

export default App
