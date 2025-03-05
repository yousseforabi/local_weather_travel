import { createContext } from "react";

type AddressContextType = {
  selectedAddress: string;
  coordinates: { lat: number; lon: number } | null;
  setSelectedAddress: (address: string) => void;
  setCoordinates: (coords: { lat: number; lon: number } | null) => void;
};

export const AddressContext = createContext<AddressContextType | undefined>(undefined);
