import React , {useState} from 'react';
import {  useNavigate } from 'react-router-dom';
import '../styles/ShopList.css';
import shops from '../data/shops';


const ShopList = (props) => {

    const navigate = useNavigate();
    const handleNavigateClick = (shopId) => {
        navigate('/dashboard', { state: { destinationShopId: shopId } });
    };
    
    

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
        <div className={`button-container ${buttonsMoved ? 'move-up' : ''}`}>
            <button onClick={() => handleViewChange('shop')}>Shop View</button>
            <button onClick={() => handleViewChange('deals')}>Deals View</button>
        </div>
    
      
        <div className={`shop-container ${viewMode ? 'visible' : ''}`}>
            {shops.map((shop, index) => {
                if (viewMode === 'deals' && !shop.discount) {
                    return null; // Skip shops without discounts in Deals View
                }

                return (
                    <div key={index} className="shop-card">
                        <h3 className="shop-name">{shop.name}</h3>
                        <p className="shop-category">Category: {shop.category}</p>
                        {shop.discount && <p className="shop-discount">Discount: {shop.discount}</p>}
                        <p className="shop-description">{shop.description}</p>
                        <button className="navigate-btn" onClick={() => handleNavigateClick(shop.id)}>Navigate</button>
                    </div>
                );
            })}
        </div>
    
</div>

    );
}

export default ShopList;
