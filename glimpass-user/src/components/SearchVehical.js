import React, { useState } from 'react';
import '../styles/LocationPage.css';

const LocationPage = () => {
  const [location, setLocation] = useState('');

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const confirmLocation = () => {
    console.log('Location Confirmed:', location);
    // You would typically handle the location confirmation here
    // For example, making an API call or updating the app state
  };

  return (
    <div className="location-page">
      <header className="header">
        <div className="logo">GLIMPASS</div>
      </header>
      <main className="main-content">
        <h1>Welcome, Piyush Jaiswal</h1>
        <p>Where are you?</p>
        <div className="location-form">
          <select
            value={location}
            onChange={handleLocationChange}
            className="location-select"
          >
            <option value="" disabled>Select a Shop</option>
            {/* Map over your locations here */}
            {/* <option value="location1">Location 1</option> */}
          </select>
          <button onClick={confirmLocation} className="confirm-button">
            CONFIRM LOCATION
          </button>
        </div>
      </main>
    </div>
  );
};

export default LocationPage;
