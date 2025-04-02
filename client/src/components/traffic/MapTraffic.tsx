import Traffic from "./Traffic";
import SelectedCoordinates from "./SelectedCoordinates";

const MapTraffic = () => {
  return (
    <section className="flex justify-evenly w-full flex-col bg-background sm:flex-row sm:space-x-6">
        <SelectedCoordinates />
        <Traffic />
    </section>
  );
};

export default MapTraffic;
