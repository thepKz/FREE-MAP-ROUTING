import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapController({ origin, destination, route }) {
  const map = useMap();

  useEffect(() => {
    if (origin && destination && route) {
      const bounds = L.latLngBounds([origin, destination]);
      route.forEach(point => bounds.extend(L.latLng(point[1], point[0])));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, origin, destination, route]);

  return null;
}

function Map({ origin, destination, route }) {
  const center = [10.8415, 106.8099]; // Default coordinates

  const originIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='This is created by Minthep'
      />
      {origin && <Marker position={[origin.lat, origin.lon]} icon={originIcon} />}
      {destination && <Marker position={[destination.lat, destination.lon]} icon={destinationIcon} />}
      {route && <Polyline positions={route.map(point => [point[1], point[0]])} color="blue" />}
      <MapController origin={origin} destination={destination} route={route} />
    </MapContainer>
  );
}

export default Map;