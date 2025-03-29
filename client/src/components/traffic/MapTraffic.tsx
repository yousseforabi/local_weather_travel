import Traffic from "./Traffic";
import Map from "./Map";
import SelectedCoordinates from "./SelectedCoordinates";

const MapTraffic = () => {
  return (
    <section className="flex flex-wrap justify-center items-center w-full flex-col sm:flex-row sm:space-x-6">
      <section className="flex-1 w-full">
        <SelectedCoordinates />
      </section>
      <section className="flex-[2] min-w-[620px]">
        <Traffic />
      </section>
      <section className="flex-1 min-w-[300px]">
        <Map />
      </section>
    </section>
  );
};

export default MapTraffic;
