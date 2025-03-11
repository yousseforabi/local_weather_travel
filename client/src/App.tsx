import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";
import Traffic from "./components/traffic/Traffic";

const App = () => {

  return (
    <>
   {/*components here*/}
      <AddressProvider>
      <h1>Local Travel & Weather Dashboard</h1>
      <AddressInput />
      <Traffic />
      </AddressProvider>
    </>
  )
}

export default App
