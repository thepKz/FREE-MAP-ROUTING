import axios from 'axios';
import React, { useEffect, useState } from 'react';

function AddressAutocomplete({ value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`)
          .then(response => {
            setSuggestions(response.data);
            setShowSuggestions(true);
          })
          .catch(error => console.error('Error fetching suggestions:', error));
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="address-autocomplete">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressAutocomplete;