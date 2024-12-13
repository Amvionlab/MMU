import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://app.fleettrack.co.in/api/get_current_data?token=karunakaran_24iqi2T21dq2Ud1Kb9g0CPaUCo1lLzml&email=karunakaran1307@gmail.com');
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
          console.error('Expected an array from the API', data);
        }
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Fleet Map</h1>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Array.isArray(vehicles) && vehicles.map(vehicle => (
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
      </MapContainer>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;