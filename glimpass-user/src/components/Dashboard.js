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
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

import facingToShop from "../assets/facingToShop.gif";
import goingToShop from "../assets/goingToShop.gif";
import CountdownButton from "./CountdownButton";
import SearchBox from "./SearchBox";
import LoadingSpinner from "./LoadingSpinner";
import glimpassLogo from "../assets/glimpassLogo.png";

const themeStyles = {
  primary: "#1976d2", // Primary color
  secondary: "#8F8F8F", // Secondary color
  background: "#FFFFFF", // Background color
  textPrimary: "#000000", // Primary text color
  textSecondary: "#575757", // Secondary text color
};
const Dashboard = () => {
  const location = useLocation();
  const destinationShopId = location.state.destinationShopId;
  const endNodesList = location.state.endNodesList;
  const market = location.state?.market;
  const [open, setOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [updatedDestinationShopId, setUpdatedDestinationShopId] = useState(destinationShopId);



  const navigate = useNavigate();
  console.log(endNodesList, "endNodesList");
  const handleMotion = () => {};
  const handleOrientation = () => {};

  const [currentSlide, setCurrentSlide] = useState(0);

  // useEffect(()=>{
  //   if(!sessionStorage.getItem('email')){
  //     navigate('/login');
  //   }
  //   if(destinationShopId == null){
  //     navigate('/shops');
  //   }
  // },[destinationShopId])
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

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://app.glimpass.com/graph/get-all-nodes-by-market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ market }),
      });
      const data = await response.json();
      setShops(Object.values(data).filter(shop => shop?.entryType !== "multientry"));
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchShops();
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [market]);

  useEffect(() => {
    if (destinationShopId === "nearestWashroom" && location.state.clickedItem) {
      setIsButtonActive(false);
      fetchNearestWashroom();
    }
  }, [destinationShopId, currentLocation]);

  const fetchNearestWashroom = async () => {
    try {
      const payload = { nodeId: currentLocation?.nodeId };
      if (location?.state?.clickedItem) {
        payload.nodeType = location.state.clickedItem;
      }
      const response = await fetch("https://app.glimpass.com/user/get-nearest-washroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setUpdatedDestinationShopId(data._id);
    } catch (error) {
      console.error("Error fetching nearest washroom:", error);
    }
    // console.log("current id :", currentLocation?.nodeId);
    // console.log("Destination Shop ID from different API:", data._id);
    // console.log("DestinationShopID from different API:", destinationShopId);
    setIsButtonActive(true);
  };


  const requestPermission = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            window.addEventListener("devicemotion", handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("devicemotion", handleMotion);
    }

    const currentLocationId = currentLocation?.nodeId;
    if (currentLocation?.nearby) {
      currentLocationId = currentLocation?.nearby;
    }
    navigate("/navigation", {
      state: {
        currentLocation: currentLocationId,
        destinationShopId: updatedDestinationShopId,
        endNodesList: endNodesList,
        calibratedShopAngle: currentLocation?.shop_angle || 0,
        market: market,
      },
    });
  };
  console.log(currentLocation, "currentLocation");
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        {/* Replace CircularProgress with your custom spinner */}
        <div>
          <LoadingSpinner />
        </div>
        <h3>Hang On!</h3>
        <h4>Finding your location...</h4>
      </Box>
    );
  }

  const checkFill = () => {
    if (currentLocation) {
      setOpen(true);
    }
  };

  return (
    <>
      <Container style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <img
            src={glimpassLogo}
            alt="Logo"
            style={{ maxWidth: "150px", height: "auto" }}
          />
        </div>

        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: themeStyles.primary,
              textAlign: "center",
            }}
          >
            Welcome, {sessionStorage.getItem("name")}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: themeStyles.textSecondary,
              my: 2,
              textAlign: "center",
            }}
          >
            Where are you?
          </Typography>

          <SearchBox
            data={shops}
            value={currentLocation}
            onChange={setCurrentLocation}
            onShopSelected={setCurrentLocation}
            sx={{ width: "100%", mt: 2 }}
          />

<Button
  variant="contained"
  sx={{
    mt: 2,
    bgcolor: isButtonActive ? themeStyles.primary : themeStyles.secondary,
    "&:hover": { bgcolor: isButtonActive ? themeStyles.primary : themeStyles.secondary },
    borderRadius: 20,
    px: 3,
    py: 1,
    color: isButtonActive ? 'white' : 'black' // Optional: change text color too
  }}
  onClick={() => checkFill()}
  disabled={!isButtonActive} // Optional: disable the button click when grey
>
  Confirm Location
</Button>


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
                  <Typography
                    variant="body2"
                    id="modal-description"
                    gutterBottom
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      lineHeight: "1.5",
                    }}
                  >
                    <b>Step 1:</b> Go to the {currentLocation?.name}.
                  </Typography>
                </div>
                <div>
                  <img src={facingToShop} alt="Step 2" />
                  <Typography
                    variant="body2"
                    id="modal-description"
                    gutterBottom
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      lineHeight: "1.5",
                    }}
                  >
                    <b>Step 2:</b> Face towards the shop:{" "}
                    {currentLocation?.name}.
                  </Typography>
                </div>
              </Carousel>
              <Box display="flex" justifyContent="space-between" mt={2}>
                {currentSlide === 1 && (
                  <Button variant="text" onClick={handlePrevious}>
                    &lt; Previous
                  </Button>
                )}
                <CountdownButton
                  handlePrevious={handleNext}
                  buttonText={currentSlide === 0 ? "Next" : "Calibrate"}
                />
              </Box>
            </Box>
          </Modal>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
