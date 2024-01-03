import React, { useEffect } from "react";
import { Button } from "@mui/material";
// import "../styles/NavigationButtons.css";

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
  return (
    <div className="horizontal-scroll">
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
            handleDropdownChange(node.shopOrCheckpoint?.nodeId);
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
    </div>
  );
};

export default NavigationButtons;
