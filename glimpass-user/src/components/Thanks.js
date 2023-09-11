const ThanksComponent = ({ route, stepsWalked, totalSteps }) => {
    return (
        <div>
            <h2>Thanks for using our app!</h2>
            <p>You walked {stepsWalked} steps out of an estimated {totalSteps} steps.</p>
            <h3>Your Route:</h3>
            {route.map((item, index) => (
                <p key={index}>
                    {index !== route.length - 1 ? 
                        `${item.shop.name} ➡️ ${route[index + 1].shop.name}` 
                        : 
                        `Final Destination: ${item.shop.name}`}
                </p>
            ))}
            <h3>Feedback:</h3>
            <form>
                <textarea placeholder="Share your thoughts..."></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
export default ThanksComponent;