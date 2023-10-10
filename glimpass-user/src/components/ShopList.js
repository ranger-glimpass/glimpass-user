import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/glimpassLogo.png";
//import Fab from '@mui/material/Fab';
import RestroomIcon from "@mui/icons-material/Wc"; // Assuming you want to use the WC icon for the restroom

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

const ShopList = (props) => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [activeCard, setActiveCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShop, setSelectedShop] = useState(null); // <-- Add this state variable

  const handleNavigateClick = (shopId) => {
    setActiveCard(shopId);
    setTimeout(() => {
      navigate("/dashboard", { state: { destinationShopId: shopId } });
    }, 300); // Delay for the fade-out effect
  };

  const getAllNodes = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(
      "https://app.glimpass.com/graph/get-all-nodes",
      requestOptions
    );
    const data = await response.json();
    const shopsArray = Object.values(data);
    setShops(shopsArray);
    setIsLoading(false); // Set loading to false once data is fetched
  };

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
      >
        <CircularProgress style={{ transform: "rotate(-45deg)" }} />{" "}
        {/* Compass needle effect */}
        Shops near you!
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

  return (
    <Container>
      <AppBar position="fixed" elevation={0} sx={{ height: 64 }}>
        <Toolbar
          sx={{
            justifyContent: "flex-end",
            minHeight: "64px",
            pr: 1,
          }}
        >
          <Autocomplete
            options={shops}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setSelectedShop(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for a shop..."
                variant="outlined"
                size="small"
              />
            )}
            sx={{ width: "100%" }}
          />
        </Toolbar>
      </AppBar>
      <br></br>
      <Box mt={4} px={{ xs: 2, sm: 4 }}>
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
                onClick={() => handleNavigateClick(shop.nodeId)}
              >
                <CardActionArea
                  sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}
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
                <Box sx={{ p: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleNavigateClick(shop.nodeId)}
                  >
                    Navigate
                  </Button>
                </Box>
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
      <img
        src="https://iconape.com/wp-content/files/jl/339960/png/restroom-sign-logo.png"
        alt="Nearest Washroom"
        style={{
          width: "50px", // or whatever size you want
          height: "50px",
          borderRadius: "50%", // to ensure it's circular
          position: "fixed",
          bottom: "16px",
          right: "16px",
          cursor: "pointer",
        }}
        onClick={() =>
          navigate("/dashboard", {
            state: { destinationShopId: "nearestWashroom" },
          })
        }
      />
    </Container>
  );
};

export default ShopList;
