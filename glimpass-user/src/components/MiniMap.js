const MiniMap = ({ totalSteps, stepsWalked, route }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: '40px', border: '1px solid black' }}>
            {route.map((item, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        left: `${(item.shopOrCheckpoint.step / totalSteps) * 100}%`,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'red',
                        transform: 'translateX(-50%)'
                    }}
                ></div>
            ))}
            <div
                style={{
                    position: 'absolute',
                    left: `${(stepsWalked / totalSteps) * 100}%`,
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'blue',
                    transform: 'translateX(-50%) rotate(45deg)' // 45deg to make it look like an arrow
                }}
            ></div>
        </div>
    );
};
export default MiniMap;