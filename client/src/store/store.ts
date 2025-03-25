import { create } from 'zustand';
type AddressStoreType = {
  selectedAddress: string;
  coordinates: { lat: number; lon: number } | null;
  address: string;
  setSelectedAddress: (address: string) => void;
  setCoordinates: (coords: { lat: number; lon: number } | null) => void;
  setAddress: (address: string) => void;
};

export const useAddressStore = create<AddressStoreType>((set) => ({
  selectedAddress: "",
  coordinates: null,
  address: "",

  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setCoordinates: (coords) => set({ coordinates: coords }),
  setAddress: (address) => set({ address }),
}));
