import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Modal, CircularProgress, Autocomplete, Select, MenuItem, Typography, Container, TextField } from "@mui/material";

const Dashboard = () => {
    const location = useLocation();
    const destinationShopId = location.state.destinationShopId;
    const [open, setOpen] = useState(false);
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // <-- Add this state for search term

    const navigate = useNavigate();

    const handleMotion = () => { };
    const handleOrientation = () => { };

    useEffect(() => {
        const fetchShops = async () => {
            const response = await fetch("https://app.glimpass.com/graph/get-all-nodes");
            const data = await response.json();
            const shopsArray = Object.values(data);
            setShops(shopsArray);
            setIsLoading(false);
        };

        fetchShops();
    }, []);

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
        navigate('/navigation', { state: { currentLocation: currentLocation?.nodeId, destinationShopId } });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress /> 
            </Box>
        );
    }

   
    const filteredShops = shops.filter(shop => shop.name.toLowerCase().includes(searchTerm.toLowerCase()));


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
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                        Confirm Location
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
                        <Typography variant="body2" id="modal-description" gutterBottom>
                            Please align yourself towards the North at {currentLocation?.name || 'the selected location'} and then press the calibrate button.
                        </Typography>
                        <Button variant="outlined" onClick={requestPermission}>
                            Calibrate
                        </Button>
                    </Box>
                </Modal>

            </Box>
        </Container>
    );
}

export default Dashboard;

