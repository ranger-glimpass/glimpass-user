import { useLocation, useNavigate } from 'react-router-dom';
import shops  from '../data/shops';
import { useState } from 'react';

const Dashboard = () => {
    const location = useLocation();
    const destinationShopId = location.state.destinationShopId;

    const [currentLocation, setCurrentLocation] = useState(null);
    const navigate = useNavigate();

    return (
        <div>
            <h2>Select your current location:</h2>
            <select onChange={(e) => setCurrentLocation(e.target.value)}>
                {shops.map(shop => (
                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
            </select>
            <button onClick={() => navigate('/navigation', { state: { currentLocation, destinationShopId } })}>
                Navigate
            </button>
        </div>
    );
}

export default Dashboard;
