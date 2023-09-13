import React , {useState, useEffect} from 'react';
import {  useNavigate } from 'react-router-dom';
import '../styles/ShopList.css';
// import shops from '../data/shops';


const ShopList = (props) => {

    const navigate = useNavigate();
    const [shops, setShops] = useState([]); // State variable to store fetched shops

    const handleNavigateClick = (shopId) => {
        navigate('/dashboard', { state: { destinationShopId: shopId } });
    };
    
    const getAllNodes = async () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        const response = await fetch("https://app.glimpass.com/graph/get-all-nodes", requestOptions);
        const data = await response.json(); // Parse the JSON data from the response
    
        const shopsArray = Object.values(data); // Convert the object into an array
        setShops(shopsArray); // Set the fetched data to the state variable
    };

    useEffect(() => {
        getAllNodes();
    }, []);

const [viewMode, setViewMode] = useState('shop'); // Default view is 'shop'

const [buttonsMoved, setButtonsMoved] = useState(false);

const handleViewChange = (mode) => {
    setViewMode(mode);
    setButtonsMoved(true);
};

    // const [location, setLocation] = useState('');

    // useEffect(() => {
    //     setLocation(props.location);
    // }, [props.location]);


    return (
        
        <div>
        <div className={`shop-container ${viewMode ? 'visible' : ''}`}>
            {shops.filter(shop => shop.nodeType === 'shop').map((shop, index) => {
                if (viewMode === 'deals' && !shop.discount) {
                    return null; // Skip shops without discounts in Deals View
                }
    
                return (
                    <div key={shop.nodeId} className="shop-card">
                        <h3 className="shop-name">{shop.name}</h3>
                        <p className="shop-category">Category: {shop.category?.join(', ')}</p>
                        {shop.discount && <p className="shop-discount">Discount: {shop.discount}</p>}
                        <p className="shop-description">{shop.subType}</p>
                        <button className="navigate-btn" onClick={() => handleNavigateClick(shop.nodeId)}>Navigate</button>
                    </div>
                );
            })}
        </div>
    </div>
    
    );
}

export default ShopList;
