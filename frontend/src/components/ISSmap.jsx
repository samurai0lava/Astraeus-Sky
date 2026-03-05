import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMemo, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ISSiconURL from "../assets/iss.png";

const ISSIcon = L.icon({
  iconUrl: ISSiconURL,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

///positions/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{seconds}
//ISS id 2

// response json

// {
//     "info": {
//         "satname": "SPACE STATION",
//         "satid": 25544,
//         "transactionscount": 0
//     },
//     "positions": [
//         {
//             "satlatitude": -45.90142636,
//             "satlongitude": -162.27036263,
//             "sataltitude": 441.75,
//             "azimuth": 231.12,
//             "elevation": -56.99,
//             "ra": 12.79158676,
//             "dec": -54.54360087,
//             "timestamp": 1772338414,
//             "eclipsed": false
//         },
//         {
//             "satlatitude": -45.87199059,
//             "satlongitude": -162.19264605,
//             "sataltitude": 441.75,
//             "azimuth": 231.11,
//             "elevation": -56.96,
//             "ra": 12.85082332,
//             "dec": -54.54883583,
//             "timestamp": 1772338415,
//             "eclipsed": false
//         }
//     ]
// }

function ISSmap() {
  return (
    <>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "800px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <RecenterMap position={userLocation} />
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>📍 Your Location</Popup>
          </Marker>
        )}
        {satellites.map((sat) => (
          <DriftMarker
            key={sat.id}
            position={[sat.lat, sat.lng]}
            duration={4000}
            icon={satelliteIcon}
          >
            <Popup>
              <strong>{sat.name}</strong>
              <br />
              Lat: {sat.lat}
              <br />
              Lon: {sat.lng}
              <br />
              Alt: {sat.altitude} km
              <br />
              Azimuth: {sat.azimuth}°
            </Popup>
          </DriftMarker>
        ))}
      </MapContainer>
    </>
  );
}

export default ISSmap;
