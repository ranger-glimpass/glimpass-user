import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Button, Typography, Container, Box, CircularProgress } from '@mui/material';

const ShopList = (props) => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const [activeCard, setActiveCard] = useState(null);

    const handleNavigateClick = (shopId) => {
        setActiveCard(shopId);
        setTimeout(() => {
            navigate('/dashboard', { state: { destinationShopId: shopId } });
        }, 300); // Delay for the fade-out effect
    };

    const getAllNodes = async () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        const response = await fetch("https://app.glimpass.com/graph/get-all-nodes", requestOptions);
        const data = await response.json();
        const shopsArray = Object.values(data);
        setShops(shopsArray);
        setIsLoading(false); // Set loading to false once data is fetched
    };

    useEffect(() => {
        getAllNodes();
    }, []);

    const [viewMode, setViewMode] = useState('shop');

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress style={{ transform: 'rotate(-45deg)' }} /> {/* Compass needle effect */}
                Shops near you!
            </Box>
        );
    }

    return (
        <Container>
            <Box mt={4}>
                {shops.filter(shop => shop.nodeType === 'shop').map((shop, index) => {
                    if (viewMode === 'deals' && !shop.discount) {
                        return null;
                    }

                    return (
                        <Card
                            key={shop.nodeId}
                            variant="outlined"
                            style={{
                                marginBottom: '20px',
                                transition: 'opacity 0.01s',
                                opacity: activeCard === shop.nodeId ? 0 : 1
                            }}
                            onClick={() => handleNavigateClick(shop.nodeId)}
                        >
                            <CardHeader title={shop.name} />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Category: {shop.category?.join(', ')}
                                </Typography>
                                {shop.discount && (
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        Discount: {shop.discount}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {shop.subType}
                                </Typography>
                                <Box mt={2}>
                                    <Button variant="contained" color="primary" onClick={() => handleNavigateClick(shop.nodeId)}>
                                        Navigate
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        </Container>
    );
}

export default ShopList;
