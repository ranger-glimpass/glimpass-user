import { useNavigate } from "react-router-dom";
import '../styles/Thanks.css';
const ThanksComponent = ({ route, stepsWalked, totalSteps }) => {
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Show the alert
        window.alert("Thank you for your feedback!");

        // Navigate to the ShopList page
        navigate('/shops'); // Assuming '/shoplist' is the route for the ShopList page
    };

    return (
        <div className="thanks-container">
            <h2>Thanks for using our app!</h2>
            <p>You walked {stepsWalked} steps out of an estimated {totalSteps} steps.</p>
            <div className="navigation-summary">
                <h2>Navigation Summary</h2>
                <ul>
                    {route.map((item, index) => (
                        <li key={index}>
                            {item.direction ? `Take a turn ${item.direction} and walk ${item.steps} steps` : `Reached ${item.name}`}
                        </li>
                    ))}
                </ul>
                <p>Total steps walked: {stepsWalked}</p>
                <p>Total distance between shops: {totalSteps} steps</p>
            </div>

            <h3>Feedback:</h3>
            <form>
                <textarea placeholder="Share your thoughts..."></textarea>
                <button onClick={handleSubmit} type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ThanksComponent;
