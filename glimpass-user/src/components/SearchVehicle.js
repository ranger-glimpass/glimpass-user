import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, List, ListItem, Paper } from '@mui/material';
import '../styles/SearchVehicle.css';

const SearchVehicle = () => {
  const [query, setQuery] = useState('');
  const [carSelected, setCarSelected] = useState('');
  const [cars, setCars] = useState([]);
  
  const [showDropdown, setShowDropdown] = useState(false); // State to control the visibility of the dropdown
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      const market = location.state?.market;
      if (market) {
        try {
          const response = await fetch('https://app.glimpass.com/graph/get-car-by-number', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ market }),
          });
          const data = await response.json();
          setCars(data); // Assuming the response returns an array of cars
        } catch (error) {
          console.error('Failed to fetch cars:', error);
        }
      }
    };

    fetchCars();
  }, [location.state?.market]);

  // Filter cars based on the query
  const filteredCars = query ? cars.filter(car => 
    car.carNumber.toLowerCase().includes(query.toLowerCase())
  ) : [];

  // Whenever the query changes and there are filtered results, show the dropdown
  useEffect(() => {
    if (query && filteredCars.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [query, filteredCars.length]);

  const handleSelectCar = (car) => {
    setCarSelected(car);
    setQuery(car.carNumber);
    setShowDropdown(false); // Hide the dropdown when a car is selected
  };

  const handleCarDestination = (carSelected) => {
    const endNodesList = [carSelected.nodeId];
    navigate("/dashboard", {
      state: {
        endNodesList: endNodesList,
        destinationShopId: carSelected.nodeId,
        market: location.state?.market,
      },
    });
  };


  return (
    <div className="location-page">
      {/* Header and welcome message */}
      <header className="header">
        <div className="logo">Glimpark+</div>
      </header>
     
      <Typography variant="h4" gutterBottom>Welcome, {sessionStorage.getItem('name')}</Typography>
       
      <div style={{ position: 'relative', width: '100%' }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Enter license plate no."
          autoComplete="off"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {showDropdown && (
          <Paper style={{ maxHeight: 200, overflow: 'auto', position: 'absolute', width: '100%', zIndex: 1 }}>
            <List>
              {filteredCars.map((car, index) => (
                <ListItem 
                  key={car._id} 
                  button 
                  onClick={() => handleSelectCar(car)}
                  style={{ backgroundColor: index % 2 ? '#fafafa' : '#ffffff' }}
                >
                  {car.carNumber}
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          onClick={() => handleCarDestination(carSelected)}
        >
          Find my vehicle
        </Button>
      </div>
    </div>
  );
};

export default SearchVehicle;
