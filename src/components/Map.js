import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Map({ origin, destination, route }) {
  const center = [10.8415, 106.8099]; // Tọa độ mặc định (có thể thay đổi)

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {origin && <Marker position={[origin.lat, origin.lon]} />}
      {destination && <Marker position={[destination.lat, destination.lon]} />}
      {route && <Polyline positions={route.map(point => [point[1], point[0]])} color="blue" />}
    </MapContainer>
  );
}

export default Map;