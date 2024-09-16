import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

function AddressAutocomplete({ value, onChange, placeholder, onFocus, onSelect, showSuggestions, iconUrl }) {
  const [suggestions, setSuggestions] = useState([]);
  const [localShowSuggestions, setLocalShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setLocalShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value.length > 2 && showSuggestions) {
      const delayDebounceFn = setTimeout(() => {
        axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`)
          .then(response => {
            const uniqueSuggestions = response.data.filter((item, index, self) =>
              index === self.findIndex((t) => t.display_name === item.display_name)
            );
            setSuggestions(uniqueSuggestions);
            setLocalShowSuggestions(true);
          })
          .catch(error => console.error('Error fetching suggestions:', error));
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setLocalShowSuggestions(false);
    }
  }, [value, showSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.display_name);
    onSelect();
    setLocalShowSuggestions(false);
  };

  const formatSuggestion = (suggestion) => {
    const parts = suggestion.display_name.split(', ');
    return (
      <>
        <strong>{parts[0]}</strong>
        <br />
        <small>{parts.slice(1).join(', ')}</small>
      </>
    );
  };

  return (
    <div className="address-autocomplete" ref={wrapperRef}>
      <div className="input-with-icon">
        {iconUrl && <img src={iconUrl} alt="location icon" className="location-icon" />}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => {
            onFocus();
            setLocalShowSuggestions(true);
          }}
        />
      </div>
      {localShowSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {formatSuggestion(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AddressAutocomplete;