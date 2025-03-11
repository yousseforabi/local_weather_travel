import { useState, ReactNode } from "react";
import { AddressContext } from "./AddressContext";

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  return (
    <AddressContext.Provider value={{ selectedAddress, coordinates, setSelectedAddress, setCoordinates }}>
      {children}
    </AddressContext.Provider>
  );
};
