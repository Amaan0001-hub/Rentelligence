
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

let L;
if (typeof window !== "undefined") {
  L = require("leaflet"); // eslint-disable-line global-require
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

// ✅ Country coordinates
// const countryCoordinates = {
//   India: { lat: 20.5937, lng: 78.9629 },
//   USA: { lat: 37.0902, lng: -95.7129 },
//   "United States of America": { lat: 37.0902, lng: -95.7129 },
//   UK: { lat: 55.3781, lng: -3.4360 },
//   "United Kingdom": { lat: 55.3781, lng: -3.4360 },
//   Germany: { lat: 51.1657, lng: 10.4515 },
//   France: { lat: 46.6034, lng: 1.8883 },
//   Brazil: { lat: -14.235, lng: -51.9253 },
//   Australia: { lat: -25.2744, lng: 133.7751 },
//   Canada: { lat: 56.1304, lng: -106.3468 },
//   China: { lat: 35.8617, lng: 104.1954 },
//   Japan: { lat: 36.2048, lng: 138.2529 },
//   Nigeria: { lat: 9.0820, lng: 8.6753 },
//   Kenya: { lat: -0.0236, lng: 37.9062 },
//   Congo: { lat: -0.2280, lng: 15.8277 },
//   Tanzania: { lat: -6.3690, lng: 34.8888 },
// };
const countryCoordinates = {
  India: { lat: 20.5937, lng: 78.9629 },
  USA: { lat: 37.0902, lng: -95.7129 },
  "United States of America": { lat: 37.0902, lng: -95.7129 },
  UK: { lat: 55.3781, lng: -3.4360 },
  "United Kingdom": { lat: 55.3781, lng: -3.4360 },
  Germany: { lat: 51.1657, lng: 10.4515 },
  France: { lat: 46.6034, lng: 1.8883 },
  Brazil: { lat: -14.235, lng: -51.9253 },
  Australia: { lat: -25.2744, lng: 133.7751 },
  Canada: { lat: 56.1304, lng: -106.3468 },
  China: { lat: 35.8617, lng: 104.1954 },
  Japan: { lat: 36.2048, lng: 138.2529 },
  Nigeria: { lat: 9.0820, lng: 8.6753 },
  Kenya: { lat: -0.0236, lng: 37.9062 },
  Congo: { lat: -0.2280, lng: 15.8277 },
  Tanzania: { lat: -6.3690, lng: 34.8888 },
  Austria: { lat: 47.5162, lng: 14.5501 },
  Australia: { lat: -25.2744, lng: 133.7751 },
  Belgium: { lat: 50.8503, lng: 4.3517 },
  Bulgaria: { lat: 42.7339, lng: 25.4858 },
  Croatia: { lat: 45.1000, lng: 15.2000 },
  Cyprus: { lat: 35.1264, lng: 33.4299 },
  Czechia: { lat: 49.8175, lng: 15.4730 },
  Denmark: { lat: 56.2639, lng: 9.5018 },
  Estonia: { lat: 58.5953, lng: 25.0136 },
  Finland: { lat: 61.9241, lng: 25.7482 },
  Greece: { lat: 39.0742, lng: 21.8243 },
  Hungary: { lat: 47.1625, lng: 19.5033 },
  Ireland: { lat: 53.3331, lng: -8.0000 },
  Italy: { lat: 41.8719, lng: 12.5674 },
  Latvia: { lat: 56.8796, lng: 24.6032 },
  Lithuania: { lat: 55.1694, lng: 23.8813 },
  Luxembourg: { lat: 49.8153, lng: 6.1296 },
  Malta: { lat: 35.9375, lng: 14.3754 },
  Netherlands: { lat: 52.1326, lng: 5.2913 },
  Poland: { lat: 51.9194, lng: 19.1451 },
  Portugal: { lat: 39.3999, lng: -8.2245 },
  Romania: { lat: 45.9432, lng: 24.9668 },
  Slovakia: { lat: 48.6690, lng: 19.6990 },
  Slovenia: { lat: 46.1512, lng: 14.9955 },
  Spain: { lat: 40.4637, lng: -3.7492 },
  Sweden: { lat: 60.1282, lng: 18.6435 }
};


// ✅ Custom pulsing bubble marker
const createBubbleIcon = (status) =>
  L.divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-6 h-6 ${
          status === "Active" ? "bg-green-400" : "bg-yellow-400"
        } rounded-full opacity-75 animate-ping"></div>
        <div class="w-3 h-3 ${
          status === "Active" ? "bg-green-600" : "bg-yellow-600"
        } rounded-full border border-white"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

const WorldMap = ({ analyticsData }) => {
  const [mapStyle, setMapStyle] = useState("standard");
  
  const activeCountries = analyticsData?.data?.filter(
    (item) => countryCoordinates[item.Country]
  );

  // Map style options
  const tileLayers = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    carto: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    wikimedia: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
    esri: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg relative">
      {/* Map style selector */}
      <div className="absolute top-3 right-3 z-[1000] bg-white p-2 rounded-md shadow-md">
        <label htmlFor="mapStyle" className="mr-2 text-xs font-medium dark:text-gray-500">Map Style:</label>
        <select 
          id="mapStyle"
          value={mapStyle} 
          onChange={(e) => setMapStyle(e.target.value)}
          className="p-1 text-xs border rounded dark:text-gray-500"
        >
          <option value="standard">Standard</option>
          <option value="carto">Light (Carto)</option>
          <option value="wikimedia">Multilingual</option>
          <option value="esri">ESRI Street</option>
        </select>
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Background map */}
        <TileLayer
          url={tileLayers[mapStyle]}
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* ✅ Marker with Tooltip + Popup */}
        {activeCountries?.map((location, idx) => {
          const coords = countryCoordinates[location.Country];
          return (
            <Marker
              key={idx}
              position={[coords.lat, coords.lng]}
              icon={createBubbleIcon(location.AgentStatus)}
            >
              {/* Hover to see country name */}
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                {location.Country}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WorldMap;