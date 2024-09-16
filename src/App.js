import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import RouteInfo from './components/RouteInfo';
import SearchForm from './components/SearchForm';

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>App tính toán đường đi (No API) v1.0</h1>
      </header>
      <main className="App-main">
        <div className="left-panel">
          <SearchForm 
            setOrigin={setOrigin} 
            setDestination={setDestination} 
            setRoute={setRoute}
          />
          <RouteInfo route={route} />
        </div>
        <div className="right-panel">
          <Map origin={origin} destination={destination} route={route} />
        </div>
      </main>
    </div>
  );
}

export default App;