import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ShopList.css';

const ShopList = (props) => {

    const navigate = useNavigate();
    const handleNavigateClick = (shopName) => {
        navigate('/navigation', { state: { shopName } });
    };
    
    
    const locationData = useLocation();
const currentLocation = locationData.state?.location || 'Unknown Location';

    // const [location, setLocation] = useState('');

    // useEffect(() => {
    //     setLocation(props.location);
    // }, [props.location]);

    const shops = [
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
        { name: 'ASICS', category: 'Sportswear', discount: 'Flat 50% off on select items', description: 'A Japanese multinational company producing footwear and sports equipment.' },
        { name: 'Timberland', category: 'Lifestyles', discount: 'Up to 60% off', description: 'An American manufacturer and retailer of outdoors wear.' },
        { name: 'Clarks', category: 'Footwear', discount: 'Flat 40% off', description: 'A British-based, international shoe manufacturer and retailer.' },
        { name: 'Toys R Us', category: 'Toys', discount: 'Up to 50% off', description: 'An international toy, clothing, and baby product retailer.' },
        { name: 'McDonald’s', category: 'Food', discount: 'Free fries on orders above $10', description: 'An American fast-food company and the world’s largest restaurant chain.' },
        { name: 'Walmart', category: 'Groceries', discount: 'Up to 10% off', description: 'A multinational retail corporation operating hypermarkets.' },
        { name: 'Gucci', category: 'Fashion', discount: 'Flat 20% off', description: 'An Italian luxury brand of fashion and leather goods.' },
        { name: 'Lego Store', category: 'Toys', discount: 'Buy 2 Get 1', description: 'A store dedicated to the iconic toy building bricks.' },
        { name: 'Starbucks', category: 'Food', discount: 'Free drink on orders above $15', description: 'An American multinational chain of coffeehouses.' },
        { name: 'Whole Foods', category: 'Groceries', discount: 'Up to 15% off', description: 'A supermarket chain specializing in organic foods.' }
    ];
    

    return (
        <div>
            <div className="location-header">
            <h2>📍 {currentLocation}</h2>
        </div>
            <div className="shop-container">
            {shops.map((shop, index) => (
    <div key={index} className="shop-card">
        <h3 className="shop-name">{shop.name}</h3>
        <p className="shop-category">Category: {shop.category}</p>
        <p className="shop-discount">Discount: {shop.discount}</p>
        <p className="shop-description">{shop.description}</p>
        <button className="navigate-btn" onClick={() => handleNavigateClick(shop.name)}>Navigate</button>
    </div>
))}

            </div>
        </div>
    );
}

export default ShopList;
