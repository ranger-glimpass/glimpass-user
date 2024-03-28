import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, List, ListItem, Paper, Modal } from '@mui/material';
import '../styles/SearchVehicle.css';
import goToQR from '../assets/goToQR.gif'
import * as apiService from '../apiService'; // Adjust the import path as necessary


const SearchVehicle = () => {
  const [query, setQuery] = useState('');
  const [carSelected, setCarSelected] = useState('');
  const [cars, setCars] = useState([]);
  const [qrPlaced, setQrPlaced] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openCalibrationModal, setOpenCalibrationModal] = useState(false); // State for calibration modal visibility

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      const market = location.state?.market;
      if (market) {
        try {
          // const response = await fetch('https://app.glimpass.com/graph/get-car-by-number', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ market }),
          // });
          const response = await apiService.getCarByNumber(market);
          const data = await response.data;
          setCars(data.camera);
          setQrPlaced(data.qrCode);
        } catch (error) {
          console.error('Failed to fetch cars:', error);
        }
      }
    };

    fetchCars();
  }, [location.state?.market]);

  const filteredCars = query ? cars.filter(car => car.carNumber.toLowerCase().includes(query.toLowerCase())) : [];

  useEffect(() => {
    setShowDropdown(!!query && filteredCars.length > 0);
  }, [query, filteredCars.length]);

  const handleSelectCar = (car) => {
    setCarSelected(car);
    setQuery(car.carNumber);
    setShowDropdown(false);
  };

  // const handleCarDestination = () => {
  //   // Request permission for device orientation before navigating
  //   requestPermission().then(() => {
  //     const endNodesList = [carSelected.nodeId];
  //     navigate("/dashboard", {
  //       state: {
  //         endNodesList: endNodesList,
  //         destinationShopId: carSelected.nodeId,
  //         market: location.state?.market,
  //       },
  //     });
  //   }).catch(console.error);
  // };

  const modalCheck = () => {
    if (sessionStorage.getItem('currentLocation')) {
      // Navigate to navigation component if currentLocation exists
      setOpenCalibrationModal(true);
    } else {
      // Navigate to dashboard as fallback
      navigateToDashboard(carSelected);
    }
  };
  const handleCarDestination = () => {
    if (sessionStorage.getItem('currentLocation')) {
      // Navigate to navigation component if currentLocation exists
      navigateToNavigation(carSelected);
    } else {
      // Navigate to dashboard as fallback
      navigateToDashboard(carSelected);
    }
  };

  const navigateToNavigation = (carSelected) => {
    requestPermission().then(() => {
    const endNodesList = [carSelected.nodeId];
    const calibratedShopAngle = qrPlaced.find(qrCode => qrCode._id === sessionStorage.getItem('currentLocation')).shop_angle;
    navigate("/navigation", {
      state: {
        currentLocation: sessionStorage.getItem('currentLocation'),
        destinationShopId: carSelected.nodeId,
        endNodesList: endNodesList,
        market: location.state?.market,
        calibratedShopAngle: calibratedShopAngle, // Placeholder, adjust as necessary
      },
    });
    
  }).catch(console.error);
  };
  

  const navigateToDashboard = (carSelected) => {
    
      const endNodesList = [carSelected.nodeId];
      navigate("/dashboard", {
        state: {
          endNodesList: endNodesList,
          destinationShopId: carSelected.nodeId,
          market: location.state?.market,
        },
      });
  };
  // Function to request permission for device orientation (for iOS 13+)
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        // Permission granted
        // Here you could also initialize device orientation or motion listeners
        console.log('DeviceOrientation permission granted.');
      } else {
        throw new Error('DeviceOrientation permission not granted.');
      }
    }
    // For non-iOS 13 devices, or if the browser doesn't support permissions
    return Promise.resolve();
  };

  // Modal for calibration guide
  const calibrationModal = (
    <Modal open={openCalibrationModal} onClose={() => setOpenCalibrationModal(false)}>
      <Box sx={{
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 400, 
        bgcolor: 'background.paper', 
        border: '2px solid #000', 
        boxShadow: 24, 
        p: 4,
        display: 'flex', // Make Box a flex container
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center', // Center-align children horizontally
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
          Device Calibration Required
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'center' }}>
          {/* Ensure the image is also centered by removing inline styles */}
          <img src={goToQR} alt="Calibration" style={{ width:'200px', height: '354px' }} /><br />
          Please face toward the QR to calibrate your device.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}> {/* Center the button horizontally */}
          <Button onClick={() => handleCarDestination()}>Calibrate</Button>
        </Box>
      </Box>
    </Modal>
  );
  

  return (
    <div className="location-page">
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
          onClick={() => {
            modalCheck(); // Open calibration modal before navigating
          }}
        >
          Find my vehicle
        </Button>
      </div>
      {calibrationModal}
    </div>
  );
};

export default SearchVehicle;
