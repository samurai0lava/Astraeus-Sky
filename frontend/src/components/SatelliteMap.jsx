import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMemo, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import satteliteIconUrl from "../assets/dot.png";
import DriftMarker from "react-leaflet-drift-marker";

const satelliteIcon = L.icon({
  iconUrl: satteliteIconUrl,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png", // or your own asset
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 7);
    }
  }, [position, map]);
  return null;
}

export default function SatelliteMap({ satellites, onRefresh }) {
  const [userLocation, setUserLocation] = useState(null);

  // Geolocation on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Geolocation failed:", err)
    );
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!onRefresh) return;
    const interval = setInterval(() => {
      onRefresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [onRefresh]);

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    if (satellites?.length > 0) return [satellites[0].lat, satellites[0].lng];
    return [0, 0];
  }, [userLocation, satellites]);

  if (!satellites || satellites.length === 0) {
    return <p style={{ color: "white" }}>No satellite data available.</p>;
  }

  return (
    <MapContainer center={center} zoom={10} style={{ height: "800px", width: "100%" }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <RecenterMap position={userLocation} />

      {/* User location marker */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>📍 Your Location</Popup>
        </Marker>
      )}

      {/* Satellite markers with smooth drift animation */}
      {satellites.map((sat) => (
        <DriftMarker
          key={sat.id}
          position={[sat.lat, sat.lng]}
          duration={4000}
          icon={satelliteIcon}
        >
          <Popup>
            <strong>{sat.name}</strong><br />
            Lat: {sat.lat}<br />
            Lon: {sat.lng}<br />
            Alt: {sat.altitude} km<br />
            Azimuth: {sat.azimuth}°
          </Popup>
        </DriftMarker>
      ))}
    </MapContainer>
  );
}