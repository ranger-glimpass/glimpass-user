import { useLocation, useNavigate } from 'react-router-dom';
//import shops from '../data/shops';
import { useState, useEffect } from 'react';
import { Box, Button, Modal } from "@mui/material";

const Dashboard = () => {
    const location = useLocation();
    const destinationShopId = location.state.destinationShopId;
    const [open, setOpen] = useState(false);
    const [shops, setShops] = useState([]); // Initialize shops as an empty array


    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "95%",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };
    const [currentLocation, setCurrentLocation] = useState(null);
    const navigate = useNavigate();

    const handleMotion = () => { };
    const handleOrientation = () => { };


    useEffect(() => {
        const fetchShops = async () => {
            const response = await fetch("https://app.glimpass.com/graph/get-all-nodes");
            const data = await response.json();
            const shopsArray = Object.values(data).filter(item => item.nodeType === "shop"); // Filter only shops
            setShops(shopsArray);
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
        navigate('/navigation', { state: { currentLocation, destinationShopId } });
    };

    return (
        <>
           
            {open&& <Box sx={{ ...style }}> <h2 id="parent-modal-title">Please calibrate yourself</h2>
                <p id="parent-modal-description">Go to {shops.find(shop => shop.nodeId === currentLocation)?.name || 'the selected location'}. Open your compass app , face towards north and press calibrate button. </p>
                 
            <Button variant="outlined" onClick={requestPermission}> Calibrate </Button></Box> }

            <div>
                <h2>Select your current location:</h2>
                <select onChange={(e) => setCurrentLocation(e.target.value)}>
                    {shops.map(shop => (
                        <option key={shop.nodeId} value={shop.nodeId}>{shop.name}</option>
                    ))}
                </select>
                <button onClick={() => { setOpen(true) }}>
                    I'm Here.
                </button>
            </div>
        </>
    );
}

export default Dashboard;
