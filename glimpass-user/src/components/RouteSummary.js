import {useState, useEffect} from 'react';
import { Button } from '@mui/material';

const Popup = ({ message }) => {
    if (!message) return null;
  
    return (
      <div className="popup">
        {message}
      </div>
    );
  };
const RouteSummary = ({ shops, selectedShopIndex }) => {
    const [routeSummary, setRouteSummary] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showSummary, setShowSummary] = useState(true);


    const getTurnDirection = (currentAngle, nextAngle) => {
        let difference = nextAngle - currentAngle;
    
        // Adjust for wrap-around
        if (difference > 180) {
          difference -= 360;
        } else if (difference < -180) {
          difference += 360;
        }
    
        if (Math.abs(difference) <= 20) return null; // No direction if within ±20 degrees
        if (difference > 20) return "Left";
        return "Right";
      };
  
    useEffect(() => {
      setRouteSummary(generateRouteSummary());
    }, [shops, selectedShopIndex]);
  
    const generateRouteSummary = () => {
        let summary = '';
        let currentPoint = shops[selectedShopIndex];
        let nextPoints = shops.slice(selectedShopIndex + 1, selectedShopIndex + 4);
      
        if (currentPoint) {
          // Description for the current location.
          summary += currentPoint.nodeType === 'floor_change' ? 'Currently at Escalator, \n' :
                     currentPoint.nodeType === 'floor_change_lift' ? 'Currently at Lift, \n' :
                     currentPoint.nodeType === 'washroom' ? 'Currently at Washroom corner, \n' :
                     currentPoint.nodeType !== 'checkpoint' ? `Currently at ${currentPoint.name}, \n` : '';
      
                     let pathShops = [];
    let foundTurn = false;

    for (let i = 0; i < nextPoints.length; i++) {
      let point = nextPoints[i];
      let turnDirection = null;

      // Check for a turn based on angles between current and next point
      if (i < nextPoints.length - 1) {
        turnDirection = getTurnDirection(point.anglesIn, nextPoints[i + 1].anglesIn);
      }

      if (turnDirection) {
        // If a turn is detected based on angle
        if(point.nodeType !== "checkpoint"){
          pathShops.push("Go through " +point.name);
        }
        else{
          pathShops.push("Go straight")
        }
        summary += `${pathShops.join(", ")} and turn ${turnDirection}. \n`;
        foundTurn = true;
        break;
      } else {
        // Add shop to the path
        pathShops.push(point.name);
      }
    }

    // If no turn within next three shops, list them as a straight path
    if (!foundTurn && pathShops.length > 0) {
      summary += `Go through ${pathShops.join(", ")}. \n`;
    }
  }

  return summary;
};
      
  
    return (
        <>
          <Button onClick={() => setShowSummary(!showSummary)}>
            {showSummary ? 'Hide Route Summary' : 'Show Route Summary'}
          </Button>
          {showSummary && (
            <div className="route-summary">
              {routeSummary.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
        </>
      );
    };
    
    export default RouteSummary;