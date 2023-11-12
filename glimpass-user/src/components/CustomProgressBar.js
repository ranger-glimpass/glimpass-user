import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { makeStyles } from "@mui/styles";
import { Box, Typography } from "@mui/material";
import directionImage from "../assets/atm.png";
import leftImage from "../assets/leftTurn.jpg"; // Replace with your image's path and extension
import rightImage from "../assets/rightTurn.jpg";
import straightImage from "../assets/keepStaright.png";
import reached from "../assets/reached.png";

const useStyles = makeStyles({
  root: {
    position: "relative",
    height: 20,
    borderRadius: 5,
    backgroundColor: "#e0e0de",
    marginBottom: 20,
  },
  dot: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "red",
  },
  progressBar: {
    borderRadius: 5,
  },
  nextShop: {
    textAlign: "center",
    fontSize: "20px",
    padding: "30px 0 0 0",
    fontWeight: "bolder",
    fontFamily: "sans-serif",
  },

  directionText: {
    textAlign: "center",
    fontSize: "20px",
    padding: "10px 0",
    fontWeight: "bolder",
    fontFamily: "sans-serif",
    color: "blue", // Change to your desired color
    animation: "$blink 1s infinite",
  },
  directionImage: {
    width: "30px", // Adjust as needed
    height: "30px", // Adjust as needed
    marginRight: "10px",
  },
  "@keyframes blink": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.5 },
    "100%": { opacity: 1 },
  },
});

const CustomProgressBar = ({
  totalSteps,
  stepsWalked,
  shops,
  selectedShopIndex,
}) => {
  console.log("----------------");
  console.log(totalSteps, "totalSteps");
  console.log(stepsWalked, "stepsWalked");
  console.log(shops, "shops");
  console.log(selectedShopIndex, "selectedSHopIndex");
  console.log("----------------");
  const classes = useStyles();
  //const [selectedShopIndex, setselectedShopIndex] = useState(0);
  const [stepsBetweenShops, setStepsBetweenShops] = useState(0);
  console.log(selectedShopIndex, "seleShop");
  useEffect(() => {
    // Determine the next shop based on stepsWalked
    let nextShopIndex = selectedShopIndex;
    for (let i = selectedShopIndex; i < shops.length; i++) {
      if (stepsWalked < Number(shops[i].step)) {
        nextShopIndex = i;
        break;
      }
    }

    // Update the steps between the current shop and the next shop
    if (nextShopIndex === 0) {
      setStepsBetweenShops(parseInt(shops[0].step, 10));
    } else {
      setStepsBetweenShops(
        parseInt(shops[nextShopIndex].step, 10) -
          parseInt(shops[nextShopIndex - 1].step, 10)
      );
    }
  }, [stepsWalked, shops, selectedShopIndex]);

  useEffect(() => {
    console.log(shops[selectedShopIndex + 1], "here");
  }, [selectedShopIndex, shops]);

  useEffect(() => {
    if (selectedShopIndex === 0) {
      setStepsBetweenShops(parseInt(shops[selectedShopIndex].step, 10));
    } else {
      if (shops[selectedShopIndex]) {
        setStepsBetweenShops(
          parseInt(shops[selectedShopIndex].step, 10) -
            parseInt(shops[selectedShopIndex - 1].step, 10)
        );
      } else {
        setStepsBetweenShops(
          totalSteps - parseInt(shops[selectedShopIndex].step, 10)
        );
      }
    }
  }, [selectedShopIndex, shops, totalSteps]);

  const currentShopStep =
    selectedShopIndex === 0
      ? 0
      : parseInt(shops[selectedShopIndex - 1].step, 10);

  const nextShopStep = parseInt(shops[selectedShopIndex].step, 10);
  const clampedStepsWalked = Math.max(
    currentShopStep,
    Math.min(stepsWalked, parseInt(shops[selectedShopIndex].step, 10))
  );
  const progressPercentage =
    ((clampedStepsWalked - currentShopStep) / stepsBetweenShops) * 100;

  const thresholdPoint = currentShopStep + 0.75 * stepsBetweenShops;

  // console.log('stepsWalked:', stepsWalked);
  // console.log('stepsBetweenShops:', stepsBetweenShops);
  // console.log('progressPercentage:', progressPercentage);
  console.log("shopsInCustomBar:", shops);

  // Method to compute turn direction
  const getTurnDirection = (currentAngle, nextAngle) => {
    let difference = nextAngle - currentAngle;

    // Adjust for wrap-around
    if (difference > 180) {
      difference -= 360;
    } else if (difference < -180) {
      difference += 360;
    }

    if (Math.abs(difference) <= 20) return null; // No direction if within ±20 degrees
    if (difference > 20) return "Right";
    return "Left";
  };

  let direction;
  if (shops[selectedShopIndex + 1] && stepsWalked >= thresholdPoint) {
    if (selectedShopIndex === shops.length - 2) {
      direction = "About to reach your destination";
    } else {
      const directionTurn = getTurnDirection(
        shops[selectedShopIndex].anglesIn,
        shops[selectedShopIndex + 1].anglesIn
      );
      if (directionTurn != null) direction = "Ready to turn " + directionTurn;
      else {
        direction = "Keep Straight";
      }
    }
  }

  const [previousDirection, setPreviousDirection] = useState(null);
  useEffect(() => {
    // Check if the direction has changed and if the Vibration API is supported
    if (direction !== previousDirection && "vibrate" in navigator) {
      navigator.vibrate(200); // vibrate for 200ms
      console.log("Vibration");
      setPreviousDirection(direction);
    }
  }, [direction]);

  const getDirectionImage = (direction) => {
    switch (direction) {
      case "Ready to turn Left":
        return leftImage;
      case "Ready to turn Right":
        return rightImage;
      case "Keep Straight":
        return straightImage;
      default:
        return reached; // Default case if no direction matches
    }
  };

  return (
    <div className="custom-progress-bar-container">
      <div className={classes.root}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          className={classes.progressBar}
        />
        {/* {shops.map((shop, index) => (
          <div
            key={index}
            className={classes.dot}
            style={{
              left: `${((parseInt(shop.step, 10) - parseInt(shops[selectedShopIndex].step, 10)) / stepsBetweenShops) * 100}%`
            }}
          ></div>
        ))} */}
      </div>
      {shops[selectedShopIndex + 1]?.nodeType != "checkpoint" && (
        <div className={classes.nextShop}>
          Next Stop: {shops[selectedShopIndex + 1]?.name}
        </div>
      )}
      {shops[selectedShopIndex + 1]?.nodeType === "checkpoint" && (
        <div className={classes.nextShop}>
          Upcoming turn
        </div>
      )}

      {direction && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          className={classes.directionContainer}
        >
          <img
            src={getDirectionImage(direction)}
            alt="Direction"
            className={classes.directionImage}
          />
          <Typography className={classes.directionText}>{direction}</Typography>
        </Box>
      )}
    </div>
  );
};

export default CustomProgressBar;
