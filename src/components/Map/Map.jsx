

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useParams } from "react-router-dom";
import 'leaflet/dist/leaflet.css';

const ambulanceIcon = new L.Icon({
  iconUrl: 'data:image/png;base64,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',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Map = () => {
  const [vehicles, setVehicles] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([15, 80]); // Default map center
  const { mmu } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let storedData = localStorage.getItem('vehicles');
        if (storedData) {
          setVehicles(JSON.parse(storedData));
        }

        const response = await fetch('https://app.gpstrack.in/api/get_current_data?token=projectmmu_7jkITDLjgki2HoR1OLtwqpcHSXPQs6Kz&email=projectmmu@ircstnb.org');
        if (response.ok) {
          const data = await response.json();
          if(data.response !== -1) {
            setVehicles(data);
            localStorage.setItem('vehicles', JSON.stringify(data));
          }
        } 
      } catch (error) {
        console.error('Error fetching data from API:', error);
        const storedData = localStorage.getItem('vehicles');
        if (storedData) {
          setVehicles(JSON.parse(storedData));
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 35000); // Fetch data every 35 seconds
    return () => clearInterval(interval);
  }, []);

  const mmuToRegNoMap = {
    1: "TC 2131 - KANIYAKUMARI", 
    2: "TC0789 KRISHNAGIRI ",
    3: "TC0192 - NILGIRIS ",
    4: "TC0791 - TENKASI",
    5: "TC0191 - TIRUNELVELI ",
    6: "TC0287 THOOTHUKUDI",
    7: "TC0790 - VIRUDHUNAGAR"
  };

  const regNoToShow = mmuToRegNoMap[mmu];
  const filteredVehicles = vehicles.filter(vehicle => vehicle.regNo === regNoToShow);
  const polylinePositions = filteredVehicles.length ? filteredVehicles.map(vehicle => [vehicle.latitude, vehicle.longitude]) : [];

  return (
    <div style={{ display: 'flex' }} className="h-full">
     
      <div style={{ width: '75%' }}>
        <MapContainer center={currentLocation} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

{filteredVehicles.length > 0 && filteredVehicles.map((vehicle) => (
  <Marker
    key={vehicle.deviceId}
    position={[vehicle.latitude, vehicle.longitude]}
    icon={ambulanceIcon}
  >
    <Popup autoClose={false} closeOnClick={false}>
      <div>
        <h3>{vehicle.regNo}</h3>
        <p>{vehicle.address}</p>
        <p>Status: {vehicle.vehicleStatus}</p>
        <p>Speed: {vehicle.speed} km/h</p>
        <p>Fuel: {vehicle.fuelLitre} litres</p>
        <p>Distance Traveled: {vehicle.odoDistance} km</p>
      </div>
    </Popup>
  </Marker>
))}

{vehicles.length > 0 && <Polyline positions={polylinePositions} color="black" />}
</MapContainer>
</div>
<div style={{ width: '25%', padding: '10px', overflowY: 'auto', borderRight: '1px solid #ccc' }}>
        <h2>Vehicle Details</h2>
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <div key={vehicle.deviceId} style={{ marginBottom: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px', padding: '10px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
              <h3>{vehicle.regNo}</h3>
              <p>{vehicle.address}</p>
              <p>Status: {vehicle.vehicleStatus}</p>
              <p>Speed: {vehicle.speed} km/h</p>
              <p>Fuel: {vehicle.fuelLitre} litres</p>
              <p>Distance Traveled: {vehicle.odoDistance} km</p>
            </div>
          ))
        ) : (
          <p>No vehicles found.</p>
        )}
      </div>

</div>
);
};

export default Map;