import Traffic from "./Traffic";
import Map from "./Map";

const MapTraffic = () => {
  return (
    <section className="flex flex-wrap justify-center items-center w-full flex-col sm:flex-row sm:space-x-6">
      <section className="flex-1 w-full">
        <Map />
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
