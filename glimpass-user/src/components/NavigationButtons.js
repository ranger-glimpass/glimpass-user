import React, { useEffect } from "react";
import { Button } from "@mui/material";

const NavigationButtons = ({
  route,
  currentRoute,
  handleDropdownChange,
  changeSlectedIndexDynamic,
}) => {
  let currentIndex = route.findIndex(
    (item) =>
      item.shopOrCheckpoint.name === currentRoute[0]?.shopOrCheckpoint?.name
  );
  console.log(route, "manish");
  console.log(currentRoute, "manish");
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

  return (
    <div>
      {nodesToDisplay.map((node, index) => (
        <Button
          key={index}
          variant="contained"
          color={
            node.shopOrCheckpoint.name ===
            currentRoute[0]?.shopOrCheckpoint?.name
              ? "primary"
              : "inherit"
          }
          onClick={() => handleDropdownChange(node.shopOrCheckpoint?.name)}
        >
          {node.shopOrCheckpoint.name ===
          currentRoute[0]?.shopOrCheckpoint?.name ? (
            <>📍 {node.shopOrCheckpoint?.name}</>
          ) : (
            node.shopOrCheckpoint?.name
          )}
        </Button>
      ))}
    </div>
  );
};

export default NavigationButtons;
