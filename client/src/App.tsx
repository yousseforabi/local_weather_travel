import { AddressProvider } from "./context/AddressProvider";
import AddressInput from "./components/AddressInput";
// src/App.tsx

import TransportDepartures from './components/transportDeparture';

function App() {
  return (
    <>
      <TransportDepartures />
       <AddressProvider>
      <h1>Local Travel & Weather Dashboard</h1>
      <AddressInput />
      </AddressProvider>
    </>
  );
}

export default App;
