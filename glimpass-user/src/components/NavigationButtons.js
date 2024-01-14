import React, {useState, useEffect } from "react";
import { Button } from "@mui/material";
import "../styles/NavigationButtons.css";


// const Popup = ({ message }) => {
//   if (!message) return null;

//   return (
//     <div className="popup">
//       {message}
//     </div>
//   );
// };

const NavigationButtons = ({
  route,
  currentRoute,
  handleDropdownChange,
  changeSlectedIndexDynamic,
}) => {
  console.log(currentRoute, "test");
  let currentIndex = route.findIndex(
    item =>
      item.shopOrCheckpoint.nodeId === currentRoute[0]?.shopOrCheckpoint?.nodeId
  );
  console.log(route, "Route");
  console.log(currentRoute, "Current - Route");
  // Determine the start and end indices for the buttons
  let start = currentIndex;
  let end = currentIndex;

  // Adjust based on the current index
  if (currentIndex === 0) {
    end = Math.min(route.length - 1, currentIndex + 2);
  } else if (currentIndex === 1) {
    start = Math.max(0, currentIndex - 1);
    end = Math.min(route.length - 1, currentIndex + 1);
  } else if (currentIndex === route.length - 2) {
    start = Math.max(0, currentIndex - 1);
    end = Math.min(route.length - 1, currentIndex + 1);
  } else if (currentIndex === route.length - 1) {
    start = Math.max(0, currentIndex - 2);
  } else {
    start = Math.max(0, currentIndex - 2);
    end = Math.min(route.length - 1, currentIndex + 2);
  }

  useEffect(() => {
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    changeSlectedIndexDynamic(currentIndex);
  }, [currentIndex]);

  const nodesToDisplay = route.slice(start, end + 1);

  const checkpointOrStop = node => {
    if (node.shopOrCheckpoint?.nodeType === "checkpoint") {
      return "Just a Turn";
    } else {
      return node.shopOrCheckpoint?.name;
    }
  };

  // const [popupMessage, setPopupMessage] = useState('');
  // const [showPopup, setShowPopup] = useState(false);


  // const getDirection = (angle) => {
  //   // Example: Convert angle to direction (this is a simplification)
  //   if (angle > 45 && angle < 135) return 'right';
  //   if (angle > 225 && angle < 315) return 'left';
  //   return 'straight';
  // };

  // const generateRouteSummary = () => {
  //   return route.map((node, index) => {
  //     let directionText = '';
  //     if (node.shopOrCheckpoint?.nodeType === "checkpoint") {
  //       directionText = `Turn ${getDirection(node.connection.angle)}\n`;
  //     } else {
  //       directionText = `Go through ${node.shopOrCheckpoint.name}\n`;
  //     }
  //     return `${index === currentIndex ? 'Currently at' : ''} ${directionText}\n`;
  //   }).join(', \n');
  // };

  // const handleShowSummary = () => {
  //   setPopupMessage(generateRouteSummary());
  //   console.log(generateRouteSummary(), 'routesummary')
  //   setShowPopup(true);
  // };

  // useEffect(() => {
  //   // Determine if popup needs to be shown
  //   const directionText = generateDirectionText(currentIndex);
  //   if (directionText) {
  //     setPopupMessage(directionText);
  //     setShowPopup(true);
  //   }
  // }, [currentIndex, route]);

  // useEffect(() => {
  //   let timer;
  //   if (showPopup) {
  //     timer = setTimeout(() => setShowPopup(false), 3000); // 3 seconds
  //   }
  //   return () => clearTimeout(timer);
  // }, [showPopup]);

  
  // const handleButtonClick = (nodeId, currentIndex) => {
  //   console.log(nodeId, "test t");
  //   handleDropdownChange(nodeId);
  //   const directionText = generateDirectionText(currentIndex);
  //   if (directionText) {
  //     setPopupMessage(directionText);
  //     setShowPopup(true);
  //   }
  // };


  return (
    <div className="horizontal-scroll">
       {/* <Button onClick={handleShowSummary}>Show Route Summary</Button><br></br> */}
     
      {nodesToDisplay.map((node, index) => (
        <Button
          key={index}
          variant="contained"
          color={
            node.shopOrCheckpoint.nodeId ===
            currentRoute[0]?.shopOrCheckpoint?.nodeId
              ? "primary"
              : "inherit"
          }
          onClick={() => {
            console.log(node, "test t");
            handleDropdownChange(node.shopOrCheckpoint.nodeId);
          }}
          className="button-fixed-width" // Ensure buttons have the same width
        >
          {node.shopOrCheckpoint.name ===
          currentRoute[0]?.shopOrCheckpoint?.name ? (
            <>📍 {checkpointOrStop(node)}</>
          ) : (
            checkpointOrStop(node)
          )}
        </Button>
      ))}
      {/* {showPopup && <Popup message={popupMessage} />} */}

{/* <div className="horizontal-scroll">
      {nodesToDisplay.map((node, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(node.shopOrCheckpoint.nodeId, index)}
          className="button-fixed-width"
        >
          {checkpointOrStop(node)}
        </button>
      ))}
      {showPopup && <Popup message={popupMessage} />}
    </div> */}
    </div>
  );
};

export default NavigationButtons;
