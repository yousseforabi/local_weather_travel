import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";

const App = () => {

  return (
    <>
   {/*components here*/}
      <AddressProvider>
      <h1>Local Travel & Weather Dashboard</h1>
      <AddressInput />
      </AddressProvider>
    </>
  )
}

export default App
