import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom ambulance icon
const ambulanceIcon = new L.Icon({
  iconUrl: 'data:image/png;base64,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', // Replace with the URL of your ambulance icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Map = () => {
  const [vehicles, setVehicles] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([15, 80]); // Default center

  useEffect(() => {
    // Fetch current location
    

    const fetchData = async () => {
      try {
        const data = [
          {
            latitude: 13.18041111111111,
            longitude: 80.31421333333333,
            speed: 40,
            date: 1734062978948,
            isoDate: "2024-12-13T04:09:38.948Z",
            odoDistance: 39400.857484227985,
            ignitionStatus: "ON",
            status: "OFF",
            vehicleStatus: "MOVING",
            address: "2.8 kms from Ward 10, Zone 1 Tiruvottiyur, Chennai, Chennai district, Tamil Nadu, India",
            regNo: "TN12AR4716",
            vehicleType: "TRAILER 20 FT",
            vehicleId: "EGEwRm",
            deviceId: "0355172100386299",
            expiryDate: "2025-01-15",
            onboardDate: "2023-01-23",
            fuelLitre: 20,
            bearing: 181,
            serverTime: 1734063220967,
            insideGeoFence: "N",
            triggeredGeoFences: [],
            rowId: 0,
          },
        ];
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const polylinePositions = vehicles.map((vehicle) => [vehicle.latitude, vehicle.longitude]);

  return (
    <div className='p-0.5'>
      <MapContainer center={currentLocation} zoom={7} style={{ height: '625px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.deviceId}
            position={[vehicle.latitude, vehicle.longitude]}
            icon={ambulanceIcon}
          >
            <Popup>
              <div>
                <h3>{vehicle.regNo}</h3>
                <p>{vehicle.address}</p>
                <p>Status: {vehicle.vehicleStatus}</p>
                <p>Speed: {vehicle.speed} km/h</p>
                <p>Fuel: {vehicle.fuelLitre} litres</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Polyline connecting vehicles */}
        <Polyline positions={polylinePositions} color="black" />
      </MapContainer>
    </div>
  );
};

export default Map;
