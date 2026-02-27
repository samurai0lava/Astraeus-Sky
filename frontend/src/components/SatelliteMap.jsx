import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function SatelliteMap({ satellites }) {
  const center = useMemo(() => {
    if (satellites?.length > 0) {
      return [satellites[0].satlat, satellites[0].satlng];
    }
    return [0, 0];
  }, [satellites]);

  if (!satellites || satellites.length === 0) {
    return <p style={{ color: "white" }}>No satellite data available.</p>;
  }

  return (
    <MapContainer
      center={center}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {satellites.map((sat) => (
        <Marker key={sat.satid} position={[sat.satlat, sat.satlng]}>
          <Popup>
            <strong>{sat.satname}</strong><br />
            Lat: {sat.satlat}<br />
            Lon: {sat.satlng}<br />
            Alt: {sat.satalt} km<br />
            Launched: {sat.launchDate}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}