import { useAddressStore } from "../../store/store";

const SelectedCoordinates = () => {
  // Using Zustand store to manage state
  const coordinates = useAddressStore((state) => state.coordinates);
  const selectedAddress = useAddressStore((state) => state.selectedAddress);

  const defaultCoordinates = { lat: 59.32671282807284, lon: 18.022816125917494 };
  const defaultAddress = "Stockholm, Sweden";

  const formatAddress = (address: string) => {
    const formatted = address.replace(/,([^\s])/g, ", $1");
    return formatted;
  };

  const displayCoordinates = coordinates || defaultCoordinates;
  const displayAddress = selectedAddress || defaultAddress;

  return (
    <section className="flex flex-col items-center p-6 bg-background">
      <div className="m-auto w-full text-center p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Selected Address:</h3>
        <p className="text-sm">{formatAddress(displayAddress)}</p>
        <h4 className="text-lg font-semibold mt-2">Coordinates:</h4>
        <p className="text-sm">Latitude: {displayCoordinates.lat}</p>
        <p className="text-sm">Longitude: {displayCoordinates.lon}</p>
      </div>
    </section>
  );
};

export default SelectedCoordinates;