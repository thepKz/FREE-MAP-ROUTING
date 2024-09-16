import axios from 'axios';
import React, { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';

function SearchForm({ setOrigin, setDestination, setRoute }) {
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const origin = await getCoordinates(originQuery);
      const destination = await getCoordinates(destinationQuery);

      if (origin && destination) {
        setOrigin(origin);
        setDestination(destination);

        const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`);
        setRoute(response.data.routes[0].geometry.coordinates);
      }
    } catch (error) {
      console.error('Error searching for locations:', error);
    }
  };

  const getCoordinates = async (query) => {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    if (response.data && response.data.length > 0) {
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        display_name: response.data[0].display_name
      };
    }
    return null;
  };

  return (
    <form onSubmit={handleSearch}>
      <AddressAutocomplete
        value={originQuery}
        onChange={setOriginQuery}
        placeholder="Điểm xuất phát"
      />
      <AddressAutocomplete
        value={destinationQuery}
        onChange={setDestinationQuery}
        placeholder="Điểm đến"
      />
      <button type="submit">Tìm đường</button>
    </form>
  );
}

export default SearchForm;