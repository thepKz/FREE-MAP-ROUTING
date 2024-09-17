import axios from 'axios';
import React, { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';

function SearchForm({ setOrigin, setDestination, setRoute }) {
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [activeInput, setActiveInput] = useState(null);
  const [originSelected, setOriginSelected] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const [error, setError] = useState('');

  const originIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
  const destinationIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!originQuery || !destinationQuery) {
      setError('Vui lòng nhập điểm xuất phát và điểm đến');
      return;
    }

    try {
      const origin = await getCoordinates(originQuery);
      const destination = await getCoordinates(destinationQuery);

      if (!origin || !destination) {
        setError('Không tìm thấy địa điểm. Vui lòng thử lại.');
        return;
      }

      setOrigin(origin);
      setDestination(destination);

      const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`);
      const routeCoordinates = response.data.routes[0].geometry.coordinates;
      setRoute(routeCoordinates);
       // Trigger map zoom by updating the route state
       setRoute([...routeCoordinates]);
    } catch (error) {
      setError('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.');
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

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
    if (inputName === 'origin') {
      setOriginSelected(false);
    } else {
      setDestinationSelected(false);
    }
  };

  const handleOriginSelect = () => {
    setOriginSelected(true);
    setActiveInput(null);
  };

  const handleDestinationSelect = () => {
    setDestinationSelected(true);
    setActiveInput(null);
  };

  return (
    <form onSubmit={handleSearch}>
      <AddressAutocomplete
        value={originQuery}
        onChange={setOriginQuery}
        placeholder="Điểm xuất phát"
        onFocus={() => handleInputFocus('origin')}
        onSelect={handleOriginSelect}
        showSuggestions={activeInput === 'origin' && !originSelected}
        iconUrl={originIconUrl}
      />
      <AddressAutocomplete
        value={destinationQuery}
        onChange={setDestinationQuery}
        placeholder="Điểm đến"
        onFocus={() => handleInputFocus('destination')}
        onSelect={handleDestinationSelect}
        showSuggestions={activeInput === 'destination' && !destinationSelected}
        iconUrl={destinationIconUrl}
      />
            <button type="submit" className="search-button">Tìm đường</button>
            {error && <div className="error-message">{error}</div>}
    </form>
  );
}

export default SearchForm;