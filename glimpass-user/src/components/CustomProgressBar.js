import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { makeStyles } from "@mui/styles";

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
});

const CustomProgressBar = ({ totalSteps, stepsWalked, shops }) => {
  const classes = useStyles();
  const [currentShopIndex, setCurrentShopIndex] = useState(0);
  const [stepsBetweenShops, setStepsBetweenShops] = useState(0);

  useEffect(() => {
    let nextShopIndex = currentShopIndex; // Start with the current index

    for (let i = currentShopIndex; i < shops.length; i++) {
      if (stepsWalked < Number(shops[i].step)) {
        nextShopIndex = i;
        break;
      }
    }

    // Only update if the nextShopIndex has changed and it's not the last shop
    if (
      nextShopIndex !== currentShopIndex &&
      nextShopIndex < shops.length - 1
    ) {
      setCurrentShopIndex(nextShopIndex);
    }
  }, [stepsWalked, shops, currentShopIndex]);

  useEffect(() => {
    console.log(shops[currentShopIndex + 1], "here");
  }, [currentShopIndex, shops]);

  useEffect(() => {
    if (currentShopIndex === 0) {
      setStepsBetweenShops(parseInt(shops[currentShopIndex].step, 10));
    } else {
      if (shops[currentShopIndex]) {
        setStepsBetweenShops(
          parseInt(shops[currentShopIndex].step, 10) -
            parseInt(shops[currentShopIndex - 1].step, 10)
        );
      } else {
        setStepsBetweenShops(
          totalSteps - parseInt(shops[currentShopIndex].step, 10)
        );
      }
    }
  }, [currentShopIndex, shops, totalSteps]);

  const currentShopStep =
    currentShopIndex === 0 ? 0 : parseInt(shops[currentShopIndex - 1].step, 10);
  const nextShopStep = parseInt(shops[currentShopIndex].step, 10);
  const clampedStepsWalked = Math.max(
    currentShopStep,
    Math.min(stepsWalked, nextShopStep)
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
  if (shops[currentShopIndex + 1] && stepsWalked >= thresholdPoint) {
    if (currentShopIndex === shops.length - 2) {
      direction = "About to reach your destination";
    } else {
        const directionTurn = getTurnDirection(shops[currentShopIndex].anglesIn, shops[currentShopIndex + 1].anglesIn);
        if(directionTurn != null)
          direction = "Ready to turn " + directionTurn;
        else{
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
              left: `${((parseInt(shop.step, 10) - parseInt(shops[currentShopIndex].step, 10)) / stepsBetweenShops) * 100}%`
            }}
          ></div>
        ))} */}
      </div>
      {shops[currentShopIndex + 1] && (
        <div className={classes.nextShop}>
          Next Shop: {shops[currentShopIndex + 1].name}
        </div>
      )}

      {direction && <div className={classes.directionText}>{direction}</div>}
    </div>
  );
};

export default CustomProgressBar;
