import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/glimpassLogo.png";
import atm from "../assets/atm.png";
import parking from "../assets/parking.jpg";
import gate from "../assets/gate.png";
import bathroom from "../assets/bathroom.png";
import close from "../assets/close.png";
import nearby from "../assets/nearby.png";
//import Fab from '@mui/material/Fab';
import RestroomIcon from "@mui/icons-material/Wc"; // Assuming you want to use the WC icon for the restroom
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SearchBox from "./SearchBox";
import LoadingSpinner from "./LoadingSpinner";
import searchIcon from "../assets/searchIcon.png";
import ambienceShops from "../data/ambienceWithCategory.js";
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
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import { Bathroom, Margin, NoAccounts } from "@mui/icons-material";
import defaultDP from "../assets/defaultDP.png";
import Chip from "@mui/material/Chip";


const cardStyle = {
  // New card style to match UI design provided
  boxShadow: "none", // Remove shadow for a flatter design
  marginBottom: "10px", // Spacing between cards
  borderRadius: "10px", // Rounded corners like in the UI image
  border: "1px solid #e0e0e0", // Light border as in UI image
  overflow: "hidden", // Ensure nothing spills out of the card border radius
};
const chipStyle = {
  color: "white", // Text color
  border: "1px solid #e0e0e0", // Light grey border for minimalism
  boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  //fontWeight: 'bold', // Optional: if you want the text to be bold
  borderRadius: "0px", // Makes the Chip square
  padding: "0px 2px", // Adjust padding to your preference
  backgroundColor: "#7e97f2", // White background to blend with the card
};

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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showSearch, setShowSearch] = React.useState(false);
  const location = useLocation();

  const handleNavigateClick = async (shopId) => {
    setActiveCard(shopId);
    const email = sessionStorage.getItem("email");
    const name = sessionStorage.getItem("name");
    const response = await fetch("https://app.glimpass.com/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    const data = await response.json();
    sessionStorage.setItem("_id", data[0].user._id);
    console.log(data, "register");
    const endNodeName = null;
    setTimeout(() => {
      navigate("/dashboard", {
        state: { destinationShopId: shopId, market: location.state?.market },
      });
    }, 300); // Delay for the fade-out effect
  };

  const getAllNodes = async () => {
    const response = await fetch(
      "https://app.glimpass.com/graph/get-all-nodes-by-market",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          market: location.state?.market,
        }),
        // Add any necessary body data for the POST request
      }
    );
    const data = await response.json();
    const shopsArray = Object.values(data);

    const amb = Object.values(ambienceShops);
    console.log(amb, "ambeinceshop");
    //setShops(shopsArray);
    console.log(shops, "shops fetched!");
    console.log(shops.length, "total shops");

    const shopFrequency = {};
    shopsArray.forEach((shop) => {
      if (shopFrequency[shop.name]) {
        shopFrequency[shop.name][1] += 1; // Increment if already exists
        shopFrequency[shop.name][2].push(shop.nodeId);
      } else {
        shopFrequency[shop.name] = [shop, 1, [shop.nodeId]]; // Initialize with [shop, 1]
      }
    });
    setFrequencyMap(shopFrequency, "shopFrquency with shop object");
    console.log(shopFrequency); // Here you have your hashmap with shop frequencies

    let newShopsArray = [];
    Object.values(shopFrequency).forEach(([shop, frequency]) => {
      newShopsArray.push(shop);
    });
    console.log(newShopsArray, "newShopsArray");
    setShops(newShopsArray);

    setIsLoading(false); // Set loading to false once data is fetched
  };

  const handle = (shopId) => {
    const selectedShop = shops.find((shop) => shop.nodeId === shopId);
    setSelectedShopDetails(selectedShop);
    setOpenModal(true);
  };
  useEffect(() => {
    getAllNodes();
  }, []);

  
  useEffect(() => {
    // Check if session storage exists
    const marketValue = location.state?.market;
    if (marketValue == null) {
      // If it does, redirect to the shops page
      navigate('/markets');
    }
  }, [navigate]);


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
        <div>
          <LoadingSpinner />
        </div>
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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    // Navigate to login page here.
    navigate("/login");
    handleClose();
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const checkDP = () => {
    if (sessionStorage.getItem("imageUrl")) {
      return sessionStorage.getItem("imageUrl");
    }
    return defaultDP;
  };

  return (
    <Container>
      <AppBar position="fixed" style={{ background: "white" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            // onClick={handleMenu}
          >
            <img src={logo} width="53px" height="60px" />
            {/* Replace with your logo if this isn't a menu */}
          </IconButton>
          <div style={{ flexGrow: 1 }}></div>
          {/* <IconButton color="inherit" onClick={toggleSearch}>
            <img src={searchIcon} width='25px' height='25px' styles="margin-right: 2px"/> Replace with your searchIcon if necessary
          </IconButton> */}
          <SearchBox
            data={shops}
            onShopSelected={(selectedShop) => {
              handle(selectedShop); // set the details for the selected shop
            }}
          />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <Avatar alt="Profile Picture" src={checkDP()} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              Hello, {sessionStorage.getItem("name") || "Guest"}
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
        {/* {showSearch &&(
          <SearchBox
          data={shops}
          onShopSelected={(selectedShop) => {
            handle(selectedShop); // set the details for the selected shop
            }}
          />
        )} */}
      </AppBar>
      {/* <div>
<SearchBox
data={shops}
/>
</div> */}

      <br></br>
      <br></br>
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
            let pricingBadge;
            switch (shop.pricingLevel) {
              case 1:
                pricingBadge = "₹";
                break;
              case 2:
                pricingBadge = "₹₹";
                break;
              case 3:
                pricingBadge = "₹₹₹";
                break;
              default:
                pricingBadge = ""; // or any default representation you prefer
            }

            return (
              <Card
                key={shop.nodeId}
                sx={{
                  mb: 2,
                  boxShadow: 1,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  position: "relative", // This is important for the absolute positioning of the Chip
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 1,
                  "z-index": "0",
                  mx: { xs: 0, sm: 2 },
                  boxShadow: "none", // Remove shadow for a flatter design
  marginBottom: "10px", // Spacing between cards
  borderRadius: "10px", // Rounded corners like in the UI image
  border: "1px solid #e0e0e0", // Light border as in UI image
  overflow: "hidden", // Ensure nothing spills out of the card border radius
                }}
                // onClick={() => handleNavigateClick(shop.nodeId)}
              >
                {/* Only render Chip if pricingBadge is not empty */}
        {pricingBadge && (
          <Box
            sx={{
              position: "absolute",
              top: 8, // Adjust top and left as per your styling needs
              left: 8,
              zIndex: "tooltip", // To ensure the badge is above other elements
            }}
          >
            <Chip label={pricingBadge} sx={chipStyle} />
          </Box>
        )}
                <CardActionArea
                  sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}
                  onClick={() => handle(shop.nodeId)}
                >
                  {shop && (
                    <CardMedia
                      component="img"
                      image={shop?.imageUrl ? shop?.imageUrl : logo}
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
                      Category: {shop.category}
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
              </Card>
            );
          })}
      </Box>

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
                  state: {
                    endNodesList: [],
                    destinationShopId: "nearestWashroom",
                    market: location.state?.market,
                    clickedItem: "washroom",
                  },
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
                window.alert(
                  "No Gate mapped till now!\nWe will map it soon :) \nStay tuned!"
                );
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
                window.alert(
                  "No nearby ATM mapped till now!\nWe will map it soon :) \nstay tuned!"
                );
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
            <IconButton
              onClick={() => 
                navigate("/searchVehicle", {
                  state: {
                    market: location.state?.market
                  },
                })
              }
            >
              <img
                src={parking}
                alt="PARKING"
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Typography variant="h6" component="div">
            {selectedShopDetails?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <CardMedia
              component="img"
              image={selectedShopDetails?.imageUrl ? selectedShopDetails?.imageUrl : logo} // Replace with selectedShopDetails?.image or similar
              alt={selectedShopDetails?.name}
              sx={{
                width: "80%",
                height: "auto",
                borderRadius: "15px",
                mb: 2,
              }}
            />
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Floor: {selectedShopDetails?.floor}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Category: {selectedShopDetails?.category}
            </Typography>
            {/* Add more details as needed */}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenModal(false)}
            color="primary"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const destinationNodeId = selectedShopDetails?.nodeId;
              if (selectedShopDetails?.nearby) {
                destinationNodeId = selectedShopDetails?.nearby;
              }
              const selectedShop = shops.find(
                (shop) => shop.nodeId === destinationNodeId
              );
              const endNodesList = frequencyMap[selectedShop.name][2];
              navigate("/dashboard", {
                state: {
                  endNodesList: endNodesList,
                  destinationShopId: destinationNodeId,
                  market: location.state?.market,
                },
              });
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
