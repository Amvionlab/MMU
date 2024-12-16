import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [
          { "latitude": 13.18041111111111, "longitude": 80.31421333333333, "speed": 0, "date": 1734062978948, "isoDate": "2024-12-13T04:09:38.948Z", "odoDistance": 39400.857484227985, "ignitionStatus": "OFF", "status": "OFF", "vehicleStatus": "PARKED", "address": "2.8 kms from Ward 10, Zone 1 Tiruvottiyur, Chennai, Chennai district, Tamil Nadu, India", "regNo": "TN12AR4716", "vehicleType": "TRAILER 20 FT", "vehicleId": "EGEwRm", "deviceId": "0355172100386299", "expiryDate": "2025-01-15", "onboardDate": "2023-01-23", "fuelLitre": 0, "bearing": 181, "serverTime": 1734063220967, "insideGeoFence": "N", "triggeredGeoFences": [], "rowId": 0 },
          { "latitude": 15.8446066, "longitude": 79.9667549, "speed": 40, "date": 1734063212000, "isoDate": "2024-12-13T04:13:32.000Z", "odoDistance": 78609.4011969736, "ignitionStatus": "ON", "status": "ON", "vehicleStatus": "MOVING", "address": "3.9 kms from Addanki, Prakasam District, Andhra Pradesh, India", "regNo": "TN28BH7546", "vehicleType": "TRAILER 20 FT", "vehicleId": "Hgld3H", "deviceId": "352592571393453", "expiryDate": "2025-01-18", "onboardDate": "2024-01-18", "fuelLitre": 328.99, "bearing": 297, "serverTime": 1734063220967, "insideGeoFence": "N", "triggeredGeoFences": [], "rowId": 1 },
          { "latitude": 15.83829, "longitude": 79.9695516, "speed": 41, "date": 1734063217000, "isoDate": "2024-12-13T04:13:37.000Z", "odoDistance": 73603.14437213384, "ignitionStatus": "ON", "status": "ON", "vehicleStatus": "MOVING", "address": "3.2 kms from Addanki, Prakasam District, Andhra Pradesh, India", "regNo": "TN28BH7544", "vehicleType": "TRAILER 20 FT", "vehicleId": "VzCOqG", "deviceId": "352592571393388", "expiryDate": "2025-01-18", "onboardDate": "2024-01-18", "fuelLitre": 305.91, "bearing": 345, "serverTime": 1734063220967, "insideGeoFence": "N", "triggeredGeoFences": [], "rowId": 2 },
          { "latitude": 15.812103333333333, "longitude": 79.97386777777778, "speed": 0, "date": 1734063192355, "isoDate": "2024-12-13T04:13:12.355Z", "odoDistance": 9564.91353311085, "ignitionStatus": "ON", "status": "ON", "vehicleStatus": "IDLE", "address": "0.3 kms from Addanki, Prakasam District, Andhra Pradesh, India", "regNo": "TN12AT7934", "vehicleType": "TRAILER 20 FT", "vehicleId": "L4Pq6q", "deviceId": "0867440068831908", "expiryDate": "2025-07-19", "onboardDate": "2024-07-19", "fuelLitre": 0, "bearing": 336, "serverTime": 1734063220967, "insideGeoFence": "N", "triggeredGeoFences": [], "rowId": 3 },
          { "latitude": 13.10251, "longitude": 80.10557722222222, "speed": 14, "date": 1734063213000, "isoDate": "2024-12-13T04:13:33.000Z", "odoDistance": 4883.771474987381, "ignitionStatus": "ON", "status": "ON", "vehicleStatus": "MOVING", "address": "1.4 kms from Ezhil Nagar, Thiruvallur district, Tamil Nadu, 600077, India", "regNo": "TN12Q3758", "vehicleType": "CAR", "vehicleId": "S5xyVT", "deviceId": "0867440067406181", "expiryDate": "2025-08-12", "onboardDate": "2024-08-12", "fuelLitre": 0, "bearing": 101, "serverTime": 1734063220967, "insideGeoFence": "N", "triggeredGeoFences": [], "rowId": 4 }
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

  const polylinePositions = vehicles.map(vehicle => [vehicle.latitude, vehicle.longitude]);

  return (
    <div className='p-0.5'>
      
      <MapContainer center={[15, 80]} zoom={7} style={{ height: '625px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map(vehicle => (
          <Marker key={vehicle.deviceId} position={[vehicle.latitude, vehicle.longitude]}>
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
        <Polyline positions={polylinePositions} color="black" />
      </MapContainer>
    </div>
  );
};


export default Map;