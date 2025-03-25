import { create } from "zustand";

//define type store
type AddressStoreType = {
  selectedAddress: string;
  coordinates: { lat: number; lon: number } | null;
  setSelectedAddress: (address: string) => void;
  setCoordinates: (coords: { lat: number; lon: number } | null) => void;
};

//create the store
export const useAddressStore = create<AddressStoreType>((set) => ({
  selectedAddress: "",
  coordinates: null,

  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setCoordinates: (coords) => set({ coordinates: coords }),
}));
