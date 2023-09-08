import React , {useState} from 'react';
import {  useNavigate } from 'react-router-dom';
import '../styles/ShopList.css';

const ShopList = (props) => {

    const navigate = useNavigate();
    const handleNavigateClick = (shopName) => {
        navigate('/dashboard', { state: { shopName } });
    };
    

const [viewMode, setViewMode] = useState(null); // Default view is 'shop'

const [buttonsMoved, setButtonsMoved] = useState(false);

const handleViewChange = (mode) => {
    setViewMode(mode);
    setButtonsMoved(true);
};

    // const [location, setLocation] = useState('');

    // useEffect(() => {
    //     setLocation(props.location);
    // }, [props.location]);

    const shops = [
        { name: 'Clarks', category: 'Footwear', description: 'A British-based, international shoe manufacturer and retailer.' },
        { name: 'Toys R Us', category: 'Toys', description: 'An international toy, clothing, and baby product retailer.' },
        { name: 'McDonald’s', category: 'Food', description: 'An American fast-food company and the world’s largest restaurant chain.' },
        { name: 'Walmart', category: 'Groceries', description: 'A multinational retail corporation operating hypermarkets.' },
        { name: 'Gucci', category: 'Fashion', description: 'An Italian luxury brand of fashion and leather goods.' },
        { name: 'Adidas', category: 'Sportswear', discount: 'Up to 50% off', description: 'A global sportswear brand offering athletic footwear and apparel.' },
        { name: 'Sketchers', category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' },
        { name: 'Nike', category: 'Sportswear', discount: 'Buy 1 Get 1', description: 'A multinational corporation producing athletic shoes, apparel, and accessories.' },
        { name: 'Puma', category: 'Sportswear', discount: 'Up to 40% off', description: 'A German multinational company that designs athletic and casual footwear.' },
        { name: 'Reebok', category: 'Lifestyles', discount: 'Up to 35% off', description: 'A global athletic footwear and apparel company.' },
        { name: 'Vans', category: 'Fashion', discount: 'Flat 20% off', description: 'An American manufacturer of skateboarding shoes and apparel.' },
        { name: 'Converse', category: 'Footwear', discount: 'Up to 25% off', description: 'An American shoe company known for its iconic sneakers.' },
        { name: 'Under Armour', category: 'Sportswear', discount: 'Flat 15% off', description: 'A company that manufactures footwear, sports, and casual apparel.' },
        { name: 'New Balance', category: 'Footwear', discount: 'Buy 2 Get 1', description: 'A brand known for its athletic shoes.' },
        { name: 'Fila', category: 'Fashion', discount: 'Up to 45% off', description: 'A sportswear manufacturer that designs shoes and apparel.' },
        { name: 'Lego Store', category: 'Toys', description: 'A store dedicated to the iconic toy building bricks.' },
        { name: 'Starbucks', category: 'Food', description: 'An American multinational chain of coffeehouses.' },
        { name: 'Whole Foods', category: 'Groceries', description: 'A supermarket chain specializing in organic foods.' },
        { name: 'ASICS', category: 'Sportswear', discount: 'Flat 50% off on select items', description: 'A Japanese multinational company producing footwear and sports equipment.' },
        { name: 'Timberland', category: 'Lifestyles', discount: 'Up to 60% off', description: 'An American manufacturer and retailer of outdoors wear.' }
    ];    

    return (
        
        <div>
        <div className={`button-container ${buttonsMoved ? 'move-up' : ''}`}>
            <button onClick={() => handleViewChange('shop')}>Shop View</button>
            <button onClick={() => handleViewChange('deals')}>Deals View</button>
        </div>
    
        <div className={`button-click ${buttonsMoved ? 'clicked' : ''}`}>
            <h5>Welcome to Ambience Mall</h5>
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
                        <button className="navigate-btn" onClick={() => handleNavigateClick(shop.name)}>Navigate</button>
                    </div>
                );
            })}
        </div>
    
</div>

    );
}

export default ShopList;
