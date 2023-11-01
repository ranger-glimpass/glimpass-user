import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/glimpassLogo.png";
import atm from "../assets/atm.png";
import gate from "../assets/gate.png";
import bathroom from "../assets/bathroom.png";
import close from "../assets/close.png";
import nearby from "../assets/nearby.png";
//import Fab from '@mui/material/Fab';
import RestroomIcon from "@mui/icons-material/Wc"; // Assuming you want to use the WC icon for the restroom
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SearchBox from './SearchBox'
import LoadingSpinner from './LoadingSpinner'

import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  IconButton,
  CardActionArea,
  AppBar,
  Toolbar,
  Autocomplete,
  TextField,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import { Bathroom } from "@mui/icons-material";

const ShopList = (props) => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [activeCard, setActiveCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShop, setSelectedShop] = useState(null); // <-- Add this state variable
  const [isExpanded, setIsExpanded] = useState(false);

  const [openModal, setOpenModal] = useState(false);
const [selectedShopDetails, setSelectedShopDetails] = useState(null);
  const [frequencyMap, setFrequencyMap] = useState(null);
  
  const location = useLocation();


  const handleNavigateClick = async(shopId) => {
    setActiveCard(shopId);
    const email = sessionStorage.getItem('email');
    const name = sessionStorage.getItem('name');
    const response = await fetch('https://app.glimpass.com/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {email, name} ),
    });
    const data = await response.json();
    sessionStorage.setItem('_id', data[0].user._id);
    console.log(data,"register");
    const endNodeName = null;
    setTimeout(() => {
      navigate("/dashboard", { state: { destinationShopId: shopId, market: location.state?.market } });
    }, 300); // Delay for the fade-out effect
  };

  const getAllNodes = async () => {
    const response = await fetch("https://app.glimpass.com/graph/get-all-nodes-by-market", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            market: location.state?.market,
          })
          // Add any necessary body data for the POST request
        });
    const data = await response.json();
    const shopsArray = Object.values(data);
    setShops(shopsArray);
    console.log(shops, "shops fetched!")
    const shopFrequency = {};
  shopsArray.forEach(shop => {
    if (shopFrequency[shop.name]) {
      shopFrequency[shop.name] += 1; // Increment if already exists
    } else {
      shopFrequency[shop.name] = 1; // Initialize with 1
    }
  });
  setFrequencyMap(shopFrequency);
  console.log(shopFrequency); // Here you have your hashmap with shop frequencies
    setIsLoading(false); // Set loading to false once data is fetched
  };

  const handle = (shopId) => {
    const selectedShop = shops.find(shop => shop.nodeId === shopId);
    setSelectedShopDetails(selectedShop);
    setOpenModal(true);
  }
  useEffect(() => {
    getAllNodes();
  }, []);

  const [viewMode, setViewMode] = useState("shop");

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
      <div><LoadingSpinner /></div>
      <h3>Hang On!</h3>
      <h4>Getting shops in the market...</h4>
    </Box>
    );
  }

  

  const handleNavigateButtonClick = () => {
    if (selectedShop) {
      handleNavigateClick(selectedShop.nodeId);
    } else {
      alert("Please select a shop first.");
    }
  };

  

  const filteredShops = selectedShop
    ? shops.filter((shop) => shop.nodeId === selectedShop.nodeId)
    : shops;

  const handleExpandClick = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Container>
  <AppBar position="fixed" elevation={0} sx={{ height: 64 }}>
    <Toolbar
        sx={{
            justifyContent: "space-between", // Adjust this to space-between
            minHeight: "64px",
            pr: 2,
            pl: 2,
        }}
    >

<SearchBox
data={shops}
onShopSelected={(selectedShop) => {
  handle(selectedShop); // set the details for the selected shop
  }}
/>
        <Typography
            variant="h6" // This makes the text bold
            sx={{ 
                display: { xs: 'contents', sm: 'block' }, // Hide on smaller screens
                whiteSpace: 'nowrap', // Prevent wrapping to the next line
                overflow: 'hidden',
                textOverflow: 'ellipsis', // Add ellipsis for long names
                maxWidth: '20%', // Adjust this width as needed
                pl: '10px',
                fontSize: '1rem',
                marginRight: '2px'
            }}
        >
            Hello, {sessionStorage.getItem('name') || 'Guest'}!
        </Typography>
    </Toolbar>
</AppBar>
<div>
<SearchBox
data={shops}
/>
  
</div>

      <br></br>
      <Box
        sx={{ opacity: `${isExpanded ? "0.2" : "1"}` }}
        mt={4}
        px={{ xs: 2, sm: 4 }}
      >
        {filteredShops
          .filter((shop) => shop.nodeType === "shop")
          .map((shop, index) => {
            if (viewMode === "deals" && !shop.discount) {
              return null;
            }

            return (
              <Card
                key={shop.nodeId}
                sx={{
                  mb: 2,
                  boxShadow: 1,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 1,
                  mx: { xs: 0, sm: 2 },
                }}
               // onClick={() => handleNavigateClick(shop.nodeId)}
              >
                <CardActionArea
                  sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}
    onClick={() => handle(shop.nodeId)}

                >
                  {shop && (
                    <CardMedia
                      component="img"
                      image={logo}
                      alt={shop.name}
                      sx={{
                        width: 80,
                        height: "auto",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {shop.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Category: {shop.category?.join(", ")}
                    </Typography>
                    {shop.discount && (
                      <Box display="flex" alignItems="center" mt={1}>
                        <IconButton
                          color="primary"
                          aria-label="Discount"
                          size="small"
                        >
                          <DiscountIcon />
                        </IconButton>
                        <Typography variant="body2" color="textSecondary">
                          Discount: {shop.discount}
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      {shop.subType}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                {/* <Box sx={{ p: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleNavigateClick(shop.nodeId)}
                  >
                    Navigate
                  </Button>
                </Box> */}
              </Card>
            );
          })}
      </Box>

      {/* <Button
    variant="contained"
    color="primary"
    sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
    }}
    onClick={() => navigate('/dashboard', { state: { destinationShopId: "nearestWashroom" } })}
>
    Nearest Washroom
</Button> */}
      {/* <img 
    src="https://iconape.com/wp-content/files/jl/339960/png/restroom-sign-logo.png"
    alt="Nearest Washroom" 
    style={{
        width: '80px', // or whatever size you want
        height: '80px',
        borderRadius: '50%', // to ensure it's circular
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        cursor: 'pointer'
    }}
    onClick={() => navigate('/dashboard', { state: { destinationShopId: "nearestWashroom" } })}
/> */}
      <Box
        sx={{
          position: "fixed",
          bottom: 50,
          right: 16,
          transition: "all 0.3s",
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
        }}
      >
        {isExpanded && (
          <>
            <IconButton
              onClick={() =>
                navigate("/dashboard", {
                  state: {endNodeName: null, destinationShopId: "nearestWashroom", market: location.state?.market },
                })
              }
            >
              <img
                src={bathroom}
                alt="Nearest Washroom"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0%",
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                /* Handle navigation to main gate */
              }}
            >
              <img
                src={gate}
                alt="Main Gate"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0%",
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                /* Handle navigation to ATM */
              }}
            >
              <img
                src={atm}
                alt="ATM"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "0%",
                }}
              />
            </IconButton>
            {/* Add more buttons as needed */}
          </>
        )}
        <IconButton onClick={handleExpandClick}>
          <img
            src={isExpanded ? close : nearby}
            alt={isExpanded ? "Close" : "Expand"}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
            }}
          />
        </IconButton>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
    <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h6" component="div">
            {selectedShopDetails?.name}
        </Typography>
    </DialogTitle>
    <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
            <CardMedia
                component="img"
                image={logo} // Replace with selectedShopDetails?.image or similar
                alt={selectedShopDetails?.name}
                sx={{
                    width: '80%',
                    height: 'auto',
                    borderRadius: '15px',
                    mb: 2
                }}
            />
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Floor: {selectedShopDetails?.floor}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Category: {selectedShopDetails?.category?.join(", ")}
            </Typography>
            {/* Add more details as needed */}
        </Box>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
        <Button variant="outlined" onClick={() => setOpenModal(false)} color="primary" sx={{ mr: 2 }}>
            Cancel
        </Button>
        <Button 
            variant="contained"
            onClick={() => {
              const destinationNodeId = selectedShopDetails?.nodeId;
              if(selectedShopDetails?.nearby){
                destinationNodeId = selectedShopDetails?.nearby;
              }
              const selectedShop = shops.find(shop => shop.nodeId === destinationNodeId);
              let endNodeName = null;
              if(frequencyMap[selectedShop.name] > 1){
                endNodeName = selectedShop.name;
              }
              navigate("/dashboard", { state: {endNodeName: endNodeName, destinationShopId: destinationNodeId, market: location.state?.market } });
              setOpenModal(false);
            }} 
            color="primary"
        >
            Navigate
        </Button>
    </DialogActions>
</Dialog>

    </Container>

    
  );
};

export default ShopList;
