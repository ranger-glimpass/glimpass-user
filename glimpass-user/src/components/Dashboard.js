import React, {useState} from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/navigation', { state: { location, shopName } });
    };

    const locationData = useLocation();
    const shopName = locationData.state?.shopName || 'Unknown Shop';

    const shops = [
        { name: 'Adidas', category: 'Sportswear', discount: 'Up to 50% off', description: 'A global sportswear brand offering athletic footwear and apparel.', floor: 'Ground' },
        { name: 'Sketchers', category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' , floor: 'First' },
        { name: 'Nike', category: 'Sportswear', discount: 'Buy 1 Get 1', description: 'A multinational corporation producing athletic shoes, apparel, and accessories.', floor: 'Ground'  },
        { name: 'Puma', category: 'Sportswear', discount: 'Up to 40% off', description: 'A German multinational company that designs athletic and casual footwear.' , floor: 'Second' },
        { name: 'Reebok', category: 'Lifestyles', discount: 'Up to 35% off', description: 'A global athletic footwear and apparel company.' , floor: 'First' },
        { name: 'Vans', category: 'Fashion', discount: 'Flat 20% off', description: 'An American manufacturer of skateboarding shoes and apparel.' , floor: 'Second' },
        { name: 'Converse', category: 'Footwear', discount: 'Up to 25% off', description: 'An American shoe company known for its iconic sneakers.' , floor: 'Ground' },
        { name: 'Under Armour', category: 'Sportswear', discount: 'Flat 15% off', description: 'A company that manufactures footwear, sports, and casual apparel.' , floor: 'Second' },
        { name: 'New Balance', category: 'Footwear', discount: 'Buy 2 Get 1', description: 'A brand known for its athletic shoes.' , floor: 'Ground' },
        { name: 'Fila', category: 'Fashion', discount: 'Up to 45% off', description: 'A sportswear manufacturer that designs shoes and apparel.' , floor: 'Ground' },
        { name: 'ASICS', category: 'Sportswear', discount: 'Flat 50% off on select items', description: 'A Japanese multinational company producing footwear and sports equipment.', floor: 'Ground'  },
        { name: 'Timberland', category: 'Lifestyles', discount: 'Up to 60% off', description: 'An American manufacturer and retailer of outdoors wear.' , floor: 'Second' },
        { name: 'Clarks', category: 'Footwear', description: 'A British-based, international shoe manufacturer and retailer.' , floor: 'Second' },
        { name: 'Toys R Us', category: 'Toys', description: 'An international toy, clothing, and baby product retailer.' , floor: 'Ground' },
        { name: 'McDonald’s', category: 'Food', description: 'An American fast-food company and the world’s largest restaurant chain.' , floor: 'Second' },
        { name: 'Walmart', category: 'Groceries', description: 'A multinational retail corporation operating hypermarkets.' , floor: 'First' },
        { name: 'Gucci', category: 'Fashion', description: 'An Italian luxury brand of fashion and leather goods.' , floor: 'Ground' },
        { name: 'Lego Store', category: 'Toys', description: 'A store dedicated to the iconic toy building bricks.' , floor: 'First' },
        { name: 'Starbucks', category: 'Food', description: 'An American multinational chain of coffeehouses.' , floor: 'Ground' },
        { name: 'Whole Foods', category: 'Groceries', description: 'A supermarket chain specializing in organic foods.' , floor: 'First' }
    ];

    return (
        <div>
           
            <p>Glimpass helps you to find deals and navigate to that shop.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Where are you at?</label></div>
                <div>
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
    {shops.map((shop, index) => (
        <option key={index} value={`${shop.name}, ${shop.floor} floor`}>
            {shop.name}, {shop.floor+' floor'}
        </option>
    ))}
</select>

                </div>
                <button type="submit">I'm Here!</button>
            </form>
        </div>
    );
}

export default Dashboard;
