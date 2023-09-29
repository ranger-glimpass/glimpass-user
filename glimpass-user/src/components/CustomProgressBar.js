import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: 20,
    borderRadius: 5,
    backgroundColor: '#e0e0de',
    marginBottom: 20,
  },
  dot: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: 'red',
  },
  progressBar: {
    borderRadius: 5,
  },
  nextShop: {
    textAlign: 'center',
  },
});

const CustomProgressBar = ({ totalSteps, stepsWalked, shops }) => {
  const classes = useStyles();
  const [currentShopIndex, setCurrentShopIndex] = useState(0);
  const [stepsBetweenShops, setStepsBetweenShops] = useState(0);

  useEffect(() => {
    for (let i = 0; i < shops.length; i++) {
      if (stepsWalked <= Number(shops[i].step) && (!shops[i + 1] || stepsWalked < Number(shops[i + 1].step))) {
        setCurrentShopIndex(i);
        break;
      }
    }
  }, [stepsWalked, shops]);

  useEffect(() => {
    if (currentShopIndex === 0) {
      setStepsBetweenShops(parseInt(shops[currentShopIndex].step, 10));
    } else {
      if (shops[currentShopIndex]) {
        setStepsBetweenShops(
          parseInt(shops[currentShopIndex].step, 10) - parseInt(shops[currentShopIndex-1].step, 10)
        );
      } else {
        setStepsBetweenShops(totalSteps - parseInt(shops[currentShopIndex].step, 10));
      }
    }
  }, [currentShopIndex, shops, totalSteps]);

  const currentShopStep = currentShopIndex === 0 ? 0 : parseInt(shops[currentShopIndex - 1].step, 10);
  const nextShopStep = parseInt(shops[currentShopIndex].step, 10);
  const clampedStepsWalked = Math.max(currentShopStep, Math.min(stepsWalked, nextShopStep));
  const progressPercentage = (
    ((clampedStepsWalked - currentShopStep) / stepsBetweenShops) * 100
  );

// console.log('stepsWalked:', stepsWalked);
// console.log('stepsBetweenShops:', stepsBetweenShops);
// console.log('progressPercentage:', progressPercentage);
console.log('shopsInCustomBar:', shops);


  return (
    <div>
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
    </div>
  );
};

export default CustomProgressBar;
