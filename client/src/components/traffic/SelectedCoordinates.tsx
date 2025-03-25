import { useAddressStore } from "../../store/store";

const AddressInput = () => {
  // Using Zustand store to manage state
  const coordinates = useAddressStore((state) => state.coordinates);
  const selectedAddress = useAddressStore((state) => state.selectedAddress);

  const formatAddress = (address: string) => {
    const formatted = address.replace(/,([^\s])/g, ", $1");
    return formatted;
  };

  return (
    <section className="w-full flex flex-col items-center justify-center m-auto p-6 bg-background rounded-lg shadow-md">
      {coordinates && (
        <div className="mt-4 w-full text-center bg-foreground p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Selected Address:</h3>
          <p className="text-sm">{formatAddress(selectedAddress || "")}</p>
          <h4 className="text-lg font-semibold mt-2">Coordinates:</h4>
          <p className="text-sm">Latitude: {coordinates.lat}</p>
          <p className="text-sm">Longitude: {coordinates.lon}</p>
        </div>
      )}
    </section>
  );
};

export default AddressInput;
