import React from 'react';

function RouteInfo({ route }) {
  if (!route) return null;

  const distance = calculateDistance(route);
  const duration = estimateDuration(distance);

  return (
    <div className="route-info">
      <h3>Thông tin tuyến đường:</h3>
      <p>Khoảng cách: {distance.toFixed(2)} km</p>
      <p>Thời gian ước tính: {formatDuration(duration)}</p>
    </div>
  );
}

function calculateDistance(route) {
  let distance = 0;
  for (let i = 1; i < route.length; i++) {
    const [lon1, lat1] = route[i - 1];
    const [lon2, lat2] = route[i];
    distance += getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
  }
  return distance;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}
// Function to convert degrees to radians
// This is necessary because trigonometric functions in JavaScript work with radians

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function estimateDuration(distance) {
  const averageSpeed = 30; // km/h, giảm tốc độ trung bình xuống để ước tính chính xác hơn
  return (distance / averageSpeed) * 60; // minutes
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours} giờ ${mins} phút`;
}

export default RouteInfo;