import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Modal,
  CircularProgress,
  Autocomplete,
  Select,
  MenuItem,
  Typography,
  Container,
  TextField,
} from "@mui/material";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

import facingToShop from '../assets/facingToShop.gif';
import goingToShop from '../assets/goingToShop.gif';


const Dashboard = () => {
  const location = useLocation();
  const destinationShopId = location.state.destinationShopId;
  const [open, setOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // <-- Add this state for search term

  const navigate = useNavigate();

  const handleMotion = () => {};
  const handleOrientation = () => {};


  const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide === 0) {
            setCurrentSlide(1);
        } else {
            requestPermission();
        }
    };

    const handlePrevious = () => {
        setCurrentSlide(0);
    };

  useEffect(() => {
    const fetchShops = async () => {
      const response = await fetch(
        "https://app.glimpass.com/graph/get-all-nodes"
      );
      const data = await response.json();
      const shopsArray = Object.values(data);
      setShops(shopsArray);
      setIsLoading(false);
    };

    fetchShops();
  }, []);


  const [updatedDestinationShopId, setUpdatedDestinationShopId] = useState(destinationShopId);

  useEffect(() => {
    const fetchUpdatedDestination = async () => {
      if (destinationShopId === "nearestWashroom") {
        const response = await fetch("https://app.glimpass.com/user/get-nearest-washroom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodeId: currentLocation?.nodeId,
          })
          // Add any necessary body data for the POST request
        });
        const data = await response.json();
        setUpdatedDestinationShopId(data._id);
        //destinationShopId = updatedDestinationShopId;
        console.log("current id :", currentLocation?.nodeId);
        console.log("Destination Shop ID from different API:", data._id);
        console.log("DestinationShopID from different API:", destinationShopId);
      }
    };
  
    fetchUpdatedDestination();
  }, [destinationShopId, currentLocation]);
  

  const requestPermission = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            window.addEventListener("devicemotion", handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("devicemotion", handleMotion);
    }
    navigate("/navigation", {
      state: {
        currentLocation: currentLocation?.nodeId,
        destinationShopId: updatedDestinationShopId,
        calibratedShopAngle: currentLocation?.shop_angle || 0,
      },
    });
  };
  console.log(currentLocation, "manish");
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box mt={4} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" gutterBottom>
          Where are you at?
        </Typography>

        <Box mt={2} width="100%">
          <Autocomplete
            fullWidth
            options={shops}
            getOptionLabel={(option) => option.name}
            value={currentLocation?.nodeId}
            onChange={(event, newValue) => setCurrentLocation(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select a Shop" variant="outlined" />
            )}
          />
        </Box>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            I'm here!
          </Button>
        </Box>

       

        <Modal open={open} onClose={() => setOpen(false)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "95%",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" id="modal-title">
                    Calibration Required
                </Typography>
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={false}
                    selectedItem={currentSlide}
                    showArrows={false}
                >
                    <div>
                        <img src={goingToShop} alt="Step 1" />
                        <Typography variant="body2" id="modal-description" gutterBottom>
                            <b>Step 1:</b>  Go to the {currentLocation?.name}.
                        </Typography>
                    </div>
                    <div>
                        <img src={facingToShop} alt="Step 2" />
                        <Typography variant="body2" id="modal-description" gutterBottom>
                            <b>Step 2:</b>  Face towards the shop: {currentLocation?.name}.
                        </Typography>
                    </div>
                </Carousel>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    {currentSlide === 1 && (
                        <Button variant="text" onClick={handlePrevious}>
                            &lt; Previous
                        </Button>
                    )}
                    <Button variant="outlined" onClick={handleNext} style={{ marginTop: '20px' }}>
                        {currentSlide === 0 ? 'Next' : 'Calibrate'}
                    </Button>
                </Box>
            </Box>
        </Modal>

      </Box>
    </Container>
  );
};

export default Dashboard;
