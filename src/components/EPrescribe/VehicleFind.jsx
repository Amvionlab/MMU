import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import marker images
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = () => {
  const [vehicles, setVehicles] = useState([]);
  const [useFallback, setUseFallback] = useState(false);

  const fallbackData = [
    {
      latitude: 13.18041111111111,
      longitude: 80.31421333333333,
      speed: 0,
      date: 1734062978948,
      isoDate: '2024-12-13T04:09:38.948Z',
      odoDistance: 39400.857484227985,
      ignitionStatus: 'OFF',
      status: 'OFF',
      vehicleStatus: 'PARKED',
      address: '2.8 kms from Ward 10, Zone 1 Tiruvottiyur, Chennai, Chennai district, Tamil Nadu, India',
      regNo: 'TN12AR4716',
      vehicleType: 'TRAILER 20 FT',
      vehicleId: 'EGEwRm',
      deviceId: '0355172100386299',
      expiryDate: '2025-01-15',
      onboardDate: '2023-01-23',
      fuelLitre: 0,
      bearing: 181,
      serverTime: 1734063220967,
      insideGeoFence: 'N',
      triggeredGeoFences: [],
      rowId: 0,
    },
    {
      latitude: 15.8446066,
      longitude: 79.9667549,
      speed: 40,
      date: 1734063212000,
      isoDate: '2024-12-13T04:13:32.000Z',
      odoDistance: 78609.4011969736,
      ignitionStatus: 'ON',
      status: 'ON',
      vehicleStatus: 'MOVING',
      address: '3.9 kms from Addanki, Prakasam District, Andhra Pradesh, India',
      regNo: 'TN28BH7546',
      vehicleType: 'TRAILER 20 FT',
      vehicleId: 'Hgld3H',
      deviceId: '352592571393453',
      expiryDate: '2025-01-18',
      onboardDate: '2024-01-18',
      fuelLitre: 328.99,
      bearing: 297,
      serverTime: 1734063220967,
      insideGeoFence: 'N',
      triggeredGeoFences: [],
      rowId: 1,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://app.gpstrack.in/api/get_current_data?token=arishthe_zqIZhBqL1VMkcyC4qlH2uA6cpox7qqhD&email=arishtheboss5133@gmail.com'
        );
        if (!response.ok) throw new Error('Failed to fetch API data');

        const data = await response.json();
        const vehiclesArray = Array.isArray(data?.data)
          ? data.data.filter(vehicle => vehicle.latitude && vehicle.longitude)
          : [];
        if (vehiclesArray.length === 0) throw new Error('No valid data from API');

        setVehicles(vehiclesArray);
        setUseFallback(false);
      } catch (error) {
        console.error('Error fetching data, using fallback data:', error);
        setVehicles(fallbackData);
        setUseFallback(true);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 40000); // Refresh data every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-container">
      <MapContainer center={[15, 80]} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {vehicles.map(vehicle => (
          <Marker key={vehicle.deviceId || vehicle.regNo} position={[vehicle.latitude, vehicle.longitude]}>
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
      </MapContainer>
      {vehicles.length === 0 && <p>No data available to display</p>}
      {useFallback && <p>Currently showing fallback data due to API issues.</p>}
    </div>
  );
};

// Create the root only once and reuse it
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Map />);

export default Map;
