import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAddressStore } from "../../store/store";
import { useEffect } from "react";

const SetMapCenter = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]); 
  return null;
};

const MyMap = () => {
  const coordinates = useAddressStore((state) => state.coordinates);

  const defaultCoordinates = { lat: 59.3293, lon: 18.0686 };

  const center: LatLngExpression = coordinates?.lat && coordinates?.lon
    ? [coordinates.lat, coordinates.lon]
    : [defaultCoordinates.lat, defaultCoordinates.lon];

  return (
      <section className="w-full min-w-[300px] h-[300px] xs:min-w-[200px] sm:h-[300px] border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={center}
          zoom={50}
          className="w-full h-full"
        >
          <SetMapCenter center={center} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              {coordinates?.lat && coordinates?.lon
                ? `Lat: ${coordinates.lat}, Lon: ${coordinates.lon}`
                : "Stoccolma, Svezia (Default)"}
            </Popup>
          </Marker>
        </MapContainer>
      </section>
  );
};

export default MyMap;
