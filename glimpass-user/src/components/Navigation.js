import React, { useState, useEffect } from 'react';
import navigationArrow from '../assets/navigationArrow.svg';
import { useLocation } from 'react-router-dom';
import '../styles/ShopList.css';

const Navigation = () => {

    const locationData = useLocation();
    const shopName = locationData.state?.shopName || 'Unknown Shop';
    const currentLocation = locationData.state?.location || 'Unknown Location';

    // Sample map data
    const mapSteps = [
        { step: 1, shop: 'Adidas', distance: '10m' },
        { step: 2, shop: 'Nike', distance: '20m' },
        { step: 3, shop: shopName, distance: '5m' }
    ];


    const [alpha, setAlpha] = useState(0);

    useEffect(() => {
        const handleOrientation = (event) => {
            const { alpha } = event;
            setAlpha(parseInt(alpha));
        };

        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return (
        <div>
            <div className="location-header">
            <h2>📍 {currentLocation}</h2>
        </div>
        
            <div>
            <h2>Navigating to: {shopName}</h2>
            <h2>Device Orientation: {360-alpha}°</h2>
            <img 
    src={navigationArrow} 
    alt="Navigation Arrow" 
    className="navigation-arrow"
    style={{ transform: `rotate(${alpha-45}deg)` }}
/>
            <div>
                <h3>Map Steps:</h3>
                <ul>
                    {mapSteps.map((stepData, index) => (
                        <li key={index}>
                            Step {stepData.step}: Pass by {stepData.shop} - {stepData.distance}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
            
        </div>
    );
}

export default Navigation;
