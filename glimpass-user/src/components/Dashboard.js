import React, {useState} from 'react';
import {  useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/shops', { state: { location } });
    };
    return (
        <div>
            <h2>Welcome to Ambience Mall</h2>
            <p>Glimpass helps you to find deals and navigate to that shop.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Where are you at?</label></div>
                <div>
                    <select value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="Gate, Ground floor">Gate, Ground floor</option>
                        <option value="HnM shop, Ground floor">HnM shop, Ground floor</option>
                        <option value="Adidas, Ground floor">Adidas, Ground floor</option>
                        <option value="Sketcher, Ground floor">Sketcher, Ground floor</option>
                        <option value="Haldiram, Second floor">Haldiram, Second floor</option>
                        <option value="HnM, First floor">HnM, First floor</option>
                        <option value="Spencer, Second floor">Spencer, Second floor</option>
                     
                    </select>
                </div>
                <button type="submit">I'm Here!</button>
            </form>
        </div>
    );
}

export default Dashboard;
